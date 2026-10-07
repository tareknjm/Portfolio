"use client";

import { PERSONAL_INFO } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Minimal availability chip — a single calm status pill.
 * Replaces the old "mission control" terminal card (traffic lights + T+ timer).
 */
export default function LiveStatusCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full glass px-4 py-2",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-sm font-medium text-white/80">
        {PERSONAL_INFO.availability}
      </span>
    </div>
  );
}
