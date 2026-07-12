import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Dashboard from "@/components/sections/Dashboard";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";

const remainingSections = [
  { id: "github", label: "GitHub" },
  { id: "education", label: "Formation" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Dashboard />
      <Experience />
      <Projects />
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