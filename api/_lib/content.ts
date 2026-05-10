import { cloneSiteContent, defaultSiteContent, type MediaItemContent, type PortfolioCollectionContent, type SeoPageContent, type ServiceOverviewContent, type SiteContent, type TeamMemberContent } from '../../src/lib/siteContent';
import { getDatabase } from './database';

const SNAPSHOT_KEY = 'site_snapshot';
const HOME_KEY = 'site-home';
const HERO_KEY = 'home';
const CONTACT_KEY = 'site-contact';
const FOOTER_KEY = 'site-footer';

function asRecord(value: unknown): Record<string, any> {
  return value && typeof value === 'object' ? (value as Record<string, any>) : {};
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeMediaItem(payload: Record<string, any>, fallbackType: 'video' | 'image' = 'image'): MediaItemContent | null {
  const src = asString(payload.src ?? payload.public_url);
  const title = asString(payload.title);

  if (!src || !title) {
    return null;
  }

  return {
    type: payload.type === 'video' ? 'video' : fallbackType,
    title,
    category: asString(payload.category, 'Collection'),
    src,
    poster: typeof payload.poster === 'string' ? payload.poster : undefined,
    link: typeof payload.link === 'string' ? payload.link : undefined,
    ratio: payload.ratio === 'landscape' || payload.ratio === 'square' ? payload.ratio : undefined
  };
}

function normalizeService(payload: Record<string, any>, fallbackId: string): ServiceOverviewContent {
  return {
    id: asString(payload.id, fallbackId),
    title: asString(payload.title, 'Service'),
    icon: asString(payload.icon, 'SV'),
    description: asString(payload.description),
    previewImage: asString(payload.previewImage),
    portfolioCategory: asString(payload.portfolioCategory, 'branding')
  };
}

function normalizeSeoRow(payload: Record<string, any>, fallback: SeoPageContent): SeoPageContent {
  return {
    title: asString(payload.title, fallback.title),
    description: asString(payload.description, fallback.description),
    canonical: asString(payload.canonical, fallback.canonical),
    ogImage: asString(payload.ogImage, fallback.ogImage),
    robots: asString(payload.robots, fallback.robots)
  };
}

function normalizePortfolioCollections(rows: Array<{ payload: unknown }>): PortfolioCollectionContent {
  const collections: PortfolioCollectionContent = {
    'video-editing': [],
    'graphic-design': [],
    branding: []
  };

  rows.forEach((row) => {
    const payload = asRecord(row.payload);
    const key = asString(payload.collectionKey);
    const item = normalizeMediaItem(payload, payload.type === 'video' ? 'video' : 'image');

    if (!item || !(key in collections)) {
      return;
    }

    collections[key as keyof PortfolioCollectionContent].push(item);
  });

  return collections;
}

export async function composeSiteSnapshotFromTables(): Promise<SiteContent> {
  const database = getDatabase();

  if (!database) {
    return cloneSiteContent(defaultSiteContent);
  }

  try {
    const [
      homepageRows,
      heroRows,
      serviceRows,
      projectRows,
      testimonialRows,
      teamRows,
      mediaRows,
      contactRows,
      footerRows,
      seoRows
    ] = await Promise.all([
      database`select * from homepage_content where resource_key = ${HOME_KEY} order by updated_at desc limit 1`,
      database`select * from hero_sections where resource_key = ${HERO_KEY} order by updated_at desc limit 1`,
      database`select * from services where status = 'published' order by sort_order asc, created_at asc`,
      database`select * from portfolio_projects where status = 'published' order by sort_order asc, created_at asc`,
      database`select * from testimonials where status = 'published' order by sort_order asc, created_at asc`,
      database`select * from team_members where status in ('published', 'draft') order by sort_order asc, created_at asc`,
      database`select * from media_assets where status = 'active' order by created_at desc`,
      database`select * from contact_details where resource_key = ${CONTACT_KEY} order by updated_at desc limit 1`,
      database`select * from footer_content where resource_key = ${FOOTER_KEY} order by updated_at desc limit 1`,
      database`select * from seo_settings where resource_key in ('home', 'portfolio') order by updated_at desc`
    ]);

    const content = cloneSiteContent(defaultSiteContent);
    const homepagePayload = asRecord((homepageRows as any[])[0]?.payload);
    const heroPayload = asRecord((heroRows as any[])[0]?.payload);
    const contactPayload = asRecord((contactRows as any[])[0]?.payload);
    const footerPayload = asRecord((footerRows as any[])[0]?.payload);

    if (homepagePayload.brand) {
      content.brand = {
        ...content.brand,
        ...(asRecord(homepagePayload.brand) as SiteContent['brand'])
      };
    }

  if (Array.isArray(homepagePayload.navigation)) {
    content.navigation = homepagePayload.navigation as SiteContent['navigation'];
  }

  if (homepagePayload.showreel) {
    content.showreel = {
      ...content.showreel,
      ...(asRecord(homepagePayload.showreel) as SiteContent['showreel'])
    };
  }

  if (Array.isArray(homepagePayload.trustCertificates)) {
    content.trustCertificates = homepagePayload.trustCertificates as SiteContent['trustCertificates'];
  }

  if (Array.isArray(homepagePayload.results)) {
    content.results = homepagePayload.results as SiteContent['results'];
  }

  if (Array.isArray(homepagePayload.socials)) {
    content.socials = homepagePayload.socials as SiteContent['socials'];
  }

  if (Array.isArray(homepagePayload.happyClients)) {
    content.happyClients = homepagePayload.happyClients as SiteContent['happyClients'];
  }

  if (Array.isArray(homepagePayload.activity)) {
    content.activity = homepagePayload.activity as SiteContent['activity'];
  }

  if (homepagePayload.portfolioPage) {
    content.portfolioPage = homepagePayload.portfolioPage as SiteContent['portfolioPage'];
  }

  if ((heroRows as any[])[0]?.payload) {
    content.hero = {
      ...content.hero,
      ...(asRecord(heroPayload) as SiteContent['hero'])
    };
  }

  if ((contactRows as any[])[0]?.payload) {
    content.contact = {
      ...content.contact,
      ...(asRecord(contactPayload) as SiteContent['contact'])
    };
  }

  if ((footerRows as any[])[0]?.payload) {
    content.footer = {
      ...content.footer,
      ...(asRecord(footerPayload) as SiteContent['footer'])
    };
  }

  const services = (serviceRows as any[]).map((row, index) => normalizeService(asRecord(row.payload), row.id ?? String(index + 1)));
  if (services.length > 0) {
    content.serviceOverviews = services;
  }

  const testimonials = (testimonialRows as any[]).map((row) => {
    const payload = asRecord(row.payload);

    return {
      name: asString(payload.name, 'Testimonial'),
      role: asString(payload.role),
      rating: Number(payload.rating ?? 5),
      review: asString(payload.review)
    };
  });
  if (testimonials.length > 0) {
    content.testimonials = testimonials;
  }

  const teamMembers = (teamRows as any[]).map((row, index) => {
    const payload = asRecord(row.payload);
    const status: TeamMemberContent['status'] = payload.status === 'published' ? 'published' : 'draft';
    return {
      id: asString(payload.id, row.resource_key ?? String(index + 1)),
      name: asString(payload.name, 'Team member'),
      role: asString(payload.role),
      bio: asString(payload.bio),
      avatarUrl: typeof payload.avatarUrl === 'string' ? payload.avatarUrl : undefined,
      socialLinks: asArray<{ name: string; href: string }>(payload.socialLinks),
      status
    };
  });
  if (teamMembers.length > 0) {
    content.teamMembers = teamMembers;
  }

  const featuredWorks = (projectRows as any[])
    .filter((row) => Boolean(asRecord(row.payload).featured))
    .map((row) => normalizeMediaItem(asRecord(row.payload), asRecord(row.payload).type === 'video' ? 'video' : 'image'))
    .filter(Boolean) as MediaItemContent[];
  if (featuredWorks.length > 0) {
    content.homeFeaturedWorks = featuredWorks;
  }

  const portfolioCollections = normalizePortfolioCollections(projectRows as any[]);
  if (portfolioCollections['video-editing'].length || portfolioCollections['graphic-design'].length || portfolioCollections.branding.length) {
    content.homePortfolioCollections = portfolioCollections;
    content.portfolioCollections = portfolioCollections;
  }

  const logoRows = (mediaRows as any[]).filter((row) => row.kind === 'logo');
  if (logoRows.length > 0) {
    content.logos = logoRows
      .map((row) => normalizeMediaItem({ ...asRecord(row.payload), public_url: row.public_url }, 'image'))
      .filter(Boolean) as MediaItemContent[];
  }

  const seoHome = (seoRows as any[]).find((row) => row.resource_key === 'home');
  const seoPortfolio = (seoRows as any[]).find((row) => row.resource_key === 'portfolio');
  if (seoHome?.payload || seoPortfolio?.payload) {
    content.seo = {
      home: normalizeSeoRow(asRecord(seoHome?.payload), content.seo.home),
      portfolio: normalizeSeoRow(asRecord(seoPortfolio?.payload), content.seo.portfolio)
    };
  }

    return content;
  } catch {
    return cloneSiteContent(defaultSiteContent);
  }
}

export async function readSnapshot(resourceKey: string, variant: 'draft' | 'published') {
  const database = getDatabase();

  if (!database) {
    return null;
  }

  try {
    const rows =
      variant === 'draft'
        ? ((await database`select * from drafts where resource_key = ${resourceKey} order by updated_at desc limit 1`) as any[])
        : ((await database`select * from published_content where resource_key = ${resourceKey} order by updated_at desc limit 1`) as any[]);

    const payload = rows[0]?.payload;

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return payload as SiteContent;
  } catch {
    return null;
  }
}

export async function upsertSnapshot(
  resourceKey: string,
  variant: 'draft' | 'published',
  payload: SiteContent,
  actorUserId: string | null,
  version = Date.now().toString()
) {
  const database = getDatabase();

  if (!database) {
    return null;
  }

  if (variant === 'draft') {
    await database`
      insert into drafts (resource_key, payload, updated_by, created_at, updated_at)
      values (${resourceKey}, ${payload}, ${actorUserId}, now(), now())
      on conflict (resource_key)
      do update set
        payload = excluded.payload,
        updated_by = excluded.updated_by,
        updated_at = now()
    `;
    return null;
  }

  await database`
    insert into published_content (resource_key, payload, version, published_by, published_at, created_at, updated_at)
    values (${resourceKey}, ${payload}, ${version}, ${actorUserId}, now(), now(), now())
    on conflict (resource_key)
    do update set
      payload = excluded.payload,
      version = excluded.version,
      published_by = excluded.published_by,
      published_at = now(),
      updated_at = now()
  `;

  return null;
}

export async function saveDraftSnapshot(actorUserId: string | null) {
  const snapshot = await composeSiteSnapshotFromTables();
  await upsertSnapshot(SNAPSHOT_KEY, 'draft', snapshot, actorUserId);
  return snapshot;
}

export async function publishDraftSnapshot(actorUserId: string | null) {
  const draft = await readSnapshot(SNAPSHOT_KEY, 'draft');
  const payload = draft ?? cloneSiteContent(defaultSiteContent);

  await upsertSnapshot(SNAPSHOT_KEY, 'published', payload, actorUserId);
  return payload;
}

export async function readPublishedSnapshot() {
  const snapshot = await readSnapshot(SNAPSHOT_KEY, 'published');
  return snapshot ?? cloneSiteContent(defaultSiteContent);
}

export async function readDraftSnapshot() {
  const snapshot = await readSnapshot(SNAPSHOT_KEY, 'draft');
  return snapshot ?? cloneSiteContent(defaultSiteContent);
}
