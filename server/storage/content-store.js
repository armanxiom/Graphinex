import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cloneSiteContent, defaultSiteContent } from '../../src/lib/siteContent.ts';

const ROOT = process.cwd();
export const STORAGE_DIR = path.join(ROOT, 'server', 'storage');
export const CONTENT_FILE = path.join(STORAGE_DIR, 'content.json');
export const MEDIA_FILE = path.join(STORAGE_DIR, 'media.json');
export const ACTIVITY_FILE = path.join(STORAGE_DIR, 'activity.json');
export const UPLOAD_DIR = path.join(ROOT, 'public', 'assets', 'uploads');

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

export function createContentVersion(content) {
  return createHash('sha256').update(JSON.stringify(content)).digest('hex');
}

export async function ensureStorage() {
  await ensureDir(STORAGE_DIR);
  await ensureDir(UPLOAD_DIR);

  const contentExists = await fs
    .access(CONTENT_FILE)
    .then(() => true)
    .catch(() => false);

  if (!contentExists) {
    await writeJson(CONTENT_FILE, {
      content: cloneSiteContent(defaultSiteContent),
      updatedAt: new Date().toISOString(),
      version: createContentVersion(defaultSiteContent)
    });
  }

  const mediaExists = await fs
    .access(MEDIA_FILE)
    .then(() => true)
    .catch(() => false);

  if (!mediaExists) {
    await writeJson(MEDIA_FILE, []);
  }

  const activityExists = await fs
    .access(ACTIVITY_FILE)
    .then(() => true)
    .catch(() => false);

  if (!activityExists) {
    await writeJson(ACTIVITY_FILE, []);
  }
}

export async function readContentBundle() {
  await ensureStorage();
  const bundle = await readJson(CONTENT_FILE, {
    content: cloneSiteContent(defaultSiteContent),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(defaultSiteContent)
  });

  const content = bundle?.content ? cloneSiteContent(bundle.content) : cloneSiteContent(defaultSiteContent);

  return {
    content,
    updatedAt: typeof bundle?.updatedAt === 'string' ? bundle.updatedAt : null,
    version: typeof bundle?.version === 'string' ? bundle.version : createContentVersion(content)
  };
}

export async function writeContentBundle(content) {
  await ensureStorage();
  const bundle = {
    content: cloneSiteContent(content),
    updatedAt: new Date().toISOString(),
    version: createContentVersion(content)
  };

  await writeJson(CONTENT_FILE, bundle);
  return bundle;
}

export async function readMediaIndex() {
  await ensureStorage();
  return readJson(MEDIA_FILE, []);
}

export async function writeMediaIndex(entries) {
  await ensureStorage();
  await writeJson(MEDIA_FILE, entries);
  return entries;
}

export async function readActivityLog() {
  await ensureStorage();
  return readJson(ACTIVITY_FILE, []);
}

export async function appendActivity(entry) {
  const logs = await readActivityLog();
  const next = [entry, ...logs].slice(0, 200);
  await writeJson(ACTIVITY_FILE, next);
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
  return `/assets/uploads/${encodeURIComponent(filename).replace(/%2F/g, '/')}`;
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
