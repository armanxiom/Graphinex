/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState, type Key } from 'react';
import { Link } from 'react-router-dom';
import { serviceOverviews } from '../data/siteConfig';
import { useDevicePerformance } from '../lib/performance';
import { OptimizedImage } from './OptimizedImage';

type ServiceOverview = (typeof serviceOverviews)[number];
const MotionLink = motion(Link);

function ServiceRow({
  service,
  index
}: {
  key?: Key;
  service: ServiceOverview;
  index: number;
}) {
  const rowRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef(false);
  const [active, setActive] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const performance = useDevicePerformance();
  const reduceMotion = Boolean(useReducedMotion()) || !performance.shouldUsePremiumMotion;
  const portfolioHref = `/portfolio?category=${service.portfolioCategory}`;

  const desktopInteractive = supportsHover && !reduceMotion && performance.shouldUseScrollFX;

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');

    const updateCapability = () => {
      setSupportsHover(query.matches);
    };

    updateCapability();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', updateCapability);
    } else {
      query.addListener(updateCapability);
    }

    return () => {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', updateCapability);
      } else {
        query.removeListener(updateCapability);
      }
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const preview = previewRef.current;

    if (!preview) {
      return;
    }

    if (!desktopInteractive) {
      preview.style.opacity = '0';
      preview.style.transform = 'translate3d(0, -50%, 0) scale(0.6)';

      return;
    }

    const row = rowRef.current;

    if (!row) {
      return;
    }

    let disposed = false;
    let cleanup = () => undefined;

    const init = async () => {
      const { default: gsap } = await import('gsap');

      if (disposed) {
        return;
      }

      const xTo = gsap.quickTo(preview, 'x', { duration: 0.22, ease: 'power3.out' });
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.22, ease: 'power3.out' });
      const rotationTo = gsap.quickTo(preview, 'rotation', { duration: 0.22, ease: 'power3.out' });

      gsap.set(preview, {
        opacity: 0,
        scale: 0.6,
        x: 0,
        y: 0,
        rotation: 0,
        yPercent: -50,
        transformOrigin: 'center center'
      });

      const showPreview = () => {
        activeRef.current = true;
        setActive(true);
        gsap.to(preview, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power3.out'
        });
      };

      const hidePreview = () => {
        activeRef.current = false;
        setActive(false);
        gsap.to(preview, {
          opacity: 0,
          scale: 0.6,
          duration: 0.24,
          ease: 'power3.out'
        });
      };

      const movePreview = (event: PointerEvent) => {
        if (!activeRef.current) {
          return;
        }

        const rect = row.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;

        const normalizedX = pointerX / rect.width - 0.5;
        const normalizedY = pointerY / rect.height - 0.5;

        xTo(normalizedX * 108);
        yTo(normalizedY * 44);
        rotationTo(normalizedX * 4.5);
      };

      row.addEventListener('pointerenter', showPreview);
      row.addEventListener('pointerleave', hidePreview);
      row.addEventListener('pointermove', movePreview);

      cleanup = () => {
        row.removeEventListener('pointerenter', showPreview);
        row.removeEventListener('pointerleave', hidePreview);
        row.removeEventListener('pointermove', movePreview);
      };
    };

    void init();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [desktopInteractive]);

  return (
    <Link to={portfolioHref} className="block text-inherit no-underline">
      <motion.article
        ref={rowRef}
        initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={desktopInteractive ? { y: -2 } : undefined}
        transition={{ duration: 0.52, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: '-80px' }}
        className="group relative overflow-visible border-b border-white/8 bg-[#0a0a0a] text-white transition-colors duration-500 hover:border-white/12 hover:bg-white/[0.025]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,106,0,0.08),rgba(255,106,0,0.015)_18%,transparent_42%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,106,0,0.14),transparent_26%)]" />
        </div>

        <div className="relative flex min-h-[108px] cursor-pointer flex-col gap-4 px-4 py-5 outline-none transition-all duration-500 sm:min-h-[122px] sm:px-8 sm:py-6 md:py-7 lg:min-h-[152px] lg:px-16 xl:px-20">
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-6">
              <span className="mt-2 min-w-[2.85rem] text-[10px] font-semibold uppercase tracking-[0.32em] text-white/38 sm:min-w-[3.25rem]">
                0{index + 1}
              </span>

              <div className="min-w-0 max-w-3xl">
                <h3
                  className={`text-[clamp(1.55rem,7.5vw,2.5rem)] font-semibold uppercase leading-[0.92] transition-colors duration-300 sm:text-[clamp(2.05rem,4.4vw,4.9rem)] ${
                    active ? 'text-brand-orange' : 'text-white'
                  }`}
                >
                  {service.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56 transition-colors duration-300 group-hover:text-white/72 md:text-base">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-4 lg:flex">
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/30">
                Open portfolio
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-orange transition-all duration-500 group-hover:border-brand-orange/55 group-hover:bg-brand-orange group-hover:text-white group-hover:translate-x-1 group-hover:shadow-[0_0_0_8px_rgba(255,106,0,0.08)]">
                <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>

        <div
          ref={previewRef}
          className="pointer-events-none absolute right-[clamp(18px,4vw,72px)] top-1/2 hidden h-[clamp(180px,18vw,250px)] w-[clamp(250px,28vw,420px)] overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/75 shadow-[0_26px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl md:block"
        >
          <div className="absolute left-4 top-4 z-10 inline-flex h-8 items-center rounded-full border border-white/12 bg-black/35 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/88 backdrop-blur-md">
            {service.icon}
          </div>
          <OptimizedImage
            src={service.previewImage}
            alt={`${service.title} preview`}
            className="h-full w-full object-cover"
            pictureClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_45%,rgba(0,0,0,0.26))]" />
        </div>
      </motion.article>
    </Link>
  );
}

export const Services = () => {
  const services = serviceOverviews;
  const performance = useDevicePerformance();

  return (
    <section className="theme-panel relative overflow-hidden py-20 md:py-28" id="services">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,180,112,0.08),transparent_26%)]" />

      <div className="container-boxed relative z-10">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <motion.span
              initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              whileInView={!performance.shouldUsePremiumMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="section-kicker text-white/55"
            >
              OUR SERVICES
            </motion.span>
            <motion.h2
              initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={!performance.shouldUsePremiumMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="ios-bold text-[clamp(2.5rem,5vw,5.8rem)] uppercase leading-[0.94] text-white"
            >
              AGENCY SPECIALIZATIONS
            </motion.h2>
            <motion.p
              initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
              whileInView={!performance.shouldUsePremiumMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/64 md:text-base"
            >
              Cinematic service rows with mouse-follow previews and subtle orange highlights so the experience stays premium on every screen.
            </motion.p>
          </div>

          <MotionLink
            to="/portfolio"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.99 }}
            className="premium-button rounded-full border border-white/12 bg-white px-6 text-black shadow-[0_18px_38px_rgba(255,255,255,0.08)]"
          >
            Browse Portfolio
            <ArrowRight size={14} />
          </MotionLink>
        </div>

        <div className="border-t border-white/8">
          {services.map((service, index) => (
            <ServiceRow key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
