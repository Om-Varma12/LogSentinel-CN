import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { ProblemSection } from './components/ProblemSection';
import { BenchmarkSection } from './components/BenchmarkSection';
import { PricingSection } from './components/PricingSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Atmosphere } from './components/Atmosphere';
import './styles/design-system.css';

function App() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative">
      <Atmosphere />
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <ProblemSection />
        <BenchmarkSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
