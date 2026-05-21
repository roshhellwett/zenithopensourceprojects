import { type Transition, type Variants } from "framer-motion";

export const spring: Transition = { type: "spring", stiffness: 100, damping: 20 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
