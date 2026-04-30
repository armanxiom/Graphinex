import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ExternalLink, Play, X } from 'lucide-react';

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
      className={`py-12 sm:py-20 scroll-mt-32 transition-all duration-300 ${
        active ? 'rounded-[2rem] bg-brand-orange/5 shadow-[0_0_0_1px_rgba(255,122,0,0.12)]' : ''
      }`}
    >
      <div className="container-boxed">
        <div className="mb-8 sm:mb-10">
          <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.35em] mb-4 block">
            Category
          </span>
          <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-black uppercase tracking-tighter text-brand-dark leading-none">
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
                onClick={() => onSelect(item)}
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
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
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
                onClick={() => onSelect(item)}
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
  const stats = siteConfig.results;
  const works = siteConfig.featuredWorks;
  const logos = (siteConfig as any).logos || [];
  const collections = (siteConfig as any).portfolioCollections || {};

  return (
    <div className="bg-brand-light min-h-screen">
      <Navbar />

      <section className="pt-40 pb-20 relative overflow-hidden" id="portfolio-hero">
      <div className="container-boxed text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.4em] mb-6 block neon-orange-soft"
        >
          Showcase
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[40px] sm:text-[64px] md:text-[96px] font-black uppercase tracking-tighter leading-[1.1] sm:leading-[0.9] mb-8 break-words neon-orange"
        >
          {hero.title}
        </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted font-medium max-w-2xl mx-auto px-4"
          >
            {hero.subtitle}
          </motion.p>
        </div>

        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      <section className="py-20" id="showreel">
        <div className="container-boxed max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-[1.5rem] sm:rounded-3xl overflow-hidden shadow-2xl bg-black border-[4px] sm:border-8 border-white aspect-video relative group"
          >
            <iframe
              src={`https://www.youtube.com/embed/${showreel.youtubeId}`}
              className="w-full h-full"
              title="Agency Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
          <p className="text-center mt-8 text-brand-dark/50 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs px-5">
            â€œ{showreel.caption}â€
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20" id="featured-works">
        <div className="container-boxed">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none neon-orange">
              Our Works
            </h2>
            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-brand-orange mt-3 sm:mt-4" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 sm:gap-6">
            {works.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                onClick={() => item.type === 'video' && setSelectedMedia(item)}
                className="group relative bg-brand-light rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 aspect-[3/4] cursor-pointer"
              >
                <div className="w-full h-full overflow-hidden bg-brand-dark/5">
                  {item.type === 'video' ? (
                    idx === 0 ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                      />
                    ) : (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )
                  ) : (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 bg-brand-dark/60 opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 p-3 rounded-full text-white">
                        <Play className="w-6 h-6 fill-current" />
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
            <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-black uppercase tracking-tighter leading-none neon-orange">
              Logos
            </h2>
            <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-brand-orange mt-3 sm:mt-4" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4">
            {logos.map((item: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                onClick={() => setSelectedMedia(item)}
                className="group relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-2xl bg-brand-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-contain p-0 transition-transform duration-300 group-hover:scale-105"
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

      <Footer />
    </div>
  );
}
