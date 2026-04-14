import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);