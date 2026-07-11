import { motion } from "framer-motion";
import { FolderGit2, Briefcase, Cpu, Award } from "lucide-react";
import { DASHBOARD_STATS } from "@/data/skills";
import { useCountUp } from "@/hooks/useCountUp";

const ICONS = [FolderGit2, Briefcase, Cpu, Award];
const GRADIENTS = [
  "from-primary/20 to-transparent",
  "from-cyan-400/20 to-transparent",
  "from-emerald-400/20 to-transparent",
  "from-amber-400/20 to-transparent",
];

function StatCard({ stat, Icon, gradient, index }) {
  const { count, ref } = useCountUp(stat.value, 1500 + index * 150);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bento-card bg-gradient-to-br ${gradient} text-center`}
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
        <Icon size={24} className="text-white" />
      </div>
      <p className="text-4xl font-bold gradient-text mb-2">
        {count}
        {stat.suffix}
      </p>
      <p className="text-sm text-muted">{stat.label}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  return (
    <div className="section-container !pt-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} Icon={ICONS[i]} gradient={GRADIENTS[i]} index={i} />
        ))}
      </div>
    </div>
  );
}