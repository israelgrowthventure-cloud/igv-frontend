import React from 'react';

/**
 * PageRenderer - Composant qui affiche la page exactement comme APERÇU
 * Modes:
 * - editable=false: Mode preview pur (identique iframe)
 * - editable=true: Mode édition inline avec data-cms-key
 */
const PageRenderer = ({ page, language, content, editable = false, onEdit }) => {
  
  const handleClick = (key) => {
    if (editable && onEdit) {
      onEdit(key);
    }
  };

  const getEditableProps = (key) => {
    if (!editable) return {};
    return {
      'data-cms-key': key,
      'contentEditable': true,
      'suppressContentEditableWarning': true,
      'onClick': () => handleClick(key),
      'onBlur': (e) => onEdit && onEdit(key, e.currentTarget.textContent),
      'className': 'cms-editable cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 transition-all',
    };
  };

  // Rendu pour la page HOME
  if (page === 'home') {
    return (
      <div className="w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 
              className="text-5xl font-bold mb-4"
              {...getEditableProps('hero_title')}
            >
              {content.hero_title || 'Titre Hero'}
            </h1>
            <h2 
              className="text-2xl mb-6"
              {...getEditableProps('hero_subtitle')}
            >
              {content.hero_subtitle || 'Sous-titre'}
            </h2>
            <p 
              className="text-lg mb-8 max-w-2xl"
              {...getEditableProps('hero_description')}
            >
              {content.hero_description || 'Description'}
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                {content.hero_cta || 'Commencer'}
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 
              className="text-4xl font-bold text-center mb-4 text-gray-900"
              {...getEditableProps('services_title')}
            >
              {content.services_title || 'Nos Services'}
            </h2>
            <p 
              className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto"
              {...getEditableProps('services_subtitle')}
            >
              {content.services_subtitle || 'Découvrez nos solutions'}
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service1_title')}
                >
                  {content.service1_title || 'Service 1'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service1_description')}
                >
                  {content.service1_description || 'Description service 1'}
                </p>
              </div>
              {/* Service 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service2_title')}
                >
                  {content.service2_title || 'Service 2'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service2_description')}
                >
                  {content.service2_description || 'Description service 2'}
                </p>
              </div>
              {/* Service 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 
                  className="text-xl font-bold mb-3 text-gray-900"
                  {...getEditableProps('service3_title')}
                >
                  {content.service3_title || 'Service 3'}
                </h3>
                <p 
                  className="text-gray-600"
                  {...getEditableProps('service3_description')}
                >
                  {content.service3_description || 'Description service 3'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 
              className="text-3xl font-bold mb-4"
              {...getEditableProps('cta_title')}
            >
              {content.cta_title || 'Prêt à commencer ?'}
            </h2>
            <p 
              className="text-xl mb-8"
              {...getEditableProps('cta_subtitle')}
            >
              {content.cta_subtitle || 'Contactez-nous dès aujourd\'hui'}
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              {content.cta_button || 'Nous contacter'}
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

  // Rendu par défaut
  return (
    <div className="w-full p-8">
      <p className="text-gray-500 text-center">Page "{page}" non configurée</p>
    </div>
  );
};

export default PageRenderer;
