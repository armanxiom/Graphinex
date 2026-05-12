/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contact, hero, logos, results } from '../data/siteConfig';
import { useCountUp } from '../hooks/useCountUp';
import { useDevicePerformance } from '../lib/performance';
import { HeroFlipCard } from './HeroFlipCard';
import { OptimizedImage } from './OptimizedImage';

const heroBackgroundImage = '/assets/hero/hero-background.webp';
const heroBackgroundImageAvif = '/assets/hero/hero-background.avif';
const heroCardImage = '/assets/hero/hero-card.webp';
const heroCardImageAvif = '/assets/hero/hero-card.avif';

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
    return <div className="hero-stage__stat-value text-[clamp(1.35rem,5vw,1.9rem)] font-bold leading-none text-white md:text-3xl">{parsed.label}</div>;
  }

  return (
    <div className="hero-stage__stat-value tabular-nums text-[clamp(1.35rem,5vw,1.9rem)] font-bold leading-none text-white md:text-3xl">
      {formatAnimatedValue(current, parsed.target, parsed.raw)}
    </div>
  );
}

export const Hero = () => {
  const heroStageRef = useRef<HTMLElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const performance = useDevicePerformance();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const simplifyMotion = prefersReducedMotion || !performance.shouldUsePremiumMotion;
  const [statsActive, setStatsActive] = useState(false);
  const featuredLogos = logos.slice(0, 4);
  const marqueeItems = [
    'Video Editing',
    'Graphic Design',
    'Branding',
    'Showreel',
    'Portfolio',
    'Motion Systems'
  ];
  const requestedSkin = (new URLSearchParams(location.search).get('skin') ?? new URLSearchParams(location.search).get('visual') ?? '').toLowerCase();
  const isSliderSkin = requestedSkin === 'sr' || requestedSkin === 'slider' || requestedSkin === 'revolution';

  const headingWords = useMemo(() => hero.heading.split(/\s+/), []);
  const highlightWords = useMemo(
    () => new Set(hero.headingHighlights.map((word) => word.toLowerCase())),
    []
  );

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

  const updateGlow = (event: ReactPointerEvent<HTMLElement>) => {
    if (simplifyMotion || performance.isTouchDevice) {
      return;
    }

    const node = heroStageRef.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    node.style.setProperty('--hero-glow-x', `${Math.min(100, Math.max(0, x))}%`);
    node.style.setProperty('--hero-glow-y', `${Math.min(100, Math.max(0, y))}%`);
    node.style.setProperty('--hero-glow-opacity', '1');
  };

  const resetGlow = () => {
    const node = heroStageRef.current;

    if (!node) {
      return;
    }

    node.style.setProperty('--hero-glow-opacity', simplifyMotion ? '0.5' : '0.82');
  };

  return (
    <section
      ref={heroStageRef}
      className="hero-stage relative flex min-h-screen items-center overflow-visible pt-[8.25rem] pb-16 sm:pt-[9.5rem] md:pt-[13rem] md:pb-20"
      id="hero"
      onPointerMove={updateGlow}
      onPointerEnter={updateGlow}
      onPointerLeave={resetGlow}
    >
      {isSliderSkin ? (
        <>
          <div className="hero-stage__bg absolute inset-0 -z-30 overflow-hidden">
            <picture>
              <source srcSet={heroBackgroundImageAvif} type="image/avif" />
              <source srcSet={heroBackgroundImage} type="image/webp" />
              <img
                src={heroBackgroundImage}
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>

          <div className="hero-stage__grid" aria-hidden="true" />
          <div className="hero-stage__cursor-glow" aria-hidden="true" />
          <div className="hero-stage__orb hero-stage__orb--1" aria-hidden="true" />
          <div className="hero-stage__orb hero-stage__orb--2" aria-hidden="true" />
          <div className="hero-stage__ghost hero-stage__ghost--one" aria-hidden="true">
            GRAPHINEX
          </div>
          <div className="hero-stage__ghost hero-stage__ghost--two" aria-hidden="true">
            STUDIO
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 -z-30 overflow-hidden">
            <picture>
              <source srcSet={heroBackgroundImageAvif} type="image/avif" />
              <source srcSet={heroBackgroundImage} type="image/webp" />
              <img
                src={heroBackgroundImage}
                alt=""
                aria-hidden="true"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>

          <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(8,8,8,0.88),rgba(8,8,8,0.64)_42%,rgba(8,8,8,0.58)_64%,rgba(8,8,8,0.82))]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,200,160,0.12),transparent_22%)]" />
        </>
      )}

      <div className="container-boxed relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="hero-stage__content z-10" id="hero-text">
          {isSliderSkin ? (
            <div className="hero-marquee mb-6 hidden md:block" aria-hidden="true">
              <div className="hero-marquee__track animate-scroll">
                {[...Array(2)].map((_, trackIndex) => (
                  <div key={trackIndex} className="hero-marquee__copy">
                    {marqueeItems.map((item, itemIndex) => (
                      <span
                        key={`${trackIndex}-${item}`}
                        className={`hero-marquee__word ${itemIndex === 1 ? 'hero-marquee__word--accent' : ''}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <motion.span
            initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-pill-black font-hero-ui mb-7 inline-flex px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white"
          >
            <span className="relative z-10">Creative Agency Based in India</span>
          </motion.span>

          <motion.h1 className="hero-stage__title font-hero-display mb-7 max-w-4xl text-[clamp(2.25rem,9vw,6.5rem)] uppercase leading-[0.92] text-white">
            {headingWords.map((word, index) => {
              const cleanWord = word.toLowerCase();
              const isHighlighted = highlightWords.has(cleanWord);

              return (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={simplifyMotion ? false : { opacity: 0, y: '110%' }}
                    animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: '0%' }}
                    transition={{
                      duration: 0.72,
                      delay: 0.08 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`${isHighlighted ? 'text-accent-gradient' : ''} inline-block`}
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.62, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__lede mb-8 max-w-xl text-base leading-8 text-white/80 md:text-lg"
          >
            {hero.subheading}
          </motion.p>

          <motion.div
            initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__actions mb-10 flex flex-wrap gap-3"
          >
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button rounded-full bg-brand-orange px-6 text-white"
            >
              Book a Call
              <ArrowRight size={14} />
            </a>
            <Link
              to="/portfolio"
              className="premium-button rounded-full border border-white/14 bg-white/10 px-6 text-white backdrop-blur-md"
            >
              View Work
              <PlayCircle size={14} />
            </Link>
          </motion.div>

          {isSliderSkin ? (
            <motion.div
              initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.58, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
              className="hero-stage__featured mb-10 rounded-[1.4rem] border border-white/10 bg-white/[0.035] px-4 py-4 backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/52">
                  Featured In
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/36">
                  Real local assets
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {featuredLogos.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-16 items-center justify-center rounded-[1rem] border border-white/10 bg-black/35 px-4"
                  >
                    <OptimizedImage
                      src={item.src}
                      alt={item.title}
                      className="max-h-8 w-auto object-contain opacity-90 grayscale"
                      pictureClassName="flex items-center justify-center"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}

          <motion.div
            ref={statsRef}
            initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stage__stats grid max-w-2xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
          >
            {results.map((res, i) => (
              <motion.div
                key={res.label}
                initial={simplifyMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={simplifyMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.58 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="hero-stage__stat rounded-[1.05rem] border border-white/12 bg-white/8 px-3 py-3 backdrop-blur-md sm:rounded-[1.25rem] sm:px-4 sm:py-4"
              >
                <HeroStatValue value={res.value} active={statsActive} reduceMotion={prefersReducedMotion} />
                <div className="hero-stage__stat-label mt-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/62 sm:mt-2 sm:text-[10px] sm:tracking-[0.2em]">
                  {res.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative mt-10 lg:mt-0" id="hero-media">
          <HeroFlipCard
            imageSrc={heroCardImage}
            imageSrcAvif={heroCardImageAvif}
            alt="Graphinex Studio workspace"
          />
        </div>
      </div>
    </section>
  );
};
