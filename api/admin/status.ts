import { hasValidAdminAccess } from '../../server/functions/access.ts';
import { unauthorized, jsonResponse } from '../../server/functions/http.ts';
import { getAdminBootstrap } from '../../server/utils/content.js';

export async function GET(request: Request) {
  if (!hasValidAdminAccess(request)) {
    return unauthorized();
  }

  const bootstrap = await getAdminBootstrap();

  return jsonResponse({
    ok: true,
    version: bootstrap.version,
    updatedAt: bootstrap.updatedAt,
    counts: {
      sections: bootstrap.sections.length,
      media: bootstrap.media.length,
      activity: bootstrap.activity.length,
      fileRoots: bootstrap.fileRoots.length
    }
  });
}
