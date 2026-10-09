"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText, Mail } from "lucide-react";
import HeroProfileCard from "@/components/ui/HeroProfileCard";
import HeroTerminalModal from "@/components/ui/HeroTerminalModal";
import HeroTerminalBadge from "@/components/ui/HeroTerminalBadge";
import MagneticWrap from "@/components/effects/MagneticWrap";
import { PERSONAL_INFO } from "@/lib/data";
import { fadeUp, stagger } from "@/components/motion/variants";
import { playTactileClick } from "@/lib/audio";

const HeroSystemCanvas = dynamic(() => import("@/components/effects/HeroSystemCanvas"), {
  ssr: false,
});

const PHRASES = [
  "des API sécurisées",
  "des architectures distribuées",
  "des plateformes cloud",
  "des interfaces qui respirent",
];

const TICKER = [
  "Java 21",
  "Spring Boot",
  "Spring Security",
  "Keycloak",
  "KrakenD",
  "Docker",
  "PostgreSQL",
  "Elasticsearch",
  "Next.js",
  "TypeScript",
  "OWASP ZAP",
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/* ───────── Phrase rotative (largeur fixe, pas de layout shift) ───────── */
function RotatingPhrase({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) setI((v) => (v + 1) % PHRASES.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative block h-[1.25em] overflow-hidden" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "45%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-45%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="block font-serif italic"
          style={{ color: "var(--hero-accent)" }}
        >
          {PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ───────── Heure de Rabat (montée côté client → pas d'erreur d'hydratation) ───────── */
function RabatClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">Rabat {time || "--:--"}</span>;
}

/* ───────── Nom : plein + contour, avec calque "révélé" sous le spot ───────── */
function NameLines({ reveal = false, reduced = false }: { reveal?: boolean; reduced?: boolean }) {
  const line = "block overflow-hidden py-[0.03em]";
  const outline: CSSProperties = reveal
    ? {}
    : { color: "transparent", WebkitTextStroke: "1.5px rgba(245,237,226,0.8)" };

  const Inner = ({ children, delay }: { children: string; delay: number }) =>
    reveal ? (
      <span className="block">{children}</span>
    ) : (
      <motion.span
        className="block"
        initial={reduced ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    );

  return (
    <>
      <span className={line}>
        <Inner delay={0.05}>TAREK</Inner>
      </span>
      <span className={line} style={outline}>
        <Inner delay={0.18}>NAJEM</Inner>
      </span>
    </>
  );
}

const SPOT = "radial-gradient(circle 150px at var(--mx,-400px) var(--my,50%), #000 0%, rgba(0,0,0,0) 100%)";

export default function Hero() {
  const reduced = !!useReducedMotion();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const nameRect = useRef<DOMRect | null>(null);
  const interacted = useRef(false);

  /* Parallaxe Apple-like : le texte s'efface, la carte monte plus vite */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);

  /* Raccourcis : "/" ou Ctrl/⌘+K → terminal */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setTerminalOpen((o) => !o);
        return;
      }
      if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key === "/") {
        e.preventDefault();
        setTerminalOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Balayage d'intro du spot, puis la main passe au curseur */
  useEffect(() => {
    const el = nameRef.current;
    if (!el || reduced) return;
    let raf = 0;
    const start = performance.now() + 1000;
    const dur = 1700;
    const w = el.offsetWidth;
    const h = el.offsetHeight;

    const tick = (now: number) => {
      if (interacted.current) return;
      const p = (now - start) / dur;
      if (p < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (p > 1) {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
        return;
      }
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      el.style.setProperty("--mx", `${-100 + (w + 200) * e}px`);
      el.style.setProperty("--my", `${h * (0.35 + 0.3 * Math.sin(p * Math.PI))}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const onNameEnter = (e: React.PointerEvent<HTMLHeadingElement>) => {
    if (e.pointerType !== "mouse") return;
    interacted.current = true;
    nameRect.current = e.currentTarget.getBoundingClientRect();
  };
  const onNameMove = (e: React.PointerEvent<HTMLHeadingElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = nameRect.current ?? e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const onNameLeave = (e: React.PointerEvent<HTMLHeadingElement>) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  };

  const ticker = [...TICKER, ...TICKER];

  return (
    <section
  id="home"
  ref={sectionRef}
  className="section-container relative isolate flex min-h-[100svh] items-center overflow-hidden"
  style={{ paddingTop: "clamp(7rem, 13vh, 8.5rem)", paddingBottom: "6.5rem" }}
>
      {/* ── Fond : points + schéma vivant + grain ───────────────────────── */}
      <div
        aria-hidden
        className="hero-dots pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          maskImage: "radial-gradient(ellipse 80% 70% at 65% 45%, #000 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 65% 45%, #000 20%, transparent 75%)",
        }}
      />
      <HeroSystemCanvas className="-z-10 opacity-40 lg:opacity-100" />
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 lg:bg-[linear-gradient(90deg,var(--background)_26%,rgba(16,12,10,0.55)_48%,transparent_72%)]"
      />

      <div className="relative z-10 grid w-full grid-cols-1 items-end gap-12 lg:grid-cols-12 lg:gap-8">
        {/* ───────── Colonne gauche ───────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{ y: textY, opacity: textOpacity }}
          className="flex flex-col items-start lg:col-span-7"
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/60 sm:text-[11px]"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                style={{ background: "var(--hero-accent)" }}
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--hero-accent)" }} />
            </span>
            <span>Portfolio 2026</span>
            <span aria-hidden className="h-px w-8 bg-white/25" />
            <span>EMSI Rabat · DDSI</span>
          </motion.div>

          {/* Nom monumental avec spot révélateur */}
          <h1
            ref={nameRef}
            onPointerEnter={onNameEnter}
            onPointerMove={onNameMove}
            onPointerLeave={onNameLeave}
            className="display pointer-events-auto relative mt-6 cursor-default select-none text-[clamp(3.6rem,12.5vw,10.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]"
            style={{
              color: "var(--hero-cream)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
            }}
          >
            <NameLines reduced={reduced} />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 block"
              style={{ color: "var(--hero-accent)", maskImage: SPOT, WebkitMaskImage: SPOT }}
            >
              <NameLines reveal />
            </span>
          </h1>

          {/* Phrase d'accroche */}
          <motion.div variants={fadeUp} className="mt-7 text-2xl leading-tight text-white/90 sm:text-4xl">
            <span className="block font-medium">Je construis</span>
            <RotatingPhrase reduced={reduced} />
          </motion.div>

<motion.p variants={fadeUp} className="mt-5 max-w-md text-sm leading-relaxed text-titanium sm:text-base">            Élève ingénieur en Développement Digital &amp; Systèmes d&apos;Information. Architectures distribuées,
            plateformes cloud sécurisées et solutions numériques intelligentes.
          </motion.p>

          {/* Actions */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <MagneticWrap strength={16} radius={80}>
              <Link
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  playTactileClick();
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 hover:brightness-110"
                style={{ background: "var(--hero-cream)", color: "var(--hero-ink)" }}
              >
                <span>Voir les projets</span>
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </Link>
            </MagneticWrap>

            <Link
              href={PERSONAL_INFO.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTactileClick()}
              className="group inline-flex items-center gap-2 border-b border-white/25 pb-0.5 text-sm font-medium text-white/85 transition-colors hover:border-white hover:text-white"
            >
              <FileText className="h-4 w-4" style={{ color: "var(--hero-accent)" }} />
              <span>Mon CV</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="#contact"
              onClick={() => playTactileClick()}
              className="group inline-flex items-center gap-2 border-b border-white/25 pb-0.5 text-sm font-medium text-white/85 transition-colors hover:border-white hover:text-white"
            >
              <Mail className="h-4 w-4" style={{ color: "var(--hero-accent)" }} />
              <span>Me contacter</span>
            </Link>
          </motion.div>

          {/* Entrée terminal */}
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                setTerminalOpen(true);
              }}
              className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-xs text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
              aria-label="Ouvrir le terminal interactif"
            >
              <span style={{ color: "var(--hero-accent)" }} aria-hidden>
                ›
              </span>
              <span>ouvrir le terminal</span>
              <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/50 group-hover:text-white/80">
                /
              </kbd>
            </button>
            <HeroTerminalBadge value="npx tareknajem" onCopy={() => playTactileClick()} />
          </motion.div>
        </motion.div>

        {/* ───────── Colonne droite : badge ───────── */}
        <motion.div
          style={{ y: cardY }}
          className="flex pb-2 lg:col-span-5 lg:justify-end lg:self-end"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease: EASE }}
            className="w-full lg:flex lg:justify-end"
          >
            <HeroProfileCard />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bandeau bas : heure + ticker de stack + raccourci ───────────── */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-6 border-t border-white/10 bg-[rgba(16,12,10,0.6)] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 lg:px-16">
        <span className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          <RabatClock />
        </span>

        <div
          className="hero-marquee min-w-0 flex-1 overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
            WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          }}
        >
          <div className="hero-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
            {ticker.map((item, i) => (
              <span key={i} className="flex items-center gap-8">
                <span>{item}</span>
                <span aria-hidden style={{ color: "var(--hero-accent)" }}>
                  /
                </span>
              </span>
            ))}
          </div>
        </div>

        <span className="hidden shrink-0 items-center gap-2 md:flex">
          <kbd className="rounded border border-white/15 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          <span>terminal</span>
        </span>
      </div>

      <HeroTerminalModal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </section>
  );
}