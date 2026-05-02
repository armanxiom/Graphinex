import { motion } from 'motion/react';
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../data/siteConfig';

const socialIcons = {
  Instagram,
  YouTube: Youtube,
  LinkedIn: Linkedin,
  'Twitter / X': Twitter
};

export const Footer = () => {
  const registrationLinks = siteConfig.trustCertificates || [];

  return (
    <footer className="theme-panel relative overflow-hidden px-5 py-12 md:py-[4.5rem]" id="contact">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 md:grid md:grid-cols-[1.1fr_0.9fr_1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
          id="footer-brand"
        >
          <div className="flex items-center gap-3">
            <img
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.name}
              className="motion-optimised h-auto w-8"
              loading="lazy"
              decoding="async"
            />
            <span className="ios-bold text-base uppercase tracking-[-0.04em] text-white">
              {siteConfig.brand.name}
            </span>
          </div>

          <p className="max-w-sm text-[14px] leading-7 text-white/62">
            Transforming your content into a client-acquisition machine with sharper branding, cleaner edits, and premium visual systems built to convert.
          </p>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {siteConfig.socials.map((item) => {
              const Icon = socialIcons[item.name as keyof typeof socialIcons];

              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className="social-flip-card group relative block aspect-[4/5] rounded-[1.4rem]"
                >
                  <span className="social-flip-card__inner motion-optimised">
                    <span className="social-flip-card__face">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-orange">
                          {Icon ? <Icon size={16} /> : null}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-end">
                        <div className="social-flip-card__title text-white">{item.name}</div>
                        <p className="social-flip-card__copy mt-2 text-[0.88rem] leading-6 text-white/64 sm:text-[0.95rem]">
                          Stay connected with our latest work and updates.
                        </p>
                      </div>
                    </span>

                    <span className="social-flip-card__face social-flip-card__face--back">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-orange">
                          {Icon ? <Icon size={16} /> : null}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex min-h-0 flex-1 flex-col justify-end">
                        <div className="social-flip-card__title text-white">{item.name}</div>
                        <p className="social-flip-card__copy mt-2 text-[0.88rem] leading-6 text-white/64 sm:text-[0.95rem]">
                          Stay connected with our latest work and updates.
                        </p>
                      </div>
                    </span>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.58, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-8"
          id="footer-nav"
        >
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/38">
              Navigation
            </span>
            <div className="flex flex-col gap-3">
              {siteConfig.navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="animated-underline w-fit text-sm text-white/72 transition-colors duration-300 hover:text-white"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/38">
              Contact
            </span>
            <span className="text-sm font-medium text-white">{siteConfig.contact.phone}</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm text-white/68 transition-colors duration-300 hover:text-white"
            >
              {siteConfig.contact.email}
            </a>
            <div className="pt-2 text-[12px] leading-6 text-white/46">
              <p>{siteConfig.brand.location}</p>
              <p className="uppercase tracking-[0.18em]">{siteConfig.brand.reach}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.58, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="flex flex-col gap-3"
          id="footer-contact"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/38">
            Registered Business
          </span>
          <span className="text-sm text-white">Graphinex Enterprises</span>

          <a
            href={registrationLinks[0]?.pdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="animated-underline w-fit text-sm text-white/68 transition-colors duration-300 hover:text-white"
            aria-label="Open GST certificate PDF"
          >
            GSTIN: 09FOXPA7667R1ZI
          </a>
          <a
            href={registrationLinks[1]?.pdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="animated-underline w-fit text-sm text-white/68 transition-colors duration-300 hover:text-white"
            aria-label="Open MSME certificate PDF"
          >
            Udyam: UDYAM-UP-04-0049600
          </a>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] text-white/38 md:flex-row">
        <span className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} {siteConfig.brand.name}. All rights reserved.
        </span>
        <div className="flex gap-6">
          <span className="transition-colors duration-300 hover:text-white">Privacy Policy</span>
          <span className="transition-colors duration-300 hover:text-white">Terms</span>
        </div>
      </div>
    </footer>
  );
};
