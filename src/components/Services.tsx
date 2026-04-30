/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';
import { ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { usePerformanceFlags } from '../hooks/usePerformanceFlags';
import { SectionReveal } from './SectionReveal';
import { ScrollReveal } from './ScrollReveal';

const servicePageMap: Record<string, string> = {
  videoEditing: '/portfolio?category=video-editing',
  graphicDesign: '/portfolio?category=graphic-design',
  branding: '/portfolio?category=branding'
};

export const Services = () => {
  const { isMobile } = usePerformanceFlags();

  return (
    <SectionReveal className="py-28 md:py-32 relative bg-brand-light" id="services">
      <div className="container-boxed">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20 gap-8">
          <ScrollReveal className="max-w-2xl" distance={24} blur={8}>
            <span className="luxury-section-kicker mb-6 block">Our Services</span>
            <h2 className="luxury-heading">
              Our <span className="text-brand-orange">Services</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal className="max-w-xs md:text-right mb-2" delay={0.08} distance={18} blur={6}>
            We create SEO-friendly video editing, graphic design, and branding systems that help brands attract attention and convert faster.
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8 items-stretch">
          {siteConfig.serviceOverviews.map((service: any, index: number) => (
            <Link
              key={service.id}
              to={servicePageMap[service.id] || '/'}
              className="block h-full w-full"
              aria-label={`${service.title} service page`}
            >
              <Tilt
                tiltEnable={!isMobile}
                tiltMaxAngleX={6}
                tiltMaxAngleY={6}
                perspective={1200}
                scale={isMobile ? 1 : 1.01}
                transitionSpeed={2200}
                glareEnable
                glareMaxOpacity={0.1}
                className="block h-full w-full"
              >
                <ScrollReveal delay={index * 0.08} distance={24} blur={8} className="block h-full w-full">
                <article className="premium-card premium-card-hover group relative w-full bg-white px-5 py-5 sm:p-7 lg:p-8 flex flex-col items-center justify-between text-center min-h-[180px] sm:min-h-[270px] lg:min-h-[360px] cursor-pointer overflow-hidden transform-gpu">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-orange/0 via-brand-orange/35 to-brand-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 w-full flex flex-col items-center justify-start sm:justify-center flex-1 gap-2 sm:gap-0 [transform:translateZ(40px)]">
                    <div className="flex h-8 items-center justify-center text-2xl sm:h-auto sm:text-5xl lg:text-6xl mb-1 sm:mb-8 transform group-hover:scale-110 transition-transform duration-700">
                      {service.icon}
                    </div>
                    <h3 className="flex min-h-[2.1rem] items-center justify-center text-[11px] sm:text-lg md:text-xl font-semibold uppercase tracking-[-0.03em] leading-tight mb-1 sm:mb-3 break-words w-full">
                      {service.title}
                    </h3>
                    <p className="flex min-h-[3.5rem] items-start justify-center text-[12px] sm:text-sm text-muted font-normal leading-snug sm:leading-relaxed max-w-sm mx-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 text-brand-orange font-black text-[8px] sm:text-xs uppercase tracking-widest mt-4 sm:mt-8 [transform:translateZ(30px)]">
                    <span className="hidden sm:inline">Highlights</span>
                    <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange transition-all duration-300 shadow-[0_0_0_0_rgba(255,106,0,0)] group-hover:shadow-[0_12px_25px_rgba(255,106,0,0.18)]">
                      <ArrowRight size={12} className="sm:w-4 sm:h-4 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-10 sm:right-10 text-[20px] sm:text-[72px] font-black text-brand-dark/15 sm:text-brand-dark/5 leading-none select-none">
                    0{index + 1}
                  </div>
                </article>
                </ScrollReveal>
              </Tilt>
            </Link>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
};
