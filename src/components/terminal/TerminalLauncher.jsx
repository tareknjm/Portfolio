import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
import Terminal from "./Terminal";

function TerminalLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={function () { setOpen(true); }}
        aria-label="Ouvrir le terminal"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl text-white/70 hover:text-white hover:border-cyan-400/50 transition-colors shadow-lg"
      >
        <TerminalSquare size={18} />
        <span className="hidden sm:inline text-sm font-medium font-mono">{"> _"}</span>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={function (e) { e.stopPropagation(); }}
            >
              <Terminal onClose={function () { setOpen(false); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TerminalLauncher;