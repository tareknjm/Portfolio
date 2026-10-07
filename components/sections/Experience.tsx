"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EXPERIENCES } from "@/lib/data";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const EXPO = "cubic-bezier(0.22,1,0.36,1)";
const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ACCENT = "var(--hero-accent)";
const WIRE_LIT = "rgba(246,133,27,.55)";
const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";
const pad = (i: number) => String(i + 1).padStart(2, "0");

/* Code-barres décoratif, déterministe (seed = nom de l'entreprise) */
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 30 }, (_, k) =>
    1 + ((seed.charCodeAt(k % seed.length) * (k + 7)) % 3)
  );
  return (
    <div aria-hidden className="flex h-8 items-stretch gap-[2px] opacity-80">
      {bars.map((w, k) => (
        <span key={k} className="bg-current" style={{ width: w }} />
      ))}
    </div>
  );
}

/* Le pass : outline sombre par défaut, crème + tampon quand il est courant */
function Pass({
  company,
  techs,
  index,
  current,
  ongoing,
}: {
  company: string;
  techs: string[];
  index: number;
  current: boolean;
  ongoing: boolean;
}) {
  const sub = current ? "text-[rgba(26,19,16,.6)]" : "text-white/60";
  const stampDelay = current ? ".28s" : "0s";

  return (
    <div
      className="relative transition-transform duration-500 motion-reduce:transition-none"
      style={{
        transform: `rotate(${current ? -1.4 : 0}deg)`,
        transitionTimingFunction: EXPO,
        transitionDelay: current ? ".12s" : "0s",
      }}
    >
      <div aria-hidden className="absolute inset-0 rounded-2xl border border-white/15" />
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-500 motion-reduce:transition-none",
          current ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "var(--hero-cream)",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,.75)",
          transitionDelay: current ? ".12s" : "0s",
        }}
      />

      <div
        className={cn(
          "relative p-6 transition-colors duration-500 motion-reduce:transition-none",
          current ? "text-[#1a1310]" : "text-foreground"
        )}
      >
        <div className={cn("flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.18em]", sub)}>
          <span>pass · {company}</span>
          <span style={{ color: ACCENT }}>N° {String(index + 1).padStart(4, "0")}</span>
        </div>

        <div
          aria-hidden
          className={cn(
            "relative my-5 border-t border-dashed transition-colors duration-500",
            current ? "border-[rgba(26,19,16,.25)]" : "border-white/15"
          )}
        >
          <span className="absolute -left-8 -top-2 size-4 rounded-full bg-background" />
          <span className="absolute -right-8 -top-2 size-4 rounded-full bg-background" />
        </div>

        <p className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", sub)}>stack</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
          {techs.map((t) => (
            <li
              key={t}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-500",
                current ? "border-[rgba(26,19,16,.6)] text-[#1a1310]" : "border-white/15 text-white/70"
              )}
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-end justify-between">
          <Barcode seed={company} />
          <span className={cn("font-mono text-[10px] uppercase tracking-[0.2em]", sub)}>
            {ongoing ? "en cours" : "terminé"}
          </span>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-5 rounded-md border-2 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] motion-reduce:transition-none"
          style={{
            color: ACCENT,
            borderColor: ACCENT,
            opacity: current ? 1 : 0,
            transform: `rotate(-11deg) scale(${current ? 1 : 1.5})`,
            transition: `opacity .3s ${EXPO} ${stampDelay}, transform .3s ${EXPO} ${stampDelay}`,
          }}
        >
          {ongoing ? "en cours" : "terminé"}
        </span>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const seen = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const n = EXPERIENCES.length;

  const select = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActiveIdx(next);
    if (focus) tabRefs.current[next]?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowRight: activeIdx + 1,
      ArrowLeft: activeIdx - 1,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  const totalAchievements = EXPERIENCES.reduce((sum, e) => sum + e.achievements.length, 0);

  return (
    <section id="experience" aria-label="Expériences" className="relative border-t border-white/10">
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="04"
          label="Expériences"
          title="Là où j'ai"
          accentWord="livré"
          aside={
            <>
              Trois environnements, une même exigence : livrer du logiciel solide.
              <span className="mt-3 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                {EXPERIENCES.length} passes · {totalAchievements} réalisations
              </span>
            </>
          }
        />

        <div ref={rootRef}>
          {/* Le fil à aiguillage : sélecteur */}
          <div
            role="tablist"
            aria-label="Expériences"
            onKeyDown={onKeyDown}
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

            {EXPERIENCES.map((exp, i) => {
              const active = i === activeIdx;
              const ongoing = exp.period.toLowerCase().includes("en cours");
              return (
                <button
                  key={exp.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`exp-tab-${exp.id}`}
                  aria-selected={active}
                  aria-controls={`exp-panel-${exp.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn("group relative block w-full min-w-0 pb-5 pr-4 pt-6 text-left", ring)}
                >
                  {/* segment de fil allumé : tout ce qui précède la sélection */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left transition-transform duration-500 motion-reduce:transition-none"
                    style={{
                      background: WIRE_LIT,
                      transform: `scaleX(${i < activeIdx ? 1 : 0})`,
                      transitionTimingFunction: EXPO,
                    }}
                  />
                  {/* nœud + packet */}
                  <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-[7px] -translate-y-1/2">
                    <span
                      className={cn(
                        "absolute inset-0 border bg-background transition-colors",
                        active ? "border-transparent" : "border-white/30 group-hover:border-white/70"
                      )}
                    />
                    {active && (
                      <motion.span
                        layoutId="exp-packet"
                        className="absolute inset-0"
                        style={{ background: ACCENT }}
                        transition={
                          reduce ? { duration: 0 } : { type: "tween", duration: 0.55, ease: EASE }
                        }
                      />
                    )}
                  </span>

                  <span
                    className={cn(
                      "flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em]",
                      ongoing ? "text-emerald-400" : active ? "text-foreground" : "text-white/60"
                    )}
                  >
                    {ongoing && <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-emerald-400" />}
                    <span className="truncate">{exp.period}</span>
                  </span>

                  <span
                    className={cn(
                      "display mt-2 block truncate text-[clamp(1.3rem,2.6vw,2.1rem)] transition-colors",
                      active ? "text-foreground" : "text-titanium group-hover:text-white/90"
                    )}
                    style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}
                  >
                    {exp.company}
                  </span>

                  <span className="mt-2 hidden truncate font-mono text-[10px] uppercase tracking-[0.16em] text-white/60 md:block">
                    {exp.role}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panneaux superposés : hauteur = le plus grand, donc aucun saut */}
          <div className="mt-12 grid">
            {EXPERIENCES.map((exp, i) => {
              const active = i === activeIdx;
              const ongoing = exp.period.toLowerCase().includes("en cours");
              const shift = i < activeIdx ? -16 : i > activeIdx ? 16 : 0;
              const next = EXPERIENCES[(i + 1) % n];

              return (
                <div
                  key={exp.id}
                  id={`exp-panel-${exp.id}`}
                  role="tabpanel"
                  aria-labelledby={`exp-tab-${exp.id}`}
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-500 motion-reduce:transition-none",
                    active ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                  )}
                  style={{
                    transform: reduce ? undefined : `translateX(${shift}px)`,
                    transitionDelay: active ? "120ms" : "0ms",
                    transitionTimingFunction: EXPO,
                  }}
                >
                  <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-x-14">
                    {/* Narration */}
                    <div>
                      <p className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                        <span style={{ color: ACCENT }}>{pad(i)}</span>
                        <span aria-hidden className="h-px w-6 shrink-0 bg-white/25" />
                        <span>{exp.role}</span>
                      </p>

                      <h3
                        className="display mt-4 text-[clamp(2.2rem,4.4vw,3.6rem)] text-foreground"
                        style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 }}
                      >
                        {exp.company}
                      </h3>

                      <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-titanium md:text-base">
                        {exp.description}
                      </p>

                      <p className="mt-8 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                        <span>réalisations</span>
                        <span aria-hidden className="h-px w-10 bg-white/15" />
                      </p>
                      <ul className="mt-4 max-w-[62ch] space-y-3">
                        {exp.achievements.map((ach, k) => (
                          <li key={k} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                            <span aria-hidden className="mt-[0.6em] size-[5px] shrink-0 border border-white/40" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Enchaîner sans remonter */}
                      <button
                        type="button"
                        onClick={() => select(i + 1, true)}
                        className={cn(
                          "group mt-10 inline-flex min-h-11 items-center gap-2 border-b border-white/25 pb-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white",
                          ring
                        )}
                      >
                        {i < n - 1 ? "suivant" : "revoir"} · {next.company}
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                          style={{ color: ACCENT }}
                        >
                          {i < n - 1 ? "→" : "↺"}
                        </span>
                      </button>
                    </div>

                    {/* Le pass */}
                    <aside aria-label={`Pass ${exp.company}`} className="mt-12 max-w-sm xl:mt-0 xl:max-w-none">
                      <Pass
                        company={exp.company}
                        techs={exp.technologies}
                        index={i}
                        current={active && seen}
                        ongoing={ongoing}
                      />
                    </aside>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}