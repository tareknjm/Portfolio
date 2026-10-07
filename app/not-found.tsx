import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        <p className="font-mono text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-3">
          Page introuvable
        </h1>
        <p className="text-white/50 max-w-md mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors shadow-glow"
        >
          <ArrowLeft size={16} />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
