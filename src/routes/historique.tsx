import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import historiqueImg from "@/assets/historique-onpha.png.asset.json";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique — ONPHA-CI" },
      { name: "description", content: "De l'APE-ECIS (2007) à l'ANPHA-CI (2010) puis à l'ONG ONPHA-CI (22 octobre 2015) : l'histoire des parents mobilisés pour vaincre la surdité en Côte d'Ivoire." },
      { property: "og:title", content: "Historique de l'ONPHA-CI" },
      { property: "og:description", content: "L'aventure des parents d'enfants sourds de Côte d'Ivoire, de l'APE-ECIS à l'ONPHA-CI." },
      { property: "og:image", content: historiqueImg.url },
      { property: "og:url", content: "https://onphaci.lovable.app/historique" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: historiqueImg.url },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/historique" }],
  }),
  component: HistoriquePage,
});

function HistoriquePage() {
  return (
    <>
      <PageHero
        eyebrow="Historique"
        title="De l'APE-ECIS à l'ONPHA-CI"
        lead="Une aventure de parents mobilisés depuis 2007 pour vaincre la surdité en Côte d'Ivoire."
      />
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <div className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink prose-strong:text-ink">
          <p>
            La prise de conscience des parents géniteurs des enfants en situation de handicap
            auditif de Côte d'Ivoire a débuté dans les <strong>années 2007</strong>. Cet état d'esprit s'est
            matérialisé par le regroupement des parents d'élèves de l'école Ivoirienne pour les
            sourds, dénommé : <strong>APE-ECIS</strong> (Association des Parents de l'École Ivoirienne pour les
            Sourds). Cette ouverture d'esprit a pris des proportions nationales à travers la
            création de <strong>ANPHA-CI</strong> (Association Nationale des Parents des Handicapés Auditifs de
            Côte d'Ivoire) en <strong>2010</strong>.
          </p>
          <p>
            Vu les nombreux challenges et les défis à relever, les premiers responsables de
            ANPHA-CI encouragés par les partenaires, amis et connaissances ont décidé de changer
            de statut en muant en organisation non gouvernementale. De ce qui précède, <strong>ONPHA-CI</strong>
            {" "}(Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire) naît
            des cendres de ANPHA-CI le <strong>22 octobre 2015</strong>.
          </p>
          <p>
            L'ONG ONPHA-CI est un rassemblement de parents qui, au vu des difficultés rencontrées
            par leurs enfants en situation de handicap auditif, se sont donnés comme défi de
            vaincre la surdité tout au plus, de permettre à ses enfants d'être intégrés dans la
            communauté.
          </p>
        </div>

        <figure className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface-alt">
          <img
            src={historiqueImg.url}
            alt="Infographie ONPHA-CI : notre défi, vaincre la surdité. Vision, objectifs, mission, valeurs, but et cibles, illustrés en langue des signes."
            className="w-full h-auto"
            loading="lazy"
          />
          <figcaption className="px-4 py-3 text-xs text-ink-soft">
            Notre défi, vaincre la surdité — vision, mission, valeurs et cibles de l'ONPHA-CI.
          </figcaption>
        </figure>
      </section>
    </>
  );
}