import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import logo from "@/assets/onpha-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/projets", label: "Nos projets" },
  { to: "/actualites", label: "Actualités" },
  { to: "/mediatheque", label: "Médiathèque" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="ONPHA-CI accueil">
          <img src={logo.url} alt="Logo ONPHA-CI" className="h-11 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {NAV.map((n) => (
            <Link
              key={n.to}
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
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-accent-orange px-5 py-2.5 text-sm font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)] transition hover:brightness-105"
          >
            <Heart className="size-4" aria-hidden /> Faire un don
          </Link>
          <button
            className="lg:hidden inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-muted"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-3" aria-label="Navigation mobile">
            {NAV.map((n) => (
              <Link
                key={n.to}
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
          </nav>
        </div>
      )}
    </header>
  );
}