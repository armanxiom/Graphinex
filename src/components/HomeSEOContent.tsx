import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { homeSeoCopy } from '../data/seoContent';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/siteConfig';
import { SectionReveal } from './SectionReveal';

export function HomeSEOContent() {
  return (
    <SectionReveal className="bg-white" id="about">
      <div className="container-boxed">
        <div className="sr-only">
          <h2>We Turn Content Into Clients</h2>
          <p>
            Graphinex Creative helps brands turn content into clients through video editing,
            graphic design, and branding that support visibility, trust, and conversions.
          </p>
        </div>
        <div className="max-w-4xl">
          <span className="luxury-section-kicker mb-6 block">About</span>
          <h2 className="luxury-heading mb-6">
            About <span className="text-brand-orange">Graphinex Creative</span>
          </h2>
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-muted">
            {homeSeoCopy.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              Our work is built for brands that care about both creativity and conversion. We plan content around the moments that matter: the first impression, the hook, the proof, the offer, and the call to action. That is why our output feels polished, yet still performs like a marketing asset. It is the difference between content that fills a feed and content that drives growth.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {homeSeoCopy.services.map((service) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: '-80px' }}
              className="premium-card p-6 sm:p-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-[-0.03em] text-brand-dark mb-4">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-muted">
                {service.text}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start">
          <div>
            <h2 className="luxury-heading mb-5">
              Why Choose <span className="text-brand-orange">Graphinex Creative</span>
            </h2>
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted">
              {homeSeoCopy.reasons.map((reason, index) => (
                <p key={reason}>
                  <span className="font-semibold text-brand-dark">{index + 1}. </span>
                  {reason}
                </p>
              ))}
              <p>
                The biggest advantage of working with a specialized creative partner is clarity. Instead of juggling multiple freelancers for editing, design, and brand direction, you get one system that keeps your messaging aligned. That consistency makes your content easier to recognize and easier to trust, which is exactly what a lead generation website should do.
              </p>
            </div>
          </div>

          <div className="premium-card bg-brand-dark text-white p-6 sm:p-8">
            <span className="luxury-section-kicker mb-4 block text-white/50">CTA</span>
            <h2 className="text-2xl sm:text-3xl font-semibold uppercase tracking-[-0.04em] leading-tight mb-4">
              Ready to grow with a creative agency that focuses on results?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-white/70 mb-6">
              Start a conversation with Graphinex Creative and let us map the right mix of video editing, graphic design, and branding for your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-brand-orange text-white shadow-[0_12px_30px_rgba(255,122,0,0.28)] hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] border border-brand-orange/20 premium-focus"
              >
                <MessageCircle size={14} />
                Contact on WhatsApp
              </a>
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/video-editing" className="premium-button bg-white text-brand-dark border border-white/20 premium-focus">
                  Explore Services
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
              <Link to="/video-editing" className="hover:text-white transition-colors">
                Video Editing
              </Link>
              <Link to="/logo-design" className="hover:text-white transition-colors">
                Logo Design
              </Link>
              <Link to="/social-media-design" className="hover:text-white transition-colors">
                Social Media Design
              </Link>
              <Link to="/portfolio" className="hover:text-white transition-colors">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
