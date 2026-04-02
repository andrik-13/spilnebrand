import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog-repository';
import { getLocalizedProduct } from '@/lib/products';
import {
  buildTelegramAdminOrderMessage,
  buildTelegramConfirmationReply,
  buildTelegramDetailsPrompt,
  buildTelegramFallbackReply,
  buildTelegramStartReply,
  parseTelegramCustomerDetails,
  parseTelegramOrderStartParam,
} from '@/lib/orders';
import { extractTelegramMessage, getTelegramAdminChatId, getTelegramWebhookSecret, hasTelegramBotToken, sendTelegramMessage, type TelegramUpdate } from '@/lib/telegram';
import {
  clearTelegramOrderSession,
  createTelegramOrderSubmission,
  getTelegramOrderSession,
  hasTelegramOrderStorage,
  upsertTelegramOrderSession,
} from '@/lib/telegram-order-store';

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

    if (!hasTelegramOrderStorage()) {
      return NextResponse.json(
        { ok: false, error: 'Missing Telegram order storage configuration.' },
        { status: 503 }
      );
    }

    const update = (await request.json().catch(() => null)) as TelegramUpdate | null;
    if (!update) {
      return NextResponse.json({ ok: false, error: 'Invalid Telegram payload.' }, { status: 400 });
    }

    const message = extractTelegramMessage(update);
    if (!message?.chat?.id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const chatId = String(message.chat.id);
    const locale = inferLocale(message.from?.language_code);
    const text = message.text?.trim() || '';

    if (!text.startsWith('/start')) {
      const session = await getTelegramOrderSession(chatId);

      if (!session) {
        await sendTelegramMessage(message.chat.id, buildTelegramFallbackReply(locale));
        return NextResponse.json({ ok: true, ignored: false });
      }

      const details = parseTelegramCustomerDetails(text);
      if (!details) {
        await sendTelegramMessage(message.chat.id, buildTelegramDetailsPrompt(session.locale));
        return NextResponse.json({ ok: true, ignored: false });
      }

      const product = await getProductBySlug(session.productSlug);
      if (!product) {
        await clearTelegramOrderSession(chatId);
        await sendTelegramMessage(message.chat.id, buildTelegramFallbackReply(session.locale));
        return NextResponse.json({ ok: true, ignored: false });
      }

      const localizedProduct = getLocalizedProduct(product, session.locale);

      await createTelegramOrderSubmission({
        chatId,
        productSlug: localizedProduct.slug,
        productName: localizedProduct.name,
        size: session.size,
        color: session.color,
        locale: session.locale,
        price: localizedProduct.price,
        customerName: details.customerName,
        phone: details.phone,
        city: details.city,
        deliveryDetails: details.deliveryDetails,
        customerMessage: details.customerMessage,
      });

      const adminChatId = getTelegramAdminChatId();
      if (adminChatId) {
        try {
          await sendTelegramMessage(
            adminChatId,
            buildTelegramAdminOrderMessage(
              {
                product: localizedProduct,
                size: session.size,
                color: session.color,
                locale: session.locale,
              },
              details
            )
          );
        } catch (error) {
          console.error('Telegram admin notification failed', error);
        }
      } else {
        console.error('Missing TELEGRAM_ADMIN_CHAT_ID for Telegram order notifications');
      }

      await clearTelegramOrderSession(chatId);
      await sendTelegramMessage(message.chat.id, buildTelegramConfirmationReply(session.locale));
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
    await upsertTelegramOrderSession({
      chatId,
      productSlug: localizedProduct.slug,
      size: startPayload.size,
      color: startPayload.color,
      locale: startPayload.locale,
    });

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
