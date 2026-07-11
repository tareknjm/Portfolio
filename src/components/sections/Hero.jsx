import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Download, Mail, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PERSONAL_INFO } from "@/constants";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden section-container !py-0">
      <motion.div
        className="absolute top-1/4 left-[8%] w-4 h-4 rounded-full bg-primary/60 blur-[2px]"
        animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[60%] left-[15%] w-6 h-6 rounded-full bg-accent/50 blur-[2px]"
        animate={{ y: [0, 25, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[20%] right-[12%] w-8 h-8 rounded-2xl border border-primary/30 rotate-12"
        animate={{ rotate: [12, 45, 12], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] right-[8%] w-3 h-3 rounded-full bg-cyan-300/60 blur-[1px]"
        animate={{ y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-accent font-mono text-sm mb-4 tracking-wider"
          >
            Bienvenue sur mon portfolio
          </motion.p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Salut, je suis <span className="gradient-text">{PERSONAL_INFO.name}</span>
          </h1>

          <div className="h-10 mb-6">
            <span className="text-xl sm:text-2xl font-semibold text-white/80">
              <Typewriter
                words={PERSONAL_INFO.roles}
                loop={true}
                cursor
                cursorStyle="_"
                typeSpeed={60}
                deleteSpeed={40}
                delaySpeed={1800}
              />
            </span>
          </div>

          <p className="text-muted text-lg max-w-lg mx-auto md:mx-0 mb-8">
            {PERSONAL_INFO.tagline}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <a href={PERSONAL_INFO.cvUrl} download>
              <Button variant="default" size="lg">
                <Download size={18} />
                Telecharger CV
              </Button>
            </a>
            <a href="#contact" onClick={scrollToContact}>
              <Button variant="outline" size="lg">
                <Mail size={18} />
                Me contacter
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="glass glass-hover w-11 h-11 flex items-center justify-center rounded-full">
              <FaGithub size={20} />
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="glass glass-hover w-11 h-11 flex items-center justify-center rounded-full">
              <FaLinkedin size={20} />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex justify-center md:justify-end"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary via-accent to-primary opacity-40 blur-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-glow">
              <img src={PERSONAL_INFO.photo} alt={PERSONAL_INFO.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}