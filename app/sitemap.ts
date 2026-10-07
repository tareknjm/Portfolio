import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/data";

const BASE_URL = "https://tareknajem.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectRoutes,
  ];
}
