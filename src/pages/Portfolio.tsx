import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Play, X } from 'lucide-react';

type SectionKey = 'video-editing' | 'graphic-design' | 'branding';

const categoryLabels: Record<SectionKey, string> = {
  'video-editing': 'Video Editing',
  'graphic-design': 'Graphic Design',
  branding: 'Branding'
};

const categoryOrder: SectionKey[] = ['video-editing', 'graphic-design', 'branding'];

function PortfolioMediaSection({
  id,
  title,
  items,
  active,
  registerRef,
  onSelect
}: {
  id: SectionKey;
  title: string;
  items: any[];
  active: boolean;
  registerRef: (node: HTMLElement | null) => void;
  onSelect: (item: any) => void;
}) {
  const isSingleVideoFocus = id === 'video-editing' && items.length === 1 && items[0]?.type === 'video';

  return (
    <section
      ref={registerRef}
      id={id}
      className={`scroll-mt-32 py-12 transition-all duration-300 sm:py-20 ${
        active ? 'rounded-[2rem] bg-brand-orange/5 shadow-[0_0_0_1px_rgba(255,122,0,0.12)]' : ''
      }`}
    >
      <div className="container-boxed">
        <div className="mb-8 sm:mb-10">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.35em] text-brand-orange">
            Category
          </span>
          <h2 className="text-[28px] font-black uppercase leading-none tracking-tighter text-brand-dark sm:text-[32px] md:text-[48px]">
            {title}
          </h2>
          <div className="mt-3 h-1 w-16 bg-brand-orange sm:mt-4 sm:h-1.5 sm:w-20" />
        </div>

        {isSingleVideoFocus ? (
          <div className="flex justify-center">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={`${id}-${idx}`}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => onSelect(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="premium-card motion-optimised group relative aspect-[3/4] w-full max-w-[360px] cursor-pointer overflow-hidden sm:max-w-[420px] md:max-w-[480px]"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    controls
                    controlsList="nodownload noplaybackrate"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="absolute inset-0 bg-brand-dark/0 transition-colors duration-300 group-hover:bg-brand-dark/10" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-4">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={`${id}-${idx}`}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                onClick={() => onSelect(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="premium-card motion-optimised group relative aspect-[3/4] cursor-pointer overflow-hidden sm:aspect-square"
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    autoPlay={idx === 0}
                    muted
                    loop={idx === 0}
                    playsInline
                    preload="metadata"
                    controls
                    controlsList="nodownload noplaybackrate"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                <div className="absolute inset-0 bg-brand-dark/0 transition-colors duration-300 group-hover:bg-brand-dark/10" />

                {item.type === 'video' && (
                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-brand-dark opacity-90 sm:right-3 sm:top-3 sm:h-8 sm:w-8">
                    <Play size={12} className="fill-current" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const sectionRefs = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const category = new URLSearchParams(location.search).get('category');
    const normalized = category && categoryOrder.includes(category as SectionKey)
      ? (category as SectionKey)
      : null;

    setActiveSection(normalized);

    if (!normalized) return;

    const target = sectionRefs.current[normalized];
    if (!target) return;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    const highlightTimer = window.setTimeout(() => {
      setActiveSection(null);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(highlightTimer);
    };
  }, [location.search]);

  const { hero } = siteConfig.portfolioPage;
  const showreel = siteConfig.showreel;
  const works = siteConfig.featuredWorks;
  const logos = (siteConfig as any).logos || [];
  const collections = (siteConfig as any).portfolioCollections || {};

  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />

      <section className="relative overflow-hidden pt-40 pb-20" id="portfolio-hero">
        <div className="container-boxed relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 block text-[10px] font-bold uppercase tracking-[0.4em] text-brand-orange"
          >
            Showcase
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-[40px] font-black uppercase tracking-tighter leading-[1.05] sm:text-[64px] md:text-[96px] sm:leading-[0.92]"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl px-4 text-base font-medium text-muted sm:text-lg md:text-xl"
          >
            {hero.subtitle}
          </motion.p>
        </div>

        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-orange/5 blur-3xl" />
      </section>

      <section className="py-20" id="showreel">
        <div className="container-boxed max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative aspect-video overflow-hidden rounded-[1.5rem] border-[4px] border-white bg-black shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:rounded-3xl sm:border-8"
          >
            <iframe
              src={`https://www.youtube.com/embed/${showreel.youtubeId}?rel=0`}
              className="h-full w-full"
              title="Agency Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-brand-dark/50 sm:text-xs">
            “{showreel.caption}”
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20" id="featured-works">
        <div className="container-boxed">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[28px] font-black uppercase tracking-tighter leading-none ios-bold sm:text-[32px] md:text-[48px]">
              Our Works
            </h2>
            <div className="mt-3 h-1 w-16 bg-brand-orange sm:mt-4 sm:h-1.5 sm:w-20" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 sm:gap-6">
            {works.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                onClick={() => item.type === 'video' && setSelectedMedia(item)}
                className="premium-card motion-optimised group relative aspect-[3/4] cursor-pointer overflow-hidden"
              >
                <div className="h-full w-full overflow-hidden bg-brand-dark/5">
                  {item.type === 'video' ? (
                    idx === 0 ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className="absolute inset-0 bg-brand-dark/55 opacity-0 transition-all duration-300 group-hover:opacity-100" />

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 p-3 text-white">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioMediaSection
        id="video-editing"
        title={categoryLabels['video-editing']}
        items={collections['video-editing'] || []}
        active={activeSection === 'video-editing'}
        onSelect={(item) => setSelectedMedia(item)}
        registerRef={(node) => {
          sectionRefs.current['video-editing'] = node;
        }}
      />

      <PortfolioMediaSection
        id="graphic-design"
        title={categoryLabels['graphic-design']}
        items={collections['graphic-design'] || []}
        active={activeSection === 'graphic-design'}
        onSelect={(item) => setSelectedMedia(item)}
        registerRef={(node) => {
          sectionRefs.current['graphic-design'] = node;
        }}
      />

      <PortfolioMediaSection
        id="branding"
        title={categoryLabels.branding}
        items={collections.branding || []}
        active={activeSection === 'branding'}
        onSelect={(item) => setSelectedMedia(item)}
        registerRef={(node) => {
          sectionRefs.current.branding = node;
        }}
      />

      <section className="py-12 sm:py-20" id="logos">
        <div className="container-boxed">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[28px] font-black uppercase tracking-tighter leading-none ios-bold sm:text-[32px] md:text-[48px]">
              Logos
            </h2>
            <div className="mt-3 h-1 w-16 bg-brand-orange sm:mt-4 sm:h-1.5 sm:w-20" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-4">
            {logos.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                onClick={() => setSelectedMedia(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.99 }}
                className="premium-card motion-optimised group relative aspect-[3/4] cursor-pointer overflow-hidden sm:aspect-square"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-contain p-0 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Wrong+Path';
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={() => setSelectedMedia(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition-all duration-300 hover:bg-white/40"
            >
              <X size={20} />
            </motion.button>

            {selectedMedia.type === 'video' ? (
              <video
                src={selectedMedia.src}
                poster={selectedMedia.poster}
                controls
                autoPlay
                className="h-auto w-full max-h-[80vh] object-contain"
                preload="metadata"
              />
            ) : (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="h-auto w-full max-h-[80vh] bg-black object-contain"
                loading="lazy"
                decoding="async"
              />
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
