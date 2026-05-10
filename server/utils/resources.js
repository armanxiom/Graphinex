import { randomUUID } from 'node:crypto';
import { asBoolean, asNumber, asString } from './http.js';

const RESOURCE_CONFIG = {
  homepage_content: {
    name: 'homepage_content',
    table: 'homepage_content',
    singleton: true,
    resourceKey: 'site-home'
  },
  hero_sections: {
    name: 'hero_sections',
    table: 'hero_sections',
    singleton: true,
    resourceKey: 'home'
  },
  services: {
    name: 'services',
    table: 'services',
    singleton: false,
    keyField: 'slug'
  },
  portfolio_projects: {
    name: 'portfolio_projects',
    table: 'portfolio_projects',
    singleton: false,
    keyField: 'slug'
  },
  testimonials: {
    name: 'testimonials',
    table: 'testimonials',
    singleton: false,
    keyField: 'slug'
  },
  team_members: {
    name: 'team_members',
    table: 'team_members',
    singleton: false,
    keyField: 'slug'
  },
  media_assets: {
    name: 'media_assets',
    table: 'media_assets',
    singleton: false,
    keyField: 'id'
  },
  seo_settings: {
    name: 'seo_settings',
    table: 'seo_settings',
    singleton: false,
    keyField: 'resource_key'
  },
  contact_details: {
    name: 'contact_details',
    table: 'contact_details',
    singleton: true,
    resourceKey: 'site-contact'
  },
  footer_content: {
    name: 'footer_content',
    table: 'footer_content',
    singleton: true,
    resourceKey: 'site-footer'
  }
};

