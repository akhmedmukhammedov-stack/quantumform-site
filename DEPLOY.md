# Deployment Guide — Quantum Form

Полный путь от локалки до публичного URL. ~30 минут от тебя, остальное автоматизировано.

## Что у тебя должно быть готово

- ✅ Git repo на GitHub (приватный, `quantumform-site`)
- ✅ Локально всё работает (`npm run dev`)
- ⏳ Аккаунт **Neon** (бесплатная Postgres БД)
- ⏳ Аккаунт **Vercel** (бесплатный хостинг)

## 1. Создать Postgres БД на Neon

Зачем: чтобы админка работала на production URL, а не только на твоём компе.

1. https://neon.com → **Sign up** → войди через GitHub
2. Создай проект:
   - **Project name:** `quantumform`
   - **Database name:** `quantumform`
   - **Region:** **EU Frankfurt** (ближе всего к Узбекистану)
3. На странице проекта нажми **Connection Details** → скопируй **Connection string**

   Выглядит так:
   ```
   postgresql://neondb_owner:abc123XYZ@ep-cool-name-12345.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   Сохрани его — он нужен для Vercel.

## 2. Развернуть на Vercel

1. https://vercel.com → **Sign up** → войди через GitHub
2. **Add New → Project** → выбери `quantumform-site` из списка репозиториев
3. **Configure project:**
   - **Framework Preset:** Next.js (автоопределится)
   - **Root Directory:** жми **Edit** и впиши `web` ← важно, проект в подпапке
   - **Build Command:** оставь по умолчанию (`next build`)
4. **Environment Variables** — добавь следующие (открой раздел):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | connection string из Neon |
   | `PAYLOAD_SECRET` | случайная строка 32+ символа — сгенерируй командой `openssl rand -hex 32` в терминале |
   | `NEXT_PUBLIC_SITE_URL` | `https://quantumform-site.vercel.app` (изменишь когда подключишь домен) |
   | `TELEGRAM_BOT_TOKEN` | из твоего `.env` |
   | `TELEGRAM_CHAT_ID` | из твоего `.env` |
   | `ADMIN_EMAIL` | `admin@quantumform.uz` |
   | `ADMIN_PASSWORD` | сильный пароль (хранится только для первого seed) |

5. **Deploy** — Vercel начнёт сборку. Первый билд ~3–5 минут.

## 3. Создать первого админ-юзера на проде

После того как сайт задеплоился:

1. Открой `https://<твой-проект>.vercel.app/api/seed` через POST с заголовком `x-seed-token: <твой PAYLOAD_SECRET>`:

   ```bash
   curl -X POST \
     -H "x-seed-token: ВСТАВЬ_СЮДА_PAYLOAD_SECRET" \
     https://<твой-проект>.vercel.app/api/seed
   ```

   Это создаст админа и заполнит контентом тот же набор, что был локально.

2. Логин: `https://<твой-проект>.vercel.app/admin`

## 4. Подключить домен `quantumform.uz`

Когда домен будет куплен (любой регистратор):

1. В Vercel → Project Settings → **Domains** → Add `quantumform.uz`
2. Vercel покажет 2 DNS-записи (A или CNAME) — добавь их у регистратора домена
3. Через 10 минут — час сайт будет доступен на `https://quantumform.uz`
4. Обнови `NEXT_PUBLIC_SITE_URL` в Vercel env vars → redeploy

## Что делать когда меняешь контент

**Локально через админку (`http://localhost:3000/admin`):**
- Hooks пишут изменения в файлы (`src/data/*.json`, `content/blog/**`)
- Изменения попадают на прод через `git push`:
  ```bash
  git add web/src/data web/content
  git commit -m "content update"
  git push
  ```
- Vercel автоматически пересоберёт сайт (~2 минуты)

**На проде через админку (`https://<твой-проект>.vercel.app/admin`):**
- Hooks **не пишут в файлы** (Vercel — read-only файловая система)
- Изменения сохраняются только в Postgres
- Чтобы синхронизировать с git → нужен отдельный endpoint, можно добавить позже

**Рекомендация:** для контента — редактируй локально, для срочных правок через прод-админку (но при следующем деплое они перезапишутся файлами из git, если не синхронизировать вручную)

## Если что-то сломалось

- **Build падает на Vercel** → проверь логи в Vercel Dashboard → Deployments → последний → View Logs
- **Сайт работает, /admin 500** → скорее всего `DATABASE_URL` неправильный или `PAYLOAD_SECRET` не задан
- **Лиды не приходят в Telegram** → проверь `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в Vercel env vars

## Ограничения бесплатных тарифов

| Сервис | Бесплатно | Когда упрёшься |
|---|---|---|
| **Vercel Hobby** | 100GB трафика/мес, 100GB-Hours функций | При 50K+ уников в месяц |
| **Neon Free** | 0.5GB БД, 190 часов compute/мес | Когда БД переполнится (тысячи проектов) |
| **GitHub Free** | Безлимитные приватные репо | Никогда для этого размера |
| **Telegram Bot API** | Безлимитно | Никогда |

Для подрядческого сайта в Ташкенте этих лимитов хватит на годы.
