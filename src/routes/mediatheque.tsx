import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { ARTICLES } from "@/data/articles";
import { useMemo, useState } from "react";
import { X } from "lucide-react";

export const Route = createFileRoute("/mediatheque")({
  head: () => ({
    meta: [
      { title: "Médiathèque — ONPHA-CI" },
      { name: "description", content: "Photos et vidéos des actions, événements et projets de l'ONPHA-CI." },
      { property: "og:title", content: "Médiathèque ONPHA-CI" },
      { property: "og:description", content: "Galerie photo des projets et événements de l'ONPHA-CI." },
    ],
  }),
  component: MediaPage,
});

function MediaPage() {
  const photos = useMemo(() => {
    const items: { src: string; title: string; date: string | null }[] = [];
    for (const a of ARTICLES) {
      if (a.cover) items.push({ src: a.cover, title: a.title, date: a.date });
      for (const i of a.inline_images) items.push({ src: i, title: a.title, date: a.date });
    }
    const seen = new Set<string>();
    return items.filter((x) => (seen.has(x.src) ? false : (seen.add(x.src), true)));
  }, []);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PageHero eyebrow="Médiathèque" title="Nos actions en images" lead="Photos issues des projets, événements et actions de terrain de l'ONPHA-CI." />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <p className="text-sm text-ink-soft">{photos.length} photos</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.src + i}>
              <button onClick={() => setOpen(i)} className="group block aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
                <img src={p.src} alt={p.title} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      {open !== null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(null)}>
          <button aria-label="Fermer" className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setOpen(null)}>
            <X className="size-5" />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={photos[open].src} alt={photos[open].title} className="max-h-[80dvh] w-auto rounded-xl" />
            <figcaption className="mt-3 text-center text-sm text-white/80">{photos[open].title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}