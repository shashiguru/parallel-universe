import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
    },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const glowPulse: Variants = {
  initial: { boxShadow: "0 0 20px rgba(0, 212, 255, 0.0)" },
  animate: {
    boxShadow: [
      "0 0 20px rgba(0, 212, 255, 0.0)",
      "0 0 40px rgba(0, 212, 255, 0.3)",
      "0 0 20px rgba(0, 212, 255, 0.0)",
    ],
    transition: { duration: 3, repeat: Infinity },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 0 0px rgba(0, 212, 255, 0)",
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 30px rgba(0, 212, 255, 0.2)",
    transition: { duration: 0.3 },
  },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: { duration: 0.4, ease: "easeIn" },
  },
};
