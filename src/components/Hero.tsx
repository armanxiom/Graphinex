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
    <section className="relative min-h-screen pt-24 pb-20 flex items-center overflow-hidden bg-brand-light" id="hero">
      <div className="container-boxed grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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
              className="inline-block px-4 py-1.5 rounded-full bg-white border border-black/5 text-brand-orange text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-sm"
            >
              Creative Agency Based in India
            </motion.span>
            <motion.h1 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-8 text-brand-dark uppercase tracking-tight">
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
              className="text-base md:text-lg text-muted max-w-sm mb-10 leading-relaxed font-normal"
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
                    <div className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tight leading-none mb-2">{res.value}</div>
                    <div className="text-[10px] text-muted uppercase font-semibold tracking-widest leading-none">{res.label}</div>
                  </div>
               ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Media */}
        <div className="relative mt-12 lg:mt-0" id="hero-media">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[10/12] bg-white rounded-[2rem] sm:rounded-3xl overflow-hidden border-[4px] sm:border-8 border-white shadow-2xl z-10" 
            id="hero-video-container"
          >
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.95]"
                poster={siteConfig.hero.placeholder}
            >
                <source src={siteConfig.hero.video} type="video/mp4" />
            </video>
            
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 to-transparent z-20">
                <p className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Showreel 2026</p>
                <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight leading-none">Graphinex Creative</h2>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer group shadow-2xl">
                  <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent border-left-[12px] sm:border-left-[15px] border-left-white ml-1.5 sm:ml-2 transition-transform group-hover:scale-110"></div>
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
          
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-orange/10 rounded-full blur-[100px] -z-10" />
          <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-brand-orange/5 rounded-full blur-[100px] -z-10" />
        </div>
      </div>
    </section>
  );
};

