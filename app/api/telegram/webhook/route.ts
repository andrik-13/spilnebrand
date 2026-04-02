import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog-repository';
import { getLocalizedProduct } from '@/lib/products';
import {
  buildTelegramFallbackReply,
  buildTelegramStartReply,
  parseTelegramOrderStartParam,
} from '@/lib/orders';
import { extractTelegramMessage, getTelegramWebhookSecret, hasTelegramBotToken, sendTelegramMessage, type TelegramUpdate } from '@/lib/telegram';

function inferLocale(languageCode?: string) {
  return languageCode?.toLowerCase().startsWith('en') ? 'en' : 'ua';
}

export async function POST(request: Request) {
  try {
    const secret = getTelegramWebhookSecret();
    const headerSecret = request.headers.get('x-telegram-bot-api-secret-token') || '';

    if (secret && headerSecret !== secret) {
      return NextResponse.json({ ok: false, error: 'Invalid Telegram webhook secret.' }, { status: 401 });
    }

    if (!hasTelegramBotToken()) {
      return NextResponse.json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN.' }, { status: 503 });
    }

    const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
    if (!update) {
      return NextResponse.json({ ok: false, error: 'Invalid Telegram payload.' }, { status: 400 });
    }

    const message = extractTelegramMessage(update);
    if (!message?.chat?.id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const locale = inferLocale(message.from?.language_code);
    const text = message.text?.trim() || '';

    if (!text.startsWith('/start')) {
      await sendTelegramMessage(message.chat.id, buildTelegramFallbackReply(locale));
      return NextResponse.json({ ok: true, ignored: false });
    }

    const startPayload = parseTelegramOrderStartParam(text.split(/\s+/, 2)[1] || null);
    if (!startPayload) {
      await sendTelegramMessage(message.chat.id, buildTelegramFallbackReply(locale));
      return NextResponse.json({ ok: true, ignored: false });
    }

    const product = await getProductBySlug(startPayload.slug);
    if (!product) {
      await sendTelegramMessage(message.chat.id, buildTelegramFallbackReply(startPayload.locale));
      return NextResponse.json({ ok: true, ignored: false });
    }

    const localizedProduct = getLocalizedProduct(product, startPayload.locale);
    await sendTelegramMessage(
      message.chat.id,
      buildTelegramStartReply({
        product: localizedProduct,
        size: startPayload.size,
        color: startPayload.color,
        locale: startPayload.locale,
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error', error);
    return NextResponse.json({ ok: false, error: 'Telegram webhook failed.' }, { status: 500 });
  }
}
