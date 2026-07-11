import { motion } from "framer-motion";
import { GraduationCap, MapPin, Sparkles, Target } from "lucide-react";
import { PERSONAL_INFO } from "@/constants";

const ABOUT_CARDS = [
  {
    icon: GraduationCap,
    title: "Parcours",
    text: "Étudiant ingénieur à l'EMSI Rabat, spécialisation Développement Digital & Systèmes d'Information (DDSI).",
  },
  {
    icon: MapPin,
    title: "Localisation",
    text: `Basé à ${PERSONAL_INFO.location}, ouvert aux opportunités à distance ou sur site.`,
  },
  {
    icon: Target,
    title: "Ce que je recherche",
    text: "Un stage ou une opportunité en développement Full Stack où je peux apprendre, contribuer et grandir techniquement.",
  },
  {
    icon: Sparkles,
    title: "Domaines favoris",
    text: "Développement web moderne, architecture logicielle, dashboards data-driven et expériences utilisateur soignées.",
  },
];

export default function About() {
  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">02. À propos</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Qui suis-je ?</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {ABOUT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bento-card group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary-light shrink-0 group-hover:scale-110 transition-transform">
                <card.icon size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{card.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{card.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}