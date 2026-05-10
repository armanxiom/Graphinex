import crypto from 'node:crypto';
import { json } from '../utils/http.js';
import { appendActivity, readActivityLog } from '../storage/content-store.js';
import { getAdminBootstrap, loadSiteContent, saveSiteContent } from '../utils/content.js';

export async function getAdminStatus(request, response) {
  const bootstrap = await getAdminBootstrap();

  return json(response, 200, {
    ok: true,
    version: bootstrap.version,
    updatedAt: bootstrap.updatedAt,
    counts: {
      sections: bootstrap.sections.length,
      media: bootstrap.media.length,
      fileRoots: bootstrap.fileRoots.length
    }
  });
}

export async function getAdminContent(request, response) {
  const bootstrap = await getAdminBootstrap();
  return json(response, 200, bootstrap);
}

export async function saveAdminContent(request, response) {
  const body = request.body?.content ?? request.body ?? {};
  const bundle = await saveSiteContent(body);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'content_save',
    summary: 'Saved site content',
    createdAt: new Date().toISOString(),
    metadata: {
      keys: Object.keys(body ?? {})
    }
  });

  return json(response, 200, {
    ok: true,
    ...bundle
  });
}

export async function publishAdminContent(request, response) {
  const { content } = await loadSiteContent();
  const bundle = await saveSiteContent(content);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'publish',
    summary: 'Published site content',
    createdAt: new Date().toISOString()
  });

  return json(response, 200, {
    ok: true,
    ...bundle
  });
}

export async function getAdminActivity(request, response) {
  const activity = await readActivityLog();

  return json(response, 200, {
    items: activity
  });
}
