import { type Transition, type Variants } from "framer-motion";

export const spring: Transition = { type: "spring", stiffness: 250, damping: 25, mass: 0.5 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 140, damping: 24, mass: 0.8 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(4px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 180, damping: 22, mass: 0.8 },
  },
};

export const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};
