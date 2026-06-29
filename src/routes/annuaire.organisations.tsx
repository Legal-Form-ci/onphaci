import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/annuaire/organisations")({
  head: () => ({ meta: [{ title: "Organisations de personnes handicapées — ONPHA-CI" }] }),
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