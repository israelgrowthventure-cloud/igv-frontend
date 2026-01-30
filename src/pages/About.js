import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Building, Users, Target } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-cms-backend.onrender.com';

const About = () => {
  const { t, i18n } = useTranslation();
  const [cmsContent, setCmsContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCmsContent = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pages/about?language=${i18n.language}`);
        setCmsContent(response.data);
      } catch (error) {
        console.error('Failed to load CMS content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCmsContent();
  }, [i18n.language]);
  
  return (
    <>
      <Helmet>
        <title>{t('about.title')} | Israel Growth Venture</title>
        <meta name="description" content={t('about.description')} />
        <link rel="canonical" href="https://israelgrowthventure.com/about" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {cmsContent?.title || t('about.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {cmsContent?.intro || t('about.description')}
            </p>
          </div>

          {/* What we do */}
          <section className="mb-16">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: cmsContent?.mission || t('about.collaboration') }} />
              <div className="text-gray-700 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: cmsContent?.team || t('about.support') }} />
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">{t('home.aiInsight.cta')}</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {t('home.aiInsight.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/mini-analyse"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
              >
                {t('nav.miniAnalysis')}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all border-2 border-blue-400"
              >
                {t('nav.contact')}
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
