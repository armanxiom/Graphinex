import { hasValidAdminAccess } from '../_lib/access';
import { unauthorized, jsonResponse } from '../_lib/http';
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
