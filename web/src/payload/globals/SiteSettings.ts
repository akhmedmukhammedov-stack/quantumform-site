import type { GlobalConfig } from "payload";
import { syncSiteAfterChange } from "../hooks/syncSite";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "Контакты и соцсети",
  access: { read: () => true },
  admin: {
    description:
      "Контакты для Footer, страницы /contact, финального CTA и SEO-разметки. Сохрани и эти данные сразу появятся на сайте.",
  },
  hooks: {
    afterChange: [syncSiteAfterChange],
  },
  fields: [
    {
      type: "collapsible",
      label: "Прямые контакты",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "phone",
              type: "text",
              label: "Телефон",
              admin: { placeholder: "+998 90 123 45 67" },
            },
            {
              name: "email",
              type: "email",
              label: "Email",
              admin: { placeholder: "hello@quantumform.uz" },
            },
          ],
        },
        {
          name: "address",
          type: "text",
          localized: true,
          label: "Адрес офиса",
          admin: { placeholder: "Ташкент, ул. Шахрисабзская, 4" },
        },
        {
          name: "hours",
          type: "text",
          localized: true,
          label: "Часы работы",
          admin: { placeholder: "Пн–Сб 9:00–19:00" },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Социальные сети и мессенджеры",
      fields: [
        {
          name: "instagram",
          type: "text",
          label: "Instagram",
          admin: { placeholder: "https://instagram.com/quantum.form" },
        },
        {
          name: "telegram",
          type: "text",
          label: "Telegram",
          admin: { placeholder: "https://t.me/quantumform" },
        },
        {
          name: "whatsapp",
          type: "text",
          label: "WhatsApp",
          admin: { placeholder: "https://wa.me/998901234567" },
        },
      ],
    },
  ],
};
