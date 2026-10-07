"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "./variants";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionReveal({ children, className, id }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      // once : l'animation ne se rejoue pas = moins de travail au scroll
      viewport={{ once: true, amount: 0.1 }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function SectionItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}