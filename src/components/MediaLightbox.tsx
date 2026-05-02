import { motion, AnimatePresence } from 'motion/react';
import { Expand, Play, X } from 'lucide-react';

type MediaItem = {
  type: string;
  src: string;
  poster?: string;
  title?: string;
};

export function MediaLightbox({
  media,
  onClose
}: {
  media: MediaItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {media ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl overflow-hidden rounded-[1.6rem] border border-white/12 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.38)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[linear-gradient(180deg,rgba(0,0,0,0.62),rgba(0,0,0,0.18))] px-4 py-4 backdrop-blur-md">
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.28em] text-brand-orange">
                  Full Preview
                </p>
                <p className="truncate text-sm text-white/72">
                  {media.title || 'Graphinex showcase asset'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition-all duration-300 hover:border-brand-orange/36 hover:bg-white/14"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      void document.exitFullscreen();
                    } else {
                      void document.documentElement.requestFullscreen();
                    }
                  }}
                  aria-label="Toggle fullscreen preview"
                >
                  <Expand size={16} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition-all duration-300 hover:border-brand-orange/36 hover:bg-white/14"
                  onClick={onClose}
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex max-h-[88vh] min-h-[60vh] items-center justify-center bg-black p-2 pt-20 sm:p-4 sm:pt-24">
              {media.type === 'video' ? (
                <video
                  src={media.src}
                  poster={media.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="h-auto max-h-[78vh] w-full rounded-[1.2rem] object-contain"
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.title || 'Graphinex asset'}
                  className="h-auto max-h-[78vh] w-full rounded-[1.2rem] object-contain"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>

            <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72 backdrop-blur-md">
              {media.type === 'video' ? <Play size={11} /> : <Expand size={11} />}
              Tap or click outside to close
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
