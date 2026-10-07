"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  /** Texte copié dans le presse-papier */
  value: string;
  /** Callback optionnel (ex. brancher ton feedback sonore) */
  onCopy?: () => void;
  className?: string;
};

export default function HeroTerminalBadge({ value, onCopy, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      navigator.vibrate?.(15);
      onCopy?.();
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [value, onCopy]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copier ${value}`}
      className={`group inline-flex items-center gap-3 rounded-xl border px-4 py-2.5 font-mono text-xs transition-all duration-300 active:scale-[0.98] ${
        copied
          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
          : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/25 hover:bg-white/[0.06]"
      } ${className}`}
    >
      <span className={copied ? "text-emerald-300" : ""} style={copied ? undefined : { color: "var(--hero-accent)" }} aria-hidden>
        $
      </span>
      <span className="select-none">{value}</span>
      <span
        aria-live="polite"
        className={`ml-1 inline-flex items-center gap-1.5 border-l pl-3 text-[10px] uppercase tracking-[0.15em] ${
          copied ? "border-emerald-400/30 text-emerald-300" : "border-white/10 text-white/45 group-hover:text-white/75"
        }`}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copié" : "Copier"}
      </span>
    </button>
  );
}