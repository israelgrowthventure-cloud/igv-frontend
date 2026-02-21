/**
 * app/packs/page.js — Page Packs / Offres commerciales (Server Component)
 *
 * Migration depuis : src/pages/Packs.js
 * Contenu source   : igv-website-v2_copy/frontend/src/pages/PacksPage.jsx
 *
 * RÈGLE : Aucun prix affiché — contenu chargé dynamiquement via API dans PacksClient.jsx
 */

import PacksClient from './PacksClient';

const SITE_URL = 'https://israelgrowthventure.com';

// ============================================================
// SEO — Page Nos Offres / Packs
// (titres & sous-titres source : PacksPage.jsx archive)
// ============================================================
export const metadata = {
  title: "Nos Packs — Solutions adaptées à vos besoins d'expansion",
  description:
    "Nos Packs : analyse de marché pour jusqu'à 3 ouvertures, accompagnement succursales et développement franchise en Israël. Solutions adaptées à vos besoins d'expansion — Israel Growth Venture.",
  alternates: {
    canonical: `${SITE_URL}/packs`,
    languages: {
      fr: `${SITE_URL}/packs`,
      en: `${SITE_URL}/en/packs`,
      he: `${SITE_URL}/he/packs`,
    },
  },
  keywords: [
    'pack franchise Israël',
    'pack succursale Israël',
    'accompagnement expansion Israël',
    'développement commercial Israël',
    'étude faisabilité Israël',
    'ouverture réseau Israël',
    'consultant franchise Israël',
  ],
  openGraph: {
    title: 'Nos Packs — Solutions adaptées à vos besoins | IGV',
    description:
      "Pack Analyse (jusqu'à 3 ouvertures), Pack Succursales, Pack Franchise — solutions clé en main pour développer votre réseau en Israël.",
    url: `${SITE_URL}/packs`,
    type: 'website',
  },
};

export default function PacksPage() {
  return (
    <>
      {/* JSON-LD — OfferCatalog pour rich snippets Google (sans prix) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Nos Offres — Développement Commercial en Israël',
            provider: {
              '@type': 'Organization',
              name: 'Israel Growth Venture',
              url: SITE_URL,
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
                description: "Accompagnement pour l'ouverture de succursales en Israël.",
                category: 'Développement retail',
              },
              {
                '@type': 'Offer',
                name: 'Pack Franchise',
                description: "Déploiement réseau franchise en Israël.",
                category: 'Développement franchise',
              },
              {
                '@type': 'Offer',
                name: 'Contrat Expansion',
                description: "Accompagnement long terme pour l'expansion complète de votre réseau en Israël.",
                category: 'Expansion stratégique',
              },
            ],
          }),
        }}
      />

      {/* Hero SSR — indexé par Google (FR par défaut, PacksClient gère le multilingue) */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nos Packs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solutions adaptées à vos besoins d'expansion
          </p>
        </div>
      </section>

      {/* Contenu dynamique (packs depuis API) */}
      <PacksClient />
    </>
  );
}
