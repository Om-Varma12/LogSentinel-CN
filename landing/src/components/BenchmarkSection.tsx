import '../styles/design-system.css';

const stats = [
  { label: 'Efficiency', value: '75%', sublabel: 'Faster Triage' },
  { label: 'Precision', value: '99.8%', sublabel: 'Detection Accuracy' },
  { label: 'Velocity', value: '1.2s', sublabel: 'Avg Response Time' },
  { label: 'Security', value: '842', sublabel: 'Daily Blocks' },
];

export function BenchmarkSection() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-40">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
        {stats.map((stat, index) => (
          <div className="space-y-4 reveal" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
            <p className="font-tech text-[10px] tracking-widest uppercase opacity-40">{stat.label}</p>
            <h4 className="font-serif text-7xl tracking-tighter tabular-nums">{stat.value}</h4>
            <p className="text-xs text-emerald-500 font-tech tracking-widest uppercase">{stat.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
