/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { MediaLightbox } from './MediaLightbox';

export const Portfolio = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const featuredWorks = siteConfig.featuredWorks.slice(0, 4);
  const selectedMedia = selectedIndex === null ? null : featuredWorks[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current - 1 + featuredWorks.length) % featuredWorks.length;
    });
  };

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + 1) % featuredWorks.length;
    });
  };

  return (
    <section className="theme-panel relative overflow-hidden py-20 md:py-28" id="work">
      <div className="container-boxed mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.24em] mb-6 block"
            >
              Our Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.08, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.05] mb-0 ios-bold"
            >
              Featured Works
            </motion.h2>
          </div>
        </div>
      </div>

      <div className="container-boxed">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {featuredWorks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              onClick={() => setSelectedIndex(index)}
              className="premium-card group relative aspect-[4/5] cursor-pointer overflow-hidden transition-all duration-300"
            >
              {/* Media */}
              {item.type === "video" ? (
                index === 0 ? (
                  <video 
                    src={item.src} 
                    poster={item.poster}
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                )
              ) : (
                <img 
                  src={item.src} 
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/12 text-white backdrop-blur-md">
                    <Play size={16} className="fill-current" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <MediaLightbox
        media={selectedMedia}
        onClose={() => setSelectedIndex(null)}
        currentIndex={selectedIndex ?? undefined}
        totalCount={featuredWorks.length}
        onPrevious={featuredWorks.length > 1 ? goToPrevious : undefined}
        onNext={featuredWorks.length > 1 ? goToNext : undefined}
      />
    </section>
  );
};
