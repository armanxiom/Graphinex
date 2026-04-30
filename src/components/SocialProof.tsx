import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { premiumCardTransition } from '../lib/motion';

export const SocialProof = () => {
  const [currentReview, setCurrentReview] = useState<any>(null);

  useEffect(() => {
    const reviews = siteConfig.reviews;
    if (!reviews || reviews.length === 0) return;

    const cycleReview = () => {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setCurrentReview({ ...reviews[randomIndex], id: Date.now() });
    };

    const interval = setInterval(cycleReview, 6000);
    cycleReview();

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed bottom-24 left-3 sm:left-6 z-40 pointer-events-none">
        <AnimatePresence mode="wait">
          {currentReview && (
            <motion.div
              key={currentReview.id}
              initial={{ x: -28, opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              animate={{ x: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ x: -28, opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              transition={{ ...premiumCardTransition, duration: 0.55 }}
              className="bg-white/96 backdrop-blur-xl shadow-[0_18px_50px_rgba(15,15,15,0.12)] rounded-2xl px-3 py-2.5 w-[min(82vw,250px)] sm:w-[240px] border border-black/5 pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-orange/10 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-brand-orange">
                  {currentReview.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] font-medium text-brand-dark truncate leading-none">
                      {currentReview.name}
                    </span>
                    <span className="text-[10px] text-green-500 leading-none">●</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-normal mt-0.5">
                    {currentReview.type}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-gray-600 mt-1 leading-snug font-medium line-clamp-2">
                {currentReview.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}} />
    </>
  );
};
