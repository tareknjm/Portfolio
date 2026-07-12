import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, BookOpen, Users } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { PERSONAL_INFO } from "@/constants";
import GitHubCalendar from "./GitHubCalendar";

const GITHUB_USERNAME = "tareknjm";

export default function GitHubStats() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(function () {
    async function fetchData() {
      try {
        const profileRes = await fetch("https://api.github.com/users/" + GITHUB_USERNAME);
        const profileData = await profileRes.json();
        setProfile(profileData);

        const reposRes = await fetch(
          "https://api.github.com/users/" + GITHUB_USERNAME + "/repos?sort=updated&per_page=6"
        );
        const reposData = await reposRes.json();
        setRepos(Array.isArray(reposData) ? reposData : []);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="github" className="section-container">
        <div className="text-center text-muted">Chargement des donnees GitHub...</div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id="github" className="section-container">
        <div className="text-center">
          <p className="text-muted mb-4">Impossible de charger les donnees GitHub pour le moment.</p>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary-light hover:underline"
          >
            <FaGithub size={18} />
            Voir mon profil GitHub
          </a>
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Repositories", value: profile.public_repos, icon: BookOpen },
    { label: "Followers", value: profile.followers, icon: Users },
    { label: "Following", value: profile.following, icon: Users },
  ];

  return (
    <section id="github" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">06. GitHub</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Mon activite open-source</h2>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map(function (stat) {
          return (
            <div key={stat.label} className="bento-card text-center">
              <stat.icon size={22} className="mx-auto mb-3 text-primary-light" />
              <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map(function (repo) {
          return (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-card group"
            >
              <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-primary-light transition-colors">
                {repo.name}
              </h3>
              <p className="text-xs text-muted mb-4 line-clamp-2 min-h-[2rem]">
                {repo.description || "Pas de description"}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {repo.forks_count}
                </span>
                {repo.language && <span>{repo.language}</span>}
              </div>
            </a>
          );
        })}
      </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map(function (stat) {
          return (
            <div key={stat.label} className="bento-card text-center">
              <stat.icon size={22} className="mx-auto mb-3 text-primary-light" />
              <p className="text-3xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <GitHubCalendar />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      <div className="text-center mt-8">
        <a
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary-light hover:underline"
        >
          <FaGithub size={16} />
          Voir tous mes repositories
        </a>
      </div>
    </section>
  );
}