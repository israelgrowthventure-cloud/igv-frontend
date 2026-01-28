import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';
const SITE_URL = 'https://israelgrowthventure.com';

// Pages disponibles avec leurs URLs
const PAGES = [
  { id: 'home', name: 'Accueil', url: '/' },
  { id: 'mini-analyse', name: 'Mini-Analyse', url: '/mini-analyse' },
  { id: 'about', name: 'À Propos', url: '/about' },
  { id: 'packs', name: 'Packs', url: '/packs' },
  { id: 'blog', name: 'Blog', url: '/blog' },
  { id: 'contact', name: 'Contact', url: '/contact' },
  { id: 'contact-expert', name: 'Contact Expert', url: '/contact-expert' },
  { id: 'terms', name: 'CGV', url: '/terms' },
  { id: 'privacy', name: 'Confidentialité', url: '/privacy' },
  { id: 'cookies', name: 'Cookies', url: '/cookies' },
];

function CMSManager() {
  const { t, i18n } = useTranslation();
  const iframeRef = useRef(null);
  
  const [selectedPage, setSelectedPage] = useState(PAGES[0]);
  const [language, setLanguage] = useState(i18n.language || 'fr');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // URL de la page avec paramètre de langue
  const getPageUrl = () => {
    const langParam = language !== 'fr' ? `?lang=${language}` : '';
    return `${SITE_URL}${selectedPage.url}${langParam}`;
  };

  // Recharger l'iframe quand page ou langue change
  useEffect(() => {
    setIframeLoaded(false);
    if (iframeRef.current) {
      iframeRef.current.src = getPageUrl();
    }
  }, [selectedPage, language]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Ouvrir la page dans un nouvel onglet pour édition
  const openInNewTab = () => {
    window.open(getPageUrl(), '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Toolbar */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CMS Visuel</h1>
                <p className="text-sm text-gray-500">Prévisualisation des pages en temps réel</p>
              </div>
            </div>

            {/* Page Selector */}
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Page</label>
                <select
                  value={selectedPage.id}
                  onChange={(e) => setSelectedPage(PAGES.find(p => p.id === e.target.value) || PAGES[0])}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 min-w-[180px]"
                >
                  {PAGES.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Langue</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="he">🇮🇱 עברית</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIframeLoaded(false);
                  if (iframeRef.current) {
                    iframeRef.current.src = getPageUrl();
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                🔄 Actualiser
              </button>
              
              <button
                onClick={openInNewTab}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                ↗️ Ouvrir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Device Preview Buttons */}
      <div className="bg-gray-200 border-b border-gray-300 px-4 py-2 flex justify-center gap-4">
        <button
          onClick={() => document.getElementById('preview-frame').style.width = '100%'}
          className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50"
        >
          🖥️ Desktop
        </button>
        <button
          onClick={() => document.getElementById('preview-frame').style.width = '768px'}
          className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50"
        >
          📱 Tablet
        </button>
        <button
          onClick={() => document.getElementById('preview-frame').style.width = '375px'}
          className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50"
        >
          📱 Mobile
        </button>
      </div>

      {/* Page Info Bar */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-blue-800">URL:</span>
            <a 
              href={getPageUrl()} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {getPageUrl()}
            </a>
          </div>
          {!iframeLoaded && (
            <span className="text-sm text-blue-600 flex items-center gap-2">
              <span className="animate-spin">⏳</span> Chargement...
            </span>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex justify-center bg-gray-300 p-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div 
          id="preview-frame"
          className="bg-white shadow-2xl transition-all duration-300"
          style={{ width: '100%', maxWidth: '100%' }}
        >
          {/* Loading Overlay */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de la page...</p>
              </div>
            </div>
          )}
          
          {/* Live Preview Iframe */}
          <iframe
            ref={iframeRef}
            src={getPageUrl()}
            onLoad={handleIframeLoad}
            className="w-full border-0"
            style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}
            title="Page Preview"
          />
        </div>
      </div>

      {/* Bottom Help Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-6">
            <span className="text-gray-600">
              💡 <strong>Astuce:</strong> Pour modifier le contenu des pages, utilisez les fichiers de traduction i18n
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="/admin/crm/blog" 
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              📝 Gérer les articles du blog
            </a>
            <span className="text-gray-300">|</span>
            <a 
              href="/admin/crm/settings" 
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              ⚙️ Paramètres
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMSManager;
