import { createSupabaseAdminClient } from './supabase-server';
import type { Locale } from './i18n';

export interface TelegramOrderSession {
  chatId: string;
  productSlug: string;
  size?: string;
  color?: string;
  locale: Locale;
}

export interface TelegramOrderSubmission {
  chatId: string;
  productSlug: string;
  productName: string;
  size?: string;
  color?: string;
  locale: Locale;
  price: number;
  customerName: string;
  phone: string;
  city: string;
  deliveryDetails: string;
  customerMessage: string;
}

interface TelegramOrderSessionRow {
  telegram_chat_id: string;
  product_slug: string;
  size?: string | null;
  color?: string | null;
  locale: Locale;
}

export function hasTelegramOrderStorage() {
  return Boolean(createSupabaseAdminClient());
}

function getTelegramOrderAdminClient() {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error(
      'Telegram order storage is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return supabase;
}

function mapSessionRow(row: TelegramOrderSessionRow): TelegramOrderSession {
  return {
    chatId: row.telegram_chat_id,
    productSlug: row.product_slug,
    size: row.size ?? undefined,
    color: row.color ?? undefined,
    locale: row.locale,
  };
}

export async function upsertTelegramOrderSession(session: TelegramOrderSession) {
  const supabase = getTelegramOrderAdminClient();

  const { error } = await supabase.from('telegram_order_sessions').upsert(
    {
      telegram_chat_id: session.chatId,
      product_slug: session.productSlug,
      size: session.size ?? null,
      color: session.color ?? null,
      locale: session.locale,
    },
    {
      onConflict: 'telegram_chat_id',
    }
  );

  if (error) {
    throw new Error(`Failed to save Telegram order session: ${error.message}`);
  }
}

export async function getTelegramOrderSession(chatId: string) {
  const supabase = getTelegramOrderAdminClient();

  const { data, error } = await supabase
    .from('telegram_order_sessions')
    .select('telegram_chat_id,product_slug,size,color,locale')
    .eq('telegram_chat_id', chatId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load Telegram order session: ${error.message}`);
  }

  return data ? mapSessionRow(data as TelegramOrderSessionRow) : null;
}

export async function clearTelegramOrderSession(chatId: string) {
  const supabase = getTelegramOrderAdminClient();

  const { error } = await supabase.from('telegram_order_sessions').delete().eq('telegram_chat_id', chatId);

  if (error) {
    throw new Error(`Failed to clear Telegram order session: ${error.message}`);
  }
}

export async function createTelegramOrderSubmission(submission: TelegramOrderSubmission) {
  const supabase = getTelegramOrderAdminClient();

  const { error } = await supabase.from('telegram_orders').insert({
    telegram_chat_id: submission.chatId,
    product_slug: submission.productSlug,
    product_name: submission.productName,
    size: submission.size ?? null,
    color: submission.color ?? null,
    locale: submission.locale,
    price: submission.price,
    customer_name: submission.customerName,
    phone: submission.phone,
    city: submission.city,
    delivery_details: submission.deliveryDetails,
    customer_message: submission.customerMessage,
  });

  if (error) {
    throw new Error(`Failed to save Telegram order: ${error.message}`);
  }
}
