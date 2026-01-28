import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

// Color mapping for categories
const categoryColors = {
  'General': 'bg-gray-600',
  'Retail Tech': 'bg-blue-600',
  'Expansion': 'bg-indigo-600',
  'Success Story': 'bg-purple-600',
  'Actualités': 'bg-green-600',
  'Conseils': 'bg-orange-600',
  'Interviews': 'bg-pink-600'
};

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  useEffect(() => {
    loadArticles();
    loadCategories();
  }, [i18n.language, selectedCategory]);
  
  const loadArticles = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/blog/articles?language=${i18n.language}`;
      if (selectedCategory) {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await axios.get(url);
      setArticles(res.data.articles || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blog/categories?language=${i18n.language}`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'he' ? 'he-IL' : i18n.language === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('blog.title', 'Blog IGV')} | Israel Growth Venture</title>
        <meta name="description" content={t('blog.metaDescription', 'Actualités, tendances et conseils pour réussir votre expansion en Israël')} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('blog.title', 'Le Blog IGV')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('blog.subtitle', 'Actualités, Tendances et Innovations Retail en Israël')}
            </p>
          </div>
          
          {/* Categories Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !selectedCategory 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {t('blog.allCategories', 'Toutes')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}
          
          {/* Loading */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('common.loading', 'Chargement...')}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t('blog.noArticles', 'Aucun article disponible')}
              </h3>
              <p className="text-gray-600">
                {t('blog.noArticlesDesc', 'Les articles seront bientôt disponibles.')}
              </p>
            </div>
          ) : (
            /* Blog Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  to={`/blog/${article.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className={`h-48 ${categoryColors[article.category] || 'bg-blue-600'} flex items-center justify-center text-white`}>
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold opacity-80">IGV</span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className={`text-sm font-semibold mb-2 ${
                      categoryColors[article.category]?.replace('bg-', 'text-') || 'text-blue-600'
                    }`}>
                      {article.category}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{formatDate(article.created_at)}</span>
                      {article.views > 0 && (
                        <span>👁 {article.views}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
