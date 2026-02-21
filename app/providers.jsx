/**
 * app/providers.jsx — Client Component
 * Wraps all context providers that require client-side APIs.
 * Pattern Next.js App Router : Server Layout → Client Providers → Children
 */
'use client';

import React, { Suspense } from 'react';
import { Toaster } from 'sonner';

// Loading fallback
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function Providers({ children }) {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageFallback />}>
        {children}
      </Suspense>
    </>
  );
}
