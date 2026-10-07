"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal, X, CornerDownLeft } from "lucide-react";
import { PROJECTS, EXPERIENCES, CERTIFICATES, PERSONAL_INFO } from "@/lib/data";
import { playTactileClick, playWaterBubble } from "@/lib/audio";

interface HeroTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
}

const COMMANDS = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "certs",
  "contact",
  "cv",
  "goto",
  "whoami",
  "sudo",
  "clear",
];
const CHIPS = ["about", "skills", "projects", "experience", "certs", "contact", "help"];

const accent = { color: "var(--hero-accent)" };

export default function HeroTerminalModal({ isOpen, onClose }: HeroTerminalModalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: "welcome",
      command: "init --guest",
      output: (
        <div className="space-y-1 text-white/80">
          <p className="font-bold" style={accent}>
            TN-KERNEL v2.6.0 · DDSI
          </p>
          <p className="text-white/60">Bienvenue sur le terminal de Tarek Najem.</p>
          <p className="text-[11px] text-white/40">
            Tape <span className="font-bold text-white">help</span>, clique une suggestion, ou essaie{" "}
            <span className="font-bold text-white">sudo hire tarek</span>.
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const cmdHistory = useRef<string[]>([]);
  const histIdx = useRef(0);

  /* Ouverture : focus, scroll lock, Échap, restitution du focus */
  useEffect(() => {
    if (!isOpen) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 80);
    playWaterBubble();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus.current?.focus?.();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;
    onClose();
    setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 250);
    return true;
  }, [onClose]);

  const handleCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    const [cmd, ...args] = lower.split(/\s+/);

    cmdHistory.current.push(raw);
    histIdx.current = cmdHistory.current.length;
    playTactileClick();

    let response: React.ReactNode = null;

    switch (cmd) {
      case "help":
        response = (
          <div className="space-y-1 text-white/70">
            <p className="mb-1 font-semibold" style={accent}>
              Commandes disponibles :
            </p>
            <div className="grid grid-cols-2 gap-1 font-mono text-[11px] sm:grid-cols-3">
              <div><span className="font-bold text-white">about</span> · profil</div>
              <div><span className="font-bold text-white">skills</span> · stack</div>
              <div><span className="font-bold text-white">projects</span> · projets</div>
              <div><span className="font-bold text-white">experience</span> · stages</div>
              <div><span className="font-bold text-white">certs</span> · certifs</div>
              <div><span className="font-bold text-white">contact</span> · coordonnées</div>
              <div><span className="font-bold text-white">goto</span> &lt;section&gt;</div>
              <div><span className="font-bold text-white">cv</span> · ouvrir le CV</div>
              <div><span className="font-bold text-white">clear</span> · effacer</div>
            </div>
            <p className="pt-1 text-[10px] text-white/35">↑ ↓ historique · Tab autocomplétion · Échap fermer</p>
          </div>
        );
        break;

      case "about":
        response = (
          <div className="space-y-1.5 text-white/80">
            <p className="font-bold text-white">
              {PERSONAL_INFO.name} — {PERSONAL_INFO.role}
            </p>
            <p className="text-xs text-white/70">{PERSONAL_INFO.brandTagline}</p>
            <p className="text-[11px] text-white/50">{PERSONAL_INFO.tagline}</p>
            <p className="text-[11px] text-emerald-400">
              📍 {PERSONAL_INFO.location} · {PERSONAL_INFO.availability}
            </p>
          </div>
        );
        break;

      case "skills":
        response = (
          <div className="space-y-1.5 text-xs text-white/80">
            <p className="font-semibold" style={accent}>
              Technologies maîtrisées :
            </p>
            <p><strong className="text-white/60">Backend :</strong> Java (21), Spring Boot, Spring Security, Django, ASP.NET MVC, REST API</p>
            <p><strong className="text-white/60">Frontend :</strong> React, Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit</p>
            <p><strong className="text-white/60">Data &amp; DevOps :</strong> PostgreSQL, MySQL, Docker, KrakenD, Keycloak, Git, OWASP ZAP</p>
          </div>
        );
        break;

      case "projects":
        response = (
          <div className="space-y-2 text-xs text-white/80">
            <p className="font-semibold" style={accent}>
              Projets phares :
            </p>
            {PROJECTS.map((p, i) => (
              <div key={p.id} className="border-l-2 pl-2" style={{ borderColor: "var(--hero-accent)" }}>
                <p className="font-bold text-white">
                  0{i + 1}. {p.title} — <span className="text-[11px] font-normal text-white/60">{p.subtitle}</span>
                </p>
                <p className="text-[11px] text-white/50">{p.technologies.join(" · ")}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "experience":
        response = (
          <div className="space-y-2 text-xs text-white/80">
            <p className="font-semibold" style={accent}>
              Parcours professionnel :
            </p>
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="border-l-2 border-white/30 pl-2">
                <p className="font-bold text-white">
                  {exp.company} — <span className="text-white/70">{exp.role}</span> ({exp.period})
                </p>
                <p className="line-clamp-1 text-[11px] text-white/50">{exp.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case "certs":
        response = (
          <div className="space-y-1 text-xs text-white/80">
            <p className="font-semibold" style={accent}>
              Certifications ({CERTIFICATES.length}) :
            </p>
            <div className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
              {CERTIFICATES.slice(0, 6).map((c, i) => (
                <div key={i} className="text-white/70">
                  ✓ {c.title} <span className="text-white/40">({c.org})</span>
                </div>
              ))}
            </div>
            {CERTIFICATES.length > 6 && (
              <p className="text-[10px] text-white/40">
                +{CERTIFICATES.length - 6} autres dans la section Certifications.
              </p>
            )}
          </div>
        );
        break;

      case "contact":
        response = (
          <div className="space-y-1 text-xs text-white/80">
            <p className="font-semibold" style={accent}>
              Coordonnées directes :
            </p>
            <p>
              Email :{" "}
              <a href={`mailto:${PERSONAL_INFO.email}`} className="text-white underline-offset-2 hover:underline">
                {PERSONAL_INFO.email}
              </a>
            </p>
            <p>
              LinkedIn :{" "}
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-white underline-offset-2 hover:underline">
                linkedin.com/in/tareknajem
              </a>
            </p>
            <p>
              GitHub :{" "}
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-white underline-offset-2 hover:underline">
                github.com/tareknjm
              </a>
            </p>
          </div>
        );
        break;

      case "cv":
        window.open(PERSONAL_INFO.cvUrl, "_blank", "noopener,noreferrer");
        response = <p className="text-xs text-emerald-400">Ouverture du CV…</p>;
        break;

      case "goto": {
        const target = args[0];
        if (target && scrollToSection(target)) {
          return;
        }
        response = (
          <p className="text-xs text-rose-400/90">
            Section introuvable{target ? ` : "${target}"` : ""}. Essaie : <b>goto projects</b>, <b>goto contact</b>.
          </p>
        );
        break;
      }

      case "whoami":
        response = <p className="text-xs text-white/70">guest — visiteur curieux, bienvenue 👋</p>;
        break;

      case "sudo":
        if (lower === "sudo hire tarek") {
          response = (
            <div className="space-y-1 text-xs">
              <p className="font-bold text-emerald-400">✔ Permission accordée.</p>
              <p className="text-white/60">Redirection vers le formulaire de contact…</p>
            </div>
          );
          setTimeout(() => scrollToSection("contact"), 1300);
        } else {
          response = <p className="text-xs text-rose-400/90">Permission refusée. (Indice : sudo hire tarek)</p>;
        }
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      default: {
        const guess = COMMANDS.find((c) => c.startsWith(cmd.slice(0, 2)));
        response = (
          <p className="text-xs text-rose-400/90">
            Commande inconnue : &quot;{cmd}&quot;.{" "}
            {guess ? (
              <>
                Tu voulais dire{" "}
                <button type="button" className="font-bold text-white underline" onClick={() => handleCommand(guess)}>
                  {guess}
                </button>{" "}
                ?
              </>
            ) : (
              <>
                Tape{" "}
                <button type="button" className="font-bold text-white underline" onClick={() => handleCommand("help")}>
                  help
                </button>
                .
              </>
            )}
          </p>
        );
      }
    }

    setHistory((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, command: raw, output: response }]);
    setInput("");
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHistory.current.length) return;
      histIdx.current = Math.max(0, histIdx.current - 1);
      setInput(cmdHistory.current[histIdx.current] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      histIdx.current = Math.min(cmdHistory.current.length, histIdx.current + 1);
      setInput(cmdHistory.current[histIdx.current] ?? "");
    } else if (e.key === "Tab") {
      const v = input.trim().toLowerCase();
      if (!v) return;
      const matches = COMMANDS.filter((c) => c.startsWith(v));
      if (matches.length === 1) {
        e.preventDefault();
        setInput(matches[0] + (matches[0] === "goto" || matches[0] === "sudo" ? " " : ""));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal interactif"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0d0c0b]/95 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
          >
            {/* En-tête */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer le terminal"
                    className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
                  />
                  <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-white/70">
                  <Terminal className="h-3.5 w-3.5" style={accent} />
                  <span>tarek@ddsi-core:~</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-lg p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-white/[0.06] px-4 py-2 font-mono text-[11px] text-white/50">
              <span className="mr-1 text-[9px] uppercase tracking-widest text-white/30">Exécuter</span>
              {CHIPS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleCommand(cmd)}
                  className="shrink-0 rounded border border-white/5 bg-white/5 px-2 py-0.5 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Corps */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 font-mono text-xs sm:p-5" aria-live="polite">
              {history.map((log) => (
                <div key={log.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span style={accent}>tarek@ddsi:~$</span>
                    <span className="font-semibold text-white">{log.command}</span>
                  </div>
                  <div className="pl-4">{log.output}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Saisie */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCommand(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-white/[0.02] px-4 py-3"
            >
              <span className="shrink-0 font-mono text-xs font-bold" style={accent}>
                tarek@ddsi:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Entrer une commande"
                placeholder="help, projects, goto contact…"
                className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                aria-label="Exécuter"
                className="shrink-0 rounded-lg border border-white/15 bg-white/5 p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}