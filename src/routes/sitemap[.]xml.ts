import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/data/articles";
import { PROJECTS } from "@/data/projects";

const BASE_URL = "https://onphaci.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/a-propos", changefreq: "monthly", priority: "0.8" },
          { path: "/projets", changefreq: "weekly", priority: "0.9" },
          { path: "/actualites", changefreq: "daily", priority: "0.9" },
          { path: "/mediatheque", changefreq: "weekly", priority: "0.7" },
          { path: "/partenaires", changefreq: "monthly", priority: "0.7" },
          { path: "/dons", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/annuaire/ecoles-specialisees", changefreq: "monthly", priority: "0.6" },
          { path: "/annuaire/ecoles-inclusives", changefreq: "monthly", priority: "0.6" },
          { path: "/annuaire/organisations", changefreq: "monthly", priority: "0.6" },
          { path: "/confidentialite", changefreq: "yearly", priority: "0.3" },
        ];
        const dynamic: SitemapEntry[] = [
          ...ARTICLES.map((a) => ({ path: `/actualites/${a.slug}`, changefreq: "monthly" as const, priority: "0.6" })),
          ...PROJECTS.map((p) => ({ path: `/projets/${p.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
        ];
        const entries = [...staticPaths, ...dynamic];
        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});