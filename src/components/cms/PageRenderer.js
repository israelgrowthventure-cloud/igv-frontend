import React from 'react';

/**
 * PageRenderer - Affiche la VRAIE page complète avec design, images, etc.
 * Modes:
 * - editable=false: Mode preview (lecture seule)
 * - editable=true: Mode édition inline avec data-cms-key
 */
const PageRenderer = ({ page, language, content, editable = false, onEdit }) => {
  
  const getEditableProps = (key) => {
    if (!editable) return {};
    return {
      'data-cms-key': key,
      'contentEditable': true,
      'suppressContentEditableWarning': true,
      'onBlur': (e) => onEdit && onEdit(key, e.currentTarget.textContent),
      'className': 'cms-editable cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:bg-yellow-50 transition-all',
      style: { minHeight: '1em' }, // Pour que les champs vides restent cliquables
    };
  };

  // Rendu pour la page HOME - Design complet avec images
  if (page === 'home') {
    return (
      <div className="w-full min-h-screen bg-white">
        {/* Hero Section - Design premium */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 -z-10" />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                  {...getEditableProps('hero_title')}
                >
                  {content.hero_title || 'Développez votre business en Israël'}
                </h1>
                <p 
                  className="text-xl text-gray-600 mb-4 font-medium"
                  {...getEditableProps('hero_subtitle')}
                >
                  {content.hero_subtitle || 'Expertise commerciale et stratégique'}
                </p>
                <p 
                  className="text-base text-gray-600 mb-8 leading-relaxed"
                  {...getEditableProps('hero_description')}
                >
                  {content.hero_description || 'IGV accompagne les entreprises...'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                    {content.hero_cta || 'Demander une mini-analyse'}
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Image Hero avec badge */}
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop"
                  alt="Business en Israël"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">20+</div>
                      <div className="text-sm text-gray-600">Années d'expérience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Cards avec icônes */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                {...getEditableProps('services_title')}
              >
                {content.services_title || 'Nos Services'}
              </h2>
              <p 
                className="text-xl text-gray-600"
                {...getEditableProps('services_subtitle')}
              >
                {content.services_subtitle || 'Une approche complète'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service1_title')}
                >
                  {content.service1_title || 'Étude de Marché'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service1_description')}
                >
                  {content.service1_description || 'Analyse approfondie...'}
                </p>
              </div>
              
              {/* Service 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service2_title')}
                >
                  {content.service2_title || 'Développement Commercial'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service2_description')}
                >
                  {content.service2_description || 'Prospection ciblée...'}
                </p>
              </div>
              
              {/* Service 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service3_title')}
                >
                  {content.service3_title || 'Partenariats Stratégiques'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service3_description')}
                >
                  {content.service3_description || 'Identification...'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Gradient premium */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 
              className="text-3xl sm:text-4xl font-bold mb-6 text-white"
              {...getEditableProps('cta_title')}
            >
              {content.cta_title || 'Prêt à développer votre activité ?'}
            </h2>
            <p 
              className="text-xl mb-8 text-blue-100"
              {...getEditableProps('cta_subtitle')}
            >
              {content.cta_subtitle || 'Obtenez une mini-analyse gratuite'}
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-xl">
              {content.cta_button || 'Demander ma mini-analyse'}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Rendu pour LEGAL
  if (page === 'legal') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 
            className="text-4xl font-bold mb-8 text-gray-900"
            {...getEditableProps('legal_title')}
          >
            {content.legal_title || 'Mentions Légales'}
          </h1>
          <div 
            className="prose prose-lg max-w-none"
            {...getEditableProps('legal_content')}
            dangerouslySetInnerHTML={{ __html: content.legal_content || '<p>Contenu légal...</p>' }}
          />
        </div>
      </div>
    );
  }

  // Rendu pour ABOUT
  if (page === 'about') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <h1
            className="text-4xl font-bold mb-6 text-gray-900"
            {...getEditableProps('about_title')}
          >
            {content.about_title || 'À Propos d\'IGV'}
          </h1>
          <div
            className="prose prose-lg max-w-none text-gray-700"
            {...getEditableProps('about_content')}
            dangerouslySetInnerHTML={{ __html: content.about_content || '<p>Contenu à propos...</p>' }}
          />
        </div>
      </div>
    );
  }

  // Rendu pour CONTACT
  if (page === 'contact') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1
            className="text-4xl font-bold mb-6 text-gray-900"
            {...getEditableProps('contact_title')}
          >
            {content.contact_title || 'Contactez-nous'}
          </h1>
          <p
            className="text-lg text-gray-600 mb-8"
            {...getEditableProps('contact_intro')}
          >
            {content.contact_intro || 'Nous sommes là pour vous aider.'}
          </p>
          <div className="bg-gray-50 rounded-xl p-8">
            <p className="text-gray-500 text-center">Formulaire de contact</p>
          </div>
        </div>
      </div>
    );
  }

  // Rendu pour PACKS
  if (page === 'packs') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <h1
            className="text-4xl font-bold mb-4 text-gray-900 text-center"
            {...getEditableProps('packs_title')}
          >
            {content.packs_title || 'Nos Packs & Offres'}
          </h1>
          <p
            className="text-xl text-center text-gray-600 mb-12"
            {...getEditableProps('packs_subtitle')}
          >
            {content.packs_subtitle || 'Choisissez la formule adaptée à vos besoins'}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3
                  className="text-xl font-bold mb-2 text-gray-900"
                  {...getEditableProps(`pack${i}_name`)}
                >
                  {content[`pack${i}_name`] || `Pack ${i}`}
                </h3>
                <div
                  className="text-3xl font-bold text-blue-600 mb-4"
                  {...getEditableProps(`pack${i}_price`)}
                >
                  {content[`pack${i}_price`] || 'Sur devis'}
                </div>
                <div
                  className="text-gray-600 text-sm"
                  {...getEditableProps(`pack${i}_description`)}
                >
                  {content[`pack${i}_description`] || 'Description du pack'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Rendu pour MINI-ANALYSE
  if (page === 'mini-analyse') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1
            className="text-4xl font-bold mb-6 text-gray-900 text-center"
            {...getEditableProps('mini_analyse_title')}
          >
            {content.mini_analyse_title || 'Mini-Analyse Gratuite'}
          </h1>
          <p
            className="text-xl text-center text-gray-600 mb-12"
            {...getEditableProps('mini_analyse_subtitle')}
          >
            {content.mini_analyse_subtitle || 'Découvrez le potentiel de votre marché en Israël'}
          </p>
          <div
            className="prose prose-lg max-w-none"
            {...getEditableProps('mini_analyse_content')}
            dangerouslySetInnerHTML={{ __html: content.mini_analyse_content || '<p>Contenu de la mini-analyse...</p>' }}
          />
        </div>
      </div>
    );
  }

  // Rendu pour FUTURE-COMMERCE
  if (page === 'future-commerce') {
    return (
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <h1
            className="text-4xl font-bold mb-6 text-gray-900 text-center"
            {...getEditableProps('future_title')}
          >
            {content.future_title || 'Commerce du Futur'}
          </h1>
          <div
            className="prose prose-lg max-w-none"
            {...getEditableProps('future_content')}
            dangerouslySetInnerHTML={{ __html: content.future_content || '<p>Contenu commerce du futur...</p>' }}
          />
        </div>
      </div>
    );
  }

  // Rendu par défaut
  return (
    <div className="w-full p-8">
      <p className="text-gray-500 text-center">Page "{page}" non configurée</p>
    </div>
  );
};

export default PageRenderer;
