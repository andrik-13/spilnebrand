import { createSupabaseAdminClient } from '@/lib/supabase-server';

export class AdminStorageConfigurationError extends Error {
  constructor(message = 'Supabase storage is not configured.') {
    super(message);
    this.name = 'AdminStorageConfigurationError';
  }
}

function requireStorageClient() {
  const client = createSupabaseAdminClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

  if (!client || !bucket) {
    throw new AdminStorageConfigurationError('Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET and admin credentials.');
  }

  return { client, bucket };
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getPublicBaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new AdminStorageConfigurationError('NEXT_PUBLIC_SUPABASE_URL is required for public storage URLs.');
  }

  return `${url.replace(/\/$/, '')}/storage/v1/object/public`;
}

export async function uploadAdminProductImage(file: File, slugHint?: string) {
  const { client, bucket } = requireStorageClient();
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeSlug = (slugHint || 'product').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'product';
  const safeName = sanitizeFileName(file.name || 'image');
  const extension = safeName.includes('.') ? safeName.split('.').pop() : 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const path = `${safeSlug}/${fileName}`;

  const { error } = await client.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || 'Failed to upload image.');
  }

  return `${getPublicBaseUrl()}/${bucket}/${path}`;
}
