import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasAdminAccess } from '@/lib/admin-auth';
import { AdminStorageConfigurationError, uploadAdminProductImage } from '@/lib/admin-storage';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

  try {
    const url = await uploadAdminProductImage(file, slug);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof AdminStorageConfigurationError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Failed to upload image.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
