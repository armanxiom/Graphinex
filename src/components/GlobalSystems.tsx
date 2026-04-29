import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
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
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -((event.clientY / window.innerHeight - 0.5) * 2);
    };

    const tick = setInterval(() => invalidate(), 33);
    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => {
      clearInterval(tick);
      window.removeEventListener('pointermove', handleMove);
    };
  }, [invalidate]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const root = group.current;
    if (!root) return;

    root.rotation.y = t * 0.045 + mouse.current.x * 0.12;
    root.rotation.x = t * 0.02 + mouse.current.y * 0.08;
    root.position.x = mouse.current.x * 0.22;
    root.position.y = mouse.current.y * 0.16;

    root.children.forEach((child, index) => {
      const mesh = child as THREE.Object3D;
      mesh.position.y = Math.sin(t * 0.6 + index) * 0.18;
      mesh.position.x = Math.cos(t * 0.35 + index) * 0.12;
    });
  });

  return (
    <group ref={group}>
      <Float speed={0.6} rotationIntensity={0.7} floatIntensity={0.8}>
        <mesh position={[-2.3, 1.3, -1.8]} scale={1.1}>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.12}
            transmission={1}
            thickness={0.8}
            transparent
            opacity={0.2}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>
      </Float>

      <Float speed={0.8} rotationIntensity={0.6} floatIntensity={0.9}>
        <mesh position={[1.8, -0.6, -2.1]} scale={1.45}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial
            color="#FF6A00"
            roughness={0.25}
            transmission={0.4}
            transparent
            opacity={0.16}
            clearcoat={1}
          />
        </mesh>
      </Float>

      <Float speed={0.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[0.1, 1.9, -2.8]} scale={0.8}>
          <octahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.15}
            transmission={0.95}
            transparent
            opacity={0.14}
            clearcoat={1}
          />
        </mesh>
      </Float>

      <Sparkles
        count={36}
        speed={0.18}
        size={2.2}
        scale={[12, 8, 6]}
        opacity={0.18}
        color="#FF6A00"
      />
    </group>
  );
}

export function AmbientBackdrop() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-90">
      <Canvas
        frameloop="demand"
        dpr={[1, isMobile ? 1.15 : 1.5]}
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#f9f9f9']} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} color="#FFB27A" />
        <pointLight position={[-4, 1, 4]} intensity={1.1} color="#FF6A00" />
        <BackgroundScene />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.05),transparent_28%)]" />
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
      duration: 1.2,
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
