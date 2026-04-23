import { motion } from "framer-motion";
import type { Incident } from "./types";

interface PillProps {
  level: string;
  label: string;
  type?: 'severity' | 'mitre' | 'action';
}

const styles: Record<string, { bg: string; text: string; border: string }> = {
  HIGH: { bg: "bg-soc-red-muted", text: "text-soc-red", border: "border-soc-red-border" },
  MEDIUM: { bg: "bg-soc-amber-muted", text: "text-soc-amber", border: "border-soc-amber-border" },
  LOW: { bg: "bg-soc-green-muted", text: "text-soc-green", border: "border-soc-green-border" },
  MITRE: { bg: "bg-soc-blue-muted", text: "text-soc-blue", border: "border-soc-blue-border" },
  ACTION: { bg: "bg-soc-surface3", text: "text-soc-text-secondary", border: "border-soc-border" },
};

export default function Pill({ level, label, type = 'severity' }: PillProps) {
  const style = type === 'mitre' ? styles.MITRE : type === 'action' ? styles.ACTION : styles[level] || styles.LOW;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-mono-soc text-[11px] tracking-wide ${style.bg} ${style.text} ${style.border}`}
    >
      {type === 'severity' && (
        <div className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`} />
      )}
      {label}
    </motion.div>
  );
}
