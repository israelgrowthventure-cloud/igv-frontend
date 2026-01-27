#!/usr/bin/env node
/**
 * Script de validation i18n - IGV Frontend
 * Vérifie la cohérence et complétude des traductions
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║   🌍 Validation i18n - Israel Growth Venture        ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// Chemins des fichiers de traduction
const i18nDir = path.join(__dirname, '../src/i18n/locales');
const locales = ['fr', 'en', 'he'];

const translations = {};
let errors = 0;
let warnings = 0;

// 1. Charger toutes les traductions
console.log('1️⃣  Chargement des fichiers de traduction...\n');

locales.forEach(locale => {
  const filePath = path.join(i18nDir, `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Fichier manquant: ${locale}.json`);
    errors++;
    return;
  }
  
  try {
    translations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keyCount = Object.keys(translations[locale]).length;
    console.log(`✅ ${locale}.json chargé (${keyCount} clés)`);
  } catch (error) {
    console.log(`❌ Erreur de parsing: ${locale}.json - ${error.message}`);
    errors++;
  }
});

console.log('');

// 2. Vérifier la cohérence des clés
console.log('2️⃣  Vérification de la cohérence des clés...\n');

const frKeys = Object.keys(translations['fr'] || {});
const enKeys = Object.keys(translations['en'] || {});
const heKeys = Object.keys(translations['he'] || {});

// Clés manquantes EN
const missingInEn = frKeys.filter(key => !enKeys.includes(key));
if (missingInEn.length > 0) {
  console.log(`⚠️  Clés manquantes dans EN: ${missingInEn.length}`);
  missingInEn.slice(0, 5).forEach(key => console.log(`   - ${key}`));
  if (missingInEn.length > 5) console.log(`   ... et ${missingInEn.length - 5} autres`);
  warnings += missingInEn.length;
} else {
  console.log('✅ EN: Toutes les clés FR présentes');
}

// Clés manquantes HE
const missingInHe = frKeys.filter(key => !heKeys.includes(key));
if (missingInHe.length > 0) {
  console.log(`⚠️  Clés manquantes dans HE: ${missingInHe.length}`);
  missingInHe.slice(0, 5).forEach(key => console.log(`   - ${key}`));
  if (missingInHe.length > 5) console.log(`   ... et ${missingInHe.length - 5} autres`);
  warnings += missingInHe.length;
} else {
  console.log('✅ HE: Toutes les clés FR présentes');
}

console.log('');

// 3. Vérifier les valeurs vides
console.log('3️⃣  Vérification des valeurs vides...\n');

locales.forEach(locale => {
  if (!translations[locale]) return;
  
  const emptyKeys = Object.keys(translations[locale]).filter(
    key => {
      const value = translations[locale][key];
      return !value || (typeof value === 'string' && value.trim() === '') || (typeof value === 'object' && Object.keys(value).length === 0);
    }
  );
  
  if (emptyKeys.length > 0) {
    console.log(`⚠️  ${locale.toUpperCase()}: ${emptyKeys.length} valeurs vides`);
    emptyKeys.slice(0, 3).forEach(key => console.log(`   - ${key}`));
    if (emptyKeys.length > 3) console.log(`   ... et ${emptyKeys.length - 3} autres`);
    warnings += emptyKeys.length;
  } else {
    console.log(`✅ ${locale.toUpperCase()}: Aucune valeur vide`);
  }
});

console.log('');

// 4. Détecter les traductions identiques (copier-coller suspect)
console.log('4️⃣  Détection de traductions suspectes...\n');

let suspiciousCount = 0;

frKeys.forEach(key => {
  const frValue = translations['fr']?.[key];
  const enValue = translations['en']?.[key];
  const heValue = translations['he']?.[key];
  
  // Si FR = EN (suspect sauf pour noms propres, emails, etc.)
  if (frValue && enValue && frValue === enValue) {
    // Ignorer les cas acceptables
    if (!/@/.test(frValue) && // emails
        !/^\d+$/.test(frValue) && // nombres
        !/^[A-Z\s]+$/.test(frValue) && // sigles
        frValue.length > 3) { // mots courts
      suspiciousCount++;
    }
  }
});

if (suspiciousCount > 0) {
  console.log(`⚠️  ${suspiciousCount} traductions FR=EN identiques (à vérifier)`);
  warnings += suspiciousCount;
} else {
  console.log('✅ Pas de traductions suspectes FR=EN');
}

console.log('');

// 5. Statistiques globales
console.log('5️⃣  Statistiques globales...\n');

const stats = {
  fr: Object.keys(translations['fr'] || {}).length,
  en: Object.keys(translations['en'] || {}).length,
  he: Object.keys(translations['he'] || {}).length,
};

console.log(`📊 Nombre de clés par langue:`);
console.log(`   FR: ${stats.fr} clés`);
console.log(`   EN: ${stats.en} clés`);
console.log(`   HE: ${stats.he} clés`);

const maxKeys = Math.max(...Object.values(stats));
const minKeys = Math.min(...Object.values(stats));
const coverage = ((minKeys / maxKeys) * 100).toFixed(1);

console.log(`\n📈 Couverture: ${coverage}% (${minKeys}/${maxKeys})`);

console.log('');

// 6. Rapport final
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║               📊 RÉSULTAT VALIDATION i18n            ║');
console.log('╠══════════════════════════════════════════════════════╣');
console.log('║                                                      ║');
console.log(`║  ❌ Erreurs      : ${errors.toString().padEnd(3)}                              ║`);
console.log(`║  ⚠️  Avertissements: ${warnings.toString().padEnd(3)}                              ║`);
console.log(`║  📈 Couverture   : ${coverage}%                             ║`);
console.log('║                                                      ║');

if (errors === 0 && warnings === 0) {
  console.log('║  🎉 Status: PERFECT - Traductions complètes         ║');
  console.log('║                                                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  process.exit(0);
} else if (errors === 0) {
  console.log('║  ✅ Status: OK - Quelques avertissements mineurs    ║');
  console.log('║                                                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  process.exit(0);
} else {
  console.log('║  ❌ Status: ERREURS - Corrections nécessaires       ║');
  console.log('║                                                      ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  process.exit(1);
}
