import type {
  NavLink,
  PersonalInfo,
  Project,
  ProjectColor,
  ColorMapEntry,
  Skill,
  SkillCategory,
  Experience,
  Certificate,
  Education,
  DashboardStat,
} from "@/lib/types";

export const PERSONAL_INFO: PersonalInfo = {
  name: "TAREK NAJEM",
  role: "Développeur Full Stack",
  roles: [
    "Développeur Full Stack",
    "Étudiant Ingénierie informatique et réseaux - EMSI RABAT",
    "Passionné de Web Moderne",
  ],
  tagline: "Je conçois des applications web modernes, performantes et centrées utilisateur.",
  brandTagline: "I build digital systems that feel alive.",
  availability: "Disponible pour un stage / CDI",
  location: "Rabat, Maroc",
  email: "tareknajem19@gmail.com",
  github: "https://github.com/tareknjm",
  linkedin: "https://www.linkedin.com/in/tarek-najem-615554291/",
  cvUrl: "/cv.pdf",
  photo: "/profile.jpg",
};

export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Accueil", icon: "Home" },
  { id: "about", label: "À propos", icon: "User" },
  { id: "skills", label: "Compétences", icon: "Code2" },
  { id: "experience", label: "Expériences", icon: "Briefcase" },
  { id: "projects", label: "Projets", icon: "FolderGit2" },
  { id: "certifications", label: "Certifications", icon: "Award" },
  { id: "education", label: "Formation", icon: "GraduationCap" },
  { id: "contact", label: "Contact", icon: "Mail" },
];

export const COLOR_MAP: Record<string, ColorMapEntry> = {
  primary: {
    text: "text-violet-300",
    bg: "bg-violet-500",
    bgSoft: "bg-violet-500/15",
    border: "border-violet-500/30",
  },
  cyan: {
    text: "text-cyan-300",
    bg: "bg-cyan-400",
    bgSoft: "bg-cyan-400/15",
    border: "border-cyan-400/30",
  },
  emerald: {
    text: "text-emerald-300",
    bg: "bg-emerald-400",
    bgSoft: "bg-emerald-400/15",
    border: "border-emerald-400/30",
  },
  amber: {
    text: "text-amber-300",
    bg: "bg-amber-400",
    bgSoft: "bg-amber-400/15",
    border: "border-amber-400/30",
  },
  pink: {
    text: "text-pink-300",
    bg: "bg-pink-400",
    bgSoft: "bg-pink-400/15",
    border: "border-pink-400/30",
  },
};

