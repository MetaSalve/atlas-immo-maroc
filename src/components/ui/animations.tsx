
'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const FadeIn = ({ children, className = '', delay = 0 }: FadeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const SlideIn = ({ children, className = '' }: FadeProps) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredList = ({ children }: { children: ReactNode[] }) => {
  return (
    <>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
};
