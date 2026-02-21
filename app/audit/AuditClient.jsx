/**
 * app/audit/AuditClient.jsx — Client Component
 * 'use client' : utilise useEffect, useTranslation, useNavigate
 *
 * Import direct du composant Audit CRA.
 * Le <Helmet> interne à ce composant est remplacé par le `metadata` du Server Component parent.
 *
 * TODO Phase 2 :
 * - Remplacer useNavigate par useRouter (next/navigation)
 * - Retirer BrowserRouter quand toutes dépendances migrées
 */
'use client';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Audit from '../../src/pages/Audit';

export default function AuditClient() {
  return (
    <BrowserRouter>
      <Audit />
    </BrowserRouter>
  );
}
