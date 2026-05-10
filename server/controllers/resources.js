import crypto from 'node:crypto';
import { json, notFound } from '../utils/http.js';
import { appendActivity } from '../storage/content-store.js';
import { loadSiteContent, saveSiteContent } from '../utils/content.js';

function mergeDeep(target, patch) {
  if (Array.isArray(patch)) {
    return structuredClone(patch);
  }

  if (!patch || typeof patch !== 'object') {
    return patch;
  }

  const output = { ...(target ?? {}) };

  for (const [key, value] of Object.entries(patch)) {
    if (Array.isArray(value)) {
      output[key] = structuredClone(value);
      continue;
    }

    if (value && typeof value === 'object') {
      output[key] = mergeDeep(output[key], value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function listWithIds(items) {
  return (items ?? []).map((item) => ({
    ...item,
    id: item.id ?? crypto.randomUUID()
  }));
}

function flattenPortfolio(content) {
  const collections = content.portfolioCollections ?? {};
  return Object.entries(collections).flatMap(([collectionKey, items]) =>
    listWithIds(items).map((item) => ({
      ...item,
      collectionKey
    }))
  );
}

function writePortfolio(content, items) {
  const next = {
    ...(content ?? {}),
    portfolioCollections: {
      'video-editing': [],
      'graphic-design': [],
      branding: []
    }
  };

  items.forEach((item) => {
    const collectionKey = item.collectionKey && item.collectionKey in next.portfolioCollections ? item.collectionKey : 'branding';
    const copy = { ...item };
    delete copy.collectionKey;
    next.portfolioCollections[collectionKey].push(copy);
  });

  next.homePortfolioCollections = structuredClone(next.portfolioCollections);
  next.homeFeaturedWorks = items.filter((item) => Boolean(item.featured)).map((item) => {
    const copy = { ...item };
    delete copy.collectionKey;
    delete copy.featured;
    return copy;
  });

  return next;
}

function listPortfolio(content) {
  return flattenPortfolio(content).map((item) => ({
    ...item,
    featured: Boolean(content.homeFeaturedWorks?.some((featured) => featured.id === item.id))
  }));
}

function findServiceIndex(content, id) {
  return (content.serviceOverviews ?? []).findIndex((item) => item.id === id);
}

function findTestimonialIndex(content, id) {
  return (content.testimonials ?? []).findIndex((item) => item.id === id);
}

function findPortfolioItem(content, id) {
  const collections = content.portfolioCollections ?? {};

  for (const [collectionKey, items] of Object.entries(collections)) {
    const index = (items ?? []).findIndex((item) => item.id === id);

    if (index !== -1) {
      return { collectionKey, index, item: items[index] };
    }
  }

  return null;
}

export async function getServices(request, response) {
  const { content } = await loadSiteContent();
  return json(response, 200, {
    items: content.serviceOverviews ?? []
  });
}

export async function createService(request, response) {
  const body = request.body?.item ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const items = listWithIds(content.serviceOverviews ?? []);
  const nextItem = {
    id: body.id ?? crypto.randomUUID(),
    title: body.title ?? 'Service',
    icon: body.icon ?? 'SV',
    description: body.description ?? '',
    previewImage: body.previewImage ?? '',
    portfolioCategory: body.portfolioCategory ?? 'branding',
    ...body
  };

  items.push(nextItem);
  const nextContent = mergeDeep(content, { serviceOverviews: items });
  const bundle = await saveSiteContent(nextContent);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'service_create',
    summary: `Created service ${nextItem.title}`,
    createdAt: new Date().toISOString(),
    metadata: nextItem
  });

  return json(response, 200, { ok: true, ...bundle, item: nextItem });
}

export async function updateService(request, response) {
  const id = request.params.id;
  const body = request.body?.item ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const items = listWithIds(content.serviceOverviews ?? []);
  const index = findServiceIndex({ serviceOverviews: items }, id);

  if (index === -1) {
    return notFound(response);
  }

  items[index] = {
    ...items[index],
    ...body,
    id
  };

  const bundle = await saveSiteContent(mergeDeep(content, { serviceOverviews: items }));

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'service_update',
    summary: `Updated service ${items[index].title}`,
    createdAt: new Date().toISOString(),
    metadata: items[index]
  });

  return json(response, 200, { ok: true, ...bundle, item: items[index] });
}

export async function deleteService(request, response) {
  const id = request.params.id;
  const { content } = await loadSiteContent();
  const items = listWithIds(content.serviceOverviews ?? []);
  const index = findServiceIndex({ serviceOverviews: items }, id);

  if (index === -1) {
    return notFound(response);
  }

  const [removed] = items.splice(index, 1);
  const bundle = await saveSiteContent(mergeDeep(content, { serviceOverviews: items }));

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'service_delete',
    summary: `Deleted service ${removed.title}`,
    createdAt: new Date().toISOString(),
    metadata: removed
  });

  return json(response, 200, { ok: true, ...bundle });
}

export async function getPortfolio(request, response) {
  const { content } = await loadSiteContent();
  return json(response, 200, {
    collections: content.portfolioCollections ?? {},
    featured: content.homeFeaturedWorks ?? [],
    items: listPortfolio(content)
  });
}

