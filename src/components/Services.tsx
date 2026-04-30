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

const categoryMap: Record<string, string> = {
  videoEditing: 'video-editing',
  graphicDesign: 'graphic-design',
  branding: 'branding'
};

export const Services = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 relative bg-brand-light" id="services">
      <div className="container-boxed">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.2em] mb-6 block">Our Expertise</span>
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight leading-[1.1] mb-0 ios-bold">
              Agency Specializations
            </h2>
          </div>
          <p className="text-muted font-normal max-w-xs text-sm md:text-base leading-relaxed mb-4">
            We focus on high-impact visual mediums that drive engagement and business growth.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {siteConfig.serviceOverviews.map((service: any, index: number) => (
            <Link
              key={service.id}
              to={`/portfolio?category=${categoryMap[service.id] || service.id}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.99 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white p-4 sm:p-10 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center justify-center text-center min-h-[150px] sm:min-h-[420px] cursor-pointer hover:shadow-2xl hover:-translate-y-2 sm:hover:-translate-y-4 transition-all duration-500 border border-black/5"
              >
                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="text-3xl sm:text-6xl mb-3 sm:mb-12 transform group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xs md:text-2xl font-bold uppercase tracking-tight leading-tight md:leading-none mb-2 md:mb-5 break-words w-full">
                    {service.title}
                  </h3>
                  <p className="hidden md:block text-sm text-muted font-normal leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 text-brand-orange font-black text-[8px] sm:text-xs uppercase tracking-widest mt-2 sm:mt-10">
                  <span className="hidden sm:inline">Highlights</span>
                  <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300">
                    <ArrowRight size={12} className="sm:w-4 sm:h-4 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 sm:top-12 sm:right-12 text-[24px] sm:text-[80px] font-black text-brand-dark/5 leading-none select-none">
                  0{index + 1}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
