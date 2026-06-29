import { createServerFn } from "@tanstack/react-start";

/**
 * Public visitor counter. Uses a SECURITY DEFINER SQL function so that
 * anonymous visits can be counted without giving the anon role a broad
 * UPDATE grant on the table itself. Each call adds exactly +1.
 */
export const incrementVisitor = createServerFn({ method: "POST" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await sb.rpc("increment_visitor_counter");
  if (error) return { value: null as number | null };
  return { value: (data as number) ?? null };
});

export const getVisitorCount = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data } = await sb.from("site_stats").select("value").eq("key", "visitors").maybeSingle();
  return { value: (data?.value as number | undefined) ?? null };
});