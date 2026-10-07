import { PERSONAL_INFO } from "@/lib/data";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { href: PERSONAL_INFO.github, label: "GitHub", Icon: FaGithub },
    { href: PERSONAL_INFO.linkedin, label: "LinkedIn", Icon: FaLinkedin },
    { href: `mailto:${PERSONAL_INFO.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="border-t border-white/[0.06]">
      <div className="section-container !py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Merci d&apos;avoir scrollé</p>
            <h2 className="chrome-text display text-5xl font-bold sm:text-7xl">
              TAREK NAJEM
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hairline flex h-11 w-11 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-sm text-white/40 sm:flex-row sm:items-center">
          <p>
            © {year} {PERSONAL_INFO.name}. Tous droits réservés.
          </p>
          <p className="font-mono text-xs">Conçu &amp; développé avec Next.js</p>
        </div>
      </div>
    </footer>
  );
}
