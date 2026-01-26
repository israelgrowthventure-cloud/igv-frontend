/**
 * i18n Audit Script — IGV CRM
 * ============================
 * 
 * Scans src/ for all i18n keys used and compares with locale JSON files.
 * Generates missing keys reports.
 * 
 * Usage: node tools/i18n-audit.js
 * 
 * Output:
 *   - tools/missing_keys_fr.json
 *   - tools/missing_keys_en.json
 *   - tools/missing_keys_he.json
 *   - Console summary
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const LOCALES_DIR = path.join(SRC_DIR, 'i18n', 'locales');
const OUTPUT_DIR = __dirname;

// Patterns to match i18n keys
const PATTERNS = [
  /\bt\(\s*['"`]([^'"`]+)['"`]\s*[,)]/g,           // t('key') or t("key") or t(`key`)
  /\bt\(\s*['"`]([^'"`]+)['"`]\s*,\s*\{/g,         // t('key', { ... })
  /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g,            // i18nKey="key"
  /useTranslation\(\s*['"`]([^'"`]+)['"`]\s*\)/g,  // useTranslation('namespace')
];

// File extensions to scan
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Keys to ignore (dynamic keys, etc.)
const IGNORE_PATTERNS = [
  /^\$/,           // $variable
  /\$\{/,          // template literal with variable
  /^[a-z]+$/,      // single word (likely variable)
];

/**
 * Recursively get all files in directory
 */
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, build, etc.
      if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else if (EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Extract i18n keys from file content
 */
function extractKeys(content, filePath) {
  const keys = new Set();
  
  for (const pattern of PATTERNS) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    let match;
    
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      
      // Skip ignored patterns
      const shouldIgnore = IGNORE_PATTERNS.some(p => p.test(key));
      if (!shouldIgnore && key.includes('.')) {
        keys.add(key);
      }
    }
  }
  
  return keys;
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = current[part];
  }
  
  return current;
}

/**
 * Check if key exists in locale
 */
function keyExists(locale, key) {
  const value = getNestedValue(locale, key);
  return value !== undefined && value !== null;
}

/**
 * Generate placeholder value for missing key
 */
function generatePlaceholder(key) {
  // Convert dot notation to readable text
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  
  // Convert camelCase/snake_case to Title Case
  const readable = lastPart
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
  
  return `[AUTO_GEN] ${readable}`;
}

/**
 * Main audit function
 */
function runAudit() {
  console.log('🔍 i18n Audit Script — IGV CRM');
  console.log('================================\n');
  
  // Load locale files
  console.log('📂 Loading locale files...');
  const locales = {
    fr: JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'fr.json'), 'utf8')),
    en: JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'en.json'), 'utf8')),
    he: JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, 'he.json'), 'utf8')),
  };
  
  // Get all source files
  console.log('📁 Scanning source files...');
  const files = getAllFiles(SRC_DIR);
  console.log(`   Found ${files.length} files\n`);
  
  // Extract all keys
  const allKeys = new Set();
  const keyUsages = {}; // Track which files use which keys
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const keys = extractKeys(content, file);
    
    for (const key of keys) {
      allKeys.add(key);
      
      if (!keyUsages[key]) {
        keyUsages[key] = [];
      }
      keyUsages[key].push(path.relative(SRC_DIR, file));
    }
  }
  
  console.log(`🔑 Found ${allKeys.size} unique i18n keys\n`);
  
  // Check missing keys for each locale
  const missingKeys = {
    fr: {},
    en: {},
    he: {},
  };
  
  for (const key of allKeys) {
    for (const lang of ['fr', 'en', 'he']) {
      if (!keyExists(locales[lang], key)) {
        missingKeys[lang][key] = {
          placeholder: generatePlaceholder(key),
          usedIn: keyUsages[key] || [],
        };
      }
    }
  }
  
  // Output results
  console.log('📊 AUDIT RESULTS');
  console.log('================\n');
  
  for (const lang of ['fr', 'en', 'he']) {
    const count = Object.keys(missingKeys[lang]).length;
    const status = count === 0 ? '✅' : '❌';
    console.log(`${status} ${lang.toUpperCase()}: ${count} missing keys`);
    
    // Write missing keys file
    const outputPath = path.join(OUTPUT_DIR, `missing_keys_${lang}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(missingKeys[lang], null, 2));
    console.log(`   → Written to: tools/missing_keys_${lang}.json`);
  }
  
  console.log('\n');
  
  // Show sample of missing keys
  const allMissingKeys = new Set([
    ...Object.keys(missingKeys.fr),
    ...Object.keys(missingKeys.en),
    ...Object.keys(missingKeys.he),
  ]);
  
  if (allMissingKeys.size > 0) {
    console.log('📋 SAMPLE MISSING KEYS (first 20):');
    console.log('----------------------------------');
    
    let count = 0;
    for (const key of allMissingKeys) {
      if (count >= 20) break;
      
      const inFr = missingKeys.fr[key] ? '❌' : '✅';
      const inEn = missingKeys.en[key] ? '❌' : '✅';
      const inHe = missingKeys.he[key] ? '❌' : '✅';
      
      console.log(`  ${key}`);
      console.log(`    FR:${inFr} EN:${inEn} HE:${inHe}`);
      count++;
    }
    
    if (allMissingKeys.size > 20) {
      console.log(`  ... and ${allMissingKeys.size - 20} more`);
    }
  }
  
  console.log('\n✅ Audit complete!\n');
  
  return {
    totalKeys: allKeys.size,
    missingFr: Object.keys(missingKeys.fr).length,
    missingEn: Object.keys(missingKeys.en).length,
    missingHe: Object.keys(missingKeys.he).length,
    missingKeys,
  };
}

// Run if called directly
if (require.main === module) {
  runAudit();
}

module.exports = { runAudit };
