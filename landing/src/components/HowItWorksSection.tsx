import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/design-system.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: 'Logs enter',
    titleItalic: 'system.',
    description: 'Real-time ingestion of raw telemetry from distributed edge nodes and cloud infrastructure. Captured at the source with zero latency.',
    showNode: true,
  },
  {
    title: 'Structural',
    titleItalic: 'parsing.',
    description: 'Converting unformatted strings into semantic JSON objects. Automatic schema mapping and field extraction for deep analysis.',
    showNode: true,
  },
  {
    title: 'Risk',
    titleItalic: 'quantification.',
    description: 'Heuristic evaluation of each packet. Every event is scored based on anomaly detection and historical threat intelligence.',
    showNode: false,
  },
  {
    title: 'Semantic',
    titleItalic: 'summary.',
    description: 'LLM-driven synthesis of complex logs into natural language narratives. Understand the story behind the data instantly.',
    showNode: true,
  },
  {
    title: 'Response',
    titleItalic: 'orchestrated.',
    description: 'Dynamic generation of mitigation playbooks. Automated defense steps tailored specifically to the context of the ingested log.',
    showNode: true,
    showCTA: true,
  },
  {
    title: 'Dashboard',
    titleItalic: 'live.',
    description: 'Real-time threat visibility and automated response orchestration now active across your infrastructure.',
    showNode: true,
    isFinal: true,
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const progressLabel = progressRef.current;
    const container = containerRef.current;

    if (!section || !line || !progressLabel || !container) return;

    const ctx = gsap.context(() => {
      // Animate the vertical line on scroll - only within this section
      gsap.fromTo(
        line,
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
          },
        }
      );

      // Animate progress counter
      ScrollTrigger.create({
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 100);
          progressLabel.innerText = progress.toString().padStart(2, '0');
        },
      });

      // Animate each step card
      gsap.utils.toArray('.how-step').forEach((step: any) => {
        gsap.fromTo(
          step,
          { opacity: 0.2, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 60%',
              end: 'top 30%',
              scrub: false,
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#050505] py-40">
      <div className="max-w-7xl mx-auto px-10">
        {/* Introduction */}
        <div className="h-screen flex items-center justify-center">
          <div className="max-w-4xl w-full text-center how-step">
            <p className="font-tech text-[10px] tracking-[0.4em] uppercase text-emerald-500 mb-6">How it works</p>
            <h1 className="font-serif text-6xl md:text-8xl mb-8 leading-[0.9] tracking-tighter">
              Transform logs into<br />
              <span className="text-emerald-500 italic font-medium">intelligence.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed">
              Follow the journey of how raw security events are processed, analyzed, and converted into actionable threat intelligence in real time.
            </p>
          </div>
        </div>

        {/* Journey Steps Container */}
        <div ref={containerRef} className="relative">
          {/* Vertical Line - inside this section only */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-full z-10 pointer-events-none hidden md:block">
            <svg className="w-4 h-full overflow-visible" viewBox="0 0 16 1000" preserveAspectRatio="none">
              <line x1="8" y1="0" x2="8" y2="1000" stroke="#1f1f1f" strokeWidth="2" />
              <path
                ref={lineRef}
                d="M 8 0 L 8 1000"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
              />
            </svg>
          </div>

          {/* Journey Steps */}
          {steps.map((step, index) => (
            <div key={index} className="h-screen flex items-center justify-center">
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
                {index % 2 === 0 ? (
                  <>
                    <div className="md:text-right pr-12 how-step">
                      <h2 className="font-serif text-5xl md:text-7xl mb-4 leading-tight">
                        {step.title}<br />
                        <span className="text-emerald-500 italic">{step.titleItalic}</span>
                      </h2>
                      <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                      {step.showCTA && (
                        <button className="mt-8 px-8 py-3 bg-emerald-500 text-black font-bold uppercase tracking-tighter hover:bg-emerald-400 transition-all">
                          View Live Protocol
                        </button>
                      )}
                    </div>
                    <div className="hidden md:block" />
                  </>
                ) : (
                  <>
                    <div className="hidden md:block" />
                    <div className="pl-12 how-step">
                      {step.isFinal ? (
                        <div className="flex flex-col items-start">
                          <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150 animate-pulse" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 relative z-10"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                          </div>
                          <h2 className="font-serif text-5xl md:text-7xl mb-4 leading-tight">
                            {step.title}<br />
                            <span className="text-emerald-500 italic font-bold">{step.titleItalic}</span>
                          </h2>
                          <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                          <button className="mt-10 px-10 py-4 bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            Access Dashboard
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className="font-serif text-5xl md:text-7xl mb-4 leading-tight">
                            {step.title}<br />
                            <span className="text-emerald-500 italic">{step.titleItalic}</span>
                          </h2>
                          <p className="text-gray-400 text-lg leading-relaxed">{step.description}</p>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
              {step.showNode && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 hidden md:block">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full" style={{ boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.4)' }} />
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              )}
              {step.isFinal && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-30 hidden md:block">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full" style={{ boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.4)' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Counter */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <div className="flex items-end gap-2">
          <span ref={progressRef} className="text-6xl font-black tracking-tighter text-white">00</span>
          <span className="text-emerald-500 text-xl font-bold pb-2">%</span>
        </div>
      </div>
    </section>
  );
}