export const SKILL_DIRECTORY: Skill[] = [
  // ── Frontend ──────────────────────────────────────────────────────
  { name: "React", category: "Frontend", description: "Composants d'interface réactifs, hooks et architectures SPA modernes." },
  { name: "Next.js", category: "Frontend", description: "Applications full-stack performantes, SSR, SSG et App Router." },
  { name: "TypeScript", category: "Frontend", description: "Typage statique rigoureux pour un code maintenable et robuste." },
  { name: "JavaScript", category: "Frontend", description: "Interactivité, logique client ES6+ et programmation asynchrone." },
  { name: "Tailwind CSS", category: "Frontend", description: "Design systems utilitaires modernes, réactifs et animations fluides." },
  { name: "HTML / CSS", category: "Frontend", description: "Structuration sémantique, accessibilité (a11y) et responsive design." },
  { name: "Redux Toolkit", category: "Frontend", description: "Gestion d'état global prédictive pour applications d'envergure." },

  // ── Backend ───────────────────────────────────────────────────────
  { name: "Spring Boot", category: "Backend", description: "APIs REST sécurisées, microservices et architecture en couches." },
  { name: "Django", category: "Backend", description: "Développement rapide avec ORM intégré et intégration IA/NLP." },
  { name: "ASP.NET Core", category: "Backend", description: "APIs robustes et applications d'entreprise performantes en C#." },
  { name: "Laravel", category: "Backend", description: "Applications web PHP structurées en architecture MVC." },

  // ── Testing & Qualité ────────────────────────────────────────────
  { name: "JUnit", category: "Testing", description: "Tests unitaires et d'intégration côté backend (Java / Spring Boot)." },
  { name: "Vitest", category: "Testing", description: "Tests unitaires et validation de composants côté frontend." },
  { name: "Postman", category: "Testing", description: "Tests d'APIs REST, collections automatisées et validation de contrats." },
  { name: "Cypress", category: "Testing", description: "Tests end-to-end et validation des parcours utilisateur côté frontend." },
  { name: "Mockito", category: "Testing", description: "Création de mocks et tests unitaires des composants Java et Spring Boot." },
  { name: "RobotFramework", category: "Testing", description: "Automatisation des tests fonctionnels et des tests d'acceptation." },


  // ── Données ───────────────────────────────────────────────────────
  { name: "PostgreSQL", category: "Données", description: "Modélisation relationnelle avancée et requêtes SQL optimisées." },
  { name: "MySQL", category: "Données", description: "Bases de données relationnelles pour applications web et transactions." },
  { name: "SQL Server", category: "Données", description: "Gestion de bases de données relationnelles en environnement .NET." },
  { name: "MongoDB", category: "Données", description: "Stockage NoSQL orienté documents pour données flexibles." },
  { name: "SQLite", category: "Données", description: "Base relationnelle légère et embarquée pour prototypage." },

  // ── DevOps & Sécurité ─────────────────────────────────────────────
  { name: "Docker", category: "DevOps", description: "Conteneurisation, multi-stage builds et environnements reproductibles." },
  { name: "Keycloak", category: "DevOps", description: "Authentification centralisée, OAuth2, OpenID Connect et RBAC." },
  { name: "KrakenD", category: "DevOps", description: "Passerelle API haute performance, agrégation, validation JWT et rate limiting." },
  { name: "Nginx", category: "DevOps", description: "Serveur web haute disponibilité, reverse proxy et terminaison SSL." },
  { name: "OWASP", category: "DevOps", description: "Audits de sécurité, scan OWASP ZAP et bonnes pratiques contre les vulnérabilités." },

  // ── Langages ──────────────────────────────────────────────────────
  { name: "Java", category: "Langages", description: "Programmation orientée objet avancée, Java 21 et écosystème Spring." },
  { name: "Python", category: "Langages", description: "Backend Django, scripting, automatisation et pipelines de données." },
  { name: "C#", category: "Langages", description: "Développement backend moderne et typage fort dans l'écosystème .NET." },
  { name: "SQL", category: "Langages", description: "Requêtage complexe, indexation et manipulation de données relationnelles." },

  // ── Workflow ──────────────────────────────────────────────────────
  { name: "Git", category: "Workflow", description: "Gestion de versions distribuée, branches, PRs et collaboration d'équipe." },
  { name: "Agile / SCRUM", category: "Workflow", description: "Gestion de projet itérative, rituels agiles, sprints et backlog." },
  { name: "UML", category: "Workflow", description: "Modélisation logicielle, diagrammes de classes et cas d'utilisation." },
  { name: "Power BI", category: "Workflow", description: "Conception de tableaux de bord décisionnels et visualisation de données." },
];

export const CATEGORY_ORDER: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Testing",
  "Données",
  "DevOps",
  "Langages",
  "Workflow",
];

export const CORE_SKILL_NAMES: string[] = [
  "React",
  "Next.js",
  "Spring Boot",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "JUnit",
  "Git",
];

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: "Projets Full Stack", value: 15, suffix: "+" },
  { label: "Stages", value: 3, suffix: "" },
  { label: "Technologies", value: 20, suffix: "+" },
  { label: "Certifications", value: 10, suffix: "+" },
];

export const SKILL_COLORS: Record<string, string> = {
  React: "#61DAFB",
  "Next.js": "#E2E8F0",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  HTML: "#E34F26",
  CSS: "#1572B6",
  "HTML / CSS": "#E34F26",
  "Tailwind CSS": "#38BDF8",
  "Redux Toolkit": "#764ABC",
  "Spring Boot": "#6DB33F",
  Django: "#44B78B",
  Laravel: "#FF2D20",
  "ASP.NET Core": "#512BD4",
  JUnit: "#25A162",
  Vitest: "#FCC72B",
  Postman: "#FF6C37",
  Java: "#ED8B00",
  Python: "#3776AB",
  "C#": "#68217A",
  SQL: "#4479A1",
  PostgreSQL: "#4169E1",
  MySQL: "#4479A1",
  "SQL Server": "#CC2927",
  MongoDB: "#47A248",
  SQLite: "#0F80CC",
  Docker: "#2496ED",
  Keycloak: "#E6491F",
  KrakenD: "#00ADD8",
  Nginx: "#009639",
  OWASP: "#FFB300",
  Git: "#F05032",
  "Agile / SCRUM": "#a78bfa",
  UML: "#22d3ee",
  "Power BI": "#F2C811",
};

