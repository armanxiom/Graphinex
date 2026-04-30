/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { Camera, Video } from 'lucide-react';

export const Hero = () => {
  const words = siteConfig.hero.heading.split(' ');
  const highlightWords = new Set(siteConfig.hero.headingHighlights.map((word) => word.toLowerCase()));
  
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen pt-24 pb-20 flex items-center overflow-hidden bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat"
      id="hero"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/75 via-black/62 to-black/50" />
      <div className="absolute inset-0 -z-10 hero-grain opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="container-boxed grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left Text */}
        <div className="z-10" id="hero-text">
          <motion.span
            initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8 inline-flex overflow-hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-orange backdrop-blur-lg motion-optimised"
            style={{
              backgroundImage: "url('/agency border/border background.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backdropFilter: 'blur(8px)',
              borderRadius: '999px'
            }}
          >
            <span className="relative z-10 rounded-full px-1 py-0.5 text-white shadow-[0_1px_0_rgba(0,0,0,0.12)]">
              Creative Agency Based in India
            </span>
          </motion.span>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.08
                }
              }
            }}
            className="mb-8 text-4xl font-extrabold uppercase leading-[1.04] tracking-[-0.06em] text-white md:text-6xl"
          >
            {words.map((word, i) => {
              const clean = word.replace(/[,.!]/g, '').toLowerCase();
              return (
                <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
                  <motion.span
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.58, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`inline-block motion-optimised ${highlightWords.has(clean) ? 'text-brand-orange' : ''}`}
                  >
                    {word}&nbsp;
                  </motion.span>
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-sm text-base font-normal leading-relaxed text-white/78 md:text-lg motion-optimised"
          >
            {siteConfig.hero.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-8"
          >
            {siteConfig.results.slice(0, 2).map((res, i) => (
              <div key={i} className="relative motion-optimised">
                <div className="mb-2 text-3xl font-bold leading-none tracking-tight text-white md:text-4xl">{res.value}</div>
                <div className="text-[10px] font-semibold uppercase leading-none tracking-widest text-white/65">{res.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Media */}
        <div className="relative mt-12 lg:mt-0" id="hero-media">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[10/12] overflow-hidden rounded-[2rem] border border-white/18 bg-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.28)] z-10 motion-optimised" 
            id="hero-video-container"
          >
            <img
              src="/hero-image.png"
              alt="Graphinex team workspace"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-white/5" />
            <div className="absolute inset-0 hero-grain opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="max-w-[18rem]">
                <p className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Graphinex Studio</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  Premium agency craft, framed as a clean cinematic surface.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Decorative Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 -right-5 hidden rounded-xl border border-black/5 bg-white p-4 text-brand-orange shadow-lg sm:-top-10 sm:-right-10 sm:block sm:rounded-2xl sm:p-6 motion-optimised"
          >
            <Camera size={32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -left-5 hidden rounded-xl border border-black/5 bg-white p-4 text-brand-orange shadow-lg sm:-bottom-10 sm:-left-10 sm:block sm:rounded-2xl sm:p-6 motion-optimised"
          >
            <Video size={32} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

