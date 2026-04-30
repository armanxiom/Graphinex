import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useRevealOnView } from '../hooks/useRevealOnView';

export const Showreel = () => {
  const { ref, isVisible } = useRevealOnView<HTMLElement>();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-brand-dark"
      id="showreel"
    >
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 select-none whitespace-nowrap text-[15vw] font-bold uppercase text-white/5">
        Showcase Showcase Showcase Showcase
      </div>

      <div className="container-boxed relative z-10">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange"
          >
            Creative Masterpiece
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-reveal mb-8 text-3xl font-black uppercase tracking-tight leading-[1.05] text-white md:text-5xl lg:text-7xl"
          >
            {siteConfig.showreel.title}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.01 }}
          className="motion-optimised group relative mx-auto aspect-video w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
        >
          <iframe
            src={`https://www.youtube.com/embed/${siteConfig.showreel.youtubeId}?autoplay=0&controls=1&rel=0`}
            className="absolute inset-0 block h-full w-full"
            title="Agency Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-brand-dark/20 transition-all group-hover:bg-transparent" />
        </motion.div>

        <p className="mt-10 text-center text-xs font-black uppercase tracking-[0.3em] text-white/70">
          “{siteConfig.showreel.caption}”
        </p>
      </div>
    </motion.section>
  );
};
