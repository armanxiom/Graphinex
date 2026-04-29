import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';

export const Showreel = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { shouldReduceMotion } = usePerformanceFlags();

  return (
    <section className="bg-brand-dark overflow-hidden relative" id="showreel">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-bold uppercase text-white/5 whitespace-nowrap select-none pointer-events-none">
        Showcase Showcase Showcase Showcase
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-boxed relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-14 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="luxury-section-kicker mb-6 block"
          >
            Creative Masterpiece
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-7xl font-semibold uppercase tracking-[-0.05em] leading-[0.96] text-white mb-8"
          >
            {siteConfig.showreel.title}
          </motion.h2>
          <p className="text-sm md:text-base text-white/65 max-w-2xl mx-auto leading-relaxed">
            Watch how we turn content into clients through strategic editing, polished motion, and brand-first creative direction.
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setIsLoaded(true)}
          className="relative aspect-video max-w-5xl mx-auto rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(255,107,0,0.14)] border border-white/10 group ring-1 ring-white/10 bg-black block w-full text-left"
        >
          {!isLoaded ? (
            <>
              <img
                src={siteConfig.hero.placeholder}
                alt="Graphinex showreel preview"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                  <Play size={16} className="fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                    Play showreel
                  </span>
                </div>
              </div>
            </>
          ) : shouldReduceMotion ? (
            <img
              src={siteConfig.hero.placeholder}
              alt="Graphinex showreel preview"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${siteConfig.showreel.youtubeId}?autoplay=0&controls=1&rel=0`}
              className="w-full h-full"
              title="Agency Showreel"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </motion.button>

        <p className="text-center mt-10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
          {siteConfig.showreel.caption}
        </p>
      </div>
    </section>
  );
};
