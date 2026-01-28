/**
 * Test du BlogManager - Éditeur CMS pour articles et FAQ
 * Vérifie que l'interface d'administration est accessible et fonctionnelle
 */

import { test, expect } from '@playwright/test';

test.describe('BlogManager - Administration des Articles et FAQ', () => {

  // Test 1: Page d'admin accessible (redirection login si non connecté)
  test('Page admin accessible', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/admin/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/08-admin-blog-access.png', fullPage: true });
    
    // Vérifier qu'on est soit sur la page admin, soit redirigé vers login
    const url = page.url();
    const isAdminPage = url.includes('/admin');
    
    console.log(`URL actuelle: ${url}`);
    console.log(`Page admin accessible: ${isAdminPage}`);
  });

  // Test 2: Vérifier la structure du BlogManager.js localement
  test('BlogManager contient les checkboxes de traduction', async ({ page }) => {
    // Ce test vérifie que le code source contient les éléments attendus
    const fs = require('fs');
    const path = require('path');
    
    const blogManagerPath = path.join(__dirname, '../src/pages/admin/BlogManager.js');
    
    if (fs.existsSync(blogManagerPath)) {
      const content = fs.readFileSync(blogManagerPath, 'utf-8');
      
      const hasTranslateEn = content.includes('translate_en');
      const hasTranslateHe = content.includes('translate_he');
      const hasCheckbox = content.includes('checkbox');
      
      console.log('Vérification du code source BlogManager.js:');
      console.log(`- translate_en présent: ${hasTranslateEn}`);
      console.log(`- translate_he présent: ${hasTranslateHe}`);
      console.log(`- checkboxes présentes: ${hasCheckbox}`);
      
      expect(hasTranslateEn).toBeTruthy();
      expect(hasTranslateHe).toBeTruthy();
    }
  });

  // Test 3: Vérifier que l'API blog fonctionne
  test('API Blog retourne des articles', async ({ request }) => {
    const response = await request.get('https://igv-cms-backend.onrender.com/api/blog/articles?language=fr');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    console.log(`Nombre d'articles FR: ${data.articles?.length || 0}`);
    
    if (data.articles && data.articles.length > 0) {
      console.log('Titres des articles:');
      data.articles.forEach((a: any) => console.log(`  - ${a.title}`));
    }
    
    expect(data.articles).toBeDefined();
  });

  // Test 4: Vérifier que l'API FAQ fonctionne
  test('API FAQ retourne des items', async ({ request }) => {
    const response = await request.get('https://igv-cms-backend.onrender.com/api/blog/faq?language=fr');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    console.log(`Nombre de FAQ FR: ${data.items?.length || 0}`);
    
    if (data.items && data.items.length > 0) {
      console.log('Questions FAQ:');
      data.items.slice(0, 3).forEach((f: any) => console.log(`  - ${f.question.substring(0, 50)}...`));
    }
    
    expect(data.items).toBeDefined();
  });

  // Test 5: Articles en 3 langues
  test('Articles disponibles en 3 langues', async ({ request }) => {
    const languages = ['fr', 'en', 'he'];
    const results: Record<string, number> = {};
    
    for (const lang of languages) {
      const response = await request.get(`https://igv-cms-backend.onrender.com/api/blog/articles?language=${lang}`);
      const data = await response.json();
      results[lang] = data.articles?.length || 0;
    }
    
    console.log('Articles par langue:');
    console.log(`  - Français (fr): ${results.fr}`);
    console.log(`  - Anglais (en): ${results.en}`);
    console.log(`  - Hébreu (he): ${results.he}`);
    
    // Au moins une langue doit avoir des articles
    expect(results.fr + results.en + results.he).toBeGreaterThan(0);
  });

  // Test 6: FAQ en 3 langues
  test('FAQ disponibles en 3 langues', async ({ request }) => {
    const languages = ['fr', 'en', 'he'];
    const results: Record<string, number> = {};
    
    for (const lang of languages) {
      const response = await request.get(`https://igv-cms-backend.onrender.com/api/blog/faq?language=${lang}`);
      const data = await response.json();
      results[lang] = data.items?.length || 0;
    }
    
    console.log('FAQ par langue:');
    console.log(`  - Français (fr): ${results.fr}`);
    console.log(`  - Anglais (en): ${results.en}`);
    console.log(`  - Hébreu (he): ${results.he}`);
    
    // Au moins une langue doit avoir des FAQ
    expect(results.fr + results.en + results.he).toBeGreaterThan(0);
  });

});
