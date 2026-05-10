/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useDevicePerformance } from '../lib/performance';

type HeroFlipCardProps = {
  imageSrc: string;
  imageSrcAvif?: string;
  alt: string;
  triggerRef: RefObject<HTMLElement | null>;
};

export function HeroFlipCard({ imageSrc, imageSrcAvif, alt, triggerRef }: HeroFlipCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const performance = useDevicePerformance();
  const reduceMotion = Boolean(useReducedMotion()) || !performance.shouldUsePremiumMotion;

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const trigger = triggerRef.current;

    if (!container || !card || !trigger || reduceMotion || !performance.shouldUseScrollFX) {
      return;
    }

    let disposed = false;
    let cleanup = () => undefined;

    const init = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);

      if (disposed) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      const createTimeline = (endDistance: number, finalScale: number) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger,
            pin: container,
            start: 'top top',
            end: `+=${endDistance}`,
            scrub: 1,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        timeline.to(
          card,
          {
            rotateY: 180,
            scale: finalScale,
            ease: 'none',
            transformOrigin: 'center center',
            transformPerspective: 1000
          },
          0
        );

        return timeline;
      };

      mm.add('(min-width: 1024px)', () => createTimeline(800, 0.85));
      mm.add('(min-width: 768px) and (max-width: 1023px)', () => createTimeline(680, 0.88));
      mm.add('(max-width: 767px)', () => createTimeline(560, 0.92));

      cleanup = () => {
        mm.revert();
      };
    };

    void init();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [performance.shouldUsePremiumMotion, performance.shouldUseScrollFX, reduceMotion, triggerRef]);

  return (
    <div
      ref={containerRef}
      className="card-container relative mx-auto aspect-[4/5] w-full max-w-[min(92vw,28rem)] sm:max-w-[34rem] sm:aspect-[10/12]"
    >
      <div ref={cardRef} className="card-3d">
        <div className="card-face card-front">
          <picture>
            {imageSrcAvif ? <source srcSet={imageSrcAvif} type="image/avif" /> : null}
            <source srcSet={imageSrc} type="image/webp" />
            <img
              src={imageSrc}
              alt={alt}
              className="card-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable="false"
            />
          </picture>
        </div>

        <div className="card-face card-back">
          <picture>
            {imageSrcAvif ? <source srcSet={imageSrcAvif} type="image/avif" /> : null}
            <source srcSet={imageSrc} type="image/webp" />
            <img
              src={imageSrc}
              alt={alt}
              className="card-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable="false"
            />
          </picture>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_24%,rgba(0,0,0,0.18))] shadow-[0_32px_80px_rgba(0,0,0,0.4)]" />
    </div>
  );
}
