/**
 * app/about/page.js — Page "Qui sommes-nous" (Server Component)
 *
 * CONTENU SOURCE : igv-website-v2_copy/frontend/src/pages/AboutPage.jsx
 * Texte trilingue FR/EN/HE intégral transféré.
 *
 * PHOTO : À placer dans /public/images/mickael-benmoussa.jpg
 * → Remplacer PHOTO_PLACEHOLDER par l'URL réelle dès que le fichier est uploadé.
 */

import { Target, Users, Award, TrendingUp } from 'lucide-react';

const SITE_URL = 'https://israelgrowthventure.com';

// ============================================================
// SEO — Page À propos
// ============================================================
export const metadata = {
  title: "Qui sommes-nous — Israel Growth Venture",
  description:
    "Israel Growth Venture : spécialistes du développement de franchises et succursales en Israël. Expertise locale, réseau de municipalités et propriétaires, accompagnement complet du business plan à l'ouverture.",
  alternates: {
    canonical: `${SITE_URL}/about`,
    languages: {
      fr: `${SITE_URL}/about`,
      en: `${SITE_URL}/en/about`,
      he: `${SITE_URL}/he/about`,
    },
  },
  openGraph: {
    title: "Qui sommes-nous | Israel Growth Venture",
    description:
      "Votre partenaire stratégique pour une expansion réussie en Israël. Conseil en implantation de marques, franchises et succursales.",
    url: `${SITE_URL}/about`,
    type: 'website',
  },
};

// ============================================================
// CONTENU TRILINGUE — Source : AboutPage.jsx (igv-website-v2_copy)
// ============================================================
const content = {
  fr: {
    title: 'Qui sommes-nous ?',
    subtitle: 'Votre partenaire stratégique pour une expansion réussie en Israël',
    description:
      "Nous sommes une entreprise spécialisée dans le conseil en expansion de marques et la recherche active de biens immobiliers commerciaux. Notre équipe de spécialistes en conseil à l'implantation de marques vous conseillera et cherchera les meilleurs emplacements pour développer votre marque en Israël.",
    collaboration:
      "Nous collaborons avec les municipalités et les principaux propriétaires immobiliers pour promouvoir activement et rechercher des clients pour divers projets de développement de zones commerciales.",
    support:
      "Le marché israélien étant très difficile d'accès, notre équipe peut guider les clients depuis la création d'un business plan jusqu'à la sélection de l'équipe d'employés. Nous offrons un soutien complet pour assurer le succès de votre expansion.",
    service:
      "Si vous cherchez à établir et développer votre marque ou à étendre votre concept par le biais de franchises ou de succursales, l'équipe Israel Growth Venture est à votre service.",
    values: [
      {
        title: 'Expertise Locale',
        description: 'Connaissance approfondie du marché israélien et de ses spécificités',
      },
      {
        title: 'Accompagnement Complet',
        description: "Du business plan à l'ouverture, nous vous guidons à chaque étape",
      },
      {
        title: 'Réseau Étendu',
        description: 'Partenariats avec municipalités et propriétaires immobiliers majeurs',
      },
      {
        title: 'Solutions Sur Mesure',
        description: 'Stratégies adaptées à votre marque et vos objectifs',
      },
    ],
  },
  en: {
    title: 'Who are we?',
    subtitle: 'Your strategic partner for successful expansion in Israel',
    description:
      'We are a company specialized in brand expansion consulting and active search for commercial real estate. Our team of brand implementation specialists will advise you and find the best locations to develop your brand in Israel.',
    collaboration:
      'We collaborate with municipalities and major property owners to actively promote and seek clients for various commercial zone development projects.',
    support:
      'Since the Israeli market is very difficult to access, our team can guide clients from creating a business plan to selecting the team of employees. We offer comprehensive support to ensure the success of your expansion.',
    service:
      'If you are looking to establish and grow your brand or expand your concept through franchises or branches, the Israel Growth Venture team is at your service.',
    values: [
      {
        title: 'Local Expertise',
        description: 'In-depth knowledge of the Israeli market and its specificities',
      },
      {
        title: 'Complete Support',
        description: 'From business plan to opening, we guide you every step',
      },
      {
        title: 'Extended Network',
        description: 'Partnerships with municipalities and major property owners',
      },
      {
        title: 'Tailored Solutions',
        description: 'Strategies adapted to your brand and objectives',
      },
    ],
  },
  he: {
    title: 'מי אנחנו?',
    subtitle: 'השותף האסטרטגי שלכם להתרחבות מוצלחת בישראל',
    description:
      'אנחנו חברה המתמחה בייעוץ להתרחבות מותגים וחיפוש אקטיבי של נדל"ן מסחרי. צוות המומחים שלנו ליישום מותגים ייעץ לכם וימצא את המיקומים הטובים ביותר לפיתוח המותג שלכם בישראל.',
    collaboration:
      'אנו משתפים פעולה עם עיריות ובעלי נכסים מרכזיים כדי לקדם באופן אקטיבי ולחפש לקוחות לפרויקטים שונים של פיתוח אזורים מסחריים.',
    support:
      'מכיוון שהשוק הישראלי קשה מאוד לגישה, הצוות שלנו יכול להדריך לקוחות מיצירת תוכנית עסקית ועד לבחירת צוות העובדים. אנו מציעים תמיכה מקיפה כדי להבטיח את הצלחת ההתרחבות שלכם.',
    service:
      'אם אתם מחפשים להקים ולפתח את המותג שלכם או להרחיב את הקונספט שלכם באמצעות זכיינות או סניפים, צוות Israel Growth Venture לשירותכם.',
    values: [
      {
        title: 'מומחיות מקומית',
        description: 'ידע מעמיק של השוק הישראלי והמאפיינים שלו',
      },
      {
        title: 'תמיכה מלאה',
        description: 'מתוכנית עסקית ועד פתיחה, אנו מדריכים אתכם בכל שלב',
      },
      {
        title: 'רשת מורחבת',
        description: 'שותפויות עם עיריות ובעלי נכסים מרכזיים',
      },
      {
        title: 'פתרונות מותאמים',
        description: 'אסטרטגיות מותאמות למותג ולמטרות שלכם',
      },
    ],
  },
};

