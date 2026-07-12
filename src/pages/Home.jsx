import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Dashboard from "@/components/sections/Dashboard";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import GitHubStats from "@/components/sections/GitHubStats";
import Certifications from "@/components/sections/Certifications";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <About />
      <Skills />
      <Dashboard />
      <Experience />
      <Projects />
      <GitHubStats />
      <Certifications />
      <Education />
      <Contact />
    </Layout>
  );
}