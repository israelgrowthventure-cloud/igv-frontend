import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

function BlogManager() {
  // Tabs
  const [activeTab, setActiveTab] = useState('articles');
  
  // Articles state
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [savingArticle, setSavingArticle] = useState(false);
  
  // FAQ state
  const [faqItems, setFaqItems] = useState([]);
  const [loadingFaq, setLoadingFaq] = useState(true);
  const [showFaqEditor, setShowFaqEditor] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [savingFaq, setSavingFaq] = useState(false);
  
  // Article form
  const [articleForm, setArticleForm] = useState({
    title: '', excerpt: '', content: '', category: 'General',
    language: 'fr', published: false, tags: '', image_url: ''
  });
  
  // FAQ form
  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', language: 'fr', published: true, order: 0
  });
  
  const categories = ['General', 'Retail Tech', 'Expansion', 'Success Story', 'Actualités', 'Conseils', 'Interviews'];

  useEffect(() => {
    loadArticles();
    loadFaq();
  }, []);

  // ==================== ARTICLES ====================
  const loadArticles = async () => {
    setLoadingArticles(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/blog/admin/articles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '', excerpt: '', content: '', category: 'General',
      language: 'fr', published: false, tags: '', image_url: ''
    });
    setShowArticleEditor(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'General',
      language: article.language || 'fr',
      published: article.published || false,
      tags: (article.tags || []).join(', '),
      image_url: article.image_url || ''
    });
    setShowArticleEditor(true);
  };

  const handleSaveArticle = async () => {
    if (!articleForm.title.trim() || !articleForm.excerpt.trim()) {
      toast.error('Titre et extrait obligatoires');
      return;
    }
    setSavingArticle(true);
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        ...articleForm,
        tags: articleForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      if (editingArticle) {
        await axios.put(`${API_URL}/api/blog/admin/articles/${editingArticle._id}`, payload,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Article mis à jour');
      } else {
        await axios.post(`${API_URL}/api/blog/admin/articles`, payload,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Article créé');
      }
      setShowArticleEditor(false);
      loadArticles();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_URL}/api/blog/admin/articles/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Article supprimé');
      loadArticles();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(`${API_URL}/api/blog/admin/articles/${article._id}/publish`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(res.data.published ? 'Publié' : 'Dépublié');
      loadArticles();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const seedArticles = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(`${API_URL}/api/blog/admin/seed`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${res.data.seeded} articles créés`);
      loadArticles();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  // ==================== FAQ ====================
  const loadFaq = async () => {
    setLoadingFaq(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API_URL}/api/blog/admin/faq`,
        { headers: { Authorization: `Bearer ${token}` } });
      setFaqItems(res.data.items || []);
    } catch (error) {
      console.error('Error loading FAQ:', error);
    } finally {
      setLoadingFaq(false);
    }
  };

  const handleNewFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '', language: 'fr', published: true, order: faqItems.length });
    setShowFaqEditor(true);
  };

  const handleEditFaq = (item) => {
    setEditingFaq(item);
    setFaqForm({
      question: item.question || '',
      answer: item.answer || '',
      language: item.language || 'fr',
      published: item.published !== false,
      order: item.order || 0
    });
    setShowFaqEditor(true);
  };

  const handleSaveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Question et réponse obligatoires');
      return;
    }
    setSavingFaq(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (editingFaq) {
        await axios.put(`${API_URL}/api/blog/admin/faq/${editingFaq._id}`, faqForm,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('FAQ mise à jour');
      } else {
        await axios.post(`${API_URL}/api/blog/admin/faq`, faqForm,
          { headers: { Authorization: `Bearer ${token}` } });
        toast.success('FAQ créée');
      }
      setShowFaqEditor(false);
      loadFaq();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Supprimer cette FAQ ?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API_URL}/api/blog/admin/faq/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('FAQ supprimée');
      loadFaq();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const seedFaq = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.post(`${API_URL}/api/blog/admin/faq/seed`, {},
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`${res.data.seeded} FAQ créées`);
      loadFaq();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📝 Blog & FAQ</h1>
          <p className="text-gray-600">Gérez vos articles de blog et questions fréquentes</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 px-4 font-medium ${activeTab === 'articles' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            📰 Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-3 px-4 font-medium ${activeTab === 'faq' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
          >
            ❓ FAQ ({faqItems.length})
          </button>
        </div>

        {/* ==================== ARTICLES TAB ==================== */}
        {activeTab === 'articles' && (
          <>
            {/* Actions */}
            <div className="flex justify-end gap-3 mb-4">
              {articles.length === 0 && (
                <button onClick={seedArticles} className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                  🌱 Générer exemples
                </button>
              )}
              <button onClick={handleNewArticle} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                ➕ Nouvel Article
              </button>
            </div>

            {/* Article Editor Modal */}
            {showArticleEditor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">{editingArticle ? 'Modifier' : 'Nouvel'} Article</h2>
                      <button onClick={() => setShowArticleEditor(false)} className="text-2xl text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                        <input type="text" value={articleForm.title} onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Titre de l'article" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extrait *</label>
                        <textarea value={articleForm.excerpt} onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2" rows={2} placeholder="Résumé court" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                          <select value={articleForm.category} onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                          <select value={articleForm.language} onChange={(e) => setArticleForm({...articleForm, language: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="fr">🇫🇷 Français</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="he">🇮🇱 עברית</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <ReactQuill theme="snow" value={articleForm.content} onChange={(v) => setArticleForm({...articleForm, content: v})}
                          modules={quillModules} className="bg-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pub" checked={articleForm.published} 
                          onChange={(e) => setArticleForm({...articleForm, published: e.target.checked})} />
                        <label htmlFor="pub">Publier immédiatement</label>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => setShowArticleEditor(false)} className="px-4 py-2 border rounded-md">Annuler</button>
                        <button onClick={handleSaveArticle} disabled={savingArticle}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                          {savingArticle ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Articles List */}
            {loadingArticles ? (
              <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
            ) : articles.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-2">Aucun article</h3>
                <p className="text-gray-600">Créez votre premier article ou générez des exemples.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Langue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {articles.map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{a.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{a.category}</td>
                        <td className="px-6 py-4">{a.language === 'fr' ? '🇫🇷' : a.language === 'en' ? '🇬🇧' : '🇮🇱'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${a.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {a.published ? 'Publié' : 'Brouillon'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleTogglePublish(a)} className={`px-2 py-1 text-xs rounded ${a.published ? 'bg-yellow-100' : 'bg-green-100'}`}>
                              {a.published ? 'Dépublier' : 'Publier'}
                            </button>
                            <button onClick={() => handleEditArticle(a)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Éditer</button>
                            <button onClick={() => handleDeleteArticle(a._id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">Suppr.</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ==================== FAQ TAB ==================== */}
        {activeTab === 'faq' && (
          <>
            {/* Actions */}
            <div className="flex justify-end gap-3 mb-4">
              {faqItems.length === 0 && (
                <button onClick={seedFaq} className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                  🌱 Générer exemples
                </button>
              )}
              <button onClick={handleNewFaq} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                ➕ Nouvelle Question
              </button>
            </div>

            {/* FAQ Editor Modal */}
            {showFaqEditor && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">{editingFaq ? 'Modifier' : 'Nouvelle'} FAQ</h2>
                      <button onClick={() => setShowFaqEditor(false)} className="text-2xl text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                        <input type="text" value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Ex: Comment IGV peut m'aider ?" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Réponse *</label>
                        <textarea value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2" rows={4} placeholder="La réponse détaillée..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                          <select value={faqForm.language} onChange={(e) => setFaqForm({...faqForm, language: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2">
                            <option value="fr">🇫🇷 Français</option>
                            <option value="en">🇬🇧 English</option>
                            <option value="he">🇮🇱 עברית</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                          <input type="number" value={faqForm.order} onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="faqpub" checked={faqForm.published}
                          onChange={(e) => setFaqForm({...faqForm, published: e.target.checked})} />
                        <label htmlFor="faqpub">Publier</label>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <button onClick={() => setShowFaqEditor(false)} className="px-4 py-2 border rounded-md">Annuler</button>
                        <button onClick={handleSaveFaq} disabled={savingFaq}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
                          {savingFaq ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ List */}
            {loadingFaq ? (
              <div className="text-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
            ) : faqItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-6xl mb-4">❓</div>
                <h3 className="text-xl font-semibold mb-2">Aucune FAQ</h3>
                <p className="text-gray-600">Ajoutez votre première question ou générez des exemples.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold text-gray-900">{item.question}</span>
                          <span className="text-sm">{item.language === 'fr' ? '🇫🇷' : item.language === 'en' ? '🇬🇧' : '🇮🇱'}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {item.published ? 'Publié' : 'Masqué'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.answer}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handleEditFaq(item)} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          Éditer
                        </button>
                        <button onClick={() => handleDeleteFaq(item._id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                          Suppr.
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogManager;
