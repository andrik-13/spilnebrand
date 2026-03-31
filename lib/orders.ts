import type { LocalizedProduct } from './products';
import type { Locale } from './i18n';

export interface OrderDraft {
  product: LocalizedProduct;
  size?: string;
  color?: string;
  locale: Locale;
}

export function buildTelegramOrderStartParam(slug: string, size?: string, color?: string) {
  const parts = [slug];
  if (size) parts.push(size);
  if (color) parts.push(color);
  return parts.join('_');
}

export function buildTelegramOrderMessage(order: OrderDraft) {
  const lines = [
    "New order from SPIL'NE website",
    `Product: ${order.product.name}`,
    `Size: ${order.size || 'not selected'}`,
    `Color: ${order.color || 'not selected'}`,
    `Price: ${order.product.price} UAH`,
    `Locale: ${order.locale}`
  ];

  return lines.join('\n');
}
