import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TerminalLine } from "./types";
import { Circle } from "lucide-react";

const colorMap: Record<TerminalLine['style'], string> = {
  hi: "text-soc-text",
  lo: "text-soc-text-tertiary",
  err: "text-soc-red",
  warn: "text-soc-amber",
  ok: "text-soc-green",
};

export default function TerminalPanel({ lines }: { lines: TerminalLine[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [lines]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.21, 1.02, 0.73, 1] }}
      className="w-1/4 bg-soc-surface2 border border-soc-border rounded-xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-soc-border flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-soc-green text-soc-green" />
          <span className="font-display text-xs font-semibold tracking-wide text-soc-text-secondary">Stream</span>
        </div>
        <span className="text-[10px] text-soc-text-quaternary font-mono-soc">{lines.length} lines</span>
      </div>

      {/* Terminal content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono-soc text-xs leading-relaxed">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={`${line.text}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`${colorMap[line.style]} mb-1.5`}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block w-2 h-3.5 bg-soc-text-tertiary ml-1"
        />
        <div ref={endRef} className="h-0" />
      </div>
    </motion.div>
  );
}
