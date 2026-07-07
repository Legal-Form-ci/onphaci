import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — ONPHA-CI" },
      { name: "description", content: "Comment l'ONPHA-CI collecte, utilise et protège vos données personnelles, conformément au RGPD et à la loi ivoirienne sur la protection des données." },
      { property: "og:title", content: "Politique de confidentialité — ONPHA-CI" },
      { property: "og:description", content: "Vos données, vos droits. Engagement de confidentialité de l'ONPHA-CI." },
    { property: "og:url", content: "https://onphaci.lovable.app/confidentialite" },
  ],
  links: [{ rel: "canonical", href: "https://onphaci.lovable.app/confidentialite" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Vos données"
        title="Politique de confidentialité"
        lead="Nous nous engageons à protéger les données personnelles que vous nous confiez, dans le respect du RGPD et de la loi ivoirienne n°2013-450 du 19 juin 2013."
      />
      <article className="mx-auto max-w-3xl px-4 py-16 lg:px-8 prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-p:text-ink-soft prose-a:text-brand">
        <h2>1. Responsable du traitement</h2>
        <p>L'Organisation Nationale des Parents pour Handicapés Auditifs de Côte d'Ivoire (ONPHA-CI), située à Yopougon, Abidjan, est responsable du traitement de vos données personnelles. Pour toute question : <a href="mailto:onphaci@gmail.com">onphaci@gmail.com</a>.</p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons uniquement les données strictement nécessaires :</p>
        <ul>
          <li><strong>Formulaire de contact :</strong> nom, prénom, email, sujet, message.</li>
          <li><strong>Dons en ligne :</strong> nom, prénom, email, téléphone, montant et mode de paiement.</li>
          <li><strong>Mesure d'audience :</strong> données anonymisées (pages vues, durée), uniquement si vous y avez consenti via le bandeau cookies.</li>
        </ul>

        <h2>3. Finalités</h2>
        <p>Vos données servent à : répondre à vos demandes, traiter vos dons, vous adresser des informations sur nos actions (uniquement avec votre accord) et améliorer notre site.</p>

        <h2>4. Base légale</h2>
        <p>Le traitement repose sur votre consentement (formulaire, dons, newsletter), l'exécution d'un contrat (traitement d'un don) ou notre intérêt légitime à faire connaître nos missions.</p>

        <h2>5. Durée de conservation</h2>
        <p>Les messages de contact sont conservés <strong>3 ans</strong>. Les justificatifs de dons sont conservés <strong>10 ans</strong> conformément aux obligations comptables. Les données de navigation anonymisées sont conservées <strong>13 mois</strong> maximum.</p>

        <h2>6. Destinataires</h2>
        <p>Vos données ne sont jamais vendues ni cédées. Elles peuvent être transmises à nos prestataires techniques (hébergeur, plateforme de paiement CinetPay) dans la stricte mesure nécessaire à l'exécution du service.</p>

        <h2>7. Cookies</h2>
        <p>Le site utilise deux catégories de cookies :</p>
        <ul>
          <li><strong>Cookies essentiels</strong> (toujours actifs) : indispensables au fonctionnement du site.</li>
          <li><strong>Cookies de mesure d'audience</strong> (soumis à consentement) : nous permettent de comprendre l'usage du site de manière anonymisée.</li>
        </ul>
        <p>Vous pouvez modifier vos préférences à tout moment en vidant les données du site dans votre navigateur ; le bandeau de consentement réapparaîtra à votre prochaine visite.</p>

        <h2>8. Vos droits</h2>
        <p>Conformément au RGPD et à la législation ivoirienne, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Pour exercer ces droits, écrivez-nous à <a href="mailto:onphaci@gmail.com">onphaci@gmail.com</a>.</p>

        <h2>9. Sécurité</h2>
        <p>Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables pour protéger vos données : connexion chiffrée HTTPS, accès restreint aux données, partenaires de paiement certifiés PCI DSS.</p>

        <h2>10. Réclamation</h2>
        <p>Vous pouvez saisir l'Autorité de Régulation des Télécommunications de Côte d'Ivoire (ARTCI) ou, le cas échéant, la CNIL si vous résidez dans l'Union européenne.</p>

        <p className="text-xs text-ink-soft">Dernière mise à jour : 29 juin 2026.</p>
      </article>
    </>
  );
}