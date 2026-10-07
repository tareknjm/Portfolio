"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { SKILL_DIRECTORY, CATEGORY_ORDER } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const EXPO = "cubic-bezier(0.22,1,0.36,1)";
const ACCENT = "var(--hero-accent)";
const WIRE_LIT = "rgba(246,133,27,.55)";
const WIRE_T = 9; // secondes pour une traversée (doit rester synchro avec les délais)

const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";

// Optionnel : ajoute `projects: string[]` à tes skills pour alimenter l'inspecteur
type Skill = (typeof SKILL_DIRECTORY)[number] & { projects?: string[] };

// Sens d'une requête : client → api → testing → data → infra, puis les couches transverses
const FLOW = ["Frontend", "Backend", "Testing", "Données", "Donnees", "DevOps", "Langages", "Workflow"];
const TRANSVERSE = new Set(["Langages", "Testing", "Workflow"]);
const rank = (c: string) => {
  const i = FLOW.indexOf(c);
  return i === -1 ? 99 : i;
};

const LAYER_TAG: Record<string, string> = {
  Frontend: "client",
  Backend: "api",
  Testing: "test",
  Données: "data",
  Donnees: "data",
  DevOps: "infra",
  Langages: "lang",
  Workflow: "flow",
};

const LAYER_DESC: Record<string, string> = {
  Frontend: "Je construis des interfaces rapides, typées et accessibles.",
  Backend: "J'expose des API sécurisées, en architecture en couches.",
  Testing: "J'écris des tests automatisés pour garantir la fiabilité du code.",
  Données: "Je modélise, je stocke, j'interroge.",
  Donnees: "Je modélise, je stocke, j'interroge.",
  DevOps: "Je conteneurise, je sécurise, je déploie.",
  Langages: "Fondations et paradigmes de programmation.",
  Workflow: "Je travaille en méthode, avec les bons outils.",
};

