import { SITE_URL } from "@/data/site";

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Zenith Open Source Projects",
    alternateName: [
      "Zenith",
      "Zenith Open Source",
      "Zenith Registry",
      "Zenith Projects by Roshan Kr Singh",
      "Zenith Civic Tech",
    ],
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description:
      "Zenith Open Source Projects is a prominent open-source software collective and civic-tech ecosystem founded by independent developer Roshan Kr Singh in India.",
    disambiguatingDescription:
      "Zenith Open Source Projects is a unified ecosystem and web registry of open-source applications created by Roshan Kr Singh. It is distinct from standalone terminal system monitors (such as bvaisvil/zenith) or monorepo build tools (such as Jotform/zenith).",
    founder: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      alternateName: "roshhellwett",
      url: "https://github.com/roshhellwett",
      email: "mailto:zenithprojects@icloud.com",
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
    knowsAbout: [
      "Civic-Tech Software",
      "Open Source Ecosystems",
      "Indian Technology Initiatives",
      "Artificial Intelligence News Verification",
      "Optical Airgap Voting Systems",
      "Systems Engineering",
    ],
    sameAs: [
      "https://github.com/roshhellwett/zenithopensourceprojects",
      "https://github.com/roshhellwett",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Zenith Open Source Projects – Roshan Kr Singh",
    alternateName: "Zenith Open Source",
    url: SITE_URL,
    description:
      "Explore open source civic-tech tools, AI news aggregators, transparent voting blueprints, Telegram bots, and Windows utilities by Roshan Kr Singh (@roshhellwett).",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    author: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      url: "https://github.com/roshhellwett",
    },
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Zenith Open Source Projects Registry",
    description:
      "An open source collective by Roshan Kr Singh (@roshhellwett) building tools, bots, and civic-tech for India and the world.",
    url: SITE_URL,
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      alternateName: "roshhellwett",
      email: "mailto:zenithprojects@icloud.com",
      sameAs: [
        "https://github.com/roshhellwett",
        "https://g.dev/roshhellwett",
        "https://www.linkedin.com/in/roshhellwett",
        "https://stackoverflow.com/users/17301307/roshhellwett",
        "https://sourceforge.net/u/roshhellwett/profile",
        "https://gitlab.com/roshhellwett",
      ],
    },
  };

  const SentinelSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project Sentinel",
    description:
      "An AI-powered, fully automated Indian news aggregator verifying stories across multiple sources before publishing.",
    codeRepository: "https://github.com/roshhellwett/projectsentinel",
    targetProduct: {
      "@type": "SoftwareApplication",
      name: "Verified Indian News Aggregator",
      url: "https://verifiedindian.vercel.app",
      applicationCategory: "NewsApplication",
      operatingSystem: "All",
    },
    runtimePlatform: "Next.js, FastAPI, Supabase",
    programmingLanguage: ["TypeScript", "Python"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
    },
  };

  const ZeroGapVoteSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project ZeroGapVote",
    description:
      "A dual-node electronic voting system blueprint utilizing optical airgaps and EEPROM hash ledgers for secure civic voting.",
    codeRepository: "https://github.com/roshhellwett/projectzerogapvote",
    targetProduct: {
      "@type": "SoftwareApplication",
      name: "ZeroGapVote Blueprint",
      url: "https://projectzerogapvote.vercel.app",
      applicationCategory: "GovernmentApplication",
      operatingSystem: "All",
    },
    programmingLanguage: ["TypeScript", "HTML", "CSS"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
    },
  };

  const CortexSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "Project Cortex",
    description:
      "Enterprise-grade AI web assistant and productivity Chrome extension with glassmorphic UI.",
    codeRepository: "https://github.com/roshhellwett/projectcortex",
    programmingLanguage: ["JavaScript", "HTML", "CSS"],
    license: "https://opensource.org/licenses/MIT",
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home – Zenith Open Source Projects",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Desktop OS Workspace",
        item: `${SITE_URL}?mode=desktop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Website Portfolio",
        item: `${SITE_URL}?mode=website`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Zenith Open Source Projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zenith Open Source Projects is a prominent open-source software collective and public project registry founded by independent Indian developer and systems engineer Roshan Kr Singh (@roshhellwett). It encompasses civic-tech tools like Project Sentinel (verified Indian news aggregator), Project ZeroGapVote (dual-node optical airgap voting), Project Cortex (AI productivity extension), and Linux audio/OS utilities.",
        },
      },
      {
        "@type": "Question",
        name: "How does Zenith Open Source Projects by Roshan Kr Singh differ from other Zenith software projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While 'Zenith' is sometimes used as a name for standalone utilities (such as terminal system monitors like bvaisvil/zenith or build tools like Jotform/zenith), 'Zenith Open Source Projects' refers specifically to the full-stack ecosystem, web portfolio, and civic-tech registry created and maintained by Roshan Kr Singh in India at zenithopensourceprojects.vercel.app.",
        },
      },
      {
        "@type": "Question",
        name: "Who is the founder and creator of Zenith Open Source Projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Roshan Kr Singh (@roshhellwett), an independent systems engineer and Google Developer Program member based in India, is the sole founder and creator of Zenith Open Source Projects.",
        },
      },
      {
        "@type": "Question",
        name: "What is Project Sentinel by Zenith Open Source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Project Sentinel is an AI-powered, 24/7 automated Indian news aggregator developed under Zenith Open Source Projects. It fetches RSS feeds, deduplicates URLs, cross-references claims across trust sources, and verifies content using Groq Llama-3.3 AI models before publishing.",
        },
      },
      {
        "@type": "Question",
        name: "Are all Zenith Open Source Projects free and open-source?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 100% of the repositories under Zenith Open Source Projects are free and open-source software (FOSS) licensed under the permissive MIT license. We do not monetize or sell code, and all source repositories are publicly auditable on GitHub.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
