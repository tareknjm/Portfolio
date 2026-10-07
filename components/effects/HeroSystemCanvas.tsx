"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** "r,g,b" de l'accent */
  accent?: string;
  className?: string;
};

const CREAM = "245,237,226";

type NodeDef = { id: string; label: string; sub: string; note: string; x: number; y: number };

const NODES: NodeDef[] = [
  { id: "client", label: "NEXT.JS", sub: "client", note: "Next.js · TypeScript · Tailwind", x: 0.1, y: 0.4 },
  { id: "gateway", label: "KRAKEND", sub: "gateway", note: "Passerelle API · routage", x: 0.34, y: 0.58 },
  { id: "auth", label: "KEYCLOAK", sub: "iam", note: "SSO · OAuth2 / OIDC", x: 0.4, y: 0.16 },
  { id: "api", label: "SPRING BOOT", sub: "api", note: "Java 21 · Spring Security", x: 0.66, y: 0.4 },
  { id: "db", label: "POSTGRESQL", sub: "data", note: "Données relationnelles", x: 0.9, y: 0.2 },
  { id: "logs", label: "ELASTIC", sub: "logs", note: "Logs · observabilité", x: 0.46, y: 0.86 },
  { id: "docker", label: "DOCKER", sub: "runtime", note: "Conteneurs · déploiement", x: 0.14, y: 0.82 },
];

const EDGES: Array<[string, string]> = [
  ["client", "gateway"],
  ["gateway", "auth"],
  ["gateway", "api"],
  ["api", "db"],
  ["api", "logs"],
  ["docker", "gateway"],
  ["docker", "logs"],
];

export default function HeroSystemCanvas({ accent = "246,133,27", className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let raf = 0;
    let last = 0;
    let t = 0;
    let running = false;
    let inView = true;
    const ptr = { x: -9999, y: -9999 };

    const nodes = NODES.map((n, i) => ({ ...n, bx: 0, by: 0, px: 0, py: 0, hover: 0, phase: i * 1.7 }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges = EDGES.map(([a, b]) => ({
      a: byId.get(a)!,
      b: byId.get(b)!,
      dashed: a === "docker" || b === "docker",
    }));
    const packets = edges.flatMap((_, ei) =>
      [0, 1].map((k) => ({
        e: ei,
        t: (k * 0.5 + ei * 0.13) % 1,
        speed: 0.12 + ((ei * 7 + k * 3) % 5) * 0.03,
      }))
    );

    const layout = () => {
      const desktop = W >= 1024;
      const left = desktop ? 0.4 : 0.06;
      const span = desktop ? 0.56 : 0.88;
      const top = desktop ? 0.12 : 0.14;
      const vspan = desktop ? 0.7 : 0.62;
      nodes.forEach((n) => {
        n.bx = W * (left + span * n.x);
        n.by = H * (top + vspan * n.y);
        n.px = n.bx;
        n.py = n.by;
      });
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = r.width;
      H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, W < 1024 ? 1 : 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
      if (!running) draw();
    };

    const update = (dt: number) => {
      t += dt;
      nodes.forEach((n) => {
        let tx = n.bx + Math.sin(t * 0.6 + n.phase) * 5;
        let ty = n.by + Math.cos(t * 0.5 + n.phase) * 5;
        const dx = ptr.x - n.bx;
        const dy = ptr.y - n.by;
        const d = Math.hypot(dx, dy);
        if (d < 230 && d > 0.001) {
          const k = ((1 - d / 230) * 16) / d;
          tx += dx * k;
          ty += dy * k;
        }
        const f = Math.min(1, dt * 5);
        n.px += (tx - n.px) * f;
        n.py += (ty - n.py) * f;
        const target = Math.hypot(ptr.x - n.px, ptr.y - n.py) < 64 ? 1 : 0;
        n.hover += (target - n.hover) * Math.min(1, dt * 10);
      });
      packets.forEach((p) => {
        p.t += dt * p.speed;
        if (p.t > 1) p.t -= 1;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Liens
      edges.forEach((e) => {
        const h = Math.max(e.a.hover, e.b.hover);
        ctx.setLineDash(e.dashed ? [3, 6] : []);
        ctx.strokeStyle = `rgba(${CREAM},${0.09 + 0.4 * h})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(e.a.px, e.a.py);
        ctx.lineTo(e.b.px, e.b.py);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Paquets
      packets.forEach((p) => {
        const e = edges[p.e];
        const h = Math.max(e.a.hover, e.b.hover);
        const x = e.a.px + (e.b.px - e.a.px) * p.t;
        const y = e.a.py + (e.b.py - e.a.py) * p.t;
        const t0 = Math.max(0, p.t - 0.07);
        const x0 = e.a.px + (e.b.px - e.a.px) * t0;
        const y0 = e.a.py + (e.b.py - e.a.py) * t0;
        ctx.strokeStyle = `rgba(${accent},${0.35 + 0.4 * h})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = `rgb(${accent})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nœuds
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textBaseline = "middle";
      nodes.forEach((n) => {
        const s = 4 + 3 * n.hover;
        const flip = n.bx > W * 0.7;

        if (n.hover > 0.02) {
          ctx.strokeStyle = `rgba(${accent},${n.hover * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.px, n.py, 14 + 6 * n.hover, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = n.hover > 0.5 ? `rgb(${accent})` : "#100c0a";
        ctx.strokeStyle = `rgba(${CREAM},${0.55 + 0.4 * n.hover})`;
        ctx.lineWidth = 1;
        ctx.fillRect(n.px - s, n.py - s, s * 2, s * 2);
        ctx.strokeRect(n.px - s, n.py - s, s * 2, s * 2);

        ctx.textAlign = flip ? "right" : "left";
        const tx = flip ? n.px - s - 9 : n.px + s + 9;

        ctx.fillStyle = `rgba(${CREAM},${0.5 + 0.5 * n.hover})`;
        ctx.fillText(n.label, tx, n.py - 4);

        // Ligne du dessous : le rôle court s'efface, la description apparaît
        ctx.fillStyle = `rgba(${CREAM},${0.25 * (1 - n.hover)})`;
        ctx.fillText(n.sub, tx, n.py + 9);
        if (n.hover > 0.02) {
          ctx.fillStyle = `rgba(${accent},${0.95 * n.hover})`;
          ctx.fillText(n.note, tx, n.py + 9);
        }
      });
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || !inView || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      if (!inView || e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const onLeave = () => {
      ptr.x = -9999;
      ptr.y = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? start() : stop();
    });
    io.observe(wrap);

    resize();
    start();

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [accent]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}