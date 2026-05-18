/**
 * Server-side helpers to fetch content from Payload.
 *
 * The local API (`getPayload`) has a known interaction with the Next 15 RSC
 * streaming pipeline that throws "Expected a suspended thenable" during page
 * render. Going through Payload's REST API (which is also mounted in this app)
 * sidesteps the issue.
 */
const REST_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");

async function rest<T>(path: string): Promise<T> {
  const url = `${REST_BASE}/api${path}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Payload REST ${path} ${res.status}`);
  }
  return res.json();
}

export type SiteSettings = {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
};

export type Pillar = {
  number: string;
  label: string;
  headline: string;
  body: string;
};

export type NumberStat = {
  value: string;
  label: string;
};

export type HomeCopy = {
  heroHeadline?: string;
  heroSubheadline?: string;
  pillarsTitle?: string;
  pillars?: Pillar[];
  numbers?: NumberStat[];
  finalCtaTitle?: string;
  finalCtaBody?: string;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return rest<SiteSettings>("/globals/siteSettings");
}

export async function getHomeCopy(): Promise<HomeCopy> {
  return rest<HomeCopy>("/globals/homeCopy");
}

type FindResp<T> = { docs: T[] };

export async function getProjects() {
  const data = await rest<FindResp<Record<string, unknown>>>(
    "/projects?limit=100&sort=order&depth=2",
  );
  return data.docs;
}

export async function getProjectBySlug(slug: string) {
  const data = await rest<FindResp<Record<string, unknown>>>(
    `/projects?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`,
  );
  return data.docs[0];
}

export async function getBlogPosts() {
  const data = await rest<FindResp<Record<string, unknown>>>(
    "/posts?limit=100&sort=-date&depth=2",
  );
  return data.docs;
}

export async function getBlogPostBySlug(slug: string) {
  const data = await rest<FindResp<Record<string, unknown>>>(
    `/posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`,
  );
  return data.docs[0];
}
