"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import MagneticWrap from "@/components/effects/MagneticWrap";
import { PROJECTS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { playTactileClick } from "@/lib/audio";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const EXPO = "cubic-bezier(0.22,1,0.36,1)";
const ACCENT = "var(--hero-accent)";
const WIRE_LIT = "rgba(246,133,27,.55)";
const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ring)]";
const pad = (i: number) => String(i + 1).padStart(2, "0");
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const IDS = PROJECTS.map((p) => p.id);

/* ── Données des schémas : dessinées depuis les specs et le code de chaque projet ── */
type DNode = { id: string; x: number; y: number; label: string; tag: string; note: string };
type DLink = { from: string; to: string; dashed?: boolean; bend?: number };
type Spec = {
  domain: string;
  badge: string;
  lang: string;
  code: string;
  specs: { label: string; value: string }[];
  nodes: DNode[];
  links: DLink[];
};

const EMPTY: Spec = { domain: "", badge: "", lang: "", code: "", specs: [], nodes: [], links: [] };

const SPECS: Record<string, Spec> = {
  "sav-platform": {
    domain: "IA & Service Après-Vente",
    badge: "Production-ready",
    lang: "python",
    code: `# Django MVC & RASA Neural Pipeline
class IncidentDiagnosticView(APIView):
    permission_classes = [IsClientOrTechnician]

    def post(self, request):
        intent = rasa_nlu.classify(request.data["issue_text"])
        severity = cv_model.detect_component_damage(request.FILES["photo"])
        return Response({"ticket_priority": severity, "intent": intent})`,
    specs: [
      { label: "Architecture", value: "MVC Django" },
      { label: "Moteur IA", value: "RASA Chatbot" },
      { label: "Base de données", value: "MySQL relationnel" },
      { label: "Permissions", value: "RBAC 3 Rôles" },
    ],
    nodes: [
      { id: "client", x: 90, y: 200, label: "Client web", tag: "client", note: "Client ou technicien : décrit l'incident et joint une photo." },
      { id: "django", x: 300, y: 200, label: "Django MVC", tag: "api", note: "Architecture MVC · permissions RBAC à 3 rôles." },
      { id: "rasa", x: 510, y: 100, label: "RASA", tag: "nlu", note: "Chatbot : classe l'intention du texte de l'incident." },
      { id: "cv", x: 510, y: 300, label: "Modèle vision", tag: "cv", note: "Évalue la gravité des dégâts à partir de la photo du composant." },
      { id: "mysql", x: 300, y: 340, label: "MySQL", tag: "data", note: "Base de données relationnelle." },
    ],
    links: [
      { from: "client", to: "django" },
      { from: "django", to: "rasa" },
      { from: "django", to: "cv" },
      { from: "django", to: "mysql" },
    ],
  },
  elearn: {
    domain: "EdTech & Microservices WebRTC",
    badge: "Full-Stack Moderne",
    lang: "java",
    code: `// Spring Boot 3 & JWT Stateless Security
@RestController
@RequestMapping("/api/v1/sessions")
public class VideoConferenceController {
    @PostMapping("/jitsi/token")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('STUDENT')")
    public ResponseEntity<RoomToken> generateSessionToken(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jitsiService.signStatelessJwt(user.getId()));
    }
}`,
    specs: [
      { label: "Backend", value: "Spring Boot REST" },
      { label: "Visioconférence", value: "Jitsi WebRTC" },
      { label: "Sécurité", value: "JWT Stateless" },
      { label: "Assistant", value: "IA Recommandation" },
    ],
    nodes: [
      { id: "client", x: 90, y: 200, label: "Navigateur", tag: "client", note: "Étudiants et instructeurs, authentifiés par JWT." },
      { id: "api", x: 300, y: 200, label: "Spring Boot", tag: "api", note: "API REST v1 · sécurité JWT stateless · rôles INSTRUCTOR et STUDENT." },
      { id: "jitsi", x: 510, y: 100, label: "Jitsi", tag: "webrtc", note: "Visioconférence WebRTC · jeton de salle signé côté serveur." },
      { id: "ia", x: 510, y: 300, label: "Assistant IA", tag: "reco", note: "Recommandation de contenus." },
    ],
    links: [
      { from: "client", to: "api" },
      { from: "api", to: "jitsi" },
      { from: "client", to: "jitsi", dashed: true, bend: -70 },
      { from: "api", to: "ia" },
    ],
  },
  "cabinet-pro": {
    domain: "Système d'Information & Santé",
    badge: "Architecture .NET",
    lang: "csharp",
    code: `// ASP.NET Core & Entity Framework Audit
[Authorize(Roles = "Doctor,Admin")]
public async Task<IActionResult> GeneratePrescription(int patientId, PrescriptionDto dto) {
    var record = await _context.MedicalRecords.FindAsync(patientId);
    var secureToken = _cryptoService.SignPrescription(record, dto);
    return File(_pdfService.RenderPrescription(secureToken), "application/pdf");
}`,
    specs: [
      { label: "Framework", value: "ASP.NET MVC (C#)" },
      { label: "ORM / Données", value: "Entity Framework" },
      { label: "Gestion", value: "Dossiers & RDV" },
      { label: "Rôles", value: "4 Niveaux d'accès" },
    ],
    nodes: [
      { id: "client", x: 90, y: 200, label: "Navigateur", tag: "client", note: "Accès par rôle · 4 niveaux (médecin, admin…)." },
      { id: "mvc", x: 300, y: 200, label: "ASP.NET MVC", tag: "api", note: "Contrôleurs C# · autorisation par rôles (Doctor, Admin)." },
      { id: "ef", x: 510, y: 100, label: "Entity Framework", tag: "orm", note: "ORM : dossiers médicaux et rendez-vous." },
      { id: "db", x: 510, y: 300, label: "Base de données", tag: "data", note: "Stockage des dossiers et des rendez-vous." },
      { id: "pdf", x: 300, y: 340, label: "Signature + PDF", tag: "service", note: "Ordonnance signée puis rendue en PDF." },
    ],
    links: [
      { from: "client", to: "mvc" },
      { from: "mvc", to: "ef" },
      { from: "ef", to: "db" },
      { from: "mvc", to: "pdf" },
    ],
  },
};

