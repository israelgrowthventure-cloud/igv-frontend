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
    { id: 'hero_title', name: 'Titre principal', type: 'text', default: 'Israel Growth Venture' },
    { id: 'hero_subtitle', name: 'Sous-titre', type: 'text', default: 'Votre partenaire pour le marché israélien' },
    { id: 'hero_description', name: 'Description', type: 'textarea', default: '' },
    { id: 'cta_primary', name: 'Bouton principal', type: 'text', default: 'Réserver un rendez-vous' },
    { id: 'cta_secondary', name: 'Bouton secondaire', type: 'text', default: 'En savoir plus' },
  ],
  about: [
    { id: 'title', name: 'Titre', type: 'text', default: 'À Propos' },
    { id: 'intro', name: 'Introduction', type: 'html', default: '' },
    { id: 'mission_title', name: 'Titre Mission', type: 'text', default: 'Notre Mission' },
    { id: 'mission_content', name: 'Contenu Mission', type: 'html', default: '' },
  ],
  'mini-analyse': [
    { id: 'title', name: 'Titre', type: 'text', default: 'Mini-Analyse Gratuite' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text', default: 'Évaluez votre potentiel en Israël' },
    { id: 'intro', name: 'Introduction', type: 'textarea', default: '' },
  ],
  contact: [
    { id: 'title', name: 'Titre', type: 'text', default: 'Contactez-nous' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text', default: '' },
    { id: 'email', name: 'Email', type: 'text', default: 'contact@israelgrowthventure.com' },
    { id: 'phone', name: 'Téléphone', type: 'text', default: '' },
    { id: 'address', name: 'Adresse', type: 'textarea', default: '' },
  ],
  packs: [
    { id: 'title', name: 'Titre', type: 'text', default: 'Nos Packs' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text', default: '' },
    { id: 'intro', name: 'Introduction', type: 'html', default: '' },
  ],
  blog: [
    { id: 'title', name: 'Titre du Blog', type: 'text', default: 'Le Blog IGV' },
    { id: 'subtitle', name: 'Sous-titre', type: 'text', default: 'Actualités et tendances' },
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
  { id: 'blog', name: 'Blog', url: '/future-commerce' },
];

function CMSManager() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [language, setLanguage] = useState('fr');
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'preview'
  const [hasChanges, setHasChanges] = useState(false);

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
      
      const content = res.data.content || {};
      const sectionData = {};
      
      (PAGE_SECTIONS[selectedPage] || []).forEach(section => {
        sectionData[section.id] = content[section.id] || section.default || '';
      });
      
      setSections(sectionData);
      setHasChanges(false);
    } catch (error) {
      // Initialize with defaults
      const sectionData = {};
      (PAGE_SECTIONS[selectedPage] || []).forEach(section => {
        sectionData[section.id] = section.default || '';
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
      
      await axios.post(`${API_URL}/api/pages/update`, {
        page: selectedPage,
        language: language,
        section: 'main',
        content: sections
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('✅ Modifications enregistrées !');
      setHasChanges(false);
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
    setHasChanges(true);
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
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const currentPage = PAGES.find(p => p.id === selectedPage);
  const currentPageSections = PAGE_SECTIONS[selectedPage] || [];
  const previewUrl = `${SITE_URL}${currentPage?.url || '/'}${language !== 'fr' ? `?lang=${language}` : ''}`;

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
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

            {/* Page & Language Selectors */}
            <div className="flex items-center gap-4">
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white font-medium"
              >
                {PAGES.map(page => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>

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

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                ✏️ Éditer
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                👁️ Aperçu
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`px-6 py-2 rounded-lg font-medium transition ${hasChanges ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {saving ? '⏳ Sauvegarde...' : hasChanges ? '💾 Sauvegarder' : '✓ Sauvegardé'}
            </button>
          </div>
        </div>

        {/* Device Selector (for preview mode) */}
        {activeTab === 'preview' && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-center gap-2">
            {[
              { mode: 'desktop', icon: '🖥️', label: 'Desktop' },
              { mode: 'tablet', icon: '📱', label: 'Tablet' },
              { mode: 'mobile', icon: '📱', label: 'Mobile' },
            ].map(device => (
              <button
                key={device.mode}
                onClick={() => setPreviewMode(device.mode)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${previewMode === device.mode ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                {device.icon} {device.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'editor' ? (
        /* Editor View */
        <div className="max-w-4xl mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Page Info */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{currentPage?.name}</h2>
                <p className="opacity-90">
                  {LANGUAGES.find(l => l.code === language)?.flag} Version {LANGUAGES.find(l => l.code === language)?.name}
                </p>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm bg-white/20 hover:bg-white/30 rounded-full px-4 py-1 transition"
                >
                  ↗️ Voir la page en ligne
                </a>
              </div>

              {/* Sections */}
              {currentPageSections.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                  <p className="text-4xl mb-3">📝</p>
                  <p>Cette page n'a pas encore de sections éditables.</p>
                </div>
              ) : (
                currentPageSections.map(section => (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <label className="font-semibold text-gray-800">{section.name}</label>
                    </div>
                    <div className="p-4">
                      {section.type === 'text' && (
                        <input
                          type="text"
                          value={sections[section.id] || ''}
                          onChange={(e) => handleSectionChange(section.id, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={section.default || `Entrez ${section.name.toLowerCase()}...`}
                        />
                      )}
                      
                      {section.type === 'textarea' && (
                        <textarea
                          value={sections[section.id] || ''}
                          onChange={(e) => handleSectionChange(section.id, e.target.value)}
                          rows={4}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={section.default || `Entrez ${section.name.toLowerCase()}...`}
                        />
                      )}
                      
                      {section.type === 'html' && (
                        <ReactQuill
                          theme="snow"
                          value={sections[section.id] || ''}
                          onChange={(value) => handleSectionChange(section.id, value)}
                          modules={quillModules}
                          className="bg-white rounded"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Help Text */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <strong>💡 Note:</strong> Les modifications du contenu sont stockées dans la base de données. 
                Pour les voir en ligne, les pages doivent être configurées pour charger le contenu depuis l'API CMS.
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Preview View */
        <div className="flex justify-center bg-gray-300 p-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
            style={{ width: getPreviewWidth(), maxWidth: '100%' }}
          >
            <div className="bg-gray-800 text-white text-xs px-3 py-1 flex items-center justify-between">
              <span>{previewUrl}</span>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">↗️</a>
            </div>
            <iframe
              src={previewUrl}
              className="w-full border-0"
              style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
              title="Page Preview"
            />
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <a href="/admin/crm/blog" className="text-blue-600 hover:underline flex items-center gap-1">
              📝 Gérer le Blog & FAQ
            </a>
          </div>
          <div className="text-sm text-gray-500">
            {hasChanges && <span className="text-orange-600 font-medium">⚠️ Modifications non enregistrées</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMSManager;
