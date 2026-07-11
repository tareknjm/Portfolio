import { Mail, ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { PERSONAL_INFO } from "@/constants";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/10 mt-20">
      <div className="section-container !py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold gradient-text">{PERSONAL_INFO.name}</p>
          <p className="text-sm text-muted mt-1">
            {"© " + new Date().getFullYear() + " — Conçu et développé avec React & Framer Motion"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full">
            <FaGithub size={18} />
          </a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full">
            <FaLinkedin size={18} />
          </a>
          <a href={"mailto:" + PERSONAL_INFO.email} className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full">
            <Mail size={18} />
          </a>
          <button onClick={scrollTop} className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full" aria-label="Retour en haut">
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}