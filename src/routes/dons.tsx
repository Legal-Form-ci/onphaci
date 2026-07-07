import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Heart, ShieldCheck, Smartphone, CreditCard, MessageCircle } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({ amount: z.coerce.number().optional() });

export const Route = createFileRoute("/dons")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Faire un don — ONPHA-CI" },
      { name: "description", content: "Soutenez l'ONPHA-CI. Don sécurisé par Mobile Money (MTN, Orange, Wave) ou carte bancaire via CinetPay." },
      { property: "og:title", content: "Soutenez l'ONPHA-CI" },
      { property: "og:description", content: "Votre don finance la langue des signes, le dépistage et l'accompagnement des familles." },
    { property: "og:url", content: "https://onphaci.lovable.app/dons" },
  ],
  links: [{ rel: "canonical", href: "https://onphaci.lovable.app/dons" }],
  }),
  component: DonatePage,
});

const PRESETS = [1000, 5000, 10000, 25000, 50000];

function DonatePage() {
  const search = Route.useSearch();
  const [amount, setAmount] = useState<number | "">(search.amount ?? 5000);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<"mtn" | "orange" | "wave" | "card">("mtn");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = custom ? Number(custom) : amount;

  return (
    <>
      <PageHero
        eyebrow="Soutenir"
        title="Votre don change des vies"
        lead="Chaque contribution finance la formation en langue des signes, le dépistage auditif des enfants et l'accompagnement des familles."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_1fr] lg:px-8">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:p-10"
        >
          <h2 className="font-display text-2xl font-bold text-ink">Je fais un don</h2>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-ink">Montant</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {PRESETS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => { setAmount(m); setCustom(""); }}
                  aria-pressed={!custom && amount === m}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${!custom && amount === m ? "border-brand bg-brand text-brand-foreground" : "border-border bg-background text-ink hover:border-brand"}`}
                >
                  {m.toLocaleString("fr-FR")}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <label className="text-xs text-ink-soft" htmlFor="custom-amount">Ou un montant libre (FCFA)</label>
              <input
                id="custom-amount"
                type="number"
                min={500}
                value={custom}
                onChange={(e) => { setCustom(e.target.value); setAmount(""); }}
                placeholder="Ex. 7 500"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-ink">Mode de paiement</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { v: "mtn", l: "MTN Money", i: Smartphone },
                { v: "orange", l: "Orange Money", i: Smartphone },
                { v: "wave", l: "Wave", i: Smartphone },
                { v: "card", l: "Carte bancaire", i: CreditCard },
              ].map(({ v, l, i: Icon }) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setMethod(v as typeof method)}
                  aria-pressed={method === v}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-medium transition ${method === v ? "border-brand bg-brand-soft text-brand" : "border-border bg-background text-ink-soft hover:border-brand"}`}
                >
                  <Icon className="size-5" /> {l}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FormField id="firstname" label="Prénom" required />
            <FormField id="lastname" label="Nom" required />
            <FormField id="email" label="Email" type="email" required />
            <FormField id="phone" label="Téléphone" type="tel" />
          </div>
          <div className="mt-4">
            <label htmlFor="msg" className="text-sm font-medium text-ink">Message de soutien (optionnel)</label>
            <textarea id="msg" rows={3} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </div>

          <button
            type="submit"
            disabled={!finalAmount || Number(finalAmount) < 500}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-orange px-6 py-4 text-base font-semibold text-accent-orange-foreground shadow-[var(--shadow-cta)] hover:brightness-110 disabled:opacity-50"
          >
            <Heart className="size-5" /> Donner {finalAmount ? `${Number(finalAmount).toLocaleString("fr-FR")} FCFA` : ""}
          </button>

          {submitted && (
            <div role="status" className="mt-4 rounded-xl border border-brand/30 bg-brand-soft p-4 text-sm text-ink">
              <p className="font-semibold text-brand">Module CinetPay en attente de configuration</p>
              <p className="mt-1 text-ink-soft">Dès que vous fournirez vos credentials CinetPay (CINETPAY_API_KEY, CINETPAY_SITE_ID), le don sera traité en sécurité via Mobile Money ou carte bancaire — méthode choisie : <strong>{method.toUpperCase()}</strong>.</p>
            </div>
          )}
        </form>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <ShieldCheck className="size-6 text-brand" />
            <h3 className="mt-3 font-display text-lg font-bold text-ink">Paiement sécurisé</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Les paiements seront traités via CinetPay, partenaire certifié PCI DSS. Aucune donnée bancaire n'est stockée sur notre site.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold text-ink">Votre impact</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><strong className="text-ink">1 000 FCFA</strong> — 1 kit de sensibilisation</li>
              <li><strong className="text-ink">5 000 FCFA</strong> — 1 séance d'initiation langue des signes</li>
              <li><strong className="text-ink">10 000 FCFA</strong> — 1 dépistage auditif enfant</li>
              <li><strong className="text-ink">25 000 FCFA</strong> — formation d'un parent éducateur</li>
            </ul>
          </div>
          <a href="https://wa.me/22500000000" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 hover:border-brand">
            <MessageCircle className="size-6 text-accent-orange" />
            <div>
              <p className="font-semibold text-ink">Donner par WhatsApp</p>
              <p className="text-xs text-ink-soft">Contactez-nous pour un don manuel ou un parrainage</p>
            </div>
          </a>
        </aside>
      </section>
    </>
  );
}

function FormField({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">{label}{required && <span className="text-accent-orange"> *</span>}</label>
      <input id={id} name={id} type={type} required={required} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
    </div>
  );
}