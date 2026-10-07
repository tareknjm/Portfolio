"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { DASHBOARD_STATS } from "@/lib/data";
import { SectionReveal, SectionItem } from "@/components/motion/SectionReveal";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const duration = 1500;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * value));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(value);
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="chrome-text text-5xl font-bold tracking-tight md:text-6xl">
      {count}
      {suffix}
    </span>
  );
}

export default function Dashboard() {
  return (
    <SectionReveal id="dashboard" className="section-container !py-16">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {DASHBOARD_STATS.map((stat) => (
          <SectionItem key={stat.label}>
            <div className="card-surface hairline flex h-full flex-col items-center justify-center gap-3 rounded-2xl p-8">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-center font-mono text-[11px] uppercase tracking-[0.15em] text-titanium">
                {stat.label}
              </p>
            </div>
          </SectionItem>
        ))}
      </div>
    </SectionReveal>
  );
}
