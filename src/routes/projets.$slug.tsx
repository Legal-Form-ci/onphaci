import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PROJECTS } from "@/data/projects";
import { ArrowLeft, Calendar, Globe2, Handshake } from "lucide-react";

export const Route = createFileRoute("/projets/$slug")({
  head: ({ params }) => {
    const p = PROJECTS.find((x) => x.slug === params.slug);
    return {
      meta: p
        ? [
            { title: `${p.title} — Projet ONPHA-CI` },
            { name: "description", content: p.short },
            { property: "og:title", content: p.title },
            { property: "og:description", content: p.short },
          ]
        : [{ title: "Projet introuvable — ONPHA-CI" }],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Projet introuvable</h1>
      <Link to="/projets" className="mt-4 inline-block text-brand hover:underline">← Tous les projets</Link>
    </div>
  ),
  loader: ({ params }) => {
    const p = PROJECTS.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
});

function ProjectDetail() {
  const p = Route.useLoaderData();
  return (
    <>
      <section className="border-b border-border bg-surface-alt">
        <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
          <Link to="/projets" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-brand">
            <ArrowLeft className="size-4" /> Tous les projets
          </Link>
          <span className={`mt-6 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "En cours" ? "bg-accent-orange/15 text-accent-orange" : "bg-brand-soft text-brand"}`}>{p.status}</span>
          <h1 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{p.short}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <InfoCard icon={Calendar} label="Période" value={p.years} />
          <InfoCard icon={Handshake} label="Partenaire" value={p.partner} />
          <InfoCard icon={Globe2} label="Pays" value={`${p.countries.length} pays`} />
        </div>
        <article className="prose prose-lg mt-10 max-w-none text-ink">
          <p className="text-ink-soft">{p.description}</p>
        </article>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Pays concernés</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.countries.map((c) => (
              <li key={c} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">{c}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="size-5 text-accent-orange" />
      <p className="mt-2 text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}