import { createServerFn } from "@tanstack/react-start";

/**
 * Structure & enrich user-provided content using Lovable AI.
 * Returns a normalized object with title, slug, category, excerpt/summary, and cleaned HTML.
 */
export const structureContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const d = input as { kind?: "article" | "project" | "partner"; text?: string; existing?: Record<string, any> };
    if (!d?.text || typeof d.text !== "string") throw new Error("text requis");
    return { kind: d.kind ?? "article", text: d.text, existing: d.existing ?? {} };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquant");

    const schemaHint =
      data.kind === "project"
        ? `{ "title": string, "slug": string, "summary": string (2 phrases max), "description_html": string (HTML propre, <h2>/<p>/<ul>) }`
        : data.kind === "partner"
        ? `{ "name": string, "category": "Financier"|"Technique"|"Institutionnel", "website_url": string|null, "description_html": string }`
        : `{ "title": string, "slug": string, "category": string, "excerpt": string (2 phrases max), "content_html": string (HTML propre, <h2>/<p>/<ul>/<blockquote>) }`;

    const sys = `Tu es rédacteur en chef pour ONPHA-CI (Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire).
À partir d'un texte brut fourni par l'utilisateur, tu dois :
- corriger l'orthographe, la grammaire et la ponctuation en français,
- structurer et organiser en paragraphes clairs, avec sous-titres (<h2>) et listes si pertinent,
- proposer un titre percutant, un slug URL (kebab-case, sans accents),
- proposer une catégorie et un résumé court,
- renvoyer STRICTEMENT un JSON valide au format : ${schemaHint}
Aucun texte hors JSON. Pas de markdown fences.`;

    const existingCtx = Object.keys(data.existing).length
      ? `\n\nChamps déjà renseignés (ne pas écraser si non-vides) : ${JSON.stringify(data.existing)}`
      : "";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `Type: ${data.kind}\n\nTexte brut :\n${data.text}${existingCtx}` },
        ],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Limite IA atteinte, réessayez plus tard.");
      if (res.status === 402) throw new Error("Crédits IA épuisés — merci de recharger l'espace de travail.");
      throw new Error(`IA a échoué [${res.status}]: ${body}`);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    try { return JSON.parse(content); }
    catch { throw new Error("Réponse IA illisible"); }
  });