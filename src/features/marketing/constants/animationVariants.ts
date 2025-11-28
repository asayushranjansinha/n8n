import { Variants, easeOut } from "framer-motion";

export const HeroSectionAnimationVariants = {
  itemVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  } as const,
  imageVariants: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  } as const,
  floatingVariants: {
    animate: {
      y: [0, -8, 0] as number[], // force mutable,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as const,

  // Animation variants for Framer Motion
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  } as const,
};
export const bannerAnimationVariants: Variants = {
  hidden: { x: 0, y: 0, opacity: 0, rotate: 0 },
  visible: (custom: { x: number; y: number }) => ({
    x: custom.x,
    y: custom.y,
    opacity: 1,
    rotate: 360,
    transition: {
      x: { duration: 0.3, ease: easeOut },
      y: { duration: 0.3, ease: easeOut },
      opacity: { duration: 0.3 },
      rotate: {
        duration: 1,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }),
};
