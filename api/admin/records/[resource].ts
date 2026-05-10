import { jsonResponse, unauthorized, forbidden, badRequest, methodNotAllowed, readJson, notFound } from '../../_lib/http';
import { requireAdminSession, validateCsrf, isAllowed } from '../../_lib/session';
import { getDatabase } from '../../_lib/database';
import { resolveResource } from '../../_lib/resources';
import { resourceMutationSchema } from '../../_lib/schemas';
import { saveDraftSnapshot } from '../../_lib/content';
import { sha256 } from '../../_lib/crypto';

async function listResourceRows(database: ReturnType<typeof getDatabase>, resource: ReturnType<typeof resolveResource>) {
  if (!database || !resource) {
    return [];
  }

  switch (resource.name) {
    case 'homepage_content':
      return (await database`select * from homepage_content order by updated_at desc`) as any[];
    case 'hero_sections':
      return (await database`select * from hero_sections order by updated_at desc`) as any[];
    case 'services':
      return (await database`select * from services order by sort_order asc, updated_at desc`) as any[];
    case 'portfolio_projects':
      return (await database`select * from portfolio_projects order by sort_order asc, updated_at desc`) as any[];
    case 'testimonials':
      return (await database`select * from testimonials order by sort_order asc, updated_at desc`) as any[];
    case 'team_members':
      return (await database`select * from team_members order by sort_order asc, updated_at desc`) as any[];
    case 'media_assets':
      return (await database`select * from media_assets order by created_at desc`) as any[];
    case 'seo_settings':
      return (await database`select * from seo_settings order by updated_at desc`) as any[];
    case 'contact_details':
      return (await database`select * from contact_details order by updated_at desc`) as any[];
    case 'footer_content':
      return (await database`select * from footer_content order by updated_at desc`) as any[];
    default:
      return [];
  }
}

