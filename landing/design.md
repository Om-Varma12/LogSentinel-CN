# Cyber Serif Design System for Log-Sentinel

## Color Palette
- **Primary Black:** #050505 (deep background)
- **Accent Emerald:** #10b981 (threat indicators, active states, CTAs)
- **Text White:** #ebebeb (primary text)
- **Glass Border:** rgba(255, 255, 255, 0.1)
- **Glass Background:** rgba(255, 255, 255, 0.02)

## Typography
- **Display Headlines:** 'Newsreader' serif, font-weight 200–800, tracking-tighter
- **Body Text:** 'Inter' sans-serif, 300–600 weights
- **Technical Labels:** 'Space Grotesk', all-caps, 10px size, tracking: 0.2em to 0.5em

## Core Effects & Animations
- **Cubic Bezier:** cubic-bezier(0.16, 1, 0.3, 1) for weighted motion
- **Glassmorphism:** background: rgba(255,255,255,0.02), backdrop-filter: blur(12px), border: 1px solid rgba(255,255,255,0.1)
- **Shimmer Border:** 4s linear animation with 200% background size, gradient from transparent to emerald to transparent
- **Spotlight Cursor:** radial-gradient at var(--mouse-x), var(--mouse-y), opacity 0→1 on hover
- **Pulse Glow:** 0→15px box-shadow expansion over 2s
- **Morphing Blob:** 8s ease-in-out infinite, alternating border-radius patterns
- **Gradient Text:** linear-gradient(90deg, white, emerald, white), background-size: 200%, 6s shine animation
- **Scroll Reveal:** fadeInUp 1s with translateY(30px→0) on intersection

## Reusable Components

### Navigation Bar
\`\`\`html
<nav id=\"navbar\" class=\"fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center\">
  <div class=\"max-w-7xl w-full mx-auto px-10 flex justify-between items-center\">
    <a href=\"#\" id=\"brand-logo\" class=\"font-serif text-2xl tracking-tighter\">Log-Sentinel.</a>
    
    <div class=\"hidden lg:flex items-center gap-10\">
      <a href=\"#features\" id=\"nav-features\" class=\"nav-link font-tech text-[10px] tracking-[0.2em] uppercase\">Features</a>
      <a href=\"#use-cases\" id=\"nav-cases\" class=\"nav-link font-tech text-[10px] tracking-[0.2em] uppercase\">Use Cases</a>
      <a href=\"#pricing\" id=\"nav-pricing\" class=\"nav-link font-tech text-[10px] tracking-[0.2em] uppercase\">Pricing</a>
      <a href=\"#docs\" id=\"nav-docs\" class=\"nav-link font-tech text-[10px] tracking-[0.2em] uppercase text-white/40\">Documentation</a>
    </div>

    <a href=\"#signup\" id=\"nav-cta\" class=\"px-8 py-3 bg-emerald-500 text-black rounded-full font-tech text-[10px] font-bold tracking-[0.15em] uppercase pulse-glow transition-transform hover:scale-105 active:scale-95\">Start Free Trial</a>
  </div>
</nav>\n
<style>
.nav-link {
  position: relative;
  padding-bottom: 2px;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #10b981;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.nav-link:hover::after {
  width: 100%;
}

#navbar.scrolling {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
</style>\n
<script>
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('bg-black/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
  } else {
    navbar.classList.remove('bg-black/80', 'backdrop-blur-xl', 'border-b', 'border-white/5');
  }
});
</script>
\`\`\`

### Feature Card (Spotlight + Shimmer)
\`\`\`html
<div class=\"spotlight-card shimmer-border glass rounded-[3rem] p-12\">
  <div class=\"w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform duration-700 hover:rotate-[360deg]\">
    <iconify-icon icon=\"lucide:zap\" class=\"text-3xl text-emerald-400\"></iconify-icon>
  </div>
  <h3 class=\"font-serif text-3xl mb-5\">Real-Time Detection</h3>
  <p class=\"text-white/40 leading-relaxed\">
    Stop hunting through logs. Our engine processes millions of events per second to surface the 0.1% that truly matter.
  </p>
</div>\n
<style>
.spotlight-card {
  position: relative;
  overflow: hidden;
}

.spotlight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(16, 185, 129, 0.12),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 1;
}

.spotlight-card:hover::before {
  opacity: 1;
}

.shimmer-border::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(90deg, transparent, #10b981, transparent);
  background-size: 200% 100%;
  animation: shimmer 4s linear infinite;
  pointer-events: none;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
</style>\n
<script>
const cards = document.querySelectorAll('.spotlight-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
</script>
\`\`\`

### Glass Container
\`\`\`html
<div class=\"glass rounded-[3rem] p-12\">
  <!-- Content -->
</div>\n
<style>
.glass {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
\`\`\`

### CTA Button (Pulse Glow)
\`\`\`html
<button class=\"px-10 py-5 bg-white text-black rounded-full font-tech text-xs font-bold tracking-widest uppercase hover:bg-emerald-500 transition-colors duration-500 pulse-glow\">
  Deploy Assistant
</button>\n
<style>
.pulse-glow {
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
</style>
\`\`\`

### Scroll Reveal Animation
\`\`\`html
<div class=\"reveal\">Content that reveals on scroll</div>\n
<style>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
</style>\n
<script>
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
</script>
\`\`\`

### Morphing Background Blob
\`\`\`html
<div class=\"fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] morphing-blob z-0\"></div>\n
<style>
.morphing-blob {
  animation: morph 8s ease-in-out infinite alternate;
}

@keyframes morph {
  0% { border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%; }
  100% { border-radius: 60% 40% 40% 60% / 30% 70% 30% 70%; }
}
</style>
\`\`\`

## Design Philosophy
- **Premium Minimalism:** Emerald accent used sparingly as surgical highlight, never as dominant block
- **Typography Hierarchy:** Newsreader serif conveys authority and editorial weight; Space Grotesk for technical precision
- **Motion Intent:** All animations serve UX purpose; cubic-bezier weighting creates sense of precision and control
- **Glassmorphism:** Depth through transparency and blur, not solid layers
- **Responsive Scale:** 3xl border-radius for cards, full-pill shapes for buttons
- **Dark-First:** Deep black dominates with high contrast for accessibility and premium feel

## Implementation Checklist
- [ ] Use CSS variables for color tokens (--emerald, --black, --text)
- [ ] Apply cubic-bezier(0.16, 1, 0.3, 1) to all transition animations
- [ ] Include Intersection Observer for scroll reveals
- [ ] Add Iconify script for icon system
- [ ] Load Newsreader, Inter, Space Grotesk from Google Fonts
- [ ] Implement spotlight cursor tracking on interactive cards
- [ ] Ensure navbar scroll transition works
- [ ] Test shimmer border animation performance
- [ ] Verify glassmorphism backdrop-filter support