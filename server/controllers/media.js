import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { forbidden, json, notFound } from '../utils/http.js';
import {
  addUploadedMediaRecord,
  loadMediaLibrary,
  loadSiteContent,
  removeUploadedMediaRecord,
  replaceContentAssetReference
} from '../utils/content.js';
import { UPLOAD_DIR, readMediaIndex, safeUnlink, writeMediaIndex } from '../storage/content-store.js';

const ROOT = process.cwd();

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function resolveAbsolutePath(value) {
  if (!value) {
    return null;
  }

  if (path.isAbsolute(value)) {
    return value;
  }

  return path.join(ROOT, value.replace(/^\/+/, ''));
}

function toPublicPath(value) {
  if (!value) {
    return '';
  }

  const absolutePath = resolveAbsolutePath(value);
  if (!absolutePath) {
    return '';
  }

  const relative = path.relative(ROOT, absolutePath);
  return `/${toPosix(relative)}`;
}

function isUploadPath(value) {
  const absolute = resolveAbsolutePath(value);

  if (!absolute) {
    return false;
  }

  return path.resolve(absolute).startsWith(path.resolve(UPLOAD_DIR));
}

async function getResolvedMediaLibrary() {
  const { content } = await loadSiteContent();
  return loadMediaLibrary(content);
}

async function findMediaById(id) {
  const { media } = await getResolvedMediaLibrary();
  return media.find((entry) => entry.id === id) ?? null;
}

async function upsertMediaRecord(id, patch) {
  const records = await readMediaIndex();
  const index = records.findIndex((entry) => entry.id === id);
  const next = {
    id,
    title: patch.title ?? '',
    altText: patch.altText ?? patch.title ?? '',
    category: patch.category ?? '',
    notes: patch.notes ?? '',
    publicPath: patch.publicPath ?? '',
    previewUrl: patch.previewUrl ?? patch.publicPath ?? '',
    path: patch.path ?? '',
    filename: patch.filename ?? '',
    kind: patch.kind ?? 'image',
    mimeType: patch.mimeType ?? 'application/octet-stream',
    storageProvider: patch.storageProvider ?? 'local',
    storagePath: patch.storagePath ?? patch.path ?? '',
    sizeBytes: patch.sizeBytes ?? 0,
    uploaded: patch.uploaded ?? false,
    protected: patch.protected ?? false,
    status: patch.status ?? 'active',
    updatedAt: new Date().toISOString(),
    ...patch
  };

  if (index === -1) {
    records.unshift(next);
  } else {
    records[index] = {
      ...records[index],
      ...next,
      updatedAt: new Date().toISOString()
    };
  }

  await writeMediaIndex(records);
  return index === -1 ? records[0] : records[index];
}

async function replaceFileAtTarget(sourcePath, targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(sourcePath, targetPath);
  await safeUnlink(sourcePath);
}

export async function getMedia(request, response) {
  const { content } = await loadSiteContent();
  const { media, sections } = await loadMediaLibrary(content);

  return json(response, 200, {
    items: media,
    sections
  });
}

export async function uploadMedia(request, response) {
  if (!request.file) {
    return json(response, 400, {
      code: '400',
      message: 'No file uploaded.'
    });
  }

  const record = await addUploadedMediaRecord(request.file, request.body ?? {});

  return json(response, 200, {
    ok: true,
    item: record
  });
}

export async function updateMedia(request, response) {
  const id = request.params.id;
  const existing = await findMediaById(id);

  if (!existing) {
    return notFound(response);
  }

  const patch = request.body?.item ?? request.body ?? {};
  const requestedTarget = patch.replaceTarget || patch.publicPath || existing.publicPath || existing.path || '';
  const targetAbsolute = resolveAbsolutePath(requestedTarget);

  if (request.file && targetAbsolute) {
    await replaceFileAtTarget(request.file.path, targetAbsolute);
  } else if (request.file) {
    await safeUnlink(request.file.path);
  }

  const nextPublicPath = targetAbsolute ? toPublicPath(targetAbsolute) : existing.publicPath ?? '';
  const nextPath = targetAbsolute ? toPosix(path.relative(ROOT, targetAbsolute)) : existing.path ?? '';

  if (patch.replaceTarget && existing.publicPath && patch.replaceTarget !== existing.publicPath) {
    await replaceContentAssetReference(existing.publicPath, nextPublicPath);
  }

  const next = await upsertMediaRecord(id, {
    title: patch.title ?? existing.title,
    altText: patch.altText ?? existing.altText,
    category: patch.category ?? existing.category,
    notes: patch.notes ?? existing.notes,
    publicPath: patch.publicPath ?? nextPublicPath,
    previewUrl: patch.previewUrl ?? nextPublicPath,
    path: nextPath,
    filename: patch.filename ?? path.basename(targetAbsolute ?? existing.path ?? existing.publicPath ?? ''),
    kind: patch.kind ?? existing.kind,
    mimeType: patch.mimeType ?? existing.mimeType,
    storageProvider: patch.storageProvider ?? existing.storageProvider ?? 'local',
    storagePath: patch.storagePath ?? nextPath,
    sizeBytes: request.file?.size ?? existing.sizeBytes,
    uploaded: isUploadPath(targetAbsolute ?? existing.path ?? existing.publicPath ?? ''),
    protected: !isUploadPath(targetAbsolute ?? existing.path ?? existing.publicPath ?? ''),
    status: patch.status ?? existing.status ?? 'active'
  });

  return json(response, 200, {
    ok: true,
    item: next
  });
}

export async function deleteMedia(request, response) {
  const id = request.params.id;
  const existing = await findMediaById(id);

  if (!existing) {
    return notFound(response);
  }

  const targetPath = resolveAbsolutePath(existing.path || existing.publicPath || '');

  if (!isUploadPath(targetPath ?? '')) {
    return forbidden(response, 'Protected source assets cannot be deleted. Replace them instead.');
  }

  if (targetPath) {
    await safeUnlink(targetPath);
  }

  await removeUploadedMediaRecord(id);

  if (existing.publicPath) {
    await replaceContentAssetReference(existing.publicPath, '');
  }

  return json(response, 200, {
    ok: true
  });
}
