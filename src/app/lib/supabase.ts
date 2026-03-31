import type { Product } from '../data/products';

export interface SupabaseProductRecord {
  id: string;
  slug: string;
  price: number;
  category: Product['category'];
  sizes: string[];
  is_new: boolean;
  is_active: boolean;
  images: string[];
  name_ua: string;
  name_en: string;
  description_ua: string;
  description_en: string;
  composition_ua: string;
  composition_en: string;
  care_ua: string;
  care_en: string;
  delivery_ua: string;
  delivery_en: string;
}

export function mapSupabaseProduct(record: SupabaseProductRecord): Product {
  return {
    id: record.id,
    slug: record.slug,
    category: record.category,
    price: record.price,
    sizes: record.sizes.filter((item): item is 'S' | 'M' => item === 'S' || item === 'M'),
    isNew: record.is_new,
    images: record.images,
    translations: {
      ua: {
        name: record.name_ua,
        description: record.description_ua,
        composition: record.composition_ua,
        care: record.care_ua,
        delivery: record.delivery_ua,
      },
      en: {
        name: record.name_en,
        description: record.description_en,
        composition: record.composition_en,
        care: record.care_en,
        delivery: record.delivery_en,
      },
    },
  };
}

export async function fetchSupabaseProducts(): Promise<Product[]> {
  throw new Error(
    'Supabase fetch is not wired yet. Add the real client and env keys before calling fetchSupabaseProducts().'
  );
}