// Icônes associées aux 4 valeurs (ordre fixe)
const VALUE_ICONS = [Target, Users, Award, TrendingUp];

// ============================================================
// COMPOSANT SERVER — HTML pré-rendu pour Google
// Langue par défaut : FR (la plus utilisée sur le site)
// Pour le multilingue dynamique, voir AboutClient.jsx (TODO Phase 2)
// ============================================================
export default function AboutPage() {
  const lang = content.fr; // SSR statique en FR — Google indexe ce contenu

  return (
    <>
      {/* JSON-LD — Organization + Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Israel Growth Venture',
            url: SITE_URL,
            description: lang.description,
            founder: {
              '@type': 'Person',
              name: 'Mickael Benmoussa',
              jobTitle: 'Fondateur & Expert en Implantation de Marques en Israël',
              // image: `${SITE_URL}/images/mickael-benmoussa.jpg`, // ← décommenter après upload
            },
            areaServed: 'IL',
            serviceType: [
              'Conseil en implantation de franchise',
              'Développement de succursales en Israël',
              'Audit stratégique marché israélien',
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-white">

        {/* ── HERO ── */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {lang.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {lang.subtitle}
            </p>
          </div>
        </section>

        {/* ── PHOTO + NOM (placeholder — à remplacer dès upload) ── */}
        {/*
          TODO : Uploader /public/images/mickael-benmoussa.jpg
          Puis décommenter ce bloc :

        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <img
              src="/images/mickael-benmoussa.jpg"
              alt="Mickael Benmoussa — Fondateur Israel Growth Venture"
              className="w-40 h-40 rounded-full mx-auto mb-6 object-cover shadow-lg"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mickael Benmoussa</h2>
            <p className="text-[#00318D] font-medium">
              Fondateur & Expert en Implantation de Marques en Israël
            </p>
          </div>
        </section>
        */}

        {/* ── MISSION ── */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
              <p>{lang.description}</p>
              <p>{lang.collaboration}</p>
              <p>{lang.support}</p>
              <p className="text-xl font-semibold text-[#00318D]">{lang.service}</p>
            </div>
          </div>
        </section>

        {/* ── VALEURS ── */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {lang.values.map((value, index) => {
                const Icon = VALUE_ICONS[index];
                return (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center text-[#00318D]">
                      <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
