import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PARTNERS } from "@/data/partners";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Partenaires — ONPHA-CI" },
      { name: "description", content: "Partenaires financiers, techniques et institutionnels de l'ONPHA-CI : AFD, Ambassade de France, Fondation Orange, RIP-EPT et plus." },
      { property: "og:title", content: "Les partenaires de l'ONPHA-CI" },
      { property: "og:description", content: "Une coalition d'acteurs au service de l'inclusion auditive." },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const groups = ["Financier", "Technique", "Institutionnel"] as const;
  return (
    <>
      <PageHero eyebrow="Partenaires" title="Une coalition au service de l'inclusion" lead="ONPHA-CI agit avec des partenaires financiers, techniques et institutionnels qui partagent sa mission." />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 space-y-14">
        {groups.map((g) => {
          const list = PARTNERS.filter((p) => p.type === g);
          if (list.length === 0) return null;
          return (
            <div key={g}>
              <h2 className="text-2xl font-bold text-ink">Partenaires {g.toLowerCase()}s</h2>
              <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((p) => (
                  <li key={p.name} className="flex flex-col items-start justify-center gap-3 rounded-xl border border-border bg-card p-5 min-h-28">
                    {p.logo && (
                      <img src={p.logo} alt={`Logo ${p.name}`} loading="lazy" className="h-16 w-auto object-contain" />
                    )}
                    <span className="text-sm font-semibold text-ink leading-snug">{p.name}</span>
                    {p.country && <span className="text-xs text-ink-soft">{p.country}</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>
    </>
  );
}