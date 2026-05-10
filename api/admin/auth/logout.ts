import { revokeSession, getCsrfCookieName, getSessionCookieName, requireAdminSession } from '../../_lib/session';
import { jsonResponse } from '../../_lib/http';

export async function POST(request: Request) {
  const session = await requireAdminSession(request);

  if (session) {
    const cookie = request.headers.get('cookie') ?? '';
    const match = cookie.match(new RegExp(`${getSessionCookieName()}=([^;]+)`));
    if (match?.[1]) {
      await revokeSession(decodeURIComponent(match[1]));
    }
  }

  const response = jsonResponse({ ok: true });
  response.headers.append('Set-Cookie', `${getSessionCookieName()}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`);
  response.headers.append('Set-Cookie', `${getCsrfCookieName()}=; Path=/; Max-Age=0; SameSite=Lax`);
  return response;
}
