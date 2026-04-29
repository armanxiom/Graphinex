/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

export const Process = () => {
  return (
    <section className="bg-white" id="process">
      <div className="container-boxed">
        <div className="mb-12 md:mb-16">
          <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-6 block">Our Workflow</span>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1] text-brand-dark mb-0">
            The Creative Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.process.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeInOut" }}
              className="group p-8 bg-brand-light rounded-2xl border border-black/5 hover:bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.3em] mb-8 block">
                  Step {step.step}
                </span>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-brand-dark leading-none">
                  {step.name}
                </h3>
                <p className="text-sm text-muted font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative Number Background */}
              <div className="absolute -bottom-2 -right-2 text-[80px] font-bold text-brand-dark/5 leading-none select-none">
                {step.step}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

