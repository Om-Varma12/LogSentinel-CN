import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import workflowImage from '../assets/workflow.png';
import '../styles/design-system.css';

const sections = {
  Introduction: [
    { id: 'welcome', label: 'Welcome' },
    { id: 'architecture', label: 'System Architecture' },
    { id: 'workflow', label: 'Workflow Protocol' },
  ],
  'Getting Started': [
    { id: 'installation', label: 'Installation' },
    { id: 'configuration', label: 'Agent Config' },
    { id: 'api', label: 'API Reference' },
  ],
  'Deep Dive': [
    { id: 'features', label: 'Core Features' },
    { id: 'mitre', label: 'MITRE Mapping' },
    { id: 'deployment', label: 'Deployment' },
  ],
  Operations: [
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'security', label: 'Audit Logs' },
  ],
};

type SidebarProps = {
  activeItem?: string;
};

const itemTargets: Record<string, string> = {
  welcome: '/introduction#welcome',
  architecture: '/introduction#architecture',
  workflow: '/introduction#workflow',
  installation: '/getting-started#installation',
  configuration: '/getting-started#configuration',
  api: '/getting-started#api',
  features: '/deep-dive#features',
  mitre: '/deep-dive#mitre',
  deployment: '/deep-dive#deployment',
  troubleshooting: '/deep-dive#troubleshooting',
  security: '/deep-dive#security',
};

const pageSectionIds: Record<string, string[]> = {
  '/introduction': ['welcome', 'architecture', 'workflow'],
  '/getting-started': ['installation', 'configuration', 'api'],
};

