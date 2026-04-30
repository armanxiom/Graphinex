/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

export const Process = () => {
  return (
    <section className="bg-white py-24 md:py-28" id="process">
      <div className="container-boxed">
        <div className="mb-12 md:mb-16">
          <span className="luxury-section-kicker mb-6 block">Our Workflow</span>
          <h2 className="luxury-heading mb-0">
            The Creative Journey
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {siteConfig.process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeInOut" }}
              whileHover={{ y: -6 }}
              className={`group p-4 sm:p-9 bg-white premium-card premium-card-hover relative overflow-hidden min-h-[180px] sm:min-h-[260px] flex flex-col justify-between border-black/5 shadow-[0_14px_48px_rgba(15,15,15,0.05)] ${i === 3 ? 'col-start-2 sm:col-start-auto lg:col-start-auto' : ''}`}
            >
              <div className="relative z-10">
                <span className="text-brand-orange text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.32em] mb-4 sm:mb-8 block">
                  Step {step.step}
                </span>
                <h3 className="text-[0.72rem] sm:text-2xl font-semibold mb-3 sm:mb-4 uppercase tracking-[-0.05em] text-brand-dark leading-none whitespace-nowrap">
                  {step.name}
                </h3>
                <p className="text-[12px] sm:text-[15px] text-muted font-normal leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>

              {/* Decorative Number Background */}
              <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[42px] sm:text-[110px] font-bold text-brand-dark/8 sm:text-brand-dark/5 leading-none select-none">
                {step.step}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
