import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { EDUCATION } from "@/data/education";

export default function Education() {
  return (
    <section id="education" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">07. Formation</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Mon parcours academique</h2>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        {EDUCATION.map(function (item, i) {
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-solid p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary-light shrink-0">
                <GraduationCap size={22} />
              </div>
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <span className="text-xs font-mono text-white/50">{item.period}</span>
                </div>
                <p className="text-sm text-accent mb-1">{item.subtitle}</p>
                <p className="text-sm text-muted mb-3">{item.institution}</p>
                <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}