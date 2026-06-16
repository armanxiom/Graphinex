import { z, type ZodTypeAny } from 'zod';

export function jsonResponse(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...(init.headers ?? {})
    }
  });
}

export function textResponse(body: string, status = 200, headers: HeadersInit = {}) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      ...headers
    }
  });
}

export async function readJson<TSchema extends ZodTypeAny>(
  request: Request,
  schema: TSchema
): Promise<z.infer<TSchema>>;
export async function readJson<T = unknown>(request: Request): Promise<T>;
export async function readJson<T>(request: Request, schema?: ZodTypeAny): Promise<T> {
  const payload = await request.json();

  if (schema) {
    return schema.parse(payload) as T;
  }

  return payload as T;
}

export function methodNotAllowed(allowed: string[]) {
  return jsonResponse({ error: 'Method not allowed', allowed }, { status: 405 });
}

export function badRequest(message: string, details?: unknown) {
  return jsonResponse({ error: message, details }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized') {
  return jsonResponse({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden') {
  return jsonResponse({ error: message }, { status: 403 });
}

export function notFound(message = 'Not found') {
  return jsonResponse({ error: message }, { status: 404 });
}