export const EXPERIENCES: Experience[] = [
  {
    id: "cmr-healthcheck",
    company: "CMR",
    role: "Développeur Full Stack — Stagiaire (en cours)",
    period: "2026 — 2 mois",
    color: "emerald",
    description:
      "Conception et développement de HealthCheck Monitor, une plateforme de supervision de services HTTP/HTTPS avec architecture microservices sécurisée : authentification Keycloak, passerelle API KrakenD, et scan de vulnérabilités OWASP ZAP.",
    achievements: [
      "Architecture complète en microservices Dockerisés (backend, frontend, gateway, auth, base de données, relais mail)",
      "Mise en place d'une passerelle API KrakenD avec validation JWT et rate limiting",
      "Authentification et gestion des rôles via Keycloak (OAuth2/OpenID Connect)",
      "Sécurisation de l'infrastructure : conteneurs non-root, headers HTTP restrictifs, scan de vulnérabilités OWASP ZAP (0 faille critique)",
      "Tests automatisés (JUnit côté backend, Vitest côté frontend) et documentation API via Swagger/OpenAPI",
    ],
    technologies: [
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "PostgreSQL",
      "React",
      "Redux Toolkit",
      "Docker",
      "Keycloak",
      "KrakenD",
    ],
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

export const PROJECTS: Project[] = [
  {
    id: "sav-platform",
    title: "TYMK Services",
    subtitle: "Plateforme intelligente de gestion du Service Après-Vente",
    image: "/projects/sav-home.jpg",
    gallery: [
      "/projects/sav-home.jpg",
      "/projects/sav-form.jpg",
      "/projects/sav-confirmation.jpg",
      "/projects/sav-dashboard.jpg",
    ],
    description:
      "Plateforme web centralisant la gestion des demandes de réparation SAV, avec suivi en temps réel, espace technicien dédié et modules d'intelligence artificielle (chatbot, détection d'images, planification intelligente).",
    problem:
      "De nombreux services SAV s'appuient encore sur des outils manuels (Excel, mails dispersés) causant pertes d'informations, retards d'intervention et manque de visibilité pour les clients. TYMK Services centralise et automatise ce processus.",
    technologies: ["Python", "Django", "HTML", "CSS", "JavaScript", "MySQL", "RASA", "UML"],
    features: [
      "Espace client : dépôt de demande, upload de pièces jointes, suivi de dossier en temps réel",
      "Espace technicien : dashboard avec demandes assignées, gestion des interventions, devis et facturation",
      "Espace administrateur : gestion des comptes, des rôles et planification des interventions",
      "Chatbot d'assistance intégré pour guider les clients",
      "Module IA : détection d'images de pannes et planification intelligente des interventions",
    ],
    difficulties: [
      {
        problem:
          "Structurer une architecture MVC propre avec Django pour 3 rôles utilisateurs distincts (client, technicien, admin) ayant chacun des permissions et vues différentes.",
        solution:
          "Mise en place d'un système de gestion des rôles avec permissions Django dédiées et vues séparées par groupe d'utilisateurs, garantissant une séparation claire des responsabilités.",
      },
      {
        problem:
          "Assurer la sécurité des données sensibles (informations clients, factures) et des sessions utilisateurs.",
        solution:
          "Application des normes de sécurité Django (chiffrement, gestion sécurisée des sessions, validation des formulaires côté serveur).",
      },
    ],
    github: "",
    demo: "",
    color: "pink",
  },
  {
    id: "elearn",
    title: "E-Learn",
    subtitle: "Plateforme e-learning nouvelle génération avec IA",
    image: "/projects/el-home.jpg",
    gallery: [
      "/projects/el-home.jpg",
      "/projects/el-dashboard.jpg",
      "/projects/el-instructeur.jpg",
      "/projects/el-chatbot.jpg",
      "/projects/el-premium.jpg",
      "/projects/el-admin.jpg",
    ],
    description:
      "Plateforme e-learning complète avec trois profils utilisateurs (apprenant, instructeur, administrateur), suivi de progression, quiz et certifications, appels vidéo 1-on-1, abonnement premium et assistant IA de recommandation.",
    problem:
      "Concevoir une plateforme e-learning capable de gérer trois profils utilisateurs distincts avec des besoins très différents (apprentissage, enseignement, modération), tout en intégrant des fonctionnalités avancées comme la visioconférence et l'intelligence artificielle.",
    technologies: [
      "Spring Boot",
      "JWT",
      "JavaMailSender",
      "React",
      "Vite",
      "Framer Motion",
      "Axios",
      "Jitsi",
      "IA",
    ],
    features: [
      "Catalogue de formations avec recherche, filtres par niveau et catégories",
      "Suivi automatique de la progression vidéo par vidéo avec reprise de lecture",
      "Quiz final et génération de certificats téléchargeables",
      "Réservation d'appels vidéo 1-on-1 avec les instructeurs via Jitsi",
      "Abonnement Premium (mensuel/annuel) débloquant les contenus PRO",
      "Assistant IA proposant des recommandations de formations personnalisées",
      "Espace instructeur : création de formations, gestion des disponibilités, analytics",
      "Espace admin : validation des formations et candidatures instructeurs, gestion des catégories",
    ],
    difficulties: [
      {
        problem:
          "Gérer trois profils utilisateurs (apprenant, instructeur, administrateur) avec des permissions et des flux de navigation totalement différents au sein d'une seule application React, sans dupliquer le code.",
        solution:
          "Mise en place d'un système de routes protégées basé sur les rôles décodés depuis le JWT, avec des layouts dédiés par profil et des hooks personnalisés pour centraliser la logique d'autorisation côté frontend.",
      },
      {
        problem:
          "Assurer un suivi précis de la progression vidéo par apprenant (reprise de lecture exacte, marquage automatique comme terminé) tout en gardant les appels API au backend raisonnables en nombre.",
        solution:
          "Sauvegarde de la progression via des appels Axios débattus (debounce) à intervalles réguliers plutôt qu'à chaque seconde de lecture, réduisant la charge serveur tout en gardant une reprise fiable.",
      },
      {
        problem:
          "Intégrer la visioconférence (Jitsi) et l'assistant IA de recommandation sans complexifier excessivement l'architecture Spring Boot existante ni ralentir les temps de réponse de l'API.",
        solution:
          "Isolation de ces fonctionnalités dans des services dédiés côté backend, avec authentification stateless JWT pour sécuriser l'accès aux salons Jitsi et aux réponses de l'assistant IA sans stocker de session côté serveur.",
      },
    ],
    github: "",
    demo: "",
    color: "primary",
  },
  {
    id: "cabinet-pro",
    title: "CabinetPro",
    subtitle: "Système de gestion de cabinet médical (ASP.NET MVC)",
    image: "/projects/cabinet-home.jpg",
    gallery: [
      "/projects/cabinet-home.jpg",
      "/projects/cabinet-rdv.jpg",
      "/projects/cabinet-planing.jpg",
      "/projects/cabinet-planifier.jpg",
      "/projects/cabinet-medecin.jpg",
      "/projects/cabinet-ordonnance.jpg",
    ],
    description:
      "Application web complète de gestion de cabinet médical avec quatre profils utilisateurs (administrateur, médecin, secrétaire, patient), permettant la prise de rendez-vous en ligne, le suivi des dossiers médicaux et la génération automatique d'ordonnances.",
    problem:
      "De nombreux cabinets médicaux gèrent encore leurs rendez-vous et dossiers patients de manière manuelle ou semi-informatisée, causant pertes de temps, erreurs de saisie et difficulté d'accès rapide aux informations. CabinetPro centralise cette gestion via une plateforme unique adaptée à chaque acteur du cabinet.",
    technologies: ["ASP.NET MVC", "C#", "Entity Framework", "HTML", "CSS", "JavaScript", "SQL Server", "UML"],
    features: [
      "Espace patient : prise de rendez-vous en ligne, suivi des demandes, historique des consultations",
      "Espace secrétaire : gestion des patients, traitement des demandes d'inscription, planification des rendez-vous",
      "Espace médecin : consultation du planning, mise à jour des dossiers médicaux, rédaction de comptes rendus",
      "Génération automatique d'ordonnances imprimables",
      "Espace administrateur : gestion des utilisateurs et des rôles, statistiques globales du cabinet (répartition des spécialités, volume de RDV)",
      "Système sécurisé de réinitialisation de mot de passe avec validation administrateur",
    ],
    difficulties: [
      {
        problem:
          "Gérer quatre profils utilisateurs (admin, médecin, secrétaire, patient) avec des vues et permissions très différentes au sein d'une architecture ASP.NET MVC unique.",
        solution:
          "Séparation stricte des responsabilités selon le modèle MVC, avec des contrôleurs et vues Razor dédiés par rôle, et un système d'autorisation vérifiant les droits d'accès à chaque requête.",
      },
      {
        problem:
          "Assurer la sécurité et la confidentialité des données médicales sensibles, un enjeu critique pour ce type d'application.",
        solution:
          "Mise en place de bonnes pratiques de sécurité ASP.NET (hachage des mots de passe, gestion sécurisée des sessions, filtrage des entrées) et d'un mécanisme de réinitialisation de mot de passe validé manuellement par l'administrateur plutôt qu'automatique.",
      },
    ],
    github: "",
    demo: "",
    color: "cyan",
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    title: "Oracle Certified Professional: Java SE 17 Developer",
    org: "Oracle",
    date: "Septembre 2026",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge_m?id=20F9E1EE2EE82F5D9B63A9A1340478EEEAEB05FDE3914F2F73D00F067325E59E",
  },
  {
    title: "Introduction to Big Data",
    org: "University of California San Diego",
    date: "Juin 2026",
    url: "https://www.coursera.org/account/accomplishments/verify/BYIQRC5CM0HD",
  },
  {
    title: "Agile Project Management",
    org: "Google",
    date: "Juin 2026",
    url: "https://www.coursera.org/account/accomplishments/verify/LTULN3F2YD9F",
  },
  {
    title: "React Native",
    org: "Meta",
    date: "Janvier 2026",
    url: "https://www.coursera.org/account/accomplishments/verify/IF7SI1PSFCBR",
  },
  {
    title: "React Basics",
    org: "Meta",
    date: "Janvier 2026",
    url: "https://www.coursera.org/account/accomplishments/verify/DBTEP8QZ9V5Y",
  },
  {
    title: "La recherche documentaire",
    org: "École Polytechnique",
    date: "Mars 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/9V2RPJOQOG5Z",
  },
  {
    title: "Python for Data Science, AI & Development",
    org: "IBM",
    date: "Mars 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/28RATE44IWE1",
  },
  {
    title: "Software Engineering: Software Design and Project Management",
    org: "The Hong Kong University of Science and Technology",
    date: "Mars 2025",
    url: "https://www.coursera.org/account/accomplishments/verify/K2GEJ2QIWG48",
  },
  {
    title: "The Unix Workbench",
    org: "Johns Hopkins University",
    date: "Décembre 2024",
    url: "https://www.coursera.org/account/accomplishments/verify/EU8A9GOLMDJU",
  },
  {
    title: "Introduction à la programmation orientée objet (en C++)",
    org: "École Polytechnique Fédérale de Lausanne",
    date: "Décembre 2024",
    url: "https://www.coursera.org/account/accomplishments/verify/CF10YU70IX2J",
  },
  {
    title: "Interactivity with JavaScript",
    org: "University of Michigan",
    date: "Novembre 2024",
    url: "https://www.coursera.org/account/accomplishments/verify/RKEU6V7XF9NG",
  },
];

export const EDUCATION: Education[] = [
  {
    title: "Cycle Ingénieur — DDSI",
    subtitle: "Développement Digital & Systèmes d'Information",
    institution: "EMSI Rabat",
    period: "En cours",
    description:
      "Formation d'ingénieur spécialisée en développement logiciel, architecture des systèmes d'information, bases de données et méthodologies agiles.",
  },
  {
    title: "Cycle Préparatoire Intégré",
    subtitle: "Sciences de l'Ingénieur",
    institution: "EMSI Rabat",
    period: "2022 - 2024",
    description:
      "Tronc commun scientifique couvrant les fondamentaux en mathématiques, physique, algorithmique et programmation.",
  },
  {
    title: "Baccalauréat",
    subtitle: "Sciences Mathématiques — Option B",
    institution: "Lycée Louis Le Grand, Rabat",
    period: "2021-2022",
    description:
      "Formation secondaire avec spécialisation en sciences mathématiques, base des fondamentaux en mathématiques, physique et logique.",
  },
];
