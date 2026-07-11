import { motion } from "framer-motion";
import { Briefcase, Calendar, Terminal } from "lucide-react";
import { EXPERIENCES } from "@/data/experience";
import { COLOR_MAP } from "@/constants";
import { Badge } from "@/components/ui/badge";

function ExperienceCard({ exp, index }) {
  const colors = COLOR_MAP[exp.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative pl-8 md:pl-24 pb-16 last:pb-0"
    >
      {/* Ligne verticale */}
      <div className="absolute left-[7px] md:left-[31px] top-2 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent last:hidden" />

      {/* Noeud numéroté */}
      <div
        className={`absolute left-0 md:left-6 top-0 w-4 h-4 rounded-full ${colors.bg} shadow-glow ring-4 ring-background z-10`}
      />

      {/* Badge numéro (desktop) */}
      <div className="hidden md:flex absolute left-[-2px] top-8 items-center gap-2 text-xs font-mono text-white/30">
        <Terminal size={12} />
        exp_0{index + 1}
      </div>

      {/* Carte */}
      <div className="card-solid p-6 hover:border-white/20 transition-colors duration-300">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${colors.bgSoft} flex items-center justify-center ${colors.text}`}>
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{exp.company}</h3>
              <p className="text-sm text-muted">{exp.role}</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono text-white/50">
            <Calendar size={12} />
            {exp.period}
          </span>
        </div>

        <p className="text-sm text-white/70 mb-4 leading-relaxed">{exp.description}</p>

        <ul className="space-y-2 mb-4">
          {exp.achievements.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-muted">
              <span className={`${colors.text} mt-1`}>▸</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className={colors.border}>
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">04. Expériences</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Mon parcours professionnel</h2>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {EXPERIENCES.map((exp, i) => (
          <ExperienceCard key={exp.id} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}