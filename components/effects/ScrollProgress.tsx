/**
 * CSS-only scroll progress bar.
 * Uses `animation-timeline: scroll()` — zero JavaScript.
 * Falls back to invisible on browsers without support.
 */
export default function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        background: "linear-gradient(90deg, var(--primary), var(--accent))",
        transform: "scaleX(0)",
        animation: "scroll-progress linear forwards",
        animationTimeline: "scroll()",
      } as React.CSSProperties}
    />
  );
}
