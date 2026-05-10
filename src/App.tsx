import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PageTransition } from './components/PageTransition';
import { WhatsAppCTA } from './components/WhatsAppCTA';
import { DeferredSection } from './components/DeferredSection';
import {
  BehindTheSceneSkeleton,
  CollectionsSkeleton,
  FooterSkeleton,
  HappyClientsSkeleton,
  PortfolioPageSkeleton,
  PortfolioSkeleton,
  ProcessSkeleton,
  ResultsSkeleton,
  ServicesSkeleton,
  ShowreelSkeleton,
  TestimonialsSkeleton
} from './components/SectionSkeletons';
import { useDevicePerformance, type DevicePerformanceProfile } from './lib/performance';

const loadShowreel = () => import('./components/Showreel').then((mod) => ({ default: mod.Showreel }));
const loadServices = () => import('./components/Services').then((mod) => ({ default: mod.Services }));
const loadPortfolio = () => import('./components/Portfolio').then((mod) => ({ default: mod.Portfolio }));
const loadCollections = () =>
  import('./components/PortfolioCollections').then((mod) => ({ default: mod.PortfolioCollections }));
const loadResults = () => import('./components/Results').then((mod) => ({ default: mod.Results }));
const loadTestimonials = () => import('./components/Testimonials').then((mod) => ({ default: mod.Testimonials }));
const loadHappyClients = () => import('./components/HappyClients').then((mod) => ({ default: mod.HappyClients }));
const loadProcess = () => import('./components/Process').then((mod) => ({ default: mod.Process }));
const loadSocialProof = () => import('./components/SocialProof').then((mod) => ({ default: mod.SocialProof }));
const loadBehindTheScene = () =>
  import('./components/BehindTheScene').then((mod) => ({ default: mod.BehindTheScene }));
const loadFooter = () => import('./components/Footer').then((mod) => ({ default: mod.Footer }));
const loadPortfolioPage = () => import('./pages/Portfolio');

const LazySocialProof = lazy(loadSocialProof);
const LazyPortfolioPage = lazy(loadPortfolioPage);

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const profile = useDevicePerformance();

  useEffect(() => {
    const smoothBehavior: ScrollBehavior = profile.isLowEnd ? 'auto' : 'smooth';

    if (hash) {
      const element = document.getElementById(hash.substring(1));

      if (element) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: smoothBehavior, block: 'start' });
        });
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [hash, pathname, profile.isLowEnd]);

  return null;
}

function HomePage({ performance }: { performance: DevicePerformanceProfile }) {
  const sectionLead = performance.tier === 'high' ? 1100 : performance.tier === 'balanced' ? 850 : 600;
  const getMargin = (extra = 0) => `${sectionLead + extra}px 0px`;

  return (
    <div className="space-y-0">
      <Hero />

      <DeferredSection id="showreel" loader={loadShowreel} fallback={<ShowreelSkeleton />} rootMargin={getMargin()} />
      <DeferredSection id="services" loader={loadServices} fallback={<ServicesSkeleton />} rootMargin={getMargin(140)} />
      <DeferredSection id="work" loader={loadPortfolio} fallback={<PortfolioSkeleton />} rootMargin={getMargin(260)} />
      <DeferredSection
        id="portfolio-collections"
        loader={loadCollections}
        fallback={<CollectionsSkeleton />}
        rootMargin={getMargin(380)}
      />

      <div className="pb-20 text-center sm:pb-24">
        <motion.a
          href="/portfolio"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-3 rounded-full border border-brand-orange/20 bg-brand-orange px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_30px_rgba(255,122,0,0.28)] transition-all hover:shadow-[0_16px_36px_rgba(255,122,0,0.34)] sm:text-xs"
        >
          Explore Full Portfolio
          <ArrowRight size={13} />
        </motion.a>
      </div>

      <DeferredSection id="about" loader={loadResults} fallback={<ResultsSkeleton />} rootMargin={getMargin(380)} />
      <DeferredSection
        id="testimonials"
        loader={loadTestimonials}
        fallback={<TestimonialsSkeleton />}
        rootMargin={getMargin(520)}
      />
      <DeferredSection id="clients" loader={loadHappyClients} fallback={<HappyClientsSkeleton />} rootMargin={getMargin(620)} />
      <DeferredSection id="process" loader={loadProcess} fallback={<ProcessSkeleton />} rootMargin={getMargin(700)} />

      <Suspense fallback={null}>
        <LazySocialProof />
      </Suspense>

      <DeferredSection
        id="behind-the-scene"
        loader={loadBehindTheScene}
        fallback={<BehindTheSceneSkeleton />}
        rootMargin={getMargin(820)}
      />
      <DeferredSection id="contact" loader={loadFooter} fallback={<FooterSkeleton />} rootMargin={getMargin(960)} />
    </div>
  );
}

export default function App() {
  const performance = useDevicePerformance();

  return (
    <Router>
      <ScrollToHash />
      <main
        id="main-content"
        className="relative bg-[color:var(--page-bg)] text-[color:var(--page-text)] transition-colors duration-300 selection:bg-brand-orange selection:text-white"
      >
        <div className="ambient-stage" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="ambient-orb ambient-orb--1" />
          <div className="ambient-orb ambient-orb--2" />
          <div className="ambient-orb ambient-orb--3" />
        </div>

        <div className="relative z-10">
          <PageTransition>
            <Routes>
              <Route
                path="/"
                element={(
                  <>
                    <Navbar />
                    <HomePage performance={performance} />
                  </>
                )}
              />
              <Route
                path="/portfolio"
                element={
                  <Suspense fallback={<PortfolioPageSkeleton />}>
                    <LazyPortfolioPage />
                  </Suspense>
                }
              />
            </Routes>
          </PageTransition>

          <WhatsAppCTA />
        </div>
      </main>
    </Router>
  );
}
