/**
 * Stand-in 2D (sans dépendance) du fond 3D : sol isométrique + puce.
 * Affiché si WebGL est indisponible, en reduced-motion, ou sous le breakpoint lg.
 */
export default function HeroChipFallback() {
  const fade = "linear-gradient(to bottom, transparent 0%, black 25%, black 85%, transparent 100%)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Sol isométrique */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
        <div className="isometric-grid absolute inset-0" />
      </div>

      {/* Puce */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-24 sm:items-center sm:pb-0 lg:justify-end lg:pr-[10%] lg:pt-48"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="relative opacity-70 lg:opacity-100" style={{ perspective: "900px" }}>
          <div
            className="absolute -inset-12 -z-10 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(124,58,237,0.32), rgba(34,211,238,0.10) 55%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[125%] w-[125%] rounded-full border border-violet-500/40"
            style={{ transform: "translate(-50%, -50%) rotateX(72deg)" }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[145%] w-[145%] rounded-full border border-cyan-400/25"
            style={{ transform: "translate(-50%, -50%) rotateX(72deg) rotateZ(35deg)" }}
          />

          <div
            className="hairline chrome-sheen relative h-40 w-40 rounded-[28px] sm:h-52 sm:w-52"
            style={{
              transform: "rotateX(52deg) rotateZ(-42deg)",
              background: "linear-gradient(145deg, #1c1c2a 0%, #0b0b12 55%, #12121d 100%)",
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="absolute inset-5 rounded-[18px] opacity-70"
              style={{
                backgroundImage: "radial-gradient(rgba(199,210,254,0.55) 1.1px, transparent 1.2px)",
                backgroundSize: "16px 16px",
                maskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
              }}
            />
            <span
              className="absolute left-3 top-3 h-2 w-2 rounded-full bg-cyan-400"
              style={{ boxShadow: "0 0 12px 2px rgba(34,211,238,0.8)" }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="chrome-text text-3xl font-bold tracking-[0.3em]">TN</span>
              <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.35em] text-white/40">
                DDSI · Core
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}