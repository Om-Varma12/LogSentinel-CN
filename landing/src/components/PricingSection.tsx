import '../styles/design-system.css';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    features: ['Up to 50k logs/day', 'Basic AI summaries', 'Community Support'],
    cta: 'Deploy Core',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$490',
    period: '/mo',
    features: ['Unlimited Log Ingestion', 'Advanced Context Engine', 'Automated Response Sync', '24/7 Direct Sentinel Access'],
    cta: 'Elevate Presence',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['On-premise Deployment', 'Custom Model Training', 'SLA Guaranteed Uptime'],
    cta: 'Contact Logic',
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-10 py-40">
      <div className="mb-24 text-center reveal">
        <h2 className="font-serif text-6xl tracking-tighter">Access Tiers</h2>
        <p className="text-white/40 mt-6">Scalable intelligence for systems of any magnitude.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`glass rounded-[3rem] p-12 flex flex-col reveal ${tier.featured ? 'shimmer-border shadow-[0_0_50px_rgba(16,185,129,0.1)]' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {tier.featured && (
              <div className="flex justify-between items-start mb-10">
                <p className="font-tech text-[10px] tracking-[0.4em] uppercase text-emerald-500">Professional</p>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-tech font-bold rounded-full">MOST POPULAR</span>
              </div>
            )}

            {!tier.featured && (
              <p className="font-tech text-[10px] tracking-[0.4em] uppercase opacity-40 mb-10">{tier.name}</p>
            )}

            <h4 className={`font-serif text-5xl mb-6 ${tier.featured ? '' : 'text-white/90'}`}>
              {tier.price}<span className="text-lg opacity-30">{tier.period}</span>
            </h4>

            <ul className="space-y-4 mb-12 flex-grow">
              {tier.features.map((feature, i) => (
                <li key={i} className={`text-sm ${tier.featured ? '' : 'text-white/50'}`}>{feature}</li>
              ))}
            </ul>

          </div>
        ))}
      </div>
    </section>
  );
}
