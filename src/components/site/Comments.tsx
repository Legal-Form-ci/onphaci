import { useEffect, useState } from "react";
import { Loader2, Send, Trash2, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Kind = "article" | "project" | "video";

interface Comment {
  id: string; user_id: string; author_name: string; author_avatar: string | null; body: string; created_at: string;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-5.9-2.7-5.9-6s2.6-6 5.9-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-8 0-.5 0-.9-.1-1.3H12z" />
    </svg>
  );
}

export function Comments({ kind, slug }: { kind: Kind; slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; avatar: string | null } | null>(null);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refreshUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setUser(null);
    const meta = data.user.user_metadata ?? {};
    setUser({
      id: data.user.id,
      name: meta.name || meta.full_name || (data.user.email?.split("@")[0] ?? "Membre"),
      avatar: meta.avatar_url ?? null,
    });
  }

  useEffect(() => {
    refreshUser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refreshUser());
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.from("comments")
        .select("id,user_id,author_name,author_avatar,body,created_at")
        .eq("kind", kind).eq("slug", slug).order("created_at", { ascending: false });
      if (mounted) { setItems((data as Comment[]) ?? []); setLoading(false); }
    })();
    const ch = supabase.channel(`comments:${kind}:${slug}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments", filter: `slug=eq.${slug}` }, (p: any) => {
        if (p.new.kind === kind) setItems((prev) => [p.new as Comment, ...prev]);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "comments" }, (p: any) => {
        setItems((prev) => prev.filter((c) => c.id !== p.old.id));
      })
      .subscribe();
    return () => { mounted = false; supabase.removeChannel(ch); };
  }, [kind, slug]);

  async function signIn() {
    setErr(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setErr(r.error.message || "Connexion Google échouée");
  }
  async function signOut() { await supabase.auth.signOut(); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !body.trim()) return;
    setPosting(true); setErr(null);
    const { error } = await supabase.from("comments").insert({
      kind, slug, user_id: user.id, author_name: user.name, author_avatar: user.avatar, body: body.trim(),
    });
    setPosting(false);
    if (error) return setErr(error.message);
    setBody("");
  }

  async function remove(id: string) {
    await supabase.from("comments").delete().eq("id", id);
  }

  return (
    <section id="comments" className="mx-auto mt-12 max-w-3xl px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink">Commentaires</h2>
        {user ? (
          <button onClick={signOut} className="inline-flex items-center gap-2 text-xs text-ink-soft hover:text-brand">
            <LogOut className="size-3.5" /> Se déconnecter
          </button>
        ) : null}
      </div>

      {user ? (
        <form onSubmit={submit} className="mt-4 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-3">
            {user.avatar ? <img src={user.avatar} alt="" className="size-9 rounded-full" /> : <div className="grid size-9 place-items-center rounded-full bg-brand text-white text-sm">{user.name[0]?.toUpperCase()}</div>}
            <div>
              <div className="text-sm font-semibold text-ink">{user.name}</div>
              <div className="text-xs text-ink-soft">Connecté avec Google</div>
            </div>
          </div>
          <textarea required maxLength={2000} rows={3} value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Partagez votre réaction, votre expérience ou une question…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
          <div className="mt-3 flex items-center justify-end">
            <button disabled={posting || !body.trim()} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {posting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Publier
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-surface-alt p-4">
          <p className="text-sm text-ink-soft">Connectez-vous pour laisser un commentaire.</p>
          <button onClick={signIn} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:text-brand">
            <GoogleIcon /> Se connecter avec Google <LogIn className="size-3.5" />
          </button>
          {err && <p className="w-full text-xs text-red-600">{err}</p>}
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {loading ? (
          <li className="grid place-items-center py-10"><Loader2 className="size-5 animate-spin text-brand" /></li>
        ) : items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-border bg-surface-alt p-6 text-center text-sm text-ink-soft">Soyez la première personne à commenter.</li>
        ) : items.map((c) => (
          <li key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start gap-3">
              {c.author_avatar ? <img src={c.author_avatar} alt="" className="size-9 rounded-full" /> : <div className="grid size-9 place-items-center rounded-full bg-brand-soft text-brand text-sm font-bold">{c.author_name[0]?.toUpperCase()}</div>}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-sm font-semibold text-ink">{c.author_name}</div>
                  <time className="shrink-0 text-xs text-ink-soft">{new Date(c.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <p className="mt-1 whitespace-pre-line text-sm text-ink">{c.body}</p>
                {user?.id === c.user_id && (
                  <button onClick={() => remove(c.id)} className="mt-2 inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                    <Trash2 className="size-3" /> Supprimer
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}