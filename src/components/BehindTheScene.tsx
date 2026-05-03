import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

type BTSItem = {
  id: string;
  fileName: string;
  objectPosition: string;
};

const BTS_SOURCE_ROOT = '/behind scene';

const BTS_MEDIA: BTSItem[] = [
  {
    id: 'bts-01',
    fileName: 'behind scene 1.mp4',
    objectPosition: '50% 18%'
  },
  {
    id: 'bts-02',
    fileName: 'behind scene 2.mp4',
    objectPosition: '50% 22%'
  },
  {
    id: 'bts-03',
    fileName: 'behind scene 3.mp4',
    objectPosition: '50% 30%'
  },
  {
    id: 'bts-04',
    fileName: 'behind scene 4.mp4',
    objectPosition: '50% 20%'
  },
  {
    id: 'bts-05',
    fileName: 'behind scene 5.mp4',
    objectPosition: '50% 24%'
  },
  {
    id: 'bts-06',
    fileName: 'behind scene 6.mp4',
    objectPosition: '50% 18%'
  }
];

const buildVideoSrc = (fileName: string) => encodeURI(`${BTS_SOURCE_ROOT}/${fileName}`);

function handleVideoReady(video: HTMLVideoElement) {
  try {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.loop = true;
    video.preload = 'auto';
    video.controls = false;
  } catch {
    // Some browsers lock down media flags until user interaction.
  }

  const playPromise = video.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Muted autoplay should recover once the browser allows playback.
    });
  }
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5 sm:h-6 sm:w-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: direction === 'left' ? 'translateX(-1px)' : 'translateX(1px)' }}
    >
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

export function BehindTheScene() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: true
  });

  const syncScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScrollLeft = Math.max(el.scrollWidth - el.clientWidth, 0);
    const scrollLeft = el.scrollLeft;

    setScrollState({
      canScrollLeft: scrollLeft > 4,
      canScrollRight: scrollLeft < maxScrollLeft - 4
    });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncScrollState);
    };

    syncScrollState();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncScrollState);

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncScrollState) : null;
    resizeObserver?.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncScrollState);
      resizeObserver?.disconnect();
    };
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>('[data-bts-card]');
    const cardWidth = firstCard?.offsetWidth ?? el.clientWidth * 0.8;
    const gap = 16;

    el.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  return (
    <section
      id="behind-the-scene"
      aria-labelledby="behind-the-scene-title"
      className="relative isolate overflow-hidden bg-[#050505] text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_18%_24%,rgba(255,106,0,0.12),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(180deg,#060606_0%,#040404_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:140px_140px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-120px' }}
          className="mb-8 md:mb-10"
        >
          <h2
            id="behind-the-scene-title"
            className="max-w-4xl text-[clamp(3rem,7vw,6.75rem)] uppercase leading-[0.9] tracking-[-0.08em] text-white"
            style={{
              fontFamily: '"Oswald", "Montserrat", "Inter", sans-serif'
            }}
          >
            Behind The Scene
          </h2>
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#050505] via-[#050505]/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#050505] via-[#050505]/95 to-transparent" />

          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!scrollState.canScrollLeft}
            aria-label="Scroll BTS videos left"
            className="absolute left-2 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white shadow-[0_18px_44px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-300 hover:-translate-y-1/2 hover:bg-white/14 hover:border-white/22 disabled:pointer-events-none disabled:opacity-35 sm:left-3 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-12 pb-2 pt-1 sm:gap-4 sm:px-16 lg:px-20"
          >
            {BTS_MEDIA.map((item, index) => (
              <article
                key={item.id}
                data-bts-card
                className="group transform-gpu relative h-[clamp(22rem,52vh,42rem)] shrink-0 snap-start overflow-hidden rounded-[22px] border border-white/10 bg-[#090909] shadow-[0_30px_80px_rgba(0,0,0,0.48)] transition-transform duration-500 hover:-translate-y-1 basis-[78vw] sm:h-[clamp(26rem,58vh,42rem)] sm:basis-[clamp(19rem,31vw,31rem)]"
                aria-label={`Behind the scene video ${index + 1}`}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    src={buildVideoSrc(item.fileName)}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    aria-label={`Graphinex behind the scene clip ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    style={{ objectPosition: item.objectPosition }}
                    onLoadedData={(event) => {
                      handleVideoReady(event.currentTarget);
                    }}
                  />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.06)_45%,rgba(0,0,0,0.52)_100%)] transition-opacity duration-500 group-hover:opacity-90" />
                <div className="pointer-events-none absolute inset-0 border border-white/8 transition-colors duration-500 group-hover:border-white/18" />
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!scrollState.canScrollRight}
            aria-label="Scroll BTS videos right"
            className="absolute right-2 top-1/2 z-30 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white shadow-[0_18px_44px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-300 hover:-translate-y-1/2 hover:bg-white/14 hover:border-white/22 disabled:pointer-events-none disabled:opacity-35 sm:right-3 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
