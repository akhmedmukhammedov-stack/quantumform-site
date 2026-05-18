# Quantum Form

Marketing site for **Quantum Form** — turnkey renovation and construction in Tashkent.

## Layout

```
quantumform-site/
├── web/                    Next.js 16 app (TypeScript, Tailwind v4, next-intl)
├── media-raw/              original HEIC photos + MOV videos (do not deploy)
└── media-processed/        web-ready JPG/MP4 + poster frames (source for /web/public/media)
```

## Run

```bash
cd web
npm install
npm run dev
```

Open <http://localhost:3000> — it redirects to `/ru`.

## Stack

| What            | Why                                                           |
| --------------- | ------------------------------------------------------------- |
| Next.js 16      | App Router, RSC, Vercel-first                                 |
| TypeScript      | strict                                                        |
| Tailwind v4     | CSS-first config (`@theme`), brand tokens in `globals.css`    |
| next-intl       | i18n with locale-routed paths: `/ru` (default), `/en`, `/uz`, `/tr` |
| Framer Motion   | scroll reveals, page transitions                              |
| react-three-fiber + drei | hero 3D wireframe (lazy-loaded, `ssr:false`)         |
| react-hook-form + zod    | forms                                                |
| MDX (next-mdx-remote)    | blog content                                         |
| lucide-react             | icons                                                |

## Media pipeline

Raw iPhone shots live in `media-raw/`. Run from the project root after dropping new files:

```bash
# Photos — HEIC → JPG (rotated, multiple sizes)
for f in media-raw/photos/*.HEIC; do
  base=$(basename "$f" .HEIC)
  sips -r 90 -s format jpeg -s formatOptions 82 -Z 2400 "$f" --out "media-processed/photos/${base}-2400.jpg"
  sips -r 90 -s format jpeg -s formatOptions 82 -Z 1600 "$f" --out "media-processed/photos/${base}-1600.jpg"
done

# Videos — MOV → MP4 1080p H.264 + poster at 1/3
for f in media-raw/videos/*.MOV; do
  base=$(basename "$f" .MOV)
  ffmpeg -y -i "$f" -vf "scale=-2:1080" -r 30 -c:v libx264 -preset medium -crf 23 -an -movflags +faststart "media-processed/videos/${base}.mp4"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ffmpeg -y -ss "$(echo "$dur/3" | bc -l)" -i "$f" -frames:v 1 -q:v 3 -vf "scale=-2:1080" "media-processed/posters/${base}-poster.jpg"
done
```

Then sync to `web/public/media/{photos,posters,videos}/`.

## Admin (Payload CMS)

URL: <http://localhost:3000/admin>

Default credentials (change after first login):

- email: `admin@quantumform.uz`
- password: `quantum2026`

**How edits flow to the site:**

1. You change something in `/admin` (a blog post, project, contact info).
2. Payload's `afterChange` hook writes the new data to a file in the repo:
   - **Projects** → `web/src/data/projects.json`
   - **Posts** → `web/content/blog/ru/<slug>.mdx`
   - **Site settings** → `web/src/data/site.json`
3. Next.js (dev) hot-reloads; you see the change on the site within a second.
4. To deploy: `git add` the regenerated files, commit, push. Vercel rebuilds.

**Adding a new blog post via admin:** Admin → Блог → Создать → fill in title, slug, category, body → Save. An MDX file appears in `web/content/blog/ru/`. The post is live.

**Production note:** Payload data (the SQLite file `payload.db`) is local-only. The site itself reads from the regenerated files which ARE in Git. So the public site is fully static — admin is your local content editor, files are the source of truth that ships.

## Build status

- [x] **Step 1** — Scaffold (Next.js 16 / TS / Tailwind v4 / next-intl / Framer Motion / r3f)
- [x] **Step 2** — Home page (Hero with 3D wireframe, Pillars, Services preview, Recent projects, Process snapshot, Numbers, Testimonials, Blog teaser, Final CTA)
- [x] **Step 3** — Services (4 anchored sections + tiers + timeline) + Process (5 detailed steps + pillars callout)
- [x] **Step 4** — Projects index + 7 case studies with photos + click-to-play videos
- [x] **Step 5** — Blog index + MDX post template + 5 starter stubs in RU
- [x] **Step 6** — About (manifesto, values, anonymized craft) + Contact (RHF/Zod form → `/api/lead` → `LEAD_WEBHOOK_URL`)
- [x] **Step 7** — RU complete, EN fully translated, UZ/TR with nav + fallback to RU for missing keys
- [x] **Step 8** — `sitemap.xml`, `robots.txt`, `LocalBusiness` JSON-LD, per-route OG metadata
- [ ] Step 9 — Lighthouse / a11y final pass (run after first deploy to measure real numbers)

Total prerendered pages: **76+** (4 locales × 7 static + 7 case studies × 4 + 5 blog posts × 4).

## Placeholders to fill

See `web/src/lib/site.ts`:

- `phone`, `email`, `address`, `hours`
- `social.telegram`, `social.whatsapp`
- `[X]`, `[Y]` numbers in `messages/ru.json` → `home.numbers`
- `LEAD_WEBHOOK_URL` env var

## Deploy

Vercel, zero-config. Set `LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_SITE_URL` in project env.
