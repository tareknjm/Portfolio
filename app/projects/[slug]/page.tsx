import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal, Minus, Plus } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { PROJECTS, COLOR_MAP } from "@/lib/data";
import { cn } from "@/lib/utils";

// — SSG: pre-render all project pages at build time
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

// — Dynamic metadata per project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) return { title: "Projet introuvable" };

  return {
    title: project.title,
    description: project.subtitle,
    openGraph: {
      title: `${project.title} — Tarek Najem`,
      description: project.description,
      images: [{ url: project.image, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);
  if (!project) notFound();

  const colors = COLOR_MAP[project.color];

  return (
    <>
      {/* Navbar is in root layout, but for project pages we need a back nav */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className={cn(
            "pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full blur-3xl opacity-15",
            colors.bgSoft
          )}
        />

        <div className="section-container !pt-32 relative">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Retour aux projets
          </Link>

          {/* Header */}
          <div>
            <p
              className={cn(
                "font-mono text-xs mb-3 tracking-[0.2em] uppercase",
                colors.text
              )}
            >
              Étude de cas · Projet
            </p>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-[1.05] tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg text-muted max-w-2xl mb-8">
              {project.subtitle}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <FaGithub size={16} />
                  Voir le code
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-white/5 text-white/30 cursor-not-allowed">
                  <FaGithub size={16} />
                  Dépôt privé
                </span>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors",
                    colors.bgSoft,
                    colors.text
                  )}
                >
                  <ExternalLink size={16} />
                  Voir la démo
                </a>
              )}
            </div>

            {/* Tech strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
              <span className="font-mono text-[11px] tracking-widest uppercase text-white/40">
                Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-md border",
                      colors.border,
                      "text-white/70"
                    )}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="section-container">
        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mb-16">
            {project.gallery.map((img, i) => (
              <div
                key={img}
                className={cn(
                  "relative rounded-2xl overflow-hidden border border-white/10 aspect-video",
                  i === 0 && "sm:col-span-2"
                )}
              >
                <Image
                  src={img}
                  alt={`${project.title} - capture ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes={i === 0 ? "100vw" : "50vw"}
                />
              </div>
            ))}
          </div>
        )}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-10 pb-24">
          <div className="lg:col-span-2 space-y-14">
            {/* About */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                À propos du projet
              </h2>
              <p className="text-white/70 leading-relaxed">
                {project.description}
              </p>

              {project.problem && (
                <div className={cn("mt-6 pl-5 border-l-2", colors.border)}>
                  <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-2">
                    Problématique
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {project.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-5">
                  Fonctionnalités clés
                </h2>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {project.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2.5 text-sm text-white/70 leading-relaxed"
                    >
                      <CheckCircle2
                        size={16}
                        className={cn("shrink-0 mt-0.5", colors.text)}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Difficulties */}
            {project.difficulties.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Terminal size={18} className="text-white/40" />
                  Difficultés et solutions
                </h2>
                <p className="text-sm text-white/40 mb-5">
                  Extrait du journal de développement du projet.
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden divide-y divide-white/10">
                  {project.difficulties.map((d, i) => (
                    <div
                      key={i}
                      className="p-5 sm:p-6 font-mono text-sm leading-relaxed space-y-3"
                    >
                      <div className="flex gap-3">
                        <Minus
                          size={16}
                          className="shrink-0 mt-0.5 text-rose-400"
                        />
                        <p className="text-rose-200/80">{d.problem}</p>
                      </div>
                      <div className="flex gap-3">
                        <Plus
                          size={16}
                          className="shrink-0 mt-0.5 text-emerald-400"
                        />
                        <p className="text-emerald-200/80">{d.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-surface p-5 sticky top-24 space-y-5">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">
                  Fiche technique
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md border",
                        colors.border,
                        "text-white/70"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {(project.github || project.demo) && (
                <div className="border-t border-white/10 pt-5 flex flex-col gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <FaGithub size={14} />
                      Dépôt du code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <ExternalLink size={14} />
                      Démo en ligne
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
