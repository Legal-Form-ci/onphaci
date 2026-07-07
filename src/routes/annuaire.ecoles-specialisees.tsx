import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/annuaire/ecoles-specialisees")({
  head: () => ({
    meta: [
      { title: "Écoles spécialisées — Annuaire ONPHA-CI" },
      { name: "description", content: "Recensement des établissements spécialisés accueillant les enfants sourds et malentendants en Côte d'Ivoire." },
      { property: "og:title", content: "Écoles spécialisées — Annuaire ONPHA-CI" },
      { property: "og:description", content: "Répertoire des écoles spécialisées pour enfants sourds et malentendants en Côte d'Ivoire." },
      { property: "og:url", content: "https://onphaci.lovable.app/annuaire/ecoles-specialisees" },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/annuaire/ecoles-specialisees" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Annuaire" title="Écoles spécialisées" lead="Recensement des établissements spécialisés accueillant les enfants sourds et malentendants en Côte d'Ivoire." />
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border bg-surface-alt p-10 text-center text-ink-soft">
          L'annuaire des écoles spécialisées est en cours d'enrichissement. Pour signaler un établissement, écrivez-nous à <a className="text-brand font-medium" href="mailto:onphaci@gmail.com">onphaci@gmail.com</a>.
        </div>
      </div>
    </>
  ),
});