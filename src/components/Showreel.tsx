import { motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { YouTubeEmbed } from './YouTubeEmbed';

export const Showreel = () => {
  return (
    <section className="theme-panel relative overflow-hidden" id="showreel">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,214,183,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 select-none whitespace-nowrap text-[15vw] font-black uppercase tracking-[-0.08em] text-white/[0.04]">
        Showcase Showcase Showcase Showcase
      </div>

      <div className="container-boxed relative z-10">
        <div className="mx-auto mb-12 max-w-4xl text-center md:mb-14">
          <motion.span
            initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-brand-orange"
          >
            <PlayCircle size={12} />
            Showcase Reel
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 22, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="text-reveal ios-bold mb-6 text-[clamp(2.5rem,5vw,5.5rem)] uppercase leading-[0.95] text-white"
          >
            {siteConfig.showreel.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-sm leading-8 text-white/68 md:text-base"
          >
            A clean premium walkthrough of the kind of motion, polish, and conversion-focused visual work Graphinex builds for modern brands.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="motion-optimised group relative mx-auto aspect-video w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.32)]"
        >
          <YouTubeEmbed
            videoId={siteConfig.showreel.youtubeId}
            title="Agency Showreel"
            className="absolute inset-0 block h-full w-full"
          />

          <div className="pointer-events-none absolute inset-0 border border-white/10" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_30%,rgba(0,0,0,0.24))] opacity-100 transition-opacity duration-500 group-hover:opacity-70" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/62 md:text-xs"
        >
          {siteConfig.showreel.caption}
        </motion.p>
      </div>
    </section>
  );
};
