"use client";

import { useRef, useMemo, useLayoutEffect, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ───────── Réglages de la scène ───────── */
const FLOOR_Y = -1.2;
const CHIP_X_RATIO = 0.14; // Position au centre-droit, dégagée au-dessus de la carte profil
const CHIP_Y_RATIO = 0.16; // Position surélevée pour être pleinement visible
const STEP = 0.75;
const TRACE_COUNT = 28;
const PACKET_COUNT = 18;

const BUS_LABELS: Array<{ text: string; pos: [number, number, number] }> = [
  { text: "DATA-BUS // REST", pos: [-3.4, FLOOR_Y + 0.12, 1.2] },
  { text: "API-GATEWAY", pos: [3.2, FLOOR_Y + 0.12, 0.9] },
  { text: "SPRING-CORE", pos: [-2.6, FLOOR_Y + 0.12, -2.4] },
  { text: "K8S-NODE", pos: [2.8, FLOOR_Y + 0.12, -2.5] },
  { text: "POSTGRES / ORM", pos: [-1.4, FLOOR_Y + 0.12, 2.6] },
  { text: "EVENT-STREAM", pos: [1.8, FLOOR_Y + 0.12, 2.4] },
];

const TARGET_RETICLES: Array<[number, number, number]> = [
  [-2.25, FLOOR_Y + 0.02, -1.5],
  [2.25, FLOOR_Y + 0.02, -1.5],
  [-1.5, FLOOR_Y + 0.02, 1.5],
  [3.0, FLOOR_Y + 0.02, 1.5],
];

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function useAnchor() {
  const viewport = useThree((s) => s.viewport);
  return { x: viewport.width * CHIP_X_RATIO, y: viewport.height * CHIP_Y_RATIO };
}

/* ───────── Puce Silicium "TN CORE" ───────── */
const PIN_GRID = 11;
const PIN_SPACING = 0.11;
const PIN_RADIUS = 0.014;
const PIN_HEIGHT = 0.09;

function usePinPositions() {
  return useMemo(() => {
    const positions: Array<[number, number]> = [];
    const half = (PIN_GRID - 1) / 2;
    for (let i = 0; i < PIN_GRID; i++) {
      for (let j = 0; j < PIN_GRID; j++) {
        const x = (i - half) * PIN_SPACING;
        const z = (j - half) * PIN_SPACING;
        if (Math.abs(x) < 0.02 && Math.abs(z) < 0.02) continue;
        positions.push([x, z]);
      }
    }
    return positions;
  }, []);
}

function Pins() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const positions = usePinPositions();

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    positions.forEach((pos, i) => {
      dummy.position.set(pos[0], -0.09, pos[1]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, positions.length]}>
      <cylinderGeometry args={[PIN_RADIUS, PIN_RADIUS, PIN_HEIGHT, 8]} />
      <meshStandardMaterial color="#f1f5f9" metalness={1} roughness={0.08} envMapIntensity={2.0} />
    </instancedMesh>
  );
}

function ChipBody() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = 0.76;
    const cut = 0.16;
    s.moveTo(-w + cut, -w);
    s.lineTo(w, -w);
    s.lineTo(w, w);
    s.lineTo(-w, w);
    s.lineTo(-w, -w + cut);
    s.lineTo(-w + cut, -w);
    return s;
  }, []);

  const extrudeSettings = useMemo(
    () => ({ depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4 }),
    []
  );

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#0c0d16"
        metalness={0.92}
        roughness={0.12}
        envMapIntensity={2.2}
      />
    </mesh>
  );
}

function Substrate() {
  return (
    <mesh position={[0, -0.09, 0]}>
      <boxGeometry args={[1.6, 0.05, 1.6]} />
      <meshStandardMaterial color="#080911" metalness={0.6} roughness={0.5} envMapIntensity={1.0} />
    </mesh>
  );
}

function NotchMarker() {
  return (
    <mesh position={[-0.66, 0.03, -0.66]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[0.028, 0.055, 3]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3.0} toneMapped={false} />
    </mesh>
  );
}

