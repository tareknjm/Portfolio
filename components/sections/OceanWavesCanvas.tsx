"use client";

import { useEffect, useRef } from "react";

interface OceanWavesCanvasProps {
  className?: string;
  accentColor?: "pink" | "primary" | "cyan";
  rippleTrigger?: number;
}

interface Mote {
  x: number; y: number; r: number; vy: number;
  hue: string; baseOp: number; phase: number;
}

interface Ripple {
  x: number; y: number; radius: number; max: number;
  op: number; speed: number; color: string;
}

export default function OceanWavesCanvas({
  className = "",
  accentColor = "primary",
  rippleTrigger = 0,
}: OceanWavesCanvasProps) {
  const cvs = useRef<HTMLCanvasElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);
  const vis = useRef(true);
  const ripples = useRef<Ripple[]>([]);
  const mouse = useRef({ x: -999, y: -999, sx: -999, sy: -999, on: false });

  useEffect(() => {
    if (rippleTrigger > 0 && wrap.current) {
      const r = wrap.current.getBoundingClientRect();
      const c = accentColor === "pink" ? "244,114,182" : accentColor === "cyan" ? "34,211,238" : "167,139,250";
      ripples.current.push({
        x: r.width / 2, y: r.height * 0.42,
        radius: 8, max: Math.max(r.width, r.height) * 0.8,
        op: 1, speed: 5, color: c,
      });
    }
  }, [rippleTrigger, accentColor]);

  useEffect(() => {
    const canvas = cvs.current;
    const container = wrap.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0;
    const dpr = Math.min(devicePixelRatio || 1, 1.5); // Cap DPR at 1.5 for perf

    const resize = () => {
      const b = container.getBoundingClientRect();
      w = b.width; h = b.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([e]) => {
        vis.current = e.isIntersecting;
        if (e.isIntersecting && !raf.current) raf.current = requestAnimationFrame(draw);
      },
      { threshold: 0.04 }
    );
    io.observe(container);

    // Reduced particle count for smooth scroll
    const moteCount = 45;
    const hues = ["34,211,238", "167,139,250", "244,114,182", "253,230,138"];
    const motes: Mote[] = Array.from({ length: moteCount }, () => ({
      x: Math.random() * (w || 1200),
      y: Math.random() * (h || 700),
      r: Math.random() * 2 + 0.8,
      vy: Math.random() * 0.25 + 0.1,
      hue: hues[Math.floor(Math.random() * hues.length)],
      baseOp: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    // Lightweight noise
    const noise = (x: number, s: number) =>
      Math.sin(x * 0.0037 * s + t * 0.9) * 0.5 +
      Math.sin(x * 0.007 * s - t * 1.3) * 0.3 +
      Math.cos(x * 0.002 * s + t * 0.5) * 0.2;

    const draw = () => {
      if (!vis.current) { raf.current = 0; return; }
      t += reduced ? 0.003 : 0.013;

      const m = mouse.current;
      m.sx += (m.x - m.sx) * 0.06;
      m.sy += (m.y - m.sy) * 0.06;

      // ── Background ─────────────────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#030509");
      bg.addColorStop(0.3, "#060b18");
      bg.addColorStop(0.6, "#081225");
      bg.addColorStop(1, "#030508");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── God Rays (4 instead of 6) ──────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 4; i++) {
        const ox = w * (0.15 + i * 0.22) + Math.sin(t * 0.35 + i * 1.1) * 50;
        const angle = Math.sin(t * 0.25 + i * 0.9) * 0.18 - 0.2;
        const rw = 130 + Math.sin(t * 0.7 + i) * 35;
        const intensity = 0.03 + Math.sin(t * 0.5 + i * 2) * 0.015;

        const rg = ctx.createLinearGradient(ox, 0, ox + Math.sin(angle) * h, h);
        const rc = i % 2 === 0 ? `rgba(34,211,238,${intensity})` : `rgba(167,139,250,${intensity})`;
        rg.addColorStop(0, rc);
        rg.addColorStop(0.5, rc);
        rg.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(ox - rw / 2, 0);
        ctx.lineTo(ox + rw / 2, 0);
        ctx.lineTo(ox + Math.sin(angle) * h + rw * 1.5, h);
        ctx.lineTo(ox + Math.sin(angle) * h - rw * 1.5, h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // ── Torch ──────────────────────────────────────────────────────────
      if (m.on && m.sx > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const tc = accentColor === "pink" ? "244,114,182" : accentColor === "cyan" ? "34,211,238" : "167,139,250";
        const tg = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, 250);
        tg.addColorStop(0, `rgba(${tc},0.2)`);
        tg.addColorStop(0.35, `rgba(${tc},0.06)`);
        tg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = tg;
        ctx.beginPath();
        ctx.arc(m.sx, m.sy, 250, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Motes ──────────────────────────────────────────────────────────
      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];
        p.y -= p.vy;
        p.x += Math.sin(t * 1.5 + p.phase + i * 0.3) * 0.3;
        if (p.y < -15) { p.y = h + 15; p.x = Math.random() * w; }

        let illum = 1;
        if (m.on) {
          const dx = p.x - m.sx, dy = p.y - m.sy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 220) illum = 1 + (1 - d / 220) * 2.5;
        }

        const op = Math.min(p.baseOp * illum, 1);
        const glowR = p.r * 3.5;

        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        pg.addColorStop(0, `rgba(${p.hue},${op})`);
        pg.addColorStop(0.4, `rgba(${p.hue},${op * 0.3})`);
        pg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = pg;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Shockwave Ripples ──────────────────────────────────────────────
      const rp = ripples.current;
      for (let i = rp.length - 1; i >= 0; i--) {
        const s = rp[i];
        s.radius += s.speed;
        s.op = Math.max(0, 1 - s.radius / s.max);
        if (s.op <= 0.005) { rp.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${s.color},${s.op * 0.6})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // ── Waves (step 6px instead of 4) ──────────────────────────────────
      const drawWave = (
        base: number, amp: number, freq: number, spd: number, ph: number,
        grad: CanvasGradient, stroke: string, sw: number
      ) => {
        ctx.save();
        ctx.beginPath();
        const bl = h * base;
        ctx.moveTo(-2, h + 2);
        ctx.lineTo(-2, bl);
        for (let x = 0; x <= w + 4; x += 6) {
          let md = 0;
          if (m.on) {
            const dx = x - m.sx;
            if (Math.abs(dx) < 180) md = Math.cos((Math.abs(dx) / 180) * (Math.PI / 2)) * 18;
          }
          const n = noise(x, freq * 280);
          const y = bl
            + Math.sin(x * freq + t * spd + ph) * amp
            + Math.cos(x * freq * 0.6 - t * spd * 0.7) * amp * 0.4
            + n * amp * 0.4
            - md;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w + 2, h + 2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        if (sw > 0) { ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.stroke(); }
        ctx.restore();
      };

      const w1g = ctx.createLinearGradient(0, h * 0.46, 0, h);
      w1g.addColorStop(0, "rgba(88,28,135,0.16)");
      w1g.addColorStop(0.5, "rgba(55,18,90,0.1)");
      w1g.addColorStop(1, "rgba(4,5,10,0.8)");
      drawWave(0.5, 34, 0.003, 0.85, 0, w1g, "rgba(167,139,250,0.2)", 1);

      const w2g = ctx.createLinearGradient(0, h * 0.62, 0, h);
      w2g.addColorStop(0, "rgba(14,116,144,0.16)");
      w2g.addColorStop(0.5, "rgba(15,76,129,0.1)");
      w2g.addColorStop(1, "rgba(4,5,10,0.85)");
      drawWave(0.64, 24, 0.0042, 1.2, 2.5, w2g, "rgba(34,211,238,0.28)", 1.5);

      const w3g = ctx.createLinearGradient(0, h * 0.77, 0, h);
      const fc = accentColor === "pink" ? "rgba(244,114,182," : accentColor === "cyan" ? "rgba(34,211,238," : "rgba(167,139,250,";
      w3g.addColorStop(0, `${fc}0.2)`);
      w3g.addColorStop(1, "rgba(4,6,14,0.95)");
      drawWave(0.8, 18, 0.0055, 1.6, 5, w3g, "rgba(255,255,255,0.3)", 1);

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      const b = container.getBoundingClientRect();
      mouse.current.x = e.clientX - b.left;
      mouse.current.y = e.clientY - b.top;
      if (!mouse.current.on) { mouse.current.sx = mouse.current.x; mouse.current.sy = mouse.current.y; mouse.current.on = true; }
    };
    const onLeave = () => { mouse.current.on = false; };

    container.addEventListener("mousemove", onMove, { passive: true });
    container.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      ro.disconnect(); io.disconnect();
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [accentColor]);

  return (
    <div ref={wrap} className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`} style={{ contain: "layout paint", willChange: "transform" }}>
      <canvas ref={cvs} className="w-full h-full block" />
    </div>
  );
}
