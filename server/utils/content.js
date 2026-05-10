import crypto from 'node:crypto';
import path from 'node:path';
import { cloneSiteContent, defaultSiteContent } from '../../src/lib/siteContent.ts';
import {
  appendActivity,
  createContentVersion,
  getUploadPublicUrl,
  readActivityLog,
  readContentBundle,
  readMediaIndex,
  writeContentBundle,
  writeMediaIndex,
} from '../storage/content-store.js';
import { buildWebsiteSections, decorateAssetsWithUsage, scanRealAssets } from './inventory.js';
import { asString } from './http.js';

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

export async function updateSiteContent(mutator) {
  const current = await loadSiteContent();
  const next = await mutator(cloneSiteContent(current.content));
  const bundle = await saveSiteContent(next);
  await appendActivity({
    id: crypto.randomUUID(),
    action: 'content_update',
    summary: 'Updated site content',
    createdAt: new Date().toISOString()
  });
  return {
    content: normalizeContent(next),
    updatedAt: bundle.updatedAt,
    version: bundle.version
  };
}

function mediaIdentityKey(asset) {
  return asset.publicPath || asset.path || asset.sourcePath || asset.id;
}

export async function loadMediaLibrary(content) {
  const scannedAssets = await scanRealAssets();
  const savedMedia = await readMediaIndex();
  const merged = new Map();

  scannedAssets.forEach((asset) => {
    merged.set(mediaIdentityKey(asset), {
      ...asset,
      title: asset.name,
      altText: asset.name,
      source: 'filesystem',
      notes: ''
    });
  });

  savedMedia.forEach((asset) => {
    const key = mediaIdentityKey(asset);
    merged.set(key, {
      ...merged.get(key),
      ...asset
    });
  });

  const media = Array.from(merged.values()).map((asset) => ({
    ...asset,
    usedIn: asset.usedIn ?? [],
    title: asString(asset.title, asset.name ?? 'Untitled'),
    altText: asString(asset.altText, asset.title ?? asset.name ?? ''),
    previewUrl: asString(asset.previewUrl, asset.publicPath ?? ''),
    publicPath: asString(asset.publicPath, asset.path ?? ''),
    path: asString(asset.path, asset.sourcePath ?? ''),
    notes: asString(asset.notes, '')
  }));

  const sections = buildWebsiteSections(content, media);
  const decoratedMedia = decorateAssetsWithUsage(media, sections);

  return {
    media: decoratedMedia.sort((left, right) => {
      const leftTime = new Date(left.modifiedAt ?? 0).getTime();
      const rightTime = new Date(right.modifiedAt ?? 0).getTime();
      return rightTime - leftTime;
    }),
    sections
  };
}

export async function getAdminBootstrap() {
  const { content, updatedAt, version } = await loadSiteContent();
  const { media, sections } = await loadMediaLibrary(content);
  const activity = await readActivityLog();

  return {
    content,
    updatedAt,
    version,
    sections,
    media,
    activity,
    fileRoots: [
      'public/assets',
      'public/Graphinex logo',
      'public/Logos',
      'public/Short videos',
      'public/behind scene',
      'public/agency border',
      'hero',
      'Branding',
      'Clients images',
      'Graphics design',
      'Gst documents',
      'Hero background video',
      'hero background image',
      'hero card image',
      'Services hover'
    ],
    session: {
      user: {
        id: 'direct-access',
        email: 'admin@graphinex.in',
        displayName: 'Graphinex Admin',
        avatarUrl: null,
        role: {
          slug: 'superadmin',
          name: 'Super Admin',
          permissions: { all: true }
        },
        status: 'active'
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      csrfToken: 'direct-access'
    }
  };
}

export async function addUploadedMediaRecord(file, metadata = {}) {
  const records = await readMediaIndex();
  const id = crypto.randomUUID();
  const filename = file.filename ?? file.originalname ?? path.basename(file.path ?? '');
  const relativePath = file.path ? path.relative(process.cwd(), file.path) : '';
  const record = {
    id,
    title: metadata.title || file.originalname || filename,
    altText: metadata.altText || metadata.title || file.originalname || filename,
    kind: metadata.kind || (file.mimetype?.startsWith('video/') ? 'video' : 'image'),
    category: metadata.collectionKey || 'Uploads',
    source: 'upload',
    uploaded: true,
    protected: false,
    filename,
    path: relativePath,
    publicPath: getUploadPublicUrl(filename),
    previewUrl: getUploadPublicUrl(filename),
    sizeBytes: file.size ?? 0,
    mimeType: file.mimetype ?? 'application/octet-stream',
    modifiedAt: new Date().toISOString(),
    notes: metadata.notes || ''
  };

  records.unshift(record);
  await writeMediaIndex(records);
  await appendActivity({
    id: crypto.randomUUID(),
    action: 'media_upload',
    summary: `Uploaded ${record.title}`,
    createdAt: new Date().toISOString(),
    metadata: record
  });
  return record;
}

export async function removeUploadedMediaRecord(id) {
  const records = await readMediaIndex();
  const index = records.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = records.splice(index, 1);
  await writeMediaIndex(records);
  await appendActivity({
    id: crypto.randomUUID(),
    action: 'media_delete',
    summary: `Removed ${removed.title ?? removed.filename ?? id}`,
    createdAt: new Date().toISOString(),
    metadata: removed
  });
  return removed;
}

export async function replaceContentAssetReference(targetUrl, replacementUrl) {
  return updateSiteContent((current) => {
    const replaceDeep = (value) => {
      if (Array.isArray(value)) {
        return value.map(replaceDeep);
      }

      if (value && typeof value === 'object') {
        return Object.fromEntries(
          Object.entries(value).map(([key, nextValue]) => [key, replaceDeep(nextValue)])
        );
      }

      return value === targetUrl ? replacementUrl : value;
    };

    return replaceDeep(current);
  });
}

export async function readRawContent() {
  return loadSiteContent();
}
