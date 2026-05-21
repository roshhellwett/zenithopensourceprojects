import React from "react";
import { Linkedin, Github, GraduationCap, Layers, Box, Gitlab, Twitter, Globe } from "lucide-react";

export const SOCIALS: {
  label: string;
  icon: React.ReactNode;
  link: string;
  accent: string;
}[] = [
  { label: "LinkedIn", icon: <Linkedin size={16} />, link: "https://www.linkedin.com/in/roshhellwett", accent: "sky" },
  { label: "GitHub", icon: <Github size={16} />, link: "https://github.com/roshhellwett", accent: "zinc" },
  { label: "ORCID", icon: <GraduationCap size={16} />, link: "https://orcid.org/0009-0008-7213-6376", accent: "lime" },
  { label: "Stack Overflow", icon: <Layers size={16} />, link: "https://stackoverflow.com/users/17301307/roshhellwett", accent: "amber" },
  { label: "SourceForge", icon: <Box size={16} />, link: "https://sourceforge.net/u/roshhellwett/profile", accent: "orange" },
  { label: "GitLab", icon: <Gitlab size={16} />, link: "https://gitlab.com/roshhellwett", accent: "rose" },
  { label: "Twitter / X", icon: <Twitter size={16} />, link: "https://twitter.com/roshhellwett", accent: "sky" },
  { label: "Google Dev", icon: <Globe size={16} />, link: "https://g.dev/roshhellwett", accent: "blue" },
];
