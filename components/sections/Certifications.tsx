"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type PanInfo } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { CERTIFICATES } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

/**
 * 06 — Certifications · "Passes au scanner"
 *
 * Concept : un wallet de passes. On feuillette la pile (glisser, taper, ← →),
 * chaque pass passe sous un scanner (laser accent) : il passe d'outline à crème,
 * reçoit son tampon, puis un terminal lit ses champs et une chaîne de confiance
 * (émetteur → certification → titulaire) s'anime avec des packets.
 *
 * Respect de la DA :
 *  - 1 seul pass crème à la fois (le scanné) ; les autres restent outline.
 *  - 1 seule animation continue : les packets de la chaîne (pause hors écran).
 *  - Tout est faisable sans geste : tablist (← → Home End), boutons, liens réels.
 *  - Aucun contenu inventé : champs et diagramme sortent de CERTIFICATES.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";

type Cert = { title: string; org: string; date: string; url?: string };

/* ───────── utilitaires ───────── */

function seeded(str: string, count: number) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    out.push(1 + (Math.abs(h) % 4));
  }
  return out;
}

function hostOf(url?: string) {
  if (!url) return "—";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "—";
  }
}

const pad = (i: number) => `N° ${String(i + 1).padStart(4, "0")}`;

/* ───────── un pass de la pile ───────── */

