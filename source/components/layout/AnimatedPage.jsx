// frontend/source/components/layout/AnimatedPage.jsx

import React from 'react';
import { motion } from 'framer-motion';

// Define a animação: começa invisível e um pouco abaixo,
// e anima para visível e na posição original.
const animations = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.08, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
