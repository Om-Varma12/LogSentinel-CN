import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const latestYRef = useRef(0);
  const lastSyncedYRef = useRef(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [y, setY] = useState(0);

  const { scrollY } = useScroll();

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const measure = () => {
      setContentHeight(contentEl.getBoundingClientRect().height);
      ScrollTrigger.refresh();
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(contentEl);

    window.addEventListener('resize', measure);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    latestYRef.current = latest;
    if (rafRef.current !== null) return;

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      // Avoid expensive updates for tiny deltas.
      if (Math.abs(latestYRef.current - lastSyncedYRef.current) < 2) return;

      lastSyncedYRef.current = latestYRef.current;
      setY(-latestYRef.current); // GPU-accelerated translate3d
      ScrollTrigger.update();
    });
  });

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full">
      <div aria-hidden="true" style={{ height: `${contentHeight}px` }} />
      <div
        ref={contentRef}
        style={{ transform: `translate3d(0, ${y}px, 0)` }}
        className="fixed left-0 top-0 w-full will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
