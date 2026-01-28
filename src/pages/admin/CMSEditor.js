import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';
const SITE_URL = 'https://israelgrowthventure.com';

// Pages et leurs sections éditables
const PAGE_SECTIONS = {
  home: [
    { id: 'hero_title', name: 'Titre principal', type: 'text' },
    { id: 'hero_subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'hero_description', name: 'Description Hero', type: 'textarea' },
    { id: 'cta_button', name: 'Bouton CTA', type: 'text' },
    { id: 'services_title', name: 'Titre Services', type: 'text' },
    { id: 'about_preview', name: 'Aperçu À Propos', type: 'html' },
  ],
  about: [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
    { id: 'mission', name: 'Notre Mission', type: 'html' },
    { id: 'team', name: 'L\'équipe', type: 'html' },
  ],
  'mini-analyse': [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'form_intro', name: 'Introduction formulaire', type: 'textarea' },
  ],
  contact: [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'address', name: 'Adresse', type: 'textarea' },
    { id: 'phone', name: 'Téléphone', type: 'text' },
    { id: 'email', name: 'Email', type: 'text' },
  ],
  packs: [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
  ],
  'future-commerce': [
    { id: 'title', name: 'Titre de la page', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'description', name: 'Description', type: 'textarea' },
    { id: 'cta_title', name: 'Titre CTA', type: 'text' },
    { id: 'cta_description', name: 'Description CTA', type: 'textarea' },
    { id: 'cta_button', name: 'Bouton CTA', type: 'text' },
  ],
};

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
];

const PAGES = [
  { id: 'home', name: 'Accueil', url: '/' },
  { id: 'about', name: 'À Propos', url: '/about' },
  { id: 'mini-analyse', name: 'Mini-Analyse', url: '/mini-analyse' },
  { id: 'packs', name: 'Packs', url: '/packs' },
  { id: 'contact', name: 'Contact', url: '/contact' },
  { id: 'future-commerce', name: 'Blog / Future Commerce', url: '/future-commerce' },
];

function CMSEditor() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [language, setLanguage] = useState('fr');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(true);

  // Charger les contenus de la page
  useEffect(() => {
    loadPageContent();
  }, [selectedPage, language]);

  const loadPageContent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/pages/${selectedPage}?language=${language}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extraire le contenu des sections
      const content = res.data.content || {};
      const sectionData = {};
      
      (PAGE_SECTIONS[selectedPage] || []).forEach(section => {
        sectionData[section.id] = content[section.id] || '';
      });
      
      setSections(sectionData);
    } catch (error) {
      console.error('Error loading page:', error);
      // Initialiser avec des valeurs vides
      const sectionData = {};
      (PAGE_SECTIONS[selectedPage] || []).forEach(section => {
        sectionData[section.id] = '';
      });
      setSections(sectionData);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      // Sauvegarder chaque section
      await axios.post(`${API_URL}/api/pages/update`, {
        page: selectedPage,
        language: language,
        section: 'main',
        content: sections
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Modifications enregistrées !');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionChange = (sectionId, value) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: value
    }));
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const currentPageSections = PAGE_SECTIONS[selectedPage] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Éditeur CMS</h1>
                <p className="text-sm text-gray-500">Modifiez le contenu de vos pages</p>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Page</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white min-w-[150px]"
                >
                  {PAGES.map(page => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Langue</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg transition ${showPreview ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                👁️ {showPreview ? 'Masquer' : 'Aperçu'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? '⏳ Enregistrement...' : '💾 Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Device Preview Buttons */}
      {showPreview && (
        <div className="bg-gray-200 border-b border-gray-300 px-4 py-2 flex justify-center gap-4">
          {[
            { mode: 'desktop', icon: '🖥️', label: 'Desktop' },
            { mode: 'tablet', icon: '📱', label: 'Tablet' },
            { mode: 'mobile', icon: '📱', label: 'Mobile' },
          ].map(device => (
            <button
              key={device.mode}
              onClick={() => setPreviewMode(device.mode)}
              className={`px-3 py-1 rounded shadow text-sm ${previewMode === device.mode ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'}`}
            >
              {device.icon} {device.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="flex">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} bg-white p-6 overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : currentPageSections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl mb-2">📝</p>
              <p>Aucune section éditable pour cette page.</p>
              <p className="text-sm mt-2">Les sections seront bientôt disponibles.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-1">📝 Édition: {PAGES.find(p => p.id === selectedPage)?.name}</h3>
                <p className="text-sm text-blue-600">Langue: {LANGUAGES.find(l => l.code === language)?.flag} {LANGUAGES.find(l => l.code === language)?.name}</p>
              </div>

              {currentPageSections.map(section => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {section.name}
                  </label>
                  
                  {section.type === 'text' && (
                    <input
                      type="text"
                      value={sections[section.id] || ''}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder={`Entrez ${section.name.toLowerCase()}...`}
                    />
                  )}
                  
                  {section.type === 'textarea' && (
                    <textarea
                      value={sections[section.id] || ''}
                      onChange={(e) => handleSectionChange(section.id, e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder={`Entrez ${section.name.toLowerCase()}...`}
                    />
                  )}
                  
                  {section.type === 'html' && (
                    <ReactQuill
                      theme="snow"
                      value={sections[section.id] || ''}
                      onChange={(value) => handleSectionChange(section.id, value)}
                      modules={quillModules}
                      className="bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-gray-300 p-4 flex justify-center overflow-hidden" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <div 
              className="bg-white shadow-xl transition-all duration-300 overflow-hidden"
              style={{ width: getPreviewWidth(), maxWidth: '100%' }}
            >
              <iframe
                src={`${SITE_URL}${PAGES.find(p => p.id === selectedPage)?.url || '/'}?lang=${language}`}
                className="w-full border-0"
                style={{ height: 'calc(100vh - 180px)' }}
                title="Preview"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <span className="text-gray-500">
            💡 Les modifications seront visibles après le prochain déploiement ou rechargement du cache.
          </span>
          <div className="flex gap-4">
            <a href="/admin/crm/blog" className="text-blue-600 hover:underline">📝 Blog & FAQ</a>
            <a href={`${SITE_URL}${PAGES.find(p => p.id === selectedPage)?.url || '/'}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">↗️ Voir en live</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMSEditor;
