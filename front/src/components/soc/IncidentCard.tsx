import { motion } from "framer-motion";
import type { Incident } from "./types";
import RingProgress from "./RingProgress";
import Pill from "./Pill";
import { ArrowRight, Clock, MapPin, Globe } from "lucide-react";

interface IncidentCardProps {
  incident: Incident;
  onClick: () => void;
}

export default function IncidentCard({ incident, onClick }: IncidentCardProps) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.21, 1.02, 0.73, 1] }}
      className="bg-soc-surface border border-soc-border rounded-xl flex items-center p-4 cursor-pointer group"
    >
      {/* Severity indicator bar */}
      <motion.div
        className="w-1 h-14 rounded-full mr-5 shrink-0"
        style={{ backgroundColor: incident.color }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
      />

      {/* Ring progress */}
      <div className="mr-5 shrink-0">
        <RingProgress score={incident.score} color={incident.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono-soc text-xs bg-soc-surface3 px-2 py-1 rounded-md text-soc-text-tertiary">
            {incident.id}
          </span>
          <h3 className="font-display text-base font-semibold text-soc-text truncate">
            {incident.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs text-soc-text-tertiary">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono-soc">{incident.ts}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span className="font-mono-soc">IP: {incident.parsed.IP}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="font-mono-soc truncate">{incident.endpoint}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Pill level={incident.level} label={incident.mitre_id} type="mitre" />
          <Pill level={incident.level} label={incident.level} />
          <Pill level={incident.level} label={incident.action} type="action" />
        </div>
      </div>

      {/* View details */}
      <div className="ml-4 shrink-0 text-soc-text-tertiary group-hover:text-soc-text-secondary transition-colors duration-200">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="hidden sm:inline">Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
