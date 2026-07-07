import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, Users, Globe2, Calendar, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { ARTICLES, formatDate } from "@/data/articles";
import { PROJECTS } from "@/data/projects";
import { PARTNERS } from "@/data/partners";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Accueil — ONPHA-CI, inclusion des personnes sourdes en Côte d'Ivoire" },
      { name: "description", content: "Depuis 2010, l'ONPHA-CI agit pour l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes en Côte d'Ivoire." },
      { property: "og:title", content: "Accueil — ONPHA-CI, inclusion des personnes sourdes en Côte d'Ivoire" },
      { property: "og:description", content: "Depuis 2010, l'ONPHA-CI agit pour l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes en Côte d'Ivoire." },
      { property: "og:url", content: "https://onphaci.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://onphaci.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  const latest = ARTICLES.slice(0, 3);
  const heroSlides = ARTICLES.filter((a) => !!a.cover);
  const featured = PROJECTS.slice(0, 3);
  return (
    <>
      <HeroCarousel slides={heroSlides} />

      {/* IMPACT — compteurs animés */}
      <section className="border-b border-border bg-surface-alt">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-10 sm:grid-cols-4 sm:gap-6 lg:px-8">
          {[
            { n: 14, s: "", l: "années d'engagement", i: Calendar },
            { n: 7, s: "", l: "pays touchés (DéfiSens'AO)", i: Globe2 },
            { n: 29, s: "+", l: "actions documentées", i: Sparkles },
            { n: 1500, s: "+", l: "bénéficiaires directs", i: Users },
          ].map(({ n, s, l, i: Icon }) => (
            <div key={l} className="flex flex-col items-start gap-2 rounded-2xl p-2 sm:p-4">
              <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand"><Icon className="size-5" /></span>
              <div className="font-display text-3xl font-bold text-ink sm:text-4xl">
                <AnimatedCounter end={n} suffix={s} />
              </div>
              <div className="text-xs text-ink-soft sm:text-sm">{l}</div>
            </div>
          ))}
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

/* ============== Hero Carousel — actualités en avant ============== */
function HeroCarousel({ slides }: { slides: typeof ARTICLES }) {
  const [i, setI] = useState(0);
  const total = slides.length || 1;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % total), 6000);
    return () => clearInterval(t);
  }, [slides.length, total]);

  const current = slides[i];

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Slides */}
      <div className="relative h-[560px] sm:h-[600px] lg:h-[640px]">
        {slides.map((s, idx) => (
          <div
            key={s.slug}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            {s.cover && (
              <img
                src={s.cover}
                alt=""
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="size-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/65 to-ink/20" aria-hidden />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-14 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" /> Actualité — ONPHA-CI
            </span>
            {current && (
              <>
                <p className="mt-4 text-xs uppercase tracking-widest text-white/70">
                  <span className="rounded-full bg-accent-orange px-2 py-0.5 font-semibold text-accent-orange-foreground">{current.category}</span>
                  <span className="ml-3">{formatDate(current.date)}</span>
                </p>
                <h1 className="mt-3 text-balance font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {current.title}
                </h1>
                {current.excerpt && (
                  <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg line-clamp-3">
                    {current.excerpt}
                  </p>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/actualites/$slug"
                    params={{ slug: current.slug }}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg transition hover:bg-white/90"
                  >
                    Lire l'article <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    to="/dons"
                    className="inline-flex items-center gap-2 rounded-full bg-accent-orange px-6 py-3 text-sm font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)] transition hover:brightness-110"
                  >
                    <Heart className="size-4" /> Faire un don
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button
              aria-label="Précédent"
              onClick={() => setI((v) => (v - 1 + total) % total)}
              className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:block"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              aria-label="Suivant"
              onClick={() => setI((v) => (v + 1) % total)}
              className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/25 md:block"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Aller au slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
