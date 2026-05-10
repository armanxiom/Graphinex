import { hash } from 'bcryptjs';
import { sha256 } from '../../_lib/crypto';
import { getDatabase } from '../../_lib/database';
import { badRequest, jsonResponse, readJson, unauthorized } from '../../_lib/http';
import { resetConfirmSchema } from '../../_lib/schemas';

export async function POST(request: Request) {
  const database = getDatabase();

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await readJson(request, resetConfirmSchema);
  const tokenHash = sha256(body.token);

  const rows = await database`
    select id, admin_user_id, expires_at, used_at
    from password_resets
    where token_hash = ${tokenHash}
    limit 1
  `;

  const reset = (rows as any[])[0];

  if (!reset || reset.used_at || new Date(reset.expires_at).getTime() < Date.now()) {
    return unauthorized('Reset token is invalid or expired');
  }

  const nextHash = await hash(body.newPassword, 12);

  await database`
    update admin_users
    set password_hash = ${nextHash}, updated_at = now()
    where id = ${reset.admin_user_id}
  `;

  await database`
    update admin_sessions
    set revoked_at = now(), updated_at = now()
    where admin_user_id = ${reset.admin_user_id}
  `;

  await database`
    update password_resets
    set used_at = now(), updated_at = now()
    where id = ${reset.id}
  `;

  await database`
    insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
    values (${reset.admin_user_id}, 'password_reset', 'admin_users', ${reset.admin_user_id}, 'Admin password reset completed', ${JSON.stringify({ resetId: reset.id })}, now())
  `;

  return jsonResponse({ ok: true });
}
