import { NextResponse } from "next/server";

type LeadBody = {
  name?: string;
  phone?: string;
  objectType?: string;
  area?: string;
  date?: string;
  channel?: string;
  comment?: string;
};

const OBJECT_LABEL: Record<string, string> = {
  apartment: "Квартира",
  cottage: "Коттедж",
  office: "Офис",
  dacha: "Дача",
  other: "Другое",
};

const CHANNEL_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  call: "Звонок",
};

function escapeMd(s: string) {
  return s.replace(/[_*[\]()~`>#+=|{}.!\\-]/g, (m) => `\\${m}`);
}

function formatTelegramMessage(b: LeadBody): string {
  const lines = [
    "*🔔 Новая заявка — бесплатный замер*",
    "",
    `*Имя:* ${escapeMd(b.name ?? "—")}`,
    `*Телефон:* ${escapeMd(b.phone ?? "—")}`,
    `*Объект:* ${escapeMd(OBJECT_LABEL[b.objectType ?? ""] ?? b.objectType ?? "—")}`,
    b.area ? `*Площадь:* ${escapeMd(b.area)} м²` : null,
    b.date ? `*Желаемая дата:* ${escapeMd(b.date)}` : null,
    `*Связь:* ${escapeMd(CHANNEL_LABEL[b.channel ?? ""] ?? b.channel ?? "—")}`,
    b.comment ? `\n*Комментарий:*\n${escapeMd(b.comment)}` : null,
    "",
    `_Получено: ${escapeMd(new Date().toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" }))}_`,
  ];
  return lines.filter(Boolean).join("\n");
}

async function sendToTelegram(body: LeadBody): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegramMessage(body),
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[lead/telegram] failed:", res.status, errBody);
    return false;
  }
  return true;
}

async function sendToWebhook(body: LeadBody): Promise<boolean> {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) return false;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, receivedAt: new Date().toISOString() }),
    });
    return true;
  } catch (err) {
    console.error("[lead/webhook] failed:", err);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;

    const [tgOk, hookOk] = await Promise.all([
      sendToTelegram(body),
      sendToWebhook(body),
    ]);

    if (!tgOk && !hookOk) {
      console.log("[lead] received (no delivery configured):", body);
    }

    return NextResponse.json({ ok: true, delivered: { telegram: tgOk, webhook: hookOk } });
  } catch (err) {
    console.error("[lead] error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
