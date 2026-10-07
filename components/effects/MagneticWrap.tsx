"use client";

import { useRef, useCallback, type ReactNode, type MouseEvent } from "react";

interface MagneticWrapProps {
  children: ReactNode;
  /** Max pull distance in px (default 10) */
  strength?: number;
  /** Activation radius in px (default 120) */
  radius?: number;
  className?: string;
  as?: "div" | "span";
}

/**
 * Wraps any element with magnetic cursor-pull physics.
 * Uses direct DOM transforms — zero React re-renders on mousemove.
 */
export default function MagneticWrap({
  children,
  strength = 10,
  radius = 120,
  className,
  as: Tag = "div",
}: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const el = ref.current;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = 1 - dist / radius; // 1 at center, 0 at edge
        const tx = dx * pull * (strength / radius) * 2;
        const ty = dy * pull * (strength / radius) * 2;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    },
    [strength, radius]
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </Tag>
  );
}