const TABS = [
  { id: "anatomy", label: "problème" },
  { id: "challenges", label: "défis" },
  { id: "features", label: "fonctions" },
  { id: "code", label: "code" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const pathOf = (a: DNode, b: DNode, bend = 0) => {
  if (!bend) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return `M${a.x} ${a.y} Q${mx + (-dy / len) * bend} ${my + (dx / len) * bend} ${b.x} ${b.y}`;
};

/* ═══════════════════════════════════════════════════════════════════
   Signal scope : l'oscilloscope est le navigateur des projets.
   Chaque projet = un canal. On glisse la trace pour s'accorder, la
   forme d'onde se transforme, le relâchement s'aimante sur un canal.
   Les positions des canaux sont (i + 0.5) / n à trois endroits :
   curseur canvas, lignes HTML, grille des onglets. Garde-les alignés.
   ═══════════════════════════════════════════════════════════════════ */
const HARMONICS = [
  [1, 0, 0], // sinus
  [1, -1 / 9, 1 / 25], // triangle
  [1, 1 / 3, 1 / 5], // carré
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const seed = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
};
type Channel = { freq: number; amp: number; harm: number[] };
const CHANNELS: Channel[] = IDS.map((id, i) => {
  const s = seed(id);
  return { freq: 2.2 + i * 1.1 + s * 0.6, amp: 0.62 + s * 0.2, harm: HARMONICS[i % HARMONICS.length] };
});
const tuneAt = (pos: number) => {
  const last = CHANNELS.length - 1;
  const p = Math.min(last, Math.max(0, pos));
  const a = Math.floor(p);
  const b = Math.min(a + 1, last);
  const f = smooth(p - a);
  const A = CHANNELS[a];
  const B = CHANNELS[b];
  const harm = A.harm.map((c, k) => lerp(c, B.harm[k], f));
  return {
    freq: lerp(A.freq, B.freq, f),
    amp: lerp(A.amp, B.amp, f),
    harm,
    norm: harm.reduce((s, c) => s + Math.abs(c), 0) || 1,
  };
};

function SignalScope({
  sel,
  preview,
  running,
  reduce,
  onPreview,
  onCommit,
}: {
  sel: number;
  preview: number | null;
  running: boolean;
  reduce: boolean | null;
  onPreview: (i: number | null) => void;
  onCommit: (i: number) => void;
}) {
  const n = IDS.length;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const target = useRef(sel);
  const cur = useRef(sel);
  const dragging = useRef(false);
  const lastPrev = useRef(-1);
  const intro = useRef(reduce ? 1 : 0);
  const drawRef = useRef<(() => void) | null>(null);

  // Canvas 2D : persistance phosphore, DPR plafonné, arrêt hors écran, image fixe en reduced motion
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let time = 0;

    const place = (x: number, y: number) => {
      const line = lineRef.current;
      const dot = dotRef.current;
      if (line) {
        line.style.opacity = "1";
        line.style.transform = `translate3d(${x}px,0,0)`;
      }
      if (dot) {
        dot.style.opacity = "1";
        dot.style.transform = `translate3d(${x - 4.5}px,${y - 4.5}px,0)`;
      }
    };

    const draw = (dt: number, still: boolean) => {
      if (!w || !h) return;
      cur.current += (target.current - cur.current) * (still ? 1 : 1 - Math.exp(-dt * 9));
      if (!still) {
        time += dt;
        intro.current = Math.min(1, intro.current + dt / 1.4);
      }
      const gain = still ? 1 : smooth(intro.current);
      const { freq, amp, harm, norm } = tuneAt(cur.current);
      const mid = h / 2;
      const k = amp * gain * h * 0.36;
      const TAU = Math.PI * 2;

      if (still) {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,.24)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }

      // deux calques cream en hairline (fondamentale seule)
      const layer = (f: number, ph: number, alpha: number, ratio: number) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const yy = mid - Math.sin(TAU * f * (x / w) + ph) * k * ratio;
          if (x === 0) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(245,237,226,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      };
      layer(freq * 0.5, time * 0.9 + 1, 0.07, 0.55);
      layer(freq * 1.5, time * 1.3 + 2, 0.05, 0.4);

      // trace principale (le signal)
      const yAt = (t: number) => {
        const ph = TAU * freq * t + time * 1.6;
        let v = 0;
        for (let j = 0; j < 3; j++) v += harm[j] * Math.sin((2 * j + 1) * ph);
        return mid - (v / norm) * k;
      };
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const yy = yAt(x / w);
        if (x === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.strokeStyle = "rgba(246,133,27,.95)";
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.stroke();

      // curseur : DOM (pas de traînée), il suit l'onde
      const cx = ((cur.current + 0.5) / n) * w;
      place(cx, yAt(cx / w));
    };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        window.matchMedia("(pointer: coarse)").matches ? 1 : 1.5
      );
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(0, true);
    };

    const frame = (ts: number) => {
      const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      draw(dt, false);
      raf = requestAnimationFrame(frame);
    };

    drawRef.current = () => draw(0, true);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    if (!reduce && running) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      drawRef.current = null;
    };
  }, [n, reduce, running]);

  // Le canal validé redevient la cible (hors glissement)
  useEffect(() => {
    if (!dragging.current) target.current = sel;
    if (reduce) drawRef.current?.();
  }, [sel, reduce]);

  const tuneTo = (clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const p = Math.min(n - 1, Math.max(0, ((clientX - r.left) / r.width) * n - 0.5));
    target.current = p;
    const idx = Math.round(p);
    if (idx !== lastPrev.current) {
      lastPrev.current = idx;
      onPreview(idx);
    }
    if (reduce) drawRef.current?.();
  };

  const end = (commit: boolean) => {
    if (!dragging.current) return;
    dragging.current = false;
    const idx = commit ? Math.round(target.current) : sel;
    target.current = idx;
    lastPrev.current = -1;
    onPreview(null);
    if (commit) onCommit(idx);
    if (reduce) drawRef.current?.();
  };

  const shown = preview ?? sel;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        lastPrev.current = -1;
        tuneTo(e.clientX);
      }}
      onPointerMove={(e: PointerEvent<HTMLDivElement>) => dragging.current && tuneTo(e.clientX)}
      onPointerUp={() => end(true)}
      onPointerCancel={() => end(false)}
      className="relative h-36 cursor-grab touch-pan-y select-none overflow-hidden rounded-xl border border-white/10 bg-white/[0.015] active:cursor-grabbing sm:h-44"
    >
      {/* graticule en CSS : les éléments statiques ne passent jamais par le canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,237,226,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,237,226,.05) 1px, transparent 1px)",
          backgroundSize: "100% 25%, 12.5% 100%",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-white/10" />
      {IDS.map((id, i) => (
        <span
          key={id}
          className="pointer-events-none absolute inset-y-0 w-px transition-colors duration-300"
          style={{
            left: `${((i + 0.5) / n) * 100}%`,
            background: shown === i ? "rgba(246,133,27,.35)" : "rgba(245,237,226,.1)",
          }}
        />
      ))}
      <p className="pointer-events-none absolute left-3 top-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
        oscillo · <span style={{ color: ACCENT }}>ch.{pad(shown)}</span>
      </p>
      <p className="pointer-events-none absolute right-3 top-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
        {n} canaux
      </p>

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      <span
        ref={lineRef}
        className="pointer-events-none absolute left-0 top-0 h-full w-px border-l border-dashed border-white/40 will-change-transform"
        style={{ opacity: 0 }}
      />
      <span
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 size-[9px] will-change-transform"
        style={{ opacity: 0, background: ACCENT }}
      />
    </div>
  );
}

/* ── Le schéma : SVG pour les liens/packets, boutons HTML pour les nœuds ── */
function Diagram({
  nodes,
  links,
  live,
  running,
  reduce,
  fig,
}: {
  nodes: DNode[];
  links: DLink[];
  live: boolean;
  running: boolean;
  reduce: boolean | null;
  fig: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const byId = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, DNode>,
    [nodes]
  );
  const neighbors = useMemo(() => {
    const set = new Set<string>();
    if (active) {
      links.forEach((l) => {
        if (l.from === active) set.add(l.to);
        if (l.to === active) set.add(l.from);
      });
    }
    return set;
  }, [active, links]);

  // Les packets se mettent en pause hors écran, fiche non sélectionnée, ou pendant l'inspection
  const playing = running && active === null;
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    if (playing) el.unpauseAnimations?.();
    else el.pauseAnimations?.();
  }, [playing]);
  useEffect(() => {
    if (!live) setActive(null);
  }, [live]);

  // "Lock-on" : les liens apparaissent, puis les nœuds, en cascade
  const tr = (delay: number) => (reduce ? undefined : `opacity .45s ${EXPO} ${live ? delay : 0}ms`);
  const linkDelay = (k: number) => 180 + k * 85;
  const nodeDelay = (i: number) => 180 + links.length * 85 + i * 85;

  const activeNode = active ? byId[active] : null;
  const flow = activeNode
    ? {
        from: links.filter((l) => l.to === activeNode.id).map((l) => byId[l.from]?.label).filter(Boolean),
        to: links.filter((l) => l.from === activeNode.id).map((l) => byId[l.to]?.label).filter(Boolean),
      }
    : null;
  const hasDashed = links.some((l) => l.dashed);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.015]">
        <div aria-hidden className="hero-dots pointer-events-none absolute inset-0 opacity-70" />
        <p className="relative flex items-center justify-between px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
          <span>{fig}</span>
          {hasDashed && <span className="text-white/45">┄ flux média</span>}
        </p>

        <div className="px-3 pb-3 pt-1">
          <div className="relative aspect-[3/2] w-full">
            <svg
              ref={svgRef}
              viewBox="0 0 600 400"
              aria-hidden
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {links.map((l, k) => {
                const a = byId[l.from];
                const b = byId[l.to];
                if (!a || !b) return null;
                const d = pathOf(a, b, l.bend);
                const hot = active !== null && (l.from === active || l.to === active);
                const dim = active !== null && !hot;
                return (
                  <g key={k} style={{ opacity: live ? 1 : 0, transition: tr(linkDelay(k)) }}>
                    <g style={{ opacity: dim ? 0.3 : 1, transition: "opacity .2s" }}>
                      <path
                        d={d}
                        fill="none"
                        stroke={hot ? "rgba(246,133,27,.75)" : "rgba(245,237,226,.18)"}
                        strokeWidth={1}
                        strokeDasharray={l.dashed ? "4 5" : undefined}
                        vectorEffect="non-scaling-stroke"
                        style={{ transition: "stroke .2s" }}
                      />
                      {!reduce && (
                        <circle r={3} fill="#f6851b">
                          <animateMotion
                            dur={`${3 + (k % 3) * 0.7}s`}
                            begin={`${k * 0.6}s`}
                            repeatCount="indefinite"
                            path={d}
                          />
                        </circle>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>

            {nodes.map((n, i) => {
              const isActive = active === n.id;
              const dim = active !== null && !isActive && !neighbors.has(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  aria-label={`${n.label} : ${n.note}`}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(n.id)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                  onPointerDown={(e) =>
                    e.pointerType !== "mouse" && setActive((a) => (a === n.id ? null : n.id))
                  }
                  onFocus={() => setActive(n.id)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "absolute size-11 -translate-x-1/2 -translate-y-1/2",
                    ring
                  )}
                  style={{ left: `${(n.x / 600) * 100}%`, top: `${(n.y / 400) * 100}%` }}
                >
                  {/* calque 1 : apparition en cascade · calque 2 : atténuation de l'inspecteur */}
                  <span
                    className="flex size-full items-center justify-center"
                    style={{ opacity: live ? 1 : 0, transition: tr(nodeDelay(i)) }}
                  >
                    <span
                      className={cn(
                        "relative flex size-full items-center justify-center transition-opacity duration-200",
                        dim && "opacity-35"
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "size-[11px] border transition-colors",
                          isActive ? "border-transparent" : "border-white/45 bg-background"
                        )}
                        style={isActive ? { background: ACCENT } : undefined}
                      />
                      <span
                        className={cn(
                          "pointer-events-none absolute left-1/2 top-[calc(50%+13px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors",
                          isActive ? "text-foreground" : "text-white/70"
                        )}
                      >
                        {n.label}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* L'inspecteur : rôle, couche et flux calculés depuis les liens réels */}
      <div
        aria-live="polite"
        className="mt-3 flex min-h-[4.75rem] flex-wrap content-center items-center gap-x-4 gap-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[11.5px]"
      >
        <span style={{ color: ACCENT }}>$</span>
        {activeNode && flow ? (
          <>
            <span className="text-foreground">inspect {slug(activeNode.label)}</span>
            <span className="text-white/60">
              layer: <span className="text-foreground">{activeNode.tag}</span>
            </span>
            {flow.from.length > 0 && (
              <span className="text-white/60">
                ← <span className="text-foreground">{flow.from.join(", ").toLowerCase()}</span>
              </span>
            )}
            {flow.to.length > 0 && (
              <span className="text-white/60">
                → <span className="text-foreground">{flow.to.join(", ").toLowerCase()}</span>
              </span>
            )}
            <span className="basis-full text-titanium">{activeNode.note}</span>
          </>
        ) : (
          <span className="text-white/60">
            <span className="hidden md:inline">survole</span>
            <span className="md:hidden">touche</span> un nœud pour voir son rôle et son flux
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Extrait de code avec copie (succès en emerald, selon la DA) ── */
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* presse-papiers indisponible : on ne fait rien */
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-background/60">
      <div className="flex items-center justify-between border-b border-white/10 pl-4 pr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
        <span>extrait · {lang}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={cn(
            "min-h-11 px-2 uppercase tracking-[0.18em] transition-colors",
            copied ? "text-emerald-400" : "hover:text-white/90",
            ring
          )}
        >
          {copied ? "copié" : "copier"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11.5px] leading-relaxed text-titanium">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-10% 0px" });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sel, setSel] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [tab, setTab] = useState<TabId>("anatomy");
  const n = PROJECTS.length;

  if (n === 0) return null;

  const shown = preview ?? sel;
  const sp = PROJECTS[shown];
  const cs = SPECS[sp.id] ?? EMPTY;
  const totalChallenges = PROJECTS.reduce((sum, p) => sum + p.difficulties.length, 0);
  const litX = (sel + 0.5) / n;
  const counts: [string, number][] = [
    ["nœuds", cs.nodes.length],
    ["liens", cs.links.length],
    ["défis", sp.difficulties.length],
    ["fonctions", sp.features.length],
    ["technos", sp.technologies.length],
  ];

  const selectProject = (i: number, focus = false) => {
    const next = (i + n) % n;
    setSel(next);
    if (focus) tabRefs.current[next]?.focus({ preventScroll: true });
  };

  const commit = (i: number) => {
    if (i !== sel) playTactileClick();
    setSel(i);
  };

  const onAxisKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = {
      ArrowRight: sel + 1,
      ArrowLeft: sel - 1,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      selectProject(map[e.key], true);
    }
  };

  const onTabKey = (projectId: string) => (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.id === tab);
    const map: Record<string, number> = {
      ArrowRight: idx + 1,
      ArrowLeft: idx - 1,
      Home: 0,
      End: TABS.length - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      const next = TABS[(map[e.key] + TABS.length) % TABS.length].id;
      setTab(next);
      document.getElementById(`proj-${projectId}-tab-${next}`)?.focus({ preventScroll: true });
    }
  };

  const onSpot = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="projects" ref={sectionRef} aria-label="Projets" className="relative border-t border-white/10">
      <div className="section-container" style={{ paddingBlock: "clamp(5rem, 10vw, 8rem)" }}>
        <SectionHeader
          index="05"
          label="Projets"
          title="Les systèmes que j'ai"
          accentWord="construits"
          aside={
            <>
              Trois projets, trois architectures. Accorde l'oscilloscope sur un canal, puis sonde les nœuds du schéma.
              <span className="mt-3 block font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                {n} spec sheets · {totalChallenges} défis résolus
              </span>
            </>
          }
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* Navigateur : scope + axe des canaux + lecture */}
          <div className="mb-10 xl:mb-14">
            <SignalScope
              sel={sel}
              preview={preview}
              running={inView && !reduce}
              reduce={reduce}
              onPreview={setPreview}
              onCommit={commit}
            />

            <div
              role="tablist"
              aria-orientation="horizontal"
              aria-label="Projets"
              onKeyDown={onAxisKey}
              className="relative mt-5 grid border-t border-white/10"
              style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-px left-0 h-px w-full origin-left transition-transform duration-500 motion-reduce:transition-none"
                style={{ background: WIRE_LIT, transform: `scaleX(${litX})`, transitionTimingFunction: EXPO }}
              />
              {PROJECTS.map((p, i) => {
                const c = SPECS[p.id] ?? EMPTY;
                const active = i === sel;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`proj-tab-${p.id}`}
                    aria-selected={active}
                    aria-controls={`proj-panel-${p.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => {
                      playTactileClick();
                      selectProject(i);
                    }}
                    className={cn(
                      "group relative flex min-w-0 flex-col items-center px-2 pb-3 pt-5 text-center [@media(pointer:coarse)]:min-h-11",
                      ring
                    )}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 size-[7px] -translate-x-1/2 -translate-y-1/2"
                    >
                      <span
                        className={cn(
                          "absolute inset-0 border bg-background transition-colors",
                          active ? "border-transparent" : "border-white/30 group-hover:border-white/70"
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="scope-packet"
                          className="absolute inset-0"
                          style={{ background: ACCENT }}
                          transition={reduce ? { duration: 0 } : { type: "tween", duration: 0.55, ease: EASE }}
                        />
                      )}
                    </span>

                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                      {pad(i)}
                    </span>
                    <span
                      className={cn(
                        "display mt-1.5 block w-full truncate text-[clamp(1.05rem,2.2vw,1.75rem)] transition-colors",
                        active ? "text-foreground" : "text-titanium group-hover:text-white/90"
                      )}
                      style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}
                    >
                      {p.title}
                    </span>
                    <span className="mt-1.5 hidden w-full truncate font-mono text-[10px] uppercase tracking-wider text-white/60 sm:block">
                      {c.domain}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              aria-live="polite"
              className="mt-4 flex min-h-[3rem] flex-wrap items-center gap-x-5 gap-y-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-[11.5px]"
            >
              <span style={{ color: ACCENT }}>$</span>
              <span className="text-foreground">
                tune ch.{pad(shown)} {slug(sp.title)}
              </span>
              {counts.map(([label, v]) => (
                <span key={label} className="text-white/60">
                  {label} <span className="text-foreground">{v}</span>
                </span>
              ))}
              <span className="ml-auto hidden text-white/60 [@media(pointer:fine)]:inline">
                glisse la trace · ← → au clavier
              </span>
            </div>
          </div>

          {/* Fiches superposées : la hauteur ne change jamais */}
          <div className="grid min-w-0">
            {PROJECTS.map((p, i) => {
              const cfg = SPECS[p.id] ?? EMPTY;
              const active = i === sel;
              const shift = i < sel ? -16 : i > sel ? 16 : 0;
              const next = PROJECTS[(i + 1) % n];

              return (
                <div
                  key={p.id}
                  id={`proj-panel-${p.id}`}
                  role="tabpanel"
                  aria-labelledby={`proj-tab-${p.id}`}
                  aria-hidden={!active}
                  className={cn(
                    "col-start-1 row-start-1 min-w-0 transition-[opacity,transform,visibility] duration-500 motion-reduce:transition-none",
                    active ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                  )}
                  style={{
                    transform: reduce ? undefined : `translateX(${active ? 0 : shift}px)`,
                    transitionDelay: active ? "120ms" : "0ms",
                    transitionTimingFunction: EXPO,
                  }}
                >
                  <article
                    onPointerMove={onSpot}
                    className="spot-card rounded-2xl border border-white/10 bg-surface p-6 transition-colors hover:border-white/25 md:p-8"
                  >
                    {/* En-tête de fiche */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                      <span>
                        <span style={{ color: ACCENT }}>spec</span> · {pad(i)} / {String(n).padStart(2, "0")}
                      </span>
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span>{cfg.domain}</span>
                        {cfg.badge && (
                          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] tracking-wider text-white/70">
                            {cfg.badge}
                          </span>
                        )}
                      </span>
                    </div>

                    <h3
                      className="display mt-6 text-[clamp(2rem,3.6vw,3rem)] text-foreground"
                      style={{ fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 }}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.7] text-titanium md:text-base">
                      {p.subtitle}
                    </p>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
                      <Diagram
                        nodes={cfg.nodes}
                        links={cfg.links}
                        live={active}
                        running={inView && active}
                        reduce={reduce}
                        fig={`fig. ${pad(i)} · architecture`}
                      />

                      {/* Onglets partagés entre les projets : on compare la même facette */}
                      <div className="min-w-0">
                        <div
                          role="tablist"
                          aria-label={`Détails ${p.title}`}
                          onKeyDown={onTabKey(p.id)}
                          className="flex flex-wrap gap-x-5 border-b border-white/10"
                        >
                          {TABS.map((t, k) => {
                            const act = tab === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                role="tab"
                                id={`proj-${p.id}-tab-${t.id}`}
                                aria-selected={act}
                                aria-controls={`proj-${p.id}-panel-${t.id}`}
                                tabIndex={act ? 0 : -1}
                                onClick={() => {
                                  playTactileClick();
                                  setTab(t.id);
                                }}
                                className={cn(
                                  "relative flex min-h-11 items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors",
                                  act ? "text-foreground" : "text-white/60 hover:text-white/90",
                                  ring
                                )}
                              >
                                <span style={{ color: ACCENT }}>{pad(k)}</span>
                                {t.label}
                                <span
                                  aria-hidden
                                  className={cn(
                                    "absolute inset-x-0 -bottom-px h-px origin-left transition-transform duration-300 motion-reduce:transition-none",
                                    act ? "scale-x-100" : "scale-x-0"
                                  )}
                                  style={{ background: ACCENT }}
                                />
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-6 grid">
                          {TABS.map((t) => {
                            const act = tab === t.id;
                            return (
                              <div
                                key={t.id}
                                id={`proj-${p.id}-panel-${t.id}`}
                                role="tabpanel"
                                aria-labelledby={`proj-${p.id}-tab-${t.id}`}
                                aria-hidden={!act}
                                className={cn(
                                  "col-start-1 row-start-1 min-w-0 transition-opacity duration-300 motion-reduce:transition-none",
                                  act ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
                                )}
                              >
                                {t.id === "anatomy" && (
                                  <>
                                    <p className="max-w-[56ch] text-[15px] leading-[1.7] text-titanium">
                                      {p.problem}
                                    </p>
                                    <dl className="mt-6 space-y-2.5">
                                      {cfg.specs.map((s) => (
                                        <div
                                          key={s.label}
                                          className="grid grid-cols-[7.5rem_1fr] items-baseline gap-x-4"
                                        >
                                          <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/60">
                                            {s.label}
                                          </dt>
                                          <dd className="font-mono text-[12.5px] text-foreground">{s.value}</dd>
                                        </div>
                                      ))}
                                    </dl>
                                  </>
                                )}

                                {t.id === "challenges" && (
                                  <ul className="space-y-5">
                                    {p.difficulties.map((d, k) => (
                                      <li key={k}>
                                        <p className="flex gap-3 text-sm leading-relaxed text-white/90">
                                          <span className="mt-[3px] w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                                            défi
                                          </span>
                                          <span>{d.problem}</span>
                                        </p>
                                        <p className="mt-2 flex gap-3 text-sm leading-relaxed text-titanium">
                                          <span
                                            className="mt-[3px] w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em]"
                                            style={{ color: ACCENT }}
                                          >
                                            solution
                                          </span>
                                          <span>{d.solution}</span>
                                        </p>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {t.id === "features" && (
                                  <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    {p.features.map((f, k) => (
                                      <li key={k} className="flex items-start gap-3 text-sm leading-relaxed text-white/90">
                                        <span
                                          aria-hidden
                                          className="mt-[0.6em] size-[5px] shrink-0 border border-white/40"
                                        />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {t.id === "code" && <CodeBlock code={cfg.code} lang={cfg.lang} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Stack + chaînage + CTA */}
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
                      <div className="min-w-0">
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                          stack
                        </p>
                        <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                          {p.technologies.map((tech) => (
                            <li
                              key={tech}
                              className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/70"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            playTactileClick();
                            selectProject(i + 1, true);
                          }}
                          className={cn("group/chain inline-flex min-h-11 items-center", ring)}
                        >
                          <span className="border-b border-white/25 pb-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors group-hover/chain:text-foreground">
                            {i === n - 1 ? "revoir" : "suivant"} · {i === n - 1 ? PROJECTS[0].title : next.title}{" "}
                            <span aria-hidden style={{ color: ACCENT }}>
                              {i === n - 1 ? "↺" : "→"}
                            </span>
                          </span>
                        </button>

                        <MagneticWrap strength={10}>
                          <Link
                            href={`/projects/${p.id}`}
                            onClick={() => playTactileClick()}
                            className={cn(
                              "group/btn inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition hover:brightness-110",
                              ring
                            )}
                            style={{ background: "var(--hero-cream)", color: "#1a1310" }}
                          >
                            Ouvrir l&apos;étude de cas
                            <span
                              aria-hidden
                              className="transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                            >
                              ↗
                            </span>
                          </Link>
                        </MagneticWrap>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}