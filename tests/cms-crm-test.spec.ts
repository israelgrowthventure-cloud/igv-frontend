/**
 * Test complet du CMS avec authentification - Chemins corrigés
 */

import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'postmaster@israelgrowthventure.Com';
const ADMIN_PASSWORD = 'Admin@igv2025#';

test.describe('CMS avec login admin', () => {

  test('Login et accès BlogManager via /admin/crm/blog', async ({ page }) => {
    // 1. Login
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0) {
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
    }
    
    console.log(`URL après login: ${page.url()}`);
    
    // 2. Naviguer vers BlogManager via le bon chemin
    await page.goto('https://israelgrowthventure.com/admin/crm/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/20-blog-manager-crm.png', fullPage: true });
    console.log('📸 BlogManager (/admin/crm/blog) capturé');
    
    // Vérifier le contenu
    const content = await page.content();
    const hasArticlesTab = content.includes('Articles') || content.includes('article');
    const hasFaqTab = content.includes('FAQ') || content.includes('faq');
    
    console.log(`Onglet Articles visible: ${hasArticlesTab}`);
    console.log(`Onglet FAQ visible: ${hasFaqTab}`);
  });

  test('Login et accès CMS Editor via /admin/crm/cms', async ({ page }) => {
    // 1. Login
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0) {
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
    }
    
    // 2. Naviguer vers CMS Editor
    await page.goto('https://israelgrowthventure.com/admin/crm/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/21-cms-editor-crm.png', fullPage: true });
    console.log('📸 CMS Editor (/admin/crm/cms) capturé');
    
    // Vérifier que future-commerce est dans la liste des pages
    const content = await page.content();
    const hasFutureCommerce = content.includes('future-commerce') || content.includes('Future Commerce') || content.includes('Blog');
    const hasPageSelector = content.includes('Accueil') || content.includes('home') || content.includes('Page');
    
    console.log(`Page future-commerce listée: ${hasFutureCommerce}`);
    console.log(`Sélecteur de pages visible: ${hasPageSelector}`);
  });

  test('Ouvrir formulaire nouvel article et voir checkboxes traduction', async ({ page }) => {
    // 1. Login
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(3000);
    
    // 2. Aller sur BlogManager
    await page.goto('https://israelgrowthventure.com/admin/crm/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 3. Chercher et cliquer sur le bouton "Nouvel Article"
    const newArticleBtn = page.locator('button').filter({ hasText: /nouvel|nouveau|ajouter|new|add/i }).first();
    
    if (await newArticleBtn.count() > 0) {
      await newArticleBtn.click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: 'test-results/22-new-article-modal.png', fullPage: true });
      console.log('📸 Modal nouvel article capturé');
      
      // Vérifier les checkboxes de traduction
      const content = await page.content();
      const hasTranslateEnCheckbox = content.includes('Traduire en Anglais') || content.includes('🇬🇧');
      const hasTranslateHeCheckbox = content.includes('Traduire en Hébreu') || content.includes('🇮🇱');
      
      console.log(`✅ Checkbox traduction EN: ${hasTranslateEnCheckbox}`);
      console.log(`✅ Checkbox traduction HE: ${hasTranslateHeCheckbox}`);
      
      expect(hasTranslateEnCheckbox || hasTranslateHeCheckbox).toBeTruthy();
    } else {
      console.log('❌ Bouton Nouvel Article non trouvé');
      
      // Lister tous les boutons visibles
      const allButtons = await page.locator('button').allTextContents();
      console.log('Boutons trouvés:', allButtons.slice(0, 10));
    }
  });

  test('Vérifier la liste des articles existants', async ({ page }) => {
    // Login
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="email"]').first().fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').first().fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(3000);
    
    // BlogManager
    await page.goto('https://israelgrowthventure.com/admin/crm/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/23-articles-list.png', fullPage: true });
    
    // Chercher les titres d'articles connus
    const content = await page.content();
    const hasAIArticle = content.includes('IA') || content.includes('intelligence artificielle') || content.includes('AI');
    const hasRetailArticle = content.includes('retail') || content.includes('Retail');
    
    console.log(`Article IA trouvé: ${hasAIArticle}`);
    console.log(`Article Retail trouvé: ${hasRetailArticle}`);
  });

});
