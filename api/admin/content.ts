import crypto from 'node:crypto';
import { hasValidAdminAccess } from '../../server/functions/access';
import { badRequest, jsonResponse, unauthorized } from '../../server/functions/http';
import { appendActivity } from '../../server/storage/content-store.js';
import { getAdminBootstrap, saveSiteContent } from '../../server/utils/content.js';

export async function GET(request: Request) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const bootstrap = await getAdminBootstrap();
  return jsonResponse(bootstrap);
}

export async function PUT(request: Request) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  let body: any = null;

  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON payload');
  }

  const content = body && typeof body === 'object' ? body.content ?? body : null;

  if (!content || typeof content !== 'object') {
    return badRequest('Missing content payload');
  }

  const bundle = await saveSiteContent(content);

  await appendActivity({
    id: crypto.randomUUID(),
    action: 'content_save',
    summary: 'Saved site content',
    createdAt: new Date().toISOString(),
    metadata: {
      keys: Object.keys(content as Record<string, unknown>)
    }
  });

  return jsonResponse({
    ok: true,
    ...bundle
  });
}
