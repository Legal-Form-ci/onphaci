import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — ONPHA-CI" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminGate,
});

function AdminGate() {
  const [status, setStatus] = useState<"loading" | "anon" | "auth" | "admin">("loading");
  const [email, setEmail] = useState("onaphaci@onphaci.org");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return setStatus("anon");
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    setStatus(roles?.some((r) => r.role === "admin") ? "admin" : "auth");
  }
  useEffect(() => { refresh(); }, []);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMsg(error.message);
    refresh();
  }
  async function onBootstrap() {
    setBusy(true); setMsg(null);
    try { const r = await bootstrapAdmin(); setMsg(`Compte initialisé : ${r.email}. Mot de passe : @Onaphaci26`); }
    catch (err: any) { setMsg(err?.message ?? "Erreur"); }
    setBusy(false);
  }
  async function onLogout() { await supabase.auth.signOut(); refresh(); }

  if (status === "loading") return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="size-6 animate-spin text-brand" /></div>;

  if (status === "anon") {
    return (
      <section className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
        <form onSubmit={onLogin} className="w-full rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="mb-6 flex items-center gap-2 text-brand">
            <Lock className="size-5" />
            <h1 className="font-display text-xl font-bold text-ink">Administration ONPHA-CI</h1>
          </div>
          <label className="block text-sm font-medium text-ink">Identifiant (email)</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <label className="mt-4 block text-sm font-medium text-ink">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          {msg && <p className="mt-3 text-sm text-accent-orange">{msg}</p>}
          <button disabled={busy} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />} Se connecter
          </button>
          <button type="button" onClick={onBootstrap} disabled={busy}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-medium text-ink-soft hover:text-brand">
            Initialiser le compte administrateur
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft">Identifiant&nbsp;: <code>onaphaci@onphaci.org</code></p>
        </form>
      </section>
    );
  }

  if (status === "auth") {
    return (
      <section className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-soft">Vous êtes connecté mais sans rôle administrateur.</p>
        <button onClick={onLogout} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"><LogOut className="size-4" /> Se déconnecter</button>
      </section>
    );
  }

  // admin
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand"><ShieldCheck className="size-6" /></span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Tableau de bord administrateur</h1>
            <p className="text-sm text-ink-soft">Bienvenue — gérez le contenu de la plateforme.</p>
          </div>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><LogOut className="size-4" /> Déconnexion</button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Articles & actualités", "Créer, éditer, publier"],
          ["Projets", "Gérer la liste des projets"],
          ["Partenaires", "Logos et catégories"],
          ["Médiathèque", "Images et vidéos"],
          ["Utilisateurs & rôles", "Inviter un éditeur"],
          ["Paramètres", "Configuration générale"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-ink">{t}</h3>
            <p className="mt-1 text-sm text-ink-soft">{d}</p>
            <p className="mt-4 text-xs font-medium text-accent-orange">Module en cours de livraison</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xs text-ink-soft">
        <Link to="/" className="hover:text-brand">← Retour au site public</Link>
      </p>
    </section>
  );
}