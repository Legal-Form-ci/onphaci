import { createServerFn } from "@tanstack/react-start";
import { PARTNERS } from "@/data/partners";
import { ARTICLES } from "@/data/articles";

/**
 * Bootstrap one-shot admin account creation.
 * Idempotent: creates or updates the admin account and ensures the admin role.
 */
export const bootstrapAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = "admin@onphaci.org";
  const password = "@Onphaci10";

  const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listErr) throw new Error(listErr.message);
  let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username: "admin" },
    });
    if (createErr) throw new Error(createErr.message);
    user = created.user!;
  } else {
    await supabaseAdmin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  }

  const { error: roleErr } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
  if (roleErr) throw new Error(roleErr.message);

  return { ok: true, email, userId: user.id };
});

/** Import all unique media URLs (covers + inline images) from articles.json into media_assets. */
export const importMediaFromOnphaci = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const urls = new Map<string, { title: string; kind: "image" | "video" }>();
  for (const a of ARTICLES) {
    if (a.cover) urls.set(a.cover, { title: a.title, kind: /\.(mp4|webm|mov)$/i.test(a.cover) ? "video" : "image" });
    for (const img of a.inline_images || []) {
      if (!urls.has(img)) urls.set(img, { title: a.title, kind: /\.(mp4|webm|mov)$/i.test(img) ? "video" : "image" });
    }
  }
  const { data: existing } = await supabaseAdmin.from("media_assets").select("url");
  const have = new Set((existing ?? []).map((r: any) => r.url));
  const rows = [...urls.entries()]
    .filter(([url]) => !have.has(url))
    .map(([url, meta]) => ({ url, title: meta.title, kind: meta.kind, caption: "Importé depuis onphaci.org" }));
  if (rows.length === 0) return { ok: true, inserted: 0, total: urls.size };
  const { error } = await supabaseAdmin.from("media_assets").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true, inserted: rows.length, total: urls.size };
});

/** Import all partners (with logos where available) from the static list into the partners table. */
export const importPartnersFromOnphaci = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: existing } = await supabaseAdmin.from("partners").select("name");
  const have = new Set((existing ?? []).map((r: any) => r.name));
  const rows = PARTNERS
    .filter((p) => !have.has(p.name))
    .map((p, i) => ({ name: p.name, logo_url: p.logo ?? null, website_url: p.url ?? null, category: p.type, sort_order: i }));
  if (rows.length === 0) return { ok: true, inserted: 0, total: PARTNERS.length };
  const { error } = await supabaseAdmin.from("partners").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true, inserted: rows.length, total: PARTNERS.length };
});

/** Scrape onphaci.org/category/video/ (+ article pages) for YouTube IDs and register them in media_assets as videos. */
export const importVideosFromOnphaci = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const CAT = "https://onphaci.org/category/video/";
  const ua = { "user-agent": "Mozilla/5.0 ONPHACI-Importer" };

  async function fetchText(url: string): Promise<string> {
    try { const r = await fetch(url, { headers: ua }); return r.ok ? await r.text() : ""; } catch { return ""; }
  }

  const catHtml = await fetchText(CAT);
  // Collect article URLs from the category page (WordPress permalinks under onphaci.org/<slug>/)
  const articleUrls = new Set<string>();
  for (const m of catHtml.matchAll(/https?:\/\/onphaci\.org\/([a-z0-9\-]+)\//gi)) {
    const slug = m[1];
    if (["category","tag","author","page","wp-content","wp-json","feed","comments"].includes(slug)) continue;
    articleUrls.add(`https://onphaci.org/${slug}/`);
  }

  // Aggregate YouTube IDs from category + each article page
  const yt = new Map<string, { title: string; source: string }>();
  function pushYt(html: string, source: string) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const rawTitle = (titleMatch?.[1] || "").replace(/\s*[|–-]\s*ONPHA[^<]*/i, "").trim() || "Vidéo ONPHA-CI";
    const patterns = [
      /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/g,
      /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g,
      /youtu\.be\/([A-Za-z0-9_-]{11})/g,
      /youtube-nocookie\.com\/embed\/([A-Za-z0-9_-]{11})/g,
    ];
    for (const re of patterns) for (const m of html.matchAll(re)) {
      const id = m[1];
      if (!yt.has(id)) yt.set(id, { title: rawTitle, source });
    }
  }
  pushYt(catHtml, CAT);
  const articles = [...articleUrls].slice(0, 40);
  const pages = await Promise.all(articles.map((u) => fetchText(u).then((h) => [u, h] as const)));
  for (const [u, h] of pages) if (h) pushYt(h, u);

  const { data: existing } = await supabaseAdmin.from("media_assets").select("url");
  const have = new Set((existing ?? []).map((r: any) => r.url));
  const rows = [...yt.entries()]
    .map(([id, meta]) => ({
      url: `https://www.youtube.com/watch?v=${id}`,
      title: meta.title,
      kind: "video" as const,
      caption: `Importée depuis ${meta.source}`,
    }))
    .filter((r) => !have.has(r.url));
  if (rows.length === 0) return { ok: true, inserted: 0, total: yt.size };
  const { error } = await supabaseAdmin.from("media_assets").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true, inserted: rows.length, total: yt.size };
});

