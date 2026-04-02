import type { Category, ColorKey, Locale } from '@/lib/i18n';
import { productSizeOptions, products, type Product, type ProductSize } from '@/lib/products';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { ADMIN_ERROR_CODES, createTaggedError } from '@/lib/admin-errors';

export interface AdminProductInput {
  slug: string;
  category: Category;
  price: number;
  sizes: ProductSize[];
  colors: ColorKey[];
  isNew: boolean;
  isActive: boolean;
  translations: Record<Locale, {
    name: string;
    description: string;
    composition: string;
    care: string;
  }>;
  images: string[];
}

export interface AdminProductRecord extends Product {
  isActive: boolean;
}

interface ProductImageRow {
  url: string;
  position: number;
}

interface ProductRow {
  id: string;
  slug: string;
  category: Category;
  price: number;
  sizes: ProductSize[];
  colors?: string[] | null;
  is_new: boolean;
  is_active?: boolean | null;
  name_ua: string;
  name_en: string;
  description_ua: string;
  description_en: string;
  composition_ua?: string | null;
  composition_en?: string | null;
  care_ua?: string | null;
  care_en?: string | null;
  product_images?: ProductImageRow[] | null;
}

function toOptionalText(value?: string | null) {
  return value ?? undefined;
}

function mapSupabaseRowToAdminProduct(row: ProductRow): AdminProductRecord {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => image.url);

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    price: row.price,
    sizes: row.sizes,
    colors: (row.colors as ColorKey[] | null) ?? ['black'],
    isNew: row.is_new,
    isActive: row.is_active ?? true,
    images,
    translations: {
      ua: {
        name: row.name_ua,
        description: row.description_ua,
        composition: toOptionalText(row.composition_ua),
        care: toOptionalText(row.care_ua),
      },
      en: {
        name: row.name_en,
        description: row.description_en,
        composition: toOptionalText(row.composition_en),
        care: toOptionalText(row.care_en),
      },
    },
  };
}

function mapSeedProduct(product: Product): AdminProductRecord {
  return {
    ...product,
    isActive: true,
  };
}

function requireAdminClient() {
  const client = createSupabaseAdminClient();

  if (!client) {
    throw createTaggedError(
      ADMIN_ERROR_CODES.configuration,
      'Supabase admin credentials are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to continue.'
    );
  }

  return client;
}

function normalizeImageList(images: string[]) {
  return images
    .map((image) => image.trim())
    .filter(Boolean);
}

async function syncProductImages(client: ReturnType<typeof requireAdminClient>, productId: string, nextImages: string[]) {
  const { data: existingImages, error: existingImagesError } = await client
    .from('product_images')
    .select('url,position')
    .eq('product_id', productId)
    .order('position', { ascending: true });

  if (existingImagesError) {
    throw new Error(existingImagesError.message || 'Failed to load existing product images.');
  }

  const { error: deleteImagesError } = await client
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (deleteImagesError) {
    throw new Error(deleteImagesError.message || 'Failed to reset product images.');
  }

  if (nextImages.length === 0) {
    return;
  }

  const { error: insertImagesError } = await client
    .from('product_images')
    .insert(nextImages.map((url, position) => ({ product_id: productId, url, position })));

  if (!insertImagesError) {
    return;
  }

  const previousImages = (existingImages ?? []) as ProductImageRow[];
  if (previousImages.length > 0) {
    await client
      .from('product_images')
      .insert(previousImages.map((image) => ({ product_id: productId, url: image.url, position: image.position })));
  }

  throw new Error(insertImagesError.message || 'Failed to save product images.');
}

export function getEmptyAdminProductInput(): AdminProductInput {
  return {
    slug: '',
    category: 'tops',
    price: 0,
    sizes: [...productSizeOptions],
    colors: ['black'],
    isNew: false,
    isActive: true,
    images: [],
    translations: {
      ua: {
        name: '',
        description: '',
        composition: '',
        care: '',
      },
      en: {
        name: '',
        description: '',
        composition: '',
        care: '',
      },
    },
  };
}

export function mapProductToInput(product: AdminProductRecord): AdminProductInput {
  return {
    slug: product.slug,
    category: product.category,
    price: product.price,
    sizes: product.sizes,
    colors: product.colors,
    isNew: product.isNew,
    isActive: product.isActive,
    images: product.images,
    translations: {
      ua: {
        name: product.translations.ua.name,
        description: product.translations.ua.description,
        composition: product.translations.ua.composition ?? '',
        care: product.translations.ua.care ?? '',
      },
      en: {
        name: product.translations.en.name,
        description: product.translations.en.description,
        composition: product.translations.en.composition ?? '',
        care: product.translations.en.care ?? '',
      },
    },
  };
}

export async function listAdminProducts() {
  const client = createSupabaseAdminClient();

  if (!client) {
    return products.map(mapSeedProduct);
  }

  const { data, error } = await client
    .from('products')
    .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,product_images(url,position)')
    .order('created_at', { ascending: false });

  if (error || !data) {
    throw createTaggedError(ADMIN_ERROR_CODES.dataAccess, error?.message || 'Failed to load admin products from Supabase.');
  }

  return (data as ProductRow[]).map(mapSupabaseRowToAdminProduct);
}

export async function getAdminProductById(id: string) {
  const client = createSupabaseAdminClient();

  if (!client) {
    return products.map(mapSeedProduct).find((product) => product.id === id) ?? null;
  }

  const { data, error } = await client
    .from('products')
    .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,product_images(url,position)')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw createTaggedError(ADMIN_ERROR_CODES.dataAccess, error?.message || 'Failed to load product from Supabase.');
  }

  return mapSupabaseRowToAdminProduct(data as ProductRow);
}

export async function createAdminProduct(input: AdminProductInput) {
  const client = requireAdminClient();
  const images = normalizeImageList(input.images);

  const { data, error } = await client
    .from('products')
    .insert({
      slug: input.slug,
      category: input.category,
      price: input.price,
      sizes: input.sizes,
      colors: input.colors,
      is_new: input.isNew,
      is_active: input.isActive,
      name_ua: input.translations.ua.name,
      name_en: input.translations.en.name,
      description_ua: input.translations.ua.description,
      description_en: input.translations.en.description,
      composition_ua: input.translations.ua.composition || '',
      composition_en: input.translations.en.composition || '',
      care_ua: input.translations.ua.care || null,
      care_en: input.translations.en.care || null,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create product.');
  }

  try {
    await syncProductImages(client, data.id as string, images);
  } catch (syncError) {
    await client.from('products').delete().eq('id', data.id);
    throw syncError;
  }

  return data.id as string;
}

export async function updateAdminProduct(id: string, input: AdminProductInput) {
  const client = requireAdminClient();
  const images = normalizeImageList(input.images);

  const { error } = await client
    .from('products')
    .update({
      slug: input.slug,
      category: input.category,
      price: input.price,
      sizes: input.sizes,
      colors: input.colors,
      is_new: input.isNew,
      is_active: input.isActive,
      name_ua: input.translations.ua.name,
      name_en: input.translations.en.name,
      description_ua: input.translations.ua.description,
      description_en: input.translations.en.description,
      composition_ua: input.translations.ua.composition || '',
      composition_en: input.translations.en.composition || '',
      care_ua: input.translations.ua.care || null,
      care_en: input.translations.en.care || null,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Failed to update product.');
  }

  await syncProductImages(client, id, images);
}


