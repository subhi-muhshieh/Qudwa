'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -20,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