export async function createPortfolioItem(request, response) {
  const body = request.body?.item ?? request.body ?? {};
  const collectionKey = body.collectionKey ?? request.body?.collectionKey ?? 'branding';
  const { content } = await loadSiteContent();
  const items = listPortfolio(content);
  const nextItem = {
    id: body.id ?? crypto.randomUUID(),
    title: body.title ?? 'Portfolio item',
    type: body.type ?? 'image',
    category: body.category ?? 'Collection',
    src: body.src ?? '',
    poster: body.poster ?? '',
    link: body.link ?? '#',
    ratio: body.ratio,
    collectionKey,
    featured: Boolean(body.featured),
    ...body
  };

  items.push(nextItem);
  const nextContent = mergeDeep(content, writePortfolio(content, items));
  const bundle = await saveSiteContent(nextContent);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'portfolio_create',
    summary: `Created portfolio item ${nextItem.title}`,
    createdAt: new Date().toISOString(),
    metadata: nextItem
  });

  return json(response, 200, { ok: true, ...bundle, item: nextItem });
}

export async function updatePortfolioItem(request, response) {
  const id = request.params.id;
  const body = request.body?.item ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const item = findPortfolioItem(content, id);

  if (!item) {
    return notFound(response);
  }

  const items = listPortfolio(content).map((entry) =>
    entry.id === id
      ? {
          ...entry,
          ...body,
          id,
          collectionKey: body.collectionKey ?? entry.collectionKey
        }
      : entry
  );

  const nextContent = mergeDeep(content, writePortfolio(content, items));
  const bundle = await saveSiteContent(nextContent);
  const updatedItem = items.find((entry) => entry.id === id);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'portfolio_update',
    summary: `Updated portfolio item ${updatedItem?.title ?? id}`,
    createdAt: new Date().toISOString(),
    metadata: updatedItem ?? {}
  });

  return json(response, 200, { ok: true, ...bundle, item: updatedItem });
}

export async function deletePortfolioItem(request, response) {
  const id = request.params.id;
  const { content } = await loadSiteContent();
  const items = listPortfolio(content).filter((entry) => entry.id !== id);
  const nextContent = mergeDeep(content, writePortfolio(content, items));
  const bundle = await saveSiteContent(nextContent);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'portfolio_delete',
    summary: `Deleted portfolio item ${id}`,
    createdAt: new Date().toISOString()
  });

  return json(response, 200, { ok: true, ...bundle });
}

export async function getTestimonials(request, response) {
  const { content } = await loadSiteContent();
  return json(response, 200, {
    items: content.testimonials ?? []
  });
}

export async function createTestimonial(request, response) {
  const body = request.body?.item ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const items = listWithIds(content.testimonials ?? []);
  const nextItem = {
    id: body.id ?? crypto.randomUUID(),
    name: body.name ?? 'Testimonial',
    role: body.role ?? '',
    rating: Number(body.rating ?? 5),
    review: body.review ?? '',
    ...body
  };

  items.push(nextItem);
  const bundle = await saveSiteContent(mergeDeep(content, { testimonials: items }));

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'testimonial_create',
    summary: `Created testimonial ${nextItem.name}`,
    createdAt: new Date().toISOString(),
    metadata: nextItem
  });

  return json(response, 200, { ok: true, ...bundle, item: nextItem });
}

export async function updateTestimonial(request, response) {
  const id = request.params.id;
  const body = request.body?.item ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const items = listWithIds(content.testimonials ?? []);
  const index = findTestimonialIndex({ testimonials: items }, id);

  if (index === -1) {
    return notFound(response);
  }

  items[index] = {
    ...items[index],
    ...body,
    id,
    rating: Number(body.rating ?? items[index].rating ?? 5)
  };

  const bundle = await saveSiteContent(mergeDeep(content, { testimonials: items }));

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'testimonial_update',
    summary: `Updated testimonial ${items[index].name}`,
    createdAt: new Date().toISOString(),
    metadata: items[index]
  });

  return json(response, 200, { ok: true, ...bundle, item: items[index] });
}

export async function deleteTestimonial(request, response) {
  const id = request.params.id;
  const { content } = await loadSiteContent();
  const items = listWithIds(content.testimonials ?? []);
  const index = findTestimonialIndex({ testimonials: items }, id);

  if (index === -1) {
    return notFound(response);
  }

  const [removed] = items.splice(index, 1);
  const bundle = await saveSiteContent(mergeDeep(content, { testimonials: items }));

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'testimonial_delete',
    summary: `Deleted testimonial ${removed.name}`,
    createdAt: new Date().toISOString(),
    metadata: removed
  });

  return json(response, 200, { ok: true, ...bundle });
}

export async function getHomepage(request, response) {
  const { content } = await loadSiteContent();
  return json(response, 200, {
    homepage: {
      brand: content.brand,
      navigation: content.navigation,
      hero: content.hero,
      showreel: content.showreel,
      trustCertificates: content.trustCertificates,
      serviceOverviews: content.serviceOverviews,
      results: content.results,
      contact: content.contact,
      socials: content.socials,
      footer: content.footer,
      seo: content.seo
    }
  });
}

export async function updateHomepage(request, response) {
  const body = request.body?.homepage ?? request.body?.content ?? request.body ?? {};
  const { content } = await loadSiteContent();
  const nextContent = mergeDeep(content, body);
  const bundle = await saveSiteContent(nextContent);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'homepage_update',
    summary: 'Updated homepage content',
    createdAt: new Date().toISOString(),
    metadata: Object.keys(body ?? {})
  });

  return json(response, 200, { ok: true, ...bundle });
}
