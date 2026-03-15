import type { Incident } from "./types";
import RingProgress from "./RingProgress";
import Pill from "./Pill";

export default function IncidentCard({ incident, onClick }: { incident: Incident; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-soc-surface border border-soc-border rounded-[4px] flex items-center p-4 cursor-pointer hover:bg-[#1c1c1c] transition-colors group"
    >
      <div className="w-[3px] h-12 rounded-full mr-6" style={{ backgroundColor: incident.color }} />
      <div className="mr-6">
        <RingProgress score={incident.score} color={incident.color} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono-soc text-[11px] bg-[rgba(255,255,255,0.05)] px-1.5 py-0.5 rounded text-soc-text-dim">{incident.id}</span>
          <h3 className="font-body font-bold text-[17px] text-[rgba(255,255,255,0.9)]">{incident.title}</h3>
        </div>
        <div className="flex gap-4 font-mono-soc text-[11px] text-soc-text-dimmer">
          <span>{incident.ts}</span>
          <span>IP: {incident.parsed.IP}</span>
          <span>PATH: {incident.endpoint}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Pill level={incident.level} label={incident.mitre_id} type="mitre" />
          <Pill level={incident.level} label={incident.level} />
          <Pill level={incident.level} label={incident.action} type="action" />
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono-soc text-[10px] text-soc-text-dimmer group-hover:text-soc-text-dim transition-colors">
          VIEW DETAILS ›
        </div>
      </div>
    </div>
  );
}
