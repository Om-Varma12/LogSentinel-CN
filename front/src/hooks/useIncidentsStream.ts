import { useEffect, useRef, useState } from "react";
import { createIncidentsSocket } from "@/lib/api";
import { transform } from "@/components/soc/transform";
import type { ApiIncident, Incident, TerminalLine } from "@/components/soc/types";

const MAX_INCIDENTS = 200;
const MAX_TERMINAL_LINES = 80;
const RECONNECT_DELAY_MS = 2000;

type WsMessage =
  | { type: "incident"; data: ApiIncident }
  | { type: "done" };

function toTerminalLines(inc: Incident): TerminalLine[] {
  const riskStyle: TerminalLine["style"] =
    inc.level === "HIGH" ? "err" : inc.level === "MEDIUM" ? "warn" : "ok";
  return [
    { text: `[IN]    Log ingested -> ${inc.id}`, style: "lo" as const },
    { text: `[PARSE] ${inc.parsed["Request Method"]} ${inc.endpoint} | ${inc.parsed["Status Code"]}`, style: "lo" as const },
    { text: `[RISK]  ${inc.score}/100 -> ${inc.level} THREAT`, style: riskStyle },
    { text: `[QUEUE] ${inc.id} - ${inc.title.slice(0, 35)}`, style: "hi" as const },
  ];
}

export function useIncidentsStream() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [terminal, setTerminal] = useState<TerminalLine[]>([]);

  // Monotonically increasing index across reconnects — keeps IDs consistent
  const indexRef = useRef(0);
  const doneRef = useRef(false);
  const waitingNotifiedRef = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function connect() {
      if (doneRef.current) return;

      const ws = createIncidentsSocket();
      socketRef.current = ws;

      ws.onopen = () => {
        waitingNotifiedRef.current = false;
      };

      ws.onmessage = (event: MessageEvent) => {
        const msg: WsMessage = JSON.parse(event.data as string);

        if (msg.type === "done") {
          doneRef.current = true;
          setTerminal((prev) =>
            [...prev, { text: "[SYSTEM] Pipeline complete - all logs processed", style: "ok" as const }]
              .slice(-MAX_TERMINAL_LINES),
          );
          return;
        }

        const inc = transform(msg.data, indexRef.current);
        indexRef.current += 1;

        setIncidents((prev) => [inc, ...prev].slice(0, MAX_INCIDENTS));
        setTerminal((prev) => [...prev, ...toTerminalLines(inc)].slice(-MAX_TERMINAL_LINES));
      };

      ws.onerror = () => { /* onclose will fire next and handle it */ };

      ws.onclose = () => {
        if (doneRef.current) return;

        if (!waitingNotifiedRef.current) {
          setTerminal((prev) =>
            [...prev, { text: "[SYSTEM] Waiting for pipeline server...", style: "lo" as const }]
              .slice(-MAX_TERMINAL_LINES),
          );
          waitingNotifiedRef.current = true;
        }

        // On reconnect backend replays from the beginning, so reset index and list
        reconnectTimerRef.current = setTimeout(() => {
          indexRef.current = 0;
          setIncidents([]);
          connect();
        }, RECONNECT_DELAY_MS);
      };
    }

    connect();

    return () => {
      doneRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null; // suppress reconnect on intentional close
        socketRef.current.close();
      }
    };
  }, []);

  return { incidents, terminal };
}
