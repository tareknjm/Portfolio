import { ImageResponse } from "next/og";
import { PROJECTS } from "@/lib/data";

export const alt = "Projet — Tarek Najem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pre-render OG images for every known project at build time.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  const title = project?.title ?? "Projet";
  const subtitle = project?.subtitle ?? "";
  const stack = project?.technologies.slice(0, 6) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050507",
          padding: "90px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            display: "flex",
            background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -160,
            width: 560,
            height: 560,
            display: "flex",
            background: "radial-gradient(circle, rgba(34,211,238,0.20), transparent 60%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#8b8b96",
            textTransform: "uppercase",
          }}
        >
          Étude de cas · Tarek Najem
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }}>
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 20,
                fontSize: 30,
                color: "rgba(255,255,255,0.65)",
                maxWidth: 960,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {stack.map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.8)",
                fontSize: 22,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
