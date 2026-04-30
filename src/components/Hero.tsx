/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { SectionReveal } from './SectionReveal';
import { premiumButtonTransition, premiumRevealTransition } from '../lib/motion';

export const Hero = () => {
  const words = siteConfig.hero.heading.split(' ');
  
  return (
    <SectionReveal className="relative min-h-screen pt-28 pb-24 md:pt-32 md:pb-28 flex items-center overflow-hidden bg-brand-light" id="hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,106,0,0.05),transparent_30%)] pointer-events-none" />
      <div className="container-boxed relative grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 xl:gap-24 items-center">
        {/* Left Text */}
        <div className="z-10 max-w-xl xl:max-w-2xl" id="hero-text">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={premiumRevealTransition}
            className="space-y-8"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-black/5 text-brand-orange text-[10px] font-bold tracking-[0.22em] uppercase shadow-[0_8px_24px_rgba(15,15,15,0.04)]">
              Creative Agency Based in India
            </span>
            <h1 className="text-[clamp(2.25rem,10vw,4.5rem)] sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.92] text-brand-dark uppercase tracking-[-0.06em]">
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
            
            <div className="flex justify-center sm:justify-start pt-2">
              <div className="grid w-full max-w-[340px] grid-cols-2 gap-3 sm:max-w-none sm:flex sm:flex-wrap sm:gap-4">
               {siteConfig.results.slice(0, 2).map((res, i) => (
                 <div key={i} className="w-full sm:min-w-[180px]">
                   <div className="premium-card premium-card-hover group h-full w-full px-4 sm:px-5 py-4 sm:py-5 bg-white/92 backdrop-blur-sm transform-gpu">
                     <div className="text-3xl md:text-4xl font-semibold text-brand-dark tracking-tight leading-none mb-2">{res.value}</div>
                     <div className="text-[10px] text-muted uppercase font-semibold tracking-[0.22em] leading-none">{res.label}</div>
                   </div>
                 </div>
               ))}
              </div>
            </div>

            <div className="pt-2 flex justify-center sm:justify-start">
              <motion.a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={premiumButtonTransition}
                className="premium-button mx-auto sm:mx-0 bg-brand-orange text-white shadow-[0_16px_36px_rgba(255,106,0,0.22)] hover:shadow-[0_20px_48px_rgba(255,106,0,0.3)] premium-focus"
              >
                Get in touch
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Right Media */}
        <div className="relative mt-6 lg:mt-0" id="hero-media">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[10/12] bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-[4px] sm:border-[10px] border-white shadow-[0_24px_60px_rgba(15,15,15,0.12)] z-10 ring-1 ring-black/5"
            id="hero-video-container"
          >
            <img
              src={siteConfig.hero.image || siteConfig.hero.placeholder}
              alt="Graphinex hero preview"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </SectionReveal>
  );
};
