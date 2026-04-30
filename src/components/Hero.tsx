/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { Camera, Video } from 'lucide-react';

export const Hero = () => {
  const words = siteConfig.hero.heading.split(' ');
  
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative min-h-screen pt-24 pb-20 flex items-center overflow-hidden bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat"
      id="hero"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/75 via-black/62 to-black/50" />
      <div className="absolute inset-0 -z-10 hero-grain opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="container-boxed grid lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
        {/* Left Text */}
        <div className="z-10" id="hero-text">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.05,
                },
              },
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-brand-orange text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm backdrop-blur-[2px]"
            >
              Creative Agency Based in India
            </motion.span>
            <motion.h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] mb-8 text-white uppercase tracking-[-0.05em]">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + (i * 0.08), ease: [0.16, 1, 0.3, 1] }}
                  className={siteConfig.hero.headingHighlights.includes(word.replace(/[,.!]/, '')) ? "text-brand-orange" : ""}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-base md:text-lg text-white/78 max-w-sm mb-10 leading-relaxed font-normal"
            >
              {siteConfig.hero.subheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-8"
            >
               {siteConfig.results.slice(0, 2).map((res, i) => (
                  <div key={i} className="relative">
                    <div className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-none mb-2">{res.value}</div>
                    <div className="text-[10px] text-white/65 uppercase font-semibold tracking-widest leading-none">{res.label}</div>
                  </div>
               ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Media */}
        <div className="relative mt-12 lg:mt-0" id="hero-media">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[10/12] rounded-[2rem] sm:rounded-3xl overflow-hidden border border-white/18 bg-white/8 shadow-2xl z-10" 
            id="hero-video-container"
          >
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
            className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 z-20 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-black/5 text-brand-orange hidden sm:block"
          >
            <Camera size={window.innerWidth < 640 ? 24 : 32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -left-5 sm:-bottom-10 sm:-left-10 z-0 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-2xl border border-black/5 text-brand-orange hidden sm:block"
          >
            <Video size={window.innerWidth < 640 ? 24 : 32} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

