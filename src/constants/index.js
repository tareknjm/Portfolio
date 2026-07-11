import {
  Home, User, Code2, Briefcase, FolderGit2, GraduationCap, Mail,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export const PERSONAL_INFO = {
  name: "TAREK NAJEM",
  role: "Développeur Full Stack",
  roles: [
    "Développeur Full Stack",
    "Étudiant Ingénierie informatique et réseaux - EMSI RABAT",
    "Passionné de Web Moderne",
  ],
  tagline: "Je conçois des applications web modernes, performantes et centrées utilisateur.",
  location: "Rabat, Maroc",
  email: "tareknajem19@gmail.com",
  github: "https://github.com/tareknjm",
  linkedin: "https://www.linkedin.com/in/tarek-najem-615554291/",
  cvUrl: "/cv.pdf",
  photo: "/profile.jpg",
};

export const NAV_LINKS = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "about", label: "À propos", icon: User },
  { id: "skills", label: "Compétences", icon: Code2 },
  { id: "experience", label: "Expériences", icon: Briefcase },
  { id: "projects", label: "Projets", icon: FolderGit2 },
  { id: "github", label: "GitHub", icon: FaGithub },
  { id: "education", label: "Formation", icon: GraduationCap },
  { id: "contact", label: "Contact", icon: Mail },
];

export const COLORS = {
  primary: "#8b5cf6",
  accent: "#22d3ee",
};
