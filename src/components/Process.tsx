/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { SectionReveal } from './SectionReveal';
import { ScrollReveal } from './ScrollReveal';

export const Process = () => {
  return (
    <SectionReveal className="bg-white py-24 md:py-28" id="process">
      <div className="container-boxed">
        <ScrollReveal className="mb-12 md:mb-16" distance={22} blur={8}>
          <span className="luxury-section-kicker mb-6 block">Our Workflow</span>
          <h2 className="luxury-heading mb-0">
            The Creative Journey
          </h2>
        </ScrollReveal>

        <div className="mx-auto grid max-w-[34rem] grid-cols-1 gap-4 sm:gap-5">
          {siteConfig.process.map((step, i) => (
            <ScrollReveal key={i} delay={i * 0.08} distance={22} blur={6}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group p-4 sm:p-5 md:p-6 bg-white premium-card premium-card-hover relative overflow-hidden min-h-[140px] sm:min-h-[160px] flex flex-col justify-between border-black/5 shadow-[0_14px_48px_rgba(15,15,15,0.05)]"
              >
                <div className="relative z-10">
                  <span className="text-brand-orange text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.32em] mb-3 sm:mb-5 block">
                    Step {step.step}
                  </span>
                  <h3 className="text-[0.8rem] sm:text-xl font-semibold mb-3 sm:mb-4 uppercase tracking-[-0.05em] text-brand-dark leading-none whitespace-nowrap">
                    {step.name}
                  </h3>
                  <p className="text-[12px] sm:text-[14px] text-muted font-normal leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>

                {/* Decorative Number Background */}
                <div className="absolute -bottom-2 -right-1 sm:-bottom-4 sm:-right-2 text-[42px] sm:text-[88px] font-bold text-brand-dark/8 sm:text-brand-dark/5 leading-none select-none">
                  {step.step}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
