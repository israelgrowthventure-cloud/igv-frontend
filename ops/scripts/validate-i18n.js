#!/usr/bin/env node
/**
 * Script de validation i18n pour IGV Frontend
 * 
 * Vérifie :
 * 1. Complétude des traductions (toutes les clés FR existent en EN et HE)
 * 2. Absence de texte hardcodé dans les fichiers React
 * 3. Cohérence des clés i18n utilisées
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Fonction pour extraire toutes les clés d'un objet nested
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Charger les fichiers JSON i18n
function loadLocales() {
  const localesPath = path.join(__dirname, '../../src/i18n/locales');
  
  const fr = JSON.parse(fs.readFileSync(path.join(localesPath, 'fr.json'), 'utf-8'));
  const en = JSON.parse(fs.readFileSync(path.join(localesPath, 'en.json'), 'utf-8'));
  const he = JSON.parse(fs.readFileSync(path.join(localesPath, 'he.json'), 'utf-8'));
  
  return { fr, en, he };
}

// Vérifier la complétude des traductions
function checkTranslationCompleteness() {
  console.log(`\n${colors.cyan}🌍 Vérification de la complétude des traductions${colors.reset}\n`);
  
  const { fr, en, he } = loadLocales();
  
  const frKeys = getAllKeys(fr);
  const enKeys = getAllKeys(en);
  const heKeys = getAllKeys(he);
  
  console.log(`📊 Statistiques :`);
  console.log(`  - Français (base) : ${frKeys.length} clés`);
  console.log(`  - Anglais : ${enKeys.length} clés`);
  console.log(`  - Hébreu : ${heKeys.length} clés\n`);
  
  // Vérifier les clés manquantes en EN
  const missingInEn = frKeys.filter(key => !enKeys.includes(key));
  if (missingInEn.length > 0) {
    console.log(`${colors.yellow}⚠ Clés manquantes en anglais (${missingInEn.length}) :${colors.reset}`);
    missingInEn.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log(`${colors.green}✓ Anglais : 100% complet${colors.reset}`);
  }
  
  // Vérifier les clés manquantes en HE
  const missingInHe = frKeys.filter(key => !heKeys.includes(key));
  if (missingInHe.length > 0) {
    console.log(`${colors.yellow}⚠ Clés manquantes en hébreu (${missingInHe.length}) :${colors.reset}`);
    missingInHe.forEach(key => console.log(`  - ${key}`));
  } else {
    console.log(`${colors.green}✓ Hébreu : 100% complet${colors.reset}`);
  }
  
  return {
    frCount: frKeys.length,
    enCount: enKeys.length,
    heCount: heKeys.length,
    missingInEn: missingInEn.length,
    missingInHe: missingInHe.length,
  };
}

// Vérifier les textes hardcodés dans les fichiers React
async function checkHardcodedText() {
  console.log(`\n${colors.cyan}🔍 Recherche de textes hardcodés${colors.reset}\n`);
  
  // Patterns à détecter (textes hardcodés suspects)
  const suspectPatterns = [
    /alt="[A-Z][^{]*"/g,           // alt="Text" au lieu de alt={t(...)}
    /placeholder="[A-Z][^{]*"/g,   // placeholder="Text"
    /title="[A-Z][^{]*"/g,         // title="Text"
    />[A-Z][a-z]{4,}</g,            // Texte direct dans JSX (ex: >Welcome<)
  ];
  
  const files = await glob('src/**/*.{js,jsx}', {
    cwd: path.join(__dirname, '../../'),
    absolute: true,
  });
  
  let totalIssues = 0;
  const issuesByFile = new Map();
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const relPath = path.relative(path.join(__dirname, '../../'), file);
    
    const fileIssues = [];
    
    for (const pattern of suspectPatterns) {
      const matches = [...content.matchAll(pattern)];
      
      for (const match of matches) {
        const text = match[0];
        
        // Filtrer les faux positifs (URLs, classNames, etc.)
        if (
          text.includes('http') ||
          text.includes('className') ||
          text.includes('data-') ||
          text.includes('aria-') ||
          text.includes('id=') ||
          text.includes('key=') ||
          text.includes('ref=') ||
          text.includes('type=') ||
          text.includes('value=') ||
          text.includes('name=') ||
          text.includes('onClick') ||
          text.includes('onChange')
        ) {
          continue;
        }
        
        fileIssues.push(text);
      }
    }
    
    if (fileIssues.length > 0) {
      issuesByFile.set(relPath, fileIssues);
      totalIssues += fileIssues.length;
    }
  }
  
  if (totalIssues > 0) {
    console.log(`${colors.yellow}⚠ Textes hardcodés détectés (${totalIssues} occurrences) :${colors.reset}\n`);
    
    for (const [file, issues] of issuesByFile.entries()) {
      console.log(`${colors.magenta}${file}${colors.reset} (${issues.length}) :`);
      issues.forEach(issue => console.log(`  - ${issue}`));
      console.log('');
    }
  } else {
    console.log(`${colors.green}✓ Aucun texte hardcodé détecté !${colors.reset}`);
  }
  
  return totalIssues;
}

// Fonction principale
async function main() {
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Validation i18n - IGV Frontend${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  
  const stats = checkTranslationCompleteness();
  const hardcodedCount = await checkHardcodedText();
  
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}  Résumé${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  const enCompleteness = ((stats.frCount - stats.missingInEn) / stats.frCount * 100).toFixed(1);
  const heCompleteness = ((stats.frCount - stats.missingInHe) / stats.frCount * 100).toFixed(1);
  
  console.log(`📊 Couverture i18n :`);
  console.log(`  - FR : ${stats.frCount} clés (base)`);
  console.log(`  - EN : ${stats.enCount} clés (${enCompleteness}%)`);
  console.log(`  - HE : ${stats.heCount} clés (${heCompleteness}%)`);
  console.log(`\n🔍 Textes hardcodés : ${hardcodedCount === 0 ? colors.green + '0 ✓' + colors.reset : colors.red + hardcodedCount + colors.reset}`);
  
  const allGood = stats.missingInEn === 0 && stats.missingInHe === 0 && hardcodedCount === 0;
  
  if (allGood) {
    console.log(`\n${colors.green}✨ Validation réussie ! Le projet est 100% internationalisé.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.yellow}⚠ Des améliorations sont possibles (voir détails ci-dessus).${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`${colors.red}Erreur :${colors.reset}`, err);
  process.exit(1);
});
