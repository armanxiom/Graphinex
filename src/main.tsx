import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SiteContentProvider } from './state/site-content';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </StrictMode>,
);

const markAppReady = () => {
  document.documentElement.dataset.appReady = 'true';
};

const registerServiceWorker = () => {
  if (!import.meta.env.PROD || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const register = () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // Keep the app resilient if the service worker cannot register.
    });
  };

  if (document.readyState === 'complete') {
    register();
    return;
  }

  window.addEventListener('load', register, { once: true });
};

if (typeof window !== 'undefined') {
  window.requestAnimationFrame(() => {
    markAppReady();
  });

  registerServiceWorker();

  const performanceTier = document.documentElement.dataset.performance ?? 'balanced';
  const shouldPrefetch = performanceTier !== 'low';

  if (shouldPrefetch) {
    const schedulingWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    };

    const prefetch = () => {
      const loaders: Array<() => Promise<unknown>> = [
        () => import('./components/Showreel'),
        () => import('./components/Services'),
        () => import('./components/Portfolio'),
        () => import('./components/PortfolioCollections'),
        () => import('./components/Results'),
        () => import('./components/Testimonials'),
        () => import('./components/HappyClients'),
        () => import('./components/Process'),
        () => import('./components/BehindTheScene'),
        () => import('./components/Footer'),
        () => import('./components/SocialProof'),
        () => import('./pages/Portfolio')
      ];

      const stagedLoaders = performanceTier === 'high' ? loaders : loaders.slice(0, 6);

      stagedLoaders.forEach((load, index) => {
        window.setTimeout(() => {
          void load();
        }, index * 220);
      });

      if (performanceTier === 'high') {
        window.setTimeout(() => {
          void import('gsap');
          void import('gsap/ScrollTrigger');
        }, 1800);
      }
    };

    if (schedulingWindow.requestIdleCallback) {
      schedulingWindow.requestIdleCallback(prefetch, { timeout: 2500 });
    } else {
      window.setTimeout(prefetch, 1800);
    }
  }
}
