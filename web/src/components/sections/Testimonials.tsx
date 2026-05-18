import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Testimonial = {
  quote: string;
  name: string;
  type: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Сделали ровно к сроку, по согласованной смете. До этого я с ремонтами обжигался — здесь приятно удивили дисциплиной.",
    name: "А. Каримов",
    type: "Квартира 110 м²",
  },
  {
    quote:
      "Понравилось, что всё сначала показали в 3D — было понятно, что мы получим. Никаких споров в процессе.",
    name: "Д. Юсупова",
    type: "Коттедж 240 м²",
  },
  {
    quote:
      "Фотоотчёт раз в неделю плюс один прораб на объекте — наконец без квеста «найди ответственного».",
    name: "Р. Хасанов",
    type: "Офис 180 м²",
  },
];

export function Testimonials() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="bg-paper-soft text-bg py-24 lg:py-36 border-y border-paper-border">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            tone="light"
            size="lg"
          />
        </Reveal>

        <div className="mt-16 lg:mt-20 grid gap-10 lg:gap-12 md:grid-cols-3">
          {testimonials.map((q, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="flex flex-col h-full">
                <span
                  aria-hidden
                  className="font-editorial italic text-5xl text-accent leading-none -mb-2"
                >
                  &ldquo;
                </span>
                <blockquote className="font-editorial italic text-lg lg:text-xl leading-[1.5] text-bg">
                  {q.quote}
                </blockquote>
                <figcaption className="mt-7 pt-5 border-t border-paper-border text-sm">
                  <div className="font-semibold text-bg">{q.name}</div>
                  <div className="text-text-dim mt-0.5">{q.type}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
