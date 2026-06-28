import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CheckCircle2, Target, Eye, HeartHandshake, MapPin } from "lucide-react";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — ONPHA-CI" },
      { name: "description", content: "Histoire, mission, vision et valeurs de l'ONPHA-CI, ONG ivoirienne fondée en 2010 à Yopougon pour l'inclusion des personnes sourdes." },
      { property: "og:title", content: "À propos de l'ONPHA-CI" },
      { property: "og:description", content: "14 ans au service de l'inclusion auditive en Côte d'Ivoire." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="14 ans au service de l'inclusion auditive en Côte d'Ivoire"
        lead="Fondée le 22 septembre 2010 à Yopougon, l'ONPHA-CI fédère parents, professionnels et alliés autour d'une conviction : aucune personne sourde ne doit être laissée à l'écart."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { i: Target, t: "Notre mission", d: "Favoriser l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes en Côte d'Ivoire." },
            { i: Eye, t: "Notre vision", d: "Une Côte d'Ivoire où chaque enfant déficient auditif accède à l'éducation, à la santé et à une vie digne." },
            { i: HeartHandshake, t: "Nos valeurs", d: "Solidarité, dignité, plaidoyer, accompagnement des familles et action concertée avec nos partenaires." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <div className="size-12 rounded-xl bg-brand-soft text-brand grid place-items-center"><Icon className="size-6" /></div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">{t}</h2>
              <p className="mt-2 text-sm text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-ink">Notre histoire</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-ink-soft">
              <p><strong className="text-ink">22 septembre 2010 —</strong> création de l'ONPHA-CI à Yopougon par un collectif de parents d'enfants déficients auditifs.</p>
              <p><strong className="text-ink">2015-2020 —</strong> structuration de l'organisation, premiers partenariats institutionnels et programmes d'éducation inclusive.</p>
              <p><strong className="text-ink">2022 — DéfiSens'AO :</strong> ONPHA-CI rejoint un consortium régional financé par l'AFD pour porter l'accès aux services de prévention et de détection dans 7 pays d'Afrique de l'Ouest.</p>
              <p><strong className="text-ink">2024 —</strong> nouveaux projets sur le droit à la santé, l'inclusion scolaire par le sport, et la prévention VIH chez les personnes sourdes.</p>
            </div>
            <ul className="space-y-3">
              {[
                "Plaidoyer national auprès des institutions publiques",
                "Formation en langue des signes pour parents et enseignants",
                "Dépistage auditif et orientation médicale",
                "Sensibilisation VIH adaptée aux personnes sourdes",
                "Renforcement des capacités des organisations de parents",
                "Partenariats internationaux (France, Afrique de l'Ouest)",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm text-ink">
                  <CheckCircle2 className="mt-0.5 size-5 text-brand shrink-0" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-4">
            <MapPin className="size-6 text-accent-orange" />
            <h2 className="text-2xl font-bold text-ink">Zones d'intervention</h2>
          </div>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Siège à Yopougon (Abidjan). Interventions sur tout le territoire ivoirien et coopération régionale dans 7 pays
            via le projet DéfiSens'AO : Côte d'Ivoire, Bénin, Burkina Faso, Mali, Niger, Sénégal, Togo.
          </p>
          <Link to="/projets" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:brightness-110">
            Découvrir nos projets
          </Link>
        </div>
      </section>
    </>
  );
}