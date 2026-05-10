import { useEffect, useRef, useState, type Key } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { testimonials as testimonialData } from '../data/siteConfig';
import { useDevicePerformance } from '../lib/performance';

type Testimonial = (typeof testimonialData)[number];

const AUTO_ROTATE_MS = 6200;
const SWIPE_THRESHOLD = 48;
const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

function AnimatedReview({
  text,
  reducedMotion,
  premiumMotion
}: {
  text: string;
  reducedMotion: boolean;
  premiumMotion: boolean;
}) {
  if (reducedMotion) {
    return <span>{text}</span>;
  }

  return (
    <motion.span
      initial={premiumMotion ? { opacity: 0, y: 10, filter: 'blur(6px)' } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: premiumMotion ? 0.42 : 0.32, ease: MOTION_EASE }}
      className="inline-block"
    >
      {text}
    </motion.span>
  );
}

function TestimonialCard({
  testimonial,
  reducedMotion,
  premiumMotion,
  touchDevice,
  direction,
  onSwipe,
  onInteractionChange
}: {
  key?: Key;
  testimonial: Testimonial;
  reducedMotion: boolean;
  premiumMotion: boolean;
  touchDevice: boolean;
  direction: number;
  onSwipe: (nextDirection: number) => void;
  onInteractionChange: (isInteracting: boolean) => void;
}) {
  const slideDistance = touchDevice ? 32 : 64;
  const bodyTransition = premiumMotion
    ? { duration: 0.72, ease: MOTION_EASE }
    : { duration: 0.42, ease: MOTION_EASE };
  const shellTransition = premiumMotion
    ? { duration: 4.2, repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' as const };
  const glowTransition = premiumMotion
    ? { duration: 8.5, repeat: Infinity, ease: 'easeInOut' as const, repeatDelay: 1.4 }
    : { duration: 10.5, repeat: Infinity, ease: 'easeInOut' as const, repeatDelay: 1.8 };

  return (
    <motion.article
      initial="enter"
      animate="center"
      exit="exit"
      custom={direction}
      variants={{
        enter: (currentDirection: number) => ({
          opacity: 0,
          x: currentDirection > 0 ? slideDistance : -slideDistance,
          y: touchDevice ? 14 : 22,
          scale: premiumMotion ? 0.98 : 0.995,
          filter: premiumMotion ? 'blur(12px)' : 'blur(0px)'
        }),
        center: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)'
        },
        exit: (currentDirection: number) => ({
          opacity: 0,
          x: currentDirection > 0 ? -slideDistance * 0.72 : slideDistance * 0.72,
          y: touchDevice ? 10 : -12,
          scale: premiumMotion ? 0.98 : 0.995,
          filter: premiumMotion ? 'blur(12px)' : 'blur(0px)'
        })
      }}
      transition={bodyTransition}
      drag={touchDevice && !reducedMotion ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.18}
      dragMomentum={false}
      onDragStart={() => onInteractionChange(true)}
      onDragEnd={(_, info) => {
        onInteractionChange(false);

        const swipeThreshold = touchDevice ? 38 : SWIPE_THRESHOLD;
        const velocityThreshold = touchDevice ? 260 : 420;
        const hasSwiped =
          Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > velocityThreshold;

        if (!hasSwiped) {
          return;
        }

        onSwipe(info.offset.x < 0 ? 1 : -1);
      }}
      className="motion-optimised absolute inset-0 flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4 shadow-[0_22px_64px_rgba(0,0,0,0.36)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6 sm:shadow-[0_24px_80px_rgba(0,0,0,0.36)] sm:backdrop-blur-2xl md:p-7 lg:p-8"
      style={{
        touchAction: touchDevice ? 'pan-y' : 'auto'
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,145,48,0.12),transparent_28%)]" />
      <motion.div
        aria-hidden="true"
        animate={reducedMotion ? undefined : { opacity: premiumMotion ? [0.18, 0.36, 0.18] : [0.1, 0.22, 0.1] }}
        transition={reducedMotion ? undefined : shellTransition}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.18),transparent_34%)]"
      />
      <motion.div
        aria-hidden="true"
        animate={reducedMotion ? undefined : { x: ['-20%', '170%'] }}
        transition={reducedMotion ? undefined : glowTransition}
        className={`pointer-events-none absolute inset-y-0 left-[-30%] w-1/4 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] ${
          premiumMotion ? 'blur-2xl opacity-75' : 'blur-xl opacity-55'
        }`}
      />

      <div className="relative flex h-full items-center justify-center px-1 sm:px-2">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col items-center text-center">
          <motion.div
            initial={reducedMotion ? false : premiumMotion ? { opacity: 0, y: 12, filter: 'blur(8px)' } : { opacity: 0, y: 8 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: premiumMotion ? 0.5 : 0.36, delay: 0.16, ease: MOTION_EASE }}
            className="flex flex-col items-center"
          >
            <motion.h3
              initial={reducedMotion ? false : premiumMotion ? { opacity: 0, y: 8 } : { opacity: 0, y: 6 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: premiumMotion ? 0.42 : 0.3, delay: 0.08, ease: MOTION_EASE }}
              className="text-[clamp(1.35rem,2.85vw,2.45rem)] font-semibold tracking-[-0.05em] text-white sm:text-[clamp(1.45rem,2.85vw,2.45rem)]"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'
              }}
            >
              {testimonial.name}
            </motion.h3>

            <motion.p
              initial={reducedMotion ? false : premiumMotion ? { opacity: 0, y: 8 } : { opacity: 0, y: 6 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: premiumMotion ? 0.42 : 0.3, delay: 0.18, ease: MOTION_EASE }}
              className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/56 sm:text-[0.74rem]"
            >
              {testimonial.role}
            </motion.p>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scaleX: 0.35 }}
            animate={reducedMotion ? undefined : { opacity: 1, scaleX: 1 }}
            transition={{ duration: premiumMotion ? 0.44 : 0.32, delay: 0.2, ease: MOTION_EASE }}
            className="mt-6 h-px w-20 origin-center bg-gradient-to-r from-transparent via-brand-orange/55 to-transparent sm:w-24"
          />

          <motion.p
            initial={reducedMotion ? false : premiumMotion ? { opacity: 0, y: 14 } : { opacity: 0, y: 10 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: premiumMotion ? 0.48 : 0.32, delay: 0.34, ease: MOTION_EASE }}
            className="mx-auto mt-6 max-w-[44rem] text-[clamp(0.98rem,4vw,1.08rem)] leading-[1.72] tracking-[-0.02em] text-white/86 sm:text-[clamp(1rem,1.9vw,1.22rem)] sm:leading-[1.85]"
            style={{
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif'
            }}
          >
            <AnimatedReview
              text={testimonial.review}
              reducedMotion={reducedMotion}
              premiumMotion={premiumMotion}
            />
          </motion.p>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0.24, scale: 1 }}
        animate={reducedMotion ? undefined : { opacity: [0.18, 0.32, 0.18], scale: [1, 1.01, 1] }}
        transition={reducedMotion ? undefined : { duration: premiumMotion ? 4.2 : 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-brand-orange/10 sm:rounded-[2rem]"
      />
    </motion.article>
  );
}

