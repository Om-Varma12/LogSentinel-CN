import { useRef, useCallback } from 'react';
import '../styles/design-system.css';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      className="spotlight-card shimmer-border glass rounded-[3rem] p-12 reveal"
      onMouseMove={handleMouseMove}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform duration-700 hover:rotate-[360deg]">
        {icon}
      </div>
      <h3 className="font-serif text-3xl mb-5">{title}</h3>
      <p className="text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}
