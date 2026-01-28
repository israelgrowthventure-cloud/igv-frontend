import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

// Articles par défaut (même design que FutureCommerce original)
const defaultArticles = [
  {
    _id: '1',
    title: "L'IA dans le retail israélien en 2026",
    slug: 'ia-retail-israelien-2026',
    excerpt: "Comment l'intelligence artificielle transforme l'expérience client dans les centres commerciaux de Tel Aviv.",
    category: 'Retail Tech',
    color: 'blue',
    date: '27 Jan 2026'
  },
  {
    _id: '2',
    title: 'Ouvrir son réseau en Israël : Guide Complet',
    slug: 'ouvrir-reseau-israel-guide',
    excerpt: "Les étapes clés pour réussir son implantation de franchise sur le marché local.",
    category: 'Expansion',
    color: 'indigo',
    date: '15 Jan 2026'
  },
  {
    _id: '3',
    title: "L'essor des Food Courts Premium",
    slug: 'essor-food-courts-premium',
    excerpt: "Analyse du changement des habitudes de consommation post-2025.",
    category: 'Success Story',
    color: 'purple',
    date: '03 Jan 2026'
  }
];

// FAQ par défaut
const defaultFAQ = [
  {
    question: "Comment IGV peut m'aider à m'implanter en Israël ?",
    answer: "IGV vous accompagne de A à Z : étude de marché, recherche de partenaires locaux, négociation de baux commerciaux et lancement opérationnel."
  },
  {
    question: "Combien de temps faut-il pour ouvrir en Israël ?",
    answer: "En moyenne 6 à 12 mois selon la complexité du projet et le secteur d'activité."
  },
  {
    question: "Quels secteurs sont porteurs en Israël ?",
    answer: "La restauration, la mode, les cosmétiques et le retail tech connaissent une forte croissance."
  }
];

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState(defaultArticles);
  const [faqItems, setFaqItems] = useState(defaultFAQ);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
    loadFAQ();
  }, [i18n.language]);

  const loadArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blog/articles?language=${i18n.language}`);
      if (res.data.articles && res.data.articles.length > 0) {
        const formattedArticles = res.data.articles.map((article, index) => ({
          ...article,
          color: ['blue', 'indigo', 'purple'][index % 3],
          date: new Date(article.created_at).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        }));
        setArticles(formattedArticles);
      }
    } catch (error) {
      console.log('Using default articles');
    } finally {
      setLoading(false);
    }
  };

  const loadFAQ = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blog/faq?language=${i18n.language}`);
      if (res.data.items && res.data.items.length > 0) {
        setFaqItems(res.data.items);
      }
    } catch (error) {
      console.log('Using default FAQ');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('futureCommerce.title', 'IGV Blog')} | Israel Growth Venture</title>
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
               {t('futureCommerce.title', 'Le Blog IGV')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
               {t('futureCommerce.subtitle', 'Actualités, Tendances et Innovations Retail en Israël')}
            </p>
          </div>

          {/* Main Content: Blog + FAQ Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Grid - Left Side */}
            <div className="lg:w-2/3">
              <div className="grid md:grid-cols-2 gap-8">
                {articles.map((article, index) => {
                  const colors = ['blue', 'indigo', 'purple'];
                  const colorClass = colors[index % 3];
                  
                  return (
                    <Link 
                      key={article._id} 
                      to={article.slug ? `/future-commerce/${article.slug}` : '#'}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className={`h-48 ${colorClass === 'blue' ? 'bg-blue-600' : colorClass === 'indigo' ? 'bg-indigo-600' : 'bg-purple-600'} flex items-center justify-center text-white text-4xl font-bold`}>
                        {article.image_url ? (
                          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                          'IGV'
                        )}
                      </div>
                      <div className="p-6">
                        <div className={`text-sm ${colorClass === 'blue' ? 'text-blue-600' : colorClass === 'indigo' ? 'text-indigo-600' : 'text-purple-600'} font-semibold mb-2`}>
                          {article.category}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {article.excerpt}
                        </p>
                        <span className="text-sm text-gray-400">{article.date}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* FAQ Sidebar - Right Side */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">❓</span>
                  FAQ
                </h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full text-left font-semibold text-gray-800 hover:text-blue-600 transition flex justify-between items-start"
                      >
                        <span className="pr-4">{item.question}</span>
                        <span className="text-blue-600 flex-shrink-0">
                          {openFaq === index ? '−' : '+'}
                        </span>
                      </button>
                      {openFaq === index && (
                        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/mini-analyse"
                    className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    🚀 {t('blog.ctaButton', 'Demander une Mini-Analyse')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
