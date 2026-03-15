import type { Incident } from "./types";
import RingProgress from "./RingProgress";
import Pill from "./Pill";

export default function IncidentDetail({ incident, onBack }: { incident: Incident; onBack: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
      <button onClick={onBack} className="font-mono-soc text-[11px] text-soc-text-dim hover:text-soc-text mb-2 transition-colors">
        ‹ BACK TO MONITOR
      </button>

      <div className="bg-soc-surface border border-soc-border rounded-[4px] p-6">
        <div className="flex gap-6 mb-8">
          <RingProgress score={incident.score} color={incident.color} size={72} />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono-soc text-[12px] text-soc-text-dim">{incident.id} // {incident.ts}</span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-4">{incident.title}</h2>
            <div className="flex gap-2">
              <Pill level={incident.level} label={incident.mitre_id} type="mitre" />
              <Pill level={incident.level} label={incident.mitre_name} type="mitre" />
              <Pill level={incident.level} label={incident.action} type="action" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-12 border-t border-soc-border pt-6">
          {[
            { l: "SOURCE IP", v: incident.parsed.IP },
            { l: "METHOD", v: incident.parsed["Request Method"] },
            { l: "ENDPOINT", v: incident.endpoint },
            { l: "STATUS CODE", v: incident.parsed["Status Code"] },
            { l: "RESP SIZE", v: `${incident.parsed["Response Size"]} bytes` },
            { l: "RISK SCORE", v: incident.score, color: incident.color },
          ].map((item, i) => (
            <div key={i}>
              <div className="font-mono-soc text-[10px] text-soc-text-dimmer tracking-widest mb-1">{item.l}</div>
              <div className="font-display text-[14px] font-medium" style={{ color: item.color || undefined }}>{item.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-soc-surface2 rounded-[4px] p-4 border border-soc-border">
        <div className="font-mono-soc text-[10px] text-soc-text-dimmer mb-3 tracking-[2px]">RAW LOG</div>
        <pre className="font-mono-soc text-[12px] text-soc-text-dim leading-relaxed overflow-x-auto">{incident.raw}</pre>
      </div>

      <div className="relative pl-6 border-l-2" style={{ borderColor: incident.color }}>
        <div className="font-display text-[10px] font-bold tracking-[5px] text-soc-text-dimmer mb-4 flex items-center gap-4">
          // THREAT_ANALYSIS <div className="h-[1px] flex-1 bg-soc-border" />
        </div>
        <p className="text-[rgba(255,255,255,0.8)] leading-relaxed text-[15px]">{incident.analysis}</p>
      </div>

      <div className="relative pl-6 border-l-2 border-soc-blue">
        <div className="font-display text-[10px] font-bold tracking-[5px] text-[rgba(80,150,255,0.4)] mb-4 flex items-center gap-4">
          // RESPONSE_PLAYBOOK <div className="h-[1px] flex-1 bg-soc-border" />
        </div>
        <div className="space-y-4">
          {incident.playbook.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded border border-[rgba(80,150,255,0.3)] flex items-center justify-center font-display text-[10px] text-soc-blue shrink-0 mt-0.5">
                {i + 1}
              </div>
              <span className="text-[rgba(255,255,255,0.7)] text-[14px]">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
