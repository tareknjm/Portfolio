"use client";

import { useRef, type ReactNode, type MouseEvent, type ElementType } from "react";
import { cn } from "@/lib/utils";

export default function SpotlightCard({
  children,
  className,
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as "div"; 

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseMove={handleMove}
      className={cn("spotlight-card", className)}
    >
      {children}
    </Tag>
  );
}