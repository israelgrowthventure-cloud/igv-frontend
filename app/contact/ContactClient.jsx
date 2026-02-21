/**
 * app/contact/ContactClient.jsx — Client Component
 * TODO Phase 2 : migrer useSearchParams (react-router) → useSearchParams (next/navigation)
 */
'use client';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../../src/pages/Contact';

export default function ContactClient() {
  return (
    <BrowserRouter>
      <Contact />
    </BrowserRouter>
  );
}
