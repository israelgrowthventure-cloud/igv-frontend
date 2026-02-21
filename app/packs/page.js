/**
 * app/packs/page.js — Page Packs / Offres commerciales (Server Component)
 *
 * Migration depuis : src/pages/Packs.js
 *
 * Offres :
 * - Pack Analyse       : étude préalable de faisabilité
 * - Pack Succursales   : ouverture max 3 succursales en Israël
 * - Pack Franchise     : déploiement réseau franchise, max 3 ouvertures
 * - Contrat Expansion  : accompagnement long terme — 10 000 €
 */

import PacksClient from './PacksClient';

export const metadata = {
  title: 'Nos Packs — Franchises, Succursales & Expansion en Israël',
  description:
    "Découvrez nos offres d'accompagnement : Pack Analyse (étude préalable), Pack Succursales et Franchise (jusqu'à 3 ouvertures), Contrat Expansion long terme à partir de 10 000 €. Développez votre réseau en Israël.",
  alternates: {
    canonical: 'https://israelgrowthventure.com/packs',
    languages: {
      'fr': 'https://israelgrowthventure.com/packs',
      'en': 'https://israelgrowthventure.com/en/packs',
      'he': 'https://israelgrowthventure.com/he/packs',
    },
  },
  keywords: [
    'pack franchise Israël',
    'pack succursale Israël',
    'accompagnement expansion Israël',
    'contrat développement commercial Israël',
    'étude faisabilité Israël',
    'ouverture réseau Israël',
    'consultant franchise Israël prix',
  ],
  openGraph: {
    title: 'Packs Franchises, Succursales & Expansion en Israël | IGV',
    description:
      "Pack Analyse (étude préalable) · Pack Succursales/Franchise (3 ouvertures max) · Contrat Expansion 10 000€. Votre développement commercial en Israël clé en main.",
    url: 'https://israelgrowthventure.com/packs',
    type: 'website',
  },
};

export default function PacksPage() {
  return (
    <>
      {/* JSON-LD — OfferCatalog pour rich snippets Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Packs Développement Commercial en Israël',
            provider: {
              '@type': 'Organization',
              name: 'Israel Growth Venture',
              url: 'https://israelgrowthventure.com',
            },
            itemListElement: [
              {
                '@type': 'Offer',
                name: 'Pack Analyse',
                description: "Étude préalable de faisabilité pour votre implantation en Israël.",
                category: 'Étude stratégique',
              },
              {
                '@type': 'Offer',
                name: 'Pack Succursales',
                description: "Accompagnement pour l'ouverture de succursales en Israël (max 3 ouvertures).",
                category: 'Développement retail',
              },
              {
                '@type': 'Offer',
                name: 'Pack Franchise',
                description: "Déploiement réseau franchise en Israël (max 3 ouvertures).",
                category: 'Développement franchise',
              },
              {
                '@type': 'Offer',
                name: 'Contrat Expansion',
                description: "Accompagnement long terme pour l'expansion complète de votre réseau en Israël.",
                priceSpecification: {
                  '@type': 'PriceSpecification',
                  price: '10000',
                  priceCurrency: 'EUR',
                },
                category: 'Expansion stratégique',
              },
            ],
          }),
        }}
      />
      <PacksClient />
    </>
  );
}
