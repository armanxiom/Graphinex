import crypto from 'node:crypto';
import path from 'node:path';
import multer from 'multer';
import { Router } from 'express';
import { deleteMedia, getMedia, updateMedia, uploadMedia } from '../controllers/media.js';
import { UPLOAD_DIR } from '../storage/content-store.js';

const storage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, UPLOAD_DIR);
  },
  filename(request, file, callback) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const name = file.originalname ? path.basename(file.originalname, ext) : 'upload';
    const safeName = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    callback(null, `${safeName || 'upload'}-${crypto.randomUUID().slice(0, 8)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 250
  }
});

export function createMediaRouter(requireAccess) {
  const router = Router();

  router.get('/', requireAccess, getMedia);
  router.post('/', requireAccess, upload.single('file'), uploadMedia);
  router.put('/:id', requireAccess, upload.single('file'), updateMedia);
  router.delete('/:id', requireAccess, deleteMedia);

  router.post('/upload', requireAccess, upload.single('file'), uploadMedia);
  router.delete('/upload/:id', requireAccess, deleteMedia);

  return router;
}
