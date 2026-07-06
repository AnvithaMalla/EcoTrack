export const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)' },
};

export const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};
