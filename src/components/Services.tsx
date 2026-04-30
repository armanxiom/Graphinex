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

const servicePageMap: Record<string, string> = {
  videoEditing: '/portfolio?category=video-editing',
  graphicDesign: '/portfolio?category=graphic-design',
  branding: '/portfolio?category=branding'
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

        <div ref={containerRef} className="grid grid-cols-3 items-stretch gap-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {siteConfig.serviceOverviews.map((service: any, index: number) => (
            <Link
              key={service.id}
              to={servicePageMap[service.id] || '/'}
              className="block h-full w-full"
              aria-label={`${service.title} service page`}
            >
              <Tilt
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                perspective={1200}
                scale={1.01}
                transitionSpeed={1400}
                glareEnable
                glareMaxOpacity={0.1}
                className="block h-full w-full"
              >
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="premium-card premium-card-hover group relative w-full bg-white px-2 py-3 sm:p-8 lg:p-10 flex flex-col items-center justify-between text-center min-h-[190px] sm:min-h-[360px] lg:min-h-[440px] cursor-pointer overflow-hidden transform-gpu"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange/0 via-brand-orange/35 to-brand-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 w-full flex flex-col items-center justify-start sm:justify-center flex-1 gap-2 sm:gap-0 [transform:translateZ(40px)]">
                    <div className="flex h-8 items-center justify-center text-2xl sm:h-auto sm:text-5xl lg:text-6xl mb-1 sm:mb-10 transform group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="flex min-h-[2.1rem] items-center justify-center text-[10px] sm:text-lg md:text-xl font-semibold uppercase tracking-[-0.03em] leading-tight mb-1 sm:mb-4 break-words w-full">
                      {service.title}
                    </h3>
                    <p className="flex min-h-[4.75rem] items-start justify-center text-[11px] sm:text-sm text-muted font-normal leading-snug sm:leading-relaxed max-w-sm mx-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 text-brand-orange font-black text-[8px] sm:text-xs uppercase tracking-widest mt-3 sm:mt-8 [transform:translateZ(30px)]">
                    <span className="hidden sm:inline">Highlights</span>
                    <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 shadow-[0_0_0_0_rgba(255,106,0,0)] group-hover:shadow-[0_12px_25px_rgba(255,106,0,0.18)]">
                      <ArrowRight size={12} className="sm:w-4 sm:h-4 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-10 sm:right-10 text-[20px] sm:text-[72px] font-black text-brand-dark/15 sm:text-brand-dark/5 leading-none select-none">
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
