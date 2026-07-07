import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ARTICLES, CATEGORIES, formatDate } from "@/data/articles";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/actualites")({
  head: () => ({
    meta: [
      { title: "Actualités — ONPHA-CI" },
      { name: "description", content: "Toutes les actualités de l'ONPHA-CI : projets, plaidoyer, événements, vie associative." },
      { property: "og:title", content: "Actualités ONPHA-CI" },
      { property: "og:description", content: "Suivez nos actions, événements et publications." },
    { property: "og:url", content: "https://onphaci.lovable.app/actualites" },
  ],
  links: [{ rel: "canonical", href: "https://onphaci.lovable.app/actualites" }],
  }),
  component: NewsLayout,
});

function NewsLayout() {
  const match = useMatchRoute();
  if (match({ to: "/actualites/$slug" })) return <Outlet />;
  return <NewsIndex />;
}

function NewsIndex() {
  const [cat, setCat] = useState<string>("Toutes");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => (cat === "Toutes" || a.category === cat))
      .filter((a) => !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.excerpt.toLowerCase().includes(q.toLowerCase()));
  }, [cat, q]);

  return (
    <>
      <PageHero eyebrow="Actualités" title="Suivez la vie de l'ONPHA-CI" lead="Articles, communiqués, événements et actions de plaidoyer publiés par l'organisation." />
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un article…"
              aria-label="Rechercher un article"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Toutes", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-brand text-brand-foreground" : "bg-muted text-ink-soft hover:bg-brand-soft hover:text-brand"}`}
              >{c}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <p className="mt-12 text-center text-ink-soft">Aucun article ne correspond à votre recherche.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link key={a.slug} to="/actualites/$slug" params={{ slug: a.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  {a.cover ? <img src={a.cover} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-105" /> : <div className="size-full" style={{ background: "var(--gradient-brand)" }} />}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-ink-soft">
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">{a.category}</span>
                    <span>·</span>
                    <time>{formatDate(a.date)}</time>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-ink group-hover:text-brand">{a.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}