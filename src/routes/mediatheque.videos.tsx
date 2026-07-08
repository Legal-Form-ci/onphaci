import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play } from "lucide-react";

export const Route = createFileRoute("/mediatheque/videos")({
  head: () => ({
    meta: [
      { title: "Vidéos — Médiathèque ONPHA-CI" },
      { name: "description", content: "Vidéos des actions, événements et campagnes de sensibilisation de l'ONPHA-CI." },
      { property: "og:title", content: "Vidéos ONPHA-CI" },
      { property: "og:description", content: "Retrouvez toutes les vidéos de l'ONPHA-CI." },
      { property: "og:url", content: "https://onphaci.lovable.app/mediatheque/videos" },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/mediatheque/videos" }],
  }),
  component: VideosPage,
});

interface VideoAsset { id: string; title: string | null; url: string; caption: string | null; }

function VideosPage() {
  const [items, setItems] = useState<VideoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<VideoAsset | null>(null);

  useEffect(() => {
    supabase.from("media_assets").select("id,title,url,caption").eq("kind", "video").order("created_at", { ascending: false })
      .then(({ data }) => { setItems((data as VideoAsset[]) ?? []); setLoading(false); });
  }, []);

  return (
    <>
      <PageHero eyebrow="Médiathèque" title="Nos vidéos" lead="Vidéos des actions, campagnes de sensibilisation et événements de l'ONPHA-CI." />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-brand" /></div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-alt p-10 text-center text-sm text-ink-soft">
            Aucune vidéo pour le moment. Téléversez des vidéos depuis l'espace administrateur.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((v) => (
              <li key={v.id}>
                <button onClick={() => setOpen(v)} className="group relative block w-full overflow-hidden rounded-xl border border-border bg-black">
                  <video src={v.url} className="aspect-video w-full object-cover opacity-90 transition group-hover:opacity-100" muted playsInline preload="metadata" />
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="grid size-14 place-items-center rounded-full bg-white/90 text-brand shadow-lg"><Play className="size-6" /></span>
                  </span>
                </button>
                {v.title && <p className="mt-2 text-sm text-ink">{v.title}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setOpen(null)}>
          <video src={open.url} controls autoPlay className="max-h-[85dvh] w-auto max-w-5xl rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}