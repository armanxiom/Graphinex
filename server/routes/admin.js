import { Router } from 'express';
import {
  getAdminActivity,
  getAdminContent,
  getAdminStatus,
  publishAdminContent,
  saveAdminContent
} from '../controllers/admin.js';

export function createAdminRouter(requireAccess) {
  const router = Router();

  router.get('/status', requireAccess, getAdminStatus);
  router.get('/content', requireAccess, getAdminContent);
  router.get('/activity', requireAccess, getAdminActivity);
  router.put('/content', requireAccess, saveAdminContent);
  router.post('/publish', requireAccess, publishAdminContent);

  return router;
}
