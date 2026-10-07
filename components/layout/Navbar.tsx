"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { cn } from "@/lib/utils";
import MagneticWrap from "@/components/effects/MagneticWrap";
import SoundToggle from "@/components/layout/SoundToggle";
import HeroTerminalModal from "@/components/ui/HeroTerminalModal";
import { playTactileClick } from "@/lib/audio";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const EXPO = "cubic-bezier(0.22,1,0.36,1)";
const ACCENT = "var(--hero-accent)";
const WIRE_LIT = "rgba(246,133,27,.55)"; // accent brut (guide §3.1)
const CV_HREF = "/cv.pdf"; // ← adapte au chemin réel de ton CV

const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";
const pad = (i: number) => String(i + 1).padStart(2, "0");

function Availability() {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
      <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
      Disponible · Stage PFE 2026
    </span>
  );
}

export default function Navbar() {
  const reduce = useReducedMotion();
  const [activeSection, setActiveSection] = useState(NAV_LINKS[0]?.id ?? "home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const activeIdx = Math.max(0, NAV_LINKS.findIndex((l) => l.id === activeSection));

  // Se range en descendant, revient dès qu'on remonte.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 120) setHidden(false);
    else if (y > prev + 6) setHidden(true);
    else if (y < prev - 6) setHidden(false);
  });

  // Section active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    NAV_LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Menu mobile : Échap, scroll bloqué, focus rendu au déclencheur
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const btn = menuBtnRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
      btn?.focus();
    };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openTerminal = () => {
    playTactileClick();
    setMobileOpen(false);
    setTerminalOpen(true);
  };

  const packetTransition = reduce
    ? { duration: 0 }
    : { type: "tween" as const, duration: 0.55, ease: EASE };

  return (
    <>
      <motion.header
        initial={{ y: reduce ? 0 : -24, opacity: 0 }}
        animate={{ y: hidden && !mobileOpen ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 bg-[rgba(16,12,10,0.78)]"
      >
        {/* Le fil : pleine largeur, c'est la bordure basse de la barre */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <nav
          aria-label="Navigation principale"
          className="relative mx-auto flex h-14 max-w-[80rem] items-center gap-4 px-6"
        >
          {/* Gauche : logo + point de disponibilité */}
          <div className="flex shrink-0 items-center gap-1.5">
            <MagneticWrap strength={4} radius={40}>
              <button
                onClick={() => scrollTo(NAV_LINKS[0]?.id ?? "home")}
                aria-label="Retour en haut"
                className={cn(
                  "display rounded px-1 text-lg text-foreground transition-colors hover:text-primary-light",
                  ring
                )}
                style={{ fontWeight: 800, letterSpacing: "-0.04em" }}
              >
                TN<span style={{ color: ACCENT }}>.</span>
              </button>
            </MagneticWrap>
            <span
              title="Disponible · Stage PFE 2026"
              role="img"
              aria-label="Disponible, stage PFE 2026"
              className="size-1.5 rounded-full bg-emerald-400"
            />
          </div>

          {/* Centre : le fil et ses nœuds (desktop) */}
          <ol className="hidden h-full min-w-0 flex-1 items-stretch justify-center md:flex">
            {NAV_LINKS.map((link, i) => {
              const active = i === activeIdx;
              const lit = i < activeIdx ? 1 : active ? 0.5 : 0;
              return (
                <li key={link.id} className="group relative flex h-full">
                  {/* segment de fil allumé (transform only) */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 motion-reduce:transition-none"
                    style={{
                      background: WIRE_LIT,
                      transform: `scaleX(${lit})`,
                      transitionTimingFunction: EXPO,
                    }}
                  />
                  <button
                    onClick={() => {
                      playTactileClick();
                      scrollTo(link.id);
                    }}
                    aria-label={link.label}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex h-full items-center gap-1.5 whitespace-nowrap rounded px-2 lg:px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
                      active ? "text-foreground" : "text-white/60 hover:text-white/90",
                      ring
                    )}
                  >
                    <span
                      className={cn(!active && "inline lg:hidden xl:inline")}
                      style={{ color: active ? ACCENT : "rgba(255,255,255,.45)" }}
                    >
                      {pad(i)}
                    </span>
                    <span className={cn(!active && "hidden lg:inline")}>{link.label}</span>
                  </button>

                  {/* nœud carré posé sur le fil */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-1/2 size-[7px] -translate-x-1/2 translate-y-1/2"
                  >
                    <span
                      className={cn(
                        "absolute inset-0 border bg-background transition-colors",
                        active ? "border-transparent" : "border-white/30 group-hover:border-white/70"
                      )}
                    />
                    {active && (
                      <motion.span
                        layoutId="nav-packet"
                        className="absolute inset-0"
                        style={{ background: ACCENT }}
                        transition={packetTransition}
                      />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Droite : CV · terminal · son · burger */}
          <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
            <a
              href={CV_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group hidden items-center gap-1.5 border-b border-white/25 pb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white xl:inline-flex",
                ring
              )}
            >
              CV
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: ACCENT }}
              >
                ↗
              </span>
            </a>

            <button
              type="button"
              onClick={openTerminal}
              title="Ouvrir le terminal (/ ou ⌘K)"
              aria-label="Ouvrir le terminal"
              className={cn(
                "hidden items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[11px] text-white/70 transition-colors hover:border-white/25 hover:text-white md:flex",
                ring
              )}
            >
              <span style={{ color: ACCENT }}>$</span>
              <span className="hidden xl:inline">terminal</span>
              <kbd className="rounded border border-white/15 px-1.5 py-px text-[10px] text-white/60">⌘K</kbd>
            </button>

            <SoundToggle />

            <button
              ref={menuBtnRef}
              onClick={() => {
                playTactileClick();
                setMobileOpen((v) => !v);
              }}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={cn(
                "flex size-11 items-center justify-center rounded-full text-white/70 transition-colors hover:text-white md:hidden",
                ring
              )}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <HeroTerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      {/* Mobile : le même fil, à la verticale */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-8 pt-24 md:hidden"
          >
            <ol className="my-auto ml-2 border-l border-white/10">
              {NAV_LINKS.map((link, i) => {
                const active = i === activeIdx;
                return (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: reduce ? 0 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
                    className="relative"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 border",
                        active ? "border-transparent" : "border-white/30 bg-background"
                      )}
                      style={active ? { background: ACCENT } : undefined}
                    />
                    <button
                      onClick={() => scrollTo(link.id)}
                      aria-current={active ? "true" : undefined}
                      className={cn("flex min-h-11 w-full items-baseline gap-4 py-2.5 pl-6 text-left", ring)}
                    >
                      <span
                        className="font-mono text-[11px] tracking-[0.22em]"
                        style={{ color: active ? ACCENT : "rgba(255,255,255,.45)" }}
                      >
                        {pad(i)}
                      </span>
                      <span
                        className={cn("display text-[2rem]", active ? "text-foreground" : "text-white/60")}
                        style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95 }}
                      >
                        {link.label}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-5">
              <button
                onClick={openTerminal}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-xs text-white/70",
                  ring
                )}
              >
                <span style={{ color: ACCENT }}>$</span> ouvrir le terminal
              </button>
              <Availability />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}