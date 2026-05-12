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
    const seo = isPortfolio ? content.seo.portfolio : content.seo.home;
    const visualSkin = document.documentElement.dataset.visualSkin;

    document.title = seo.title;

    ensureMeta('description', seo.description);
    ensureMeta('robots', seo.robots);
    ensureMeta('theme-color', visualSkin === 'sr' ? '#050505' : '#0f0f0f');
    ensureMeta('og:title', seo.title);
    ensureMeta('og:description', seo.description);
    ensureMeta('og:image', seo.ogImage);
    ensureMeta('og:url', window.location.origin + location.pathname + location.search);

    ensureLink('canonical', seo.canonical);
  }, [content.seo.home, content.seo.portfolio, location.pathname, location.search]);

  return null;
}
