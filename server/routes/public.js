import { Router } from 'express';
import { getPublicContent } from '../controllers/public.js';

export function createPublicRouter() {
  const router = Router();

  router.get('/content', getPublicContent);

  return router;
}
