import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, ExternalLink, MessageCircle } from "lucide-react";
import { EngagementBar } from "@/components/site/EngagementBar";
import { Comments } from "@/components/site/Comments";

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

// Vidéos YouTube importées depuis onphaci.org/category/video/
const ONPHACI_YT_VIDEOS: { id: string; title: string; source: string }[] = [
  { id: "OEifUq9jvTk", title: "Incluons les personnes sourdes", source: "https://onphaci.org/incluons-les-personnes-sourdes/" },
  { id: "J2mGQpIwa9I", title: "La lèpre n'est pas une malédiction", source: "https://onphaci.org/la-lepre-nest-pas-une-malediction/" },
  { id: "EuVpjcV7Uxc", title: "L'albinisme n'est pas un défaut", source: "https://onphaci.org/lalbinisme-nest-pas-un-defaut/" },
];

function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function ytIdFromUrl(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
}

function slugForVideo(id: string) { return `yt-${id}`; }

function VideosPage() {
  const [items, setItems] = useState<VideoAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFile, setOpenFile] = useState<VideoAsset | null>(null);
  const [openYt, setOpenYt] = useState<string | null>(null);
  const [commentsFor, setCommentsFor] = useState<{ slug: string; title: string } | null>(null);

  useEffect(() => {
    supabase.from("media_assets").select("id,title,url,caption").eq("kind", "video").order("created_at", { ascending: false })
      .then(({ data }) => { setItems((data as VideoAsset[]) ?? []); setLoading(false); });
  }, []);

  // Merge static YouTube list with any imported YT URLs stored in media_assets
  const ytVideos = useMemo(() => {
    const map = new Map<string, { id: string; title: string; source: string }>();
    for (const v of ONPHACI_YT_VIDEOS) map.set(v.id, v);
    for (const it of items) {
      const id = ytIdFromUrl(it.url);
      if (id && !map.has(id)) map.set(id, { id, title: it.title || "Vidéo ONPHA-CI", source: it.url });
    }
    return [...map.values()];
  }, [items]);

  const uploadedVideos = useMemo(() => items.filter((v) => !ytIdFromUrl(v.url)), [items]);

  return (
    <>
      <PageHero eyebrow="Médiathèque" title="Nos vidéos" lead="Vidéos des actions, campagnes de sensibilisation et événements de l'ONPHA-CI, importées depuis onphaci.org." />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <h2 className="mb-4 font-display text-xl font-bold text-ink">Vidéos YouTube ONPHA-CI</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ytVideos.map((v) => (
            <li key={v.id}>
              <button
                onClick={() => setOpenYt(v.id)}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-black text-left"
                aria-label={`Lire la vidéo : ${v.title}`}
              >
                <img src={ytThumb(v.id)} alt={v.title} className="aspect-video w-full object-cover opacity-90 transition group-hover:opacity-100" loading="lazy" />
                <span className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="grid size-14 place-items-center rounded-full bg-white/90 text-brand shadow-lg"><Play className="size-6" /></span>
                </span>
              </button>
              <div className="mt-2 flex items-start justify-between gap-2">
                <p className="text-sm text-ink">{v.title}</p>
                <a href={v.source} target="_blank" rel="noopener noreferrer" className="shrink-0 text-ink-soft hover:text-brand" aria-label="Article source sur onphaci.org">
                  <ExternalLink className="size-4" />
                </a>
              </div>
              <EngagementBar kind="video" slug={slugForVideo(v.id)} title={v.title} shareUrl={`https://www.youtube.com/watch?v=${v.id}`} />
              <button onClick={() => setCommentsFor({ slug: slugForVideo(v.id), title: v.title })} className="mt-2 inline-flex items-center gap-1.5 text-xs text-brand hover:underline"><MessageCircle className="size-3.5" /> Commenter cette vidéo</button>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 mb-4 font-display text-xl font-bold text-ink">Vidéos téléversées</h2>
        {loading ? (
          <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-brand" /></div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface-alt p-10 text-center text-sm text-ink-soft">
            Aucune vidéo téléversée pour le moment.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedVideos.map((v) => (
              <li key={v.id}>
                <button onClick={() => setOpenFile(v)} className="group relative block w-full overflow-hidden rounded-xl border border-border bg-black">
                  <video src={v.url} className="aspect-video w-full object-cover opacity-90 transition group-hover:opacity-100" muted playsInline preload="metadata" />
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="grid size-14 place-items-center rounded-full bg-white/90 text-brand shadow-lg"><Play className="size-6" /></span>
                  </span>
                </button>
                {v.title && <p className="mt-2 text-sm text-ink">{v.title}</p>}
                <EngagementBar kind="video" slug={v.id} title={v.title || "Vidéo"} shareUrl={v.url} />
              </li>
            ))}
          </ul>
        )}
      </section>
      {commentsFor && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setCommentsFor(null)}>
          <div className="max-h-[85dvh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">{commentsFor.title}</h3>
              <button onClick={() => setCommentsFor(null)} className="text-ink-soft hover:text-brand" aria-label="Fermer">✕</button>
            </div>
            <Comments kind="video" slug={commentsFor.slug} />
          </div>
        </div>
      )}
      {openFile && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setOpenFile(null)}>
          <video src={openFile.url} controls autoPlay className="max-h-[85dvh] w-auto max-w-5xl rounded-xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      {openYt && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setOpenYt(null)}>
          <div className="aspect-video w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${openYt}?autoplay=1`}
              title="Lecteur vidéo YouTube ONPHA-CI"
              className="h-full w-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}