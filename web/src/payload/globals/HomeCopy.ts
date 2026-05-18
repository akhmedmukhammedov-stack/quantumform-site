import type { GlobalConfig } from "payload";

/**
 * Home page copy. Arrays in globals have known issues with the SQLite adapter,
 * so we store pillars / numbers as JSON. Admin UI shows a JSON editor —
 * acceptable for now; when on Postgres the arrays can be turned back on.
 */
export const HomeCopy: GlobalConfig = {
  slug: "homeCopy",
  label: "Главная — тексты",
  access: { read: () => true },
  admin: {
    description: "Заголовки и описания всех секций главной страницы.",
  },
  fields: [
    {
      name: "heroHeadline",
      type: "textarea",
      label: "Hero — главный заголовок",
    },
    {
      name: "heroSubheadline",
      type: "textarea",
      label: "Hero — подзаголовок",
    },
    {
      name: "pillarsTitle",
      type: "text",
      label: "3 столпа — заголовок секции",
    },
    {
      name: "pillars",
      type: "json",
      label: "3 столпа — массив из 3 объектов",
      admin: {
        description:
          'Формат: [{"number":"01","label":"Срок","headline":"...","body":"..."}, ...]',
      },
    },
    {
      name: "numbers",
      type: "json",
      label: "Числа — массив из 3 объектов",
      admin: {
        description: 'Формат: [{"value":"3+","label":"года в Ташкенте"}, ...]',
      },
    },
    {
      name: "finalCtaTitle",
      type: "text",
      label: "Финальный CTA — заголовок",
    },
    {
      name: "finalCtaBody",
      type: "textarea",
      label: "Финальный CTA — описание",
    },
  ],
};
