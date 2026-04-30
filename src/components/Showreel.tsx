import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { SectionReveal } from './SectionReveal';
import { ScrollReveal } from './ScrollReveal';

export const Showreel = () => {
  return (
    <SectionReveal className="bg-brand-dark overflow-hidden relative" id="showreel">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-bold uppercase text-white/5 whitespace-nowrap select-none pointer-events-none">
        Showcase Showcase Showcase Showcase
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container-boxed relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-14 md:mb-16">
          <ScrollReveal className="inline-block" distance={18} blur={6}>
          <motion.span
            className="luxury-section-kicker mb-6 block"
          >
            Creative Masterpiece
          </motion.span>
          </ScrollReveal>
          <ScrollReveal distance={24} blur={8} delay={0.08}>
          <motion.h2
            className="text-3xl md:text-5xl lg:text-7xl font-semibold uppercase tracking-[-0.05em] leading-[0.96] text-white mb-8"
          >
            {siteConfig.showreel.title}
          </motion.h2>
          </ScrollReveal>
          <p className="text-sm md:text-base text-white/65 max-w-2xl mx-auto leading-relaxed">
            Watch how strategic editing, polished motion, and brand-first creative direction bring ideas to life.
          </p>
        </div>

        <ScrollReveal className="relative aspect-video max-w-5xl mx-auto rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden shadow-[0_24px_80px_rgba(255,107,0,0.14)] border border-white/10 group ring-1 ring-white/10 bg-black" distance={34} blur={10} delay={0.12}>
          <iframe
            src={`https://www.youtube.com/embed/${siteConfig.showreel.youtubeId}?autoplay=0&controls=1&rel=0`}
            className="w-full h-full"
            title="Agency Showreel"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </ScrollReveal>

        <p className="text-center mt-10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">
          {siteConfig.showreel.caption}
        </p>
      </div>
    </SectionReveal>
  );
};
