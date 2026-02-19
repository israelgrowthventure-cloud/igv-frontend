import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload, Image, Type, AlignLeft, Link2, Trash2, Plus, ChevronDown, ChevronUp, Eye, Edit3, Save, Monitor, Tablet, Smartphone } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-cms-backend.onrender.com';
const SITE_URL = 'https://israelgrowthventure.com';

// ==============================================
// DÉFINITION COMPLÈTE DE TOUTES LES SECTIONS
// ==============================================
const PAGE_SECTIONS = {
  home: {
    name: 'Accueil',
    url: '/',
    sections: [
      { id: 'hero', name: '🎯 Section Hero', collapsed: false, fields: [
        { id: 'hero_title', label: 'Titre principal', type: 'text', placeholder: 'Israel Growth Venture' },
        { id: 'hero_subtitle', label: 'Sous-titre', type: 'text', placeholder: 'Votre partenaire stratégique...' },
        { id: 'hero_description', label: 'Description', type: 'textarea', placeholder: 'Nous sommes spécialisés...' },
        { id: 'hero_image', label: 'Image Hero', type: 'image', placeholder: 'https://...' },
        { id: 'hero_cta_primary', label: 'Bouton principal (texte)', type: 'text', placeholder: 'Réserver un rendez-vous' },
        { id: 'hero_cta_primary_link', label: 'Bouton principal (lien)', type: 'text', placeholder: '/appointment' },
        { id: 'hero_cta_secondary', label: 'Bouton secondaire (texte)', type: 'text', placeholder: 'En savoir plus' },
        { id: 'hero_cta_secondary_link', label: 'Bouton secondaire (lien)', type: 'text', placeholder: '/about' },
      ]},
      { id: 'stats', name: '📊 Statistiques', collapsed: true, fields: [
        { id: 'stat_1_value', label: 'Stat 1 - Valeur', type: 'text', placeholder: '20+' },
        { id: 'stat_1_label', label: 'Stat 1 - Label', type: 'text', placeholder: "Années d'expérience" },
        { id: 'stat_2_value', label: 'Stat 2 - Valeur', type: 'text', placeholder: '150+' },
        { id: 'stat_2_label', label: 'Stat 2 - Label', type: 'text', placeholder: 'Clients accompagnés' },
        { id: 'stat_3_value', label: 'Stat 3 - Valeur', type: 'text', placeholder: '95%' },
        { id: 'stat_3_label', label: 'Stat 3 - Label', type: 'text', placeholder: 'Taux de réussite' },
      ]},
      { id: 'steps', name: '🚀 Étapes (Comment ça marche)', collapsed: true, fields: [
        { id: 'steps_title', label: 'Titre section', type: 'text', placeholder: 'Comment ça marche ?' },
        { id: 'step_1_title', label: 'Étape 1 - Titre', type: 'text', placeholder: 'Analyse' },
        { id: 'step_1_desc', label: 'Étape 1 - Description', type: 'textarea', placeholder: 'Nous analysons...' },
        { id: 'step_1_image', label: 'Étape 1 - Image', type: 'image' },
        { id: 'step_2_title', label: 'Étape 2 - Titre', type: 'text', placeholder: 'Stratégie' },
        { id: 'step_2_desc', label: 'Étape 2 - Description', type: 'textarea' },
        { id: 'step_2_image', label: 'Étape 2 - Image', type: 'image' },
        { id: 'step_3_title', label: 'Étape 3 - Titre', type: 'text', placeholder: 'Lancement' },
        { id: 'step_3_desc', label: 'Étape 3 - Description', type: 'textarea' },
        { id: 'step_3_image', label: 'Étape 3 - Image', type: 'image' },
      ]},
      { id: 'cta_bottom', name: '📢 CTA Final', collapsed: true, fields: [
        { id: 'cta_title', label: 'Titre CTA', type: 'text', placeholder: 'Prêt à conquérir le marché israélien ?' },
        { id: 'cta_description', label: 'Description', type: 'textarea' },
        { id: 'cta_button', label: 'Texte bouton', type: 'text', placeholder: 'Démarrer maintenant' },
        { id: 'cta_button_link', label: 'Lien bouton', type: 'text', placeholder: '/contact' },
      ]},
    ]
  },
  about: {
    name: 'À Propos',
    url: '/about',
    sections: [
      { id: 'hero', name: '🎯 En-tête', collapsed: false, fields: [
        { id: 'title', label: 'Titre', type: 'text', placeholder: 'À Propos de IGV' },
        { id: 'subtitle', label: 'Sous-titre', type: 'text', placeholder: 'Notre histoire...' },
        { id: 'hero_image', label: 'Image principale', type: 'image' },
      ]},
      { id: 'story', name: '📖 Notre Histoire', collapsed: true, fields: [
        { id: 'story_title', label: 'Titre', type: 'text', placeholder: 'Notre Histoire' },
        { id: 'story_content', label: 'Contenu', type: 'html' },
        { id: 'story_image', label: 'Image', type: 'image' },
      ]},
      { id: 'mission', name: '🎯 Mission & Vision', collapsed: true, fields: [
        { id: 'mission_title', label: 'Titre Mission', type: 'text', placeholder: 'Notre Mission' },
        { id: 'mission_content', label: 'Contenu Mission', type: 'html' },
        { id: 'vision_title', label: 'Titre Vision', type: 'text', placeholder: 'Notre Vision' },
        { id: 'vision_content', label: 'Contenu Vision', type: 'html' },
      ]},
      { id: 'team', name: '👥 Équipe', collapsed: true, fields: [
        { id: 'team_title', label: 'Titre section', type: 'text', placeholder: 'Notre Équipe' },
        { id: 'team_member_1_name', label: 'Membre 1 - Nom', type: 'text' },
        { id: 'team_member_1_role', label: 'Membre 1 - Rôle', type: 'text' },
        { id: 'team_member_1_photo', label: 'Membre 1 - Photo', type: 'image' },
        { id: 'team_member_1_bio', label: 'Membre 1 - Bio', type: 'textarea' },
        { id: 'team_member_2_name', label: 'Membre 2 - Nom', type: 'text' },
        { id: 'team_member_2_role', label: 'Membre 2 - Rôle', type: 'text' },
        { id: 'team_member_2_photo', label: 'Membre 2 - Photo', type: 'image' },
        { id: 'team_member_2_bio', label: 'Membre 2 - Bio', type: 'textarea' },
      ]},
    ]
  },
  'mini-analyse': {
    name: 'Mini-Analyse',
    url: '/mini-analyse',
    sections: [
      { id: 'hero', name: '🎯 En-tête', collapsed: false, fields: [
        { id: 'title', label: 'Titre', type: 'text', placeholder: 'Mini-Analyse Gratuite' },
        { id: 'subtitle', label: 'Sous-titre', type: 'text', placeholder: 'Évaluez votre potentiel...' },
        { id: 'description', label: 'Description', type: 'textarea' },
        { id: 'hero_image', label: 'Image', type: 'image' },
      ]},
      { id: 'benefits', name: '✅ Avantages', collapsed: true, fields: [
        { id: 'benefits_title', label: 'Titre section', type: 'text', placeholder: 'Ce que vous obtenez' },
        { id: 'benefit_1', label: 'Avantage 1', type: 'text' },
        { id: 'benefit_2', label: 'Avantage 2', type: 'text' },
        { id: 'benefit_3', label: 'Avantage 3', type: 'text' },
        { id: 'benefit_4', label: 'Avantage 4', type: 'text' },
      ]},
      { id: 'form', name: '📝 Formulaire', collapsed: true, fields: [
        { id: 'form_title', label: 'Titre formulaire', type: 'text', placeholder: 'Commencer maintenant' },
        { id: 'form_cta', label: 'Texte bouton', type: 'text', placeholder: 'Obtenir mon analyse' },
      ]},
    ]
  },
  packs: {
    name: 'Nos Packs',
    url: '/packs',
    sections: [
      { id: 'hero', name: '🎯 En-tête', collapsed: false, fields: [
        { id: 'title', label: 'Titre', type: 'text', placeholder: 'Nos Packs' },
        { id: 'subtitle', label: 'Sous-titre', type: 'text' },
        { id: 'description', label: 'Description', type: 'textarea' },
      ]},
      { id: 'pack_1', name: '📦 Pack Starter', collapsed: true, fields: [
        { id: 'pack_1_name', label: 'Nom', type: 'text', placeholder: 'Starter' },
        { id: 'pack_1_price', label: 'Prix', type: 'text', placeholder: '1 500 €' },
        { id: 'pack_1_description', label: 'Description', type: 'textarea' },
        { id: 'pack_1_features', label: 'Caractéristiques (une par ligne)', type: 'textarea' },
        { id: 'pack_1_cta', label: 'Texte bouton', type: 'text', placeholder: 'Choisir ce pack' },
      ]},
      { id: 'pack_2', name: '📦 Pack Business', collapsed: true, fields: [
        { id: 'pack_2_name', label: 'Nom', type: 'text', placeholder: 'Business' },
        { id: 'pack_2_price', label: 'Prix', type: 'text', placeholder: '3 500 €' },
        { id: 'pack_2_description', label: 'Description', type: 'textarea' },
        { id: 'pack_2_features', label: 'Caractéristiques (une par ligne)', type: 'textarea' },
        { id: 'pack_2_cta', label: 'Texte bouton', type: 'text', placeholder: 'Choisir ce pack' },
        { id: 'pack_2_highlight', label: 'Badge (ex: Populaire)', type: 'text' },
      ]},
      { id: 'pack_3', name: '📦 Pack Premium', collapsed: true, fields: [
        { id: 'pack_3_name', label: 'Nom', type: 'text', placeholder: 'Premium' },
        { id: 'pack_3_price', label: 'Prix', type: 'text', placeholder: '7 500 €' },
        { id: 'pack_3_description', label: 'Description', type: 'textarea' },
        { id: 'pack_3_features', label: 'Caractéristiques (une par ligne)', type: 'textarea' },
        { id: 'pack_3_cta', label: 'Texte bouton', type: 'text', placeholder: 'Choisir ce pack' },
      ]},
    ]
  },
  contact: {
    name: 'Contact',
    url: '/contact',
    sections: [
      { id: 'hero', name: '🎯 En-tête', collapsed: false, fields: [
        { id: 'title', label: 'Titre', type: 'text', placeholder: 'Contactez-nous' },
        { id: 'subtitle', label: 'Sous-titre', type: 'text' },
        { id: 'description', label: 'Description', type: 'textarea' },
      ]},
      { id: 'info', name: '📍 Informations', collapsed: true, fields: [
        { id: 'email', label: 'Email', type: 'text', placeholder: 'contact@igv.com' },
        { id: 'phone', label: 'Téléphone', type: 'text', placeholder: '+972...' },
        { id: 'address', label: 'Adresse', type: 'textarea' },
        { id: 'hours', label: 'Horaires', type: 'text', placeholder: 'Dim-Jeu: 9h-18h' },
      ]},
      { id: 'social', name: '🔗 Réseaux sociaux', collapsed: true, fields: [
        { id: 'linkedin', label: 'LinkedIn URL', type: 'text' },
        { id: 'facebook', label: 'Facebook URL', type: 'text' },
        { id: 'twitter', label: 'Twitter/X URL', type: 'text' },
        { id: 'instagram', label: 'Instagram URL', type: 'text' },
      ]},
      { id: 'form', name: '📝 Formulaire', collapsed: true, fields: [
        { id: 'form_title', label: 'Titre formulaire', type: 'text', placeholder: 'Envoyez-nous un message' },
        { id: 'form_cta', label: 'Texte bouton', type: 'text', placeholder: 'Envoyer' },
      ]},
    ]
  },
  'future-commerce': {
    name: 'Future Commerce (Blog)',
    url: '/future-commerce',
    sections: [
      { id: 'hero', name: '🎯 En-tête', collapsed: false, fields: [
        { id: 'title', label: 'Titre', type: 'text', placeholder: 'The retail you practice is dead.' },
        { id: 'subtitle', label: 'Sous-titre', type: 'text' },
        { id: 'description', label: 'Description', type: 'textarea' },
        { id: 'hero_image', label: 'Image de fond', type: 'image' },
      ]},
      { id: 'intro', name: '📝 Introduction', collapsed: true, fields: [
        { id: 'intro_title', label: 'Titre intro', type: 'text' },
        { id: 'intro_content', label: 'Contenu', type: 'html' },
      ]},
    ]
  },
};

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
];

