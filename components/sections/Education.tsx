"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { EDUCATION } from "@/lib/data";

/**
 * 06 — Formation · "Le trace"
 *
 * Une wire verticale traverse le parcours. Un packet descend avec le scroll
 * (ligne de référence à 65 % du viewport, règle 10 de la DA). Chaque étape
 * "s'allume" quand le packet la croise : nœud plein accent, texte qui passe
 * de 45 % à 100 %. L'étape en cours reçoit une pastille émeraude + un ping.
 *
 * Aucun contenu inventé : tout sort de EDUCATION.
 * Sans JS/IO ou en reduced-motion : tout est allumé, pas de packet.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

type Edu = {
  title: string;
  subtitle?: string;
  institution?: string;
  description?: string;
  period: string;
};

/* Nœud "atteint" : même ligne de référence que le packet (65 %) */
function useReached<T extends HTMLElement>(disabled: boolean) {
  const ref = useRef<T>(null);
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setReached(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const top = entry.rootBounds?.top ?? 0;
        // atteint = hors de la zone (sous la ligne) ET passé au-dessus de la ligne
        setReached(!entry.isIntersecting && entry.boundingClientRect.bottom <= top + 1);
      },
      { rootMargin: "-65% 0px 0px 0px", threshold: [0, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [disabled]);

  return [ref, disabled ? true : reached] as const;
}

function Row({ edu, index, reduce }: { edu: Edu; index: number; reduce: boolean }) {
  const [nodeRef, reached] = useReached<HTMLSpanElement>(reduce);

  const current = edu.period.toLowerCase().includes("en cours");

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative grid grid-cols-[28px_1fr] gap-x-4 pb-14 last:pb-0 md:grid-cols-[150px_28px_1fr] md:gap-x-6"
    >
      {/* période (colonne gauche sur desktop) */}
      <div className="hidden pt-[0.55rem] md:block">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-500"
          style={{ color: reached ? "var(--hero-accent)" : "rgba(245,237,226,.6)" }}
        >
          {edu.period}
        </p>
        {current && (
          <p className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            en cours
          </p>
        )}
      </div>

      {/* nœud sur la wire */}
      <div className="relative">
        <span
          ref={nodeRef}
          aria-hidden
          className="absolute left-1/2 top-[0.95rem] size-[7px] -translate-x-1/2 border transition-colors duration-500"
          style={{
            borderColor: reached ? "var(--hero-accent)" : "rgba(245,237,226,.3)",
            background: reached ? "var(--hero-accent)" : "var(--background)",
          }}
        />
        {current && reached && !reduce && (
          <span
            aria-hidden
            className="node-ping absolute left-1/2 top-[0.95rem] size-[7px] -translate-x-1/2 border border-[var(--hero-accent)]"
            style={{ ["--wire-t" as string]: "2.4s", animationDelay: "0s" }}
          />
        )}
      </div>

      {/* contenu */}
      <div
        className="min-w-0 transition-opacity duration-500"
        style={{ opacity: reached ? 1 : 0.45 }}
      >
        <p className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 md:hidden">
          <span style={{ color: reached ? "var(--hero-accent)" : undefined }}>{edu.period}</span>
          {current && <span className="text-emerald-400">· en cours</span>}
        </p>

        <h3
          className="display text-[clamp(1.4rem,3vw,2.4rem)] text-balance"
          style={{ fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.02 }}
        >
          {edu.title}
        </h3>

        {edu.subtitle && (
          <p className="mt-3 text-[15px] text-foreground">{edu.subtitle}</p>
        )}
        {edu.institution && (
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            <span style={{ color: "var(--hero-accent)" }}>↳</span> {edu.institution}
          </p>
        )}
        {edu.description && (
          <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.7] text-titanium">{edu.description}</p>
        )}
        <span className="sr-only">{`Étape ${index + 1}`}</span>
      </div>
    </motion.li>
  );
}

export default function Education() {
  const items = EDUCATION as Edu[];
  const reduce = !!useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 65%"],
  });
  const packetY = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);

  if (items.length === 0) return null;

  const ongoing = items.filter((e) => e.period.toLowerCase().includes("en cours")).length;

  return (
    <section id="education" className="border-t border-white/10">
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="07"
          label="Formation"
          title="Là où j'ai"
          accentWord="appris"
          aside={
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              {items.length} {items.length > 1 ? "étapes" : "étape"}
              {ongoing > 0 && ` · ${ongoing} en cours`}
            </span>
          }
        />

        <div className="relative">
          {/* wire verticale + packet scroll-linked (aria-hidden) */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[14px] top-0 w-px overflow-y-clip bg-white/15 md:left-[188px]"
          >
            {!reduce && (
              <motion.div
                className="absolute inset-0"
                style={{
                  y: packetY,
                  background:
                    "linear-gradient(to bottom, rgba(246,133,27,0) 0%, rgba(246,133,27,.55) 100%)",
                }}
              >
                <span className="absolute bottom-0 left-1/2 size-[5px] -translate-x-1/2 bg-[var(--hero-accent)]" />
              </motion.div>
            )}
          </div>

          <ol ref={listRef} className="relative">
            {items.map((edu, i) => (
              <Row key={edu.title} edu={edu} index={i} reduce={reduce} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}