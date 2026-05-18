import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type BlogCategory = "materials" | "design" | "process" | "cases";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readingMinutes: number;
  cover?: string;
  body: string;
};

const ROOT = path.join(process.cwd(), "content", "blog");

/**
 * Read all posts for a locale. Falls back to RU if the locale folder is
 * missing or empty (matches Payload's `fallback: true`).
 */
export function getBlogPosts(locale: string): BlogPost[] {
  const tryDir = (loc: string) => {
    const dir = path.join(ROOT, loc);
    if (!fs.existsSync(dir)) return [] as BlogPost[];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((file) => readPost(path.join(dir, file)))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  };
  const localized = tryDir(locale);
  return localized.length > 0 ? localized : tryDir("ru");
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  const tryFile = (loc: string) => {
    const file = path.join(ROOT, loc, `${slug}.mdx`);
    return fs.existsSync(file) ? readPost(file) : undefined;
  };
  return tryFile(locale) ?? tryFile("ru");
}

function readPost(file: string): BlogPost {
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const slug = path.basename(file, ".mdx");

  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    category: (data.category ?? "process") as BlogCategory,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    cover: data.cover,
    body: content,
  };
}
