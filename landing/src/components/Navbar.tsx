import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<'features' | 'use-cases' | 'docs'>('features');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('docs');
      return;
    }

    const sectionIds = ['features', 'use-cases'] as const;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry?.target instanceof HTMLElement) {
          setActiveSection(visibleEntry.target.id as 'features' | 'use-cases');
        }
      },
      { threshold: 0.1, rootMargin: '-12% 0px -60% 0px' }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const linkClass = (isActive: boolean) =>
    `nav-link font-tech text-[10px] tracking-[0.2em] uppercase rounded-full px-3 py-2 transition-all ${
      isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-10 flex justify-between items-center">
        <Link to="/" id="brand-logo" className="font-serif text-2xl tracking-tighter">Log-Sentinel.</Link>

        <div className="hidden lg:flex items-center gap-10">
          <Link to="/#features" id="nav-features" className={linkClass(activeSection === 'features')}>
            Features
          </Link>
          <Link to="/#use-cases" id="nav-cases" className={linkClass(activeSection === 'use-cases')}>
            Use Cases
          </Link>
          <Link to="/introduction" id="nav-docs" className={linkClass(activeSection === 'docs')}>
            Documentation
          </Link>
        </div>

        <a href="https://log-sentinel-cn-frontend.vercel.app/" target="_blank" rel="noopener noreferrer" id="nav-cta" className="px-8 py-3 bg-emerald-500 text-black rounded-full font-tech text-[10px] font-bold tracking-[0.15em] uppercase pulse-glow transition-transform hover:scale-105 active:scale-95">Start Free Trial</a>
      </div>
    </nav>
  );
}