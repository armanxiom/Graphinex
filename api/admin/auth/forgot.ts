import { randomToken, sha256 } from '../../_lib/crypto';
import { getDatabase } from '../../_lib/database';
import { getAdminAccessCode } from '../../_lib/access';
import { badRequest, jsonResponse, readJson } from '../../_lib/http';
import { hasSmtpConfig, sendPasswordResetEmail } from '../../_lib/mail';
import { resetRequestSchema } from '../../_lib/schemas';

const RESET_WINDOW_MS = 1000 * 60 * 60;

export async function POST(request: Request) {
  const database = getDatabase();

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await readJson(request, resetRequestSchema);

  const users = await database`
    select id, email, status
    from admin_users
    where lower(email) = lower(${body.email})
      and status = 'active'
    limit 1
  `;

  const user = (users as any[])[0];

  if (!user) {
    return jsonResponse({ ok: true });
  }

  const token = randomToken(32);
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + RESET_WINDOW_MS);
  const baseUrl = process.env.APP_URL || `https://${process.env.VERCEL_URL || 'localhost:3000'}`;
  const resetUrl = new URL('/armanxion-core/reset', baseUrl);

  resetUrl.searchParams.set('access', getAdminAccessCode());

  resetUrl.searchParams.set('token', token);

  await database`
    insert into password_resets (admin_user_id, token_hash, expires_at, created_at, updated_at)
    values (${user.id}, ${tokenHash}, ${expiresAt.toISOString()}, now(), now())
  `;

  try {
    if (hasSmtpConfig()) {
      await sendPasswordResetEmail(user.email, resetUrl.toString());
    } else if (process.env.NODE_ENV !== 'production') {
      return jsonResponse({ ok: true, resetUrl: resetUrl.toString() });
    }
  } catch (error) {
    return badRequest('Unable to send reset email', error instanceof Error ? error.message : String(error));
  }

  return jsonResponse({ ok: true });
}