function OrbitRings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (a.current) a.current.rotation.z += delta * 0.28;
    if (b.current) b.current.rotation.z -= delta * 0.22;
  });

  return (
    <group rotation={[Math.PI / 2.3, 0, 0]}>
      <mesh ref={a}>
        <torusGeometry args={[1.48, 0.007, 12, 160]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.75} toneMapped={false} />
      </mesh>
      <mesh ref={b} rotation={[0.32, 0, 0]}>
        <torusGeometry args={[1.75, 0.006, 12, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.65} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Chip() {
  const groupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);
  const pointer = usePointerRef();
  const time = useRef(0);

  useFrame((_, delta) => {
    const g = groupRef.current;
    const f = floatRef.current;
    if (!g || !f) return;
    time.current += delta;
    const t = time.current;

    f.position.y = Math.sin(t * 1.2) * 0.08;
    f.rotation.z = Math.sin(t * 0.8) * 0.02;

    g.rotation.y += delta * 0.1;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.52 + pointer.current.y * 0.2, 4, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, pointer.current.x * -0.16, 4, delta);
  });

  return (
    <group ref={floatRef}>
      <group ref={groupRef} scale={1.28}>
        <Substrate />
        <Pins />
        <ChipBody />
        <NotchMarker />
        <Html
          center
          distanceFactor={6.2}
          position={[0, 0.05, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          occlude={false}
          zIndexRange={[0, 0]}
        >
          <div className="pointer-events-none flex select-none flex-col items-center">
            <span className="font-mono text-[13px] font-extrabold uppercase tracking-[0.35em] text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]">
              TN
            </span>
            <span className="font-mono text-[7px] font-bold uppercase tracking-[0.25em] text-cyan-300/90 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">
              DDSI · CORE
            </span>
          </div>
        </Html>
      </group>
    </group>
  );
}

function ChipRig() {
  const { x, y } = useAnchor();
  return (
    <group position={[x, y, 0]}>
      <Chip />
      <OrbitRings />
      <ContactShadows position={[0, FLOOR_Y - y + 0.02, 0]} opacity={0.4} scale={5.5} blur={2.2} far={2.8} color="#000000" />
    </group>
  );
}

/* ───────── Carte mère isométrique avec traces lumineuses ───────── */
type Trace = [THREE.Vector3, THREE.Vector3, THREE.Vector3];

function useTraces(): Trace[] {
  return useMemo(() => {
    const rand = mulberry32(2026);
    const snap = (v: number) => Math.round(v / STEP) * STEP;
    const y = FLOOR_Y + 0.005;
    const traces: Trace[] = [];

    for (let i = 0; i < TRACE_COUNT; i++) {
      const x0 = snap((rand() - 0.5) * 22);
      const z0 = snap((rand() - 0.5) * 18 - 1);
      const horizontalFirst = rand() > 0.5;
      const l1 = (1 + Math.floor(rand() * 4)) * STEP * (rand() > 0.5 ? 1 : -1);
      const l2 = (1 + Math.floor(rand() * 4)) * STEP * (rand() > 0.5 ? 1 : -1);

      const p0 = new THREE.Vector3(x0, y, z0);
      const p1 = horizontalFirst ? new THREE.Vector3(x0 + l1, y, z0) : new THREE.Vector3(x0, y, z0 + l1);
      const p2 = horizontalFirst ? new THREE.Vector3(p1.x, y, z0 + l2) : new THREE.Vector3(x0 + l2, y, p1.z);
      traces.push([p0, p1, p2]);
    }
    return traces;
  }, []);
}

function Reticles() {
  return (
    <group>
      {TARGET_RETICLES.map((pos, i) => (
        <Html key={i} position={pos} center zIndexRange={[0, 0]} occlude={false}>
          <div className="pointer-events-none select-none font-mono text-[10px] text-cyan-400/40 tracking-tighter">
            [ ⌖ ]
          </div>
        </Html>
      ))}
    </group>
  );
}

function MotherboardGrid() {
  const traces = useTraces();

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    traces.forEach(([p0, p1, p2]) => {
      arr.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      arr.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    });
    return new Float32Array(arr);
  }, [traces]);

  const nodePositions = useMemo(() => {
    const arr: number[] = [];
    traces.forEach(([p0, , p2]) => {
      arr.push(p0.x, p0.y + 0.01, p0.z, p2.x, p2.y + 0.01, p2.z);
    });
    return new Float32Array(arr);
  }, [traces]);

  return (
    <group>
      <gridHelper
        args={[44, 58, "#6366f1", "#1e1b4b"]}
        position={[0, FLOOR_Y, 0]}
        material-transparent={true}
        material-opacity={0.55}
      />
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#22d3ee" transparent opacity={0.95} sizeAttenuation toneMapped={false} />
      </points>
      <Packets traces={traces} />
      <Reticles />
    </group>
  );
}

function Packets({ traces }: { traces: Trace[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const time = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(
    () =>
      traces.slice(0, PACKET_COUNT).map((pts, i) => {
        const l1 = pts[0].distanceTo(pts[1]);
        const l2 = pts[1].distanceTo(pts[2]);
        return { pts, l1, l2, total: l1 + l2, speed: 0.48 + (i % 5) * 0.12, offset: (i * 0.37) % 1 };
      }),
    [traces]
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const c = new THREE.Color();
    data.forEach((_, i) => {
      c.set(i % 2 ? "#22d3ee" : "#c084fc");
      mesh.setColorAt(i, c);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    time.current += delta;
    data.forEach((d, i) => {
      const dist = (time.current * d.speed + d.offset * d.total) % d.total;
      if (dist < d.l1) {
        dummy.position.lerpVectors(d.pts[0], d.pts[1], dist / d.l1);
      } else {
        dummy.position.lerpVectors(d.pts[1], d.pts[2], (dist - d.l1) / d.l2);
      }
      dummy.position.y += 0.035;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PACKET_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function BusLabels() {
  const { x } = useAnchor();
  return (
    <group position={[x, 0, 0]}>
      {BUS_LABELS.map((l) => (
        <Html key={l.text} position={l.pos} center zIndexRange={[0, 0]} occlude={false}>
          <div className="pointer-events-none flex select-none items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/80 bg-[#050711]/70 px-2 py-0.5 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
            {l.text}
          </div>
        </Html>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 90;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 5 + FLOOR_Y;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#c7d2fe" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={3.2} position={[0, 3, 2]} scale={[7, 3, 1]} color="#ffffff" />
      <Lightformer form="rect" intensity={2.6} position={[-4, 1, 1]} scale={[3, 4, 1]} color="#7c3aed" />
      <Lightformer form="rect" intensity={2.6} position={[4, -1, 1]} scale={[3, 4, 1]} color="#22d3ee" />
      <Lightformer form="ring" intensity={1.6} position={[0, -2, 3]} scale={[4, 4, 1]} color="#a78bfa" />
    </Environment>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fade = "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)";

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        camera={{ position: [0, 3.0, 9.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 6, 4]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, 2, 3]} intensity={0.7} color="#7c3aed" />
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#22d3ee" />
        <Suspense fallback={null}>
          <Studio />
          <MotherboardGrid />
          <ChipRig />
          <BusLabels />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}