import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

function CMSManager() {
  const { t, i18n } = useTranslation();
  
  // États
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('home');
  const [language, setLanguage] = useState(i18n.language || 'fr');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  // Charger la liste des pages au montage
  useEffect(() => {
    loadPages();
    loadMedia();
  }, []);
  
  // Charger le contenu quand page ou langue change
  useEffect(() => {
    if (selectedPage && language) {
      loadPageContent(selectedPage, language);
    }
  }, [selectedPage, language]);
  
  // Synchroniser avec i18n
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);
  
  // Fonctions API
  const loadPages = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/pages/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(res.data.pages || []);
      if (res.data.pages.length > 0 && !selectedPage) {
        setSelectedPage(res.data.pages[0].page);
      }
    } catch (error) {
      console.error('Erreur chargement pages:', error);
      toast.error('Erreur de chargement des pages');
    }
  };
  
  const loadPageContent = async (page, lang) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(
        `${API_URL}/api/pages/${page}?language=${lang}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent(res.data.content?.main?.html || '');
    } catch (error) {
      console.error('Erreur chargement contenu:', error);
      setContent('');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        `${API_URL}/api/pages/update`,
        {
          page: selectedPage,
          language: language,
          section: 'main',
          content: { html: content }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t('cms.saved', 'Sauvegardé avec succès'));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error(t('cms.error', 'Erreur de sauvegarde'));
    } finally {
      setSaving(false);
    }
  };
  
  const loadMedia = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/admin/media/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedia(res.data.media || []);
    } catch (error) {
      console.error('Erreur chargement médias:', error);
    }
  };
  
  const handleMediaUpload = async (files) => {
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.post(
          `${API_URL}/api/admin/media/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success(`Image ${file.name} uploadée`);
        loadMedia(); // Recharger la liste
      } catch (error) {
        console.error('Erreur upload:', error);
        toast.error(`Erreur upload ${file.name}`);
      }
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleMediaUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10485760 // 10MB
  });
  
  // Configuration Quill
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };
  
  return (
    <div className="cms-manager min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('cms.title', 'Gestionnaire de Contenu')}
        </h1>
        <p className="text-gray-600">
          {t('cms.subtitle', 'Éditez le contenu de vos pages en temps réel')}
        </p>
      </div>
      
      {/* Toolbar */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Sélecteur de page */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cms.page', 'Page')}
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              {pages.map((page) => (
                <option key={page.page} value={page.page}>
                  {page.page.charAt(0).toUpperCase() + page.page.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sélecteur de langue */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('cms.language', 'Langue')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="he">🇮🇱 עברית</option>
            </select>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-2 items-end">
            <button
              onClick={() => setShowMediaLibrary(!showMediaLibrary)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              📁 {t('cms.media', 'Médias')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Bibliothèque média (modal) */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Bibliothèque Média</h2>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Zone de drop */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {isDragActive
                  ? '📥 Déposez vos images ici...'
                  : '📤 Glissez-déposez des images ou cliquez pour sélectionner'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF, WebP - Max 10MB
              </p>
            </div>
            
            {/* Grille d'images */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {media.map((item) => (
                <div
                  key={item.filename}
                  className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        toast.success('URL copiée !');
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded text-sm"
                    >
                      Copier URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Éditeur */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-gray-500">⏳ Chargement...</div>
          </div>
        ) : (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            className="h-[600px]"
          />
        )}
      </div>
    </div>
  );
}

export default CMSManager;
