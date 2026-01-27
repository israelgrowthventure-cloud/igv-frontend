import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const FutureCommerce = () => {
  const { t } = useTranslation();

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

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Article 1 */}
             <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                   IGV
                </div>
                <div className="p-6">
                   <div className="text-sm text-blue-600 font-semibold mb-2">Retail Tech</div>
                   <h3 className="text-xl font-bold mb-3">L'IA dans le retail israélien en 2026</h3>
                   <p className="text-gray-600 text-sm mb-4">
                      Comment l'intelligence artificielle transforme l'expérience client dans les centres commerciaux de Tel Aviv.
                   </p>
                   <span className="text-sm text-gray-400">27 Jan 2026</span>
                </div>
             </div>

             {/* Article 2 */}
             <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                   IGV
                </div>
                <div className="p-6">
                   <div className="text-sm text-indigo-600 font-semibold mb-2">Expansion</div>
                   <h3 className="text-xl font-bold mb-3">Ouvrir son réseau en Israël : Guide Complet</h3>
                   <p className="text-gray-600 text-sm mb-4">
                      Les étapes clés pour réussir son implantation de franchise sur le marché local.
                   </p>
                   <span className="text-sm text-gray-400">15 Jan 2026</span>
                </div>
             </div>

             {/* Article 3 */}
             <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                   IGV
                </div>
                <div className="p-6">
                   <div className="text-sm text-purple-600 font-semibold mb-2">Success Story</div>
                   <h3 className="text-xl font-bold mb-3">L'essor des Food Courts Premium</h3>
                   <p className="text-gray-600 text-sm mb-4">
                      Analyse du changement des habitudes de consommation post-2025.
                   </p>
                   <span className="text-sm text-gray-400">03 Jan 2026</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FutureCommerce;
