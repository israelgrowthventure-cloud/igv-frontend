/**
 * app/home/HomeClient.jsx — Client Component (Accueil)
 * 'use client' obligatoire : utilise useState, useEffect, useTranslation, react-router-dom
 *
 * STATUT MIGRATION : Phase 1 — Shim de compatibilité
 * Ce composant wrape le code CRA existant avec BrowserRouter pour maintenir
 * la compatibilité pendant la migration.
 *
 * TODO Phase 2 :
 * - Remplacer `Link` (react-router-dom) par `Link` (next/link)
 * - Remplacer `useNavigate` par `useRouter` (next/navigation)
 * - Retirer BrowserRouter quand toutes les dépendances sont migrées
 * - Migrer react-i18next vers next-intl
 */
'use client';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';

export default function HomeClient() {
  return (
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}
