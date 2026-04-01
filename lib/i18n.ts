export type Locale = 'ua' | 'en';
export type Category = 'tops' | 'bottoms' | 'sets';
export type ColorKey = 'black' | 'beige' | 'gray' | 'white';

export const locales: Locale[] = ['ua', 'en'];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleFromPathname(value?: string): Locale {
  return value && isLocale(value) ? value : 'ua';
}

export function getCurrencyLabel(value: number, locale: Locale) {
  const amount = new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : 'en-US').format(value);
  return locale === 'ua' ? `${amount} грн` : `${amount} UAH`;
}

export const categoryOrder: Category[] = ['tops', 'bottoms', 'sets'];

export const ui = {
  ua: {
    brand: "SPIL'NE",
    home: 'Головна',
    catalog: 'Каталог',
    about: 'Про бренд',
    delivery: 'Доставка',
    heroTitle: 'Базовий гардероб, який залишається',
    heroSubtitle: 'Чисті силуети, природні відтінки і речі, до яких хочеться повертатися щодня.',
    viewCollection: 'Переглянути колекцію',
    newCollection: 'Нова колекція',
    seasonLabel: 'Квітень 2026',
    allProducts: 'Дивитися усі',
    aboutEyebrow: 'Про бренд',
    aboutTitle: "SPIL'NE створює м'які речі для спокійного міського ритму та щоденного комфорту.",
    aboutText: "Ми зосереджуємось на чистих формах, м'якому трикотажі та кольорах, які легко жити разом. Кожна річ створена так, щоб працювати окремо й у комплекті, без випадкових деталей та зайвого шуму.",
    aboutCta: "Чому SPIL'NE",
    lookbookLabel: 'Lookbook',
    lookbookTitle: 'Речі для дому, міста і тих моментів, коли хочеться рухатися повільніше.',
    lookbookSubtitle: 'Монохромні образи, мʼякі фактури й силуети, які легко носити щодня.',
    noProducts: 'Товарів не знайдено.',
    allFilter: 'Усі',
    tops: 'Топи',
    bottoms: 'Низи',
    sets: 'Сети',
    breadcrumbsCollection: 'Колекція',
    size: 'Розмір',
    colors: 'Кольори',
    orderTelegram: 'Замовити у Telegram',
    orderHint: 'Напиши нам у Telegram, і ми підтвердимо замовлення, колір і розмір.',
    compositionAndCare: 'Склад та догляд',
    relatedDelivery: 'Доставка',
    notFoundTitle: 'Сторінку не знайдено',
    notFoundText: 'Схоже, ми не змогли знайти цю сторінку. Повернімося до каталогу.',
    backToCatalog: 'Повернутися до каталогу',
    footerRights: 'Усі права захищені.',
    footerMadeIn: "Зроблено з любов'ю в Україні",
    footerSupport: 'Підтримка в Telegram',
    footerDelivery: 'Нова Пошта та Укрпошта по всій Україні',
    galleryAlt: "Образи SPIL'NE",
    adminTitle: 'Admin',
    adminText: 'Панель керування каталогом, товарами та зображеннями.',
    black: 'Чорний',
    beige: 'Бежевий',
    gray: 'Сірий',
    white: 'Білий'
  },
  en: {
    brand: "SPIL'NE",
    home: 'Home',
    catalog: 'Catalog',
    about: 'About',
    delivery: 'Delivery',
    heroTitle: 'A soft uniform for daily movement',
    heroSubtitle: 'Clean silhouettes, tactile fabrics, and calm shades designed to stay in your wardrobe beyond one season.',
    viewCollection: 'View collection',
    newCollection: 'New collection',
    seasonLabel: 'April 2026',
    allProducts: 'See all',
    aboutEyebrow: 'About the brand',
    aboutTitle: "SPIL'NE creates soft essentials for a calm city rhythm and everyday ease.",
    aboutText: 'We focus on clean shapes, substantial knitwear, and tones that live well together. Each piece is made to work both on its own and as part of a set, without visual noise.',
    aboutCta: "Why SPIL'NE",
    lookbookLabel: 'Lookbook',
    lookbookTitle: 'Pieces for home, city days, and slower moments in between.',
    lookbookSubtitle: 'Monochrome outfits, soft texture, and silhouettes that are easy to wear every day.',
    noProducts: 'No products found.',
    allFilter: 'All',
    tops: 'Tops',
    bottoms: 'Bottoms',
    sets: 'Sets',
    breadcrumbsCollection: 'Collection',
    size: 'Size',
    colors: 'Colors',
    orderTelegram: 'Order in Telegram',
    orderHint: 'Message us in Telegram and we will confirm the order, color, and size.',
    compositionAndCare: 'Composition and care',
    relatedDelivery: 'Delivery',
    notFoundTitle: 'Page not found',
    notFoundText: "We could not find this page. Let's get you back to the catalog.",
    backToCatalog: 'Back to catalog',
    footerRights: 'All rights reserved.',
    footerMadeIn: 'Made with care in Ukraine',
    footerSupport: 'Telegram support',
    footerDelivery: 'Nova Poshta and Ukrposhta across Ukraine',
    galleryAlt: "SPIL'NE looks",
    adminTitle: 'Admin',
    adminText: 'Catalog management panel for products and images.',
    black: 'Black',
    beige: 'Beige',
    gray: 'Gray',
    white: 'White'
  }
} as const;

export function getCategoryLabel(locale: Locale, category: Category) {
  return ui[locale][category];
}

export function getColorLabel(locale: Locale, color: ColorKey) {
  return ui[locale][color];
}

export function getLocalizedPath(locale: Locale, path = '') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${normalized === '/' ? '' : normalized}`;
}
