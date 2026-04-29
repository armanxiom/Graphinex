/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { Camera, Video } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

export const Hero = () => {
  const words = siteConfig.hero.heading.split(' ');
  
  return (
    <section className="relative min-h-screen pt-28 pb-24 md:pt-32 md:pb-28 flex items-center overflow-hidden bg-brand-light" id="hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.05),transparent_30%)] pointer-events-none" />
      <div className="container-boxed relative grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 xl:gap-24 items-center">
        {/* Left Text */}
        <div className="z-10 max-w-xl xl:max-w-2xl" id="hero-text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-8"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-black/5 text-brand-orange text-[10px] font-bold tracking-[0.22em] uppercase shadow-[0_8px_24px_rgba(15,15,15,0.04)]">
              Creative Agency Based in India
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.92] text-brand-dark uppercase tracking-[-0.06em]">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block mr-[0.18em] align-baseline"
                >
                  {word.split('').map((char, charIndex) => (
                    <motion.span
                      key={`${wordIndex}-${charIndex}`}
                      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.7, delay: 0.35 + (wordIndex * 0.12) + (charIndex * 0.028), ease: [0.16, 1, 0.3, 1] }}
                      className={siteConfig.hero.headingHighlights.includes(word.replace(/[,.!]/, '')) ? "text-brand-orange" : ""}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>
            <p className="text-base md:text-lg text-muted max-w-md leading-relaxed font-normal">
              {siteConfig.hero.subheading}
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
               {siteConfig.results.slice(0, 2).map((res, i) => (
                  <Tilt
                    key={i}
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    perspective={1200}
                    scale={1.02}
                    transitionSpeed={1400}
                    glareEnable
                    glareMaxOpacity={0.12}
                    className="min-w-[150px] sm:min-w-[180px]"
                  >
                    <div className="premium-card premium-card-hover group px-4 sm:px-5 py-4 sm:py-5 bg-white/92 backdrop-blur-sm transform-gpu">
                      <div className="text-3xl md:text-4xl font-semibold text-brand-dark tracking-tight leading-none mb-2">{res.value}</div>
                      <div className="text-[10px] text-muted uppercase font-semibold tracking-[0.22em] leading-none">{res.label}</div>
                    </div>
                  </Tilt>
               ))}
            </div>

            <div className="pt-2">
              <motion.a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="premium-button bg-brand-orange text-white shadow-[0_16px_36px_rgba(255,106,0,0.22)] hover:shadow-[0_20px_48px_rgba(255,106,0,0.3)] premium-focus"
              >
                Get in touch
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Right Media */}
        <div className="relative mt-6 lg:mt-0" id="hero-media">
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1200}
            scale={1.02}
            transitionSpeed={1400}
            glareEnable
            glareMaxOpacity={0.12}
            className="relative block"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[10/12] bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-[4px] sm:border-[10px] border-white shadow-[0_30px_80px_rgba(15,15,15,0.18)] z-10 ring-1 ring-black/5 transform-gpu" 
              id="hero-video-container"
            >
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.96] contrast-[1.02] saturate-[1.03]"
                poster={siteConfig.hero.placeholder}
            >
                <source src={siteConfig.hero.video} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/15 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-20">
                <p className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Showreel 2026</p>
                <h2 className="text-white text-xl md:text-2xl font-semibold uppercase tracking-[-0.04em] leading-none">Graphinex Creative</h2>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/35 flex items-center justify-center backdrop-blur-md bg-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer group shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
                  <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent border-left-[12px] sm:border-left-[15px] border-left-white ml-1.5 sm:ml-2 transition-transform group-hover:scale-110"></div>
                </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-1/3 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))] opacity-70 mix-blend-screen pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.35))] opacity-40 pointer-events-none" />
          </motion.div>
          </Tilt>

          {/* Decorative Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 z-20 bg-white/92 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-[0_18px_40px_rgba(15,15,15,0.12)] border border-black/5 text-brand-orange hidden sm:block"
          >
            <Camera size={window.innerWidth < 640 ? 24 : 32} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -left-5 sm:-bottom-10 sm:-left-10 z-0 bg-white/92 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-[0_18px_40px_rgba(15,15,15,0.12)] border border-black/5 text-brand-orange hidden sm:block"
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
