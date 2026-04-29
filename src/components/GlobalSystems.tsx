import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function BackgroundScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.04),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,249,249,1))]" />
      <div className="absolute -top-24 left-[12%] h-72 w-72 rounded-full bg-brand-orange/12 blur-[110px] animate-gradient-float" />
      <div className="absolute top-[22%] right-[6%] h-[22rem] w-[22rem] rounded-full bg-black/5 blur-[130px] animate-gradient-drift" />
      <div className="absolute bottom-[-8rem] left-[30%] h-80 w-80 rounded-full bg-brand-orange/10 blur-[120px] animate-gradient-pulse" />
    </div>
  );
}

export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
      <BackgroundScene />
    </div>
  );
}

export function GlobalSystems() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
    });

    window.__lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
    };
  }, []);

  return (
    <>
      <AmbientBackdrop />
    </>
  );
}
