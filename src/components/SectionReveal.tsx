import { forwardRef, ReactNode } from 'react';
import { motion } from 'motion/react';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';
import { premiumRevealTransition } from '../lib/motion';

type SectionRevealProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export const SectionReveal = forwardRef<HTMLElement, SectionRevealProps>(function SectionReveal(
  {
    id,
    className,
    children,
    delay = 0,
    amount = 0.25,
    once = true,
  },
  ref,
) {
  const { isMobile, shouldReduceMotion } = usePerformanceFlags();
  const distance = isMobile ? 14 : 32;
  const duration = shouldReduceMotion ? 0.01 : isMobile ? 0.7 : 1.0;

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={
        shouldReduceMotion
          ? { opacity: 1, y: 0, scale: 1, filter: 'none' }
          : { opacity: 0, y: distance, scale: 0.98, filter: 'blur(12px)' }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1, y: 0, scale: 1, filter: 'none' }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      transition={{
        ...premiumRevealTransition,
        duration,
        delay,
      }}
      viewport={{
        once,
        amount,
        margin: isMobile ? '-8% 0px -8% 0px' : '-12% 0px -12% 0px',
      }}
      style={{
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.section>
  );
});
