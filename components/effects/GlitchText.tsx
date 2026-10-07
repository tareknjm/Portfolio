"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: string;
  as?: "h2" | "h3" | "span";
  className?: string;
}

/**
 * Glitch text effect on viewport enter.
 * Uses data-text attribute + CSS pseudo-elements for RGB split.
 * Triggers once via IntersectionObserver, then removes itself.
 */
export default function GlitchText({
  children,
  as: Tag = "h2",
  className,
}: GlitchTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("glitch-active");
          // Remove glitch class after animation completes
          const timer = setTimeout(() => {
            el.classList.remove("glitch-active");
          }, 600);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      data-text={children}
      className={cn("glitch-text", className)}
    >
      {children}
    </Tag>
  );
}
