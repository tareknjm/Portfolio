import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Code2,
  Lock,
  Check,
  Sparkles,
} from "lucide-react";
import { EDUCATION } from "../../data/education";
import { EXPERIENCES } from "../../data/experience";
import { PROJECTS } from "../../data/projects";

const COLOR_MAP = {
  education: { text: "#a855f7", bg: "rgba(168, 85, 247, 0.15)", border: "#a855f7" },
  experience: { text: "#22d3ee", bg: "rgba(34, 211, 238, 0.15)", border: "#22d3ee" },
  project: { text: "#34d399", bg: "rgba(52, 211, 153, 0.15)", border: "#34d399" },
};

const ICON_MAP = {
  education: GraduationCap,
  experience: Briefcase,
  project: Code2,
};

// Ordre chronologique construit à la main à partir des 3 sources de données.
// Les projets n'ayant pas de champ "period", ils sont positionnés selon leur
// stack technique probable — ajuste l'ordre ici si besoin.
const QUEST_STEPS = [
  { type: "education", data: EDUCATION[2], year: "2021-22" }, // Baccalauréat
  { type: "education", data: EDUCATION[1], year: "2022-24" }, // Cycle Prépa
  { type: "experience", data: EXPERIENCES[2], year: "2024" }, // MAP
  { type: "project", data: PROJECTS[0], year: "2024" }, // TYMK Services
  { type: "project", data: PROJECTS[2], year: "2025" }, // CabinetPro
  { type: "experience", data: EXPERIENCES[1], year: "2025" }, // CMR
  { type: "education", data: EDUCATION[0], year: "En cours" }, // Cycle Ingénieur DDSI
  { type: "experience", data: EXPERIENCES[0], year: "2026" }, // CMR HealthCheck
  { type: "project", data: PROJECTS[1], year: "2026" }, // E-Learn
];

function getFields(step) {
  const { type, data } = step;
  if (type === "education") {
    return {
      title: data.title,
      subtitle: `${data.subtitle} — ${data.institution}`,
      description: data.description,
      tags: null,
    };
  }
  if (type === "experience") {
    return {
      title: `${data.company} — ${data.role}`,
      subtitle: data.period,
      description: data.description,
      tags: data.technologies,
    };
  }
  return {
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    tags: data.technologies,
  };
}

function PortfolioQuest({ onClose }) {
  const [unlocked, setUnlocked] = useState(1);
  const [activeIndex, setActiveIndex] = useState(null);
  const [finished, setFinished] = useState(false);

  const total = QUEST_STEPS.length;

  function openNode(index) {
    if (index < unlocked) {
      setActiveIndex(index);
    }
  }

  function advance() {
    const next = activeIndex + 1;
    setActiveIndex(null);
    if (next >= total) {
      setUnlocked(total);
      setFinished(true);
    } else {
      setUnlocked(function (u) { return Math.max(u, next + 1); });
    }
  }

  function restart() {
    setUnlocked(1);
    setActiveIndex(null);
    setFinished(false);
  }

  const activeStep = activeIndex !== null ? QUEST_STEPS[activeIndex] : null;
  const activeFields = activeStep ? getFields(activeStep) : null;
  const activeColors = activeStep ? COLOR_MAP[activeStep.type] : null;

  return (
    <div className="w-[340px] sm:w-[440px] flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">
          Quête du parcours
        </p>
        <h3 className="text-lg font-bold text-white">
          {finished ? "Voyage terminé 🎉" : `Étape ${unlocked} / ${total}`}
        </h3>
      </div>

      <div className="relative w-full h-[420px] overflow-y-auto px-2 py-4">
        <div className="relative flex flex-col items-center gap-1">
          {QUEST_STEPS.map(function (step, index) {
            const Icon = ICON_MAP[step.type];
            const colors = COLOR_MAP[step.type];
            const isUnlocked = index < unlocked;
            const isDone = index < unlocked - 1 || finished;
            const isLast = index === QUEST_STEPS.length - 1;
            const fields = getFields(step);

            return (
              <div key={step.type + index} className="flex flex-col items-center">
                <motion.button
                  onClick={function () { openNode(index); }}
                  disabled={!isUnlocked}
                  whileHover={isUnlocked ? { scale: 1.08 } : {}}
                  whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  className="relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors"
                  style={{
                    borderColor: isUnlocked ? colors.border : "rgba(255,255,255,0.1)",
                    backgroundColor: isUnlocked ? colors.bg : "rgba(255,255,255,0.02)",
                  }}
                  title={fields.title}
                >
                  {isDone ? (
                    <Check size={22} color={colors.text} />
                  ) : isUnlocked ? (
                    <Icon size={20} color={colors.text} />
                  ) : (
                    <Lock size={16} className="text-white/20" />
                  )}
                  {isUnlocked && !isDone && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${colors.border}` }}
                      animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                <span className="text-[10px] text-white/40 mt-1 mb-1 font-mono">
                  {step.year}
                </span>

                {!isLast && (
                  <motion.div
                    className="w-[2px] h-8"
                    style={{
                      backgroundColor: index < unlocked - 1 || finished
                        ? colors.border
                        : "rgba(255,255,255,0.08)",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeStep && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="w-full p-4 rounded-xl border"
            style={{ borderColor: activeColors.border, backgroundColor: activeColors.bg }}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: activeColors.text }}>
              {activeStep.year}
            </span>
            <h4 className="text-white font-bold mt-0.5">{activeFields.title}</h4>
            <p className="text-xs text-white/70 mt-0.5">{activeFields.subtitle}</p>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {activeFields.description}
            </p>
            {activeFields.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {activeFields.tags.map(function (tag) {
                  return (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white/50">
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
            <button
              onClick={advance}
              className="mt-3 w-full py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: activeColors.border }}
            >
              Continuer l'aventure →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {finished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Sparkles className="mx-auto mb-1 text-purple-400" size={22} />
          <p className="text-white font-bold">Merci d'avoir suivi le voyage !</p>
          <p className="text-xs text-white/50 mt-1">
            Du bac à E-Learn, chaque étape a construit la suivante.
          </p>
          <button
            onClick={restart}
            className="mt-3 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors"
          >
            Revivre le parcours
          </button>
        </motion.div>
      )}

      <button
        onClick={onClose}
        className="text-sm text-white/50 hover:text-white transition-colors"
      >
        Retour au portfolio →
      </button>
    </div>
  );
}

export default PortfolioQuest;