const PAGES = Object.entries(PAGE_SECTIONS).map(([id, data]) => ({
  id,
  name: data.name,
  url: data.url
}));

function CMSManager() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [language, setLanguage] = useState('fr');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [activeTab, setActiveTab] = useState('editor');
  const [hasChanges, setHasChanges] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

  const currentPageData = PAGE_SECTIONS[selectedPage];
  const previewUrl = `${SITE_URL}${currentPageData?.url || '/'}${language !== 'fr' ? `?lang=${language}` : ''}`;

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
      setContent(res.data.content || res.data || {});
      setHasChanges(false);
    } catch (error) {
      setContent({});
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API_URL}/api/pages/update-flat`, {
        page: selectedPage,
        language: language,
        ...content
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

  const handleFieldChange = (fieldId, value) => {
    setContent(prev => ({ ...prev, [fieldId]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = async (fieldId, file) => {
    if (!file) return;
    setUploadingField(fieldId);
    
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cms');
      
      const res = await axios.post(`${API_URL}/api/admin/media/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      handleFieldChange(fieldId, res.data.url);
      toast.success('Image uploadée !');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur d'upload - utilisez une URL directe");
    } finally {
      setUploadingField(null);
    }
  };

  const toggleSection = (sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
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
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // Rendu d'un champ selon son type
  const renderField = (field) => {
    const value = content[field.id] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
          />
        );
      
      case 'html':
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={(val) => handleFieldChange(field.id, val)}
              modules={quillModules}
              className="bg-white"
              style={{ minHeight: '200px' }}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-3">
            {/* Prévisualisation de l'image */}
            {value && (
              <div className="relative inline-block">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="max-w-xs max-h-48 rounded-lg border border-gray-300 object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <button
                  onClick={() => handleFieldChange(field.id, '')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Input URL */}
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder="https://... ou uploadez une image"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Bouton upload */}
              <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                uploadingField === field.id 
                  ? 'bg-gray-300 cursor-wait' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                {uploadingField === field.id ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{uploadingField === field.id ? 'Upload...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(field.id, e.target.files[0])}
                  disabled={uploadingField === field.id}
                />
              </label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const currentPage = PAGES.find(p => p.id === selectedPage);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl">✏️</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Éditeur CMS Complet</h1>
                <p className="text-sm text-gray-500">Modifiez textes, images et contenus</p>
              </div>
            </div>

            {/* Page & Language Selectors */}
            <div className="flex items-center gap-3">
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                {PAGES.map(page => (
                  <option key={page.id} value={page.id}>{page.name}</option>
                ))}
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500"
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
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Éditer
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4" />
                Aperçu
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                hasChanges 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Sauvegarde...' : hasChanges ? 'Sauvegarder' : 'Sauvegardé'}
            </button>
          </div>
        </div>

        {/* Device Selector (for preview mode) */}
        {activeTab === 'preview' && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-center gap-2">
            {[
              { mode: 'desktop', Icon: Monitor, label: 'Desktop' },
              { mode: 'tablet', Icon: Tablet, label: 'Tablet' },
              { mode: 'mobile', Icon: Smartphone, label: 'Mobile' },
            ].map(device => (
              <button
                key={device.mode}
                onClick={() => setPreviewMode(device.mode)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition ${
                  previewMode === device.mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <device.Icon className="w-4 h-4" />
                {device.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'editor' ? (
        /* Editor View */
        <div className="max-w-5xl mx-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Page Info Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{currentPageData?.name}</h2>
                    <p className="opacity-90">
                      {LANGUAGES.find(l => l.code === language)?.flag} Version {LANGUAGES.find(l => l.code === language)?.name}
                    </p>
                  </div>
                  <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Voir en ligne
                  </a>
                </div>
              </div>

              {/* Sections */}
              {currentPageData?.sections?.map(section => {
                const isCollapsed = collapsedSections[section.id] ?? section.collapsed;
                
                return (
                  <div 
                    key={section.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Section Header - Cliquable */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                    >
                      <span className="font-semibold text-gray-800 text-lg">{section.name}</span>
                      {isCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {/* Section Content */}
                    {!isCollapsed && (
                      <div className="p-5 space-y-5 border-t border-gray-200">
                        {section.fields.map(field => (
                          <div key={field.id} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              {field.type === 'image' && <Image className="w-4 h-4 text-blue-500" />}
                              {field.type === 'text' && <Type className="w-4 h-4 text-green-500" />}
                              {field.type === 'textarea' && <AlignLeft className="w-4 h-4 text-orange-500" />}
                              {field.type === 'html' && <span className="text-purple-500">📝</span>}
                              {field.label}
                            </label>
                            {renderField(field)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Help Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Comment utiliser l'éditeur</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Cliquez sur les sections pour les développer/replier</li>
                  <li>• Modifiez les textes directement dans les champs</li>
                  <li>• Pour les images: collez une URL ou uploadez un fichier</li>
                  <li>• N'oubliez pas de <strong>Sauvegarder</strong> après vos modifications</li>
                  <li>• Changez de langue pour éditer les traductions</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Preview View */
        <div className="flex justify-center bg-gray-300 p-6" style={{ minHeight: 'calc(100vh - 180px)' }}>
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
            style={{ width: getPreviewWidth(), maxWidth: '100%' }}
          >
            <div className="bg-gray-800 text-white text-xs px-3 py-2 flex items-center justify-between">
              <span className="truncate">{previewUrl}</span>
              <a 
                href={previewUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-300 ml-2"
              >
                ↗️
              </a>
            </div>
            <iframe
              src={previewUrl}
              className="w-full border-0"
              style={{ height: 'calc(100vh - 220px)', minHeight: '600px' }}
              title="Page Preview"
            />
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <a href="/admin/crm/blog" className="text-blue-600 hover:underline flex items-center gap-2">
              📝 Gérer le Blog & FAQ
            </a>
            <span className="text-gray-400">|</span>
            <a href="/admin/media" className="text-blue-600 hover:underline flex items-center gap-2">
              🖼️ Bibliothèque Media
            </a>
          </div>
          <div className="text-sm">
            {hasChanges ? (
              <span className="text-orange-600 font-medium flex items-center gap-2">
                ⚠️ Modifications non enregistrées
              </span>
            ) : (
              <span className="text-green-600">✓ Tout est sauvegardé</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CMSManager;
