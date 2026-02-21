/** @type {import('next').NextConfig} */
const nextConfig = {
  // Génération statique par défaut + SSR possible par page
  // Compatible avec déploiement Render (node) ou export statique
  output: 'export', // Génère un dossier 'out/' statique → Render staticPublishPath: out

  // Désactiver l'optimisation d'images pour compatibilité export statique
  images: {
    unoptimized: true,
  },

  // Trailing slash pour compatibilité Render SPA
  trailingSlash: true,

  // Ne pas exposer le préfixe react-scripts
  reactStrictMode: true,

  // Variables d'env publiques (équivalent REACT_APP_*)
  env: {
    NEXT_PUBLIC_BACKEND_URL:
      process.env.REACT_APP_BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'https://igv-cms-backend.onrender.com',
    NEXT_PUBLIC_API_URL:
      process.env.REACT_APP_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'https://igv-cms-backend.onrender.com',
  },

  // Alias @ vers src/ pour compatibilité avec les imports existants
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Permet d'importer depuis '@/components/...' dans app/
    };
    return config;
  },
};

module.exports = nextConfig;
