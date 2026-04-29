/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';

export const Results = () => {
  const reasons = [
    {
      title: 'Conversion-first creative',
      description: 'Every edit, design, and brand touchpoint is built to move people closer to inquiry, booking, or purchase.'
    },
    {
      title: 'Fast, reliable delivery',
      description: 'We move quickly without compromising quality, so your content calendar stays consistent.'
    },
    {
      title: 'Premium brand polish',
      description: 'Your visuals feel sharper, more trustworthy, and more aligned with the market you want to attract.'
    },
    {
      title: 'Built for growth',
      description: 'We support creators, founders, and agencies that want creative work tied to real business outcomes.'
    }
  ];

  return (
    <section className="bg-brand-dark overflow-hidden relative py-24 md:py-28" id="results">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-boxed relative z-10">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="luxury-section-kicker mb-6 block text-white/60">Results</span>
          <h2 className="luxury-heading text-white mb-5">
            Results That <span className="text-brand-orange">Support Growth</span>
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed">
            The numbers below represent the kind of outcomes a strong creative system can help support. Better content, better branding, and better consistency can all contribute to stronger visibility, more trust, and more enquiries over time.
          </p>
        </div>
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start mb-12 md:mb-16">
          <div className="max-w-2xl">
            <span className="luxury-section-kicker mb-6 block text-white/60">About</span>
            <h2 className="luxury-heading text-white mb-6">
              About <span className="text-brand-orange">Graphinex Creative</span>
            </h2>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl">
              Graphinex Creative is a modern creative agency focused on helping businesses grow through powerful visual content and branding strategies.
            </p>
            <p className="text-sm md:text-base text-white/60 leading-relaxed mt-5 max-w-2xl">
              We combine strategy, storytelling, and execution to help you stand out across social media, ads, and branded digital experiences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-[-0.04em] text-white mb-6">
              Why Choose Us
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <motion.article
                  key={reason.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="premium-card border-white/10 bg-white/5 backdrop-blur-md p-5 sm:p-6"
                >
                  <h3 className="text-sm sm:text-base font-semibold uppercase tracking-[-0.03em] text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/65">
                    {reason.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          {siteConfig.results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="premium-card border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center gap-2 group px-4 sm:px-6 py-6 sm:py-8"
            >
              <div className="text-3xl md:text-5xl font-semibold text-brand-orange leading-none">
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
