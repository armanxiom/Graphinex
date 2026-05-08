/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { MediaLightbox } from './MediaLightbox';

type SectionKey = 'video-editing' | 'graphic-design' | 'branding';

const categoryLabels: Record<SectionKey, string> = {
  'video-editing': 'Video Editing',
  'graphic-design': 'Graphic Design',
  branding: 'Branding'
};

function getVideoAspectClass(item: { type?: string; ratio?: string }) {
  if (item.type !== 'video') {
    return 'aspect-square';
  }

  if (item.ratio === 'landscape') {
    return 'aspect-[16/9]';
  }

  if (item.ratio === 'square') {
    return 'aspect-square';
  }

  return 'aspect-[9/16]';
}

export function MediaSection({
  id,
  title,
  items,
  active = false,
  registerRef
}: {
  id: SectionKey;
  title: string;
  items: any[];
  active?: boolean;
  registerRef?: (node: HTMLElement | null) => void;
}) {
  const isSingleVideoFocus = id === 'video-editing' && items.length === 1 && items[0]?.type === 'video';
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedMedia = selectedIndex === null ? null : items[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current - 1 + items.length) % items.length;
    });
  };

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + 1) % items.length;
    });
  };

  return (
    <section
      ref={registerRef}
      className={`theme-panel py-12 sm:py-20 ${
        active ? 'rounded-[2rem] bg-brand-orange/5 shadow-[0_0_0_1px_rgba(255,106,0,0.12)]' : ''
      }`}
      id={id}
    >
      <div className="container-boxed">
        <div className="mb-8 sm:mb-10">
          <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.35em] mb-4 block">
            Category
          </span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none ios-bold">
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
                  onClick={() => setSelectedIndex(idx)}
                  className={`premium-card group relative w-full max-w-[min(88vw,360px)] cursor-pointer overflow-hidden sm:max-w-[420px] md:max-w-[480px] ${getVideoAspectClass(item)}`}
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
                    preload="metadata"
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

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.04))] transition-colors duration-300 group-hover:bg-brand-dark/12" />

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/22 bg-white/12 text-white backdrop-blur-md">
                      <Play size={16} className="fill-current" />
                    </div>
                  </div>
                )}
                </motion.div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-4">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={`${id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => setSelectedIndex(idx)}
                className={`premium-card group relative cursor-pointer overflow-hidden ${getVideoAspectClass(item)}`}
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
                    preload="metadata"
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

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.04))] transition-colors duration-300 group-hover:bg-brand-dark/12" />

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/22 bg-white/12 text-white backdrop-blur-md">
                      <Play size={14} className="fill-current" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <MediaLightbox
        media={selectedMedia}
        onClose={() => setSelectedIndex(null)}
        currentIndex={selectedIndex ?? undefined}
        totalCount={items.length}
        onPrevious={items.length > 1 ? goToPrevious : undefined}
        onNext={items.length > 1 ? goToNext : undefined}
      />
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
