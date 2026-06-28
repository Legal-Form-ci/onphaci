import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/onpha-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <img src={logo.url} alt="ONPHA-CI" className="h-14 w-auto" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire. Depuis 2010,
            nous œuvrons pour l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 text-brand" /> Yopougon, Abidjan, Côte d'Ivoire</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 size-4 text-brand" /> onphaci@gmail.com</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 size-4 text-brand" /> +225 — sur demande</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/a-propos","À propos"],["/projets","Projets"],["/actualites","Actualités"],
              ["/mediatheque","Médiathèque"],["/partenaires","Partenaires"],["/contact","Contact"],
            ].map(([to,label]) => (
              <li key={to}><Link to={to} className="text-ink-soft hover:text-brand">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Agir avec nous</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/dons" className="text-accent-orange font-semibold hover:underline">Faire un don</Link></li>
            <li><Link to="/contact" className="text-ink-soft hover:text-brand">Devenir bénévole</Link></li>
            <li><Link to="/partenaires" className="text-ink-soft hover:text-brand">Nous soutenir</Link></li>
          </ul>
          <div className="mt-6 flex gap-3" aria-label="Réseaux sociaux">
            <a href="#" aria-label="Facebook" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Facebook className="size-4" /></a>
            <a href="#" aria-label="YouTube" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Youtube className="size-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-ink-soft sm:flex-row sm:items-center lg:px-8">
          <p>© {new Date().getFullYear()} ONPHA-CI. Tous droits réservés.</p>
          <p>Refonte par <span className="font-medium text-ink">IKNOV Consulting</span></p>
        </div>
      </div>
    </footer>
  );
}