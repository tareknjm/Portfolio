import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GITHUB_USERNAME = "tareknjm";

const LEVEL_COLORS = [
  "bg-white/5",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

export default function GitHubCalendar() {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(function () {
    async function fetchContributions() {
      try {
        const res = await fetch(
          "https://github-contributions-api.jogruber.de/v4/" + GITHUB_USERNAME + "?y=last"
        );
        const data = await res.json();

        if (!data.contributions) {
          setError(true);
          setLoading(false);
          return;
        }

        const days = data.contributions;
        setTotal(days.reduce(function (sum, d) { return sum + d.count; }, 0));

        const groupedWeeks = [];
        let currentWeek = [];

        days.forEach(function (day, index) {
          currentWeek.push(day);
          const date = new Date(day.date);
          if (date.getDay() === 6 || index === days.length - 1) {
            groupedWeeks.push(currentWeek);
            currentWeek = [];
          }
        });

        setWeeks(groupedWeeks);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
      }
    }
    fetchContributions();
  }, []);

  if (loading) {
    return <div className="text-center text-muted text-sm py-8">Chargement du calendrier...</div>;
  }

  if (error) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="bento-card overflow-x-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-white/80">
          {total} contributions sur les 12 derniers mois
        </p>
      </div>

      <div className="flex gap-1 min-w-[700px]">
        {weeks.map(function (week, wi) {
          return (
            <div key={wi} className="flex flex-col gap-1">
              {week.map(function (day, di) {
                return (
                  <div
                    key={di}
                    title={day.date + " - " + day.count + " contribution(s)"}
                    className={
                      "w-3 h-3 rounded-sm " + LEVEL_COLORS[Math.min(day.level, 4)]
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end text-xs text-white/40">
        <span>Moins</span>
        {LEVEL_COLORS.map(function (color, i) {
          return <div key={i} className={"w-3 h-3 rounded-sm " + color} />;
        })}
        <span>Plus</span>
      </div>
    </motion.div>
  );
}