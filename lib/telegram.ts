interface TelegramChat {
  id: number;
}

interface TelegramUser {
  language_code?: string;
}

interface TelegramMessage {
  chat: TelegramChat;
  from?: TelegramUser;
  text?: string;
}

export interface TelegramUpdate {
  message?: TelegramMessage;
}

function getBotToken() {
  return process.env.TELEGRAM_BOT_TOKEN || '';
}

export function getTelegramWebhookSecret() {
  return process.env.TELEGRAM_WEBHOOK_SECRET || '';
}

export function hasTelegramBotToken() {
  return Boolean(getBotToken());
}

export async function sendTelegramMessage(chatId: number, text: string) {
  const token = getBotToken();

  if (!token) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN');
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Telegram sendMessage failed with status ${response.status}`);
  }
}

export function extractTelegramMessage(update: TelegramUpdate) {
  return update.message ?? null;
}
