import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle2, Terminal, Minus, Plus } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { PROJECTS } from "@/data/projects";
import { COLOR_MAP } from "@/constants";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const slug = params.slug;
  const project = PROJECTS.find(function (p) {
    return p.id === slug;
  });

  const goToProjects = (e) => {
    e.preventDefault();
    navigate("/#projects");
    // Le routeur ne scrolle pas automatiquement vers l'ancre apres un
    // changement de route cote client : on le fait manuellement une fois
    // que la page d'accueil a eu le temps de se monter.
    window.setTimeout(function () {
      const section = document.getElementById("projects");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  if (!project) {
    return (
      <Layout>
        <div className="section-container min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl font-bold gradient-text mb-4">Projet introuvable</h1>
          <p className="text-muted mb-6">Ce projet n'existe pas ou a ete retire.</p>
          <a
            href="/#projects"
            onClick={goToProjects}
            className="flex items-center gap-2 text-primary-light hover:underline"
          >
            <ArrowLeft size={16} />
            Retour aux projets
          </a>
        </div>
      </Layout>
    );
  }

  const colors = COLOR_MAP[project.color];

  return (
    <Layout>
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full blur-3xl opacity-20",
            colors.bgSoft
          )}
        />

        <div className="section-container !pt-32 relative">
          <a
            href="/#projects"
            onClick={goToProjects}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
          >
            <ArrowLeft size={16} />
            Retour aux projets
          </a>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              variants={fadeUp}
              className={cn("font-mono text-xs mb-3 tracking-[0.2em] uppercase", colors.text)}
            >
              Etude de cas · Projet
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-[1.05] tracking-tight"
            >
              {project.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-muted max-w-2xl mb-8">
              {project.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <FaGithub size={16} />
                  Voir le code
                </a>
              ) : (
                <span className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-white/5 text-white/30 cursor-not-allowed">
                  <FaGithub size={16} />
                  Depot prive
                </span>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                    colors.bgSoft,
                    colors.text
                  )}
                >
                  <ExternalLink size={16} />
                  Voir la demo
                </a>
              )}
            </motion.div>

            {/* Tech spec strip — surfaced right under the hero, not buried in a sidebar */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6"
            >
              <span className="font-mono text-[11px] tracking-widest uppercase text-white/40">
                Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(function (tech) {
                  return (
                    <Badge key={tech} variant="outline" className={colors.border}>
                      {tech}
                    </Badge>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="section-container">
        {project.gallery && project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="grid sm:grid-cols-2 gap-4 mb-16"
          >
            {project.gallery.map(function (img, i) {
              return (
                <div
                  key={img}
                  className={cn(
                    "group rounded-2xl overflow-hidden border border-white/10",
                    i === 0 && "sm:col-span-2"
                  )}
                >
                  <img
                    src={img}
                    alt={project.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              );
            })}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-10 pb-24">
          <div className="lg:col-span-2 space-y-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">A propos du projet</h2>
              <p className="text-white/70 leading-relaxed">{project.description}</p>

              {project.problem && (
                <div className={cn("mt-6 pl-5 border-l-2", colors.border)}>
                  <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-2">
                    Problematique
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">{project.problem}</p>
                </div>
              )}
            </motion.div>

            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-5">Fonctionnalites cles</h2>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {project.features.map(function (f) {
                    return (
                      <li key={f} className="flex gap-2.5 text-sm text-white/70 leading-relaxed">
                        <CheckCircle2 size={16} className={cn("shrink-0 mt-0.5", colors.text)} />
                        {f}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}

            {project.difficulties && project.difficulties.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  <Terminal size={18} className="text-white/40" />
                  Difficultes et solutions
                </h2>
                <p className="text-sm text-white/40 mb-5">
                  Extrait du journal de developpement du projet.
                </p>

                <div className="rounded-2xl border border-white/10 bg-black/30 overflow-hidden divide-y divide-white/10">
                  {project.difficulties.map(function (d, i) {
                    return (
                      <div key={i} className="p-5 sm:p-6 font-mono text-sm leading-relaxed space-y-3">
                        <div className="flex gap-3">
                          <Minus size={16} className="shrink-0 mt-0.5 text-rose-400" />
                          <p className="text-rose-200/80">{d.problem}</p>
                        </div>
                        <div className="flex gap-3">
                          <Plus size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                          <p className="text-emerald-200/80">{d.solution}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="card-solid p-5 sticky top-24 space-y-5">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">
                  Fiche technique
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(function (tech) {
                    return (
                      <Badge key={tech} variant="outline" className={colors.border}>
                        {tech}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {(project.github || project.demo) && (
                <div className="border-t border-white/10 pt-5 flex flex-col gap-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
                    >
                      <FaGithub size={14} />
                      Depot du code
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-md"
                    >
                      <ExternalLink size={14} />
                      Demo en ligne
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}