import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { appendActivity, readMediaIndex, safeUnlink, writeMediaIndex, UPLOAD_DIR } from '../../server/storage/content-store.js';
import { loadMediaLibrary, loadSiteContent, replaceContentAssetReference } from '../../server/utils/content.js';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createStoredFilename(originalName: string) {
  const ext = path.extname(originalName || '').toLowerCase();
  const baseName = path.basename(originalName || 'upload', ext);
  const safeBase = slugify(baseName);
  return `${safeBase || 'upload'}-${crypto.randomUUID().slice(0, 8)}${ext}`;
}

export async function storeUploadFile(file: File, originalName: string) {
  const filename = createStoredFilename(originalName || file.name || 'upload');
  const targetPath = path.join(UPLOAD_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return {
    filename,
    targetPath,
    sizeBytes: buffer.byteLength,
    mimeType: file.type || 'application/octet-stream'
  };
}

export async function getMediaBootstrap() {
  const { content } = await loadSiteContent();
  const { media, sections } = await loadMediaLibrary(content);

  return { media, sections };
}

export async function findMediaById(id: string) {
  const { media } = await getMediaBootstrap();
  return media.find((entry) => entry.id === id) ?? null;
}

export async function upsertMediaRecord(
  id: string,
  patch: Record<string, unknown> & {
    title?: string;
    altText?: string;
    category?: string;
    notes?: string;
    publicPath?: string;
    previewUrl?: string;
    path?: string;
    filename?: string;
    kind?: string;
    mimeType?: string;
    storageProvider?: string;
    storagePath?: string;
    sizeBytes?: number;
    uploaded?: boolean;
    protected?: boolean;
    status?: string;
  }
) {
  const records = await readMediaIndex();
  const index = records.findIndex((entry: any) => entry.id === id);
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

export async function appendMediaActivity(action: string, summary: string, metadata?: unknown) {
  await appendActivity({
    id: crypto.randomUUID(),
    action,
    summary,
    createdAt: new Date().toISOString(),
    metadata
  });
}

export async function deleteMediaRecord(id: string) {
  const records = await readMediaIndex();
  const index = records.findIndex((entry: any) => entry.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = records.splice(index, 1);
  await writeMediaIndex(records);
  return removed;
}

export async function removeUploadedFile(filePath: string | null | undefined) {
  if (!filePath) {
    return false;
  }

  return safeUnlink(filePath);
}

export async function rewireContentPath(fromUrl: string, toUrl: string) {
  return replaceContentAssetReference(fromUrl, toUrl);
}
