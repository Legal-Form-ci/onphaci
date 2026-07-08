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