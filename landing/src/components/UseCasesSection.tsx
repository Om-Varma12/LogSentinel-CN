import '../styles/design-system.css';

const useCases = [
  {
    title: 'Infrastructure Monitoring',
    description: 'Track CPU, memory, disk, and network metrics across all your servers. Get alerted before users notice.',
    icon: 'server',
  },
  {
    title: 'Application Performance',
    description: 'Trace requests across microservices. Identify bottlenecks with flame graphs and latency distributions.',
    icon: 'activity',
  },
  {
    title: 'Security Auditing',
    description: 'Maintain compliance with immutable audit logs. Search and analyze access patterns in real-time.',
    icon: 'shield',
  },
  {
    title: 'Business Analytics',
    description: 'Convert log events into business metrics. Track user signups, conversions, and revenue in real-time.',
    icon: 'chart',
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="section relative z-10">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-tech text-[10px] tracking-[0.3em] uppercase text-[var(--accent-emerald)] mb-4 reveal">
            Use Cases
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter mb-6 reveal">
            One Platform.
            <br />
            Infinite Possibilities.
          </h2>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="glass rounded-[2rem] p-8 reveal transition-all duration-500 hover:bg-white/[0.04]"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="w-12 h-12 bg-[var(--accent-emerald)]/10 rounded-2xl flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {useCase.icon === 'server' && <><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></>}
                    {useCase.icon === 'activity' && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>}
                    {useCase.icon === 'shield' && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                    {useCase.icon === 'chart' && <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>}
                  </svg>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-serif text-2xl mb-3">{useCase.title}</h3>
                  <p className="text-white/40 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
