import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

const remainingSections = [
  { id: "skills", label: "Compétences" },
  { id: "experience", label: "Expériences" },
  { id: "projects", label: "Projets" },
  { id: "github", label: "GitHub" },
  { id: "education", label: "Formation" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      {remainingSections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="section-container min-h-screen flex items-center justify-center"
        >
          <h2 className="text-3xl font-bold gradient-text">{s.label}</h2>
        </section>
      ))}
    </Layout>
  );
}