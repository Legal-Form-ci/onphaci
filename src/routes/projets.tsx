import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PROJECTS } from "@/data/projects";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/projets")({
  head: () => ({
    meta: [
      { title: "Nos projets — ONPHA-CI" },
      { name: "description", content: "Découvrez les projets de l'ONPHA-CI : DéfiSens'AO, Handicap-Vie-Solidarité, sport et inclusion scolaire, prévention VIH et plus." },
      { property: "og:title", content: "Les projets de l'ONPHA-CI" },
      { property: "og:description", content: "Plaidoyer, santé, éducation inclusive, langue des signes." },
    { property: "og:url", content: "https://onphaci.lovable.app/projets" },
  ],
  links: [{ rel: "canonical", href: "https://onphaci.lovable.app/projets" }],
  }),
  component: ProjectsLayout,
});

function ProjectsLayout() {
  const match = useMatchRoute();
  const onDetail = match({ to: "/projets/$slug" });
  if (onDetail) return <Outlet />;
  return <ProjectsIndex />;
}

function ProjectsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Nos projets"
        title="Des projets ancrés dans le réel"
        lead="Plaidoyer, santé, éducation inclusive, langue des signes : nos actions sont conçues avec les familles et menées avec nos partenaires nationaux et internationaux."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <Link key={p.slug} to="/projets/$slug" params={{ slug: p.slug }} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "En cours" ? "bg-accent-orange/15 text-accent-orange" : "bg-brand-soft text-brand"}`}>{p.status}</span>
                <span className="text-xs text-ink-soft">{p.years}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink group-hover:text-brand">{p.title}</h2>
              <p className="mt-1 text-xs font-medium text-ink-soft">{p.partner}</p>
              <p className="mt-3 text-sm text-ink-soft">{p.short}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {p.countries.slice(0, 4).map((c) => (
                  <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-xs text-ink-soft">{c}</span>
                ))}
                {p.countries.length > 4 && <span className="text-xs text-ink-soft">+{p.countries.length - 4}</span>}
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">Voir le projet <ArrowRight className="size-4" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}