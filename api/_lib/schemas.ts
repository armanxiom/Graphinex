import { z } from 'zod';

export const emailSchema = z.string().trim().email().toLowerCase();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(256)
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8).max(256),
  newPassword: z.string().min(10).max(256)
});

export const resetRequestSchema = z.object({
  email: emailSchema
});

export const resetConfirmSchema = z.object({
  token: z.string().min(24),
  newPassword: z.string().min(10).max(256)
});

export const snapshotPublishSchema = z.object({
  previewOnly: z.boolean().optional()
});

export const mediaUploadMetaSchema = z.object({
  kind: z.enum(['image', 'video', 'logo', 'document']),
  altText: z.string().trim().max(256).optional(),
  collectionKey: z.string().trim().max(64).optional(),
  title: z.string().trim().max(256).optional()
});

export const resourcePayloadSchema = z.object({
  resourceKey: z.string().trim().min(1),
  payload: z.record(z.string(), z.any())
});

export const resourceMutationSchema = z.object({
  resourceKey: z.string().trim().min(1).optional(),
  payload: z.record(z.string(), z.any()),
  status: z.string().trim().min(1).optional(),
  sortOrder: z.number().int().optional(),
  featured: z.boolean().optional()
});

export const resourcePatchSchema = z.object({
  payload: z.record(z.string(), z.any()).optional(),
  status: z.string().trim().min(1).optional(),
  sortOrder: z.number().int().optional(),
  featured: z.boolean().optional(),
  resourceKey: z.string().trim().min(1).optional()
});
