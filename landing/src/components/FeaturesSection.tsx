import { FeatureCard } from './FeatureCard';
import '../styles/design-system.css';

const features = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-emerald-400"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Real-Time Detection',
    description: 'Stop hunting through logs. Our engine processes millions of events per second to surface the 0.1% that truly matter.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-emerald-400"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    title: 'Plain Language',
    description: 'Get a human-readable summary of every threat. No more decoding raw hex strings or ambiguous regex matches.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-3xl text-emerald-400"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
    title: 'Response Logic',
    description: 'Every alert comes with a validated response playbook. Know exactly what to do, who to notify, and how to block.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-10 py-40">
      <div className="mb-24 text-center reveal">
        <p className="font-tech text-[10px] tracking-[0.5em] uppercase text-emerald-500 mb-6">Core Capabilities</p>
        <h2 className="font-serif text-5xl lg:text-7xl tracking-tighter">Precision Intelligence</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
