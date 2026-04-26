import '../styles/design-system.css';

export function ProblemSection() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-40 border-y border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
        {/* Left: The Dilemma */}
        <div className="space-y-12 reveal">
          <h2 className="font-serif text-5xl tracking-tighter">The Modern SOC Dilemma</h2>
          <div className="space-y-10">
            <div className="space-y-2">
              <p className="font-tech text-[10px] tracking-widest uppercase opacity-40">The Burden</p>
              <p className="text-white/70 text-lg font-light">Analysts spend 70% of their time filtering harmless noise, leading to critical alert fatigue.</p>
            </div>
            <div className="space-y-2">
              <p className="font-tech text-[10px] tracking-widest uppercase opacity-40">The Delay</p>
              <p className="text-white/70 text-lg font-light">Average detection-to-response time is still measured in hours, not minutes.</p>
            </div>
          </div>
        </div>

        {/* Right: The Edge */}
        <div className="glass rounded-[3rem] p-12 reveal shadow-2xl">
          <h2 className="font-serif text-5xl tracking-tighter mb-12 italic text-emerald-400">The Log-Sentinel Edge</h2>
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 text-2xl mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <p className="text-white/80">Automated triage reduces manual review by 85%</p>
            </li>
            <li className="flex gap-4 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 text-2xl mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <p className="text-white/80">Context-aware summaries for instant understanding</p>
            </li>
            <li className="flex gap-4 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 text-2xl mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <p className="text-white/80">Zero-delay response playbooks for every event</p>
            </li>
            <li className="flex gap-4 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 text-2xl mt-1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <p className="text-white/80">Enterprise-grade encryption with zero-knowledge logs</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
