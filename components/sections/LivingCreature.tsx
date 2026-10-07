"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivingCreatureProps {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  domain: string;
  speciesName: string;
  icon: LucideIcon;
  colorType: "pink" | "primary" | "cyan";
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const VIS = {
  pink: {
    core: "from-pink-500/90 via-rose-600/75 to-fuchsia-950/90",
    glow: "rgba(244,114,182,0.5)",
    ring: "border-pink-400/50",
    text: "text-pink-300",
    badge: "bg-pink-500/15 border-pink-400/40 text-pink-200",
    stroke: "#f472b6",
    strokeLight: "#fda4af",
    halo: "shadow-[0_0_50px_rgba(244,114,182,0.6)]",
  },
  primary: {
    core: "from-violet-500/90 via-indigo-600/75 to-purple-950/90",
    glow: "rgba(167,139,250,0.5)",
    ring: "border-violet-400/50",
    text: "text-violet-300",
    badge: "bg-violet-500/15 border-violet-400/40 text-violet-200",
    stroke: "#a78bfa",
    strokeLight: "#c4b5fd",
    halo: "shadow-[0_0_50px_rgba(139,92,246,0.6)]",
  },
  cyan: {
    core: "from-cyan-400/90 via-teal-600/75 to-blue-950/90",
    glow: "rgba(34,211,238,0.5)",
    ring: "border-cyan-400/50",
    text: "text-cyan-300",
    badge: "bg-cyan-500/15 border-cyan-400/40 text-cyan-200",
    stroke: "#22d3ee",
    strokeLight: "#67e8f9",
    halo: "shadow-[0_0_50px_rgba(34,211,238,0.6)]",
  },
};

// 5 streamlined tentacles (defined once, outside the component)
const TENTACLES = [
  { paths: ["M 22 0 C 14 18, 4 34, 14 56", "M 22 0 C 4 22, 22 38, 8 56", "M 22 0 C 14 18, 4 34, 14 56"], w: 1.6, dur: 3.8 },
  { paths: ["M 36 0 C 30 20, 42 38, 32 58", "M 36 0 C 44 18, 26 42, 38 58", "M 36 0 C 30 20, 42 38, 32 58"], w: 2.0, dur: 4.4 },
  { paths: ["M 50 0 C 56 22, 44 40, 52 62", "M 50 0 C 42 18, 58 44, 46 62", "M 50 0 C 56 22, 44 40, 52 62"], w: 2.4, dur: 4.0 },
  { paths: ["M 64 0 C 70 20, 58 38, 68 58", "M 64 0 C 56 18, 74 42, 62 58", "M 64 0 C 70 20, 58 38, 68 58"], w: 2.0, dur: 4.6 },
  { paths: ["M 78 0 C 86 18, 96 34, 86 56", "M 78 0 C 96 22, 78 38, 92 56", "M 78 0 C 86 18, 96 34, 86 56"], w: 1.6, dur: 3.9 },
];

export default function LivingCreature({
  index,
  title,
  subtitle,
  domain,
  speciesName,
  icon: Icon,
  colorType,
  isActive,
  onClick,
  className = "",
}: LivingCreatureProps) {
  const v = VIS[colorType] || VIS.primary;
  const floatDelay = index * 0.9;
  const floatDur = 4.8 + index * 0.6;

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center cursor-pointer select-none group transition-opacity duration-300",
        isActive ? "opacity-100 z-20" : "opacity-75 hover:opacity-100 z-10",
        className
      )}
      onClick={onClick}
      style={{ willChange: "transform, opacity" }}
    >
      {/* ── Fluid Swimming Swell Motion ──────────────────────────────── */}
      <motion.div
        animate={{
          y: [0, -14, 0],
          rotate: [-1.5, 1.5, -1.5],
          scale: isActive ? [1.06, 1.09, 1.06] : [0.96, 0.99, 0.96],
        }}
        transition={{
          duration: floatDur,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        className="relative flex flex-col items-center"
      >
        {/* Concentric Breathing Pulse Rings */}
        <div className="absolute inset-0 -m-8 pointer-events-none flex items-center justify-center">
          <motion.div
            animate={{
              scale: [0.9, 1.4, 1.8],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: index * 0.7,
            }}
            className={cn("w-28 h-28 rounded-full border border-dashed", v.ring)}
          />
        </div>

        {/* Active Aura Halo Lock */}
        {isActive && (
          <motion.div
            layoutId="creature-active-halo"
            className={cn(
              "absolute -inset-3.5 rounded-full border border-white/50 pointer-events-none",
              v.halo
            )}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          />
        )}

        {/* Creature Core Body */}
        <div
          className={cn(
            "relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2px] transition-transform duration-300",
            isActive ? "scale-105" : "group-hover:scale-103"
          )}
          style={{
            boxShadow: isActive
              ? `0 0 45px ${v.glow}, inset 0 0 15px rgba(255,255,255,0.4)`
              : `0 0 20px ${v.glow}`,
          }}
        >
          {/* Living Membrane */}
          <div
            className={cn(
              "w-full h-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br backdrop-blur-md border border-white/30 relative overflow-hidden",
              v.core
            )}
          >
            {/* Shimmer Light Highlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)] pointer-events-none" />

            {/* Icon */}
            <Icon className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] relative z-10" />

            {/* Spec Tag */}
            <span className="font-mono text-[8px] font-bold tracking-widest text-white/95 mt-1 uppercase relative z-10">
              0{index + 1} · LIVE
            </span>
          </div>
        </div>

        {/* 5 Undulating Tentacles (native SVG animation, SSR-safe) */}
        <div className="w-20 h-12 -mt-2 relative pointer-events-none overflow-visible">
          <svg viewBox="0 0 100 62" fill="none" className="w-full h-full overflow-visible opacity-90">
            {TENTACLES.map((ten, ti) => (
              <path
                key={ti}
                d={ten.paths[0]}
                stroke={ti % 2 === 0 ? v.stroke : v.strokeLight}
                strokeWidth={ten.w}
                strokeLinecap="round"
              >
                <animate
                  attributeName="d"
                  values={ten.paths.join(";")}
                  dur={`${ten.dur}s`}
                  begin={`${(index * 0.2 + ti * 0.1).toFixed(2)}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0;0.5;1"
                  keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
                />
              </path>
            ))}

            {/* Phosphorescent Light Tips */}
            {[22, 36, 50, 64, 78].map((tx, ti) => (
              <circle
                key={ti}
                cx={tx}
                cy={58}
                r={ti === 2 ? 2.5 : 1.8}
                fill="#ffffff"
                className="opacity-90"
              />
            ))}
          </svg>
        </div>

        {/* Holographic Identity Badge */}
        <div className="mt-2 text-center max-w-[180px]">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase border backdrop-blur-md transition-all",
              v.badge,
              isActive && "ring-1 ring-white/40"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                colorType === "pink"
                  ? "bg-pink-400"
                  : colorType === "cyan"
                  ? "bg-cyan-400"
                  : "bg-violet-400",
                "animate-pulse"
              )}
            />
            {domain}
          </div>

          <h4
            className={cn(
              "mt-1.5 text-sm sm:text-base font-bold tracking-wide transition-colors",
              isActive ? v.text : "text-white group-hover:text-white"
            )}
          >
            {title}
          </h4>

          <p className="text-[10px] font-mono text-titanium/80 line-clamp-1 mt-0.5">
            {speciesName}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}