import fs from "node:fs";
import path from "node:path";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
} from "payload";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const LOCALES = ["ru", "en", "uz", "tr"] as const;

function mapDoc(p: Record<string, unknown>) {
  const cover = (p.cover as { url?: string } | null)?.url ?? "";
  const hero = (p.hero as { url?: string } | null)?.url ?? cover;
  const materials = ((p.materials as Array<{ value: string }> | null) ?? []).map((m) => m.value);
  const gallery = ((p.gallery as Array<{ image: { url?: string } | null; caption?: string }> | null) ?? [])
    .map((g) => ({ src: g.image?.url ?? "", caption: g.caption }))
    .filter((g) => g.src);
  const videos = ((p.videos as Array<{
    video: { url?: string } | null;
    poster: { url?: string } | null;
    caption?: string;
    aspect?: string;
  }> | null) ?? [])
    .map((v) => ({
      src: v.video?.url ?? "",
      poster: v.poster?.url ?? v.video?.url ?? "",
      caption: v.caption,
      aspect: (v.aspect as "video" | "portrait") ?? "portrait",
    }))
    .filter((v) => v.src);
  const quote = (p.quote as { text?: string; author?: string } | null) ?? null;

  return {
    slug: p.slug,
    name: p.name,
    type: p.type,
    typeLabel: p.typeLabel,
    segment: p.segment,
    area: p.area,
    location: p.location,
    duration: p.duration,
    status: p.status,
    year: p.year,
    cover: cover || "/media/posters/IMG_3843-poster.jpg",
    hero: hero || "/media/posters/IMG_3843-poster.jpg",
    intro: p.intro ?? "",
    materials,
    gallery,
    ...(videos.length > 0 ? { videos } : {}),
    ...(quote && quote.text ? { quote: { text: quote.text, author: quote.author ?? "" } } : {}),
  };
}

async function syncLocale(payload: Payload, locale: (typeof LOCALES)[number]) {
  const res = await payload.find({
    collection: "projects",
    limit: 200,
    sort: "order",
    depth: 2,
    locale,
    fallbackLocale: "ru",
  });
  const mapped = (res.docs as Array<Record<string, unknown>>).map(mapDoc);
  fs.writeFileSync(
    path.join(DATA_DIR, `projects.${locale}.json`),
    JSON.stringify(mapped, null, 2) + "\n",
    "utf-8",
  );
}

async function syncAll(payload: Payload) {
  for (const locale of LOCALES) {
    await syncLocale(payload, locale);
  }
}

export const syncProjectAfterChange: CollectionAfterChangeHook = async ({ req }) => {
  try {
    await syncAll(req.payload);
  } catch (err) {
    req.payload.logger.error({ err }, "[syncProject] failed to write per-locale JSON");
  }
};

export const syncProjectAfterDelete: CollectionAfterDeleteHook = async ({ req }) => {
  try {
    await syncAll(req.payload);
  } catch (err) {
    req.payload.logger.error({ err }, "[syncProject] failed on delete");
  }
};
