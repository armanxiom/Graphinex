import { jsonResponse, forbidden, unauthorized } from '../_lib/http';
import { requireAdminSession, validateCsrf, isAllowed } from '../_lib/session';
import { getDatabase } from '../_lib/database';
import { publishDraftSnapshot } from '../_lib/content';
import { sha256 } from '../_lib/crypto';

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

  const snapshot = await publishDraftSnapshot(session.user.id);

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${session.user.id}, 'publish', 'published_content', ${'site_snapshot'}, 'Published site snapshot', ${JSON.stringify({ version: sha256(JSON.stringify(snapshot)) })}, now())
  `;

  return jsonResponse({
    ok: true,
    version: sha256(JSON.stringify(snapshot)),
    content: snapshot
  });
}

