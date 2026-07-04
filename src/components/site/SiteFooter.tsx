import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Facebook, Youtube, Instagram, Linkedin } from "lucide-react";

const LOGO_SRC = "/onpha-logo.png";

const WA_MSG = encodeURIComponent(
  "Bonjour Monsieur KOFFI, j'ai découvert votre travail sur la plateforme ONPHA-CI et je serais ravi(e) d'échanger avec vous au sujet d'un projet similaire. Merci d'avance pour votre retour."
);
const WA_URL = `https://wa.me/2250759566087?text=${WA_MSG}`;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <img src={LOGO_SRC} alt="ONPHA-CI" className="h-14 w-auto" width={200} height={56} />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft">
            Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire. Depuis 2010,
            nous œuvrons pour l'inclusion sociale, scolaire et professionnelle des personnes sourdes et malentendantes.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ink-soft">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 text-brand" /> Yopougon, Abidjan, Côte d'Ivoire</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 size-4 text-brand" /> onphaci@gmail.com · info@onphaci.org</li>
            <li className="flex items-start gap-2"><Phone className="mt-0.5 size-4 text-brand" /> +225 07 07 34 85 85 / 07 79 76 85 82</li>
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
            <a href="https://www.facebook.com/onphaci" target="_blank" rel="noopener noreferrer" aria-label="Facebook ONPHA-CI" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Facebook className="size-4" /></a>
            <a href="https://www.youtube.com/channel/UCxEMvmmxwNEnpx6vB2A4kjw" target="_blank" rel="noopener noreferrer" aria-label="YouTube ONPHA-CI" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Youtube className="size-4" /></a>
            <a href="https://www.instagram.com/onphaciauditif/" target="_blank" rel="noopener noreferrer" aria-label="Instagram ONPHA-CI" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Instagram className="size-4" /></a>
            <a href="https://www.linkedin.com/company/99834755" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn ONPHA-CI" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-soft hover:border-brand hover:text-brand"><Linkedin className="size-4" /></a>
            <a href="https://www.tiktok.com/@onphaci.auditif" target="_blank" rel="noopener noreferrer" aria-label="TikTok ONPHA-CI" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-xs font-bold text-ink-soft hover:border-brand hover:text-brand">TT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-ink-soft sm:flex-row sm:items-center lg:px-8">
          <p>© {new Date().getFullYear()} ONPHA-CI. Tous droits réservés. · <Link to="/confidentialite" className="hover:text-brand">Politique de confidentialité</Link></p>
          <p>
            Par{" "}
            <a
              href="https://ikoffi.agricapital.ci"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink hover:text-brand"
            >
              Inocent KOFFI
            </a>
            -
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink hover:text-brand"
              aria-label="Envoyer un message WhatsApp à Inocent KOFFI"
            >
              +225 07 59 56 60 87
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}