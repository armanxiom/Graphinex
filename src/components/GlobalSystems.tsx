import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

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
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

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

    const handleMove = (event: PointerEvent) => {
      if (!cursorRef.current || !ringRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX - 3}px, ${event.clientY - 3}px, 0)`;
      ringRef.current.style.transform = `translate3d(${event.clientX - 16}px, ${event.clientY - 16}px, 0) scale(${hoveringRef.current ? 1.9 : 1})`;
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isInteractive = Boolean(target?.closest('a, button, [role="button"], input, textarea, select, summary'));
      hoveringRef.current = isInteractive;
    };

    const handleOut = () => {
      hoveringRef.current = false;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);

    if (!reducedMotion) {
      const sectionTargets = gsap.utils.toArray<HTMLElement>('section');
      sectionTargets.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.72, y: 36, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              end: 'top 30%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      gsap.to('#hero-text', {
        y: -42,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('#hero-media', {
        y: 40,
        scale: 0.98,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('#showreel', {
        scale: 0.985,
        scrollTrigger: {
          trigger: '#showreel',
          start: 'top 85%',
          end: 'bottom 10%',
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenis === lenis) {
        window.__lenis = undefined;
      }
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <AmbientBackdrop />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_16px_rgba(255,106,0,0.75)] transition-transform duration-100 ease-out"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[69] hidden md:block h-8 w-8 rounded-full border border-brand-orange/35 bg-brand-orange/10 backdrop-blur-[2px] transition-transform duration-200 ease-out"
      />
    </>
  );
}
