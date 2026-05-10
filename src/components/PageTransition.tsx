import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useDevicePerformance } from '../lib/performance';

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const performance = useDevicePerformance();
  const reduceMotion = Boolean(useReducedMotion()) || !performance.shouldUsePremiumMotion;
  const transition = performance.shouldUsePremiumMotion
    ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  const variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        initial: { opacity: 0, y: 24, scale: 0.985, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.985, filter: 'blur(4px)' }
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${location.pathname}${location.search}`}
        className="min-h-screen motion-optimised"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        style={{
          willChange: performance.shouldUsePremiumMotion
            ? 'transform, opacity, filter'
            : 'transform, opacity'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
