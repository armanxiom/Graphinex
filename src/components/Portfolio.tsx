/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Play, X } from 'lucide-react';

export const Portfolio = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const featuredWorks = siteConfig.featuredWorks.slice(0, 4);

  return (
    <section className="bg-white" id="work">
      <div className="container-boxed mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-6 block">Our Portfolio</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1] mb-0 ios-bold">
              Featured Works
            </h2>
          </div>
        </div>
      </div>

      <div className="container-boxed">
        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {featuredWorks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              onClick={() => item.type === 'video' && setSelectedVideo(item)}
              className="group relative aspect-[4/5] bg-brand-light rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
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
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )
              ) : (
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
              />

              {item.type === 'video' && (
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Play size={14} className="fill-current" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
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
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-all duration-300"
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
    </section>
  );
};
