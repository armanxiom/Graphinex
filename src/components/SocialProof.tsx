import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { reviews } from '../data/siteConfig';

type Review = (typeof reviews)[number];
const reviewList = reviews as ReadonlyArray<Review>;

export const SocialProof = () => {
  const [currentReview, setCurrentReview] = useState<(Review & { id: number }) | null>(null);

  useEffect(() => {
    if (reviewList.length < 1) return;

    const cycleReview = () => {
      const randomIndex = Math.floor(Math.random() * reviewList.length);
      setCurrentReview({ ...reviewList[randomIndex], id: Date.now() });
    };

    const interval = window.setInterval(cycleReview, 5000);
    cycleReview();

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {currentReview ? (
          <motion.div
            key={currentReview.id}
            initial={{ x: -28, opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ x: -28, opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[250px] rounded-[1rem] border border-[color:var(--panel-card-border)] bg-[color:var(--panel-bg)] px-3 py-3 text-[color:var(--panel-text)] shadow-[0_16px_38px_rgba(15,15,15,0.12)] backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange/12 text-xs font-semibold text-brand-orange">
                {currentReview.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-medium leading-none text-[color:var(--panel-text)]">
                    {currentReview.name}
                  </span>
                  <span className="text-[10px] leading-none text-green-500">●</span>
                </div>
                <p className="mt-0.5 text-[10px] font-normal text-[color:var(--panel-muted)]">
                  {currentReview.type}
                </p>
              </div>
            </div>

            <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-snug text-[color:var(--panel-muted)]">
              {currentReview.text}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
