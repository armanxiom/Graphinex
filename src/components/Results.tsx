/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

export const Results = () => {
  return (
    <section className="bg-brand-dark overflow-hidden relative" id="about">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-boxed relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 text-center">
          {siteConfig.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="text-3xl md:text-5xl font-bold text-brand-orange leading-none">
                {result.value}
              </div>
              <div className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-[0.2em] leading-tight max-w-[120px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                {result.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

