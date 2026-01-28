import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

const BlogArticle = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadArticle();
  }, [slug, i18n.language]);
  
  const loadArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/blog/articles/${slug}?language=${i18n.language}`);
      setArticle(res.data);
    } catch (err) {
      console.error('Error loading article:', err);
      setError(err.response?.status === 404 ? 'Article non trouvé' : 'Erreur de chargement');
    } finally {
      setLoading(false);
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
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading', 'Chargement...')}</p>
        </div>
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Article non trouvé'}</h1>
          <Link to="/blog" className="text-blue-600 hover:underline">
            ← {t('blog.backToList', 'Retour au blog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | IGV Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
      </Helmet>
      
      <article className="min-h-screen pt-24 pb-12 bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition"
            >
              ← {t('blog.backToList', 'Retour au blog')}
            </Link>
            
            <div className="text-blue-200 text-sm font-semibold mb-3 uppercase tracking-wide">
              {article.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-blue-200">
              <span>📅 {formatDate(article.published_at || article.created_at)}</span>
              {article.author && <span>✍️ {article.author}</span>}
              {article.views > 0 && <span>👁 {article.views} vues</span>}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Featured Image */}
            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            
            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200">
              {article.excerpt}
            </p>
            
            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* CTA */}
          <div className="mt-8 bg-blue-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">
              {t('blog.ctaTitle')}
            </h3>
            <p className="mb-4 text-blue-100">
              {t('blog.ctaDesc')}
            </p>
            <Link 
              to="/mini-analyse"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition"
            >
              {t('blog.ctaButton')}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogArticle;
