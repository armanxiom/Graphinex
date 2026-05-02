/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useCountUp } from '../hooks/useCountUp';

const heroHeadingWords = siteConfig.hero.heading.split(/\s+/);
const heroHighlightWords = new Set(siteConfig.hero.headingHighlights.map((word) => word.toLowerCase()));

function parseStatValue(value: string) {
  const trimmed = value.trim();

  if (trimmed.toUpperCase().endsWith('X')) {
    return { kind: 'text' as const, label: trimmed };
  }

  const match = trimmed.match(/^(\d+(?:\.\d+)?)([KM])?(\+)?$/i);

  if (!match) {
    return { kind: 'text' as const, label: trimmed };
  }

  const numeric = Number(match[1]);
  const unit = (match[2] || '').toUpperCase();
  const target = unit === 'M' ? numeric * 1_000_000 : unit === 'K' ? numeric * 1_000 : numeric;

  return {
    kind: 'count' as const,
    target,
    raw: trimmed
  };
}

function formatAnimatedValue(current: number, target: number, raw: string) {
  const hasPlus = raw.endsWith('+');

  if (target >= 1_000_000) {
    if (current >= target) return raw;
    const millions = current / 1_000_000;
    const value = millions >= 10 ? Math.floor(millions) : Math.floor(millions * 10) / 10;
    const normalized = current > 0 && value === 0 ? 0.1 : value;
    return `${normalized.toFixed(millions >= 10 ? 0 : 1)}M${hasPlus ? '+' : ''}`;
  }

  if (target >= 1_000) {
    if (current >= target) return raw;
    const thousands = current / 1_000;
    const value = thousands >= 10 ? Math.floor(thousands) : Math.floor(thousands * 10) / 10;
    const normalized = current > 0 && value === 0 ? 0.1 : value;
    return `${normalized.toFixed(thousands >= 10 ? 0 : 1)}K${hasPlus ? '+' : ''}`;
  }

  return `${Math.min(target, Math.floor(current))}${hasPlus ? '+' : ''}`;
}

function HeroStatValue({
  value,
  active,
  reduceMotion
}: {
  value: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const parsed = parseStatValue(value);
  const current = useCountUp(active && !reduceMotion && parsed.kind === 'count', parsed.kind === 'count' ? parsed.target : 0, 1300);

  if (parsed.kind === 'text' || reduceMotion) {
    return <div className="text-2xl font-bold leading-none text-white md:text-3xl">{parsed.label}</div>;
  }

  return (
    <div className="tabular-nums text-2xl font-bold leading-none text-white md:text-3xl">
      {formatAnimatedValue(current, parsed.target, parsed.raw)}
    </div>
  );
}

function HeroMarquee({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="hero-marquee" aria-hidden="true">
      <motion.div
        className="hero-marquee__track motion-optimised"
        animate={reduceMotion ? { x: '0%' } : { x: ['0%', '-50%'] }}
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 26,
                ease: 'linear',
                repeat: Infinity
              }
        }
      >
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="hero-marquee__copy" aria-hidden={copyIndex === 1}>
            <span className="hero-marquee__logo">
              <img
                src={siteConfig.brand.logo}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
              />
            </span>

            {heroHeadingWords.map((word, index) => {
              const isHighlighted = heroHighlightWords.has(word.toLowerCase());

              return (
                <span
                  key={`${copyIndex}-${word}-${index}`}
                  className={`hero-marquee__word ${isHighlighted ? 'hero-marquee__word--accent text-accent-gradient' : ''}`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export const Hero = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = Boolean(reduceMotion);
  const [statsActive, setStatsActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -22]);
  const orbX = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 38]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -24]);
  const orbXReverse = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -30]);
  const orbYReverse = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 18]);

  useEffect(() => {
    const node = statsRef.current;

    if (!node || statsActive) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.32,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [statsActive]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty('--hero-glow-x', `${Math.min(100, Math.max(0, x))}%`);
    el.style.setProperty('--hero-glow-y', `${Math.min(100, Math.max(0, y))}%`);
    el.style.setProperty('--hero-glow-opacity', '1');
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--hero-glow-x', '18%');
    event.currentTarget.style.setProperty('--hero-glow-y', '24%');
    event.currentTarget.style.setProperty('--hero-glow-opacity', '0.82');
  };

  return (
    <motion.section
      ref={heroRef}
      initial={{ opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-stage relative flex min-h-screen items-center overflow-hidden pt-[10.5rem] pb-20 md:pt-[12rem]"
      id="hero"
    >
      <div className="hero-stage__bg" />
      <motion.div style={{ x: orbX, y: orbY }} className="hero-stage__orb hero-stage__orb--1" />
      <motion.div style={{ x: orbXReverse, y: orbYReverse }} className="hero-stage__orb hero-stage__orb--2" />
      <div className="hero-stage__ghost hero-stage__ghost--one" aria-hidden="true">
        GRAPHINEX
      </div>
      <div className="hero-stage__ghost hero-stage__ghost--two" aria-hidden="true">
        SCALE
      </div>
      <div className="hero-stage__cursor-glow" aria-hidden="true" />
      <div className="hero-stage__grain hero-grain" aria-hidden="true" />
      <div className="hero-stage__grid" aria-hidden="true" />

      <div className="container-boxed relative z-10 w-full">
        <motion.div style={{ y: contentY }} className="hero-stage__content lg:w-[60%]">
          <motion.span
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__badge glass-pill-black mb-6 inline-flex px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white"
          >
            <span className="relative z-10">Creative Agency Based in India</span>
          </motion.span>

          <h1 className="sr-only">{siteConfig.hero.heading}</h1>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-1"
          >
            <HeroMarquee reduceMotion={prefersReducedMotion} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.62, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__lede mt-6 max-w-xl text-base leading-8 text-white/78 md:text-lg"
          >
            {siteConfig.hero.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__actions mb-10 mt-8 flex flex-wrap gap-3"
          >
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-fill-button rounded-full px-6 py-3.5"
            >
              <span className="liquid-fill-button__label">Book a Call</span>
            </a>
            <Link
              to="/portfolio"
              className="premium-button rounded-full border border-white/14 bg-white/8 px-6 text-white backdrop-blur-md"
            >
              View Work
              <PlayCircle size={14} />
            </Link>
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__stats grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {siteConfig.results.map((res, index) => (
              <motion.div
                key={res.label}
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="hero-stage__stat rounded-[1.25rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-md"
              >
                <HeroStatValue value={res.value} active={statsActive} reduceMotion={prefersReducedMotion} />
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/62">
                  {res.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
