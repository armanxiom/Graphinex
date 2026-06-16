/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { process as workflowSteps } from '../data/siteConfig';
import { useDevicePerformance } from '../lib/performance';
import { OptimizedImage } from './OptimizedImage';

type WorkflowStep = (typeof workflowSteps)[number];

const previewSize = {
  width: 312,
  height: 226
};

export const Process = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  const performance = useDevicePerformance();
  const reduceMotion = Boolean(useReducedMotion()) || !performance.shouldUsePremiumMotion;

  const interactive = hoverCapable && !reduceMotion && performance.shouldUseScrollFX;
  const steps = workflowSteps as ReadonlyArray<WorkflowStep>;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const updateHoverCapability = () => {
      setHoverCapable(mediaQuery.matches);
    };

    updateHoverCapability();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateHoverCapability);
    } else {
      mediaQuery.addListener(updateHoverCapability);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateHoverCapability);
      } else {
        mediaQuery.removeListener(updateHoverCapability);
      }
    };
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!interactive) {
      return;
    }

    const preview = previewRef.current;
    const cursor = cursorRef.current;

    if (!preview || !cursor) {
      return;
    }

    const shouldShow = activeIndex !== null;

    preview.style.opacity = shouldShow ? '1' : '0';
    cursor.style.opacity = shouldShow ? '1' : '0';
  }, [activeIndex, interactive]);

  useEffect(() => {
    if (!interactive) {
      const fallbackTargets = [cursorRef.current, previewRef.current].filter(Boolean);

      if (fallbackTargets.length > 0) {
        fallbackTargets.forEach((target) => {
          if (target instanceof HTMLElement) {
            target.style.opacity = '0';
            target.style.transform = 'scale(0.92) translate3d(0, 0, 0)';
          }
        });
      }

      return;
    }

    const section = sectionRef.current;
    const cursor = cursorRef.current;
    const preview = previewRef.current;

    if (!section || !cursor || !preview) {
      return;
    }

    let disposed = false;
    let cleanup = () => undefined;

    const init = async () => {
      const { default: gsap } = await import('gsap');

      if (disposed) {
        return;
      }

      const setCursorX = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3.out' });
      const setCursorY = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3.out' });
      const setPreviewX = gsap.quickTo(preview, 'x', { duration: 0.24, ease: 'power3.out' });
      const setPreviewY = gsap.quickTo(preview, 'y', { duration: 0.24, ease: 'power3.out' });

      const syncPreviewVisibility = () => {
        const shouldShow = activeIndexRef.current !== null;

        gsap.to(preview, {
          opacity: shouldShow ? 1 : 0,
          scale: shouldShow ? 1 : 0.92,
          duration: shouldShow ? 0.28 : 0.2,
          ease: 'power3.out'
        });

        gsap.to(cursor, {
          opacity: shouldShow ? 1 : 0,
          scale: shouldShow ? 1 : 0.65,
          duration: shouldShow ? 0.22 : 0.18,
          ease: 'power3.out'
        });
      };

      syncPreviewVisibility();

      const handlePointerMove = (event: PointerEvent) => {
        if (activeIndexRef.current === null) {
          return;
        }

        const previewWidth = previewSize.width;
        const previewHeight = previewSize.height;

        let x = event.clientX + 28;
        let y = event.clientY - previewHeight / 2;

        if (x + previewWidth > window.innerWidth - 20) {
          x = event.clientX - previewWidth - 28;
        }

        x = Math.max(20, Math.min(x, window.innerWidth - previewWidth - 20));
        y = Math.max(20, Math.min(y, window.innerHeight - previewHeight - 20));

        setCursorX(event.clientX);
        setCursorY(event.clientY);
        setPreviewX(x);
        setPreviewY(y);
      };

      const handlePointerLeave = () => {
        activeIndexRef.current = null;
        setActiveIndex(null);
        syncPreviewVisibility();
      };

      section.addEventListener('pointermove', handlePointerMove);
      section.addEventListener('pointerleave', handlePointerLeave);

      cleanup = () => {
        section.removeEventListener('pointermove', handlePointerMove);
        section.removeEventListener('pointerleave', handlePointerLeave);
      };
    };

    void init();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [interactive]);

  const activateStep = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  const deactivateStep = () => {
    activeIndexRef.current = null;
    setActiveIndex(null);
  };

  return (
    <section
      ref={sectionRef}
      className={`theme-panel relative overflow-hidden py-20 md:py-28 ${interactive ? 'cursor-none' : ''}`}
      id="process"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,180,112,0.08),transparent_24%)]" />

      {interactive && (
        <>
          <div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-[90] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,#ff6a00_0%,#ff3c3c_100%)] opacity-0 shadow-[0_0_24px_rgba(255,106,0,0.35)]"
          />

          <div
            ref={previewRef}
            className="pointer-events-none fixed left-0 top-0 z-[80] w-[clamp(240px,22vw,312px)] overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/80 opacity-0 shadow-[0_24px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl"
          >
            <AnimatePresence mode="wait">
              {activeIndex !== null && (
                <motion.div
                  key={steps[activeIndex].previewImage}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[180px] w-full"
                >
                  <OptimizedImage
                    src={steps[activeIndex].previewImage}
                    alt={`${steps[activeIndex].name} preview`}
                    className="h-[180px] w-full object-cover"
                    pictureClassName="block h-[180px] w-full"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-white/10 bg-black/65 px-4 py-3">
              <div className="text-sm font-semibold text-white">
                {activeIndex !== null ? steps[activeIndex].name : 'Select a row'}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container-boxed relative z-10">
        <div className="mb-12 max-w-4xl md:mb-16">
          <motion.span
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="section-kicker text-white/55"
          >
            OUR WORKFLOW
          </motion.span>
          <motion.h2
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="ios-bold text-[clamp(2.4rem,5vw,5.6rem)] uppercase leading-[0.95] text-white"
          >
            THE CREATIVE JOURNEY
          </motion.h2>
        </div>

        <div className="border-t border-white/8">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={step.step}
                type="button"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                onPointerEnter={() => {
                  if (interactive) {
                    activateStep(index);
                  }
                }}
                onPointerLeave={() => {
                  if (interactive) {
                    deactivateStep();
                  }
                }}
                onFocus={() => {
                  if (interactive) {
                    activateStep(index);
                  }
                }}
                onBlur={() => {
                  if (interactive) {
                    deactivateStep();
                  }
                }}
                onClick={() => {
                  if (!interactive) {
                    setActiveIndex((current) => (current === index ? null : index));
                  }
                }}
                aria-pressed={activeIndex === index}
                className="group relative flex w-full flex-col overflow-hidden border-b border-white/8 bg-[#0a0a0a] text-left transition-colors duration-300 hover:bg-white/[0.025] focus-visible:outline-none lg:min-h-[148px] lg:px-0"
              >
                <div className="flex w-full flex-col gap-5 px-5 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-16 xl:px-20">
                  <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
                    <span className="mt-2 min-w-[2.75rem] text-[10px] font-semibold uppercase tracking-[0.34em] text-white/38 sm:min-w-[3.25rem]">
                      {step.step}
                    </span>

                    <div className="min-w-0">
                      <h3
                        className={`text-[clamp(2.05rem,4.5vw,4.9rem)] font-semibold uppercase leading-[0.92] transition-colors duration-300 ${
                          isActive ? 'text-brand-orange' : 'text-white'
                        }`}
                      >
                        {step.name}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56 transition-colors duration-300 group-hover:text-white/68 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>

                </div>

                <AnimatePresence initial={false}>
                  {!interactive && isActive && (
                    <motion.div
                      key={`${step.step}-mobile`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden lg:hidden"
                    >
                      <div className="px-5 pb-5 sm:px-8">
                        <div className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-white/[0.03]">
                          <OptimizedImage
                            src={step.previewImage}
                            alt={`${step.name} preview`}
                            className="h-[180px] w-full object-cover"
                            pictureClassName="block h-[180px] w-full"
                            priority
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
