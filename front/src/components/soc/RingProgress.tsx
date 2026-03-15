interface RingProgressProps {
  score: number;
  color: string;
  size?: number;
}

export default function RingProgress({ score, color, size = 60 }: RingProgressProps) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-[rgba(255,255,255,0.05)]" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="3" fill="transparent"
          strokeDasharray={circ}
          style={{ strokeDashoffset: offset, filter: `drop-shadow(0 0 4px ${color}88)`, transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span className="absolute font-display font-bold text-[12px] tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}
