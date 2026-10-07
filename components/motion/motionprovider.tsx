"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Applique « reducedMotion: user » à toutes les animations framer-motion :
 * si l'utilisateur a demandé moins de mouvement dans son système,
 * les translations/échelles sont désactivées automatiquement.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}