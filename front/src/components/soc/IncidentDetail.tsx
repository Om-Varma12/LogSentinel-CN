import { motion } from "framer-motion";
import type { Incident } from "./types";
import RingProgress from "./RingProgress";
import Pill from "./Pill";
import { ArrowLeft, Globe, MapPin, Hash, FileText, Activity, ListChecks, Shield, AlertTriangle, Ban, Search, Server, Clock } from "lucide-react";

interface IncidentDetailProps {
  incident: Incident;
  onBack: () => void;
}

const stepIcons: Record<string, typeof Shield> = {
  "block": Ban,
  "monitor": Search,
  "alert": AlertTriangle,
  "investigate": Search,
  "escalate": Server,
  "default": ListChecks,
};

function getStepIcon(step: string) {
  const lower = step.toLowerCase();
  for (const [key, icon] of Object.entries(stepIcons)) {
    if (lower.includes(key)) return icon;
  }
  return stepIcons["default"];
}

export default function IncidentDetail({ incident, onBack }: IncidentDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto pr-2 space-y-5"
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 text-sm text-soc-text-tertiary hover:text-soc-text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Monitor
      </motion.button>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
        className="bg-soc-surface border border-soc-border rounded-xl p-6"
      >
        <div className="flex gap-6 mb-6">
          <RingProgress score={incident.score} color={incident.color} size={72} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono-soc text-sm text-soc-text-tertiary">{incident.id}</span>
              <span className="text-soc-text-tertiary">·</span>
              <span className="text-sm text-soc-text-tertiary">{incident.ts}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-soc-text mb-4">{incident.title}</h2>
            <div className="flex gap-2 flex-wrap">
              <Pill level={incident.level} label={incident.mitre_id} type="mitre" />
              <Pill level={incident.level} label={incident.mitre_name} type="mitre" />
              <Pill level={incident.level} label={incident.action} type="action" />
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-3 gap-y-5 gap-x-8 border-t border-soc-border pt-6"
        >
          {[
            { icon: Globe, label: "SOURCE IP", value: incident.parsed.IP },
            { icon: Hash, label: "METHOD", value: incident.parsed["Request Method"] },
            { icon: MapPin, label: "ENDPOINT", value: incident.endpoint },
            { icon: Activity, label: "STATUS CODE", value: incident.parsed["Status Code"] },
            { icon: FileText, label: "RESP SIZE", value: `${incident.parsed["Response Size"]} bytes` },
            { icon: Activity, label: "RISK SCORE", value: incident.score, color: incident.color },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05, duration: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-3.5 h-3.5 text-soc-text-quaternary" />
                <div className="font-mono-soc text-[10px] text-soc-text-quaternary tracking-wider uppercase">{item.label}</div>
              </div>
              <div
                className="font-display text-sm font-semibold"
                style={{ color: item.color || undefined }}
              >
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Raw log */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
        className="bg-soc-surface2 rounded-xl p-4 border border-soc-border"
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-soc-text-tertiary" />
          <div className="font-mono-soc text-xs text-soc-text-tertiary tracking-wider uppercase">Raw Log</div>
        </div>
        <pre className="font-mono-soc text-xs text-soc-text-secondary leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {incident.raw}
        </pre>
      </motion.div>

      {/* Threat analysis */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
        className="bg-soc-surface border border-soc-border rounded-xl p-5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${incident.color}15` }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: incident.color }} />
          </div>
          <div className="font-display text-sm font-semibold tracking-wide text-soc-text">
            Threat Analysis
          </div>
        </div>
        <p className="text-sm text-soc-text-secondary leading-relaxed pl-[2.25rem]">{incident.analysis}</p>
      </motion.div>

      {/* Response Playbook - redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
        className="bg-soc-surface border border-soc-border rounded-xl p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-soc-blue-muted flex items-center justify-center">
            <ListChecks className="w-4 h-4 text-soc-blue" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold tracking-wide text-soc-text">Response Playbook</div>
            <div className="text-xs text-soc-text-quaternary">{incident.playbook.length} steps</div>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-soc-border" />

          <div className="space-y-4">
            {incident.playbook.map((step, i) => {
              const Icon = getStepIcon(step);
              const isLast = i === incident.playbook.length - 1;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
                  className="flex items-start gap-4 pl-1 relative"
                >
                  {/* Step number circle */}
                  <div className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${isLast
                      ? "bg-soc-blue text-white"
                      : "bg-soc-surface3 border border-soc-border text-soc-text-secondary"
                    }
                  `}>
                    {isLast ? (
                      <Shield className="w-4 h-4" />
                    ) : (
                      <span className="font-mono-soc text-xs font-medium">{i + 1}</span>
                    )}
                  </div>

                  {/* Step content */}
                  <div className={`
                    flex-1 rounded-lg p-4
                    ${isLast
                      ? "bg-soc-blue-muted/50 border border-soc-blue-border"
                      : "bg-soc-surface2/50 border border-soc-border"
                    }
                  `}>
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isLast ? "text-soc-blue" : "text-soc-text-tertiary"}`} />
                      <div>
                        <div className="text-xs font-medium text-soc-text-quaternary uppercase tracking-wider mb-1">
                          Step {i + 1}
                        </div>
                        <div className="text-sm text-soc-text-secondary leading-relaxed">{step}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
