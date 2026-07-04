import { SITE_URL } from "@/lib/seo";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TAIPOQ",
  url: SITE_URL,
  description:
    "Free English and Hindi typing practice, mock tests, study resources and verified government job updates for aspirants.",
  publisher: {
    "@type": "Organization",
    name: "TAIPOQ",
    url: SITE_URL,
  },
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
    />
  );
}
