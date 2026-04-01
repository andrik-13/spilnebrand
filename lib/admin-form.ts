import { colorOptions, locales, type Category, type ColorKey, type Locale } from '@/lib/i18n';
import type { AdminProductInput } from '@/lib/admin-products';

const allowedCategories: Category[] = ['tops', 'bottoms', 'sets'];
const allowedSizes = ['S', 'M'] as const;

function getString(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim();
}

function getStringArray(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

export function parseAdminProductForm(formData: FormData): AdminProductInput {
  const category = getString(formData, 'category') as Category;
  const sizes = getStringArray(formData, 'sizes').filter((size): size is (typeof allowedSizes)[number] =>
    (allowedSizes as readonly string[]).includes(size)
  );
  const colors = getStringArray(formData, 'colors').filter((color): color is ColorKey =>
    (colorOptions as readonly string[]).includes(color)
  );
  const price = Number(getString(formData, 'price'));
  const images = getString(formData, 'images')
    .split(/\r?\n/)
    .map((image) => image.trim())
    .filter(Boolean);

  if (!allowedCategories.includes(category)) {
    throw new Error('Choose a valid category.');
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error('Price must be a positive number.');
  }

  if (sizes.length === 0) {
    throw new Error('Select at least one size.');
  }

  if (colors.length === 0) {
    throw new Error('Select at least one color.');
  }

  const buildTranslation = (locale: Locale) => ({
    name: getString(formData, `name_${locale}`),
    description: getString(formData, `description_${locale}`),
    composition: getString(formData, `composition_${locale}`),
    care: getString(formData, `care_${locale}`),
  });

  const translations = Object.fromEntries(
    locales.map((locale) => [locale, buildTranslation(locale)])
  ) as AdminProductInput['translations'];

  const input: AdminProductInput = {
    slug: getString(formData, 'slug'),
    category,
    price,
    sizes,
    colors,
    isNew: formData.get('isNew') === 'on',
    isActive: formData.get('isActive') === 'on',
    images,
    translations,
  };

  if (!input.slug) {
    throw new Error('Slug is required.');
  }

  const hasMissingName = locales.some((locale) => !input.translations[locale].name);
  if (hasMissingName) {
    throw new Error('Names are required for every supported locale.');
  }

  return input;
}