function StackPass({
  cert,
  i,
  d,
  scanned,
  scanKey,
  reduce,
  onSwipe,
}: {
  cert: Cert;
  i: number;
  d: number; // offset par rapport au pass actif
  scanned: boolean;
  scanKey: number;
  reduce: boolean;
  onSwipe: (dir: 1 | -1) => void;
}) {
  const isTop = d === 0;
  const gone = d < 0;
  const hidden = d > 2;
  const bars = useMemo(() => seeded(cert.title + cert.org, 34), [cert.title, cert.org]);
  const cream = isTop && scanned;

  const onEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -500) onSwipe(1);
    else if (info.offset.x > 90 || info.velocity.x > 500) onSwipe(-1);
  };

  return (
    <motion.div
      aria-hidden={!isTop}
      className="col-start-1 row-start-1 will-change-transform"
      style={{ zIndex: 10 - Math.abs(d), pointerEvents: isTop ? "auto" : "none", touchAction: "pan-y" }}
      initial={false}
      animate={{
        x: gone ? "-115%" : 0,
        y: gone ? -10 : Math.min(d, 3) * 15,
        rotate: gone ? -9 : isTop ? -1.2 : -1.2 + d * 0.9,
        scale: gone ? 0.96 : 1 - Math.min(d, 3) * 0.045,
        opacity: gone || hidden ? 0 : 1 - d * 0.28,
      }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
      drag={isTop && !reduce ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.22}
      dragSnapToOrigin
      onDragEnd={onEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      <div
        className="relative min-h-[340px] overflow-hidden rounded-2xl border p-6 sm:min-h-[380px]"
        style={{
          color: cream ? "#1a1310" : "var(--hero-cream)",
          borderColor: cream ? "transparent" : "rgba(245,237,226,.15)",
          background: "var(--surface)",
          boxShadow: isTop ? "0 30px 60px -20px rgba(0,0,0,.75)" : "0 14px 30px -18px rgba(0,0,0,.8)",
          transition: "color .4s cubic-bezier(0.22,1,0.36,1), border-color .4s",
          cursor: isTop ? "grab" : "default",
        }}
      >
        {/* papier crème (fade d'un calque) */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "var(--hero-cream)",
            opacity: cream ? 1 : 0,
            transition: "opacity .45s cubic-bezier(0.22,1,0.36,1)",
          }}
        />

        {/* laser de scan : calque pleine hauteur, bord bas = ligne (translateY seul) */}
        {isTop && !reduce && (
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-y-clip">
            <motion.span
              key={scanKey}
              className="absolute inset-0"
              initial={{ y: "-100%" }}
              animate={{ y: ["-100%", "0%", "0%"], opacity: [1, 1, 0] }}
              transition={{ duration: 1.1, delay: 0.4, ease: "linear", times: [0, 0.78, 1] }}
              style={{
                background:
                  "linear-gradient(to bottom, transparent 55%, rgba(246,133,27,.0) 70%, rgba(246,133,27,.22) 97%, rgba(246,133,27,.95) 100%)",
                borderBottom: "1px solid rgba(246,133,27,.95)",
              }}
            />
          </span>
        )}

        <div className="relative flex h-full min-h-[290px] flex-col sm:min-h-[330px]">
          <div className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
            <span>pass de validation</span>
            <span>{pad(i)}</span>
          </div>

          <h3
            className="display mt-6 text-[clamp(1.6rem,3.2vw,2.5rem)] text-balance"
            style={{ fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1 }}
          >
            {cert.title}
          </h3>
          <p className="mt-3 text-[15px] opacity-75">
            <span className="opacity-70">Délivrée par </span>
            <span className="font-semibold">{cert.org}</span>
          </p>

          <div className="mt-auto pt-6">
            {/* perforation + encoches (couplées à p-6) */}
            <div className="relative mb-5">
              <div className="border-t border-dashed opacity-30" style={{ borderColor: "currentColor" }} />
              <span aria-hidden className="absolute -left-8 top-1/2 size-5 -translate-y-1/2 rounded-full bg-background" />
              <span aria-hidden className="absolute -right-8 top-1/2 size-5 -translate-y-1/2 rounded-full bg-background" />
            </div>

            <div className="flex flex-wrap items-end justify-between gap-5">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[12px]">
                <dt className="self-center text-[10px] uppercase tracking-[0.18em] opacity-60">date</dt>
                <dd>{cert.date}</dd>
                <dt className="self-center text-[10px] uppercase tracking-[0.18em] opacity-60">statut</dt>
                <dd>obtenue</dd>
              </dl>
              <div aria-hidden className="flex h-9 items-stretch gap-[2px]">
                {bars.map((w, k) => (
                  <span
                    key={k}
                    style={{ width: w, background: "currentColor", opacity: k % 5 === 0 ? 0.5 : 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* tampon : atterrit après le scan */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-24 right-0 select-none rounded-md border-2 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
            style={{
              color: "var(--hero-accent)",
              borderColor: "var(--hero-accent)",
              opacity: cream ? 0.92 : 0,
              transform: cream ? "rotate(-11deg) scale(1)" : "rotate(-11deg) scale(1.55)",
              transition: reduce
                ? "none"
                : `transform .32s cubic-bezier(0.22,1,0.36,1) ${cream ? ".28s" : "0s"}, opacity .18s linear ${cream ? ".28s" : "0s"}`,
            }}
          >
            lu · ok
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────── chaîne de confiance : émetteur → certification → titulaire ───────── */

function TrustChain({ cert, visible, reduce }: { cert: Cert; visible: boolean; reduce: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof svg.pauseAnimations !== "function") return;
    if (visible) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [visible, cert.title]);

  const nodes = [
    { x: 14, tag: "émetteur", label: cert.org },
    { x: 50, tag: "certification", label: cert.title },
    { x: 86, tag: "titulaire", label: "Tarek Najem" },
  ];

  return (
    <div aria-hidden className="relative h-[132px]">
      <svg
        ref={svgRef}
        key={cert.title}
        viewBox="0 0 600 132"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <line x1="84" y1="66" x2="300" y2="66" stroke="rgba(245,237,226,.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <line x1="300" y1="66" x2="516" y2="66" stroke="rgba(245,237,226,.18)" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="4 4" />
        {!reduce && (
          <>
            {[0, 1.6].map((b) => (
              <circle key={`a${b}`} r="3" fill="#f6851b">
                <animateMotion dur="3.2s" begin={`${b}s`} repeatCount="indefinite" path="M84,66 L300,66" />
              </circle>
            ))}
            {[0.8, 2.4].map((b) => (
              <circle key={`b${b}`} r="3" fill="#f6851b">
                <animateMotion dur="3.2s" begin={`${b}s`} repeatCount="indefinite" path="M300,66 L516,66" />
              </circle>
            ))}
          </>
        )}
      </svg>

      {nodes.map((n, k) => (
        <div
          key={n.tag}
          className="absolute top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%` }}
        >
          <span
            className={`absolute left-1/2 top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 border ${
              k === 1 ? "border-[var(--hero-accent)] bg-[var(--hero-accent)]" : "border-white/30 bg-background"
            }`}
          />
          <span className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
            {n.tag}
          </span>
          <span className="absolute left-1/2 top-3 w-full -translate-x-1/2 text-center text-[12px] leading-tight text-foreground line-clamp-2">
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ───────── section ───────── */

export default function Certifications() {
  const certs = CERTIFICATES as Cert[];
  const n = certs.length;
  const reduce = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const visible = useInView(rootRef, { margin: "-80px" });

  const [active, setActive] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [scanKey, setScanKey] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number, focus = false) => {
    if (n === 0) return;
    const k = ((i % n) + n) % n;
    setActive(k);
    if (focus) tabs.current[k]?.focus({ preventScroll: true });
  };

  /* scan à chaque nouveau pass (et quand la section entre à l'écran) */
  useEffect(() => {
    if (!visible) return;
    setScanned(false);
    if (reduce) {
      setScanned(true);
      return;
    }
    setScanKey((k) => k + 1);
    const t = setTimeout(() => setScanned(true), 1050);
    return () => clearTimeout(t);
  }, [active, visible, reduce]);

  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, number | undefined> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: n - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    go(next, true);
  };

  if (n === 0) return null;

  const cur = certs[active];
  const withProof = certs.filter((c) => c.url).length;

  const lines: [string, string][] = [
    ["émetteur", cur.org],
    ["intitulé", cur.title],
    ["date", cur.date],
    ["preuve", hostOf(cur.url)],
  ];

  return (
    <section id="certifications" className="border-t border-white/10">
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="06"
          label="Certifications"
          title="Des passes"
          accentWord="vérifiables"
          aside={
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              {n} {n > 1 ? "passes" : "pass"} · {withProof} {withProof > 1 ? "preuves" : "preuve"} en ligne
            </span>
          }
        />

        <motion.div
          ref={rootRef}
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
        >
          {/* ───── Gauche : pile + wire ───── */}
          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
              <span style={{ color: "var(--hero-accent)" }}>›</span> glisse le pass, ou choisis un nœud
            </p>

            {/* pile (hauteur réservée pour les passes qui dépassent derrière) */}
            <div className="grid pb-12 pr-1">
              {certs.map((c, i) => (
                <StackPass
                  key={c.title}
                  cert={c}
                  i={i}
                  d={i - active}
                  scanned={scanned}
                  scanKey={scanKey}
                  reduce={reduce}
                  onSwipe={(dir) => go(active + dir)}
                />
              ))}
            </div>

            {/* wire horizontale = tablist (6.7 / 6.9) */}
            <div role="tablist" aria-label="Certifications" onKeyDown={onKey} className="relative mt-2 flex">
              <span aria-hidden className="absolute left-0 right-0 top-[3px] h-px bg-white/15" />
              {certs.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.title}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`cert-tab-${i}`}
                    aria-selected={isActive}
                    aria-label={`${pad(i)} · ${c.title}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => go(i)}
                    className={`relative min-w-0 flex-1 pt-5 pr-3 text-left [@media(pointer:coarse)]:min-h-11 ${ring}`}
                  >
                    {/* segment allumé jusqu'au nœud actif */}
                    {i < n - 1 && (
                      <span aria-hidden className="absolute left-0 top-[3px] h-px w-full overflow-x-clip">
                        <span
                          className="block h-px w-full origin-left bg-[rgba(246,133,27,.55)] motion-reduce:transition-none"
                          style={{
                            transform: `scaleX(${i < active ? 1 : 0})`,
                            transition: "transform .45s cubic-bezier(0.21,0.47,0.32,0.98)",
                          }}
                        />
                      </span>
                    )}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 size-[7px] border ${
                        i < active ? "border-[var(--hero-accent)] bg-[var(--hero-accent)]" : "border-white/30 bg-background"
                      }`}
                    />
                    {isActive && (
                      <motion.span
                        aria-hidden
                        layoutId="cert-packet"
                        transition={{ type: "tween", duration: reduce ? 0 : 0.55, ease: EASE }}
                        className="absolute left-0 top-0 size-[7px] bg-[var(--hero-accent)]"
                      />
                    )}
                    <span
                      className="block font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: isActive ? "var(--hero-accent)" : "rgba(245,237,226,.6)" }}
                    >
                      {pad(i)}
                    </span>
                    <span
                      className="mt-1 hidden truncate text-[12.5px] transition-opacity sm:block"
                      style={{ opacity: isActive ? 1 : 0.5 }}
                    >
                      {c.org}
                    </span>
                  </button>
                );
              })}
              {/* emplacement libre : vrai état, rien d'inventé */}
              <div aria-hidden className="relative hidden flex-1 pt-5 sm:block">
                <span className="absolute left-0 top-0 size-[7px] border border-dashed border-white/30 bg-background" />
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">à venir</span>
              </div>
            </div>
          </div>

          {/* ───── Droite : lecture terminal + chaîne + CTA ───── */}
          <div className="flex flex-col gap-6 lg:pt-9">
            {/* terminal readout */}
            <div
              role="tabpanel"
              aria-labelledby={`cert-tab-${active}`}
              aria-live="polite"
              className="min-h-[188px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 font-mono text-[12.5px]"
            >
              <p className="text-white/60">
                <span style={{ color: "var(--hero-accent)" }}>$</span> scan {pad(active)}
                <span
                  aria-hidden
                  className="ml-1 inline-block h-[1em] w-[0.5ch] translate-y-[2px]"
                  style={{
                    background: "var(--hero-accent)",
                    opacity: scanned ? 0 : 1,
                    transition: "opacity .2s",
                  }}
                />
              </p>
              <dl className="mt-3 grid grid-cols-[84px_1fr] gap-x-3 gap-y-1.5">
                {lines.map(([k, v], i) => (
                  <div
                    key={`${active}-${k}`}
                    className="contents"
                    style={{
                      opacity: scanned ? 1 : 0,
                      transform: scanned ? "none" : "translateY(4px)",
                      transition: reduce ? "none" : `opacity .3s ${i * 70}ms, transform .3s ${i * 70}ms`,
                    }}
                  >
                    <dt className="text-[10.5px] uppercase tracking-[0.18em] text-white/60 self-center">{k}</dt>
                    <dd className="truncate text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <p
                className="mt-3 text-white/60"
                style={{
                  opacity: scanned ? 1 : 0,
                  transition: reduce ? "none" : "opacity .3s .32s",
                }}
              >
                <span style={{ color: "var(--hero-accent)" }}>›</span>{" "}
                {cur.url ? "preuve disponible en ligne" : "aucune preuve en ligne liée"}
              </p>
            </div>

            {/* chaîne de confiance */}
            <div>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">chaîne de confiance</p>
              <TrustChain cert={cur} visible={visible} reduce={reduce} />
            </div>

            {/* CTA : un seul primaire */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {cur.url ? (
                <a
                  href={cur.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition hover:brightness-110 ${ring}`}
                  style={{ background: "var(--hero-cream)", color: "var(--hero-ink)" }}
                >
                  Ouvrir la preuve
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <span />
              )}
              {n > 1 && (
                <button
                  type="button"
                  onClick={() => go(active + 1, true)}
                  className={`min-h-11 border-b border-white/25 font-mono text-[11px] uppercase tracking-[0.18em] text-titanium transition-colors hover:text-foreground ${ring}`}
                >
                  {active === n - 1 ? `revoir · ${certs[0].title} ↺` : `suivant · ${certs[active + 1].title} →`}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}