import crypto from 'node:crypto';
import { hasValidAdminAccess } from '../server/functions/access';
import { badRequest, jsonResponse, unauthorized } from '../server/functions/http';
import { appendMediaActivity, getMediaBootstrap, storeUploadFile, upsertMediaRecord } from '../server/functions/media';
import { getUploadPublicUrl } from '../server/storage/content-store.js';

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

export async function GET(request: Request) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const { media, sections } = await getMediaBootstrap();
  return jsonResponse({
    items: media,
    sections
  });
}

export async function POST(request: Request) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const form = await request.formData();
  const fileEntry = form.get('file');

  if (!(fileEntry instanceof File)) {
    return badRequest('No file uploaded.');
  }

  const title = String(form.get('title') ?? fileEntry.name ?? 'Upload');
  const altText = String(form.get('altText') ?? title);
  const kind = form.get('kind');
  const category = String(form.get('collectionKey') ?? form.get('category') ?? 'Uploads');
  const notes = String(form.get('notes') ?? '');

  const stored = await storeUploadFile(fileEntry, fileEntry.name || title);
  const item = await upsertMediaRecord(crypto.randomUUID(), {
    title,
    altText,
    category,
    notes,
    publicPath: getUploadPublicUrl(stored.filename),
    previewUrl: getUploadPublicUrl(stored.filename),
    path: stored.targetPath,
    filename: stored.filename,
    kind: resolveMediaKind(kind, stored.mimeType),
    mimeType: stored.mimeType,
    storageProvider: 'local',
    storagePath: stored.targetPath,
    sizeBytes: stored.sizeBytes,
    uploaded: true,
    protected: false,
    status: 'active'
  });

  await appendMediaActivity('media_upload', `Uploaded ${item.title ?? title}`, item);

  return jsonResponse({
    ok: true,
    item
  });
}
