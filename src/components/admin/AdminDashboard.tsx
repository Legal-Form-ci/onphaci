import { useEffect, useState, useCallback } from "react";
import { LogOut, ShieldCheck, FileText, Briefcase, Handshake, Image as ImageIcon, Plus, Trash2, Pencil, X, Save, Loader2, Upload, ExternalLink, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { importMediaFromOnphaci, importPartnersFromOnphaci, importVideosFromOnphaci, importCategoriesFromOnphaci } from "@/lib/admin.functions";
import { structureContent } from "@/lib/ai-structure.functions";
import { MediaUpload } from "./MediaUpload";

type Tab = "articles" | "projects" | "partners" | "media";

interface Article { id: string; slug: string; title: string; excerpt: string | null; content_html: string | null; cover_url: string | null; category: string | null; status: "draft" | "published"; published_at: string | null; }
interface Project { id: string; slug: string; title: string; summary: string | null; description_html: string | null; cover_url: string | null; status: "draft" | "published"; sort_order: number; }
interface Partner { id: string; name: string; logo_url: string | null; website_url: string | null; category: string | null; sort_order: number; }
interface Media { id: string; title: string | null; caption: string | null; kind: "image" | "video"; url: string; storage_path: string | null; mime_type: string | null; created_at: string; }

function slugify(s: string) { return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90); }

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("articles");
  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "articles", label: "Articles", icon: FileText },
    { id: "projects", label: "Projets", icon: Briefcase },
    { id: "partners", label: "Partenaires", icon: Handshake },
    { id: "media", label: "Médiathèque", icon: ImageIcon },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand"><ShieldCheck className="size-5" /></span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Espace administrateur</h1>
            <p className="text-xs text-ink-soft">Gérez le contenu publié sur la plateforme ONPHA-CI.</p>
          </div>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><LogOut className="size-4" /> Déconnexion</button>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${tab === t.id ? "border-brand text-brand" : "border-transparent text-ink-soft hover:text-ink"}`}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "articles" && <ArticlesModule />}
        {tab === "projects" && <ProjectsModule />}
        {tab === "partners" && <PartnersModule />}
        {tab === "media" && <MediaModule />}
      </div>
    </section>
  );
}

/* ============================================================ ARTICLES */
function ArticlesModule() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message);
    setItems((data as Article[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save(a: Partial<Article>) {
    setMsg(null);
    const payload: any = {
      slug: a.slug || slugify(a.title || ""),
      title: a.title, excerpt: a.excerpt || null, content_html: a.content_html || null,
      cover_url: a.cover_url || null, category: a.category || null,
      status: a.status || "draft",
      published_at: a.status === "published" ? (a.published_at || new Date().toISOString()) : null,
    };
    const { error } = a.id
      ? await supabase.from("articles").update(payload).eq("id", a.id)
      : await supabase.from("articles").insert(payload);
    if (error) return setMsg(error.message);
    setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) return setMsg(error.message);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Articles &amp; actualités <span className="ml-2 text-xs font-normal text-ink-soft">({items.length})</span></h2>
        <button onClick={() => setEditing({ status: "draft" })} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"><Plus className="size-4" /> Nouvel article</button>
      </div>
      {msg && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      {loading ? <Loader2 className="mx-auto mt-8 size-6 animate-spin text-brand" /> : items.length === 0 ? (
        <EmptyState label="Aucun article publié via le CMS. Les 29 articles historiques restent affichés depuis le fichier." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-xs uppercase tracking-wider text-ink-soft">
              <tr><th className="px-4 py-3 text-left">Titre</th><th className="px-4 py-3 text-left">Catégorie</th><th className="px-4 py-3 text-left">Statut</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map(a => (
                <tr key={a.id}>
                  <td className="px-4 py-3"><div className="font-medium text-ink">{a.title}</div><div className="text-xs text-ink-soft">/{a.slug}</div></td>
                  <td className="px-4 py-3 text-ink-soft">{a.category || "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(a)} className="mr-2 text-brand hover:underline"><Pencil className="inline size-4" /></button>
                    <button onClick={() => del(a.id)} className="text-red-600 hover:underline"><Trash2 className="inline size-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && <ArticleForm value={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ArticleForm({ value, onSave, onCancel }: { value: Partial<Article>; onSave: (a: Partial<Article>) => void; onCancel: () => void; }) {
  const [v, setV] = useState<Partial<Article>>(value);
  const [saving, setSaving] = useState(false);
  return (
    <Modal title={v.id ? "Modifier l'article" : "Nouvel article"} onClose={onCancel}>
      <div className="grid gap-4">
        <Field label="Titre" required><input type="text" value={v.title || ""} onChange={e => setV({ ...v, title: e.target.value })} className={input} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL)" hint="Auto-généré si vide"><input type="text" value={v.slug || ""} onChange={e => setV({ ...v, slug: e.target.value })} className={input} placeholder={v.title ? slugify(v.title) : ""} /></Field>
          <Field label="Catégorie"><input type="text" value={v.category || ""} onChange={e => setV({ ...v, category: e.target.value })} className={input} placeholder="Actualité, Projet…" /></Field>
        </div>
        <Field label="Image de couverture">
          <MediaUpload value={v.cover_url} onChange={(u) => setV({ ...v, cover_url: u })} accept="image/*" kind="image" />
        </Field>
        <Field label="Résumé"><textarea value={v.excerpt || ""} onChange={e => setV({ ...v, excerpt: e.target.value })} className={input} rows={2} /></Field>
        <Field label="Contenu (HTML)" hint="Écrivez librement puis cliquez « Structurer avec l'IA » : titre, slug, catégorie, résumé et HTML seront corrigés et remplis automatiquement.">
          <div className="space-y-2">
            <textarea value={v.content_html || ""} onChange={e => setV({ ...v, content_html: e.target.value })} className={`${input} font-mono text-xs`} rows={10} />
            <AiStructureButton kind="article" text={v.content_html || ""} existing={{ title: v.title, category: v.category, excerpt: v.excerpt }}
              onResult={(r) => setV({ ...v,
                title: v.title || r.title || "",
                slug: v.slug || r.slug || "",
                category: v.category || r.category || "",
                excerpt: v.excerpt || r.excerpt || "",
                content_html: r.content_html || v.content_html || "",
              })} />
          </div>
        </Field>
        <Field label="Statut">
          <select value={v.status || "draft"} onChange={e => setV({ ...v, status: e.target.value as any })} className={input}>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </Field>
        <FormActions saving={saving} onCancel={onCancel} onSave={async () => { setSaving(true); await onSave(v); setSaving(false); }} disabled={!v.title} />
      </div>
    </Modal>
  );
}

/* ============================================================ PROJECTS */
function ProjectsModule() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) setMsg(error.message);
    setItems((data as Project[]) ?? []); setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);
  async function save(p: Partial<Project>) {
    const payload: any = { slug: p.slug || slugify(p.title || ""), title: p.title, summary: p.summary || null, description_html: p.description_html || null, cover_url: p.cover_url || null, status: p.status || "draft", sort_order: p.sort_order ?? 0 };
    const { error } = p.id ? await supabase.from("projects").update(payload).eq("id", p.id) : await supabase.from("projects").insert(payload);
    if (error) return setMsg(error.message);
    setEditing(null); load();
  }
  async function del(id: string) { if (!confirm("Supprimer ce projet ?")) return; await supabase.from("projects").delete().eq("id", id); load(); }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Projets <span className="ml-2 text-xs font-normal text-ink-soft">({items.length})</span></h2>
        <button onClick={() => setEditing({ status: "draft", sort_order: 0 })} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"><Plus className="size-4" /> Nouveau projet</button>
      </div>
      {msg && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      {loading ? <Loader2 className="mx-auto mt-8 size-6 animate-spin text-brand" /> : items.length === 0 ? <EmptyState label="Aucun projet CMS. Les projets d'origine restent affichés depuis le fichier." /> : (
        <div className="grid gap-3">
          {items.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                {p.cover_url && <img src={p.cover_url} alt="" className="size-14 rounded-lg object-cover" loading="lazy" />}
                <div><div className="font-medium text-ink">{p.title}</div><div className="text-xs text-ink-soft">/{p.slug} · ordre {p.sort_order}</div></div>
              </div>
              <div className="flex items-center gap-3"><StatusBadge status={p.status} />
                <button onClick={() => setEditing(p)} className="text-brand"><Pencil className="size-4" /></button>
                <button onClick={() => del(p.id)} className="text-red-600"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? "Modifier le projet" : "Nouveau projet"} onClose={() => setEditing(null)}>
          <ProjectForm value={editing} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
function ProjectForm({ value, onSave, onCancel }: { value: Partial<Project>; onSave: (p: Partial<Project>) => void; onCancel: () => void; }) {
  const [v, setV] = useState<Partial<Project>>(value);
  const [saving, setSaving] = useState(false);
  return (
    <div className="grid gap-4">
      <Field label="Titre" required><input value={v.title || ""} onChange={e => setV({ ...v, title: e.target.value })} className={input} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug"><input value={v.slug || ""} onChange={e => setV({ ...v, slug: e.target.value })} className={input} placeholder={v.title ? slugify(v.title) : ""} /></Field>
        <Field label="Ordre"><input type="number" value={v.sort_order ?? 0} onChange={e => setV({ ...v, sort_order: parseInt(e.target.value || "0", 10) })} className={input} /></Field>
      </div>
      <Field label="Image de couverture">
        <MediaUpload value={v.cover_url} onChange={(u) => setV({ ...v, cover_url: u })} accept="image/*" kind="image" />
      </Field>
      <Field label="Résumé"><textarea value={v.summary || ""} onChange={e => setV({ ...v, summary: e.target.value })} className={input} rows={2} /></Field>
      <Field label="Description (HTML)" hint="Écrivez librement puis cliquez « Structurer avec l'IA ».">
        <div className="space-y-2">
          <textarea value={v.description_html || ""} onChange={e => setV({ ...v, description_html: e.target.value })} className={`${input} font-mono text-xs`} rows={8} />
          <AiStructureButton kind="project" text={v.description_html || ""} existing={{ title: v.title, summary: v.summary }}
            onResult={(r) => setV({ ...v,
              title: v.title || r.title || "",
              slug: v.slug || r.slug || "",
              summary: v.summary || r.summary || "",
              description_html: r.description_html || v.description_html || "",
            })} />
        </div>
      </Field>
      <Field label="Statut"><select value={v.status || "draft"} onChange={e => setV({ ...v, status: e.target.value as any })} className={input}><option value="draft">Brouillon</option><option value="published">Publié</option></select></Field>
      <FormActions saving={saving} onCancel={onCancel} onSave={async () => { setSaving(true); await onSave(v); setSaving(false); }} disabled={!v.title} />
    </div>
  );
}

/* ============================================================ PARTNERS */
function PartnersModule() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Partner> | null>(null);
  const load = useCallback(async () => { setLoading(true); const { data } = await supabase.from("partners").select("*").order("sort_order").order("name"); setItems((data as Partner[]) ?? []); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  async function save(p: Partial<Partner>) {
    const payload: any = { name: p.name, logo_url: p.logo_url || null, website_url: p.website_url || null, category: p.category || null, sort_order: p.sort_order ?? 0 };
    const { error } = p.id ? await supabase.from("partners").update(payload).eq("id", p.id) : await supabase.from("partners").insert(payload);
    if (error) return alert(error.message);
    setEditing(null); load();
  }
  async function del(id: string) { if (!confirm("Supprimer ce partenaire ?")) return; await supabase.from("partners").delete().eq("id", id); load(); }
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Partenaires <span className="ml-2 text-xs font-normal text-ink-soft">({items.length})</span></h2>
        <div className="flex gap-2">
          <button onClick={async () => { try { const r = await importPartnersFromOnphaci(); alert(`Import terminé : ${r.inserted} nouveau(x) partenaire(s) sur ${r.total}.`); load(); } catch (e: any) { alert(e.message); } }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><Upload className="size-4" /> Importer depuis onphaci.org</button>
          <button onClick={() => setEditing({ sort_order: 0 })} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"><Plus className="size-4" /> Ajouter</button>
        </div>
      </div>
      {loading ? <Loader2 className="mx-auto mt-8 size-6 animate-spin text-brand" /> : items.length === 0 ? <EmptyState label="Aucun partenaire CMS. Ceux du fichier restent affichés." /> : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(p => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                {p.logo_url ? <img src={p.logo_url} alt={p.name} className="h-12 w-auto object-contain" loading="lazy" /> : <div className="grid size-12 place-items-center rounded bg-surface-alt text-ink-soft"><Handshake className="size-5" /></div>}
                <div className="flex gap-2"><button onClick={() => setEditing(p)} className="text-brand"><Pencil className="size-4" /></button><button onClick={() => del(p.id)} className="text-red-600"><Trash2 className="size-4" /></button></div>
              </div>
              <div className="mt-3 font-medium text-ink">{p.name}</div>
              {p.category && <div className="text-xs text-ink-soft">{p.category}</div>}
              {p.website_url && <a href={p.website_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-brand hover:underline">Site <ExternalLink className="size-3" /></a>}
            </div>
          ))}
        </div>
      )}
      {editing && (
        <Modal title={editing.id ? "Modifier le partenaire" : "Nouveau partenaire"} onClose={() => setEditing(null)}>
          <PartnerForm value={editing} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
function PartnerForm({ value, onSave, onCancel }: { value: Partial<Partner>; onSave: (p: Partial<Partner>) => void; onCancel: () => void; }) {
  const [v, setV] = useState<Partial<Partner>>(value);
  const [saving, setSaving] = useState(false);
  return (
    <div className="grid gap-4">
      <Field label="Nom" required><input value={v.name || ""} onChange={e => setV({ ...v, name: e.target.value })} className={input} /></Field>
      <Field label="Logo">
        <MediaUpload value={v.logo_url} onChange={(u) => setV({ ...v, logo_url: u })} accept="image/*" kind="image" />
      </Field>
      <Field label="Site web"><input value={v.website_url || ""} onChange={e => setV({ ...v, website_url: e.target.value })} className={input} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Catégorie"><input value={v.category || ""} onChange={e => setV({ ...v, category: e.target.value })} className={input} /></Field>
        <Field label="Ordre"><input type="number" value={v.sort_order ?? 0} onChange={e => setV({ ...v, sort_order: parseInt(e.target.value || "0", 10) })} className={input} /></Field>
      </div>
      <FormActions saving={saving} onCancel={onCancel} onSave={async () => { setSaving(true); await onSave(v); setSaving(false); }} disabled={!v.name} />
    </div>
  );
}

/* ============================================================ MEDIA */
function MediaModule() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => { setLoading(true); const { data } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false }); setItems((data as Media[]) ?? []); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  async function upload(file: File) {
    setUploading(true); setMsg(null);
    try {
      const isVideo = file.type.startsWith("video/");
      const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const { error: insErr } = await supabase.from("media_assets").insert({ title: file.name, kind: isVideo ? "video" : "image", url: pub.publicUrl, storage_path: path, mime_type: file.type });
      if (insErr) throw insErr;
      load();
    } catch (e: any) { setMsg(e.message || "Échec du téléversement"); }
    finally { setUploading(false); }
  }
  async function del(m: Media) {
    if (!confirm("Supprimer ce média ?")) return;
    if (m.storage_path) await supabase.storage.from("media").remove([m.storage_path]);
    await supabase.from("media_assets").delete().eq("id", m.id);
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Médiathèque <span className="ml-2 text-xs font-normal text-ink-soft">({items.length})</span></h2>
        <div className="flex gap-2">
        <button onClick={async () => { try { const r = await importMediaFromOnphaci(); setMsg(`Import terminé : ${r.inserted} nouveau(x) média(s) sur ${r.total}.`); load(); } catch (e: any) { setMsg(e.message); } }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><Upload className="size-4" /> Importer depuis onphaci.org</button>
        <button onClick={async () => { try { setMsg("Import des vidéos en cours…"); const r = await importVideosFromOnphaci(); setMsg(`Vidéos : ${r.inserted} nouvelle(s) sur ${r.total}.`); load(); } catch (e: any) { setMsg(e.message); } }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><Upload className="size-4" /> Importer vidéos YouTube</button>
        <button onClick={async () => { try { setMsg("Import catégories école/association…"); const r = await importCategoriesFromOnphaci(); setMsg(`Catégories : ${r.insertedArticles} articles, ${r.insertedMedia} médias.`); load(); } catch (e: any) { setMsg(e.message); } }} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:text-brand"><Upload className="size-4" /> Importer catégories</button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Téléverser
          <input type="file" accept="image/*,video/*" className="hidden" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        </label>
        </div>
      </div>
      {msg && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{msg}</p>}
      {loading ? <Loader2 className="mx-auto mt-8 size-6 animate-spin text-brand" /> : items.length === 0 ? <EmptyState label="Aucun média. Téléversez images ou vidéos pour les réutiliser dans les articles." /> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(m => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
              {m.kind === "image" ? (
                <img src={m.url} alt={m.title || ""} className="aspect-video w-full object-cover" loading="lazy" />
              ) : (
                <video src={m.url} className="aspect-video w-full object-cover" muted playsInline />
              )}
              <div className="p-2 text-xs">
                <div className="truncate text-ink" title={m.title || ""}>{m.title || "Sans titre"}</div>
                <div className="mt-1 flex items-center justify-between">
                  <button onClick={() => { navigator.clipboard.writeText(m.url); setMsg("URL copiée"); setTimeout(() => setMsg(null), 1500); }} className="text-brand hover:underline">Copier l'URL</button>
                  <button onClick={() => del(m)} className="text-red-600"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================ UI PRIMITIVES */
const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function Field({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) {
  return (<label className="block"><span className="mb-1 block text-xs font-medium text-ink">{label}{required && <span className="text-red-600"> *</span>}</span>{children}{hint && <span className="mt-0.5 block text-[11px] text-ink-soft">{hint}</span>}</label>);
}
function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (<span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${status === "published" ? "bg-brand-soft text-brand" : "bg-surface-alt text-ink-soft"}`}>{status === "published" ? "Publié" : "Brouillon"}</span>);
}
function EmptyState({ label }: { label: string }) { return <div className="rounded-xl border border-dashed border-border bg-surface-alt p-10 text-center text-sm text-ink-soft">{label}</div>; }
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-ink-soft hover:bg-surface-alt hover:text-ink"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
function FormActions({ saving, onSave, onCancel, disabled }: { saving: boolean; onSave: () => void; onCancel: () => void; disabled?: boolean }) {
  return (
    <div className="mt-2 flex items-center justify-end gap-3 border-t border-border pt-4">
      <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm text-ink-soft hover:text-ink">Annuler</button>
      <button onClick={onSave} disabled={saving || disabled} className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Enregistrer
      </button>
    </div>
  );
}

function AiStructureButton({ kind, text, existing, onResult }: { kind: "article" | "project" | "partner"; text: string; existing: Record<string, any>; onResult: (r: any) => void; }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function run() {
    if (!text.trim()) { setErr("Écrivez d'abord du contenu à structurer."); return; }
    setBusy(true); setErr(null);
    try {
      const r = await structureContent({ data: { kind, text, existing } });
      onResult(r);
    } catch (e: any) { setErr(e.message || "Erreur IA"); }
    finally { setBusy(false); }
  }
  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={run} disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-accent-orange px-4 py-2 text-xs font-semibold text-white shadow hover:brightness-110 disabled:opacity-60">
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
        Structurer avec l'IA
      </button>
      {err && <span className="text-xs text-red-600">{err}</span>}
    </div>
  );
}