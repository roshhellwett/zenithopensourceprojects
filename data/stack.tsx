import React from "react";
import { Cpu, LayoutTemplate, Server } from "lucide-react";

export const STACK: {
  category: string;
  icon: React.ReactNode;
  accent: string;
  concept: string;
  items: string[];
}[] = [
  {
    category: "Systems & Logic Core",
    icon: <Cpu size={16} />,
    accent: "indigo",
    concept: "Low-level memory, OOP, and algorithmic thinking across multiple paradigms.",
    items: ["C", "C++", "Python", "Java"],
  },
  {
    category: "Web & Interface Ecosystem",
    icon: <LayoutTemplate size={16} />,
    accent: "sky",
    concept: "Component-based architecture, async state, and responsive design at scale.",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    category: "Data Infrastructure & Ops",
    icon: <Server size={16} />,
    accent: "emerald",
    concept: "Relational vs NoSQL modeling, distributed VCS, Linux administration.",
    items: ["MySQL", "MongoDB", "Linux", "Git"],
  },
];
