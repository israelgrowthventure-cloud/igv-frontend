/**
 * app/page.js — Page d'accueil (Server Component)
 *
 * Pattern App Router :
 * - `export const metadata` → injectées dans <head> côté serveur (Google lit ça)
 * - Le composant `HomeClient` est 'use client' car il utilise useState/useEffect/i18n
 *
 * Migration depuis : src/pages/Home.js
 * TODO complet : remplacer react-router-dom Link → next/link dans HomeClient
 */

import HomeClient from './home/HomeClient';

// ============================================================
// SEO — Accueil
// ============================================================
export const metadata = {
  title: 'Expert Expansion Retail & Franchise en Israël',
  description:
    'Israel Growth Venture accompagne les marques françaises et européennes dans leur développement commercial en Israël : franchises, succursales et audit stratégique.',
  alternates: {
    canonical: 'https://israelgrowthventure.com/',
    languages: {
      'fr': 'https://israelgrowthventure.com/',
      'en': 'https://israelgrowthventure.com/en',
      'he': 'https://israelgrowthventure.com/he',
    },
  },
  openGraph: {
    title: 'Expert Expansion Retail & Franchise en Israël | IGV',
    description:
      'Développez votre franchise ou succursale en Israël avec Israel Growth Venture. Analyse stratégique, accompagnement terrain et expertise locale.',
    url: 'https://israelgrowthventure.com/',
    type: 'website',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
