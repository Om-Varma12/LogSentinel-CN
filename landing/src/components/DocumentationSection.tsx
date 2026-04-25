import '../styles/design-system.css';

export function DocumentationSection() {
  return (
    <section id="docs" className="section relative z-10">
      <div className="container">
        <div className="glass rounded-[3rem] p-12 md:p-16 text-center">
          <p className="font-tech text-[10px] tracking-[0.3em] uppercase text-[var(--accent-emerald)] mb-4 reveal">
            Documentation
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tighter mb-6 reveal">
            Learn the Ropes
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto mb-8 reveal leading-relaxed">
            Comprehensive guides, API references, and tutorials to help you get the most out of Log-Sentinel.
          </p>
          <a
            href="#docs"
            className="btn-secondary reveal"
          >
            Explore Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
