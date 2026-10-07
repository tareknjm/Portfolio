"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/**
 * Editorial section header: mono eyebrow (with an optional index) + a
 * confident white title, left-aligned. Replaces the old centered
 * gradient-text headings so violet/cyan stays a 10% accent.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={cn("mb-14 max-w-2xl", className)}>
      <span className="eyebrow">
        {index && <span className="text-primary-light">{index}</span>}
        {eyebrow}
      </span>
      <h2 className="display mt-5 text-4xl font-semibold text-white md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-titanium">{description}</p>}
    </motion.div>
  );
}
