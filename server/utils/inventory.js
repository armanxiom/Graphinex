import fs from 'node:fs/promises';
import path from 'node:path';
import { getUploadPublicUrl } from '../storage/content-store.js';

const ROOT = process.cwd();
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const DOCUMENT_EXTENSIONS = new Set(['.pdf']);

const SCAN_ROOTS = [
  'public/assets',
  'public/Graphinex logo',
  'public/Logos',
  'public/Short videos',
  'public/behind scene',
  'public/agency border',
  'public/images',
  'hero',
  'hero background image',
  'Hero background video',
  'hero card image',
  'Branding',
  'Clients images',
  'Graphics design',
  'Gst documents',
  'Services hover'
];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function cleanDisplayName(value) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getKind(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (VIDEO_EXTENSIONS.has(ext)) {
    return 'video';
  }

  if (DOCUMENT_EXTENSIONS.has(ext)) {
    return 'document';
  }

  return 'image';
}

function getCategoryFromPath(relativePath) {
  const lower = relativePath.toLowerCase();

  if (lower.includes('video-editing')) return 'Video Editing';
  if (lower.includes('graphic-design')) return 'Graphic Design';
  if (lower.includes('branding')) return 'Branding';
  if (lower.includes('logos') || lower.includes('graphinex logo')) return 'Logos';
  if (lower.includes('services-hover') || lower.includes('services hover')) return 'Service Previews';
  if (lower.includes('hero background video')) return 'Hero Video';
  if (lower.includes('hero background image')) return 'Hero Image';
  if (lower.includes('hero card image')) return 'Hero Card';
  if (lower.includes('clients images')) return 'Clients';
  if (lower.includes('short videos')) return 'Short Videos';
  if (lower.includes('behind scene')) return 'Behind The Scene';
  if (lower.includes('certificates') || lower.includes('gst documents')) return 'Certificates';
  if (lower.includes('agency border')) return 'Brand Assets';
  return 'Assets';
}

async function walkDir(dirPath, rootLabel, collection = []) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await walkDir(absolutePath, rootLabel, collection);
        continue;
      }

      const stat = await fs.stat(absolutePath);
      const relativeFromRoot = path.relative(ROOT, absolutePath);
      const relativeFromPublic = path.relative(path.join(ROOT, 'public'), absolutePath);
      const isPublicAsset = !relativeFromPublic.startsWith('..') && !path.isAbsolute(relativeFromPublic);
      const publicPath = isPublicAsset ? `/${toPosix(relativeFromPublic)}` : null;
      const kind = getKind(absolutePath);
      const category = getCategoryFromPath(relativeFromRoot);
      const basename = path.basename(entry.name, path.extname(entry.name));

      collection.push({
        id: toPosix(relativeFromRoot),
        name: cleanDisplayName(basename),
        filename: entry.name,
        kind,
        category,
        root: rootLabel,
        sourcePath: toPosix(relativeFromRoot),
        publicPath,
        sizeBytes: stat.size,
        modifiedAt: stat.mtime.toISOString(),
        uploaded: relativeFromRoot.includes('public/assets/uploads'),
        protected: !relativeFromRoot.includes('public/assets/uploads')
      });
    }
  } catch {
    // Directory may not exist yet; that's fine.
  }

  return collection;
}

export async function scanRealAssets() {
  const assets = [];

  for (const relativeRoot of SCAN_ROOTS) {
    const absoluteRoot = path.join(ROOT, relativeRoot);
    await walkDir(absoluteRoot, relativeRoot, assets);
  }

  return assets;
}

function collectSectionAssets(value, assets) {
  const serialized = JSON.stringify(value ?? {});
  return assets.filter((asset) => asset.publicPath && serialized.includes(asset.publicPath));
}

