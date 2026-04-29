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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.05),transparent_30%)]" />
      <div className="absolute -top-28 left-1/3 h-80 w-80 rounded-full bg-brand-orange/10 blur-[110px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-black/5 blur-[120px]" />
    </div>
  );
}

export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-90">
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
