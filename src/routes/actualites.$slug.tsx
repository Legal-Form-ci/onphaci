import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ARTICLES, formatDate, getArticle } from "@/data/articles";
import { ArrowLeft } from "lucide-react";
import { EngagementBar } from "@/components/site/EngagementBar";
import { Comments } from "@/components/site/Comments";

export const Route = createFileRoute("/actualites/$slug")({
  head: ({ params }) => {
    const a = getArticle(params.slug);
    return {
      meta: a
        ? [
            { title: `${a.title} — ONPHA-CI` },
            { name: "description", content: a.excerpt },
            { property: "og:title", content: a.title },
            { property: "og:description", content: a.excerpt },
            ...(a.cover ? [{ property: "og:image", content: a.cover }] : []),
          ]
        : [{ title: "Article introuvable — ONPHA-CI" }],
    };
  },
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) throw notFound();
    return a;
  },
  component: ArticleDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Article introuvable</h1>
      <Link to="/actualites" className="mt-4 inline-block text-brand hover:underline">← Toutes les actualités</Link>
    </div>
  ),
});

function ArticleDetail() {
  const a = Route.useLoaderData();
  if (!a) return null;
  const similar = ARTICLES.filter((x) => x.category === a.category && x.slug !== a.slug).slice(0, 3);
  return (
    <>
      <section className="border-b border-border bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
          <Link to="/actualites" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-brand">
            <ArrowLeft className="size-4" /> Toutes les actualités
          </Link>
          <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft">
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">{a.category}</span>
            <span>·</span><time>{formatDate(a.date)}</time>
          </div>
          <h1 className="mt-4 text-balance text-4xl font-bold text-ink sm:text-5xl">{a.title}</h1>
        </div>
      </section>
      {a.cover && (
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="-mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
            <img src={a.cover} alt={a.title} className="size-full object-cover" />
          </div>
        </div>
      )}
      <article className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        {a.excerpt && (
          <p className="mb-10 border-l-4 border-accent-orange pl-5 font-display text-xl italic leading-relaxed text-ink-soft">
            {a.excerpt}
          </p>
        )}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: a.content_html }}
        />
        <EngagementBar kind="article" slug={a.slug} title={a.title} shareUrl={typeof window !== "undefined" ? window.location.href : a.source_url} />
      </article>
      <Comments kind="article" slug={a.slug} />
      {similar.length > 0 && (
        <section className="border-t border-border bg-surface-alt py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-ink">À lire également</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {similar.map((s) => (
                <Link key={s.slug} to="/actualites/$slug" params={{ slug: s.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    {s.cover ? <img src={s.cover} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-105" /> : <div className="size-full" style={{ background: "var(--gradient-brand)" }} />}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink-soft">{formatDate(s.date)}</p>
                    <h3 className="mt-2 font-display text-base font-semibold text-ink group-hover:text-brand line-clamp-2">{s.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}