export function json(res, status, payload) {
  return res.status(status).set('cache-control', 'no-store').json(payload);
}

export function ok(res, payload = {}) {
  return json(res, 200, payload);
}

export function badRequest(res, message, details) {
  return json(res, 400, {
    code: '400',
    message,
    details
  });
}

export function unauthorized(res, message = 'Unauthorized') {
  return json(res, 401, {
    code: '401',
    message
  });
}

export function forbidden(res, message = 'Forbidden') {
  return json(res, 403, {
    code: '403',
    message
  });
}

export function notFound(res, message = 'The requested page could not be found.') {
  return json(res, 404, {
    code: '404',
    message
  });
}

export function parseJsonBody(body) {
  if (!body || typeof body !== 'object') {
    return {};
  }

  return body;
}

export function asBoolean(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

export function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}
