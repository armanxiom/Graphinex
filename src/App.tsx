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
import { PageTransition } from './components/PageTransition';
import PortfolioPage from './pages/Portfolio';
import { siteConfig } from './data/siteConfig';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Portfolio />
      <PortfolioCollections collections={collections} />
      <div className="pb-20 sm:pb-24 text-center">
        <motion.a
          href="/portfolio"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded-full bg-brand-orange px-6 py-3 text-white font-bold uppercase tracking-[0.22em] text-[10px] sm:text-xs shadow-[0_12px_30px_rgba(255,122,0,0.28)] hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] transition-all border border-brand-orange/20"
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
  return (
    <Router>
      <ScrollToHash />
      <main className="relative selection:bg-brand-orange selection:text-white" id="main-content">
        <PageTransition>
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <HomePage />
                <Footer />
              </>
            } />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </PageTransition>

        <WhatsAppCTA />
      </main>
    </Router>
  );
}
