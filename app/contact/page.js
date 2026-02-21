/**
 * app/contact/page.js — Page Contact (Server Component)
 *
 * Migration depuis : src/pages/Contact.js
 */

import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contactez-nous — Israel Growth Venture',
  description:
    "Contactez Israel Growth Venture pour discuter de votre projet d'implantation en Israël. Réponse sous 24h. Franchises, succursales et expansion B2B.",
  alternates: {
    canonical: 'https://israelgrowthventure.com/contact',
    languages: {
      'fr': 'https://israelgrowthventure.com/contact',
      'en': 'https://israelgrowthventure.com/en/contact',
      'he': 'https://israelgrowthventure.com/he/contact',
    },
  },
  openGraph: {
    title: 'Contactez Israel Growth Venture',
    description:
      "Discutez de votre projet de franchise ou succursale en Israël avec nos experts. Réponse sous 24h.",
    url: 'https://israelgrowthventure.com/contact',
    type: 'website',
  },
  // noindex false — page contact publiquement indexée
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactClient />;
}
