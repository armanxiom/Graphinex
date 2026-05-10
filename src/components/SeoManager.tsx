import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteContent } from '../state/site-content';

function ensureMeta(name: string, content: string) {
  let node = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute('name', name);
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

function ensureLink(rel: string, href: string) {
  let node = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    document.head.appendChild(node);
  }

  node.setAttribute('href', href);
}

export function SeoManager() {
  const { content } = useSiteContent();
  const location = useLocation();

  useEffect(() => {
    const isPortfolio = location.pathname.startsWith('/portfolio');
    const isAdmin = location.pathname.startsWith('/armanxion-core');
    const seo = isPortfolio ? content.seo.portfolio : content.seo.home;

    document.title = isAdmin
      ? 'Graphinex Admin'
      : seo.title;

    ensureMeta('description', isAdmin ? 'Private Graphinex admin console.' : seo.description);
    ensureMeta('robots', isAdmin ? 'noindex, nofollow' : seo.robots);
    ensureMeta('theme-color', '#0f0f0f');
    ensureMeta('og:title', seo.title);
    ensureMeta('og:description', seo.description);
    ensureMeta('og:image', seo.ogImage);
    ensureMeta('og:url', window.location.origin + location.pathname + location.search);

    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (isAdmin) {
      canonical?.remove();
    } else {
      ensureLink('canonical', seo.canonical);
    }
  }, [content.seo.home, content.seo.portfolio, location.pathname, location.search]);

  return null;
}
