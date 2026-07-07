import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/annuaire/organisations")({
  head: () => ({
    meta: [
      { title: "Organisations de personnes handicapées — ONPHA-CI" },
      { name: "description", content: "Faîtières, associations et structures partenaires actives sur l'ensemble du territoire ivoirien pour l'inclusion des personnes handicapées." },
      { property: "og:title", content: "Organisations de personnes handicapées — Annuaire ONPHA-CI" },
      { property: "og:description", content: "Répertoire des faîtières et associations œuvrant pour les personnes handicapées en Côte d'Ivoire." },
      { property: "og:url", content: "https://onphaci.lovable.app/annuaire/organisations" },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/annuaire/organisations" }],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Annuaire" title="Organisations de personnes handicapées" lead="Faîtières, associations et structures partenaires actives sur l'ensemble du territoire ivoirien." />
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-dashed border-border bg-surface-alt p-10 text-center text-ink-soft">
          L'annuaire des organisations sera publié prochainement. Pour figurer dans le répertoire, écrivez à <a className="text-brand font-medium" href="mailto:onphaci@gmail.com">onphaci@gmail.com</a>.
        </div>
      </div>
    </>
  ),
});