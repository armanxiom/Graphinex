import crypto from 'node:crypto';
import { cloneSiteContent, defaultSiteContent } from '../../src/lib/siteContent.ts';
import { createContentVersion, readContentBundle, writeContentBundle } from '../storage/content-store.js';

function deepMerge(target, source) {
  if (Array.isArray(source)) {
    return structuredClone(source);
  }

  if (!source || typeof source !== 'object') {
    return source;
  }

  const output = Array.isArray(target) ? [] : { ...(target ?? {}) };

  for (const [key, value] of Object.entries(source)) {
    const current = output[key];

    if (Array.isArray(value)) {
      output[key] = structuredClone(value);
      continue;
    }

    if (value && typeof value === 'object') {
      output[key] = deepMerge(current && typeof current === 'object' ? current : {}, value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function stableId(prefix, item, fallbackSeed = '') {
  if (item && typeof item === 'object' && typeof item.id === 'string' && item.id.trim()) {
    return item.id;
  }

  const seed = [prefix, item?.title, item?.name, item?.src, item?.image, fallbackSeed]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return seed || `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeItemArray(prefix, items = []) {
  return items.map((item, index) => ({
    id: stableId(prefix, item, String(index)),
    ...item
  }));
}

function normalizePortfolioCollections(collections = {}) {
  const keys = ['video-editing', 'graphic-design', 'branding'];
  const next = {};

  keys.forEach((key) => {
    next[key] = normalizeItemArray(`portfolio-${key}`, collections[key] ?? []);
  });

  return next;
}

export function normalizeContent(content) {
  const next = deepMerge(cloneSiteContent(defaultSiteContent), content ?? {});

  next.serviceOverviews = normalizeItemArray('service', next.serviceOverviews ?? []);
  next.homeFeaturedWorks = normalizeItemArray('featured-work', next.homeFeaturedWorks ?? []);
  next.homePortfolioCollections = normalizePortfolioCollections(next.homePortfolioCollections ?? {});
  next.portfolioCollections = normalizePortfolioCollections(next.portfolioCollections ?? {});
  next.logos = normalizeItemArray('logo', next.logos ?? []);
  next.happyClients = normalizeItemArray('happy-client', next.happyClients ?? []);
  next.testimonials = normalizeItemArray('testimonial', next.testimonials ?? []);
  next.process = normalizeItemArray('process', next.process ?? []);
  next.reviews = normalizeItemArray('review', next.reviews ?? []);
  next.teamMembers = normalizeItemArray('team-member', next.teamMembers ?? []);

  return next;
}

export async function loadSiteContent() {
  const bundle = await readContentBundle();
  const content = normalizeContent(bundle.content);
  const version = createContentVersion(content);

  if (version !== bundle.version) {
    await writeContentBundle(content);
  }

  return {
    content,
    updatedAt: bundle.updatedAt,
    version
  };
}

export async function saveSiteContent(content) {
  const normalized = normalizeContent(content);
  return writeContentBundle(normalized);
}
