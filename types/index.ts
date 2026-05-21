export type CategoryId =
  | "civic"
  | "ai"
  | "bots"
  | "linux"
  | "systems"
  | "tools";

export interface Repo {
  name: string;
  displayName: string;
  link: string;
  desc: string;
  lang: string;
  accent: string;
  category: CategoryId;
  stars?: number;
  homepage?: string | null;
  topics?: string[];
}

export interface PanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}
