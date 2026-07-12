import { useState, useRef, useEffect } from "react";
import { askAgent } from "../../lib/agentApi";

const WELCOME = [
  "Bienvenue sur le terminal du portfolio de Tarek Najem.",
  "Tape 'help' pour voir les commandes disponibles.",
];

const HELP_TEXT = [
  "Commandes disponibles :",
  "  whoami                 → qui je suis",
  "  ls projects            → liste des projets",
  "  ask \"ta question\"     → pose une question à l'agent IA",
  "  clear                  → efface le terminal",
];

function Terminal({ onClose }) {
  const [lines, setLines] = useState(function () {
    return WELCOME.map(function (t) { return { type: "system", text: t }; });
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(function () {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, loading]);

  useEffect(function () {
    inputRef.current?.focus();
  }, []);

  function pushLine(type, text) {
    setLines(function (prev) { return [...prev, { type, text }]; });
  }

  async function handleCommand(raw) {
  const cmd = raw.trim();
  pushLine("input", cmd);
  if (cmd === "") return;

  // Normalise pour la comparaison : minuscules + espaces multiples réduits à un seul
  const normalized = cmd.toLowerCase().replace(/\s+/g, " ").trim();
  // Version sans aucun espace, pour tolérer "lsprojects", "whoami", etc.
  const compact = cmd.toLowerCase().replace(/\s+/g, "");

  if (normalized === "clear" || compact === "clear") { setLines([]); return; }
  if (normalized === "help" || compact === "help") { HELP_TEXT.forEach(function (l) { pushLine("output", l); }); return; }
  if (normalized === "whoami" || compact === "whoami") { pushLine("output", "tarek-najem — Développeur Full Stack — EMSI Rabat"); return; }
  if (
    normalized === "ls projects" ||
    normalized === "ls projects/" ||
    compact === "lsprojects" ||
    compact === "lsprojects/"
  ) {
    pushLine("output", "e-learn.project   emsi-marks.project   easyhotel.project");
    return;
  }

  // "ask" tolère : espace(s), aucun espace, avec ou sans guillemets
  const askMatch =
    cmd.match(/^ask\s*"(.+)"\s*$/i) || cmd.match(/^ask\s*(.+?)\s*$/i);

  if (askMatch) {
    const question = askMatch[1].trim();
    if (question === "") {
      pushLine("error", "Précise ta question, ex: ask \"quel est ton projet préféré ?\"");
      return;
    }
    setLoading(true);
    try {
      const data = await askAgent(question, history);
      pushLine("agent", data.reply);
      if (data.toolsUsed && data.toolsUsed.length > 0) {
        pushLine("tool", "🔧 outils appelés : " + data.toolsUsed.join(", "));
      }
      setHistory(function (prev) {
        return [...prev, { role: "user", content: question }, { role: "assistant", content: data.reply }];
      });
    } catch {
      pushLine("error", "Erreur : impossible de contacter l'agent IA.");
    } finally {
      setLoading(false);
    }
    return;
  }

  pushLine("error", `Commande inconnue : ${cmd}. Tape 'help'.`);
}

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    const value = input;
    setInput("");
    handleCommand(value);
  }

  return (
    <div
      className="w-full max-w-2xl h-[480px] flex flex-col rounded-2xl border border-white/10 bg-[#0a0a12] overflow-hidden shadow-2xl"
      onClick={function () { inputRef.current?.focus(); }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-white/40 font-mono">tarek@portfolio: ~</span>
        <button onClick={onClose} className="ml-auto text-white/40 hover:text-white text-xs">
          fermer ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm space-y-1">
        {lines.map(function (line, i) {
          if (line.type === "input") {
            return (
              <div key={i} className="text-white/90">
                <span className="text-purple-400">tarek@portfolio</span>
                <span className="text-white/40">:~$ </span>{line.text}
              </div>
            );
          }
          if (line.type === "agent") {
            return (
              <div key={i} className="text-cyan-300 whitespace-pre-wrap pl-2 border-l-2 border-cyan-400/30">
                {line.text}
              </div>
            );
          }
          if (line.type === "tool") {
            return <div key={i} className="text-purple-400/70 text-xs pl-2">{line.text}</div>;
          }
          if (line.type === "error") {
            return <div key={i} className="text-red-400">{line.text}</div>;
          }
          return <div key={i} className="text-white/60 whitespace-pre-wrap">{line.text}</div>;
        })}
        {loading && <div className="text-cyan-400/70 animate-pulse">agent réfléchit...</div>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
        <span className="text-purple-400 font-mono text-sm">tarek@portfolio:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={function (e) { setInput(e.target.value); }}
          disabled={loading}
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent outline-none text-white font-mono text-sm placeholder-white/30"
          placeholder='ask "quel est ton projet préféré ?"'
        />
      </form>
    </div>
  );
}

export default Terminal;