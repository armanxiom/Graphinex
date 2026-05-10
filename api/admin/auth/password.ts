import { hash, compare } from 'bcryptjs';
import { getDatabase } from '../../_lib/database';
import { badRequest, forbidden, jsonResponse, unauthorized, readJson } from '../../_lib/http';
import { passwordChangeSchema } from '../../_lib/schemas';
import { isAllowed, requireAdminSession, validateCsrf } from '../../_lib/session';

export async function POST(request: Request) {
  const database = getDatabase();

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  if (!validateCsrf(request, session)) {
    return forbidden('Invalid CSRF token');
  }

  if (!isAllowed(session, 'manage_account')) {
    return forbidden();
  }

  const body = await readJson(request, passwordChangeSchema);

  const rows = await database`
    select password_hash
    from admin_users
    where id = ${session.user.id}
    limit 1
  `;

  const user = (rows as any[])[0];

  if (!user) {
    return badRequest('Admin account not found');
  }

  const validCurrent = await compare(body.currentPassword, user.password_hash);

  if (!validCurrent) {
    return unauthorized('Current password is incorrect');
  }

  const nextHash = await hash(body.newPassword, 12);

  await database`
    update admin_users
    set password_hash = ${nextHash}, updated_at = now()
    where id = ${session.user.id}
  `;

  await database`
    update admin_sessions
    set revoked_at = case when id = ${session.sessionId} then revoked_at else now() end,
        updated_at = now()
    where admin_user_id = ${session.user.id}
  `;

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${session.user.id}, 'password_change', 'admin_users', ${session.user.id}, 'Admin password changed', ${JSON.stringify({ email: session.user.email })}, now())
  `;

  return jsonResponse({ ok: true });
}
