import { next } from '@vercel/functions';
import { jwtVerify } from 'jose';
import { ADMIN_ROUTE, getAdminAccessCode, hasValidAdminAccess } from './server/functions/access.ts';
const ADMIN_COOKIE = 'graphinex_admin_session';
const ACCESS_QUERY_KEY = 'access';

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

async function hasValidSession(request: Request) {
  const sessionSecret = process.env.GRAPHINEX_ADMIN_SESSION_SECRET;

  if (!sessionSecret) {
    return false;
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const sessionToken = cookies.get(ADMIN_COOKIE);

  if (!sessionToken) {
    return false;
  }

  try {
    await jwtVerify(sessionToken, new TextEncoder().encode(sessionSecret));
    return true;
  } catch {
    return false;
  }
}

function notFoundResponse() {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>404</title><style>html,body{margin:0;min-height:100%;display:grid;place-items:center;background:#0b0b0b;color:#fff;font-family:Arial,sans-serif}main{max-width:28rem;padding:2rem;text-align:center}h1{font-size:clamp(2rem,8vw,4rem);margin:0 0 .5rem}p{opacity:.72;line-height:1.6}</style></head><body><main><h1>404</h1><p>The requested page could not be found.</p></main></body></html>`,
    {
      status: 404,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    }
  );
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith('/api/admin')) {
    if (await hasValidSession(request) || hasValidAdminAccess(request)) {
      return next();
    }

    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  const isHiddenRoute = pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`);

  if (!isHiddenRoute) {
    return next();
  }

  const accessCode = url.searchParams.get(ACCESS_QUERY_KEY);
  const expectedAccessCode = getAdminAccessCode();

  if (!accessCode) {
    return Response.redirect(new URL('/', url), 302);
  }

  if (!expectedAccessCode || accessCode !== expectedAccessCode) {
    return notFoundResponse();
  }

  return next();
}

export const config = {
  runtime: 'edge'
};
