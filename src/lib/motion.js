export const TRANSITION_EASE = [0.22, 1, 0.36, 1];

export const transitions = {
  fast: { duration: 0.35, ease: TRANSITION_EASE },
  default: { duration: 0.6, ease: TRANSITION_EASE },
  slow: { duration: 0.9, ease: TRANSITION_EASE },
  spring: { type: 'spring', damping: 25, stiffness: 200 },
  bounce: { type: 'spring', damping: 12, stiffness: 150 },
};

export const variants = {
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },

  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, y: 16, transition: { duration: 0.35 } },
  },

  fadeDown: {
    hidden: { opacity: 0, y: -24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  },

  slideInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.35 } },
  },

  slideInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: TRANSITION_EASE },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.35 } },
  },

  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  staggerContainerSlow: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.15,
      },
    },
  },
};
