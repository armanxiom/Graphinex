export const ADMIN_ROUTE = '/armanxion-core';
export const ADMIN_ACCESS_CODE = process.env.GRAPHINEX_ADMIN_ACCESS_CODE?.trim() || 'ARMANXION-GRX-9271';
export const ADMIN_ROUTE_HEADER = 'x-admin-access';

export function readAccessCode(request) {
  const url = new URL(request.originalUrl ?? request.url, 'http://127.0.0.1');
  const queryCode = url.searchParams.get('access') ?? '';
  const headerCode = request.get(ADMIN_ROUTE_HEADER) ?? '';

  return queryCode || headerCode;
}

export function hasValidAccess(request) {
  return readAccessCode(request) === ADMIN_ACCESS_CODE;
}

export function requireAccess(request, response, next) {
  if (hasValidAccess(request)) {
    return next();
  }

  return response.status(404).json({
    code: '404',
    message: 'The requested page could not be found.'
  });
}

export function directSession() {
  return {
    user: {
      id: 'direct-access',
      email: 'admin@graphinex.in',
      displayName: 'Graphinex Admin',
      avatarUrl: null,
      role: {
        slug: 'superadmin',
        name: 'Super Admin',
        permissions: { all: true }
      },
      status: 'active'
    },
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    csrfToken: 'direct-access'
  };
}