export function buildWebsiteSections(content, assets = []) {
  const sections = [
    {
      key: 'homepage.hero',
      group: 'Homepage',
      title: 'Hero Section',
      summary: content.hero?.subheading ?? '',
      assets: collectSectionAssets(content.hero, assets),
      editable: ['heading', 'headingHighlights', 'subheading', 'video', 'placeholder'],
      data: content.hero
    },
    {
      key: 'homepage.featured-works',
      group: 'Homepage',
      title: 'Featured Work',
      summary: `${content.homeFeaturedWorks?.length ?? 0} featured clips`,
      assets: collectSectionAssets(content.homeFeaturedWorks, assets),
      editable: ['homeFeaturedWorks'],
      data: content.homeFeaturedWorks ?? []
    },
    {
      key: 'homepage.showreel',
      group: 'Homepage',
      title: 'Showreel Section',
      summary: content.showreel?.caption ?? '',
      assets: [],
      editable: ['title', 'youtubeId', 'caption'],
      data: content.showreel
    },
    {
      key: 'homepage.trust-certificates',
      group: 'Homepage',
      title: 'Trust Certificates',
      summary: `${content.trustCertificates?.length ?? 0} documents`,
      assets: collectSectionAssets(content.trustCertificates, assets),
      editable: ['trustCertificates'],
      data: content.trustCertificates ?? []
    },
    {
      key: 'homepage.services',
      group: 'Homepage',
      title: 'Services',
      summary: `${content.serviceOverviews?.length ?? 0} service blocks`,
      assets: collectSectionAssets(content.serviceOverviews, assets),
      editable: ['serviceOverviews'],
      data: content.serviceOverviews ?? []
    },
    {
      key: 'homepage.results',
      group: 'Homepage',
      title: 'Results Metrics',
      summary: `${content.results?.length ?? 0} metrics`,
      assets: [],
      editable: ['results'],
      data: content.results ?? []
    },
    {
      key: 'portfolio.video-editing',
      group: 'Portfolio',
      title: 'Video Editing',
      summary: `${content.portfolioCollections?.['video-editing']?.length ?? 0} portfolio items`,
      assets: collectSectionAssets(content.portfolioCollections?.['video-editing'], assets),
      editable: ['portfolioCollections.video-editing'],
      data: content.portfolioCollections?.['video-editing'] ?? []
    },
    {
      key: 'portfolio.graphic-design',
      group: 'Portfolio',
      title: 'Graphic Design',
      summary: `${content.portfolioCollections?.['graphic-design']?.length ?? 0} portfolio items`,
      assets: collectSectionAssets(content.portfolioCollections?.['graphic-design'], assets),
      editable: ['portfolioCollections.graphic-design'],
      data: content.portfolioCollections?.['graphic-design'] ?? []
    },
    {
      key: 'portfolio.branding',
      group: 'Portfolio',
      title: 'Branding',
      summary: `${content.portfolioCollections?.branding?.length ?? 0} portfolio items`,
      assets: collectSectionAssets(content.portfolioCollections?.branding, assets),
      editable: ['portfolioCollections.branding'],
      data: content.portfolioCollections?.branding ?? []
    },
    {
      key: 'portfolio.page.hero',
      group: 'Portfolio',
      title: 'Portfolio Hero',
      summary: content.portfolioPage?.hero?.subtitle ?? '',
      assets: [],
      editable: ['portfolioPage.hero'],
      data: content.portfolioPage?.hero ?? {}
    },
    {
      key: 'portfolio.logos',
      group: 'Portfolio',
      title: 'Logo Wall',
      summary: `${content.logos?.length ?? 0} logos`,
      assets: collectSectionAssets(content.logos, assets),
      editable: ['logos'],
      data: content.logos ?? []
    },
    {
      key: 'social-proof.happy-clients',
      group: 'Social Proof',
      title: 'Happy Clients',
      summary: `${content.happyClients?.length ?? 0} client stories`,
      assets: collectSectionAssets(content.happyClients, assets),
      editable: ['happyClients'],
      data: content.happyClients ?? []
    },
    {
      key: 'social-proof.testimonials',
      group: 'Social Proof',
      title: 'Testimonials',
      summary: `${content.testimonials?.length ?? 0} testimonials`,
      assets: [],
      editable: ['testimonials'],
      data: content.testimonials ?? []
    },
    {
      key: 'process',
      group: 'Homepage',
      title: 'Process',
      summary: `${content.process?.length ?? 0} steps`,
      assets: collectSectionAssets(content.process, assets),
      editable: ['process'],
      data: content.process ?? []
    },
    {
      key: 'reviews',
      group: 'Homepage',
      title: 'Reviews',
      summary: `${content.reviews?.length ?? 0} review items`,
      assets: [],
      editable: ['reviews'],
      data: content.reviews ?? []
    },
    {
      key: 'brand',
      group: 'Header / Footer',
      title: 'Brand and Navigation',
      summary: `${content.brand?.name ?? 'Brand'} and ${content.navigation?.length ?? 0} nav links`,
      assets: collectSectionAssets(content.brand, assets),
      editable: ['brand', 'navigation'],
      data: {
        brand: content.brand,
        navigation: content.navigation
      }
    },
    {
      key: 'contact',
      group: 'Header / Footer',
      title: 'Contact Details',
      summary: content.contact?.email ?? '',
      assets: [],
      editable: ['contact'],
      data: content.contact
    },
    {
      key: 'footer',
      group: 'Header / Footer',
      title: 'Footer',
      summary: content.footer?.brandMessage ?? '',
      assets: [],
      editable: ['footer'],
      data: content.footer
    },
    {
      key: 'seo',
      group: 'Settings',
      title: 'SEO Settings',
      summary: `${content.seo?.home?.title ?? 'SEO'} / ${content.seo?.portfolio?.title ?? 'SEO'}`,
      assets: [],
      editable: ['seo'],
      data: content.seo
    }
  ];

  return sections.map((section) => ({
    ...section
  }));
}

export function buildAssetUsageMap(sections) {
  const map = new Map();

  sections.forEach((section) => {
    (section.assets ?? []).forEach((asset) => {
      const current = map.get(asset.id) ?? [];
      map.set(asset.id, Array.from(new Set([...current, section.key])));
    });
  });

  return map;
}

export function decorateAssetsWithUsage(assets, sections) {
  const usageMap = buildAssetUsageMap(sections);
  return assets.map((asset) => ({
    ...asset,
    usedIn: usageMap.get(asset.id) ?? []
  }));
}
