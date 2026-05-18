/**
 * Seed Payload DB with the content that was previously hardcoded in files.
 * Idempotent: re-running won't duplicate data.
 *
 * Run:  npm run seed
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPayload } from "payload";
import config from "../../payload.config";

const ROOT = path.resolve(process.cwd());
const BLOG_DIR = path.join(ROOT, "content", "blog", "ru");

async function ensureAdminUser(payload: Awaited<ReturnType<typeof getPayload>>) {
  const email = process.env.ADMIN_EMAIL ?? "admin@quantumform.uz";
  const password = process.env.ADMIN_PASSWORD ?? "quantum2026";

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });
  if (existing.totalDocs > 0) {
    console.log(`✓ admin user ${email} already exists`);
    return;
  }
  await payload.create({
    collection: "users",
    data: { email, password, name: "Admin" },
  });
  console.log(`✓ created admin user: ${email}`);
}

async function ensureSiteSettings(payload: Awaited<ReturnType<typeof getPayload>>) {
  const current = await payload.findGlobal({ slug: "siteSettings" });
  if (current?.phone) {
    console.log("✓ siteSettings already populated");
    return;
  }
  await payload.updateGlobal({
    slug: "siteSettings",
    data: {
      phone: "+998 __ ___ __ __",
      email: "hello@quantumform.uz",
      address: "Tashkent, Uzbekistan",
      hours: "Пн–Сб 9:00–19:00",
      instagram: "https://instagram.com/quantum.form",
      telegram: "https://t.me/quantumform",
      whatsapp: "https://wa.me/998000000000",
    },
  });
  console.log("✓ siteSettings seeded");
}

async function ensureHomeCopy(payload: Awaited<ReturnType<typeof getPayload>>) {
  const current = await payload.findGlobal({ slug: "homeCopy" });
  if (current?.heroHeadline) {
    console.log("✓ homeCopy already populated");
    return;
  }
  await payload.updateGlobal({
    slug: "homeCopy",
    data: {
      heroHeadline: "Точные сроки. Честные сметы. Гарантия результата.",
      heroSubheadline:
        "Ремонт и строительство под ключ в Ташкенте. Квартиры, коттеджи, офисы, дачи.",
      pillarsTitle: "Три обещания, которые мы держим в договоре",
      pillars: [
        {
          number: "01",
          label: "Срок",
          headline: "Если просрочим — платим за каждый день.",
          body:
            "Срок прописан в договоре. Каждый день просрочки по нашей вине компенсируется в вашу пользу.",
        },
        {
          number: "02",
          label: "Цена",
          headline: "Подписали смету — цена зафиксирована.",
          body:
            "После согласования сметы дополнительных денег мы не просим. Никаких «вдруг» по ходу работ.",
        },
        {
          number: "03",
          label: "План",
          headline: "3D-проект до первого удара молотка.",
          body:
            "Сначала визуализация и спецификация материалов. Только потом — стройка.",
        },
      ],
      numbers: [
        { value: "3+", label: "года в Ташкенте" },
        { value: "Под ключ", label: "от демонтажа до меблировки" },
        { value: "Гарантия", label: "в договоре" },
      ],
      finalCtaTitle: "Готовы начать?",
      finalCtaBody:
        "Закажите бесплатный замер — приедем, оценим объём, обсудим сроки.",
    },
  });
  console.log("✓ homeCopy seeded");
}

async function importBlogPosts(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (!fs.existsSync(BLOG_DIR)) {
    console.log(`(no MDX folder at ${BLOG_DIR}, skipping)`);
    return;
  }
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`  ↷ post ${slug} already exists`);
      continue;
    }

    await payload.create({
      collection: "posts",
      data: {
        title: data.title ?? slug,
        slug,
        excerpt: data.excerpt ?? "",
        category: (data.category ?? "process") as "process",
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        body: {
          root: {
            type: "root",
            children: content
              .split(/\n\n+/)
              .filter((p) => p.trim())
              .map((paragraph) => ({
                type: "paragraph",
                version: 1,
                children: [
                  { type: "text", text: paragraph.trim(), version: 1 },
                ],
              })),
            direction: "ltr",
            format: "" as const,
            indent: 0,
            version: 1,
          },
        } as never,
      },
    });
    console.log(`  + imported post: ${slug}`);
  }
}

async function importProjects(payload: Awaited<ReturnType<typeof getPayload>>) {
  const { projects } = await import("../lib/projects");
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      console.log(`  ↷ project ${p.slug} already exists`);
      continue;
    }
    await payload.create({
      collection: "projects",
      data: {
        order: (i + 1) * 10,
        status: p.status,
        name: p.name,
        slug: p.slug,
        type: p.type,
        typeLabel: p.typeLabel,
        segment: p.segment,
        area: p.area,
        duration: p.duration,
        location: p.location,
        year: p.year,
        intro: p.intro,
        materials: p.materials.map((value) => ({ value })),
        quote: p.quote ? { text: p.quote.text, author: p.quote.author } : undefined,
      } as never,
    });
    console.log(`  + imported project: ${p.slug}`);
  }
}

async function main() {
  const payload = await getPayload({ config });
  console.log("--- seed start ---");
  await ensureAdminUser(payload);
  await ensureSiteSettings(payload);
  await ensureHomeCopy(payload);
  await importBlogPosts(payload);
  await importProjects(payload);
  console.log("--- seed done ---");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
