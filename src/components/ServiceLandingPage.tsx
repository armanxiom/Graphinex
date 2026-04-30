import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { siteConfig } from '../data/siteConfig';
import { ServicePageKey, servicePageContent } from '../data/seoContent';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function ServiceLandingPage({ slug }: { slug: ServicePageKey }) {
  const page = servicePageContent[slug];

  return (
    <div className="bg-brand-light min-h-screen">
      <Navbar />

      <main className="relative pt-40 pb-20">
        <section className="container-boxed">
          <div className="max-w-4xl">
            <span className="luxury-section-kicker mb-6 block">Service</span>
            <h1 className="text-[clamp(2rem,8vw,3.75rem)] sm:text-[64px] md:text-[88px] font-black uppercase tracking-tighter leading-[0.95] text-brand-dark break-words">
              {page.title}
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-3xl">
              {page.hero}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button bg-brand-orange text-white shadow-[0_12px_30px_rgba(255,122,0,0.28)] hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] border border-brand-orange/20 premium-focus"
              >
                <MessageCircle size={14} />
                Start on WhatsApp
              </a>
              <Link to="/#contact" className="premium-button bg-white text-brand-dark border border-black/10 premium-focus">
                Contact Section
                <ArrowRight size={13} />
              </Link>
              <Link to="/" className="premium-button bg-white text-brand-dark border border-black/10 premium-focus">
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        <section className="container-boxed mt-12">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-muted">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <aside className="premium-card p-6 sm:p-8 bg-white">
              <span className="luxury-section-kicker mb-4 block">Intent</span>
              <h2 className="text-2xl sm:text-3xl font-semibold uppercase tracking-[-0.04em] text-brand-dark mb-4">
                Built to Rank and Convert
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted">
                This landing page is structured for search engines and for buyers. It targets a high-intent keyword, explains the service clearly, and gives the visitor multiple next steps without overwhelming the page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/" className="text-xs uppercase tracking-[0.22em] text-brand-orange font-bold hover:underline">
                  Home
                </Link>
                <Link to="/portfolio" className="text-xs uppercase tracking-[0.22em] text-brand-orange font-bold hover:underline">
                  Portfolio
                </Link>
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-[0.22em] text-brand-orange font-bold hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section className="container-boxed mt-14 space-y-10">
          {page.sections.map((section, index) => (
            <article key={section.heading} className="grid lg:grid-cols-[0.45fr_0.55fr] gap-6 lg:gap-10 border-t border-black/10 pt-8">
              <div>
                <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.35em] mb-3 block">
                  0{index + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-[-0.04em] text-brand-dark leading-[0.98]">
                  {section.heading}
                </h2>
              </div>
              <div className="space-y-4 text-base md:text-lg leading-relaxed text-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="container-boxed mt-14">
          <div className="premium-card bg-brand-dark text-white p-6 sm:p-8 lg:p-10">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
              <div>
                <span className="luxury-section-kicker mb-4 block text-white/50">CTA</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-[-0.04em] leading-tight">
                  Let us build your next growth asset.
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70 max-w-2xl">
                  If you want a cleaner brand presence, stronger content performance, and a more reliable path from attention to enquiry, Graphinex Creative can help.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-button bg-brand-orange text-white shadow-[0_12px_30px_rgba(255,122,0,0.28)] hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] border border-brand-orange/20 premium-focus"
                >
                  <MessageCircle size={14} />
                  {page.cta.primaryLabel}
                </a>
                <Link to={slug === 'video-editing' ? '/social-media-design' : slug === 'logo-design' ? '/video-editing' : '/logo-design'} className="premium-button bg-white text-brand-dark border border-white/10 premium-focus">
                  {page.cta.secondaryLabel}
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
