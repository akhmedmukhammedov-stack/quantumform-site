import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
} from "@payloadcms/richtext-lexical";
import { ru } from "@payloadcms/translations/languages/ru";
import { en } from "@payloadcms/translations/languages/en";
import sharp from "sharp";

import { Posts } from "./src/payload/collections/Posts";
import { Projects } from "./src/payload/collections/Projects";
import { Media } from "./src/payload/collections/Media";
import { Users } from "./src/payload/collections/Users";
import { SiteSettings } from "./src/payload/globals/SiteSettings";
import { HomeCopy } from "./src/payload/globals/HomeCopy";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  admin: {
    user: Users.slug,
    // 'all' lets the user toggle between light and dark in the admin sidebar.
    theme: "all",
    meta: {
      titleSuffix: "— Quantum Form",
    },
  },
  // defaultFeatures includes all client toolbar plugins (InlineToolbar, Upload,
  // Link, lists, etc). We extend it with a fixed top toolbar and limit headings
  // to H2/H3 to match site typography.
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
    ],
  }),
  i18n: {
    supportedLanguages: { ru, en },
    fallbackLanguage: "ru",
  },
  collections: [Posts, Projects, Media, Users],
  globals: [SiteSettings, HomeCopy],
  localization: {
    locales: [
      { label: "Русский", code: "ru" },
      { label: "English", code: "en" },
      { label: "Oʻzbekcha", code: "uz" },
      { label: "Türkçe", code: "tr" },
    ],
    defaultLocale: "ru",
    fallback: true,
  },
  // Local dev → SQLite (file). Production (Vercel) → Postgres (Neon/Supabase).
  // Pick adapter from DATABASE_URL: anything starting with postgres:// goes Postgres.
  db: (process.env.DATABASE_URL ?? "").startsWith("postgres")
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URL! },
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL ?? "file:./payload.db",
        },
      }),
  secret: process.env.PAYLOAD_SECRET ?? "dev-only-secret-change-in-production",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload/payload-types.ts"),
  },
  sharp,
});
