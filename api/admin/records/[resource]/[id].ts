import { del } from '@vercel/blob';
import { badRequest, forbidden, jsonResponse, methodNotAllowed, notFound, readJson, unauthorized } from '../../../_lib/http';
import { requireAdminSession, validateCsrf, isAllowed } from '../../../_lib/session';
import { getDatabase } from '../../../_lib/database';
import { resolveResource } from '../../../_lib/resources';
import { resourcePatchSchema } from '../../../_lib/schemas';
import { insertOrUpdateResource } from '../[resource]';
import { saveDraftSnapshot } from '../../../_lib/content';

async function deleteRow(database: ReturnType<typeof getDatabase>, resource: ReturnType<typeof resolveResource>, id: string) {
  if (!database || !resource) {
    return null;
  }

  switch (resource.name) {
    case 'homepage_content':
      return database`delete from homepage_content where id = ${id}`;
    case 'hero_sections':
      return database`delete from hero_sections where id = ${id}`;
    case 'services':
      return database`delete from services where id = ${id}`;
    case 'portfolio_projects':
      return database`delete from portfolio_projects where id = ${id}`;
    case 'testimonials':
      return database`delete from testimonials where id = ${id}`;
    case 'team_members':
      return database`delete from team_members where id = ${id}`;
    case 'media_assets':
      return database`delete from media_assets where id = ${id}`;
    case 'seo_settings':
      return database`delete from seo_settings where id = ${id}`;
    case 'contact_details':
      return database`delete from contact_details where id = ${id}`;
    case 'footer_content':
      return database`delete from footer_content where id = ${id}`;
    default:
      return null;
  }
}

async function getMediaAsset(database: ReturnType<typeof getDatabase>, id: string) {
  if (!database) {
    return null;
  }

  const rows = (await database`select id, public_url, storage_path from media_assets where id = ${id} limit 1`) as any[];
  return rows[0] ?? null;
}

function getRouteParams(request: Request) {
  const segments = new URL(request.url).pathname.split('/').filter(Boolean);
  return {
    resource: segments.at(-2) ?? '',
    id: segments.at(-1) ?? ''
  };
}

export async function PATCH(request: Request) {
  const database = getDatabase();
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  if (!validateCsrf(request, session)) {
    return forbidden('Invalid CSRF token');
  }

  if (!isAllowed(session, 'manage_content')) {
    return forbidden();
  }

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const params = getRouteParams(request);
  const resource = resolveResource(params.resource);

  if (!resource) {
    return notFound();
  }

  const body = await readJson(request, resourcePatchSchema);
  const resourceKey = await insertOrUpdateResource(
    database,
    resource,
    {
      resourceKey: body.resourceKey,
      payload: body.payload ?? {},
      status: body.status,
      sortOrder: body.sortOrder,
      featured: body.featured
    },
    params.id
  );

  await saveDraftSnapshot(session.user.id);

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${session.user.id}, 'resource_update', ${resource.name}, ${params.id}, 'Updated resource item', ${JSON.stringify({ resourceKey, payload: body.payload ?? {} })}, now())
  `;

  return jsonResponse({ ok: true, resourceKey });
}

export async function DELETE(request: Request) {
  const database = getDatabase();
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  if (!validateCsrf(request, session)) {
    return forbidden('Invalid CSRF token');
  }

  if (!isAllowed(session, 'manage_content')) {
    return forbidden();
  }

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const params = getRouteParams(request);
  const resource = resolveResource(params.resource);

  if (!resource) {
    return notFound();
  }

  if (resource.name === 'media_assets') {
    const asset = await getMediaAsset(database, params.id);

    if (asset?.public_url) {
      try {
        await del(asset.public_url);
      } catch {
        // Storage deletion is best-effort. The database record still gets removed.
      }
    }
  }

  await deleteRow(database, resource, params.id);
  await saveDraftSnapshot(session.user.id);

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${session.user.id}, 'resource_delete', ${resource.name}, ${params.id}, 'Deleted resource item', ${JSON.stringify({ resource: resource.name })}, now())
  `;

  return jsonResponse({ ok: true });
}

export async function GET() {
  return methodNotAllowed(['PATCH', 'DELETE']);
}
