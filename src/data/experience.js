export const EXPERIENCES = [
  {
    id: "cmr-healthcheck",
    company: "CMR",
    role: "Développeur Full Stack — Stagiaire (en cours)",
    period: "2026 — 2 mois",
    color: "emerald",
    description:
      "Conception et développement de HealthCheck Monitor, une application web de supervision de services HTTP/HTTPS avec détection automatique de pannes et notifications.",
    achievements: [
      "Développement d'un système de vérification périodique automatisée des endpoints (disponibilité, temps de réponse)",
      "Mise en place de l'authentification sécurisée avec Spring Security et JWT",
      "Système de notifications par email via JavaMailSender lors des incidents",
      "Tableau de bord temps réel avec statistiques et historique des incidents (Chart.js, Redux Toolkit)",
    ],
    technologies: ["Java 21", "Spring Boot", "Spring Security", "JWT", "React", "Redux Toolkit", "SQLite"],
  },
  {
    id: "cmr",
    company: "CMR",
    role: "Développeur Full Stack — Stagiaire",
    period: "2025",
    color: "primary",
    description:
      "Développement d'une interface web de suivi des dossiers d'infirmité avec tableaux de bord décisionnels.",
    achievements: [
      "Conception et développement de l'interface de gestion des dossiers",
      "Intégration de tableaux de bord décisionnels avec visualisation de données",
      "Mise en place de l'API backend avec Spring Boot",
    ],
    technologies: ["Spring Boot", "React", "PostgreSQL", "Power BI"],
  },
  {
    id: "map",
    company: "MAP",
    role: "Développeur Web — Stagiaire",
    period: "2024",
    color: "cyan",
    description: "Création d'un site web responsive.",
    achievements: [
      "Développement d'un site vitrine entièrement responsive",
      "Optimisation de l'affichage sur mobile, tablette et desktop",
    ],
    technologies: ["HTML", "CSS"],
  },
];