import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const KEY = "onpha_cookie_consent_v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(KEY);
    if (!v) setVisible(true);
  }, []);

  const choose = (choice: "all" | "essential") => {
    localStorage.setItem(KEY, JSON.stringify({ choice, at: new Date().toISOString() }));
    setVisible(false);
    // Analytics are loaded conditionally only when 'all' is chosen — wired here later.
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-live="polite" aria-label="Bandeau cookies"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-2xl border border-border bg-card p-4 shadow-2xl sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
          <Cookie className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Vos préférences de cookies</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Nous utilisons des cookies strictement nécessaires au fonctionnement du site et,
            avec votre accord, des cookies de mesure d'audience anonymisés. Vous pouvez
            modifier votre choix à tout moment depuis notre{" "}
            <Link to="/confidentialite" className="font-medium text-brand hover:underline">
              Politique de confidentialité
            </Link>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => choose("all")} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground hover:brightness-110">
              Tout accepter
            </button>
            <button onClick={() => choose("essential")} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand">
              Uniquement essentiels
            </button>
          </div>
        </div>
        <button
          aria-label="Fermer"
          onClick={() => choose("essential")}
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}