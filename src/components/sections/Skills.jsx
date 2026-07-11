import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/data/skills";
import { COLOR_MAP } from "@/constants";

function SkillBar({ name, level, color, delay }) {
  const colors = COLOR_MAP[color];
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-white/90">{name}</span>
        <span className={`text-xs font-mono ${colors.text}`}>{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${colors.bg}`}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">03. Compétences</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Ma boîte à outils</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((category, catIndex) => {
          const colors = COLOR_MAP[category.color];
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="bento-card"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                <h3 className="font-semibold text-lg text-white">{category.title}</h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill, i) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    color={category.color}
                    delay={i * 0.08}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}