function parseJson(value, fallback = {}) {
  if (value && typeof value === 'object') {
    return value;
  }

  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizeResourceKey(resourceName, value) {
  const slug = asString(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug) {
    return slug;
  }

  return `${resourceName}-${randomUUID().slice(0, 8)}`;
}

export function resolveResource(name) {
  return RESOURCE_CONFIG[name] ?? null;
}

export function hydrateRow(row) {
  if (!row) {
    return row;
  }

  return {
    ...row,
    payload: parseJson(row.payload, {}),
    metadata: parseJson(row.metadata, {})
  };
}

function queryAll(db, sql, params = []) {
  return db.prepare(sql).all(...params).map(hydrateRow);
}

function queryOne(db, sql, params = []) {
  return hydrateRow(db.prepare(sql).get(...params) ?? null);
}

export function listResourceRows(db, resourceName) {
  const resource = resolveResource(resourceName);

  if (!resource) {
    return [];
  }

  switch (resource.name) {
    case 'homepage_content':
      return queryAll(db, 'select * from homepage_content order by updated_at desc, created_at desc');
    case 'hero_sections':
      return queryAll(db, 'select * from hero_sections order by updated_at desc, created_at desc');
    case 'services':
      return queryAll(db, 'select * from services order by sort_order asc, updated_at desc, created_at desc');
    case 'portfolio_projects':
      return queryAll(db, 'select * from portfolio_projects order by sort_order asc, updated_at desc, created_at desc');
    case 'testimonials':
      return queryAll(db, 'select * from testimonials order by sort_order asc, updated_at desc, created_at desc');
    case 'team_members':
      return queryAll(db, 'select * from team_members order by sort_order asc, updated_at desc, created_at desc');
    case 'media_assets':
      return queryAll(db, 'select * from media_assets order by created_at desc');
    case 'seo_settings':
      return queryAll(db, 'select * from seo_settings order by updated_at desc, created_at desc');
    case 'contact_details':
      return queryAll(db, 'select * from contact_details order by updated_at desc, created_at desc');
    case 'footer_content':
      return queryAll(db, 'select * from footer_content order by updated_at desc, created_at desc');
    case 'activity_logs':
      return queryAll(db, 'select * from activity_logs order by created_at desc limit 100');
    case 'drafts':
      return queryAll(db, 'select * from drafts order by updated_at desc, created_at desc');
    case 'published_content':
      return queryAll(db, 'select * from published_content order by updated_at desc, created_at desc');
    case 'roles':
      return queryAll(db, 'select * from roles order by created_at asc');
    case 'admin_users':
      return queryAll(
        db,
        `
          select
            u.id,
            u.email,
            u.display_name,
            u.avatar_url,
            u.status,
            u.last_login_at,
            u.created_at,
            u.updated_at,
            r.slug as role_slug,
            r.name as role_name,
            r.permissions as role_permissions
          from admin_users u
          inner join roles r on r.id = u.role_id
          order by u.created_at desc
        `
      ).map((row) => ({
        ...row,
        role_permissions: parseJson(row.role_permissions, {})
      }));
    default:
      return [];
  }
}

export function getResourceRow(db, resourceName, resourceKey) {
  const resource = resolveResource(resourceName);

  if (!resource) {
    return null;
  }

  switch (resource.name) {
    case 'homepage_content':
      return queryOne(db, 'select * from homepage_content where resource_key = ? limit 1', [resourceKey ?? resource.resourceKey]);
    case 'hero_sections':
      return queryOne(db, 'select * from hero_sections where resource_key = ? limit 1', [resourceKey ?? resource.resourceKey]);
    case 'contact_details':
      return queryOne(db, 'select * from contact_details where resource_key = ? limit 1', [resourceKey ?? resource.resourceKey]);
    case 'footer_content':
      return queryOne(db, 'select * from footer_content where resource_key = ? limit 1', [resourceKey ?? resource.resourceKey]);
    case 'seo_settings':
      return queryOne(db, 'select * from seo_settings where resource_key = ? limit 1', [resourceKey]);
    default:
      return queryOne(db, `select * from ${resource.table} where id = ? limit 1`, [resourceKey]);
  }
}

export function upsertResourceRow(db, resourceName, body, existingId = null) {
  const resource = resolveResource(resourceName);

  if (!resource) {
    throw new Error(`Unknown resource: ${resourceName}`);
  }

  const now = new Date().toISOString();
  const payload = body?.payload && typeof body.payload === 'object' ? body.payload : {};
  const status = asString(body?.status, 'published');
  const sortOrder = asNumber(body?.sortOrder, 0);
  const featured = asBoolean(body?.featured);
  const resourceKeyInput = asString(body?.resourceKey);
  const derivedKey = normalizeResourceKey(
    resource.name,
    resourceKeyInput || payload.title || payload.name || payload.slug || resource.resourceKey || existingId || 'item'
  );

  switch (resource.name) {
    case 'homepage_content':
    case 'hero_sections':
    case 'contact_details':
    case 'footer_content':
    case 'seo_settings': {
      const key = resource.resourceKey ?? derivedKey;
      db.prepare(
        `
          insert into ${resource.table} (resource_key, payload, status, sort_order, created_at, updated_at)
          values (?, ?, ?, ?, ?, ?)
          on conflict(resource_key) do update set
            payload = excluded.payload,
            status = excluded.status,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
        `
      ).run(key, JSON.stringify(payload), status, sortOrder, now, now);
      return key;
    }
    case 'services':
    case 'portfolio_projects':
    case 'testimonials':
    case 'team_members': {
      const id = existingId ?? randomUUID();
      const slug = derivedKey;
      db.prepare(
        `
          insert into ${resource.table} (id, slug, payload, status, sort_order, featured, created_at, updated_at)
          values (?, ?, ?, ?, ?, ?, ?, ?)
          on conflict(id) do update set
            slug = excluded.slug,
            payload = excluded.payload,
            status = excluded.status,
            sort_order = excluded.sort_order,
            featured = excluded.featured,
            updated_at = excluded.updated_at
        `
      ).run(id, slug, JSON.stringify(payload), status, sortOrder, featured ? 1 : 0, now, now);
      return id;
    }
    case 'media_assets': {
      const id = existingId ?? randomUUID();
      const filename = asString(body?.filename || payload.filename || derivedKey);
      const kind = asString(body?.kind || payload.kind || 'image');
      const mimeType = asString(body?.mimeType || payload.mimeType || payload.mime_type || 'application/octet-stream');
      const storageProvider = asString(body?.storageProvider || payload.storageProvider || 'local');
      const storagePath = asString(body?.storagePath || payload.storagePath || payload.storage_path || filename);
      const publicUrl = asString(body?.publicUrl || payload.publicUrl || payload.public_url || `/uploads/${storagePath}`);
      const previewUrl = asString(body?.previewUrl || payload.previewUrl || payload.preview_url || publicUrl);
      const altText = asString(body?.altText || payload.altText || payload.alt_text, null);
      const sizeBytes = asNumber(body?.sizeBytes || payload.sizeBytes || payload.size_bytes, 0);
      const width = Number.isFinite(Number(body?.width ?? payload.width)) ? Number(body?.width ?? payload.width) : null;
      const height = Number.isFinite(Number(body?.height ?? payload.height)) ? Number(body?.height ?? payload.height) : null;
      const durationSeconds = Number.isFinite(Number(body?.durationSeconds ?? payload.durationSeconds ?? payload.duration_seconds))
        ? Number(body?.durationSeconds ?? payload.durationSeconds ?? payload.duration_seconds)
        : null;
      const checksum = asString(body?.checksum || payload.checksum, null);

      db.prepare(
        `
          insert into media_assets (
            id,
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
            sort_order,
            created_at,
            updated_at
          )
          values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          on conflict(id) do update set
            filename = excluded.filename,
            kind = excluded.kind,
            mime_type = excluded.mime_type,
            storage_provider = excluded.storage_provider,
            storage_path = excluded.storage_path,
            public_url = excluded.public_url,
            preview_url = excluded.preview_url,
            alt_text = excluded.alt_text,
            size_bytes = excluded.size_bytes,
            width = excluded.width,
            height = excluded.height,
            duration_seconds = excluded.duration_seconds,
            checksum = excluded.checksum,
            payload = excluded.payload,
            status = excluded.status,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
        `
      ).run(
        id,
        filename,
        kind,
        mimeType,
        storageProvider,
        storagePath,
        publicUrl,
        previewUrl,
        altText,
        sizeBytes,
        width,
        height,
        durationSeconds,
        checksum,
        JSON.stringify(payload),
        status,
        sortOrder,
        now,
        now
      );
      return id;
    }
    default:
      throw new Error(`Unsupported resource: ${resource.name}`);
  }
}

export function deleteResourceRow(db, resourceName, id) {
  const resource = resolveResource(resourceName);

  if (!resource) {
    return false;
  }

  switch (resource.name) {
    case 'homepage_content':
    case 'hero_sections':
    case 'contact_details':
    case 'footer_content':
    case 'seo_settings':
      return db.prepare(`delete from ${resource.table} where resource_key = ?`).run(id ?? resource.resourceKey).changes > 0;
    default:
      return db.prepare(`delete from ${resource.table} where id = ?`).run(id).changes > 0;
  }
}

export function listCollectionMap() {
  return RESOURCE_CONFIG;
}
