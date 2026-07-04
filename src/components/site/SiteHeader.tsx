import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Heart, ChevronDown, Mail, Phone, Facebook, Youtube, Instagram, Linkedin } from "lucide-react";
import { VisitorCounter } from "./VisitorCounter";

const LOGO_SRC = "/onpha-logo.png";

type NavItem =
  | { to: string; label: string }
  | { label: string; children: { to: string; label: string }[] };

const NAV: NavItem[] = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "Historique" },
  { to: "/actualites", label: "Actualité" },
  { to: "/dons", label: "Dons" },
  { to: "/projets", label: "Projets" },
  {
    label: "Annuaire",
    children: [
      { to: "/annuaire/ecoles-specialisees", label: "Écoles spécialisées" },
      { to: "/annuaire/ecoles-inclusives", label: "Écoles inclusives" },
      { to: "/annuaire/organisations", label: "Organisations de personnes handicapées" },
    ],
  },
  { to: "/mediatheque", label: "Photo / Vidéo" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
      {/* Top utility strip */}
      <div className="hidden border-b border-border bg-surface-alt md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs text-ink-soft lg:px-8">
          <div className="flex items-center gap-4">
            <a href="mailto:onphaci@gmail.com" className="inline-flex items-center gap-1.5 hover:text-brand">
              <Mail className="size-3.5" /> onphaci@gmail.com
            </a>
            <a href="tel:+2250707348585" className="inline-flex items-center gap-1.5 hover:text-brand">
              <Phone className="size-3.5" /> +225 07 07 34 85 85
            </a>
          </div>
          <div className="flex items-center gap-4">
            <VisitorCounter />
            <span className="text-ink-soft/70">Suivez-nous :</span>
            <a href="https://www.facebook.com/onphaci" target="_blank" rel="noopener noreferrer" aria-label="Facebook ONPHA-CI" className="hover:text-brand"><Facebook className="size-3.5" /></a>
            <a href="https://www.youtube.com/channel/UCxEMvmmxwNEnpx6vB2A4kjw" target="_blank" rel="noopener noreferrer" aria-label="YouTube ONPHA-CI" className="hover:text-brand"><Youtube className="size-3.5" /></a>
            <a href="https://www.instagram.com/onphaciauditif/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ONPHA-CI" className="hover:text-brand"><Instagram className="size-3.5" /></a>
            <a href="https://www.linkedin.com/company/99834755" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn ONPHA-CI" className="hover:text-brand"><Linkedin className="size-3.5" /></a>
            <a href="https://www.tiktok.com/@onphaci.auditif" target="_blank" rel="noopener noreferrer" aria-label="TikTok ONPHA-CI" className="hover:text-brand font-bold text-[10px]">TikTok</a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="ONPHA-CI accueil">
          <img src={LOGO_SRC} alt="Logo ONPHA-CI" className="h-12 w-auto" width={160} height={48} />
        </Link>
        <nav className="hidden xl:flex items-center" aria-label="Navigation principale">
          {NAV.map((n) => "children" in n ? (
            <div
              key={n.label}
              className="relative"
              onMouseEnter={() => setOpenSub(n.label)}
              onMouseLeave={() => setOpenSub(null)}
            >
              <button
                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink-soft hover:text-brand"
                aria-expanded={openSub === n.label}
                aria-haspopup="menu"
              >
                {n.label} <ChevronDown className="size-3.5" />
              </button>
              {openSub === n.label && (
                <div role="menu" className="absolute left-0 top-full z-50 min-w-64 rounded-xl border border-border bg-card p-2 shadow-2xl">
                  {n.children.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-soft hover:text-brand"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={n.to + n.label}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-brand"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-brand" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/dons"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent-orange px-4 py-2.5 text-sm font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)] transition hover:brightness-105"
          >
            <Heart className="size-4" aria-hidden /> Faire un don
          </Link>
          <button
            className="xl:hidden inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-muted"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Navigation mobile">
            {NAV.map((n) => "children" in n ? (
              <details key={n.label} className="group">
                <summary className="flex cursor-pointer items-center justify-between rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-brand-soft">
                  {n.label}
                  <ChevronDown className="size-4 transition group-open:rotate-180" />
                </summary>
                <div className="ml-3 mt-1 flex flex-col border-l border-border pl-3">
                  {n.children.map((c) => (
                    <Link key={c.to} to={c.to} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm text-ink-soft hover:text-brand">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={n.to + n.label}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-brand-soft hover:text-brand"
                activeProps={{ className: "rounded-md px-3 py-3 text-base font-semibold text-brand bg-brand-soft" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/dons"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent-orange px-5 py-3 text-sm font-semibold text-accent-orange-foreground"
            >
              <Heart className="size-4" aria-hidden /> Faire un don
            </Link>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <VisitorCounter />
              <a href="mailto:onphaci@gmail.com" className="text-xs text-ink-soft">onphaci@gmail.com</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}