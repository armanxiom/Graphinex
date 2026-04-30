import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

const transition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const
};

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const variants = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        initial: { opacity: 0, y: 40, scale: 0.97, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
        exit: { opacity: 0, scale: 0.97, filter: 'blur(8px)' }
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
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
