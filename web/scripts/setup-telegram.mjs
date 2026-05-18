/**
 * Interactive Telegram lead-notifier setup.
 *
 *   npm run setup:telegram
 *
 * 1. Asks for the bot token (from @BotFather).
 * 2. Verifies the token + prints the bot username.
 * 3. Waits for you to message the bot — auto-detects chat_id from the first
 *    incoming update.
 * 4. Sends a test message and writes both values to .env.
 *
 * Works for both private chats and groups/channels (just add the bot to the
 * group/channel as admin, then post any message inside).
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ENV_PATH = path.join(process.cwd(), ".env");

function ask(question) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  return rl.question(question).finally(() => rl.close());
}

async function tg(token, method, params = {}) {
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
}

function writeEnv(token, chatId) {
  const content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf-8") : "";
  const lines = content.split("\n");
  const set = (key, value) => {
    const i = lines.findIndex((l) => l.startsWith(`${key}=`));
    const next = `${key}=${value}`;
    if (i >= 0) lines[i] = next;
    else lines.push(next);
  };
  set("TELEGRAM_BOT_TOKEN", token);
  set("TELEGRAM_CHAT_ID", String(chatId));
  fs.writeFileSync(ENV_PATH, lines.join("\n").replace(/\n+$/, "\n"), "utf-8");
}

async function main() {
  console.log("\n┌─────────────────────────────────────────────");
  console.log("│ Quantum Form — Telegram lead setup");
  console.log("└─────────────────────────────────────────────\n");

  console.log("Шаг 1. Создай бота в Telegram:");
  console.log("  • Открой https://t.me/BotFather");
  console.log("  • Отправь /newbot");
  console.log("  • Дай имя (например «Quantum Form Leads») и username (заканчивается на _bot)");
  console.log("  • Скопируй TOKEN (выглядит как 123456789:AAH...)\n");

  const token = (await ask("→ Вставь TOKEN сюда: ")).trim();
  if (!/^\d+:[A-Za-z0-9_-]{30,}$/.test(token)) {
    console.error("\n✗ Этот TOKEN не похож на настоящий. Должен быть вида 123456789:AAH...");
    process.exit(1);
  }

  console.log("\nПроверяю токен...");
  let me;
  try {
    me = await tg(token, "getMe");
  } catch (err) {
    console.error("\n✗ Токен не работает:", err.message);
    process.exit(1);
  }
  console.log(`✓ Бот найден: @${me.username} (${me.first_name})`);

  console.log("\nШаг 2. Открой бота и напиши ему любое сообщение.");
  console.log(`  → https://t.me/${me.username}`);
  console.log("  (Если хочешь, чтобы заявки шли в группу — добавь бота в группу как админа");
  console.log("   и напиши сообщение в этой группе.)\n");

  console.log("Жду сообщения... (нажми Ctrl+C чтобы прервать)\n");

  let chat = null;
  const start = Date.now();
  const timeout = 5 * 60 * 1000;
  let lastUpdateId = 0;

  while (!chat && Date.now() - start < timeout) {
    try {
      const updates = await tg(token, "getUpdates", {
        timeout: 25,
        offset: lastUpdateId + 1,
      });
      for (const u of updates) {
        lastUpdateId = u.update_id;
        const c = u.message?.chat ?? u.channel_post?.chat ?? u.edited_message?.chat;
        if (c) {
          chat = c;
          break;
        }
      }
    } catch (err) {
      console.error("(getUpdates вернул ошибку, повторяю):", err.message);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!chat) {
    console.error("\n✗ Не дождался сообщения за 5 минут. Запусти заново когда напишешь боту.");
    process.exit(1);
  }

  const chatId = chat.id;
  const chatName =
    chat.title ?? `${chat.first_name ?? ""} ${chat.last_name ?? ""}`.trim() ?? chat.username ?? "chat";
  console.log(`✓ Чат найден: ${chatName} (id=${chatId}, type=${chat.type})`);

  console.log("\nОтправляю тестовое сообщение...");
  try {
    await tg(token, "sendMessage", {
      chat_id: chatId,
      text:
        "✓ *Quantum Form* — Telegram\\-уведомления подключены\\.\n\nС этого момента все заявки с сайта будут приходить сюда\\.",
      parse_mode: "MarkdownV2",
    });
    console.log("✓ Тест отправлен — проверь Telegram.");
  } catch (err) {
    console.error("✗ Тестовое сообщение не дошло:", err.message);
    console.error("  Проверь что бот в нужном чате/группе.");
    process.exit(1);
  }

  writeEnv(token, chatId);
  console.log(`\n✓ Записано в ${ENV_PATH}:`);
  console.log("    TELEGRAM_BOT_TOKEN=*** (скрыт)");
  console.log(`    TELEGRAM_CHAT_ID=${chatId}`);
  console.log("\nПерезапусти dev сервер (Ctrl+C → npm run dev), и заявки потекут.\n");
}

main().catch((err) => {
  console.error("\n✗ Ошибка:", err);
  process.exit(1);
});
