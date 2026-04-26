import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-10 flex justify-between items-center">
        <a href="#" id="brand-logo" className="font-serif text-2xl tracking-tighter">Log-Sentinel.</a>

        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" id="nav-features" className="nav-link font-tech text-[10px] tracking-[0.2em] uppercase">Features</a>
          <a href="#use-cases" id="nav-cases" className="nav-link font-tech text-[10px] tracking-[0.2em] uppercase">Use Cases</a>
          <a href="#pricing" id="nav-pricing" className="nav-link font-tech text-[10px] tracking-[0.2em] uppercase">Pricing</a>
          <a href="#docs" id="nav-docs" className="nav-link font-tech text-[10px] tracking-[0.2em] uppercase text-white/40">Documentation</a>
        </div>

        <a href="http://localhost:8080/" target="_blank" rel="noopener noreferrer" id="nav-cta" className="px-8 py-3 bg-emerald-500 text-black rounded-full font-tech text-[10px] font-bold tracking-[0.15em] uppercase pulse-glow transition-transform hover:scale-105 active:scale-95">Start Free Trial</a>
      </div>
    </nav>
  );
}