export async function insertOrUpdateResource(
  database: ReturnType<typeof getDatabase>,
  resource: NonNullable<ReturnType<typeof resolveResource>>,
  body: { resourceKey?: string; payload: Record<string, any>; status?: string; sortOrder?: number; featured?: boolean },
  existingId?: string
) {
  const payload = {
    ...body.payload
  };

  const status = body.status ?? 'published';
  const sortOrder = body.sortOrder ?? 0;
  const featured = body.featured ?? false;
  const resourceKey =
    body.resourceKey ||
    asResourceKey(resource.name, payload.title ?? payload.name ?? payload.slug ?? resource.resourceKey ?? 'item');

  if (!database) {
    return null;
  }

  switch (resource.name) {
    case 'homepage_content':
      await database`
        insert into homepage_content (resource_key, payload, status, sort_order, created_at, updated_at)
        values (${resource.resourceKey ?? resourceKey}, ${payload}, ${status}, ${sortOrder}, now(), now())
        on conflict (resource_key)
        do update set
          payload = excluded.payload,
          status = excluded.status,
          sort_order = excluded.sort_order,
          updated_at = now()
      `;
      break;
    case 'hero_sections':
      await database`
        insert into hero_sections (resource_key, payload, status, sort_order, created_at, updated_at)
        values (${resource.resourceKey ?? resourceKey}, ${payload}, ${status}, ${sortOrder}, now(), now())
        on conflict (resource_key)
        do update set
          payload = excluded.payload,
          status = excluded.status,
          sort_order = excluded.sort_order,
          updated_at = now()
      `;
      break;
    case 'services':
      if (existingId) {
        await database`
          update services
          set slug = ${resourceKey},
              payload = ${payload},
              status = ${status},
              sort_order = ${sortOrder},
              updated_at = now()
          where id = ${existingId}
        `;
      } else {
        await database`
          insert into services (slug, payload, status, sort_order, created_at, updated_at)
          values (${resourceKey}, ${payload}, ${status}, ${sortOrder}, now(), now())
        `;
      }
      break;
    case 'portfolio_projects':
      if (existingId) {
        await database`
          update portfolio_projects
          set slug = ${resourceKey},
              payload = ${payload},
              status = ${status},
              sort_order = ${sortOrder},
              featured = ${featured},
              updated_at = now()
          where id = ${existingId}
        `;
      } else {
        await database`
          insert into portfolio_projects (slug, payload, status, sort_order, featured, created_at, updated_at)
          values (${resourceKey}, ${payload}, ${status}, ${sortOrder}, ${featured}, now(), now())
        `;
      }
      break;
    case 'testimonials':
      if (existingId) {
        await database`
          update testimonials
          set slug = ${resourceKey},
              payload = ${payload},
              status = ${status},
              sort_order = ${sortOrder},
              updated_at = now()
          where id = ${existingId}
        `;
      } else {
        await database`
          insert into testimonials (slug, payload, status, sort_order, created_at, updated_at)
          values (${resourceKey}, ${payload}, ${status}, ${sortOrder}, now(), now())
        `;
      }
      break;
    case 'team_members':
      if (existingId) {
        await database`
          update team_members
          set slug = ${resourceKey},
              payload = ${payload},
              status = ${status},
              sort_order = ${sortOrder},
              updated_at = now()
          where id = ${existingId}
        `;
      } else {
        await database`
          insert into team_members (slug, payload, status, sort_order, created_at, updated_at)
          values (${resourceKey}, ${payload}, ${status}, ${sortOrder}, now(), now())
        `;
      }
      break;
    case 'media_assets':
      if (existingId) {
        await database`
          update media_assets
          set filename = ${asString(payload.filename ?? resourceKey)},
              kind = ${asString(payload.kind ?? 'image')},
              mime_type = ${asString(payload.mimeType ?? payload.mime_type ?? 'application/octet-stream')},
              storage_provider = ${asString(payload.storageProvider ?? 'vercel-blob')},
              storage_path = ${asString(payload.storagePath ?? payload.storage_path ?? resourceKey)},
              public_url = ${asString(payload.publicUrl ?? payload.public_url ?? '')},
              preview_url = ${typeof payload.previewUrl === 'string' ? payload.previewUrl : null},
              alt_text = ${typeof payload.altText === 'string' ? payload.altText : null},
              size_bytes = ${Number(payload.sizeBytes ?? payload.size_bytes ?? 0)},
              width = ${typeof payload.width === 'number' ? payload.width : null},
              height = ${typeof payload.height === 'number' ? payload.height : null},
              duration_seconds = ${typeof payload.durationSeconds === 'number' ? payload.durationSeconds : null},
              checksum = ${typeof payload.checksum === 'string' ? payload.checksum : null},
              payload = ${payload},
              status = ${status},
              updated_at = now()
          where id = ${existingId}
        `;
      } else {
        await database`
          insert into media_assets (
            filename,
            kind,
            mime_type,
            storage_provider,
            storage_path,
            public_url,
            preview_url,
            alt_text,
            size_bytes,
            width,
            height,
            duration_seconds,
            checksum,
            payload,
            status,
            created_at,
            updated_at
          )
          values (
            ${asString(payload.filename ?? resourceKey)},
            ${asString(payload.kind ?? 'image')},
            ${asString(payload.mimeType ?? payload.mime_type ?? 'application/octet-stream')},
            ${asString(payload.storageProvider ?? 'vercel-blob')},
            ${asString(payload.storagePath ?? payload.storage_path ?? resourceKey)},
            ${asString(payload.publicUrl ?? payload.public_url ?? '')},
            ${typeof payload.previewUrl === 'string' ? payload.previewUrl : null},
            ${typeof payload.altText === 'string' ? payload.altText : null},
            ${Number(payload.sizeBytes ?? payload.size_bytes ?? 0)},
            ${typeof payload.width === 'number' ? payload.width : null},
            ${typeof payload.height === 'number' ? payload.height : null},
            ${typeof payload.durationSeconds === 'number' ? payload.durationSeconds : null},
            ${typeof payload.checksum === 'string' ? payload.checksum : null},
            ${payload},
            ${status},
            now(),
            now()
          )
        `;
      }
      break;
    case 'seo_settings':
      await database`
        insert into seo_settings (resource_key, payload, status, created_at, updated_at)
        values (${resourceKey}, ${payload}, ${status}, now(), now())
        on conflict (resource_key)
        do update set
          payload = excluded.payload,
          status = excluded.status,
          updated_at = now()
      `;
      break;
    case 'contact_details':
      await database`
        insert into contact_details (resource_key, payload, status, created_at, updated_at)
        values (${resource.resourceKey ?? resourceKey}, ${payload}, ${status}, now(), now())
        on conflict (resource_key)
        do update set
          payload = excluded.payload,
          status = excluded.status,
          updated_at = now()
      `;
      break;
    case 'footer_content':
      await database`
        insert into footer_content (resource_key, payload, status, created_at, updated_at)
        values (${resource.resourceKey ?? resourceKey}, ${payload}, ${status}, now(), now())
        on conflict (resource_key)
        do update set
          payload = excluded.payload,
          status = excluded.status,
          updated_at = now()
      `;
      break;
  }

  return resourceKey;
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asResourceKey(resourceName: string, value: unknown) {
  const input = asString(value);
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (normalized) {
    return normalized;
  }

  return `${resourceName}-${Math.random().toString(36).slice(2, 8)}`;
}

async function logActivity(database: ReturnType<typeof getDatabase>, actorId: string, action: string, entityType: string, entityId: string | null, summary: string, metadata: Record<string, unknown> = {}) {
  if (!database) {
    return;
  }

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${actorId}, ${action}, ${entityType}, ${entityId}, ${summary}, ${metadata}, now())
  `;
}

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  const resourceName = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  if (!resourceName) {
    return badRequest('Missing resource');
  }

  const resource = resolveResource(resourceName);
  if (!resource) {
    return notFound();
  }

  const database = getDatabase();
  const rows = await listResourceRows(database, resource);

  return jsonResponse({
    resource: resource.name,
    rows
  });
}

export async function POST(request: Request) {
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

  const resourceName = new URL(request.url).pathname.split('/').filter(Boolean).at(-1);
  if (!resourceName) {
    return badRequest('Missing resource');
  }

  const resource = resolveResource(resourceName);
  if (!resource) {
    return notFound();
  }

  const body = await readJson(request, resourceMutationSchema);
  const resourceKey = await insertOrUpdateResource(
    database,
    resource,
    {
      resourceKey: body.resourceKey,
      payload: body.payload,
      status: body.status,
      sortOrder: body.sortOrder,
      featured: body.featured
    }
  );

  await saveDraftSnapshot(session.user.id);
  await logActivity(database, session.user.id, 'resource_create', resource.name, resourceKey ?? null, `Updated ${resource.name}`, {
    resourceKey,
    status: body.status,
    sortOrder: body.sortOrder,
    featured: body.featured
  });

  return jsonResponse({ ok: true, resourceKey });
}

export async function PUT() {
  return methodNotAllowed(['GET', 'POST']);
}
