import { useEffect, useRef } from "react";
import type { TerminalLine } from "./types";

const colorMap: Record<TerminalLine['style'], string> = {
  hi: "text-soc-text",
  lo: "text-soc-text-dim",
  err: "text-soc-red-soft",
  warn: "text-soc-amber-soft",
  ok: "text-soc-green-soft",
};

export default function TerminalPanel({ lines }: { lines: TerminalLine[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="w-1/4 bg-soc-surface2 border border-soc-border rounded-[4px] flex flex-col overflow-hidden">
      <div className="p-3 border-b border-soc-border flex justify-between items-center">
        <span className="font-display text-[10px] font-bold tracking-[2px] text-soc-text-dim">SENTINEL:// STREAM</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-soc-green" />
          <span className="font-mono-soc text-[9px] text-soc-green">LIVE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono-soc text-[12px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={`${colorMap[line.style]} mb-1`}>{line.text}</div>
        ))}
        <div className="inline-block w-2 h-4 bg-[rgba(255,255,255,0.6)] ml-1 translate-y-1 animate-terminal-cursor" />
        <div ref={endRef} />
      </div>
    </div>
  );
}
