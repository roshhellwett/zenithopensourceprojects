export interface DesktopIconData {
  id: string;
  label: string;
  icon: string; // SVG icon key
  action?: string; // 'open-tab' | 'link' | 'toggle-mode' | 'trash'
  tabId?: string; // which tab to open
  link?: string; // external link
  position: "left" | "right";
}

export const LEFT_DESKTOP_ICONS: DesktopIconData[] = [
  { id: "home", label: "home.md", icon: "file-text", position: "left", action: "open-tab", tabId: "home" },
  { id: "projects", label: "Projects", icon: "folder-project", position: "left", action: "open-tab", tabId: "registry" },
  { id: "stack", label: "Tech Stack", icon: "stack", position: "left", action: "open-tab", tabId: "stack" },
  { id: "customers", label: "projects.mdx", icon: "file-mdx", position: "left", action: "open-tab", tabId: "customers" },
  { id: "demo", label: "demo.mov", icon: "video", position: "left", action: "open-tab", tabId: "telemetry" },
  { id: "docs", label: "Docs", icon: "docs", position: "left", action: "link", link: "https://github.com/roshhellwett/zenithopensourceprojects#readme" },
  { id: "talk", label: "Talk to founder", icon: "chat-bubble", position: "left", action: "open-tab", tabId: "founder" },
  { id: "ask-ai", label: "Ask a question", icon: "question", position: "left", action: "open-tab", tabId: "ask-ai" },
  { id: "signup", label: "Sign up ↗", icon: "signup", position: "left", action: "link", link: "https://github.com/roshhellwett" },
  { id: "switch-mode", label: "Switch to\nwebsite mode", icon: "switch", position: "left", action: "toggle-mode" },
];

export const RIGHT_DESKTOP_ICONS: DesktopIconData[] = [
  { id: "why", label: "Why Zenith?", icon: "why", position: "right", action: "open-tab", tabId: "home" },
  { id: "changelog", label: "Changelog", icon: "changelog", position: "right", action: "link", link: "https://github.com/roshhellwett/zenithopensourceprojects/commits/main" },
  { id: "handbook", label: "Company\nhandbook", icon: "handbook", position: "right", action: "open-tab", tabId: "founder" },
  { id: "store", label: "Store", icon: "store", position: "right", action: "link", link: "https://github.com/roshhellwett?tab=repositories" },
  { id: "work", label: "Work here", icon: "work", position: "right", action: "link", link: "https://www.linkedin.com/in/roshhellwett" },
  { id: "trash", label: "Trash", icon: "trash", position: "right", action: "trash" },
];
