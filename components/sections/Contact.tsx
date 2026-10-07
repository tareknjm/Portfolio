"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticWrap from "@/components/effects/MagneticWrap";
import { PERSONAL_INFO } from "@/lib/data";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import { ArrowUpRight, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 07 — Contact · "Canal ouvert"
 *
 * Gauche : disponibilité (émeraude), email en grand + copie, lignes `clé: valeur`
 *          façon terminal, chip `sudo hire tarek` qui amorce le message.
 * Droite : le formulaire est un terminal `$ send --to tarek`. Au-dessus, une wire
 *          à 3 nœuds (vous → formulaire → boîte de réception) : un packet boucle
 *          pendant l'envoi, la wire s'allume en émeraude au succès, nœud rose en erreur.
 *
 * Une seule animation continue : le packet, uniquement pendant l'envoi.
 * Les labels sont visibles (mono) — plus de sr-only.
 */

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const initialState: ContactFormState = { success: false, message: "" };

const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";

const field =
  "w-full border-0 border-b border-white/10 bg-transparent px-0 py-2.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-white/45 focus:border-[var(--hero-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)] disabled:opacity-60";

const label = "block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60";

export default function Contact() {
  const reduce = !!useReducedMotion();
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);
  const [sudo, setSudo] = useState(false);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setCount(0);
    }
  }, [state.success]);

  const email = PERSONAL_INFO.email as string;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const sudoHire = () => {
    const el = messageRef.current;
    if (!el) return;
    if (!el.value.trim()) {
      el.value = "Bonjour Tarek, j'aimerais échanger avec vous au sujet de ";
      setCount(el.value.length);
    }
    setSudo(true);
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  };

  const failed = !state.success && !!state.message && !isPending;
  const sent = state.success && !isPending;

  const rows: [string, string, string | null][] = [
    ["github", String(PERSONAL_INFO.github ?? "").replace(/^https?:\/\//, ""), PERSONAL_INFO.github as string],
    ["linkedin", String(PERSONAL_INFO.linkedin ?? "").replace(/^https?:\/\/(www\.)?/, ""), PERSONAL_INFO.linkedin as string],
    ["lieu", String(PERSONAL_INFO.location ?? ""), null],
  ];

  return (
    <section id="contact" className="border-t border-white/10">
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="08"
          label="Contact"
          title="Ouvrons un"
          accentWord="canal"
          aside={<>Une idée, un projet, une opportunité : écrivez-moi directement.</>}
        />

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {/* ───── Gauche ───── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col gap-10"
          >
            <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Disponible · Stage PFE 2026
            </p>

            {/* email en grand + copie */}
            <div>
              <p className={cn(label, "mb-3")}>
                <span style={{ color: "var(--hero-accent)" }}>$</span> écrire à
              </p>
              <a
                href={`mailto:${email}`}
                className={`display block break-all text-[clamp(1.35rem,3.2vw,2.3rem)] text-foreground transition-colors hover:text-[var(--hero-accent)] ${ring}`}
                style={{ fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.05 }}
              >
                {email}
              </a>
              <button
                type="button"
                onClick={copy}
                aria-live="polite"
                className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-[12px] transition-colors hover:border-white/25 ${ring}`}
                style={{ color: copied ? undefined : "rgba(245,237,226,.8)" }}
              >
                <span className={copied ? "text-emerald-400" : ""}>
                  {copied ? "Copié" : "copier l'adresse"}
                </span>
              </button>
            </div>

            {/* lignes clé: valeur */}
            <dl className="font-mono text-[12.5px]">
              {rows.map(([k, v, href]) => (
                <div key={k} className="grid grid-cols-[88px_1fr] items-center gap-3 border-b border-white/[0.06] py-3">
                  <dt className={label}>{k}</dt>
                  <dd className="min-w-0">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group inline-flex max-w-full items-center gap-1.5 text-foreground [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:items-center ${ring}`}
                      >
                        <span className="truncate border-b border-white/25 transition-colors group-hover:border-[var(--hero-accent)]">{v}</span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-3.5 shrink-0 text-[var(--hero-accent)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    ) : (
                      <span className="text-foreground">{v}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {/* chip easter egg */}
            <div>
              <button
                type="button"
                onClick={sudoHire}
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 font-mono text-[12px] text-white/80 transition-colors hover:border-white/25 ${ring}`}
              >
                <span style={{ color: "var(--hero-accent)" }}>$</span> sudo hire tarek
              </button>
              <p aria-live="polite" className="mt-3 min-h-[1.25rem] font-mono text-[11px] text-white/60">
                {sudo && (
                  <>
                    <span style={{ color: "var(--hero-accent)" }}>›</span> accès accordé · il ne reste qu'à écrire le détail
                  </>
                )}
              </p>
            </div>
          </motion.div>

          {/* ───── Droite : terminal d'envoi ───── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
          >
            <form
              ref={formRef}
              action={formAction}
              className="spot-card rounded-2xl border border-white/10 bg-surface p-6 transition-colors hover:border-white/25 sm:p-8"
              onPointerMove={(e) => {
                if (e.pointerType !== "mouse") return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              {/* wire d'envoi */}
              <div aria-hidden className="relative mb-7">
                <div className="relative h-px w-full overflow-x-clip bg-white/15">
                  {/* segment allumé */}
                  <span
                    className="absolute inset-0 origin-left motion-reduce:transition-none"
                    style={{
                      background: sent ? "rgb(52,211,153)" : "rgba(246,133,27,.55)",
                      transform: `scaleX(${sent ? 1 : isPending ? 0.5 : 0})`,
                      transition: "transform .6s cubic-bezier(0.21,0.47,0.32,0.98)",
                    }}
                  />
                  {/* packet en boucle, seulement pendant l'envoi */}
                  {isPending && !reduce && (
                    <span className="wire-packet absolute inset-0" style={{ ["--wire-t" as string]: "1.4s" }}>
                      <span
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to right, transparent, rgba(246,133,27,.9))" }}
                      />
                      <span className="absolute right-0 top-1/2 size-[5px] -translate-y-1/2 bg-[var(--hero-accent)]" />
                    </span>
                  )}
                </div>
                {[
                  { left: "0%", t: "vous", tone: "idle" },
                  { left: "50%", t: "formulaire", tone: failed ? "bad" : "idle" },
                  { left: "100%", t: "boîte de réception", tone: sent ? "ok" : "idle" },
                ].map((n, i) => (
                  <div key={n.t} className="absolute top-0" style={{ left: n.left }}>
                    <span
                      className={cn(
                        "absolute left-0 top-0 size-[7px] -translate-x-1/2 -translate-y-1/2 border transition-colors duration-500",
                        n.tone === "ok" && "border-emerald-400 bg-emerald-400",
                        n.tone === "bad" && "border-rose-400 bg-rose-400",
                        n.tone === "idle" &&
                          (isPending || sent
                            ? "border-[var(--hero-accent)] bg-[var(--hero-accent)]"
                            : "border-white/30 bg-background")
                      )}
                    />
                    <span
                      className={cn(
                        "absolute top-3 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-white/60",
                        i === 0 && "left-0",
                        i === 1 && "left-0 -translate-x-1/2",
                        i === 2 && "right-0"
                      )}
                    >
                      {n.t}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mb-6 mt-10 font-mono text-[12px] text-white/60">
                <span style={{ color: "var(--hero-accent)" }}>$</span> send --to tarek
              </p>

              {/* honeypot */}
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className={label}>nom</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    autoComplete="name"
                    required
                    disabled={isPending}
                    aria-invalid={!!state.errors?.name}
                    aria-describedby={state.errors?.name ? "err-name" : undefined}
                    className={cn(field, state.errors?.name && "border-rose-400/60")}
                  />
                  {state.errors?.name && (
                    <p id="err-name" className="mt-1.5 font-mono text-[11px] text-rose-400">
                      › {state.errors.name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className={label}>email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="vous@exemple.com"
                    autoComplete="email"
                    required
                    disabled={isPending}
                    aria-invalid={!!state.errors?.email}
                    aria-describedby={state.errors?.email ? "err-email" : undefined}
                    className={cn(field, state.errors?.email && "border-rose-400/60")}
                  />
                  {state.errors?.email && (
                    <p id="err-email" className="mt-1.5 font-mono text-[11px] text-rose-400">
                      › {state.errors.email[0]}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor="message" className={label}>message</label>
                    <span aria-hidden className="font-mono text-[10px] text-white/45">{count} car.</span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    ref={messageRef}
                    placeholder="Votre message…"
                    rows={5}
                    required
                    disabled={isPending}
                    onInput={(e) => setCount(e.currentTarget.value.length)}
                    aria-invalid={!!state.errors?.message}
                    aria-describedby={state.errors?.message ? "err-message" : undefined}
                    className={cn(field, "resize-none", state.errors?.message && "border-rose-400/60")}
                  />
                  {state.errors?.message && (
                    <p id="err-message" className="mt-1.5 font-mono text-[11px] text-rose-400">
                      › {state.errors.message[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                <p
                  aria-live="polite"
                  className={cn(
                    "min-h-[1.25rem] font-mono text-[12px]",
                    sent ? "text-emerald-400" : failed ? "text-rose-400" : "text-white/60"
                  )}
                >
                  {isPending ? (
                    <>› transmission…</>
                  ) : state.message ? (
                    <>› {state.message}</>
                  ) : null}
                </p>

                <MagneticWrap strength={20} radius={60}>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 ${ring}`}
                    style={{ background: "var(--hero-cream)", color: "var(--hero-ink)" }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="size-4" />
                      </>
                    )}
                  </button>
                </MagneticWrap>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}