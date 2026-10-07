"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundMuted, setSoundMuted, playTactileClick } from "@/lib/audio";
import { cn } from "@/lib/utils";

export default function SoundToggle({ className = "" }: { className?: string }) {
  const [muted, setMuted] = useState(isSoundMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) {
      setTimeout(() => playTactileClick(), 50);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-wider uppercase border transition-all duration-300 cursor-pointer select-none",
        muted
          ? "border-white/10 text-titanium hover:text-white hover:border-white/20 bg-white/[0.02]"
          : "border-cyan-500/40 text-cyan-300 bg-cyan-500/10 shadow-[0_0_12px_rgba(34,211,238,0.2)]",
        className
      )}
      title={muted ? "Activer les sons d'immersion" : "Désactiver le son"}
      aria-label={muted ? "Activer le son" : "Désactiver le son"}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 opacity-60" />
          <span className="hidden sm:inline">SON : OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">SON : ON</span>
        </>
      )}
    </button>
  );
}
