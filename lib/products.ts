import type { Category, ColorKey, Locale } from './i18n';

export interface ProductTranslation {
  name: string;
  description: string;
  composition?: string;
  care?: string;
}

export interface Product {
  id: string;
  slug: string;
  category: Category;
  price: number;
  sizes: Array<'S' | 'M'>;
  colors: ColorKey[];
  isNew: boolean;
  images: string[];
  translations: Record<Locale, ProductTranslation>;
}

export interface LocalizedProduct extends ProductTranslation {
  id: string;
  slug: string;
  category: Category;
  price: number;
  sizes: Array<'S' | 'M'>;
  colors: ColorKey[];
  isNew: boolean;
  images: string[];
}

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'drift-trousers',
    category: 'bottoms',
    price: 2000,
    sizes: ['S', 'M'],
    colors: ['black', 'beige'],
    isNew: true,
    images: ['/catalog/trousers/black-editorial.webp', '/catalog/trousers/beige-front.webp', '/catalog/trousers/beige-detail.webp', '/catalog/trousers/black-detail.webp'],
    translations: {
      ua: {
        name: 'Штани Drift',
        description: 'Мʼякі прямі штани з вільною посадкою, які працюють як окрема річ і як база для спокійного повсякденного образу. Силует тримається легко, тканина рухається разом із тілом і не перевантажує образ.',
        composition: 'Трикотаж на основі бавовни з мʼякою щільною фактурою.',
        care: 'Прати навиворіт при 30°C на делікатному режимі. Сушити природним способом, не пересушувати.'
      },
      en: {
        name: 'Drift trousers',
        description: 'Soft straight-leg trousers designed to work both as a standalone piece and as the base of a calm everyday uniform. The silhouette stays relaxed while the fabric moves easily with the body.',
        composition: 'Substantial cotton-based knit with a soft, smooth hand feel.',
        care: 'Wash inside out at 30°C on a delicate cycle. Air dry and avoid overdrying.'
      }
    }
  },
  {
    id: 'p2',
    slug: 'flow-zip-set',
    category: 'sets',
    price: 4000,
    sizes: ['S', 'M'],
    colors: ['beige', 'black', 'gray'],
    isNew: true,
    images: ['/catalog/zip-set/beige-main.webp', '/catalog/zip-set/black-main.webp', '/catalog/zip-set/beige-back.webp', '/catalog/zip-set/beige-lifestyle.webp', '/catalog/zip-set/black-detail.webp', '/catalog/zip-set/graphite-detail.webp'],
    translations: {
      ua: {
        name: 'Костюм Flow Zip',
        description: 'Комплект на блискавці для днів, коли хочеться виглядати зібрано без жорсткого стилінгу. Худі та штани утворюють цілісний силует, але так само легко носяться окремо.',
        composition: 'Щільний бавовняний трикотаж із мʼякою внутрішньою поверхнею.',
        care: 'Прати при 30°C, застібнувши блискавку. Сушити горизонтально або на плічках, прасувати з вивороту.'
      },
      en: {
        name: 'Flow Zip set',
        description: 'A zip-front set for days when you want to look put together without overstyling. The hoodie and trousers create a complete silhouette but are easy to wear separately as well.',
        composition: 'Dense cotton knit with a soft inner surface.',
        care: 'Wash at 30°C with the zip closed. Dry flat or on a hanger and iron inside out.'
      }
    }
  },
  {
    id: 'p3',
    slug: 'ease-tee',
    category: 'tops',
    price: 700,
    sizes: ['S', 'M'],
    colors: ['white', 'black'],
    isNew: true,
    images: ['/catalog/tee/white-main.webp', '/catalog/tee/black-main.webp', '/catalog/tee/white-detail.webp', '/catalog/tee/black-back.webp'],
    translations: {
      ua: {
        name: 'Футболка Ease',
        description: 'Вільна футболка з мʼякою лінією плеча та спокійною посадкою. Добре працює як перший шар у комплекті й як окрема базова річ для щоденних образів.',
        composition: 'Мʼякий щільний трикотаж на основі бавовни.',
        care: 'Прати при 30°C у делікатному режимі. Сушити природним способом, прасувати з вивороту.'
      },
      en: {
        name: 'Ease tee',
        description: 'A relaxed T-shirt with a soft shoulder line and an easy fit. It works well as a first layer inside a set and as a standalone essential for everyday looks.',
        composition: 'Soft, substantial cotton-based jersey.',
        care: 'Wash at 30°C on a delicate cycle. Air dry and iron inside out.'
      }
    }
  }
];

export function getLocalizedProduct(product: Product, locale: Locale): LocalizedProduct {
  return {
    id: product.id,
    slug: product.slug,
    category: product.category,
    price: product.price,
    sizes: product.sizes,
    colors: product.colors,
    isNew: product.isNew,
    images: product.images,
    ...product.translations[locale]
  };
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}
