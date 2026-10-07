import { ImageResponse } from "next/og";

export const alt = "Tarek Najem — Software Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#050507",
          padding: "90px",
          position: "relative",
        }}
      >
        {/* ambient glows */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            display: "flex",
            background: "radial-gradient(circle, rgba(124,58,237,0.38), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -160,
            width: 620,
            height: 620,
            display: "flex",
            background: "radial-gradient(circle, rgba(34,211,238,0.22), transparent 60%)",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            color: "#8b8b96",
            textTransform: "uppercase",
          }}
        >
          Software Engineer · Full-Stack Developer
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>
            TAREK
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 700,
              lineHeight: 1,
              backgroundImage: "linear-gradient(100deg,#ffffff,#c7d2fe,#a5f3fc,#ffffff,#ddd6fe)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            NAJEM
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 42, fontSize: 34, color: "rgba(255,255,255,0.7)" }}>
          I build digital systems that feel alive.
        </div>
      </div>
    ),
    { ...size }
  );
}