export function DocumentationSidebar({ activeItem = 'welcome' }: SidebarProps) {
  const [active, setActive] = useState(activeItem);
  const location = useLocation();

  useEffect(() => {
    const ids = pageSectionIds[location.pathname] ?? [];

    if (!ids.length) {
      setActive(location.hash.replace('#', '') || activeItem);
      return;
    }

    const hashValue = location.hash.replace('#', '');
    const initialActive = ids.includes(hashValue) ? hashValue : ids[0];
    setActive(initialActive || activeItem);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof HTMLElement) {
          setActive(visible.target.id);
        }
      },
      { threshold: 0.4, rootMargin: '-18% 0px -55% 0px' }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [activeItem, location.pathname, location.hash]);

  return (
    <aside className="fixed top-0 left-0 w-80 h-screen bg-white/[0.02] backdrop-blur-xl border-r border-white/5 z-50 flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon icon="lucide:shield-check" className="text-2xl text-emerald-500" />
          <span className="font-serif text-xl tracking-tighter">Log-Sentinel Docs</span>
        </div>
      </div>

      <nav className="flex-grow overflow-y-auto px-6 py-6 custom-scrollbar">
        <div className="space-y-8">
          {Object.entries(sections).map(([sectionName, items]) => (
            <div key={sectionName}>
              <p className={`font-tech text-[9px] tracking-widest uppercase mb-4 px-2 ${
                sectionName === 'Introduction' ? 'text-emerald-500/60' : 'text-white/20'
              }`}>
                {sectionName}
              </p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={itemTargets[item.id]}
                      onClick={() => setActive(item.id)}
                      className={`block px-3 py-2 rounded-lg transition-colors text-sm ${
                        active === item.id
                          ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-8 border-t border-white/5">
        <button
          onClick={() => window.open('mailto:support@logsentinel.io', '_blank')}
          className="w-full py-3 rounded-xl bg-white/[0.02] backdrop-blur-xl border border-white/10 text-[10px] font-tech uppercase tracking-widest text-white/60 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
        >
          Support Terminal
        </button>
      </div>
    </aside>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = ref.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

function DocContent({ children }: { children: React.ReactNode }) {
  const contentRef = useReveal();

  useEffect(() => {
    const cards = contentRef.current?.querySelectorAll('.spotlight-card');
    if (!cards) return;

    const handleMouseMove = (e: MouseEvent) => {
      cards.forEach((card) => {
        const target = card as HTMLElement;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [contentRef]);

  return (
    <div ref={contentRef} className="min-h-screen bg-[#050505]">
      <DocumentationSidebar />
      <div className="ml-80 max-w-5xl mx-auto px-12 py-20">
        {children}
      </div>
    </div>
  );
}

export function IntroductionPage() {
  return (
    <DocContent>
      {/* Section: Welcome */}
      <section id="welcome" className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 reveal">
        <div className="lg:col-span-7">
          <p className="font-tech text-[10px] tracking-[0.5em] uppercase text-emerald-500 mb-6">Overview</p>
          <h1 className="font-serif text-6xl md:text-7xl leading-[0.9] tracking-tighter mb-8 italic">
            Welcome to <br/>Log-Sentinel.
          </h1>
          <p className="text-white/50 text-xl font-light leading-relaxed">
            The ultimate neural telemetry framework. Log-Sentinel isn't just a monitor; it's an autonomous defense layer that understands your infrastructure's heartbeat and protects it in real-time.
          </p>
          <div className="mt-12 flex gap-4">
            <div className="px-6 py-4 rounded-2xl glass border-emerald-500/20">
              <div className="font-serif text-3xl text-emerald-400 mb-1">0.4ms</div>
              <div className="text-[10px] font-tech uppercase tracking-widest opacity-40">Mean Response Time</div>
            </div>
            <div className="px-6 py-4 rounded-2xl glass">
              <div className="font-serif text-3xl mb-1">2.4k</div>
              <div className="text-[10px] font-tech uppercase tracking-widest opacity-40">Threat Models</div>
            </div>
          </div>
        </div>

        {/* Video Embed Block */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8">
            <div className="shimmer-border spotlight-card glass rounded-[2rem] overflow-hidden aspect-video flex flex-col items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              <Icon icon="lucide:play" className="text-5xl text-emerald-500/60 group-hover:scale-110 transition-transform duration-500 z-10" />
              <p className="mt-4 font-tech text-[10px] tracking-[0.2em] uppercase text-white/40 z-10">Video: System Walkthrough</p>
              <div className="absolute bottom-4 right-4 text-[9px] font-tech text-white/20 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
                Embed [16:9]
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] font-tech uppercase tracking-widest text-white/20">
              Dynamic Dashboard Simulation v2.4
            </p>
          </div>
        </div>
      </section>

      {/* Section: System Architecture */}
      <section id="architecture" className="mb-32 reveal">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-serif text-4xl tracking-tight">System Architecture</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>

        <div className="glass rounded-[2rem] p-12 mb-12 spotlight-card">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center mb-4">
                <Icon icon="lucide:arrow-down-to-dot" className="text-3xl text-emerald-400" />
              </div>
              <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold">Log Ingress</p>
            </div>
            <Icon icon="lucide:chevron-right" className="hidden md:block text-white/10 text-2xl" />

            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 mx-auto flex items-center justify-center mb-4">
                <Icon icon="lucide:cpu" className="text-3xl text-blue-400" />
              </div>
              <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold">Neural Parsing</p>
            </div>
            <Icon icon="lucide:chevron-right" className="hidden md:block text-white/10 text-2xl" />

            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 mx-auto flex items-center justify-center mb-4">
                <Icon icon="lucide:shield-alert" className="text-3xl text-orange-400" />
              </div>
              <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-orange-400 font-bold">Risk Analysis</p>
            </div>
            <Icon icon="lucide:chevron-right" className="hidden md:block text-white/10 text-2xl" />

            <div className="text-center flex-1">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center mb-4">
                <Icon icon="lucide:play-circle" className="text-3xl text-purple-400" />
              </div>
              <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-purple-400 font-bold">Response</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl">
          <p className="text-white/60 leading-relaxed text-lg font-light">
            Our architecture is designed for the high-vacuum environment of modern cloud infrastructure. By utilizing an edge-first ingestion model, we eliminate processing bottlenecks before they can impact upstream systems.
          </p>
        </div>
      </section>

      {/* Section: Workflow Protocol */}
      <section id="workflow" className="mb-32 reveal">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-serif text-4xl tracking-tight">Workflow Protocol</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-tech">
                01
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-medium">Neural Interception</h4>
                <p className="text-white/40 font-light leading-relaxed">Data is captured directly from kernel-level telemetry streams, ensuring no evasion is possible at the application layer.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-tech">
                02
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-medium">Contextual Vectoring</h4>
                <p className="text-white/40 font-light leading-relaxed">The system maps events against the MITRE ATT&CK framework while simultaneously calculating historical deviation scores.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-tech">
                03
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-medium">Surgical Remediation</h4>
                <p className="text-white/40 font-light leading-relaxed">Automated scripts execute isolation protocols only on affected segments, maintaining 99.9% system availability during attacks.</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-[3rem] p-6 border-emerald-500/10 flex items-center justify-center overflow-hidden min-h-[420px] md:min-h-[560px]">
            <img
              src={workflowImage}
              alt="Workflow protocol diagram"
              className="w-full h-full object-contain rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <Link to="/getting-started#installation" className="block reveal group">
        <div className="glass rounded-[2rem] p-12 shimmer-border spotlight-card flex flex-col md:flex-row items-center justify-between gap-8 transition-transform duration-500 group-hover:scale-[1.01] group-hover:bg-white/[0.04]">
          <div className="space-y-4">
            <p className="font-tech text-[10px] tracking-[0.4em] uppercase text-emerald-500">Next Step</p>
            <h3 className="font-serif text-4xl italic tracking-tighter">Ready to Begin? →</h3>
            <p className="text-white/40 font-light">Start your integration by deploying the first Neural Agent.</p>
          </div>
          <div className="w-24 h-24 rounded-full bg-emerald-500 text-black flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Icon icon="lucide:arrow-right" className="text-3xl" />
          </div>
        </div>
      </Link>
    </DocContent>
  );
}

export function GettingStartedPage() {
  return (
    <DocContent>
      {/* Section: Installation */}
      <section id="installation" className="mb-32 reveal">
      <div className="lg:col-span-7 mb-10">
          <p className="font-tech text-[10px] tracking-[0.5em] uppercase text-emerald-500 mb-6">Installation Guide</p>
          <h1 className="font-serif text-6xl md:text-7xl leading-[0.9] tracking-tighter mb-8 italic">
            Quick Installation.
          </h1>
          <p className="text-white/50 text-xl font-light leading-relaxed">
            Deploy the Log-Sentinel neural agent across your infrastructure in minutes. Our streamlined deployment pipeline ensures minimum friction and immediate telemetry ingestion.
          </p>
        </div>


        <div className="flex items-center gap-6 mb-12 mt-20">
          <h2 className="font-serif text-4xl tracking-tight">1. Global Agent Deploy</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>
        <p className="text-white/50 mb-8 leading-relaxed">
          The fastest way to get started is using our global install script. This will detect your environment, install the binary, and register the node with our telemetry network.
        </p>
        <div className="code-block rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-tech text-white/30 uppercase">Bash</span>
            <Icon icon="lucide:copy" className="text-white/20 hover:text-white transition-colors cursor-pointer" />
          </div>
          <code className="font-tech text-sm leading-relaxed block text-white/70">
            <span className="text-emerald-500">curl</span> -sSL https://get.log-sentinel.com | <span className="text-emerald-500">bash</span> -s -- --key <span className="text-blue-400 font-bold italic">$LS_LICENSE_KEY</span>
          </code>
        </div>
      </section>

      {/* Section: Configuration */}
      <section id="configuration" className="mb-32 reveal">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-serif text-4xl tracking-tight">2. Configuration Schema</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>
        <p className="text-white/50 mb-8 leading-relaxed">
          Log-Sentinel uses a declarative YAML configuration. Define your ingestion paths and neural analysis thresholds here to tailor the agent to your specific threat surface.
        </p>
        <div className="code-block rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-tech text-white/30 uppercase">YAML</span>
            <Icon icon="lucide:copy" className="text-white/20 hover:text-white transition-colors cursor-pointer" />
          </div>
          <code className="font-tech text-sm leading-relaxed block text-white/70 whitespace-pre">
<span className="text-emerald-500">agent_config</span>:
  <span className="text-emerald-500">mode</span>: neural_intercept
  <span className="text-emerald-500">ingest</span>:
    - <span className="text-emerald-500">path</span>: /var/log/syslog
    - <span className="text-emerald-500">type</span>: k8s_telemetry
  <span className="text-emerald-500">automation</span>:
    <span className="text-emerald-500">threshold</span>: 0.85
    <span className="text-emerald-500">orchestration</span>: true
          </code>
        </div>
      </section>

      {/* Section: Verification */}
      <section id="verification" className="mb-32 reveal">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-serif text-4xl tracking-tight">3. System Verification</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>
        <p className="text-white/50 mb-8 leading-relaxed">
          Once configured, run the following verification suite to ensure all neural endpoints are communicating with the central brain and telemetry is flowing correctly.
        </p>
        <div className="code-block rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-white/5 text-[9px] font-tech text-white/30 uppercase">Bash</span>
            <Icon icon="lucide:copy" className="text-white/20 hover:text-white transition-colors cursor-pointer" />
          </div>
          <code className="font-tech text-sm leading-relaxed block text-white/70">
            <span className="text-emerald-500">log-sentinel</span> status --verbose
            <br />
            <span className="text-white/30"># Node ID: b8-a4-31-af | Status: NEURAL_ACTIVE</span>
            <br />
            <span className="text-white/30"># Latency: 0.2ms | Ingestion: FLOWING</span>
          </code>
        </div>
      </section>

        {/* Section: API Reference */}
        <section id="api" className="mb-32 reveal">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="font-serif text-4xl tracking-tight">4. API Reference</h2>
            <div className="h-px flex-grow bg-white/5"></div>
          </div>
          <p className="text-white/50 mb-8 leading-relaxed">
            Use the API to stream logs, fetch threat summaries, and submit response actions from your own automation layer.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="code-block rounded-2xl p-6">
              <p className="font-tech text-[9px] uppercase text-white/20 mb-3">GET /api/v1/incidents</p>
              <code className="font-tech text-sm text-emerald-400">List recent detections</code>
            </div>
            <div className="code-block rounded-2xl p-6">
              <p className="font-tech text-[9px] uppercase text-white/20 mb-3">GET /api/v1/incidents/:id</p>
              <code className="font-tech text-sm text-emerald-400">Retrieve explanation and context</code>
            </div>
            <div className="code-block rounded-2xl p-6">
              <p className="font-tech text-[9px] uppercase text-white/20 mb-3">POST /api/v1/respond</p>
              <code className="font-tech text-sm text-emerald-400">Trigger playbook execution</code>
            </div>
          </div>
        </section>

      {/* Section: Deployment Options */}
      <section id="deployment" className="mb-32 reveal">
        <div className="flex items-center gap-6 mb-12">
          <h2 className="font-serif text-4xl tracking-tight">Deployment Options</h2>
          <div className="h-px flex-grow bg-white/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass spotlight-card rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 group border-white/5 hover:border-emerald-500/20">
            <Icon icon="mdi:docker" className="text-4xl text-white/20 mb-6 group-hover:text-blue-400 transition-colors duration-500" />
            <h4 className="font-tech text-[11px] uppercase tracking-widest text-emerald-500 mb-2">Docker</h4>
            <p className="text-white/40 text-sm font-light leading-relaxed">Containerized agent for ephemeral workloads and microservices.</p>
          </div>
          <div className="glass spotlight-card rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 group border-white/5 hover:border-emerald-500/20">
            <Icon icon="mdi:kubernetes" className="text-4xl text-white/20 mb-6 group-hover:text-emerald-400 transition-colors duration-500" />
            <h4 className="font-tech text-[11px] uppercase tracking-widest text-emerald-500 mb-2">Kubernetes</h4>
            <p className="text-white/40 text-sm font-light leading-relaxed">Native Helm charts for cluster-wide observability and monitoring.</p>
          </div>
          <div className="glass spotlight-card rounded-3xl p-8 hover:bg-white/5 transition-all duration-500 group border-white/5 hover:border-emerald-500/20">
            <Icon icon="mdi:server-network" className="text-4xl text-white/20 mb-6 group-hover:text-purple-400 transition-colors duration-500" />
            <h4 className="font-tech text-[11px] uppercase tracking-widest text-emerald-500 mb-2">Bare Metal</h4>
            <p className="text-white/40 text-sm font-light leading-relaxed">Direct kernel-level integration for maximum throughput performance.</p>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="pt-12 border-t border-white/5 flex items-center justify-between mb-20">
        <Link to="/introduction#welcome" className="group flex flex-col gap-1">
          <span className="text-[9px] font-tech text-white/20 uppercase tracking-widest">Previous</span>
          <span className="text-lg font-serif italic text-white/60 group-hover:text-emerald-400 transition-colors">← Introduction</span>
        </Link>
        <div className="h-8 w-px bg-white/5"></div>
        <a href="#api" className="group flex flex-col items-end gap-1" onClick={(e) => { e.preventDefault(); document.getElementById('api')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <span className="text-[9px] font-tech text-white/20 uppercase tracking-widest">Next Up</span>
          <span className="text-lg font-serif italic text-white/60 group-hover:text-emerald-400 transition-colors">API Reference →</span>
        </a>
      </footer>
    </DocContent>
  );
}