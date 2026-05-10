import { compare } from 'bcryptjs';
import { sha256 } from '../../_lib/crypto';
import { getDatabase } from '../../_lib/database';
import { jsonResponse, methodNotAllowed, readJson, unauthorized } from '../../_lib/http';
import { loginSchema } from '../../_lib/schemas';
import { createAdminSession, getClientCookieOptions, getCookieOptions, getCsrfCookieName, getSessionCookieName } from '../../_lib/session';
import { ADMIN_LOGIN_EMAIL, ADMIN_LOGIN_PASSWORD } from '../../_lib/access';

const WINDOW_MINUTES = 15;
const WINDOW_LIMIT = 5;

export async function POST(request: Request) {
  const database = getDatabase();

  const body = await readJson(request, loginSchema);
  const identifierHash = sha256(body.email);
  const directLogin = body.email.toLowerCase() === ADMIN_LOGIN_EMAIL && body.password === ADMIN_LOGIN_PASSWORD;

  if (directLogin && !database) {
    return jsonResponse({
      user: {
        id: 'direct-access',
        email: ADMIN_LOGIN_EMAIL,
        displayName: 'Graphinex Admin',
        avatarUrl: null,
        role: {
          slug: 'superadmin',
          name: 'Super Admin',
          permissions: { all: true }
        }
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      directAccess: true
    });
  }

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const recentAttempts = await database`
    select count(*)::int as total
    from auth_attempts
    where scope = 'login'
      and identifier_hash = ${identifierHash}
      and success = false
      and created_at > now() - interval '15 minutes'
  `;

  if ((recentAttempts as any[])[0]?.total >= WINDOW_LIMIT) {
    return jsonResponse({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
  }

  const users = await database`
    select
      u.id,
      u.email,
      u.password_hash,
      u.display_name,
      u.avatar_url,
      u.status,
      r.slug as role_slug,
      r.name as role_name,
      r.permissions
    from admin_users u
    inner join roles r on r.id = u.role_id
    where lower(u.email) = lower(${body.email})
    limit 1
  `;

  const user = (users as any[])[0];

  if (directLogin && !user) {
    return jsonResponse({
      user: {
        id: 'direct-access',
        email: ADMIN_LOGIN_EMAIL,
        displayName: 'Graphinex Admin',
        avatarUrl: null,
        role: {
          slug: 'superadmin',
          name: 'Super Admin',
          permissions: { all: true }
        }
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      directAccess: true
    });
  }

  if (!user || user.status !== 'active') {
    await database`
      insert into auth_attempts (scope, identifier_hash, success, created_at)
      values ('login', ${identifierHash}, false, now())
    `;
    return unauthorized('Invalid credentials');
  }

  const passwordValid = await compare(body.password, user.password_hash);

  if (!passwordValid && !directLogin) {
    await database`
      insert into auth_attempts (scope, identifier_hash, success, created_at)
      values ('login', ${identifierHash}, false, now())
    `;
    return unauthorized('Invalid credentials');
  }

  const sessionUser = {
    id: user.id as string,
    email: user.email as string,
    displayName: user.display_name as string,
    avatarUrl: (user.avatar_url as string | null) ?? null,
    status: user.status as string,
    role: {
      slug: user.role_slug as string,
      name: user.role_name as string,
      permissions: (user.permissions as Record<string, boolean>) ?? {}
    }
  };

  const session = directLogin
    ? {
        token: '',
        csrfToken: '',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
      }
    : await createAdminSession(sessionUser, request);

  await database`
    insert into auth_attempts (scope, identifier_hash, success, created_at)
    values ('login', ${identifierHash}, true, now())
  `;

  const response = jsonResponse({
    user: {
      id: sessionUser.id,
      email: sessionUser.email,
      displayName: sessionUser.displayName,
      avatarUrl: sessionUser.avatarUrl,
      role: sessionUser.role
    },
    expiresAt: session.expiresAt
  });

  if (!directLogin) {
    response.headers.append(
      'Set-Cookie',
      `${getSessionCookieName()}=${encodeURIComponent(session.token)}; ${getCookieOptions(60 * 60 * 24 * 30)}`
    );
    response.headers.append(
      'Set-Cookie',
      `${getCsrfCookieName()}=${encodeURIComponent(session.csrfToken)}; ${getClientCookieOptions(60 * 60 * 24 * 30)}`
    );
  }

  return response;
}

export async function GET() {
  return methodNotAllowed(['POST']);
}
