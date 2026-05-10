import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cloneSiteContent, defaultSiteContent } from '../../src/lib/siteContent.ts';

const ROOT = process.cwd();
const LOCAL_STORAGE_DIR = path.join(ROOT, 'server', 'storage');
const IS_VERCEL_RUNTIME = Boolean(process.env.VERCEL);
const STORAGE_ROOT = process.env.GRAPHINEX_STORAGE_DIR || (IS_VERCEL_RUNTIME ? path.join(os.tmpdir(), 'graphinex-storage') : LOCAL_STORAGE_DIR);

export const STORAGE_DIR = STORAGE_ROOT;
export const CONTENT_FILE = path.join(STORAGE_DIR, 'content.json');
export const MEDIA_FILE = path.join(STORAGE_DIR, 'media.json');
export const ACTIVITY_FILE = path.join(STORAGE_DIR, 'activity.json');
export const UPLOAD_DIR = IS_VERCEL_RUNTIME ? path.join(STORAGE_DIR, 'uploads') : path.join(ROOT, 'public', 'assets', 'uploads');

let contentBundleMemory = null;
let mediaIndexMemory = null;
let activityLogMemory = null;

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');

    if (!raw.trim()) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, filePath);
}

async function seedJsonFile(targetPath, sourcePath, fallbackValue) {
  const exists = await fileExists(targetPath);

  if (exists) {
    return;
  }

  if (sourcePath && sourcePath !== targetPath) {
    const sourceExists = await fileExists(sourcePath);
    if (sourceExists) {
      try {
        await fs.copyFile(sourcePath, targetPath);
        return;
      } catch {
        // Fall back to writing the default payload below.
      }
    }
  }

  try {
    await writeJson(targetPath, fallbackValue);
  } catch {
    // Best effort only. Runtime storage may be read-only in some environments.
  }
}

export function createContentVersion(content) {
  return createHash('sha256').update(JSON.stringify(content)).digest('hex');
}

export async function ensureStorage() {
  try {
    await ensureDir(STORAGE_DIR);
  } catch {
    // Ignore read-only filesystem errors and continue with best-effort reads.
  }

  try {
    await ensureDir(UPLOAD_DIR);
  } catch {
    // Uploads may be backed by a runtime-only directory in production.
  }

  const contentFallback = {
    content: cloneSiteContent(defaultSiteContent),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(defaultSiteContent)
  };

  await seedJsonFile(CONTENT_FILE, path.join(LOCAL_STORAGE_DIR, 'content.json'), contentFallback);
  await seedJsonFile(MEDIA_FILE, path.join(LOCAL_STORAGE_DIR, 'media.json'), []);
  await seedJsonFile(ACTIVITY_FILE, path.join(LOCAL_STORAGE_DIR, 'activity.json'), []);
}

export async function readContentBundle() {
  await ensureStorage();
  const bundle = await readJson(CONTENT_FILE, {
    content: cloneSiteContent(defaultSiteContent),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(defaultSiteContent)
  });

  const fallbackBundle = contentBundleMemory ?? {
    content: cloneSiteContent(defaultSiteContent),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(defaultSiteContent)
  };
  const resolvedBundle = bundle?.content ? bundle : fallbackBundle;
  const content = resolvedBundle?.content ? cloneSiteContent(resolvedBundle.content) : cloneSiteContent(defaultSiteContent);

  return {
    content,
    updatedAt: typeof resolvedBundle?.updatedAt === 'string' ? resolvedBundle.updatedAt : null,
    version: typeof resolvedBundle?.version === 'string' ? resolvedBundle.version : createContentVersion(content)
  };
}

export async function writeContentBundle(content) {
  await ensureStorage();
  const bundle = {
    content: cloneSiteContent(content),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(content)
  };

  contentBundleMemory = bundle;

  try {
    await writeJson(CONTENT_FILE, bundle);
  } catch {
    // Fall back to the in-memory copy when the runtime filesystem is not writable.
  }

  return bundle;
}

export async function readMediaIndex() {
  await ensureStorage();
  const entries = await readJson(MEDIA_FILE, []);
  if (Array.isArray(entries) && entries.length > 0) {
    mediaIndexMemory = entries;
    return entries;
  }

  return Array.isArray(mediaIndexMemory) ? mediaIndexMemory : entries;
}

export async function writeMediaIndex(entries) {
  await ensureStorage();
  mediaIndexMemory = entries;

  try {
    await writeJson(MEDIA_FILE, entries);
  } catch {
    // Keep the in-memory index so the request can still succeed.
  }

  return entries;
}

export async function readActivityLog() {
  await ensureStorage();
  const entries = await readJson(ACTIVITY_FILE, []);
  if (Array.isArray(entries) && entries.length > 0) {
    activityLogMemory = entries;
    return entries;
  }

  return Array.isArray(activityLogMemory) ? activityLogMemory : entries;
}

export async function appendActivity(entry) {
  const logs = await readActivityLog();
  const next = [entry, ...logs].slice(0, 200);
  activityLogMemory = next;

  try {
    await writeJson(ACTIVITY_FILE, next);
  } catch {
    // In-memory activity history keeps the admin panel responsive on read-only runtimes.
  }

  return next;
}

export async function scanUploadFiles() {
  await ensureStorage();

  try {
    const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

export function getUploadPublicUrl(filename) {
  const safeName = encodeURIComponent(filename).replace(/%2F/g, '/');
  return IS_VERCEL_RUNTIME ? `/api/uploads/${safeName}` : `/assets/uploads/${safeName}`;
}

export async function safeUnlink(filePath) {
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function moveFile(source, destination) {
  await ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
  return destination;
}

export async function saveUploadedBuffer(targetPath, buffer) {
  await ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, buffer);
  return targetPath;
}

export async function readTextFile(filePath, fallback = '') {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return fallback;
  }
}