/** Import articles from a set of onphaci.org category pages into the articles table. Skips existing slugs. */
export const importCategoriesFromOnphaci = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const CATS = [
    { url: "https://onphaci.org/category/ecole/", category: "École" },
    { url: "https://onphaci.org/category/ecole-inclusives/", category: "École inclusive" },
    { url: "https://onphaci.org/category/association/", category: "Association" },
  ];
  const ua = { "user-agent": "Mozilla/5.0 ONPHACI-Importer" };
  async function fetchText(url: string) { try { const r = await fetch(url, { headers: ua }); return r.ok ? await r.text() : ""; } catch { return ""; } }

  function extractArticles(html: string) {
    const links = new Set<string>();
    for (const m of html.matchAll(/https?:\/\/onphaci\.org\/([a-z0-9\-]+)\//gi)) {
      const slug = m[1];
      if (["category","tag","author","page","wp-content","wp-json","feed","comments","contact","a-propos","accueil"].includes(slug)) continue;
      links.add(slug);
    }
    return [...links];
  }

  const { data: existing } = await supabaseAdmin.from("articles").select("slug");
  const have = new Set((existing ?? []).map((r: any) => r.slug));
  const { data: existingMedia } = await supabaseAdmin.from("media_assets").select("url");
  const haveMedia = new Set((existingMedia ?? []).map((r: any) => r.url));

  let inserted = 0;
  const mediaRows: any[] = [];
  for (const cat of CATS) {
    const catHtml = await fetchText(cat.url);
    const slugs = extractArticles(catHtml).slice(0, 15);
    const pages = await Promise.all(slugs.map((s) => fetchText(`https://onphaci.org/${s}/`).then((h) => [s, h] as const)));
    for (const [slug, html] of pages) {
      if (!html || have.has(slug)) continue;
      const titleMatch = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i)
        || html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = (titleMatch?.[1] || slug).replace(/\s*[|–-]\s*ONPHA[^<]*/i, "").trim();
      const excerptMatch = html.match(/<meta name="description" content="([^"]+)"/i)
        || html.match(/<meta property="og:description" content="([^"]+)"/i);
      const excerpt = excerptMatch?.[1]?.trim() || null;
      const coverMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      const cover = coverMatch?.[1] || null;
      const contentMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)
        || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      const content_html = contentMatch?.[1]?.trim() || html;
      const { error } = await supabaseAdmin.from("articles").insert({
        slug, title, excerpt, cover_url: cover, content_html,
        category: cat.category, status: "published", published_at: new Date().toISOString(),
      });
      if (!error) { inserted++; have.add(slug); }
      // Collect inline images
      for (const im of html.matchAll(/<img[^>]+src="([^"]+)"/gi)) {
        const url = im[1];
        if (url.startsWith("http") && !haveMedia.has(url)) {
          haveMedia.add(url);
          mediaRows.push({ url, title, kind: "image", caption: `Importé depuis ${cat.url}` });
        }
      }
      if (cover && !haveMedia.has(cover)) { haveMedia.add(cover); mediaRows.push({ url: cover, title, kind: "image", caption: `Couverture ${cat.category}` }); }
    }
  }
  if (mediaRows.length) await supabaseAdmin.from("media_assets").insert(mediaRows);
  return { ok: true, insertedArticles: inserted, insertedMedia: mediaRows.length };
});