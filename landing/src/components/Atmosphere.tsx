import '../styles/design-system.css';

export function Atmosphere() {
  return (
    <>
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] morphing-blob z-0"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] morphing-blob z-0" style={{ animationDelay: '-4s' }}></div>
    </>
  );
}
