import { createServerFn } from "@tanstack/react-start";

/**
 * Bootstrap one-shot admin account creation.
 * Idempotent: if the user already exists, just (re)ensures the admin role.
 * Email used for the "onaphaci" identifier: onaphaci@onphaci.org
 */
export const bootstrapAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const email = "onaphaci@onphaci.org";
  const password = "@Onaphaci26";

  // Try to find user
  const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listErr) throw new Error(listErr.message);
  let user = list.users.find((u) => u.email?.toLowerCase() === email);

  if (!user) {
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username: "onaphaci" },
    });
    if (createErr) throw new Error(createErr.message);
    user = created.user!;
  } else {
    // Reset password to the requested one in case it drifted
    await supabaseAdmin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  }

  // Ensure admin role
  const { error: roleErr } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
  if (roleErr) throw new Error(roleErr.message);

  return { ok: true, email, userId: user.id };
});