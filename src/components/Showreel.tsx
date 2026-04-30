import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { Play } from 'lucide-react';
import { useRevealOnView } from '../hooks/useRevealOnView';

export const Showreel = () => {
  const { ref, isVisible } = useRevealOnView<HTMLElement>();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="bg-brand-dark overflow-hidden relative"
      id="showreel"
    >
      {/* Decorative text Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-bold uppercase text-white/5 whitespace-nowrap select-none pointer-events-none">
        Showcase Showcase Showcase Showcase
      </div>

      <div className="container-boxed relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-6 block"
          >
            Creative Masterpiece
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] mb-8"
          >
            {siteConfig.showreel.title}
          </motion.h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.01 }}
          className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,107,0,0.15)] border border-white/10 group"
        >
          <iframe 
            src={`https://www.youtube.com/embed/${siteConfig.showreel.youtubeId}?autoplay=0&controls=1&rel=0`}
            className="w-full h-full"
            title="Agency Showreel"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
          
          <div className="absolute inset-0 bg-brand-dark/20 pointer-events-none group-hover:bg-transparent transition-all" />
        </motion.div>
        
        <p className="text-center mt-10 text-white/40 font-black uppercase tracking-[0.3em] text-xs">
          “{siteConfig.showreel.caption}”
        </p>
      </div>
    </motion.section>
  );
};
