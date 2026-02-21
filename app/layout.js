/**
 * app/layout.js — Root Server Component Layout
 *
 * Règles Next.js App Router :
 * - Ce fichier est un Server Component (pas de hooks React)
 * - `metadata` définit les balises SEO par défaut pour tout le site
 * - Les providers client sont isolés dans ./providers.jsx
 *
 * SEO : Toutes les pages héritent de ces métadonnées sauf si elles les écrasent
 * via leur propre `export const metadata` ou `generateMetadata()`.
 */

import './globals.css';
import { Providers } from './providers';

const SITE_URL = 'https://israelgrowthventure.com';
const BRAND = 'Israel Growth Venture';

// ============================================================
// MÉTADONNÉES PAR DÉFAUT — héritées par toutes les pages
// ============================================================
export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Titre dynamique : "{page} | Israel Growth Venture"
  title: {
    default: `Expert Expansion Retail & Franchise en Israël | ${BRAND}`,
    template: `%s | ${BRAND}`,
  },

  description:
    'Israel Growth Venture accompagne les marques européennes dans leur implantation en Israël : ouverture de franchises, succursales et développement commercial B2B.',

  keywords: [
    'franchise Israël',
    'succursale Israël',
    'expansion commerciale Israël',
    'implantation Israël',
    'développement commercial Israël',
    'Israel Growth Venture',
    'consultant Israël',
    'marché israélien',
  ],

  // Langue principale FR — hreflang géré par page
  alternates: {
    canonical: SITE_URL,
    languages: {
      'fr': `${SITE_URL}`,
      'en': `${SITE_URL}/en`,
      'he': `${SITE_URL}/he`,
    },
  },

  // Open Graph global
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'he_IL'],
    url: SITE_URL,
    siteName: BRAND,
    title: `Expert Expansion Retail & Franchise en Israël | ${BRAND}`,
    description:
      'Votre partenaire stratégique pour développer votre franchise ou succursale sur le marché israélien.',
    images: [
      {
        url: `${SITE_URL}/logo-normal-IGV-petit.png`,
        width: 400,
        height: 400,
        alt: 'Israel Growth Venture',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary',
    title: `Expert Expansion Retail & Franchise en Israël | ${BRAND}`,
    description: 'Accompagnement stratégique pour l\'implantation de franchises et succursales en Israël.',
  },

  // Robots : index tout sauf /admin et /api
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icônes
  icons: {
    icon: '/logo-normal-IGV-petit.png',
    apple: '/logo-normal-IGV-petit.png',
  },

  // Verification Google Search Console (à renseigner)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

// ============================================================
// LAYOUT RACINE
// ============================================================
export default function RootLayout({ children }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head />
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
