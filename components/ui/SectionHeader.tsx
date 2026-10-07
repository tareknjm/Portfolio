import type { ReactNode } from "react";

type Props = {
  index: string;
  label: string;
  title: string;
  accentWord?: string;
  aside?: ReactNode;
};

export default function SectionHeader({ index, label, title, accentWord, aside }: Props) {
  return (
    <header className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">
          <span style={{ color: "var(--hero-accent)" }}>{index}</span>
          <span aria-hidden className="h-px w-8 bg-white/25" />
          <span>{label}</span>
        </p>
        <h2
          className="display text-[clamp(2.2rem,5vw,4rem)]"
          style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95 }}
        >
          {title}{" "}
          {accentWord && (
            <span
              className="font-serif text-[1.12em] font-normal italic"
              style={{ color: "var(--hero-accent)" }}
            >
              {accentWord}
            </span>
          )}
        </h2>
      </div>
      {aside && (
        <div className="max-w-sm text-sm leading-relaxed text-titanium lg:text-right">{aside}</div>
      )}
    </header>
  );
}