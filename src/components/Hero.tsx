/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Camera, PlayCircle, Video } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useCountUp } from '../hooks/useCountUp';

const heroBackgroundVideo = new URL('../../Hero background video/Video.mp4', import.meta.url).href;

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

export const Hero = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [statsActive, setStatsActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -40]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 28]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.04]);

  const headingWords = useMemo(() => siteConfig.hero.heading.split(/\s+/), []);
  const highlightWords = useMemo(
    () => new Set(siteConfig.hero.headingHighlights.map((word) => word.toLowerCase())),
    []
  );

  useEffect(() => {
    const video = backgroundVideoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
  }, []);

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

  return (
    <motion.section
      ref={heroRef}
      initial={{ opacity: 0, scale: 1.01 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen items-center overflow-hidden pt-[11rem] pb-20 md:pt-[13rem]"
      id="hero"
    >
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <video
          ref={backgroundVideoRef}
          src={heroBackgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          className="h-full w-full object-cover object-center"
          aria-hidden="true"
          poster={siteConfig.hero.placeholder}
        />
      </div>

      <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(8,8,8,0.88),rgba(8,8,8,0.64)_42%,rgba(8,8,8,0.58)_64%,rgba(8,8,8,0.82))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,200,160,0.12),transparent_22%)]" />

      <div className="container-boxed relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div style={{ y: textY }} className="z-10" id="hero-text">
          <motion.span
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-pill-black mb-7 inline-flex px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white"
          >
            <span className="relative z-10">Creative Agency Based in India</span>
          </motion.span>

          <motion.h1
            className="ios-bold mb-7 max-w-4xl text-[clamp(2.9rem,7.2vw,6.5rem)] uppercase leading-[0.9] text-white"
          >
            {headingWords.map((word, index) => {
              const cleanWord = word.toLowerCase();
              const isHighlighted = highlightWords.has(cleanWord);

              return (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={reduceMotion ? false : { opacity: 0, y: '110%' }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: '0%' }}
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
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.62, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 max-w-xl text-base leading-8 text-white/80 md:text-lg"
          >
            {siteConfig.hero.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-wrap gap-3"
          >
            <a
              href={siteConfig.contact.whatsapp}
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

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {siteConfig.results.map((res, i) => (
              <motion.div
                key={res.label}
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, delay: 0.58 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.25rem] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-md"
              >
                <HeroStatValue value={res.value} active={statsActive} reduceMotion={Boolean(reduceMotion)} />
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/62">
                  {res.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div style={{ y: mediaY, scale: mediaScale }} className="relative mt-10 lg:mt-0" id="hero-media">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="motion-optimised relative z-10 aspect-[10/12] overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm"
            id="hero-video-container"
          >
            <img
              src="/hero-image.png"
              alt="Graphinex team workspace"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_42%,rgba(0,0,0,0.42))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="max-w-[18rem] rounded-[1.3rem] border border-white/12 bg-black/34 p-4 backdrop-blur-lg">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-brand-orange">
                  Graphinex Studio
                </p>
                <p className="text-sm leading-7 text-white/78">
                  Clean production, sharper hierarchy, and a cinematic surface that keeps the brand feeling premium.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, -16, 0] }}
            transition={reduceMotion ? {} : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="motion-optimised absolute -top-6 right-4 hidden rounded-[1.4rem] border border-white/16 bg-black/50 p-4 text-brand-orange shadow-[0_18px_38px_rgba(0,0,0,0.2)] backdrop-blur-lg sm:block"
          >
            <Camera size={28} />
          </motion.div>
          <motion.div
            animate={reduceMotion ? {} : { y: [0, 16, 0] }}
            transition={reduceMotion ? {} : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="motion-optimised absolute -bottom-6 left-4 hidden rounded-[1.4rem] border border-white/16 bg-black/50 p-4 text-brand-orange shadow-[0_18px_38px_rgba(0,0,0,0.2)] backdrop-blur-lg sm:block"
          >
            <Video size={28} />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
