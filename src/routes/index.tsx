import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Users, Globe2, Calendar, Sparkles } from "lucide-react";
import { ARTICLES, formatDate } from "@/data/articles";
import { PROJECTS } from "@/data/projects";
import { PARTNERS } from "@/data/partners";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ONPHA-CI — Inclusion des personnes sourdes en Côte d'Ivoire" },
      { name: "description", content: "Depuis 2010, l'ONPHA-CI agit pour l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes en Côte d'Ivoire." },
      { property: "og:title", content: "ONPHA-CI — Ensemble pour l'inclusion auditive" },
      { property: "og:description", content: "Plaidoyer, éducation inclusive, santé et langue des signes." },
    ],
  }),
  component: Index,
});

function Index() {
  const latest = ARTICLES.slice(0, 3);
  const featured = PROJECTS.slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20" aria-hidden style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25) 0, transparent 45%)",
        }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 text-white lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-28 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" /> ONG ivoirienne — depuis 2010
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Pour que chaque enfant sourd ait <span className="text-[oklch(0.85_0.15_70)]">sa voix dans la société.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              L'Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire défend
              les droits, la santé et l'éducation des personnes sourdes et malentendantes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dons" className="inline-flex items-center gap-2 rounded-full bg-accent-orange px-6 py-3 text-sm font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)] transition hover:brightness-110">
                <Heart className="size-4" /> Faire un don
              </Link>
              <Link to="/projets" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Nos projets <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { k: "14", l: "années d'engagement", i: Calendar },
              { k: "7", l: "pays touchés (DéfiSens'AO)", i: Globe2 },
              { k: "29+", l: "actions documentées", i: Sparkles },
              { k: "1 000s", l: "bénéficiaires", i: Users },
            ].map(({ k, l, i: Icon }) => (
              <div key={l} className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur">
                <Icon className="size-5 text-[oklch(0.85_0.15_70)]" aria-hidden />
                <div className="mt-3 font-display text-3xl font-bold">{k}</div>
                <div className="mt-1 text-xs text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">Notre mission</span>
            <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">L'inclusion comme combat quotidien</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Créée le 22 septembre 2010 à Yopougon, l'ONPHA-CI fédère les parents d'enfants déficients auditifs
              et tous ceux qui défendent une société où chaque personne sourde peut apprendre,
              travailler, se soigner et participer pleinement à la vie sociale.
            </p>
            <Link to="/a-propos" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
              En savoir plus <ArrowRight className="size-4" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              ["Plaidoyer", "Pour les droits des personnes sourdes en Côte d'Ivoire."],
              ["Éducation", "Formation langue des signes et écoles inclusives."],
              ["Santé", "Prévention VIH, dépistage auditif, accompagnement."],
              ["Familles", "Soutien aux parents et renforcement des capacités."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="size-10 rounded-full bg-brand-soft text-brand grid place-items-center font-display font-bold">{t[0]}</div>
                <h3 className="mt-4 font-semibold text-ink">{t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROJETS */}
      <section className="bg-surface-alt py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">Nos projets</span>
              <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Des actions concrètes sur le terrain</h2>
            </div>
            <Link to="/projets" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
              Tous les projets <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.slug} to="/projets/$slug" params={{ slug: p.slug }} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "En cours" ? "bg-accent-orange/15 text-accent-orange" : "bg-brand-soft text-brand"}`}>{p.status}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink group-hover:text-brand">{p.title}</h3>
                <p className="mt-1 text-xs text-ink-soft">{p.years} · {p.partner}</p>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{p.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Voir le projet <ArrowRight className="size-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ACTUALITES */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">Dernières actualités</span>
            <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Ce qui se passe chez ONPHA-CI</h2>
          </div>
          <Link to="/actualites" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">Toutes les actualités <ArrowRight className="size-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latest.map((a) => (
            <Link key={a.slug} to="/actualites/$slug" params={{ slug: a.slug }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {a.cover ? (
                  <img src={a.cover} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
                ) : <div className="size-full" style={{ background: "var(--gradient-brand)" }} />}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">{a.category}</span>
                  <span>·</span>
                  <time>{formatDate(a.date)}</time>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-ink group-hover:text-brand">{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* APPEL AUX DONS */}
      <section className="relative overflow-hidden py-20" style={{ background: "var(--gradient-brand)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 text-white lg:grid-cols-[1.5fr_1fr] lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Votre soutien change des vies.</h2>
            <p className="mt-4 max-w-xl text-white/90">
              Chaque contribution finance la formation en langue des signes, le dépistage auditif des enfants et l'accompagnement des familles. Don sécurisé par Mobile Money ou carte bancaire.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-white/80">Je donne</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[1000, 5000, 10000, 25000].map((m) => (
                <Link key={m} to="/dons" search={{ amount: m }} className="rounded-lg bg-white/15 px-3 py-3 text-center text-sm font-semibold hover:bg-white/25">
                  {m.toLocaleString("fr-FR")} FCFA
                </Link>
              ))}
            </div>
            <Link to="/dons" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-orange px-5 py-3 text-sm font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)]">
              <Heart className="size-4" /> Faire un don
            </Link>
          </div>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-orange">Ils nous soutiennent</span>
          <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">Nos partenaires</h2>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PARTNERS.slice(0, 10).map((p) => (
            <li key={p.name} className="flex items-center justify-center rounded-xl border border-border bg-card p-4 text-center text-xs font-medium text-ink-soft min-h-20">
              {p.name}
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link to="/partenaires" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
            Tous les partenaires <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
