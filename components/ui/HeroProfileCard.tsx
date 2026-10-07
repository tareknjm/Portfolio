"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  photoSrc?: string;
  className?: string;
};

const STACK = ["Java · Spring", "React · Next.js", "Docker", "Keycloak"];

const INK = "#1a1310";

export default function HeroProfileCard({ photoSrc = "/profile.jpg", className = "" }: Props) {
  const [photoOk, setPhotoOk] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    rect.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !rect.current) return;
    const r = rect.current;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--rx", `${(0.5 - py) * 9}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 11}deg`);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    ["--rx", "--ry", "--gx", "--gy"].forEach((p) => el.style.removeProperty(p));
  };

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "group relative w-full max-w-[21rem] select-none rounded-[20px] transition-transform duration-200 ease-out",
        className
      )}
      style={{
        color: INK,
        background: "var(--hero-cream)",
        transform: "perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) rotate(-1.6deg)",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.75), 0 2px 0 rgba(255,255,255,0.5) inset",
        willChange: "transform",
      }}
    >
      {/* Reflet qui suit la souris */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at var(--gx,30%) var(--gy,0%), rgba(255,255,255,0.6), transparent 55%)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* En-tête */}
      <div className="flex items-center justify-between px-5 pt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em]">
        <span>Pass · DDSI</span>
        <span style={{ color: "var(--hero-accent)" }}>N° 0026</span>
      </div>

      {/* Perforation */}
      <div className="relative my-3">
        <div className="border-t-2 border-dashed" style={{ borderColor: "rgba(21,19,15,0.25)" }} />
        <span
          aria-hidden
          className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full"
          style={{ background: "var(--background, #0b0a09)" }}
        />
        <span
          aria-hidden
          className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full"
          style={{ background: "var(--background, #0b0a09)" }}
        />
      </div>

      {/* Identité */}
      <div className="flex gap-4 px-5 pb-4">
        <div
          className="relative h-[110px] w-[88px] shrink-0 overflow-hidden rounded-md"
          style={{ background: "#d9d1c1", boxShadow: "0 0 0 2px rgba(21,19,15,0.9)" }}
        >
          {photoOk ? (
            <Image
              src={photoSrc}
              alt="Tarek Najem"
              width={88}
              height={110}
              priority
              onError={() => setPhotoOk(false)}
              className="h-full w-full object-cover grayscale contrast-125"
            />
          ) : (
            <span className="display flex h-full w-full items-center justify-center text-2xl font-extrabold tracking-[0.15em]">
              TN
            </span>
          )}
          {/* Duotone orange */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply"
            style={{ background: "var(--hero-accent)", opacity: 0.32 }}
          />
          {/* Trame demi-teinte */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(21,19,15,0.9) 0.8px, transparent 1px)",
              backgroundSize: "4px 4px",
            }}
          />
        </div>

        <div className="min-w-0 pt-0.5">
<p
  className="display text-[1.65rem] tracking-tight"
  style={{ fontWeight: 800, lineHeight: 0.95 }}
>
  Tarek<br />Najem
</p>
          <p className="mt-2 font-mono text-[10px] font-bold uppercase leading-snug tracking-[0.12em]">
            Élève ingénieur
            <br />
            <span className="opacity-60">EMSI Rabat</span>
          </p>
        </div>
      </div>

      {/* Stack */}
      <ul className="flex flex-wrap gap-1.5 px-5 pb-4">
        {STACK.map((s) => (
          <li
            key={s}
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
            style={{ borderColor: "rgba(21,19,15,0.6)" }}
          >
            {s}
          </li>
        ))}
      </ul>

      {/* Pied : code-barres */}
      <div className="flex items-end justify-between border-t-2 border-dashed px-5 pb-4 pt-3" style={{ borderColor: "rgba(21,19,15,0.25)" }}>
        <div
          aria-hidden
          className="h-8 w-32"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #15130f 0 2px, transparent 2px 4px, #15130f 4px 5px, transparent 5px 8px, #15130f 8px 11px, transparent 11px 13px)",
          }}
        />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">Rabat · MA</span>
      </div>

      {/* Tampon */}
      <div
        aria-label="Disponible pour un stage PFE 2026"
        className="absolute right-3 top-[44%] rotate-[-11deg] rounded-md border-2 border-dashed px-2.5 py-1 text-center font-mono text-[10px] font-extrabold uppercase leading-tight tracking-[0.16em]"
        style={{ color: "var(--hero-accent)", borderColor: "var(--hero-accent)", background: "rgba(245,237,226,0.85)" }}
      >
        Dispo
        <br />
        PFE 2026
      </div>
    </div>
  );
}