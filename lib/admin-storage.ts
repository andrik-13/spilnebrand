import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { ADMIN_ERROR_CODES, createTaggedError } from '@/lib/admin-errors';

const mimeExtensions = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
} as const;

type SupportedImageMimeType = keyof typeof mimeExtensions;

function requireStorageClient() {
  const client = createSupabaseAdminClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;

  if (!client || !bucket) {
    throw createTaggedError(
      ADMIN_ERROR_CODES.storageConfiguration,
      'Supabase storage is not configured. Add NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET and admin credentials.'
    );
  }

  return { client, bucket };
}

function getExtensionForMimeType(mimeType: string) {
  const extension = mimeExtensions[mimeType as SupportedImageMimeType];

  if (!extension) {
    throw new Error('Unsupported image type.');
  }

  return extension;
}

export async function uploadAdminProductImage(file: File, slugHint?: string, mimeType?: string) {
  const { client, bucket } = requireStorageClient();
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeSlug = (slugHint || 'product').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'product';
  const extension = getExtensionForMimeType((mimeType || file.type || '').trim().toLowerCase());
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const path = `${safeSlug}/${fileName}`;

  const { error } = await client.storage
    .from(bucket)
    .upload(path, bytes, {
      contentType: mimeType || file.type || 'application/octet-stream',
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || 'Failed to upload image.');
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);

  if (!data.publicUrl) {
    throw new Error('Failed to resolve public image URL.');
  }

  return data.publicUrl;
}
