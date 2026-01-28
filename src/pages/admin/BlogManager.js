import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

function BlogManager() {
  const { t } = useTranslation();
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'General',
    language: 'fr',
    published: false,
    tags: '',
    image_url: ''
  });
  
  const categories = [
    'General',
    'Retail Tech',
    'Expansion',
    'Success Story',
    'Actualités',
    'Conseils',
    'Interviews'
  ];
  
  useEffect(() => {
    loadArticles();
  }, []);
  
  const loadArticles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/blog/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Erreur de chargement des articles');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNew = () => {
    setEditingArticle(null);
    setForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'General',
      language: 'fr',
      published: false,
      tags: '',
      image_url: ''
    });
    setShowEditor(true);
  };
  
  const handleEdit = (article) => {
    setEditingArticle(article);
    setForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'General',
      language: article.language || 'fr',
      published: article.published || false,
      tags: (article.tags || []).join(', '),
      image_url: article.image_url || ''
    });
    setShowEditor(true);
  };
  
  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (editingArticle) {
        await axios.put(
          `${API_URL}/api/blog/admin/articles/${editingArticle._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Article mis à jour');
      } else {
        await axios.post(
          `${API_URL}/api/blog/admin/articles`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Article créé');
      }
      
      setShowEditor(false);
      loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async (articleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_URL}/api/blog/admin/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Article supprimé');
      loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Erreur lors de la suppression');
    }
  };
  
  const handleTogglePublish = async (article) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(
        `${API_URL}/api/blog/admin/articles/${article._id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.published ? 'Article publié' : 'Article dépublié');
      loadArticles();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Erreur');
    }
  };
  
  const seedArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(
        `${API_URL}/api/blog/admin/seed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`${res.data.seeded} articles exemples créés`);
      loadArticles();
    } catch (error) {
      console.error('Error seeding:', error);
      toast.error('Erreur lors du seed');
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📝 Gestionnaire d'Articles
            </h1>
            <p className="text-gray-600">Créez et gérez vos articles de blog</p>
          </div>
          <div className="flex gap-3">
            {articles.length === 0 && (
              <button
                onClick={seedArticles}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                🌱 Générer exemples
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ➕ Nouvel Article
            </button>
          </div>
        </div>
        
        {/* Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
                  </h2>
                  <button
                    onClick={() => setShowEditor(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Titre de l'article"
                    />
                  </div>
                  
                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extrait / Résumé *
                    </label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm({...form, excerpt: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      rows={2}
                      placeholder="Courte description affichée dans la liste"
                    />
                  </div>
                  
                  {/* Category & Language */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({...form, category: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Langue
                      </label>
                      <select
                        value={form.language}
                        onChange={(e) => setForm({...form, language: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="fr">🇫🇷 Français</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="he">🇮🇱 עברית</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Tags & Image */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (séparés par virgule)
                      </label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => setForm({...form, tags: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Retail, Tech, Israel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Image (optionnel)
                      </label>
                      <input
                        type="text"
                        value={form.image_url}
                        onChange={(e) => setForm({...form, image_url: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu *
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={form.content}
                      onChange={(value) => setForm({...form, content: value})}
                      modules={quillModules}
                      className="bg-white"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                  
                  {/* Published */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={form.published}
                      onChange={(e) => setForm({...form, published: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700">
                      Publier immédiatement
                    </label>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowEditor(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun article
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par créer votre premier article ou générez des exemples.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={seedArticles}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                🌱 Générer exemples
              </button>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ➕ Créer un article
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Langue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {article.language === 'fr' ? '🇫🇷' : article.language === 'en' ? '🇬🇧' : '🇮🇱'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.views || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`px-3 py-1 text-sm rounded ${
                            article.published
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {article.published ? 'Dépublier' : 'Publier'}
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Suppr.
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogManager;
