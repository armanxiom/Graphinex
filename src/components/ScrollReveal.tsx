import { ReactNode, useRef } from 'react';
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'motion/react';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  distance?: number;
  blur?: number;
  scale?: number;
};

export function ScrollReveal({
  children,
  className,
  id,
  delay = 0,
  distance = 28,
  blur = 8,
  scale = 0.985,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { shouldReduceMotion, isMobile } = usePerformanceFlags();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 1.12', 'start 0.2'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.35,
  });

  const staggeredProgress = useTransform(smoothProgress, [0, Math.max(0.001, delay), 1], [0, 0, 1]);
  const opacity = useTransform(staggeredProgress, [0, 0.15, 1], [0, 0.3, 1]);
  const y = useTransform(staggeredProgress, [0, 1], [isMobile ? distance * 0.65 : distance, 0]);
  const scaleValue = useTransform(staggeredProgress, [0, 1], [scale, 1]);
  const blurValue = useTransform(staggeredProgress, [0, 0.3, 1], [blur, blur * 0.3, 0]);
  const filter = useMotionTemplate`blur(${blurValue}px)`;

  if (shouldReduceMotion) {
    return <div ref={ref} id={id} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={{
        opacity,
        y,
        scale: scaleValue,
        filter,
        willChange: 'transform, opacity, filter',
      }}
    >
      {children}
    </motion.div>
  );
}
