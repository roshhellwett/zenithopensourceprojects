import { SITE_URL } from "@/data/site";

export function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zenith Open Source Projects",
    url: SITE_URL,
    description:
      "A curated collection of open source tools, bots, and system experiments by Roshan Kr Singh.",
    author: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      url: "https://github.com/roshhellwett",
      sameAs: [
        "https://github.com/roshhellwett",
        "https://x.com/roshhellwett",
      ],
    },
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
  };

  const collectionSchema = {
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

  const SentinelSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project Sentinel",
    description: "An AI-powered, fully automated Indian news aggregator verifying stories across multiple sources before publishing.",
    codeRepository: "https://github.com/roshhellwett/projectsentinel",
    targetProduct: {
      "@type": "SoftwareApplication",
      name: "Verified Indian News Aggregator",
      url: "https://verifiedindian.vercel.app",
      applicationCategory: "NewsApplication",
      operatingSystem: "All"
    },
    runtimePlatform: "Next.js, FastAPI, Supabase",
    programmingLanguage: ["TypeScript", "Python"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh"
    }
  };

  const ZeroGapVoteSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project ZeroGapVote",
    description: "A dual-node electronic voting system blueprint utilizing optical airgaps and EEPROM hash ledgers for secure civic voting.",
    codeRepository: "https://github.com/roshhellwett/projectzerogapvote",
    targetProduct: {
      "@type": "SoftwareApplication",
      name: "ZeroGapVote Blueprint",
      url: "https://projectzerogapvote.vercel.app",
      applicationCategory: "GovernmentApplication",
      operatingSystem: "All"
    },
    programmingLanguage: ["TypeScript", "HTML", "CSS"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh"
    }
  };

  const CortexSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project Cortex",
    description: "Enterprise-grade AI web assistant and productivity Chrome extension with glassmorphic UI.",
    codeRepository: "https://github.com/roshhellwett/projectcortex",
    programmingLanguage: ["JavaScript", "HTML", "CSS"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Desktop OS Workspace",
        item: `${SITE_URL}?mode=desktop`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Website Portfolio",
        item: `${SITE_URL}?mode=website`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Project Sentinel?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project Sentinel is a 24/7 automated Indian news aggregator that fetches RSS feeds, hashes URLs for deduplication, filters using domain blacklists, cross-references claims across multiple trust sources, and verifies content using Groq Llama-3.3 before publishing."
        }
      },
      {
        "@type": "Question",
        name: "How does Project ZeroGapVote work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ZeroGapVote modernizes electronic voting using a dual-node system physically isolated by an optical airgap protocol (QR codes), cryptographically chaining vote records in EEPROM, and using a hardware watchdog system."
        }
      },
      {
        "@type": "Question",
        name: "Are all Zenith projects open source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100% of Zenith projects are open source and licensed under the permissive MIT license. The source code is publicly accessible on GitHub."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SentinelSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ZeroGapVoteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CortexSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
