import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Play } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MediaLightbox } from '../components/MediaLightbox';
import { Portfolio as FeaturedWorksSection } from '../components/Portfolio';
import { MediaSection as SharedMediaSection } from '../components/PortfolioCollections';
import { YouTubeEmbed } from '../components/YouTubeEmbed';

type SectionKey = 'video-editing' | 'graphic-design' | 'branding';

type MediaItem = {
  type: string;
  title: string;
  src: string;
  poster?: string;
};

const categoryLabels: Record<SectionKey, string> = {
  'video-editing': 'Video Editing',
  'graphic-design': 'Graphic Design',
  branding: 'Branding'
};

const categoryOrder: SectionKey[] = ['video-editing', 'graphic-design', 'branding'];

function getMediaAspectClass(item: { type?: string; ratio?: string }) {
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
  items: MediaItem[];
  active: boolean;
  registerRef: (node: HTMLElement | null) => void;
  onSelect: (index: number) => void;
}) {
  const isSingleVideoFocus = items.length === 1 && items[0]?.type === 'video';

  return (
    <section
      ref={registerRef}
      id={id}
      className={`scroll-mt-32 py-12 transition-all duration-500 sm:py-20 ${
        active ? 'rounded-[2rem] bg-brand-orange/5 shadow-[0_0_0_1px_rgba(255,106,0,0.12)]' : ''
      }`}
    >
      <div className="container-boxed">
        <div className="mb-8 sm:mb-10">
          <span className="section-kicker">Category</span>
          <h2 className="ios-bold text-[clamp(2rem,4.4vw,4rem)] uppercase leading-[0.96] text-brand-dark">
            {title}
          </h2>
        </div>

        {isSingleVideoFocus ? (
          <div className="flex justify-center">
            {items.map((item, idx) => (
              <motion.button
                key={`${id}-${item.src}-${idx}`}
                type="button"
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(idx)}
                className={`premium-card motion-optimised group relative w-full max-w-[min(92vw,920px)] overflow-hidden text-left ${getMediaAspectClass(item)}`}
              >
                <video
                  src={item.src}
                  poster={item.poster}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.08))] transition-colors duration-300 group-hover:bg-brand-dark/12" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/22 bg-white/12 text-white backdrop-blur-md">
                    <Play size={14} className="fill-current" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {items.map((item, idx) => (
              <motion.button
                key={`${id}-${item.src}-${idx}`}
                type="button"
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: '-80px' }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(idx)}
                className={`premium-card motion-optimised group relative overflow-hidden text-left ${getMediaAspectClass(item)}`}
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
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                    decoding="async"
                  />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.08))] transition-colors duration-300 group-hover:bg-brand-dark/12" />

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/22 bg-white/12 text-white backdrop-blur-md">
                      <Play size={14} className="fill-current" />
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const [selectedGallery, setSelectedGallery] = useState<MediaItem[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const sectionRefs = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});
  const location = useLocation();
  const selectedMedia =
    selectedGallery && selectedIndex !== null ? selectedGallery[selectedIndex] || null : null;

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

    const scrollTimer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);

    const clearTimer = window.setTimeout(() => {
      setActiveSection(null);
    }, 1800);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(clearTimer);
    };
  }, [location.search]);

  const { hero } = siteConfig.portfolioPage;
  const showreel = siteConfig.showreel;
  const logos = siteConfig.logos;
  const collections = siteConfig.portfolioCollections;
  const videoEditingItems = siteConfig.homePortfolioCollections['video-editing'] || collections['video-editing'];

  const openGallery = (gallery: MediaItem[], index: number) => {
    setSelectedGallery(gallery);
    setSelectedIndex(index);
  };

  const closeGallery = () => {
    setSelectedGallery(null);
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (!selectedGallery || selectedIndex === null || selectedGallery.length <= 1) {
      return;
    }

    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current - 1 + selectedGallery.length) % selectedGallery.length;
    });
  };

  const goToNext = () => {
    if (!selectedGallery || selectedIndex === null || selectedGallery.length <= 1) {
      return;
    }

    setSelectedIndex((current) => {
      if (current === null) return current;
      return (current + 1) % selectedGallery.length;
    });
  };

  return (
    <div className="min-h-screen bg-brand-light">
      <Navbar />

      <section className="relative overflow-hidden pb-20 pt-[11rem] md:pt-[13rem]" id="portfolio-hero">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.14),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(17,17,17,0.06),transparent_24%)]" />
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-orange/8 blur-3xl" />

        <div className="container-boxed relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="section-kicker mx-auto justify-center"
          >
            Portfolio
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="ios-bold mx-auto mb-6 max-w-5xl text-[clamp(3rem,9vw,7rem)] uppercase leading-[0.9] text-brand-dark"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.16, duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-base leading-8 text-muted md:text-lg"
          >
            {hero.subtitle}
          </motion.p>
        </div>
      </section>

      <section className="bg-[#0c0c0c] py-16 sm:py-20" id="showreel">
        <div className="container-boxed">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="premium-card relative aspect-video overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
          >
            <YouTubeEmbed
              videoId={showreel.youtubeId}
              title="Graphinex showreel"
              className="absolute inset-0 h-full w-full"
            />
          </motion.div>
          <p className="mt-8 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/58">
            {showreel.caption}
          </p>
        </div>
      </section>

      <div id="featured-works">
        <FeaturedWorksSection />
      </div>

      <SharedMediaSection
        id="video-editing"
        title={categoryLabels['video-editing']}
        items={videoEditingItems}
        active={activeSection === 'video-editing'}
        registerRef={(node) => {
          sectionRefs.current['video-editing'] = node;
        }}
      />

      <PortfolioMediaSection
        id="graphic-design"
        title={categoryLabels['graphic-design']}
        items={collections['graphic-design']}
        active={activeSection === 'graphic-design'}
        onSelect={(index) => openGallery(collections['graphic-design'], index)}
        registerRef={(node) => {
          sectionRefs.current['graphic-design'] = node;
        }}
      />

      <PortfolioMediaSection
        id="branding"
        title={categoryLabels.branding}
        items={collections.branding}
        active={activeSection === 'branding'}
        onSelect={(index) => openGallery(collections.branding, index)}
        registerRef={(node) => {
          sectionRefs.current.branding = node;
        }}
      />

      <section className="py-12 sm:py-20" id="logos">
        <div className="container-boxed">
          <div className="mb-10 sm:mb-12">
            <span className="section-kicker">Identity Work</span>
            <h2 className="ios-bold text-[clamp(2rem,4.4vw,4rem)] uppercase leading-[0.96] text-brand-dark">
            Logos
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
            {logos.map((item, idx) => (
              <motion.button
                key={`${item.src}-${idx}`}
                type="button"
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => openGallery(logos, idx)}
                className="motion-optimised group relative aspect-square overflow-hidden rounded-[1.45rem] bg-transparent shadow-none transition-transform duration-500 hover:-translate-y-1 focus-visible:outline-none"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = siteConfig.brand.logo;
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <MediaLightbox
        media={selectedMedia}
        onClose={closeGallery}
        currentIndex={selectedIndex ?? undefined}
        totalCount={selectedGallery?.length}
        onPrevious={selectedGallery && selectedGallery.length > 1 ? goToPrevious : undefined}
        onNext={selectedGallery && selectedGallery.length > 1 ? goToNext : undefined}
      />

      <Footer />
    </div>
  );
}
