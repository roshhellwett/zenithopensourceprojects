import { SITE_URL } from "@/data/site";

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Zenith Open Source Projects",
    description: "An open source collective by Roshan Kr Singh (@roshhellwett) building tools, bots, and civic-tech for India and the world.",
    url: SITE_URL,
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      alternateName: "roshhellwett",
      email: "mailto:roshhellwett@icloud.com",
      sameAs: [
        "https://github.com/roshhellwett",
        "https://g.dev/roshhellwett",
        "https://www.linkedin.com/in/roshhellwett",
        "https://stackoverflow.com/users/17301307/roshhellwett",
        "https://sourceforge.net/u/roshhellwett/profile",
        "https://gitlab.com/roshhellwett",
        "https://twitter.com/roshhellwett",
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
