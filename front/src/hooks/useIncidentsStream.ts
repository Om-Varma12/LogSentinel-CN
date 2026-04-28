import { useEffect, useState } from "react";
import { createIncidentsSocket } from "@/lib/api";
import { transform } from "@/components/soc/transform";
import type { ApiIncident, Incident, TerminalLine } from "@/components/soc/types";

const MAX_INCIDENTS = 200;
const MAX_TERMINAL_LINES = 80;
const RECONNECT_DELAY_MS = 2000;

type WsMessage =
  | { type: "incident"; data: ApiIncident }
  | { type: "done" };

type ControlMessage =
  | { type: "activate" };

type StreamSnapshot = {
  incidents: Incident[];
  terminal: TerminalLine[];
};

type StreamStore = StreamSnapshot & {
  listeners: Set<() => void>;
  socket: WebSocket | null;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  index: number;
  done: boolean;
  waitingNotified: boolean;
  activated: boolean;
};

const streamStore: StreamStore = {
  incidents: [],
  terminal: [],
  listeners: new Set(),
  socket: null,
  reconnectTimer: null,
  index: 0,
  done: false,
  waitingNotified: false,
  activated: false,
};

function emitStreamUpdate() {
  streamStore.listeners.forEach((listener) => listener());
}

function setIncidents(next: Incident[]) {
  streamStore.incidents = next;
  emitStreamUpdate();
}

function setTerminal(next: TerminalLine[]) {
  streamStore.terminal = next;
  emitStreamUpdate();
}

function appendTerminalLine(line: TerminalLine) {
  setTerminal([...streamStore.terminal, line].slice(-MAX_TERMINAL_LINES));
}

function connectStream() {
  if (streamStore.done) return;

  const socketState = streamStore.socket?.readyState;
  if (socketState === WebSocket.OPEN || socketState === WebSocket.CONNECTING) {
    return;
  }

  if (streamStore.reconnectTimer) {
    clearTimeout(streamStore.reconnectTimer);
    streamStore.reconnectTimer = null;
  }

  const ws = createIncidentsSocket();
  streamStore.socket = ws;

  ws.onopen = () => {
    streamStore.waitingNotified = false;
    if (!streamStore.activated) {
      ws.send(JSON.stringify({ type: "activate" }));
      streamStore.activated = true;
    }
  };

  ws.onmessage = (event: MessageEvent) => {
    const msg: WsMessage = JSON.parse(event.data as string);

    if (msg.type === "done") {
      streamStore.done = true;
      appendTerminalLine({ text: "[SYSTEM] Pipeline complete - all logs processed", style: "ok" as const });
      return;
    }

    const inc = transform(msg.data, streamStore.index);
    streamStore.index += 1;

    setIncidents([inc, ...streamStore.incidents].slice(0, MAX_INCIDENTS));
    setTerminal([...streamStore.terminal, ...toTerminalLines(inc)].slice(-MAX_TERMINAL_LINES));
  };

  ws.onerror = () => { /* onclose will fire next and handle it */ };

  ws.onclose = () => {
    if (streamStore.done) return;

    if (!streamStore.waitingNotified) {
      appendTerminalLine({ text: "[SYSTEM] Waiting for pipeline server...", style: "lo" as const });
      streamStore.waitingNotified = true;
    }

    streamStore.reconnectTimer = setTimeout(() => {
      streamStore.index = 0;
      streamStore.activated = false;
      setIncidents([]);
      connectStream();
    }, RECONNECT_DELAY_MS);
  };
}

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
  const [snapshot, setSnapshot] = useState<StreamSnapshot>({
    incidents: streamStore.incidents,
    terminal: streamStore.terminal,
  });

  useEffect(() => {
    const listener = () => {
      setSnapshot({
        incidents: streamStore.incidents,
        terminal: streamStore.terminal,
      });
    };

    streamStore.listeners.add(listener);
    connectStream();
    listener();

    return () => {
      streamStore.listeners.delete(listener);
    };
  }, []);

  return snapshot;
}
