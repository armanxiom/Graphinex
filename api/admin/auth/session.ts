import { jsonResponse, unauthorized } from '../../_lib/http';
import { getCsrfTokenFromRequest, requireAdminSession } from '../../_lib/session';

export async function GET(request: Request) {
  const session = await requireAdminSession(request);

  if (!session) {
    return unauthorized();
  }

  return jsonResponse({
    user: {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      avatarUrl: session.user.avatarUrl,
      role: session.user.role
    },
    csrfToken: getCsrfTokenFromRequest(request),
    expiresAt: session.expiresAt
  });
}
