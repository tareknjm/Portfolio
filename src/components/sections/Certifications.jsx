import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { CERTIFICATES } from "@/data/certificates";

const BADGE_COLORS = [
  "text-primary-light border-primary/30 bg-primary/10",
  "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
  "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  "text-amber-300 border-amber-400/30 bg-amber-400/10",
  "text-pink-300 border-pink-400/30 bg-pink-400/10",
];

export default function Certifications() {
  return (
    <section id="certifications" className="section-container !pt-0">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATES.map((cert, i) => {
          const colorClass = BADGE_COLORS[i % BADGE_COLORS.length];
          return (
            <motion.a
              key={cert.title}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card-solid p-5 group hover:border-white/20 transition-colors duration-300 flex flex-col"
            >
              <div className={"w-10 h-10 rounded-lg border flex items-center justify-center mb-3 " + colorClass}>
                <Award size={18} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1 leading-snug">{cert.title}</h3>
              <p className="text-xs text-muted mb-1">{cert.org}</p>
              <p className="text-xs text-white/40 mb-3">{cert.date}</p>
              <span className="mt-auto flex items-center gap-1.5 text-xs font-medium text-white/50 group-hover:text-white transition-colors">
                <ExternalLink size={12} />
                Voir le certificat
              </span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}