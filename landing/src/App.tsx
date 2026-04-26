import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { BenchmarkSection } from './components/BenchmarkSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Atmosphere } from './components/Atmosphere';
import { GhostCursor } from './components/GhostCursor';
import { SmoothScroll } from './components/SmoothScroll';
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
      <SmoothScroll>
        <main>
          <Hero />
          <FeaturesSection />
          <ProblemSection />
          <HowItWorksSection />
          <BenchmarkSection />
          {/* <PricingSection /> */}
          <CTASection />
        </main>
        <Footer />
      </SmoothScroll>
      <GhostCursor
        color="#10b981"
        trailLength={8}
        inertia={0.2}
        brightness={0.25}
        bloomStrength={0.01}
        bloomRadius={0.05}
        bloomThreshold={0.95}
        grainIntensity={0.005}
        mixBlendMode="screen"
        edgeIntensity={0}
        fadeDelayMs={50}
        fadeDurationMs={400}
        zIndex={9999}
      />
    </div>
  );
}

export default App;