export const Testimonials = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isCycling, setIsCycling] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const performance = useDevicePerformance();
  const premiumMotion = !reduceMotion && performance.shouldUsePremiumMotion;
  const touchDevice = performance.isTouchDevice || performance.isMobile;
  const isInteracting = isFocused || isDragging;

  const testimonials = testimonialData || [];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || testimonials.length <= 1) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCycling(entry.isIntersecting);
      },
      {
        threshold: performance.isMobile ? 0.22 : 0.34,
        rootMargin: performance.isMobile ? '0px 0px -14% 0px' : '0px 0px -8% 0px'
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [performance.isMobile, testimonials.length]);

  useEffect(() => {
    if (!isCycling || reduceMotion || testimonials.length <= 1 || isInteracting) {
      return;
    }

    const interval = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [isCycling, reduceMotion, testimonials.length, isInteracting]);

  if (testimonials.length === 0) {
    return null;
  }

  const paginate = (nextDirection: number) => {
    if (testimonials.length <= 1) {
      return;
    }

    setDirection(nextDirection);
    setActiveIndex((current) => (current + nextDirection + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[activeIndex];
  const currentLabel = String(activeIndex + 1).padStart(2, '0');
  const totalLabel = String(testimonials.length).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="theme-panel testimonials-section relative overflow-hidden py-20 text-white md:py-28"
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
          animate={
            reduceMotion
              ? undefined
              : { x: [0, touchDevice ? 8 : 12, 0], y: [0, touchDevice ? -6 : -10, 0], opacity: [0.25, 0.7, 0.25] }
          }
          transition={reduceMotion ? undefined : { duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute right-[12%] top-[24%] h-3 w-3 rounded-full bg-white/20 blur-[1px]"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, touchDevice ? -7 : -10, 0], y: [0, touchDevice ? 5 : 8, 0], opacity: [0.18, 0.5, 0.18] }
          }
          transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-[18%] left-[16%] hidden h-2 w-2 rounded-full bg-brand-orange/35 blur-[1px] sm:block"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, touchDevice ? 5 : 8, 0], y: [0, touchDevice ? -4 : -6, 0], opacity: [0.2, 0.55, 0.2] }
          }
          transition={reduceMotion ? undefined : { duration: 9.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-boxed relative z-10">
        <div className="mb-8 max-w-4xl sm:mb-10 md:mb-14">
          <motion.span
            initial={reduceMotion ? false : premiumMotion ? { opacity: 0, y: 12, filter: 'blur(8px)' } : { opacity: 0, y: 8 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: premiumMotion ? 0.5 : 0.36, ease: MOTION_EASE }}
            viewport={{ once: true }}
            className="section-kicker text-white/58"
          >
            REAL EXPERIENCES • REAL RESULTS
          </motion.span>

          <motion.h2
            initial={reduceMotion ? false : premiumMotion ? { opacity: 0, y: 18, filter: 'blur(10px)' } : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: premiumMotion ? 0.62 : 0.42, ease: MOTION_EASE }}
            viewport={{ once: true }}
            className="ios-bold max-w-[13ch] text-[clamp(2.4rem,6vw,5.8rem)] uppercase leading-[0.94] text-white text-balance sm:max-w-none"
          >
            Trusted by people who want real growth
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : premiumMotion ? { opacity: 0, y: 16 } : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: premiumMotion ? 0.5 : 0.34, ease: MOTION_EASE }}
            viewport={{ once: true }}
            className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:leading-8 md:text-base"
          >
            Premium video editing, branding, and content systems should feel dependable. These reviews reflect the kind of smooth execution and real results Graphinex aims to deliver.
          </motion.p>
        </div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={
              reduceMotion
                ? false
                : premiumMotion
                  ? { opacity: 0, y: 24, scale: 0.985, filter: 'blur(10px)' }
                  : { opacity: 0, y: 16, scale: 0.995 }
            }
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: premiumMotion ? 0.72 : 0.44, ease: MOTION_EASE }}
            viewport={{ once: true, amount: 0.36 }}
            className="motion-optimised relative mx-auto min-h-[clamp(20rem,82vw,24.5rem)] sm:min-h-[clamp(22rem,54vw,26rem)] lg:min-h-[25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials carousel. Use arrow keys or swipe to browse."
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                paginate(1);
              }

              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                paginate(-1);
              }
            }}
          >
            <AnimatePresence mode="sync" custom={direction}>
              <TestimonialCard
                key={activeIndex}
                testimonial={currentTestimonial}
                reducedMotion={reduceMotion}
                premiumMotion={premiumMotion}
                touchDevice={touchDevice}
                direction={direction}
                onSwipe={paginate}
                onInteractionChange={setIsDragging}
              />
            </AnimatePresence>
          </motion.div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex w-full items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  key={activeIndex}
                  initial={reduceMotion ? false : { scaleX: 0.08 }}
                  animate={{ scaleX: 1 }}
                  transition={reduceMotion ? { duration: 0.01 } : { duration: AUTO_ROTATE_MS / 1000, ease: 'linear' }}
                  className="h-full origin-left rounded-full bg-gradient-to-r from-brand-orange via-[#ff8b2c] to-white/55"
                />
              </div>
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-white/46">
                {currentLabel} / {totalLabel}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {testimonials.map((testimonial, index) => (
                <motion.span
                  key={`${testimonial.name}-${index}`}
                  layout
                  animate={
                    index === activeIndex
                      ? { opacity: 1, scaleY: 1.25 }
                      : { opacity: 0.32, scaleY: 1 }
                  }
                  transition={{ duration: 0.32, ease: MOTION_EASE }}
                  className={`h-1.5 rounded-full ${
                    index === activeIndex
                      ? 'w-10 bg-brand-orange shadow-[0_0_16px_rgba(255,106,0,0.35)]'
                      : 'w-2 bg-white/18'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
