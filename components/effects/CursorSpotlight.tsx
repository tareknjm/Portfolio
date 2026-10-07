"use client";

import { useEffect } from "react";

/**
 * Zero-render cursor spotlight.
 * Sets --cx / --cy (viewport px) on <html> via direct DOM mutation.
 * All visual effects (glow, card spotlights) consume these vars in CSS.
 */
export default function CursorSpotlight() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    // Skip touch-only devices
    if (window.matchMedia("(hover: none)").matches) return;

    const root = document.documentElement;
    let rafId = 0;
    let cx = 0;
    let cy = 0;

    function onMove(e: MouseEvent) {
      cx = e.clientX;
      cy = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(flush);
      }
    }

    function flush() {
      root.style.setProperty("--cx", `${cx}px`);
      root.style.setProperty("--cy", `${cy}px`);
      rafId = 0;
    }

    function onLeave() {
      root.style.setProperty("--cursor-visible", "0");
    }
    function onEnter() {
      root.style.setProperty("--cursor-visible", "1");
    }

    root.style.setProperty("--cursor-visible", "1");
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null; // No DOM output — pure side-effect
}
