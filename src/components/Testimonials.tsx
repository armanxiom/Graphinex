import { useEffect, useMemo, useRef, useState, type Key } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { testimonials as testimonialData } from '../data/siteConfig';

type Testimonial = (typeof testimonialData)[number];

const AUTO_ROTATE_MS = 6200;

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function AnimatedReview({
  text,
  delay = 0.32,
  reducedMotion
}: {
  text: string;
  delay?: number;
  reducedMotion: boolean;
}) {
  const words = useMemo(() => splitWords(text), [text]);

  if (reducedMotion) {
    return <span>{text}</span>;
  }

  return (
    <span aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.45,
            delay: delay + index * 0.035,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="inline-block will-change-transform"
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

function TestimonialCard({
  testimonial,
  reducedMotion
}: {
  key?: Key;
  testimonial: Testimonial;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : { opacity: 0, y: 28, scale: 0.985, filter: 'blur(12px)' }
      }
      animate={
        reducedMotion
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: -18, scale: 0.985, filter: 'blur(12px)' }
      }
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:min-h-[23rem] sm:p-6 md:min-h-[24rem] md:p-7 lg:min-h-[25rem] lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,145,48,0.12),transparent_28%)]" />
      <motion.div
        aria-hidden="true"
        animate={reducedMotion ? undefined : { opacity: [0.18, 0.36, 0.18] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.18),transparent_34%)]"
      />

      <div className="relative flex h-full items-center justify-center px-1 sm:px-2">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col items-center text-center">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <motion.h3
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.45rem,2.85vw,2.45rem)] font-semibold tracking-[-0.05em] text-white"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              {testimonial.name}
            </motion.h3>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-white/56"
            >
              {testimonial.role}
            </motion.p>
          </motion.div>

          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-brand-orange/55 to-transparent" />

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-[44rem] text-[clamp(1rem,1.9vw,1.22rem)] leading-[1.85] tracking-[-0.02em] text-white/86"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            <AnimatedReview text={testimonial.review} delay={0.44} reducedMotion={reducedMotion} />
          </motion.p>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0.24, scale: 1 }}
        animate={reducedMotion ? undefined : { opacity: [0.18, 0.32, 0.18], scale: [1, 1.015, 1] }}
        transition={reducedMotion ? undefined : { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-brand-orange/10"
      />
    </motion.article>
  );
}

export const Testimonials = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());

  const testimonials = testimonialData || [];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || testimonials.length <= 1) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCycling(entry.isIntersecting);
      },
      {
        threshold: 0.34,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [testimonials.length]);

  useEffect(() => {
    if (!isCycling || reduceMotion || testimonials.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [isCycling, reduceMotion, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[activeIndex];
  const currentLabel = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(testimonials.length).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="theme-panel relative overflow-hidden py-20 text-white md:py-28"
      id="testimonials"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,145,48,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.span
          aria-hidden="true"
          className="absolute left-[8%] top-[18%] h-2.5 w-2.5 rounded-full bg-brand-orange/50 blur-[1px]"
          animate={reduceMotion ? undefined : { x: [0, 12, 0], y: [0, -10, 0], opacity: [0.25, 0.7, 0.25] }}
          transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute right-[12%] top-[24%] h-3 w-3 rounded-full bg-white/20 blur-[1px]"
          animate={reduceMotion ? undefined : { x: [0, -10, 0], y: [0, 8, 0], opacity: [0.18, 0.5, 0.18] }}
          transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-[18%] left-[16%] h-2 w-2 rounded-full bg-brand-orange/35 blur-[1px]"
          animate={reduceMotion ? undefined : { x: [0, 8, 0], y: [0, -6, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={reduceMotion ? undefined : { duration: 9.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-boxed relative z-10">
        <div className="mb-10 max-w-4xl md:mb-14">
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="section-kicker text-white/58"
          >
            REAL EXPERIENCES • REAL RESULTS
          </motion.span>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: 'blur(10px)' }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="ios-bold text-[clamp(2.4rem,6vw,5.8rem)] uppercase leading-[0.94] text-white text-balance"
          >
            Trusted by people who want real growth
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="mt-5 max-w-2xl text-sm leading-8 text-white/68 md:text-base"
          >
            Premium video editing, branding, and content systems should feel dependable. These reviews reflect the kind of smooth execution and real results Graphinex aims to deliver.
          </motion.p>
        </div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985, filter: 'blur(10px)' }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.36 }}
            className="motion-optimised"
          >
            <AnimatePresence mode="wait">
              <TestimonialCard
                key={`${activeIndex}-${currentTestimonial.review.slice(0, 20)}`}
                testimonial={currentTestimonial}
                reducedMotion={Boolean(reduceMotion)}
              />
            </AnimatePresence>
          </motion.div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {testimonials.map((testimonial, index) => (
                <span
                  key={`${testimonial.name}-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === activeIndex
                      ? 'w-10 bg-brand-orange shadow-[0_0_16px_rgba(255,106,0,0.35)]'
                      : 'w-2 bg-white/18'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/46">
              {currentLabel} / {totalLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
