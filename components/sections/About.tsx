"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const ACCENT = "var(--hero-accent)";

const WHOAMI = [
  { k: "location", v: "Rabat, Maroc" },
  { k: "school", v: "EMSI Rabat — Ingénierie" },
  { k: "experience", v: "3 stages full-stack" },
  { k: "focus", v: "web moderne & sécurisé" },
];

// Variants : une seule cascade, déclenchée une fois au scroll
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const terminal = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, staggerChildren: 0.07, delayChildren: 0.15 },
  },
};
const line = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" aria-label="À propos" className="relative border-t border-white/10">
      {/* Texture : dot grid qui s'efface (décoratif) */}
      <div
        aria-hidden
        className="hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-2/3 lg:block"
      />

      <motion.div
        className="section-container relative"
        style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}
        variants={stagger}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={rise}>
          <SectionHeader index="02" label="À propos" title="Derrière le" accentWord="code" />
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
          {/* Portrait : pièce de plan, décalée vers le bas */}
          <motion.figure
            variants={rise}
            className="relative mx-auto w-64 sm:w-72 lg:mx-0 lg:mt-12 lg:w-full"
          >
            <div className="relative">
              {/* repères de coupe */}
              <span aria-hidden className="absolute -left-2 -top-2 size-3 border-l border-t border-white/40" />
              <span aria-hidden className="absolute -right-2 -top-2 size-3 border-r border-t border-white/40" />
              <span aria-hidden className="absolute -bottom-2 -left-2 size-3 border-b border-l border-white/40" />
              <span aria-hidden className="absolute -bottom-2 -right-2 size-3 border-b border-r border-white/40" />
              {/* nœud signal */}
              <span
                aria-hidden
                className="absolute -right-[3px] top-1/2 z-10 size-[7px] -translate-y-1/2"
                style={{ background: ACCENT }}
              />

              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-surface">
                <Image
                  src="/profile.jpg"
                  alt="Tarek Najem"
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 256px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </div>

            <figcaption className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
              <span>fig. 01</span>
              <span>tarek.najem</span>
            </figcaption>
          </motion.figure>

          {/* Texte éditorial + whoami */}
          <div>
            <motion.h3
              variants={rise}
              className="display max-w-[30ch] text-balance text-[clamp(1.7rem,3.2vw,2.6rem)] text-foreground"
              style={{ fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Je conçois des applications web full-stack,{" "}
              <span className="text-titanium">de la modélisation des données à l&apos;interface.</span>
            </motion.h3>

            <motion.p
              variants={rise}
              className="mt-6 max-w-[52ch] text-pretty text-[15px] leading-[1.7] text-titanium md:text-base"
            >
              Trois stages, des architectures propres, des API sécurisées, et le souci du détail qui
              fait qu&apos;un produit <span className="font-medium text-foreground">semble vivant.</span>
            </motion.p>

            <motion.div
              variants={terminal}
              className="mt-12 max-w-xl rounded-2xl border border-white/10 bg-surface p-6"
            >
              <motion.p variants={line} className="mb-5 font-mono text-[13px] text-white/60">
                <span style={{ color: ACCENT }}>$</span> whoami
              </motion.p>

              <dl className="space-y-3.5">
                {WHOAMI.map(({ k, v }) => (
                  <motion.div
                    key={k}
                    variants={line}
                    className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[8rem_1fr]"
                  >
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">{k}</dt>
                    <dd className="font-mono text-[13px] text-foreground">{v}</dd>
                  </motion.div>
                ))}

                <motion.div
                  variants={line}
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[8rem_1fr]"
                >
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">status</dt>
                  <dd className="flex items-center gap-2 font-mono text-[13px] text-emerald-400">
                    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    disponible · stage PFE 2026
                  </dd>
                </motion.div>
              </dl>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}