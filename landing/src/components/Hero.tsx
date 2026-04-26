import '../styles/design-system.css';

export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center pt-20 px-10 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center z-10">
        {/* Left Content */}
        <div className="space-y-10 reveal active">
          {/* Real-Time Badge */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-tech text-[10px] tracking-[0.3em] uppercase text-emerald-500">Real-Time Threat Triage</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-6xl lg:text-[88px] leading-[0.9] tracking-tighter">
            Threats Detected.<br />
            <span className="italic text-emerald-500 font-semibold">Explained.</span><br />
            Acted.
          </h1>

          {/* Subheadline */}
          <p className="max-w-lg text-white/50 text-xl font-light leading-relaxed">
            Transform security noise into confident decisions in seconds. AI-powered threat triage for teams that can't afford to miss anything.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-6">
            <a href="#demo" id="hero-primary" className="px-10 py-5 bg-white text-black rounded-full font-tech text-xs font-bold tracking-widest uppercase hover:bg-emerald-500 transition-colors duration-500 shadow-xl">Deploy Assistant</a>
            <a href="#playbook" id="hero-secondary" className="px-10 py-5 border border-white/20 text-white rounded-full font-tech text-xs font-bold tracking-widest uppercase hover:bg-white/5 transition-colors">View Playbook</a>
          </div>
        </div>

        {/* Floating UI Mockup */}
        <div className="relative flex items-center justify-center reveal active" style={{ transitionDelay: '0.3s' }}>
          <div className="relative w-full aspect-[4/3] max-w-lg">
            {/* Critical Threat Card */}
            <div className="absolute -top-10 -right-10 w-72 glass p-6 rounded-[2.5rem] shimmer-border z-30 floating">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-[9px] font-tech font-bold tracking-tighter rounded-full">CRITICAL THREAT</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <p className="font-serif text-lg mb-2">SQL Injection Pattern</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-emerald-500 animate-pulse"></div>
              </div>
            </div>

            {/* AI Explanation Card */}
            <div className="absolute -bottom-6 -left-12 w-80 glass p-8 rounded-[3rem] z-20 floating" style={{ animationDelay: '-2s' }}>
              <p className="font-tech text-[9px] tracking-[0.4em] uppercase opacity-40 mb-3">AI EXPLANATION</p>
              <p className="text-sm text-white/70 italic leading-relaxed">"Attacker is attempting to bypass auth via malformed queries at /v1/login. Immediate block recommended."</p>
            </div>

            {/* Main Shield Card */}
            <div className="w-full h-full glass rounded-[4rem] border-white/5 overflow-hidden flex items-center justify-center relative shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent"></div>
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500/20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <div className="absolute bottom-10 flex gap-4">
                <div className="w-12 h-1 gap-1 flex">
                  <div className="flex-1 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="flex-1 bg-emerald-500/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="flex-1 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
