import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureStorage } from './storage/content-store.js';
import { registerRoutes } from './routes/index.js';
import { requireAccess } from './middleware/access.js';
import { json, notFound } from './utils/http.js';

const ROOT = process.cwd();

export async function createApp() {
  await ensureStorage();

  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/assets', express.static(path.join(ROOT, 'public', 'assets')));
  app.use(express.static(path.join(ROOT, 'public')));

  app.get('/healthz', (request, response) => {
    response.json({ ok: true });
  });

  registerRoutes(app, requireAccess);

  app.use('/api', (request, response) => {
    return notFound(response);
  });

  app.use((error, request, response, next) => {
    console.error(error);
    return json(response, 500, {
      code: '500',
      message: 'A server error has occurred'
    });
  });

  return app;
}
