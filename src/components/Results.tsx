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
  const hasPlus = Boolean(match[3]);

  const target =
    unit === 'M' ? numeric * 1_000_000 :
    unit === 'K' ? numeric * 1_000 :
    numeric;

  return {
    kind: 'count' as const,
    target,
    raw: trimmed,
    hasPlus
  };
}

function formatAnimatedValue(current: number, target: number, raw: string) {
  const hasPlus = raw.endsWith('+');

  if (target >= 1_000_000) {
    if (current >= target) return raw;

    const millions = current / 1_000_000;
    const value = millions >= 10 ? Math.floor(millions) : Math.floor(millions * 10) / 10;
    return `${value.toFixed(millions >= 10 ? 0 : 1)}M${hasPlus ? '+' : ''}`;
  }

  if (target >= 1_000) {
    if (current >= target) return raw;

    const thousands = current / 1_000;
    const value = thousands >= 10 ? Math.floor(thousands) : Math.floor(thousands * 10) / 10;
    return `${value.toFixed(thousands >= 10 ? 0 : 1)}K${hasPlus ? '+' : ''}`;
  }

  const safeValue = Math.min(target, Math.floor(current));
  return `${safeValue}${hasPlus ? '+' : ''}`;
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
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasEntered]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 18 }}
      animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="bg-brand-dark overflow-hidden relative"
      id="about"
    >
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-boxed relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
          {siteConfig.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.99 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2 group"
            >
              <StatValue key={`${index}-${playId}`} result={result.value} active={hasEntered} />
              <div className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-tight max-w-[120px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                {result.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
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
        className="text-3xl md:text-5xl font-bold text-brand-orange leading-none"
      >
        {parsed.label}
      </motion.div>
    );
  }

  return (
    <div className="text-3xl md:text-5xl font-bold text-brand-orange leading-none tabular-nums">
      {formatAnimatedValue(current, parsed.target, parsed.raw)}
    </div>
  );
}

