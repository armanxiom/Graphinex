/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useCountUp } from '../hooks/useCountUp';

type StatValueKind = 'count' | 'text';

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

  const target =
    unit === 'M' ? numeric * 1_000_000 :
    unit === 'K' ? numeric * 1_000 :
    numeric;

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

export const Results = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [playId, setPlayId] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          setPlayId((current) => current + 1);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEntered]);

  return (
    <section
      ref={sectionRef}
      className="theme-panel relative overflow-hidden"
      id="about"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,214,183,0.08),transparent_18%)]" />

      <div className="container-boxed relative z-10">
        <div className="mb-14 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="section-kicker"
          >
            Our Impact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="ios-bold text-[clamp(2.3rem,4.8vw,4.8rem)] uppercase leading-[1.02] text-white"
          >
            <span className="block">Numbers that make</span>
            <span className="block">
              the <span className="text-accent-gradient--soft">work feel real.</span>
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {siteConfig.results.map((result, index) => (
            <motion.div
              key={result.label}
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.99 }}
              transition={{ duration: 0.62, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-6 backdrop-blur-sm"
            >
              <StatValue key={`${index}-${playId}`} result={result.value} active={hasEntered} />
              <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/56 transition-colors duration-300 group-hover:text-white/86 md:text-xs">
                {result.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function StatValue({
  result,
  active
}: {
  result: string;
  active: boolean;
}) {
  const parsed = parseStatValue(result);
  const current = useCountUp(active && parsed.kind === 'count', parsed.kind === 'count' ? parsed.target : 0, 1300);

  if (parsed.kind === 'text') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl font-bold leading-none text-brand-orange md:text-5xl"
      >
        {parsed.label}
      </motion.div>
    );
  }

  return (
    <div className="tabular-nums text-3xl font-bold leading-none text-brand-orange md:text-5xl">
      {formatAnimatedValue(current, parsed.target, parsed.raw)}
    </div>
  );
}
