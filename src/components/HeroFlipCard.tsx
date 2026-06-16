/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion } from 'motion/react';
import { useDevicePerformance } from '../lib/performance';

type HeroFlipCardProps = {
  imageSrc: string;
  imageSrcAvif?: string;
  alt: string;
};

export function HeroFlipCard({ imageSrc, imageSrcAvif, alt }: HeroFlipCardProps) {
  const performance = useDevicePerformance();
  const reduceMotion = Boolean(useReducedMotion()) || !performance.shouldUsePremiumMotion;

  return (
    <motion.figure
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.995 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.35 }}
      className="hero-card-shell relative mx-auto aspect-[4/5] w-full max-w-[min(92vw,28rem)] overflow-hidden rounded-[24px] border border-white/10 bg-[#060606] shadow-[0_32px_80px_rgba(0,0,0,0.4)] sm:max-w-[34rem] sm:aspect-[10/12]"
    >
      <picture className="block h-full w-full">
        {imageSrcAvif ? <source srcSet={imageSrcAvif} type="image/avif" /> : null}
        <source srcSet={imageSrc} type="image/webp" />
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable="false"
        />
      </picture>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_24%,rgba(0,0,0,0.18))]" />
      <div className="pointer-events-none hero-card-shell__editorial absolute inset-0" aria-hidden="true">
        <div className="hero-card-shell__editorial-chip">see what&apos;s possible</div>
        <div className="hero-card-shell__editorial-copy">
          <div className="hero-card-shell__editorial-kicker">explore our work</div>
          <div className="hero-card-shell__editorial-title">Unique visuals. Endless possibilities.</div>
          <p className="hero-card-shell__editorial-description">
            Premium motion, branding, and video systems for modern campaigns and product stories.
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/10" />
    </motion.figure>
  );
}
