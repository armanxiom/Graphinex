import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

export const SocialProof = () => {
  const [currentReview, setCurrentReview] = useState<any>(null);

  useEffect(() => {
    const reviews = siteConfig.reviews;
    if (!reviews || reviews.length === 0) return;

    const cycleReview = () => {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setCurrentReview({ ...reviews[randomIndex], id: Date.now() });
    };

    const interval = window.setInterval(cycleReview, 5000);
    cycleReview();

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-40">
      <AnimatePresence mode="wait">
        {currentReview && (
          <motion.div
            key={currentReview.id}
            initial={{ x: -28, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -28, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[240px] rounded-lg border border-black/5 bg-white px-3 py-2 shadow-[0_10px_30px_rgba(15,15,15,0.08)]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-xs font-semibold text-brand-orange">
                {currentReview.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-medium leading-none text-brand-dark">
                    {currentReview.name}
                  </span>
                  <span className="text-[10px] leading-none text-green-500">●</span>
                </div>
                <p className="mt-0.5 text-[10px] font-normal text-gray-400">
                  {currentReview.type}
                </p>
              </div>
            </div>

            <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-gray-600">
              {currentReview.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
