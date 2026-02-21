/**
 * app/audit/page.js — Page Audit Stratégique (Server Component)
 *
 * Page de vente B2B : ciblage franchises et succursales souhaitant s'implanter en Israël.
 * Migration depuis : src/pages/Audit.js
 *
 * SEO priorité HAUTE : page commerciale payante (900€), cible DG/DAF de réseaux retail.
 */

import AuditClient from './AuditClient';

// ============================================================
// SEO — Page Audit (priorité commerciale haute)
// Canonical sur domaine principal (plus de redirection sous-domaine)
// ============================================================
export const metadata = {
  title: "Audit Stratégique d'Implantation en Israël",
  description:
    "Réservez votre audit pour structurer votre développement commercial en Israël. Analyse sur-mesure pour l'ouverture de franchises et succursales. Session 60 min — 900 €.",
  alternates: {
    canonical: 'https://israelgrowthventure.com/audit',
    languages: {
      'fr': 'https://israelgrowthventure.com/audit',
      'en': 'https://israelgrowthventure.com/en/audit',
      'he': 'https://israelgrowthventure.com/he/audit',
    },
  },
  keywords: [
    "audit stratégique Israël",
    "diagnostic implantation Israël",
    "franchise Israël go no-go",
    "succursale Israël marché",
    "consultant expansion Israël",
    "audit commercial Israël 900€",
  ],
  openGraph: {
    title: "Audit Stratégique d'Implantation en Israël | IGV",
    description:
      "Diagnostic complet de faisabilité en 60 min : verdict Go/No-Go, adaptations marché israélien, stratégie d'entrée et budget réaliste. 900 €.",
    url: 'https://israelgrowthventure.com/audit',
    type: 'website',
  },
  // JSON-LD injecté côté serveur via script tag dans le composant
};

export default function AuditPage() {
  return (
    <>
      {/* JSON-LD Service — Rich snippet Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: "Audit Stratégique d'Implantation en Israël",
            description:
              "Diagnostic complet de faisabilité en 60 minutes pour franchises et succursales souhaitant s'implanter sur le marché israélien.",
            provider: {
              '@type': 'Organization',
              name: 'Israel Growth Venture',
              url: 'https://israelgrowthventure.com',
            },
            offers: {
              '@type': 'Offer',
              price: '900',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: 'https://israelgrowthventure.com/audit',
            },
            areaServed: 'IL',
            url: 'https://israelgrowthventure.com/audit',
          }),
        }}
      />
      <AuditClient />
    </>
  );
}
