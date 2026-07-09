import { useEffect, useState } from "react";
import { Eye, Share2, MessageCircle, Facebook, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Kind = "article" | "project" | "video";

interface Props {
  kind: Kind;
  slug: string;
  title: string;
  shareUrl: string;
}

export function EngagementBar({ kind, slug, title, shareUrl }: Props) {
  const [views, setViews] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);

  // Initial load + realtime
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("content_engagement")
        .select("views,shares")
        .eq("kind", kind).eq("slug", slug).maybeSingle();
      if (!mounted) return;
      setViews(data?.views ?? 0);
      setShares(data?.shares ?? 0);
      const { count } = await supabase
        .from("comments").select("id", { head: true, count: "exact" })
        .eq("kind", kind).eq("slug", slug);
      if (mounted) setComments(count ?? 0);

      // Increment view once per session
      const key = `viewed:${kind}:${slug}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        await supabase.rpc("increment_content_metric", { _kind: kind, _slug: slug, _metric: "views" });
      }
    })();

    const ch = supabase.channel(`eng:${kind}:${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_engagement", filter: `slug=eq.${slug}` }, (payload: any) => {
        const row = payload.new;
        if (row && row.kind === kind && row.slug === slug) {
          setViews(row.views); setShares(row.shares);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `slug=eq.${slug}` }, async () => {
        const { count } = await supabase.from("comments").select("id", { head: true, count: "exact" }).eq("kind", kind).eq("slug", slug);
        setComments(count ?? 0);
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, [kind, slug]);

  async function share(url: string) {
    await supabase.rpc("increment_content_metric", { _kind: kind, _slug: slug, _metric: "shares" });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const enc = encodeURIComponent;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface-alt px-4 py-3 text-sm">
      <span className="inline-flex items-center gap-1.5 text-ink-soft" aria-label="Vues"><Eye className="size-4" /> <strong className="text-ink">{views.toLocaleString("fr-FR")}</strong> vues</span>
      <span className="inline-flex items-center gap-1.5 text-ink-soft" aria-label="Partages"><Share2 className="size-4" /> <strong className="text-ink">{shares.toLocaleString("fr-FR")}</strong> partages</span>
      <a href="#comments" className="inline-flex items-center gap-1.5 text-ink-soft hover:text-brand"><MessageCircle className="size-4" /> <strong className="text-ink">{comments.toLocaleString("fr-FR")}</strong> commentaires</a>
      <span className="ml-auto flex items-center gap-2">
        <button onClick={() => share(`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:text-brand" aria-label="Partager sur Facebook"><Facebook className="size-3.5" /> Facebook</button>
        <button onClick={() => share(`https://wa.me/?text=${enc(title + " " + shareUrl)}`)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:text-brand">WhatsApp</button>
        <button onClick={() => share(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:text-brand" aria-label="Partager sur LinkedIn"><Linkedin className="size-3.5" /> LinkedIn</button>
      </span>
    </div>
  );
}