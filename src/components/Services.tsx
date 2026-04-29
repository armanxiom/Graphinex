/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const categoryMap: Record<string, string> = {
  videoEditing: 'video-editing',
  graphicDesign: 'graphic-design',
  branding: 'branding'
};

export const Services = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-28 md:py-32 relative bg-brand-light" id="services">
      <div className="container-boxed">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="luxury-section-kicker mb-6 block">Our Services</span>
            <h2 className="luxury-heading">
              Our <span className="text-brand-orange">Services</span>
            </h2>
          </div>
          <p className="luxury-subcopy max-w-xs md:text-right mb-2">
            We create SEO-friendly video editing, graphic design, and branding systems that help brands attract attention and convert faster.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {siteConfig.serviceOverviews.map((service: any, index: number) => (
            <Link
              key={service.id}
              to={`/portfolio?category=${categoryMap[service.id] || service.id}`}
              className="block"
              aria-label={`${service.title} portfolio examples`}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1200}
                scale={1.01}
                transitionSpeed={1400}
                glareEnable
                glareMaxOpacity={0.1}
                className="block h-full"
              >
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="premium-card premium-card-hover group relative bg-white p-5 sm:p-8 lg:p-10 flex flex-col items-center justify-between text-center min-h-[260px] sm:min-h-[360px] lg:min-h-[440px] cursor-pointer overflow-hidden transform-gpu"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange/0 via-brand-orange/35 to-brand-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 [transform:translateZ(40px)]">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-6 sm:mb-10 transform group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="text-xs sm:text-lg md:text-xl font-semibold uppercase tracking-[-0.03em] leading-tight mb-3 md:mb-4 break-words w-full">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted font-normal leading-relaxed max-w-sm mx-auto opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-2 sm:gap-4 text-brand-orange font-black text-[8px] sm:text-xs uppercase tracking-widest mt-4 sm:mt-8 [transform:translateZ(30px)]">
                    <span className="hidden sm:inline">Highlights</span>
                    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 shadow-[0_0_0_0_rgba(255,106,0,0)] group-hover:shadow-[0_12px_25px_rgba(255,106,0,0.18)]">
                      <ArrowRight size={12} className="sm:w-4 sm:h-4 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 sm:top-10 sm:right-10 text-[24px] sm:text-[72px] font-black text-brand-dark/5 leading-none select-none">
                    0{index + 1}
                  </div>
                </motion.article>
              </Tilt>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
