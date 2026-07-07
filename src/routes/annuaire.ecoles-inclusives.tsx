import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/annuaire/ecoles-inclusives")({
  head: () => ({
    meta: [
      { title: "Écoles inclusives — Annuaire ONPHA-CI" },
      { name: "description", content: "Annuaire des écoles ordinaires ivoiriennes engagées dans l'accueil et l'accompagnement des élèves sourds et malentendants." },
      { property: "og:title", content: "Écoles inclusives — Annuaire ONPHA-CI" },
      { property: "og:description", content: "Établissements ordinaires engagés dans l'inclusion des élèves en situation de handicap auditif en Côte d'Ivoire." },
      { property: "og:url", content: "https://onphaci.lovable.app/annuaire/ecoles-inclusives" },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/annuaire/ecoles-inclusives" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Annuaire" title="Écoles inclusives" lead="Établissements ordinaires engagés dans l'accueil et l'accompagnement des élèves en situation de handicap auditif." />
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border bg-surface-alt p-10 text-center text-ink-soft">
          L'annuaire des écoles inclusives est en cours d'enrichissement. Pour proposer un établissement, contactez-nous à <a className="text-brand font-medium" href="mailto:onphaci@gmail.com">onphaci@gmail.com</a>.
        </div>
      </div>
    </>
  ),
});