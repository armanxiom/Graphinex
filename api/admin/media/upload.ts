import { head } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { badRequest, jsonResponse, forbidden, unauthorized } from '../../_lib/http';
import { getDatabase } from '../../_lib/database';
import { getCsrfTokenFromRequest, isAllowed, requireAdminSession, validateCsrf } from '../../_lib/session';
import { mediaUploadMetaSchema } from '../../_lib/schemas';

export async function POST(request: Request) {
  const database = getDatabase();
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  if (!validateCsrf(request, session)) {
    return forbidden('Invalid CSRF token');
  }

  if (!isAllowed(session, 'manage_media')) {
    return forbidden();
  }

  if (!database) {
    return jsonResponse({ error: 'Database not configured' }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;
  const clientPayload =
    body.type === 'blob.generate-client-token' ? body.payload.clientPayload : null;
  let parsedMeta = null as ReturnType<typeof mediaUploadMetaSchema.safeParse> | null;

  if (clientPayload) {
    try {
      parsedMeta = mediaUploadMetaSchema.safeParse(JSON.parse(clientPayload));
    } catch {
      return badRequest('Invalid media metadata');
    }
  }

  if (clientPayload && !parsedMeta?.success) {
    return badRequest('Invalid media metadata');
  }

  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (pathname) => ({
      allowedContentTypes: pathname.endsWith('.mp4') || pathname.endsWith('.webm') ? ['video/*'] : ['image/*', 'video/*', 'application/pdf'],
      maximumSizeInBytes: pathname.endsWith('.mp4') || pathname.endsWith('.webm') ? 1024 * 1024 * 250 : 1024 * 1024 * 60,
      addRandomSuffix: true,
      allowOverwrite: false,
      tokenPayload: JSON.stringify({
        adminUserId: session.user.id,
        csrfToken: getCsrfTokenFromRequest(request),
        meta: parsedMeta?.success ? parsedMeta.data : null
      })
    }),
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      const payload = tokenPayload ? (JSON.parse(tokenPayload) as { adminUserId?: string; meta?: Record<string, unknown> | null }) : null;
      const meta = payload?.meta ?? {};
      let sizeBytes = 0;

      try {
        sizeBytes = (await head(blob.url)).size;
      } catch {
        sizeBytes = 0;
      }

      await database`
        insert into media_assets (
          filename,
          kind,
          mime_type,
          storage_provider,
          storage_path,
          public_url,
          preview_url,
          alt_text,
          size_bytes,
          payload,
          status,
          uploaded_by,
          created_at,
          updated_at
        )
        values (
          ${blob.pathname.split('/').pop() || blob.pathname},
          ${String(meta.kind ?? (blob.contentType?.startsWith('video/') ? 'video' : 'image'))},
          ${blob.contentType || 'application/octet-stream'},
          'vercel-blob',
          ${blob.pathname},
          ${blob.url},
          ${blob.url},
          ${typeof meta.altText === 'string' ? meta.altText : null},
          ${sizeBytes},
          ${JSON.stringify({ ...meta, blob })},
          'active',
          ${session.user.id},
          now(),
          now()
        )
      `;

      await database`
        insert into activity_logs (actor_admin_user_id, action, entity_type, entity_id, summary, metadata, created_at)
        values (${session.user.id}, 'media_upload', 'media_assets', ${blob.pathname}, 'Uploaded media asset', ${JSON.stringify({ url: blob.url, pathname: blob.pathname, kind: meta.kind ?? null })}, now())
      `;
    }
  });

  return jsonResponse(result);
}
