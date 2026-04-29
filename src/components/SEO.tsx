import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const seoPages: Record<string, { title: string; description: string; canonical: string }> = {
  '/': {
    title: 'Graphinex Creative | Video Editing, Graphic Design & Branding Agency',
    description:
      'Graphinex Creative is a results-driven creative agency specializing in video editing, graphic design, and branding. We turn your content into clients.',
    canonical: 'https://graphinex.in/'
  },
  '/portfolio': {
    title: 'Graphinex Creative Portfolio | Video Editing, Graphic Design & Branding',
    description:
      'Explore Graphinex Creative portfolio work across video editing, graphic design, and branding built to increase attention, trust, and conversions.',
    canonical: 'https://graphinex.in/portfolio'
  },
  '/video-editing': {
    title: 'Video Editing Agency | Graphinex Creative',
    description:
      'Graphinex Creative is a video editing agency that turns raw footage into high-retention content designed to build trust and generate leads.',
    canonical: 'https://graphinex.in/video-editing'
  },
  '/logo-design': {
    title: 'Logo Design Agency | Graphinex Creative',
    description:
      'Graphinex Creative is a logo design agency building memorable brand identities that look premium, consistent, and conversion-ready.',
    canonical: 'https://graphinex.in/logo-design'
  },
  '/social-media-design': {
    title: 'Social Media Design Agency | Graphinex Creative',
    description:
      'Graphinex Creative is a social media design agency creating posts, creatives, and graphics that improve engagement and support lead generation.',
    canonical: 'https://graphinex.in/social-media-design'
  }
};

function updateMeta(name: string, content: string) {
  const selector = `meta[name="${name}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function updatePropertyMeta(property: string, content: string) {
  const selector = `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function updateCanonical(href: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
}

export function SEO() {
  const { pathname } = useLocation();
  const seo = seoPages[pathname] || seoPages['/'];

  useEffect(() => {
    document.title = seo.title;
    updateMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMeta('description', seo.description);
    updateMeta('twitter:title', seo.title);
    updateMeta('twitter:description', seo.description);
    updatePropertyMeta('og:title', seo.title);
    updatePropertyMeta('og:description', seo.description);
    updatePropertyMeta('og:url', seo.canonical);
    updatePropertyMeta('og:image', 'https://graphinex.in/logo/logo.png');
    updatePropertyMeta('og:image:alt', 'Graphinex Creative logo');
    updateCanonical(seo.canonical);
  }, [seo]);

  return null;
}
