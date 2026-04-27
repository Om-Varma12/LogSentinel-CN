import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
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

export function DocumentationSidebar({ activeItem = 'welcome' }: SidebarProps) {
  const [active, setActive] = useState(activeItem);

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
                sectionName === 'Deep Dive' ? 'text-emerald-500/60' : 'text-white/20'
              }`}>
                {sectionName}
              </p>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.id === 'welcome' ? '/introduction' : item.id === 'installation' ? '/getting-started' : `/deep-dive#${item.id}`}
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
      <DocumentationSidebar activeItem="troubleshooting" />
      <div className="ml-80 max-w-5xl mx-auto px-12 py-20">
        {children}
      </div>
    </div>
  );
}

type FAQItemProps = {
  id: string;
  category: string;
  title: string;
  icon: string;
  colorClass: string;
  children: React.ReactNode;
  openItem: string | null;
  setOpenItem: (id: string | null) => void;
};

function FAQItem({ id, category, title, icon, colorClass, children, openItem, setOpenItem }: FAQItemProps) {
  const isOpen = openItem === id;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className="spotlight-card glass rounded-3xl p-8 cursor-pointer transition-all duration-500 hover:bg-white/[0.03]"
      onClick={() => setOpenItem(isOpen ? null : id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${colorClass}15` }}
          >
            <Icon icon={icon} className="text-2xl" style={{ color: colorClass }} />
          </div>
          <div>
            <p className="font-tech text-[9px] uppercase tracking-[0.3em] mb-2" style={{ color: colorClass }}>
              {category}
            </p>
            <h3 className="text-xl font-medium tracking-tight">{title}</h3>
          </div>
        </div>
        <Icon
          icon="lucide:chevron-down"
          className="text-white/20 text-2xl transition-transform duration-500"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: isOpen ? '1000px' : '0px',
          opacity: isOpen ? '1' : '0',
          marginTop: isOpen ? '1.5rem' : '0',
        }}
      >
        <div className="pl-[4.5rem] space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

type SupportCardProps = {
  icon: string;
  title: string;
  description: string;
  badge: string;
  href?: string;
  isButton?: boolean;
  onClick?: () => void;
};

function SupportCard({ icon, title, description, badge, href, isButton, onClick }: SupportCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const content = (
    <div
      ref={cardRef}
      className="spotlight-card glass rounded-3xl p-10 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 h-full"
    >
      <Icon icon={icon} className="text-4xl text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
      <h4 className="text-lg font-medium mb-3">{title}</h4>
      <p className="text-white/40 text-sm font-light leading-relaxed mb-6">{description}</p>
      <span className="text-[10px] font-tech text-emerald-500 uppercase tracking-widest mt-auto">{badge}</span>
    </div>
  );

  if (isButton) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return (
    <a href={href} className="block h-full">
      {content}
    </a>
  );
}

export function TroubleshootingPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <DocContent>
      {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 mb-8 reveal">
            <Link to="/" className="text-[10px] font-tech uppercase tracking-widest text-white/30 hover:text-emerald-400">Docs</Link>
            <Icon icon="lucide:chevron-right" className="text-[10px] text-white/10" />
            <span className="text-[10px] font-tech uppercase tracking-widest text-emerald-500">Troubleshooting</span>
          </nav>

          <header className="mb-20 reveal" style={{ animationDelay: '100ms' }}>
            <h1 className="font-serif text-6xl md:text-7xl italic leading-tight tracking-tighter mb-6">
              Common Issues & Support
            </h1>
            <p className="text-white/50 text-xl font-light leading-relaxed max-w-2xl">
              Find solutions to common implementation hurdles and learn how to optimize your Log-Sentinel cluster for maximum neural throughput.
            </p>
          </header>

          {/* Search */}
          <section className="mb-20 reveal" style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Icon icon="lucide:search" className="text-white/30 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all font-light"
              />
              <div className="absolute inset-y-0 right-6 flex items-center">
                <span className="text-[10px] font-tech text-white/10 uppercase tracking-widest">CMD + K</span>
              </div>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section className="mb-32 reveal" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-6 mb-12">
              <h2 className="font-serif text-3xl tracking-tight italic">Frequently Asked</h2>
              <div className="h-px flex-grow bg-white/5"></div>
            </div>

            <div className="space-y-4">
              <FAQItem
                id="1"
                category="Agent Errors"
                title="Why is my agent showing 'Connection Timeout' error?"
                icon="lucide:wifi-off"
                colorClass="#ef4444"
                openItem={openItem}
                setOpenItem={setOpenItem}
              >
                <p className="text-white/50 leading-relaxed font-light">
                  This usually indicates a handshake failure between the local neural agent and the ingestion cluster. Verify that egress ports 443 and 8883 are open on your firewall.
                </p>
                <div className="code-block rounded-xl p-5">
                  <p className="font-tech text-[9px] uppercase text-white/20 mb-3">Check Status</p>
                  <code className="font-tech text-sm text-emerald-400">
                    log-sentinel-agent <span className="text-white/60">--verify-connectivity</span>
                  </code>
                </div>
              </FAQItem>

              <FAQItem
                id="2"
                category="Configuration"
                title="How do I fix 'Invalid Config Schema' errors?"
                icon="lucide:settings"
                colorClass="#3b82f6"
                openItem={openItem}
                setOpenItem={setOpenItem}
              >
                <p className="text-white/50 leading-relaxed font-light">
                  This occurs when the YAML indentation or keys do not match the required Neural Spec. Use the built-in validator to find the exact line of failure.
                </p>
                <div className="code-block rounded-xl p-5">
                  <p className="font-tech text-[9px] uppercase text-white/20 mb-3">Validation Command</p>
                  <code className="font-tech text-sm text-emerald-400">
                    ls-cli config <span className="text-white/60">validate ./config.yaml</span>
                  </code>
                </div>
              </FAQItem>

              <FAQItem
                id="3"
                category="API Limits"
                title="What are the API rate limits?"
                icon="lucide:zap"
                colorClass="#f97316"
                openItem={openItem}
                setOpenItem={setOpenItem}
              >
                <p className="text-white/50 leading-relaxed font-light">
                  Standard Tier allows 10,000 requests per minute. If you receive a 429 status code, implement an exponential backoff strategy in your integration layer.
                </p>
              </FAQItem>

              <FAQItem
                id="4"
                category="Deployment"
                title="How do I troubleshoot failed Kubernetes deployments?"
                icon="lucide:package"
                colorClass="#a855f7"
                openItem={openItem}
                setOpenItem={setOpenItem}
              >
                <p className="text-white/50 leading-relaxed font-light">
                  Check the sidecar container logs. Most failures are caused by missing image pull secrets or insufficient memory limits assigned to the neural processing pod.
                </p>
                <div className="code-block rounded-xl p-5">
                  <p className="font-tech text-[9px] uppercase text-white/20 mb-3">K8s Debug</p>
                  <code className="font-tech text-sm text-emerald-400">
                    kubectl logs <span className="text-white/60">-l app=log-sentinel -c agent</span>
                  </code>
                </div>
              </FAQItem>

              <FAQItem
                id="5"
                category="Performance"
                title="How can I optimize agent CPU usage?"
                icon="lucide:gauge"
                colorClass="#10b981"
                openItem={openItem}
                setOpenItem={setOpenItem}
              >
                <p className="text-white/50 leading-relaxed font-light">
                  Enable 'batching' in your config to reduce context switching. This allows the agent to process thousands of events in a single neural cycle.
                </p>
              </FAQItem>
            </div>
          </section>

          {/* Contact Grid */}
          <section className="mb-32 reveal">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="font-serif text-3xl tracking-tight italic">Still Stuck?</h2>
              <div className="h-px flex-grow bg-white/5"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SupportCard
                icon="lucide:mail"
                title="Email Support"
                description="Direct line to our core engineering team for complex issues."
                badge="Avg response: 2-4 hrs"
                href="mailto:support@log-sentinel.com"
              />
              <SupportCard
                icon="lucide:message-circle"
                title="Live Chat"
                description="Real-time terminal access to a technical support architect."
                badge="Available Now"
                isButton={true}
                onClick={() => alert('Live chat would open here')}
              />
              <SupportCard
                icon="lucide:book-open"
                title="Full Docs"
                description="Browse the complete API reference and architecture guides."
                badge="Self-Service"
                href="/introduction"
              />
            </div>
          </section>

          {/* Navigation Footer */}
          <footer className="pt-12 border-t border-white/5 flex items-center justify-between reveal">
            <Link to="/getting-started" className="group flex flex-col items-start">
              <span className="text-[9px] font-tech uppercase tracking-[0.4em] text-white/20 mb-2">Previous</span>
              <span className="font-serif text-xl italic text-white/50 group-hover:text-emerald-400 transition-colors">← Getting Started</span>
            </Link>
            <Link to="/" className="group flex flex-col items-end">
              <span className="text-[9px] font-tech uppercase tracking-[0.4em] text-white/20 mb-2">Next</span>
              <span className="font-serif text-xl italic text-white/50 group-hover:text-emerald-400 transition-colors">Home →</span>
            </Link>
          </footer>
        </DocContent>
  );
}