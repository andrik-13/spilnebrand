import { buildTelegramOrderStartParam } from './orders';

const env = import.meta.env as Record<string, string | undefined>;

export const appConfig = {
  telegramBotUsername: env.VITE_TELEGRAM_BOT_USERNAME || 'spilnebrand_bot',
  telegramSupportUrl: env.VITE_TELEGRAM_SUPPORT_URL || 'https://t.me/spilnebrand',
  instagramUrl: env.VITE_INSTAGRAM_URL || 'https://instagram.com/spilne',
  brandEmail: env.VITE_BRAND_EMAIL || 'hello@spilne.ua',
};

export function buildTelegramOrderLink(slug: string, size?: string, color?: string) {
  const suffix = buildTelegramOrderStartParam(slug, size, color);
  return `https://t.me/${appConfig.telegramBotUsername}?start=${encodeURIComponent(suffix)}`;
}
