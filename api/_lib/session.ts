import { SignJWT, jwtVerify } from 'jose';
import { getDatabase } from './database';
import { randomToken, sha256, safeCompare } from './crypto';

const SESSION_COOKIE = 'graphinex_admin_session';
const CSRF_COOKIE = 'graphinex_admin_csrf';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

export interface SessionRole {
  slug: string;
  name: string;
  permissions: Record<string, boolean>;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: SessionRole;
  status: string;
}

export interface VerifiedSession {
  user: SessionUser;
  sessionId: string;
  csrfToken: string;
  expiresAt: string;
}

function getSessionSecret() {
  const secret = process.env.GRAPHINEX_ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error('GRAPHINEX_ADMIN_SESSION_SECRET is required.');
  }

  return secret;
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();

  if (!header) {
    return cookies;
  }

  header.split(';').forEach((pair) => {
    const index = pair.indexOf('=');

    if (index === -1) {
      return;
    }

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();

    cookies.set(key, decodeURIComponent(value));
  });

  return cookies;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getCsrfCookieName() {
  return CSRF_COOKIE;
}

export function getCookieOptions(maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === 'production';

  return [
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `SameSite=Lax`,
    secure ? 'Secure' : '',
    'HttpOnly'
  ]
    .filter(Boolean)
    .join('; ');
}

export function getClientCookieOptions(maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === 'production';

  return [
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `SameSite=Lax`,
    secure ? 'Secure' : ''
  ]
    .filter(Boolean)
    .join('; ');
}

export async function createAdminSession(user: SessionUser, request?: Request) {
  const database = getDatabase();

  if (!database) {
    throw new Error('DATABASE_URL is required.');
  }

  const secret = getSessionSecret();
  const sessionId = crypto.randomUUID();
  const csrfToken = randomToken(24);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  const jwt = await new SignJWT({
    sid: sessionId,
    uid: user.id,
    role: user.role.slug
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(`${Math.floor(SESSION_DURATION_MS / 1000)}s`)
    .sign(new TextEncoder().encode(secret));

  const sessionHash = sha256(jwt);
  const csrfHash = sha256(csrfToken);
  const userAgent = request?.headers.get('user-agent') ?? null;
  const ipAddress = request?.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

  await database`
    insert into admin_sessions (
      id,
      admin_user_id,
      session_hash,
      csrf_token_hash,
      user_agent,
      ip_address,
      expires_at,
      last_seen_at,
      created_at,
      updated_at
    )
    values (${sessionId}, ${user.id}, ${sessionHash}, ${csrfHash}, ${userAgent}, ${ipAddress}, ${expiresAt.toISOString()}, now(), now(), now())
  `;

  await database`
    update admin_users
    set last_login_at = now(), updated_at = now()
    where id = ${user.id}
  `;

  return {
    token: jwt,
    csrfToken,
    expiresAt: expiresAt.toISOString()
  };
}

export async function revokeSession(token: string) {
  const database = getDatabase();

  if (!database) {
    return;
  }

  const hash = sha256(token);
  await database`
    update admin_sessions
    set revoked_at = now(), updated_at = now()
    where session_hash = ${hash} and revoked_at is null
  `;
}

export async function verifyAdminSession(request: Request): Promise<VerifiedSession | null> {
  const database = getDatabase();

  if (!database) {
    return null;
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies.get(SESSION_COOKIE);

  if (!token) {
    return null;
  }

  let payload: { sid?: string; uid?: string; role?: string } | null = null;

  try {
    const secret = getSessionSecret();
    const verified = await jwtVerify(token, new TextEncoder().encode(secret));
    payload = verified.payload as typeof payload;
  } catch {
    return null;
  }

  if (!payload?.sid || !payload.uid) {
    return null;
  }

  const sessionHash = sha256(token);

  const rows = (await database`
    select
      s.id as session_id,
      s.csrf_token_hash,
      s.expires_at,
      s.revoked_at,
      u.id as admin_user_id,
      u.email,
      u.display_name,
      u.avatar_url,
      u.status,
      r.slug as role_slug,
      r.name as role_name,
      r.permissions
    from admin_sessions s
    inner join admin_users u on u.id = s.admin_user_id
    inner join roles r on r.id = u.role_id
    where s.session_hash = ${sessionHash}
      and s.revoked_at is null
      and s.expires_at > now()
      and u.status = 'active'
    limit 1
  `) as Array<{
    session_id: string;
    csrf_token_hash: string;
    expires_at: string;
    revoked_at: string | null;
    admin_user_id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    status: string;
    role_slug: string;
    role_name: string;
    permissions: Record<string, boolean>;
  }>;

  const session = rows[0];

  if (!session) {
    return null;
  }

  if (!safeCompare(sessionHash, sha256(token))) {
    return null;
  }

  await database`
    update admin_sessions
    set last_seen_at = now(), updated_at = now()
    where id = ${session.session_id}
  `;

  return {
    sessionId: session.session_id,
    csrfToken: session.csrf_token_hash,
    expiresAt: session.expires_at,
    user: {
      id: session.admin_user_id,
      email: session.email,
      displayName: session.display_name,
      avatarUrl: session.avatar_url,
      status: session.status,
      role: {
        slug: session.role_slug,
        name: session.role_name,
        permissions: session.permissions ?? {}
      }
    }
  };
}

export async function requireAdminSession(request: Request) {
  const session = await verifyAdminSession(request);

  if (!session) {
    return null;
  }

  return session;
}

export function getCsrfTokenFromRequest(request: Request) {
  const cookies = parseCookies(request.headers.get('cookie'));
  return cookies.get(CSRF_COOKIE) ?? null;
}

export function validateCsrf(request: Request, session: VerifiedSession) {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = getCsrfTokenFromRequest(request);

  if (!headerToken || !cookieToken) {
    return false;
  }

  const cookieHash = sha256(cookieToken);

  return safeCompare(headerToken, cookieToken) && safeCompare(cookieHash, session.csrfToken);
}

export function isAllowed(session: VerifiedSession, permission: string) {
  const permissions = session.user.role.permissions || {};
  return Boolean(permissions.all || permissions[permission] || session.user.role.slug === 'superadmin');
}
