import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { BenchmarkSection } from './components/BenchmarkSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { Atmosphere } from './components/Atmosphere';
import { SmoothScroll } from './components/SmoothScroll';
import { IntroductionPage, GettingStartedPage } from './pages/DocumentationPage';
import { TroubleshootingPage } from './pages/TroubleshootingPage';
import './styles/design-system.css';

function App() {
  const location = useLocation();
  const isDocPage = location.pathname.startsWith('/introduction') || location.pathname.startsWith('/getting-started') || location.pathname.startsWith('/deep-dive');

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

  useEffect(() => {
    const hash = location.hash.replace('#', '');

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen relative">
      <Atmosphere />
      {!isDocPage && <Navbar />}
      <Routes>
        <Route path="/introduction" element={<IntroductionPage />} />
        <Route path="/getting-started" element={<GettingStartedPage />} />
        <Route path="/deep-dive" element={<TroubleshootingPage />} />
        <Route
          path="/"
          element={
            <SmoothScroll>
              <main>
                <Hero />
                <FeaturesSection />
                <ProblemSection />
                <HowItWorksSection />
                <BenchmarkSection />
                <CTASection />
              </main>
              <Footer />
            </SmoothScroll>
          }
        />
      </Routes>
    </div>
  );
}

export default App;