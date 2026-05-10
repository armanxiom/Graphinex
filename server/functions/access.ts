export const ADMIN_ROUTE = '/armanxion-core';
export const ADMIN_ACCESS_CODE = 'ARMANXION-GRX-9271';
export const ADMIN_LOGIN_EMAIL = 'admin@graphinex.in';
export const ADMIN_LOGIN_PASSWORD = ADMIN_ACCESS_CODE;

export function getAdminAccessCode() {
  return process.env.GRAPHINEX_ADMIN_ACCESS_CODE?.trim() || ADMIN_ACCESS_CODE;
}

export function hasValidAdminAccess(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get('access') === getAdminAccessCode();
}
