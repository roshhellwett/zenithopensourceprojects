import React from "react";
import { Boxes, Flag, Sparkles, Bot, Terminal, Cpu, Workflow } from "lucide-react";
import type { CategoryId } from "@/types";

export interface Category {
  id: CategoryId | "all";
  label: string;
  short: string;
  icon: React.ReactNode;
  accent: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "All projects", short: "All", icon: <Boxes size={14} />, accent: "slate", description: "Every project in one place" },
  { id: "civic", label: "Civic-Tech", short: "Civic", icon: <Flag size={14} />, accent: "emerald", description: "Tools for democracy & public good" },
  { id: "ai", label: "AI & Intelligence", short: "AI", icon: <Sparkles size={14} />, accent: "amber", description: "Automated systems & inference" },
  { id: "bots", label: "Bots & Automation", short: "Bots", icon: <Bot size={14} />, accent: "indigo", description: "Telegram, scheduled jobs, agents" },
  { id: "linux", label: "Linux & Audio", short: "Linux", icon: <Terminal size={14} />, accent: "sky", description: "GRUB, audio chains, desktop" },
  { id: "systems", label: "Systems & C/C++", short: "Systems", icon: <Cpu size={14} />, accent: "rose", description: "Low-level engines & utilities" },
  { id: "tools", label: "Developer Tools", short: "Tools", icon: <Workflow size={14} />, accent: "teal", description: "Workflows & DX accelerators" },
];
