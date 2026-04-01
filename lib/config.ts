import { buildTelegramOrderStartParam } from './orders';

export const appConfig = {
  telegramBotUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'spilnebrand_bot',
  telegramSupportUrl: process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT_URL || 'https://t.me/spilnebrand',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/spilne',
  brandEmail: process.env.NEXT_PUBLIC_BRAND_EMAIL || 'hello@spilne.ua'
};

export function buildTelegramOrderLink(slug: string, size?: string, color?: string) {
  const suffix = buildTelegramOrderStartParam(slug, size, color);
  return `https://t.me/${appConfig.telegramBotUsername}?start=${encodeURIComponent(suffix)}`;
}
