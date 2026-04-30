/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';
import { SectionReveal } from './SectionReveal';

const getAltText = (item: any) => `${item.title} by Graphinex Creative`;

export const Portfolio = () => {
  const containerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const featuredWorks = siteConfig.featuredWorks.slice(0, 4);
  const { shouldUseHeavyEffects, shouldReduceMotion } = usePerformanceFlags();

  return (
    <SectionReveal className="bg-white relative" id="work">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="container-boxed mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <span className="luxury-section-kicker mb-6 block">Our Portfolio</span>
            <h2 className="luxury-heading mb-0">
              Featured <span className="text-brand-orange">Works</span>
            </h2>
          </div>
          <div className="hidden lg:block pb-2">
            <p className="luxury-subcopy max-w-[280px]">
              Transforming businesses through elite-level visuals and creative strategy.
            </p>
          </div>
        </div>
      </div>

      <div className="container-boxed">
        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {featuredWorks.map((item, index) => {
            const media = item.type === 'video'
              ? index === 0 && !shouldReduceMotion
                ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )
                : (
                  <img
                    src={item.poster}
                    alt={getAltText(item)}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )
              : (
                <img
                  src={item.src}
                  alt={getAltText(item)}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              );

            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
                viewport={{ once: true }}
                onClick={() => item.type === 'video' && setSelectedVideo(item)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative aspect-[4/5] bg-brand-light rounded-[1.5rem] overflow-hidden cursor-pointer premium-card transition-all duration-500 shadow-[0_12px_30px_rgba(15,15,15,0.05)] transform-gpu"
              >
                {media}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/45 via-brand-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {item.type === 'video' && (
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Play size={14} className="fill-current" />
                  </div>
                )}
              </motion.div>
            );

            if (!shouldUseHeavyEffects) {
              return <div key={index}>{card}</div>;
            }

            return (
              <Tilt
                key={index}
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1200}
                scale={1.02}
                transitionSpeed={1400}
                glareEnable
                glareMaxOpacity={0.1}
                className="block h-full"
              >
                {card}
              </Tilt>
            );
          })}
        </div>
        
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all duration-300"
            >
              <X size={20} />
            </button>

            {/* Video */}
            <video 
              src={selectedVideo.src}
              poster={selectedVideo.poster}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </motion.div>
        </div>
      )}
    </SectionReveal>
  );
};
