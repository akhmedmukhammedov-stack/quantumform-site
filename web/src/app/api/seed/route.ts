import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getPayload } from "payload";
import config from "@payload-config";
import { projects as projectsData } from "@/lib/projects";

/**
 * One-shot bootstrap: creates admin user, populates globals, imports existing
 * MDX blog posts and TypeScript project array into Payload.
 *
 * Hit it once after a fresh install:
 *   curl -X POST -H "x-seed-token: $PAYLOAD_SECRET" http://localhost:3000/api/seed
 *
 * Idempotent — re-running won't duplicate anything.
 */
export async function POST(request: Request) {
  const expected = process.env.PAYLOAD_SECRET;
  const provided = request.headers.get("x-seed-token");
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const log: string[] = [];
  const payload = await getPayload({ config });

  // 1. Admin user
  const email = process.env.ADMIN_EMAIL ?? "admin@quantumform.uz";
  const password = process.env.ADMIN_PASSWORD ?? "quantum2026";
  const existingUser = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });
  if (existingUser.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: { email, password, name: "Admin" },
    });
    log.push(`+ created admin user: ${email}`);
  } else {
    log.push(`↷ admin ${email} exists`);
  }

  // 2. Site settings global
  const settings = await payload.findGlobal({ slug: "siteSettings" });
  if (!settings?.phone) {
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
    log.push("+ siteSettings populated");
  } else {
    log.push("↷ siteSettings exists");
  }

  // 3. Home copy global
  const homeCopy = await payload.findGlobal({ slug: "homeCopy" });
  if (!homeCopy?.heroHeadline) {
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
    log.push("+ homeCopy populated");
  } else {
    log.push("↷ homeCopy exists");
  }

  // 4. Blog posts (from MDX)
  const blogDir = path.join(process.cwd(), "content", "blog", "ru");
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const { data, content } = matter(raw);

      const existing = await payload.find({
        collection: "posts",
        where: { slug: { equals: slug } },
        limit: 1,
      });
      if (existing.totalDocs > 0) {
        log.push(`  ↷ post ${slug} exists`);
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
                    { type: "text", text: paragraph.trim(), version: 1, format: 0, mode: "normal", style: "", detail: 0 },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                })),
              direction: "ltr",
              format: "",
              indent: 0,
              version: 1,
            },
          },
        } as never,
      });
      log.push(`  + imported post: ${slug}`);
    }
  }

  // 5. Projects (from projects.ts)
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });
    if (existing.totalDocs > 0) {
      log.push(`  ↷ project ${p.slug} exists`);
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
    log.push(`  + imported project: ${p.slug}`);
  }

  return NextResponse.json({ ok: true, log });
}
