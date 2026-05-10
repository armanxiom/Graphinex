import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOAD_DIR } from '../../server/storage/content-store.js';
import { notFound } from '../../server/functions/http';

function contentTypeFor(filename: string) {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.avif':
      return 'image/avif';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.mp4':
      return 'video/mp4';
    case '.webm':
      return 'video/webm';
    case '.mov':
      return 'video/quicktime';
    case '.m4v':
      return 'video/x-m4v';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(request: Request, context: { params: { filename: string } }) {
  const filename = path.basename(context.params.filename || '');

  if (!filename) {
    return notFound();
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    const data = await fs.readFile(filePath);

    return new Response(data, {
      status: 200,
      headers: {
        'content-type': contentTypeFor(filename),
        'cache-control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return notFound();
  }
}
