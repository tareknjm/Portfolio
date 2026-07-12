import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Map, X } from "lucide-react";
import PortfolioQuest from "./PortfolioQuest";

function GameLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={function () { setOpen(true); }}
        aria-label="Explorer le parcours"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl text-white/70 hover:text-white hover:border-purple-400/50 transition-colors shadow-lg"
      >
        <Map size={18} />
        <span className="hidden sm:inline text-sm font-medium">Explorer le parcours</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            onClick={function () { setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={function (e) { e.stopPropagation(); }}
              className="relative p-6 rounded-3xl bg-[#0f0a1e] border border-white/10 max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={function () { setOpen(false); }}
                aria-label="Fermer"
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>

              <PortfolioQuest onClose={function () { setOpen(false); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GameLauncher;