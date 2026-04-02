import { colorOptions, isLocale, type Locale } from './i18n';
import type { LocalizedProduct } from './products';

export interface OrderDraft {
  product: LocalizedProduct;
  size?: string;
  color?: string;
  locale: Locale;
}

const sizeOptions = ['S', 'M'] as const;

export interface TelegramOrderStartPayload {
  slug: string;
  size?: string;
  color?: string;
  locale: Locale;
}

function isAllowedSize(value: string) {
  return (sizeOptions as readonly string[]).includes(value);
}

function isAllowedColor(value: string) {
  return (colorOptions as readonly string[]).includes(value);
}

export function buildTelegramOrderStartParam(slug: string, size?: string, color?: string, locale: Locale = 'ua') {
  const parts = [slug];
  if (size) parts.push(size);
  if (color) parts.push(color);
  parts.push(locale);
  return parts.join('_');
}

export function parseTelegramOrderStartParam(value?: string | null): TelegramOrderStartPayload | null {
  if (!value) {
    return null;
  }

  const parts = value.split('_').filter(Boolean);
  if (parts.length === 0) {
    return null;
  }

  const localeCandidate = parts[parts.length - 1];
  const locale = localeCandidate && isLocale(localeCandidate) ? localeCandidate : 'ua';
  const payloadParts = localeCandidate && isLocale(localeCandidate) ? parts.slice(0, -1) : parts;
  const [slug, ...optionParts] = payloadParts;

  if (!slug) {
    return null;
  }

  let size: string | undefined;
  let color: string | undefined;

  for (const part of optionParts) {
    if (!size && isAllowedSize(part)) {
      size = part;
      continue;
    }

    if (!color && isAllowedColor(part)) {
      color = part;
    }
  }

  return { slug, size, color, locale };
}

export function buildTelegramOrderMessage(order: OrderDraft) {
  const lines = [
    "New order from SPIL'NE website",
    `Product: ${order.product.name}`,
    `Size: ${order.size || 'not selected'}`,
    `Color: ${order.color || 'not selected'}`,
    `Price: ${order.product.price} UAH`,
    `Locale: ${order.locale}`,
  ];

  return lines.join('\n');
}

export function buildTelegramStartReply(order: OrderDraft) {
  if (order.locale === 'en') {
    return [
      "Hello from SPIL'NE.",
      '',
      'Your order draft:',
      `Product: ${order.product.name}`,
      `Size: ${order.size || 'not selected'}`,
      `Color: ${order.color || 'not selected'}`,
      `Price: ${order.product.price} UAH`,
      '',
      'Reply in one message with:',
      '1. Full name',
      '2. Phone number',
      '3. City',
      '4. Delivery service and branch/post office',
    ].join('\n');
  }

  return [
    "Привіт від SPIL'NE.",
    '',
    'Твоє чернеткове замовлення:',
    `Товар: ${order.product.name}`,
    `Розмір: ${order.size || 'не обрано'}`,
    `Колір: ${order.color || 'не обрано'}`,
    `Ціна: ${order.product.price} грн`,
    '',
    'Відповідай одним повідомленням і вкажи:',
    "1. Ім'я та прізвище",
    '2. Номер телефону',
    '3. Місто',
    '4. Службу доставки та відділення/поштомат',
  ].join('\n');
}

export function buildTelegramFallbackReply(locale: Locale) {
  if (locale === 'en') {
    return [
      "Hello from SPIL'NE.",
      '',
      'Send a product link or write which item, size, and color you want, and we will continue the order here.',
    ].join('\n');
  }

  return [
    "Привіт від SPIL'NE.",
    '',
    'Надішли посилання на товар або напиши, яку річ, розмір і колір ти хочеш, і ми продовжимо замовлення тут.',
  ].join('\n');
}
