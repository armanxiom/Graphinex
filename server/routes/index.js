import { createAdminRouter } from './admin.js';
import { createMediaRouter } from './media.js';
import { createPublicRouter } from './public.js';
import { createResourcesRouter } from './resources.js';

export function registerRoutes(app, requireAccess) {
  app.use('/api/public', createPublicRouter());
  app.use('/api/admin', createAdminRouter(requireAccess));
  app.use('/api/media', createMediaRouter(requireAccess));
  app.use('/api', createResourcesRouter(requireAccess));
}
