/**
 * app/packs/PacksClient.jsx — Client Component
 * TODO Phase 2 : migrer useNavigate → useRouter(next/navigation)
 */
'use client';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Packs from '../../src/pages/Packs';

export default function PacksClient() {
  return (
    <BrowserRouter>
      <Packs />
    </BrowserRouter>
  );
}
