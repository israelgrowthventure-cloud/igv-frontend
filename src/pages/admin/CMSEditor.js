import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'sonner';
import PageRenderer from '../../components/cms/PageRenderer';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-backend.onrender.com';
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
  services: [
    { id: 'title', name: 'Titre principal', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
    { id: 'service1_title', name: 'Service 1 - Titre', type: 'text' },
    { id: 'service1_desc', name: 'Service 1 - Description', type: 'textarea' },
    { id: 'service2_title', name: 'Service 2 - Titre', type: 'text' },
    { id: 'service2_desc', name: 'Service 2 - Description', type: 'textarea' },
    { id: 'service3_title', name: 'Service 3 - Titre', type: 'text' },
    { id: 'service3_desc', name: 'Service 3 - Description', type: 'textarea' },
  ],
  blog: [
    { id: 'title', name: 'Titre de la page', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
    { id: 'featured_title', name: 'Titre Articles en Vedette', type: 'text' },
  ],
  'mini-analyse': [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'form_intro', name: 'Introduction formulaire', type: 'textarea' },
    { id: 'benefits_title', name: 'Titre Avantages', type: 'text' },
    { id: 'benefits_desc', name: 'Description Avantages', type: 'html' },
  ],
  contact: [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'address', name: 'Adresse', type: 'textarea' },
    { id: 'phone', name: 'Téléphone', type: 'text' },
    { id: 'email', name: 'Email', type: 'text' },
    { id: 'hours', name: 'Horaires', type: 'textarea' },
  ],
  packs: [
    { id: 'title', name: 'Titre', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
    { id: 'pack_starter_title', name: 'Pack Starter - Titre', type: 'text' },
    { id: 'pack_starter_price', name: 'Pack Starter - Prix', type: 'text' },
    { id: 'pack_pro_title', name: 'Pack Pro - Titre', type: 'text' },
    { id: 'pack_pro_price', name: 'Pack Pro - Prix', type: 'text' },
    { id: 'pack_enterprise_title', name: 'Pack Enterprise - Titre', type: 'text' },
    { id: 'pack_enterprise_price', name: 'Pack Enterprise - Prix', type: 'text' },
  ],
  faq: [
    { id: 'title', name: 'Titre de la page', type: 'text' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text' },
    { id: 'intro', name: 'Introduction', type: 'html' },
    { id: 'categories_title', name: 'Titre Catégories', type: 'text' },
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
  { id: 'home', name: '🏠 Accueil', url: '/' },
  { id: 'about', name: 'ℹ️ À Propos', url: '/about' },
  { id: 'services', name: '⚙️ Services', url: '/services' },
  { id: 'blog', name: '📝 Blog', url: '/blog' },
  { id: 'mini-analyse', name: '📊 Mini-Analyse', url: '/mini-analyse' },
  { id: 'packs', name: '📦 Packs', url: '/packs' },
  { id: 'faq', name: '❓ FAQ', url: '/faq' },
  { id: 'contact', name: '📞 Contact', url: '/contact' },
  { id: 'future-commerce', name: '🚀 Future Commerce', url: '/future-commerce' },
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
      
      // Structure PLATE: backend retourne directement les champs
      const pageData = res.data;
      const sectionData = {};
      
      (PAGE_SECTIONS[selectedPage] || []).forEach(section => {
        sectionData[section.id] = pageData[section.id] || '';
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
      
      // Sauvegarder avec structure PLATE (flat)
      await axios.post(`${API_URL}/api/pages/update-flat`, {
        page: selectedPage,
        language: language,
        ...sections  // Spread: envoie directement { hero_title: "...", services_title: "..." }
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
        {/* Editor Panel - Rendu IDENTIQUE à Preview mais éditable */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} bg-white overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-4 sticky top-0 z-10">
                <h3 className="font-semibold text-blue-800 mb-1">✏️ Mode ÉDITION: {PAGES.find(p => p.id === selectedPage)?.name}</h3>
                <p className="text-sm text-blue-600">Langue: {LANGUAGES.find(l => l.code === language)?.flag} {LANGUAGES.find(l => l.code === language)?.name}</p>
                <p className="text-xs text-blue-500 mt-1">💡 Cliquez sur un élément pour l'éditer directement • Même rendu que l'aperçu →</p>
              </div>

              <PageRenderer 
                page={selectedPage}
                language={language}
                content={sections}
                editable={true}
                onEdit={(key, value) => {
                  if (value !== undefined) {
                    handleSectionChange(key, value);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Live Preview Panel - VRAIE PAGE DU SITE */}
        {showPreview && (
          <div className="w-1/2 bg-gray-100 p-4 overflow-hidden" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
              <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-gray-300 ml-2">
                    {SITE_URL}{PAGES.find(p => p.id === selectedPage)?.url}
                  </span>
                </div>
                <a 
                  href={`${SITE_URL}${PAGES.find(p => p.id === selectedPage)?.url}?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-300 hover:text-blue-100 flex items-center gap-1"
                >
                  🔗 Ouvrir dans un nouvel onglet
                </a>
              </div>
              
              <div className="flex-1 overflow-auto bg-white" style={{ width: getPreviewWidth(), margin: '0 auto' }}>
                <PageRenderer 
                  page={selectedPage}
                  language={language}
                  content={sections}
                  editable={false}
                />
              </div>
              
              <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t rounded-b-lg">
                💡 Preview temps réel • Mode: {previewMode === 'desktop' ? 'Bureau' : previewMode === 'tablet' ? 'Tablette' : 'Mobile'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CMSEditor;
