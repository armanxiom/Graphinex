import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Expand, Minimize2, X } from 'lucide-react';

type MediaItem = {
  type: string;
  src: string;
  poster?: string;
  title?: string;
};

export function MediaLightbox({
  media,
  onClose,
  onPrevious,
  onNext,
  currentIndex,
  totalCount
}: {
  media: MediaItem | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalCount?: number;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!media) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowLeft' && onPrevious) {
        event.preventDefault();
        onPrevious();
      }

      if (event.key === 'ArrowRight' && onNext) {
        event.preventDefault();
        onNext();
      }
    };

    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(Boolean(fullscreenElement && frameRef.current?.contains(fullscreenElement)));
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.body.style.overflow = previousOverflow;

      if (document.fullscreenElement && frameRef.current?.contains(document.fullscreenElement)) {
        void document.exitFullscreen().catch(() => undefined);
      }
    };
  }, [media, onClose, onNext, onPrevious]);

  const toggleFullscreen = async () => {
    if (!frameRef.current) {
      return;
    }

    try {
      if (document.fullscreenElement && frameRef.current.contains(document.fullscreenElement)) {
        await document.exitFullscreen();
        return;
      }

      await frameRef.current.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  };

  const hasNavigation = Boolean(onPrevious && onNext && totalCount && totalCount > 1);

  const modal = media ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-stretch justify-stretch bg-black/96 p-0 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
    >
      <motion.div
        ref={frameRef}
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.995 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-[100dvh] w-[100dvw] flex-col overflow-hidden rounded-none border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_24%),#050505] shadow-[0_30px_110px_rgba(0,0,0,0.58)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-[linear-gradient(180deg,rgba(5,5,5,0.94),rgba(5,5,5,0.28))] px-4 py-3 backdrop-blur-xl sm:px-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">
              Full Preview
            </p>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-white/78">
              <span className="truncate">{media.title || 'Graphinex showcase asset'}</span>
              {typeof currentIndex === 'number' && typeof totalCount === 'number' ? (
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  {currentIndex + 1}/{totalCount}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasNavigation ? (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-700/70 text-white transition-all duration-300 hover:border-emerald-300/30 hover:bg-emerald-600/80"
                  onClick={onPrevious}
                  aria-label="Previous media"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-700/70 text-white transition-all duration-300 hover:border-emerald-300/30 hover:bg-emerald-600/80"
                  onClick={onNext}
                  aria-label="Next media"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition-all duration-300 hover:border-brand-orange/35 hover:bg-white/14"
              onClick={() => {
                void toggleFullscreen();
              }}
              aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Toggle fullscreen preview'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Expand size={16} />}
            </button>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-700/85 text-white shadow-[0_12px_28px_rgba(185,28,28,0.2)] transition-all duration-300 hover:border-red-300/40 hover:bg-red-600"
              onClick={onClose}
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden bg-black px-3 pt-16 sm:px-5 sm:pt-18">
          <AnimatePresence mode="wait">
            <motion.div
              key={media.src}
              initial={{ opacity: 0, scale: 0.98, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full overflow-hidden bg-[#070707] shadow-[0_20px_70px_rgba(0,0,0,0.42)]"
            >
              {media.type === 'video' ? (
                <video
                  src={media.src}
                  poster={media.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  controlsList="nodownload noplaybackrate"
                  disablePictureInPicture
                  className="h-full w-full bg-black object-contain"
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.title || 'Graphinex asset'}
                  className="h-full w-full bg-black object-contain"
                  loading="eager"
                  decoding="async"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {hasNavigation ? (
            <>
              <button
                type="button"
                onClick={onPrevious}
                className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-700/65 text-white backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/30 hover:bg-emerald-600/75 sm:inline-flex"
                aria-label="Previous media"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-700/65 text-white backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/30 hover:bg-emerald-600/75 sm:inline-flex"
                aria-label="Next media"
              >
                <ChevronRight size={22} />
              </button>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  ) : null;

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(<AnimatePresence>{modal}</AnimatePresence>, document.body);
}
