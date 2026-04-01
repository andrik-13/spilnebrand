import type { Category, ColorKey, Locale } from '@/lib/i18n';
import { products, type Product } from '@/lib/products';
import { createSupabaseAdminClient } from '@/lib/supabase-server';

export interface AdminProductInput {
  slug: string;
  category: Category;
  price: number;
  sizes: Array<'S' | 'M'>;
  colors: ColorKey[];
  isNew: boolean;
  isActive: boolean;
  translations: Record<Locale, {
    name: string;
    description: string;
    composition: string;
    care: string;
    delivery: string;
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
  sizes: Array<'S' | 'M'>;
  colors?: string[] | null;
  is_new: boolean;
  is_active?: boolean | null;
  name_ua: string;
  name_en: string;
  description_ua: string;
  description_en: string;
  composition_ua: string;
  composition_en: string;
  care_ua?: string | null;
  care_en?: string | null;
  delivery_ua?: string | null;
  delivery_en?: string | null;
  product_images?: ProductImageRow[] | null;
}

export class AdminConfigurationError extends Error {
  constructor(message = 'Supabase admin client is not configured.') {
    super(message);
    this.name = 'AdminConfigurationError';
  }
}

function fallbackCare(locale: Locale) {
  return locale === 'ua'
    ? 'Делікатне прання при 30°C. Сушити природним способом.'
    : 'Delicate wash at 30°C. Air dry naturally.';
}

function fallbackDelivery(locale: Locale) {
  return locale === 'ua'
    ? 'Доставка по Україні Новою Поштою або Укрпоштою після підтвердження замовлення.'
    : 'Delivery across Ukraine via Nova Poshta or Ukrposhta after order confirmation.';
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
        composition: row.composition_ua,
        care: row.care_ua || fallbackCare('ua'),
        delivery: row.delivery_ua || fallbackDelivery('ua'),
      },
      en: {
        name: row.name_en,
        description: row.description_en,
        composition: row.composition_en,
        care: row.care_en || fallbackCare('en'),
        delivery: row.delivery_en || fallbackDelivery('en'),
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
    throw new AdminConfigurationError();
  }

  return client;
}

function normalizeImageList(images: string[]) {
  return images
    .map((image) => image.trim())
    .filter(Boolean);
}

export function getEmptyAdminProductInput(): AdminProductInput {
  return {
    slug: '',
    category: 'tops',
    price: 0,
    sizes: ['S', 'M'],
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
        delivery: '',
      },
      en: {
        name: '',
        description: '',
        composition: '',
        care: '',
        delivery: '',
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
    translations: product.translations,
  };
}

export async function listAdminProducts() {
  const client = createSupabaseAdminClient();

  if (!client) {
    return products.map(mapSeedProduct);
  }

  const { data, error } = await client
    .from('products')
    .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,delivery_ua,delivery_en,product_images(url,position)')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return products.map(mapSeedProduct);
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
    .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,delivery_ua,delivery_en,product_images(url,position)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
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
      composition_ua: input.translations.ua.composition,
      composition_en: input.translations.en.composition,
      care_ua: input.translations.ua.care,
      care_en: input.translations.en.care,
      delivery_ua: input.translations.ua.delivery,
      delivery_en: input.translations.en.delivery,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create product.');
  }

  if (images.length > 0) {
    const { error: imageError } = await client
      .from('product_images')
      .insert(images.map((url, position) => ({ product_id: data.id, url, position })));

    if (imageError) {
      throw new Error(imageError.message || 'Failed to save product images.');
    }
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
      composition_ua: input.translations.ua.composition,
      composition_en: input.translations.en.composition,
      care_ua: input.translations.ua.care,
      care_en: input.translations.en.care,
      delivery_ua: input.translations.ua.delivery,
      delivery_en: input.translations.en.delivery,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Failed to update product.');
  }

  const { error: deleteImagesError } = await client
    .from('product_images')
    .delete()
    .eq('product_id', id);

  if (deleteImagesError) {
    throw new Error(deleteImagesError.message || 'Failed to reset product images.');
  }

  if (images.length > 0) {
    const { error: insertImagesError } = await client
      .from('product_images')
      .insert(images.map((url, position) => ({ product_id: id, url, position })));

    if (insertImagesError) {
      throw new Error(insertImagesError.message || 'Failed to save product images.');
    }
  }
}
