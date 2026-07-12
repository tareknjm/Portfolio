import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

// Chaque section a sa propre couleur d'identité
const NAV_COLORS = {
  home: { text: "text-primary-light", bg: "bg-primary/15", ring: "ring-primary/40", glow: "shadow-glow" },
  about: { text: "text-cyan-300", bg: "bg-cyan-400/15", ring: "ring-cyan-400/40", glow: "shadow-glow-cyan" },
  skills: { text: "text-emerald-300", bg: "bg-emerald-400/15", ring: "ring-emerald-400/40", glow: "shadow-[0_0_40px_rgba(52,211,153,0.3)]" },
  experience: { text: "text-amber-300", bg: "bg-amber-400/15", ring: "ring-amber-400/40", glow: "shadow-[0_0_40px_rgba(252,211,77,0.3)]" },
  projects: { text: "text-pink-300", bg: "bg-pink-400/15", ring: "ring-pink-400/40", glow: "shadow-[0_0_40px_rgba(244,114,182,0.3)]" },
  github: { text: "text-slate-200", bg: "bg-slate-400/15", ring: "ring-slate-400/40", glow: "shadow-[0_0_40px_rgba(203,213,225,0.25)]" },
  education: { text: "text-orange-300", bg: "bg-orange-400/15", ring: "ring-orange-400/40", glow: "shadow-[0_0_40px_rgba(253,186,116,0.3)]" },
  contact: { text: "text-red-300", bg: "bg-red-400/15", ring: "ring-red-400/40", glow: "shadow-[0_0_40px_rgba(248,113,113,0.3)]" },
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((l) => l.id));

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Navbar Desktop */}
<div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
  <motion.nav
    initial={{ y: -80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="flex items-stretch bg-[#08080d]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/40 overflow-hidden max-w-[95vw]">
      {NAV_LINKS.map(({ id, label, icon: Icon }, i) => {
        const isActive = activeSection === id;
        const colors = NAV_COLORS[id];
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 px-3 py-2.5 min-w-[58px] transition-colors duration-300",
              i !== 0 && "border-l border-white/5",
              isActive ? colors.text : "text-white/40 hover:text-white/80"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="navActiveBg"
                className={cn("absolute inset-0.5 rounded-xl ring-1", colors.bg, colors.ring, colors.glow)}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
            <span className="relative z-10 text-[9px] font-medium tracking-wide uppercase whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </motion.nav>
</div>
      {/* Navbar Mobile — bouton burger flottant */}
      <div className="fixed top-6 right-6 z-50 lg:hidden">
<button
  onClick={function () { setMobileOpen(!mobileOpen); }}
  aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
  className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#08080d]/90 backdrop-blur-xl border border-white/10 shadow-lg"
>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg lg:hidden flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              {NAV_LINKS.map(({ id, label, icon: Icon }, i) => {
                const colors = NAV_COLORS[id];
                const isActive = activeSection === id;
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(id)}
                    className={cn(
                      "flex items-center gap-3 text-xl font-medium transition-colors",
                      isActive ? colors.text : "text-white/60"
                    )}
                  >
                    <Icon size={22} />
                    {label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}