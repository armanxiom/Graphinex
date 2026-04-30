import { useEffect } from 'react';
import Lenis from 'lenis';
import { premiumMagneticTransition } from '../lib/motion';

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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const lenis = new Lenis({
      duration: isMobile ? 0.95 : 1.08,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      syncTouch: isMobile,
      syncTouchLerp: 0.05,
      touchInertiaExponent: 1.55,
      touchMultiplier: isMobile ? 1.08 : 1,
      wheelMultiplier: 1,
    });

    window.__lenis = lenis;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || prefersReducedMotion) return;

    const magneticTargets = '.premium-button';
    let activeTarget: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;

    const resetTarget = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.transition = `transform ${premiumMagneticTransition.duration * 1000}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      target.style.transform = '';
      target.style.willChange = 'auto';
    };

    const setTarget = (target: HTMLElement, x: number, y: number) => {
      target.style.transition = `transform ${premiumMagneticTransition.duration * 1000}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      target.style.willChange = 'transform';
      target.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02)`;
    };

    const handleMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(magneticTargets);

      if (!target) {
        if (activeTarget) {
          resetTarget(activeTarget);
          activeTarget = null;
        }
        return;
      }

      const rect = target.getBoundingClientRect();
      lastX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      lastY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

      if (activeTarget !== target) {
        if (activeTarget) {
          resetTarget(activeTarget);
        }
        activeTarget = target;
      }

      setTarget(activeTarget, lastX, lastY);
    };

    const handleLeave = () => {
      if (activeTarget) {
        resetTarget(activeTarget);
        activeTarget = null;
      }
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('blur', handleLeave);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      window.removeEventListener('blur', handleLeave);
      if (activeTarget) {
        resetTarget(activeTarget);
      }
    };
  }, []);

  const showBackdrop =
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 1024px)').matches;

  return (
    <>
      {showBackdrop ? <AmbientBackdrop /> : null}
    </>
  );
}
