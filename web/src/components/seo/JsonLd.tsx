import { site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: site.name,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? site.url,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tashkent",
      addressCountry: "UZ",
      streetAddress: site.address,
    },
    areaServed: "Tashkent",
    sameAs: [site.social.instagram, site.social.telegram, site.social.whatsapp].filter(
      Boolean,
    ),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
