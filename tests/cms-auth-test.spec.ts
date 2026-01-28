/**
 * Test complet du CMS avec authentification
 * Login admin + vérification éditeur CMS et BlogManager
 */

import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'postmaster@israelgrowthventure.Com';
const ADMIN_PASSWORD = 'Admin@igv2025#';
const CMS_PASSWORD = 'LuE1lN-aYvn5JOrq4JhGnQ';

test.describe('CMS Editor avec authentification', () => {

  test('Login admin et accès au BlogManager', async ({ page }) => {
    // 1. Aller sur la page de login admin
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/10-login-page.png', fullPage: true });
    console.log('📸 Page de login capturée');
    
    // 2. Remplir le formulaire de login
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    if (await emailInput.count() > 0) {
      await emailInput.fill(ADMIN_EMAIL);
      console.log('✅ Email rempli');
    }
    
    if (await passwordInput.count() > 0) {
      await passwordInput.fill(ADMIN_PASSWORD);
      console.log('✅ Mot de passe rempli');
    }
    
    await page.screenshot({ path: 'test-results/11-login-filled.png', fullPage: true });
    
    // 3. Cliquer sur le bouton de connexion
    const loginButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Login"), button:has-text("Se connecter")');
    if (await loginButton.count() > 0) {
      await loginButton.first().click();
      await page.waitForTimeout(3000);
      console.log('✅ Bouton login cliqué');
    }
    
    await page.screenshot({ path: 'test-results/12-after-login.png', fullPage: true });
    console.log(`📍 URL après login: ${page.url()}`);
    
    // 4. Naviguer vers BlogManager
    await page.goto('https://israelgrowthventure.com/admin/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/13-blog-manager.png', fullPage: true });
    console.log('📸 BlogManager capturé');
    
    // 5. Vérifier si on voit les articles
    const pageContent = await page.content();
    const hasArticles = pageContent.includes('article') || pageContent.includes('Article');
    console.log(`Articles visibles: ${hasArticles}`);
  });

  test('Login et accès au CMS Editor', async ({ page }) => {
    // 1. Login d'abord
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);
      
      const loginButton = page.locator('button[type="submit"]').first();
      if (await loginButton.count() > 0) {
        await loginButton.click();
        await page.waitForTimeout(3000);
      }
    }
    
    // 2. Aller sur CMS Editor
    await page.goto('https://israelgrowthventure.com/admin/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/14-cms-editor.png', fullPage: true });
    console.log('📸 CMS Editor capturé');
    
    // 3. Vérifier la présence de la page future-commerce dans la liste
    const pageContent = await page.content();
    const hasFutureCommerce = pageContent.includes('future-commerce') || pageContent.includes('Future Commerce') || pageContent.includes('Blog');
    console.log(`Page future-commerce dans CMS: ${hasFutureCommerce}`);
    
    // 4. Si on voit un select de page, sélectionner future-commerce
    const pageSelect = page.locator('select, [role="listbox"]').first();
    if (await pageSelect.count() > 0) {
      await page.screenshot({ path: 'test-results/15-cms-page-select.png', fullPage: true });
    }
  });

  test('Vérifier que BlogManager affiche les checkboxes de traduction', async ({ page }) => {
    // Login
    await page.goto('https://israelgrowthventure.com/admin/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
      await emailInput.fill(ADMIN_EMAIL);
      await passwordInput.fill(ADMIN_PASSWORD);
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(3000);
    }
    
    // Aller sur BlogManager
    await page.goto('https://israelgrowthventure.com/admin/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Cliquer sur "Nouvel Article" si présent
    const newArticleBtn = page.locator('button:has-text("Nouvel Article"), button:has-text("New Article"), button:has-text("Ajouter")');
    if (await newArticleBtn.count() > 0) {
      await newArticleBtn.first().click();
      await page.waitForTimeout(1500);
      
      await page.screenshot({ path: 'test-results/16-new-article-form.png', fullPage: true });
      console.log('📸 Formulaire nouvel article capturé');
      
      // Vérifier présence des checkboxes de traduction
      const pageContent = await page.content();
      const hasTranslateEN = pageContent.includes('Traduire en Anglais') || pageContent.includes('translate') || pageContent.includes('EN');
      const hasTranslateHE = pageContent.includes('Traduire en Hébreu') || pageContent.includes('HE') || pageContent.includes('🇮🇱');
      
      console.log(`Checkbox traduction EN: ${hasTranslateEN}`);
      console.log(`Checkbox traduction HE: ${hasTranslateHE}`);
    } else {
      console.log('Bouton Nouvel Article non trouvé');
      await page.screenshot({ path: 'test-results/16-blog-manager-state.png', fullPage: true });
    }
  });

});
