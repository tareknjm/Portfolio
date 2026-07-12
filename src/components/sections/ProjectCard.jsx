import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ChevronDown, ImageOff } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { COLOR_MAP } from "@/constants";
import { cn } from "@/lib/utils";

export default function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const colors = COLOR_MAP[project.color];

  const toggleExpanded = () => setExpanded(!expanded);
  const handleImgError = () => setImgError(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card-solid overflow-hidden group hover:border-white/20 transition-colors duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-surface2">
        {!imgError ? (
          <img
            src={project.image}
            alt={project.title}
            onError={handleImgError}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn("w-full h-full flex flex-col items-center justify-center gap-2", colors.bgSoft)}>
            <ImageOff size={28} className={colors.text} />
            <span className="text-xs text-white/40">Image a venir</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080d] via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4">
          <h3 className="text-lg font-bold text-white">{project.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-white/60 mb-4">{project.subtitle}</p>
        <p className="text-sm text-white/70 leading-relaxed mb-4">{project.description}</p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className={colors.border}>
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mb-4">
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
              Fonctionnalites cles
            </button>
            {expanded && (
              <ul className="mt-3 space-y-1.5">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-2 text-xs text-muted leading-relaxed">
                    <span className={colors.text}>-</span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FaGithub size={14} />
              Code
            </a>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white/5 text-white/30 cursor-not-allowed">
              <FaGithub size={14} />
              Prive
            </span>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors", colors.bgSoft, colors.text)}
            >
              <ExternalLink size={14} />
              Demo
            </a>
          )}
          <a
            href={"/projects/" + project.id}
            className="ml-auto text-xs font-medium text-white/50 hover:text-white transition-colors"
          >
            Voir details
          </a>
        </div>
      </div>
    </motion.div>
  );
}