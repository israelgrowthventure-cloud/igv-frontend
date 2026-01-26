/**
 * i18n Auto-Fix Script — IGV CRM
 * ===============================
 * 
 * Reads missing_keys_*.json and adds placeholder translations
 * to the locale files.
 * 
 * Usage: node tools/i18n-autofix.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const TOOLS_DIR = __dirname;

// Language-specific placeholder prefixes
const LANG_PREFIX = {
  fr: '[AUTO] ',
  en: '[AUTO] ',
  he: '[AUTO] ',
};

/**
 * Set nested value in object using dot notation
 */
function setNestedValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

/**
 * Generate human-readable placeholder from key
 */
function generatePlaceholder(key, lang) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Convert snake_case/camelCase to readable text
  let readable = lastPart
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();
  
  // Capitalize first letter
  readable = readable.charAt(0).toUpperCase() + readable.slice(1);
  
  return LANG_PREFIX[lang] + readable;
}

/**
 * Process a single language
 */
function processLanguage(lang) {
  const missingKeysPath = path.join(TOOLS_DIR, `missing_keys_${lang}.json`);
  const localePath = path.join(LOCALES_DIR, `${lang}.json`);
  
  if (!fs.existsSync(missingKeysPath)) {
    console.log(`⚠️ No missing keys file for ${lang}`);
    return 0;
  }
  
  const missingKeys = JSON.parse(fs.readFileSync(missingKeysPath, 'utf8'));
  const locale = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  
  let addedCount = 0;
  
  for (const key of Object.keys(missingKeys)) {
    const placeholder = generatePlaceholder(key, lang);
    setNestedValue(locale, key, placeholder);
    addedCount++;
  }
  
  // Write updated locale
  fs.writeFileSync(localePath, JSON.stringify(locale, null, 2) + '\n');
  
  return addedCount;
}

/**
 * Main function
 */
function main() {
  console.log('🔧 i18n Auto-Fix Script — IGV CRM');
  console.log('==================================\n');
  
  let totalAdded = 0;
  
  for (const lang of ['fr', 'en', 'he']) {
    const added = processLanguage(lang);
    console.log(`✅ ${lang.toUpperCase()}: Added ${added} placeholder keys`);
    totalAdded += added;
  }
  
  console.log(`\n📊 Total: ${totalAdded} keys added across all locales`);
  console.log('\n⚠️ All added keys are prefixed with [AUTO] and need review!');
  console.log('✅ Auto-fix complete!\n');
}

main();
