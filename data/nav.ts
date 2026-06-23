export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export interface NavChild {
  label: string;
  href: string;
  desc?: string;
  icon?: string; // icon key (maps to renderDesktopIcon)
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Projects",
    children: [
      { label: "Project Sentinel", href: "https://github.com/roshhellwett/projectsentinel", desc: "AI news aggregator", icon: "file-text" },
      { label: "Project Cortex", href: "https://github.com/roshhellwett/projectcortex", desc: "AI browser assistant", icon: "question" },
      { label: "Project ZeroGapVote", href: "https://github.com/roshhellwett/projectzerogapvote", desc: "Transparent voting blueprint", icon: "why" },
      { label: "Project Monolith", href: "https://github.com/roshhellwett/projectmonolith", desc: "Telegram bots for academia", icon: "chat-bubble" },
      { label: "Project Venice", href: "https://github.com/roshhellwett/projectvenice", desc: "News automation bot", icon: "chat-bubble" },
      { label: "Project BillForge", href: "https://github.com/roshhellwett/projectbillforge", desc: "Indian vendors billing app", icon: "store" },
      { label: "View all projects →", href: "https://github.com/roshhellwett?tab=repositories", desc: "Full registry on GitHub", icon: "folder-project" },
    ],
  },
  {
    label: "Stack",
    children: [
      { label: "Systems & Logic Core", href: "#stack", desc: "C, C++, Python, Java", icon: "stack" },
      { label: "Web & Interface", href: "#stack", desc: "React, Next.js, TypeScript", icon: "switch" },
      { label: "Data Infrastructure", href: "#stack", desc: "MySQL, MongoDB, Linux, Git", icon: "file-mdx" },
    ],
  },
  {
    label: "Docs",
    children: [
      { label: "README", href: "https://github.com/roshhellwett/zenithopensourceprojects#readme", desc: "Project documentation", icon: "docs" },
      { label: "Source Code", href: "https://github.com/roshhellwett/zenithopensourceprojects", desc: "View on GitHub", icon: "folder-project" },
      { label: "License (MIT)", href: "https://github.com/roshhellwett/zenithopensourceprojects/blob/main/license", desc: "Open source license", icon: "changelog" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "GitHub", href: "https://github.com/roshhellwett", desc: "Open source contributions", icon: "folder-project" },
      { label: "Stack Overflow", href: "https://stackoverflow.com/users/17301307/roshhellwett", desc: "Q&A contributions", icon: "handbook" },
      { label: "Twitter / X", href: "https://twitter.com/roshhellwett", desc: "Follow for updates", icon: "chat-bubble" },
    ],
  },
  {
    label: "About",
    children: [
      { label: "Founder", href: "#founder", desc: "Roshan Kr Singh", icon: "signup" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/roshhellwett", desc: "Professional profile", icon: "work" },
      { label: "Google Dev", href: "https://g.dev/roshhellwett", desc: "Developer profile", icon: "signup" },
      { label: "ORCID", href: "https://orcid.org/0009-0008-7213-6376", desc: "Research profile", icon: "why" },
    ],
  },
];
