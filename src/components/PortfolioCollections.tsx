/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, X } from 'lucide-react';

type SectionKey = 'video-editing' | 'graphic-design' | 'branding';

const categoryLabels: Record<SectionKey, string> = {
  'video-editing': 'Video Editing',
  'graphic-design': 'Graphic Design',
  branding: 'Branding'
};

function MediaSection({
  id,
  title,
  items
}: {
  id: SectionKey;
  title: string;
  items: any[];
}) {
  const isSingleVideoFocus = id === 'video-editing' && items.length === 1 && items[0]?.type === 'video';
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  return (
    <section className="py-12 sm:py-20" id={id}>
      <div className="container-boxed">
        <div className="mb-8 sm:mb-10">
          <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.35em] mb-4 block neon-orange-soft">
            Category
          </span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none neon-orange">
            {title}
          </h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-brand-orange mt-3 sm:mt-4" />
        </div>

        {isSingleVideoFocus ? (
          <div className="flex justify-center">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={`${id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => setSelectedMedia(item)}
                className="group relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] aspect-[3/4] rounded-2xl overflow-hidden bg-brand-light shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls
                    controlsList="nodownload noplaybackrate"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={`${id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => setSelectedMedia(item)}
                className="group relative aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden bg-brand-light shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay={idx === 0}
                    muted
                    loop={idx === 0}
                    playsInline
                    preload="auto"
                    controls
                    controlsList="nodownload noplaybackrate"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300" />

                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/70 flex items-center justify-center text-brand-dark opacity-90">
                    <Play size={12} className="fill-current" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 flex items-center justify-center text-white transition-all duration-300"
            >
              <X size={20} />
            </button>

            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.src}
                poster={selectedMedia.poster}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            ) : (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="w-full h-auto max-h-[80vh] object-contain bg-black"
              />
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}

export function PortfolioCollections({
  collections
}: {
  collections: Record<string, any[]>;
}) {
  const videoEditing = collections['video-editing'] || [];
  const graphicDesign = collections['graphic-design'] || [];
  const branding = collections['branding'] || [];

  return (
    <>
      <MediaSection id="video-editing" title={categoryLabels['video-editing']} items={videoEditing} />
      <MediaSection id="graphic-design" title={categoryLabels['graphic-design']} items={graphicDesign} />
      <MediaSection id="branding" title={categoryLabels.branding} items={branding} />
    </>
  );
}
