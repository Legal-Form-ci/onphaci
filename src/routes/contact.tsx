import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ONPHA-CI" },
      { name: "description", content: "Contactez l'ONPHA-CI à Yopougon, Abidjan. Email, téléphone et formulaire de contact." },
      { property: "og:title", content: "Contacter ONPHA-CI" },
      { property: "og:description", content: "Écrivez-nous, rejoignez-nous, soutenez-nous." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero eyebrow="Contact" title="Écrivez-nous" lead="Pour toute demande d'information, de partenariat ou de bénévolat." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        <aside className="space-y-6">
          <InfoLine icon={MapPin} title="Siège" value="Yopougon, Abidjan, Côte d'Ivoire" />
          <InfoLine icon={Mail} title="Email" value="onphaci@gmail.com" href="mailto:onphaci@gmail.com" />
          <InfoLine icon={Phone} title="Téléphone" value="Sur demande" />
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Carte Yopougon Abidjan"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-4.13,5.30,-4.04,5.36&layer=mapnik"
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
        </aside>
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="rounded-2xl border border-border bg-card p-6 lg:p-8 space-y-4"
        >
          <h2 className="font-display text-2xl font-bold text-ink">Envoyer un message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstname" label="Prénom" required />
            <Field id="lastname" label="Nom" required />
          </div>
          <Field id="email" label="Email" type="email" required />
          <Field id="subject" label="Sujet" required />
          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink">Message</label>
            <textarea id="message" name="message" rows={5} required className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-card)] hover:brightness-110">
            <Send className="size-4" /> Envoyer
          </button>
          {sent && <p role="status" className="text-sm font-medium text-brand">Merci ! Votre message a bien été pris en compte. (Backend à connecter)</p>}
        </form>
      </section>
    </>
  );
}

function InfoLine({ icon: Icon, title, value, href }: { icon: typeof Mail; title: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
      <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand"><Icon className="size-5" /></span>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-soft">{title}</p>
        <p className="mt-0.5 font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function Field({ id, label, type = "text", required }: { id: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">{label}{required && <span className="text-accent-orange"> *</span>}</label>
      <input id={id} name={id} type={type} required={required} className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
    </div>
  );
}