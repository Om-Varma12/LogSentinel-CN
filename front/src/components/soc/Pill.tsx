interface PillProps {
  level: string;
  label: string;
  type?: 'severity' | 'mitre' | 'action';
}

const styles: Record<string, string> = {
  HIGH: "bg-[rgba(255,68,68,0.12)] text-soc-red-soft border-[rgba(255,68,68,0.25)]",
  MEDIUM: "bg-[rgba(255,170,0,0.12)] text-soc-amber-soft border-[rgba(255,170,0,0.25)]",
  LOW: "bg-[rgba(0,204,85,0.12)] text-soc-green-soft border-[rgba(0,204,85,0.25)]",
  MITRE: "bg-[rgba(80,150,255,0.12)] text-soc-blue-soft border-[rgba(80,150,255,0.25)]",
  ACTION: "bg-[rgba(255,255,255,0.05)] text-soc-text-dim border-[rgba(255,255,255,0.1)]",
};

export default function Pill({ level, label, type = 'severity' }: PillProps) {
  const style = type === 'mitre' ? styles.MITRE : type === 'action' ? styles.ACTION : styles[level] || styles.LOW;

  return (
    <div className={`px-2 py-0.5 rounded-[4px] border flex items-center gap-1.5 font-mono-soc text-[10px] tracking-wider uppercase ${style}`}>
      {type === 'severity' && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
      {label}
    </div>
  );
}
