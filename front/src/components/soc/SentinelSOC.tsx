import { useState } from "react";
import { useIncidentsStream } from "@/hooks/useIncidentsStream";
import IncidentCard from "./IncidentCard";
import IncidentDetail from "./IncidentDetail";
import TerminalPanel from "./TerminalPanel";

export default function SentinelSOC() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { incidents, terminal } = useIncidentsStream();

  const stats = {
    total: incidents.length,
    high: incidents.filter(i => i.level === 'HIGH').length,
    medium: incidents.filter(i => i.level === 'MEDIUM').length,
    low: incidents.filter(i => i.level === 'LOW').length,
  };

  const selectedIncident = incidents.find(i => i.id === selectedId);

  return (
    <div className="h-screen w-full flex flex-col p-4 gap-6 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-soc-border pb-4">
        <div>
          <h1 className="font-display text-[22px] font-black tracking-[3px] leading-none">SENTINEL SOC</h1>
          <p className="font-mono-soc text-[10px] text-soc-text-dim tracking-[4px] mt-1 uppercase">
            Security Operations Center // Real-Time Threat Monitor
          </p>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 border border-[rgba(255,255,255,0.15)] rounded-[4px]">
          <div className="w-2 h-2 rounded-full bg-soc-text animate-pulse-dot" />
          <span className="font-mono-soc text-[10px] tracking-widest text-[rgba(255,255,255,0.8)]">INGESTING LIVE</span>
        </div>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Main Content */}
        <div className="w-3/4 flex flex-col gap-6 overflow-hidden">
          {!selectedId ? (
            <>
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "TOTAL INCIDENTS", val: stats.total, color: "var(--soc-text)" },
                  { label: "HIGH SEVERITY", val: stats.high, color: "var(--soc-red)" },
                  { label: "MEDIUM SEVERITY", val: stats.medium, color: "var(--soc-amber)" },
                  { label: "LOW SEVERITY", val: stats.low, color: "var(--soc-green)" },
                ].map((s, i) => (
                  <div key={i} className="bg-soc-surface border border-soc-border rounded-[4px] p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent" />
                    <div className="font-mono-soc text-[9px] tracking-[3px] text-soc-text-dim mb-1">{s.label}</div>
                    <div className="font-display text-[26px] font-bold tabular-nums" style={{ color: s.color }}>
                      {String(s.val).padStart(3, '0')}
                    </div>
                  </div>
                ))}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
                {incidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} onClick={() => setSelectedId(inc.id)} />
                ))}
              </div>
            </>
          ) : selectedIncident ? (
            <IncidentDetail incident={selectedIncident} onBack={() => setSelectedId(null)} />
          ) : null}
        </div>

        {/* Terminal */}
        <TerminalPanel lines={terminal} />
      </div>
    </div>
  );
}
