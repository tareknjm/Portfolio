// Navigation
export interface NavLink {
  id: string;
  label: string;
  icon: string; // lucide icon name as string, resolved at component level
}

// Personal info
export interface PersonalInfo {
  name: string;
  role: string;
  roles: string[];
  tagline: string;
  /** Short English brand line used as the hero statement. */
  brandTagline: string;
  /** Current availability, shown as a minimal status chip. */
  availability: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  photo: string;
}

// Projects
export interface ProjectDifficulty {
  problem: string;
  solution: string;
}

export type ProjectColor = "primary" | "cyan" | "emerald" | "amber" | "pink";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gallery: string[];
  description: string;
  problem: string;
  technologies: string[];
  features: string[];
  difficulties: ProjectDifficulty[];
  github: string;
  demo: string;
  color: ProjectColor;
}

// Skills
export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Testing"
  | "Langages"
  | "Données"
  | "Donnees"
  | "DevOps"
  | "Workflow";

export interface Skill {
  name: string;
  category: SkillCategory;
  description: string;
}

// Experience
export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  color: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Certificates
export interface Certificate {
  title: string;
  org: string;
  date: string;
  url: string;
}

// Education
export interface Education {
  title: string;
  subtitle: string;
  institution: string;
  period: string;
  description: string;
}

// Dashboard
export interface DashboardStat {
  label: string;
  value: number;
  suffix: string;
}

// Color Map for themed components
export interface ColorMapEntry {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
}
