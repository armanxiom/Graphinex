import { hasValidAdminAccess } from '../../server/functions/access';
import { forbidden, jsonResponse, notFound, unauthorized } from '../../server/functions/http';
import {
  appendMediaActivity,
  deleteMediaRecord,
  findMediaById,
  removeUploadedFile,
  rewireContentPath,
  storeUploadFile,
  upsertMediaRecord
} from '../../server/functions/media';
import { getUploadPublicUrl } from '../../server/storage/content-store.js';

function resolveMediaKind(value: unknown, mimeType: string) {
  if (value === 'video' || mimeType.startsWith('video/')) {
    return 'video';
  }

  if (value === 'document') {
    return 'document';
  }

  if (value === 'logo') {
    return 'logo';
  }

  return 'image';
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const existing = await findMediaById(context.params.id);
  if (!existing) {
    return notFound();
  }

  const form = await request.formData();
  const fileEntry = form.get('file');
  const title = String(form.get('title') ?? existing.title ?? existing.name ?? 'Media');
  const altText = String(form.get('altText') ?? title);
  const category = String(form.get('category') ?? existing.category ?? 'Uploads');
  const notes = String(form.get('notes') ?? existing.notes ?? '');
  const replaceTarget = String(form.get('replaceTarget') ?? form.get('publicPath') ?? existing.publicPath ?? '');
  const kind = form.get('kind');

  let nextPublicPath = String(existing.publicPath ?? '');
  let nextPath = String(existing.path ?? '');
  let nextFilename = String(existing.filename ?? '');
  let nextMimeType = String(existing.mimeType ?? 'application/octet-stream');
  let nextSizeBytes = Number(existing.sizeBytes ?? 0);

  if (fileEntry instanceof File) {
    const stored = await storeUploadFile(fileEntry, fileEntry.name || title);
    nextPublicPath = getUploadPublicUrl(stored.filename);
    nextPath = stored.targetPath;
    nextFilename = stored.filename;
    nextMimeType = stored.mimeType;
    nextSizeBytes = stored.sizeBytes;
  }

  if (replaceTarget && existing.publicPath && replaceTarget !== existing.publicPath) {
    await rewireContentPath(existing.publicPath, nextPublicPath);
  }

  const item = await upsertMediaRecord(context.params.id, {
    title,
    altText,
    category,
    notes,
    publicPath: nextPublicPath,
    previewUrl: nextPublicPath,
    path: nextPath,
    filename: nextFilename,
    kind: resolveMediaKind(kind, nextMimeType),
    mimeType: nextMimeType,
    storageProvider: 'local',
    storagePath: nextPath,
    sizeBytes: nextSizeBytes,
    uploaded: nextPublicPath.startsWith('/api/uploads/'),
    protected: !nextPublicPath.startsWith('/api/uploads/'),
    status: 'active'
  });

  await appendMediaActivity('media_replace', `Updated ${item.title ?? title}`, item);

  return jsonResponse({
    ok: true,
    item
  });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const existing = await findMediaById(context.params.id);
  if (!existing) {
    return notFound();
  }

  if (!existing.uploaded) {
    return forbidden('Protected source assets cannot be deleted. Replace them instead.');
  }

  await removeUploadedFile(existing.path ?? null);
  await deleteMediaRecord(context.params.id);

  if (existing.publicPath) {
    await rewireContentPath(existing.publicPath, '');
  }

  await appendMediaActivity('media_delete', `Removed ${existing.title ?? existing.name ?? context.params.id}`, existing);

  return jsonResponse({
    ok: true
  });
}