const tagOf = (c: string) => LAYER_TAG[c] ?? c.toLowerCase();
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function Skills() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-10% 0px -10% 0px" });
  const [active, setActive] = useState<string | null>(null);

  const layers = useMemo(
    () => [...CATEGORY_ORDER].sort((a, b) => rank(a) - rank(b)) as string[],
    []
  );

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    layers.forEach((cat) => (grouped[cat] = []));
    (SKILL_DIRECTORY as Skill[]).forEach((s) => grouped[s.category]?.push(s));
    return grouped;
  }, [layers]);

  const activeSkill = useMemo(
    () => (SKILL_DIRECTORY as Skill[]).find((s) => s.name === active) ?? null,
    [active]
  );

  const n = layers.length;
  const activeIdx = activeSkill ? layers.indexOf(activeSkill.category) : -1;
  const activeTransverse = activeSkill ? TRANSVERSE.has(activeSkill.category) : false;
  const litFraction = activeIdx >= 0 && !activeTransverse ? (activeIdx + 1) / n : 0;

  // Pause hors écran et pendant l'inspection
  const running = inView && active === null;
  const playState: CSSProperties = { animationPlayState: running ? "running" : "paused" };

  const pathLabel =
    activeSkill && !activeTransverse
      ? layers
          .slice(0, activeIdx + 1)
          .filter((c) => !TRANSVERSE.has(c))
          .map(tagOf)
          .join(" → ")
      : null;

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-label="Compétences"
      className="relative border-t border-white/10"
      style={{ "--wire-t": `${WIRE_T}s` } as CSSProperties}
    >
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="03"
          label="Compétences"
          title="Ma stack en"
          accentWord="couches"
          aside="Du client à l'infra : ce que j'utilise, regroupé par couche du système."
        />

        {/* Légende du fil (xl uniquement, décorative) */}
        <p
          aria-hidden
          className="mb-5 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 xl:flex"
        >
          <span>chemin d&apos;une requête</span>
          <span className="h-px w-10 bg-white/25" />
          <span>▸</span>
        </p>

        <div className="relative">
          {/* Le fil : packet + segment allumé (xl) */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-px xl:block">
            <span
              className="absolute inset-0 origin-left transition-transform duration-500 motion-reduce:transition-none"
              style={{
                background: WIRE_LIT,
                transform: `scaleX(${litFraction})`,
                transitionTimingFunction: EXPO,
              }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ opacity: active ? 0 : 1, overflowX: "clip" }}
            >
              <span
                className="wire-packet absolute inset-0"
                style={{
                  ...playState,
                  background: "linear-gradient(to left, var(--hero-accent), transparent 140px)",
                }}
              >
                <span
                  className="absolute right-0 top-1/2 size-[5px] -translate-y-1/2"
                  style={{ background: ACCENT }}
                />
              </span>
            </div>
          </div>

          <ol
            className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(var(--cols),minmax(0,1fr))] xl:gap-x-0"
            style={{ "--cols": n } as CSSProperties}
          >
            {layers.map((category, index) => {
              const skills = skillsByCategory[category] ?? [];
              const tag = tagOf(category);
              const colActive = activeSkill?.category === category;

              return (
                <motion.li
                  key={category}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: EASE, delay: Math.min(index, 3) * 0.07 }}
                  className="group relative border-t border-white/10 pt-8 xl:pr-8"
                >
                  {/* nœud carré sur le fil */}
                  <span aria-hidden className="absolute -top-[4px] left-0 z-10 size-[7px]">
                    <span
                      className={cn(
                        "absolute inset-0 border transition-colors duration-300",
                        colActive
                          ? "border-transparent"
                          : "border-white/30 bg-background group-hover:border-white/70"
                      )}
                      style={colActive ? { background: ACCENT } : undefined}
                    />
                    <span
                      className="node-ping absolute inset-0 hidden border xl:block"
                      style={{
                        borderColor: ACCENT,
                        animationDelay: `calc(var(--wire-t) * ${(0.96 * index) / n})`,
                        ...playState,
                      }}
                    />
                  </span>

                  {/* En-tête de couche */}
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                    <p className="flex items-center gap-3">
                      <span style={{ color: ACCENT }}>{pad(index)}</span>
                      <span aria-hidden className="h-px w-6 bg-white/25" />
                      <span>{tag}</span>
                    </p>
                    <span className="text-white/45" aria-label={`${skills.length} outils`}>
                      ×{skills.length}
                    </span>
                  </div>

                  <h3
                    className="display mt-4 text-[clamp(1.6rem,2.4vw,2.2rem)] text-foreground"
                    style={{ fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}
                  >
                    {category}
                  </h3>
                  <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-titanium xl:min-h-[5.5rem]">
                    {LAYER_DESC[category]}
                  </p>

                  {/* Compétences : lignes mono */}
                  <ul className="mt-6 border-t border-white/[0.06]">
                    {skills.map((skill) => {
                      const isActive = active === skill.name;
                      const dim = active !== null && !isActive;
                      return (
                        <li key={skill.name}>
                          <button
                            type="button"
                            aria-describedby="skill-readout"
                            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(skill.name)}
                            onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                            onPointerDown={(e) =>
                              e.pointerType !== "mouse" &&
                              setActive((a) => (a === skill.name ? null : skill.name))
                            }
                            onFocus={() => setActive(skill.name)}
                            onBlur={() => setActive(null)}
                            className={cn(
                              "flex min-h-10 w-full items-center gap-3 border-b border-white/[0.06] py-2 text-left font-mono text-[12.5px] transition-[opacity,color,transform] duration-200 [@media(pointer:coarse)]:min-h-11",
                              isActive
                                ? "translate-x-1 text-foreground"
                                : "text-white/70 hover:text-white/90",
                              dim && "opacity-35",
                              ring
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "size-[5px] shrink-0 border transition-colors",
                                isActive ? "border-transparent" : "border-white/35"
                              )}
                              style={isActive ? { background: ACCENT } : undefined}
                            />
                            {skill.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.li>
              );
            })}
          </ol>
        </div>

        {/* L'inspecteur : ligne de terminal */}
        <div
          id="skill-readout"
          aria-live="polite"
          className="mt-12 flex min-h-[3.25rem] flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[12px]"
        >
          <span style={{ color: ACCENT }}>$</span>
          {activeSkill ? (
            <>
              <span className="text-foreground">inspect {slug(activeSkill.name)}</span>
              <span className="text-white/60">
                {pathLabel ? (
                  <>
                    path: <span className="text-foreground">{pathLabel}</span>
                  </>
                ) : (
                  <>
                    layer: <span className="text-foreground">{tagOf(activeSkill.category)}</span> · transverse
                  </>
                )}
              </span>
              {activeSkill.projects?.length ? (
                <span className="text-white/60">
                  utilisé dans:{" "}
                  <span className="text-foreground">{activeSkill.projects.join(", ")}</span>
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-white/60">
              <span className="hidden md:inline">survole</span>
              <span className="md:hidden">touche</span> une compétence pour tracer son chemin
            </span>
          )}
        </div>
      </div>
    </section>
  );
}