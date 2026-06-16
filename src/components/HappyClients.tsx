/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { motion } from 'motion/react';
import { Instagram, Youtube } from 'lucide-react';
import { happyClients } from '../data/siteConfig';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useDevicePerformance } from '../lib/performance';
import { OptimizedImage } from './OptimizedImage';

type HappyClient = {
  name: string;
  role: string;
  quote: string;
  image: string;
  instagram: string;
  youtube?: string;
};

export const HappyClients = () => {
  const clients = happyClients as ReadonlyArray<HappyClient>;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isTouchDevice = useMediaQuery('(hover: none), (pointer: coarse)');
  const performance = useDevicePerformance();

  const handleCardClick = (index: number, event: ReactMouseEvent<HTMLElement>) => {
    if (!isTouchDevice) return;
    if ((event.target as HTMLElement).closest('a')) return;

    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      className="happy-clients-section relative overflow-hidden py-20 text-white md:py-28"
      id="clients"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,145,48,0.08),transparent_24%)]" />

      <div className="container-boxed relative z-10">
        <div className="mb-10 max-w-4xl md:mb-14">
          <motion.span
            initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={!performance.shouldUsePremiumMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="section-kicker text-white/55"
          >
            HAPPY CLIENTS
          </motion.span>

          <motion.h2
            initial={!performance.shouldUsePremiumMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(10px)' }}
            whileInView={!performance.shouldUsePremiumMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.08, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="ios-bold text-[clamp(2.4rem,5vw,5.6rem)] uppercase leading-[0.94] text-white"
          >
            Hear from Our Happy Clients
          </motion.h2>
        </div>

        <div className="happy-clients-accordion" aria-label="Happy clients testimonials">
          {clients.map((client: HappyClient, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={`${client.name}-${index}`}
                tabIndex={0}
                aria-label={`${client.name} testimonial`}
                className={`happy-client-card ${isActive ? 'is-active' : ''}`}
                onClick={(event) => handleCardClick(index, event)}
                onFocus={() => setActiveIndex(index)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setActiveIndex(null);
                  }
                }}
              >
                <div className="happy-client-card__media">
                  <OptimizedImage
                    src={client.image}
                    alt={client.name}
                    className="happy-client-card__image"
                    pictureClassName="absolute inset-0"
                    priority={index === 0 || isTouchDevice || !performance.shouldUsePremiumMotion}
                  />
                </div>

                <div className="happy-client-card__shade" />

                <div className="happy-client-card__socials">
                  <a
                    href={client.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="happy-client-card__social happy-client-card__social--instagram"
                    aria-label={`${client.name} on Instagram`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Instagram size={15} />
                  </a>

                  {client.youtube ? (
                    <a
                      href={client.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="happy-client-card__social happy-client-card__social--youtube"
                      aria-label={`${client.name} on YouTube`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Youtube size={15} />
                    </a>
                  ) : null}
                </div>

                <div className="happy-client-card__content">
                  <p className="happy-client-card__quote">"{client.quote}"</p>

                  <div className="happy-client-card__identity">
                    <h3 className="happy-client-card__name">{client.name}</h3>
                    <p className="happy-client-card__role">{client.role}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
