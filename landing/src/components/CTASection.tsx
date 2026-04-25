import '../styles/design-system.css';

export function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-64 text-center z-10 relative">
      <div className="max-w-4xl mx-auto space-y-12 reveal">
        <h2 className="font-serif text-7xl lg:text-8xl tracking-tighter leading-[0.9] gradient-text-animate">
          The End of Silent <br /> Compromise.
        </h2>
        <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Secure your infrastructure with the intelligence it deserves. Join 2,000+ security teams monitoring with Log-Sentinel.
        </p>
        <button className="px-16 py-8 bg-white text-black rounded-full font-tech text-sm font-bold tracking-[0.3em] uppercase pulse-glow hover:bg-emerald-500 transition-colors duration-500 active:scale-95 group">
          Initialize Sentinel <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-2 transition-transform group-hover:translate-x-2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}
