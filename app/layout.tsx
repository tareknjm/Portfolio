import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter_Tight, Instrument_Serif } from "next/font/google";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import CursorSpotlight from "@/components/effects/CursorSpotlight";
import ScrollProgress from "@/components/effects/ScrollProgress";
import "./globals.css";

// Texte courant
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Code, labels, terminal
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titres (.display)
const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// Accent éditorial : phrase rotative du hero uniquement
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tarek Najem — Élève ingénieur Full Stack · Java, Spring & Next.js",
    template: "%s | Tarek Najem",
  },
  description:
    "Portfolio de Tarek Najem, étudiant ingénieur en Développement Digital & Systèmes d'Information à l'EMSI Rabat. Applications web modernes, performantes et centrées utilisateur.",
  metadataBase: new URL("https://tareknajem.dev"),
  openGraph: {
    title: "Tarek Najem — Élève ingénieur Full Stack · Java, Spring & Next.js",
    description:
      "Portfolio de Tarek Najem — applications web modernes, performantes et centrées utilisateur.",
    url: "https://tareknajem.dev",
    siteName: "Tarek Najem",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tarek Najem — Élève ingénieur Full Stack · Java, Spring & Next.js",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarek Najem — Élève ingénieur Full Stack · Java, Spring & Next.js",
    description: "Applications web modernes, performantes et centrées utilisateur.",
  },

};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} ${instrument.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <CursorSpotlight />
        <ScrollProgress />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        {/* CSS-driven cursor glow — reads --cx/--cy set by CursorSpotlight */}
        <div className="cursor-glow" aria-hidden="true" />
        {/* Fine film-grain + vignette overlay — sits above everything, non-interactive */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}