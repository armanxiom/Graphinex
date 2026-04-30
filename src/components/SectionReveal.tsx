import { forwardRef, ReactNode, useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'motion/react';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';

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
  const localRef = useRef<HTMLElement | null>(null);
  const distance = isMobile ? 20 : 42;
  const blurStrength = shouldReduceMotion ? 0 : isMobile ? 4 : 8;

  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ['start 1.18', 'start 0.18'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  const staggeredProgress = useTransform(smoothProgress, [0, Math.max(0.001, delay), 1], [0, 0, 1]);
  const opacity = useTransform(staggeredProgress, [0, 0.18, 1], [0, 0.38, 1]);
  const y = useTransform(staggeredProgress, [0, 1], [distance, 0]);
  const scale = useTransform(staggeredProgress, [0, 1], [0.985, 1]);
  const blur = useTransform(staggeredProgress, [0, 0.35, 1], [blurStrength, blurStrength * 0.35, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  const setRefs = (node: HTMLElement | null) => {
    localRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <motion.section
      ref={setRefs}
      id={id}
      className={className}
      style={
        shouldReduceMotion
          ? undefined
          : {
              opacity,
              y,
              scale,
              filter,
              willChange: 'transform, opacity, filter',
            }
      }
      data-section-reveal=""
      data-section-amount={amount}
      data-section-once={once ? 'true' : 'false'}
    >
      {children}
    </motion.section>
  );
});
