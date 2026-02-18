// Configuration des prix par région
// Modifiable facilement pour ajuster les tarifs

export const PRICING_CONFIG = {
  europe: {
    name: 'Europe',
    currency: '€',
    currencyCode: 'EUR',
    packs: {
      audit: { price: 900, amount: 900, label: '900 €', currencyCode: 'EUR' },
      analyse: { price: 3000, amount: 3000, label: '3 000 €', currencyCode: 'EUR' },
      succursales: { price: 15000, amount: 15000, label: '15 000 €', currencyCode: 'EUR' },
      franchise: { price: 15000, amount: 15000, label: '15 000 €', currencyCode: 'EUR' }
    }
  },
  usa: {
    name: 'USA / North America',
    currency: '$',
    currencyCode: 'USD',
    packs: {
      audit: { price: 1000, amount: 1000, label: '1 000 $', currencyCode: 'USD' },
      analyse: { price: 4000, amount: 4000, label: '4 000 $', currencyCode: 'USD' },
      succursales: { price: 30000, amount: 30000, label: '30 000 $', currencyCode: 'USD' },
      franchise: { price: 30000, amount: 30000, label: '30 000 $', currencyCode: 'USD' }
    }
  },
  israel: {
    name: 'Israel',
    currency: '₪',
    currencyCode: 'ILS',
    packs: {
      audit: { price: 3500, amount: 3500, label: '3 500 ₪', currencyCode: 'ILS' },
      analyse: { price: 7000, amount: 7000, label: '7 000 ₪', currencyCode: 'ILS' },
      succursales: { price: 55000, amount: 55000, label: '55 000 ₪' },
      franchise: { price: 55000, amount: 55000, label: '55 000 ₪' }
    }
  },
  other: {
    name: 'Asia / Africa / Other',
    currency: '$',
    packs: {
      audit: { price: 1000, amount: 1000, label: '1 000 $' },
      analyse: { price: 4000, amount: 4000, label: '4 000 $' },
      succursales: { price: 30000, amount: 30000, label: '30 000 $' },
      franchise: { price: 30000, amount: 30000, label: '30 000 $' }
    }
  }
};

// Fonction pour obtenir le pricing selon la région
export const getPricing = (region = 'europe') => {
  return PRICING_CONFIG[region] || PRICING_CONFIG.europe;
};

// Fonction pour formater le prix
export const formatPrice = (price, currency) => {
  return `${price.toLocaleString()} ${currency}`;
};
