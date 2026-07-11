import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((l) => l.id));

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      {/* Navbar Desktop — pill flottante centrée */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="glass flex items-center gap-1 px-2 py-2 shadow-lg shadow-black/20">
          {NAV_LINKS.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "group relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/90"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-primary shadow-glow -z-10"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <Icon size={16} />
                <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 transition-all duration-300">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* Navbar Mobile — bouton burger flottant */}
      <div className="fixed top-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="glass flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
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
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              {NAV_LINKS.map(({ id, label, icon: Icon }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(id)}
                  className={cn(
                    "flex items-center gap-3 text-xl font-medium transition-colors",
                    activeSection === id ? "gradient-text" : "text-white/60"
                  )}
                >
                  <Icon size={22} />
                  {label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}