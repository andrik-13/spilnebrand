import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/lib/admin-auth';
import { ADMIN_ERROR_CODES, isTaggedError } from '@/lib/admin-errors';
import { uploadAdminProductImage } from '@/lib/admin-storage';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export async function POST(request: NextRequest) {
  if (!hasAdminAccess(request)) {
    return NextResponse.json({ error: 'Admin session expired. Sign in again.' }, { status: 401 });
  }

  const formData = await request.formData();
  const slug = String(formData.get('slug') || 'product');
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File is too large (max 10MB).' }, { status: 400 });
  }

  const mimeType = file.type.trim().toLowerCase();

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, and AVIF images are allowed.' }, { status: 400 });
  }

  try {
    const url = await uploadAdminProductImage(file, slug, mimeType);
    return NextResponse.json({ url });
  } catch (error) {
    const message = isTaggedError(error, ADMIN_ERROR_CODES.storageConfiguration)
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Failed to upload image.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
