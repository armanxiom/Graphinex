/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { PortfolioCollections } from './components/PortfolioCollections';
import { Results } from './components/Results';
import { Process } from './components/Process';
import { SocialProof } from './components/SocialProof';
import { Footer } from './components/Footer';
import { WhatsAppCTA } from './components/WhatsAppCTA';
import { Showreel } from './components/Showreel';
import { HomeSEOContent } from './components/HomeSEOContent';
import { SEO } from './components/SEO';
import { siteConfig } from './data/siteConfig';
import { useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const PortfolioPage = lazy(() => import('./pages/Portfolio'));
const VideoEditingPage = lazy(() => import('./pages/VideoEditing'));
const LogoDesignPage = lazy(() => import('./pages/LogoDesign'));
const SocialMediaDesignPage = lazy(() => import('./pages/SocialMediaDesign'));
const GlobalSystems = lazy(() =>
  import('./components/GlobalSystems').then((module) => ({ default: module.GlobalSystems }))
);

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        if (window.__lenis) {
          window.__lenis.scrollTo(element, { offset: -72 });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      if (window.__lenis) {
        window.__lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

function HomePage() {
  const collections = (siteConfig as any).portfolioCollections || {};

  return (
    <div className="space-y-0">
      <Hero />
      <Showreel />
      <Services />
      <HomeSEOContent />
      <Portfolio />
      <PortfolioCollections collections={collections} />
      <div className="pb-20 sm:pb-24 text-center">
        <motion.a
          href="/portfolio"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="premium-button bg-brand-orange text-white shadow-[0_12px_30px_rgba(255,122,0,0.28)] hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] border border-brand-orange/20 premium-focus"
        >
          Explore Full Portfolio
          <ArrowRight size={13} />
        </motion.a>
      </div>
      <Results />
      <Process />
      <SocialProof />
    </div>
  );
}

export default function App() {
  const [showSystems, setShowSystems] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (prefersReducedMotion || !isDesktop) return;

    const idleCallback = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(() => cb({
      didTimeout: false,
      timeRemaining: () => 0
    }), 900));
    const cancelIdleCallback = window.cancelIdleCallback ?? window.clearTimeout;

    const handle = idleCallback(() => setShowSystems(true));

    return () => cancelIdleCallback(handle);
  }, []);

  return (
    <Router>
      <SEO />
      <ScrollToHash />
      <main className="relative selection:bg-brand-orange selection:text-white" id="main-content">
        <Suspense fallback={null}>
          {showSystems ? <GlobalSystems /> : (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,15,15,0.04),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,249,249,1))]"
            />
          )}
        </Suspense>
        <div className="relative z-10">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              } />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/video-editing" element={<VideoEditingPage />} />
              <Route path="/logo-design" element={<LogoDesignPage />} />
              <Route path="/social-media-design" element={<SocialMediaDesignPage />} />
            </Routes>
          </Suspense>
        </div>
        <WhatsAppCTA />
      </main>
    </Router>
  );
}
