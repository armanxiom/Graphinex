import { sha256 } from '../_lib/crypto';
import { getDatabase } from '../_lib/database';
import { readDraftSnapshot, readPublishedSnapshot } from '../_lib/content';
import { jsonResponse } from '../_lib/http';
import { requireAdminSession } from '../_lib/session';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const previewRequested = url.searchParams.get('preview') === '1';
  const previewSession = previewRequested ? await requireAdminSession(request) : null;

  const content = previewRequested && previewSession ? await readDraftSnapshot() : await readPublishedSnapshot();
  const databaseReady = Boolean(getDatabase());
  const source = previewRequested && previewSession ? 'preview' : databaseReady ? 'database' : 'fallback';

  return jsonResponse({
    content,
    version: sha256(JSON.stringify(content)),
    updatedAt: new Date().toISOString(),
    source,
    preview: Boolean(previewRequested && previewSession)
  });
}

