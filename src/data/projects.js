export const PROJECTS = [
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
technologies: ["Python", "Django", "HTML", "CSS", "JavaScript", "MySQL", "RASA", "UML"],    features: [
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
technologies: ["Spring Boot", "JWT", "JavaMailSender", "React", "Vite", "Framer Motion", "Axios", "Jitsi", "IA"],    features: [
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
technologies: ["ASP.NET MVC", "C#", "Entity Framework", "HTML", "CSS", "JavaScript", "SQL Server", "UML"],    features: [
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