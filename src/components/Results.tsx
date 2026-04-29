/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

const stripLabels = ['Generated', 'Growth', 'Delivered', 'Clients'];

export const Results = () => {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-14 sm:py-16 md:py-18" id="results">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,13,11,0.98),rgba(9,9,9,1))]" />
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-orange/12 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-[140px]" />

      <div className="container-boxed relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center border-b border-white/10 pb-5 sm:pb-6">
          {stripLabels.map((label) => (
            <div key={label} className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.42em] text-white/35">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
          {siteConfig.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              viewport={{ once: true, margin: '-80px' }}
              className="text-center md:text-left"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-none tracking-[-0.05em]">
                {result.value}
              </div>
              <div className="mt-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.24em] text-white/45 leading-snug">
                {result.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
