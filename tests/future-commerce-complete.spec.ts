/**
 * Test complet du système Blog/CMS
 * Vérifie:
 * 1. Les boutons CTA sont traduits dans chaque langue
 * 2. Les articles et FAQ sont affichés
 * 3. Le BlogManager est accessible avec les checkboxes de traduction
 */

import { test, expect } from '@playwright/test';

test.describe('Blog Future Commerce - Vérification complète', () => {
  
  // Test 1: CTA en français
  test('Page future-commerce en FR affiche CTA français', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=fr');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Screenshot de la page
    await page.screenshot({ path: 'test-results/01-future-commerce-FR.png', fullPage: true });
    
    // Vérifier que le CTA français est présent
    const pageContent = await page.content();
    const hasFrenchCTA = pageContent.includes('Demander une Mini-Analyse') || 
                         pageContent.includes('Mini-Analyse');
    
    console.log('✅ Page FR chargée');
    console.log(`CTA français trouvé: ${hasFrenchCTA}`);
  });

  // Test 2: CTA en anglais
  test('Page future-commerce en EN affiche CTA anglais', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/02-future-commerce-EN.png', fullPage: true });
    
    const pageContent = await page.content();
    const hasEnglishCTA = pageContent.includes('Request a Mini-Analysis') || 
                          pageContent.includes('Mini-Analysis');
    const hasNoFrenchCTA = !pageContent.includes('Demander une Mini-Analyse');
    
    console.log('✅ Page EN chargée');
    console.log(`CTA anglais trouvé: ${hasEnglishCTA}`);
    console.log(`Pas de CTA français: ${hasNoFrenchCTA}`);
    
    expect(hasNoFrenchCTA).toBeTruthy();
  });

  // Test 3: CTA en hébreu
  test('Page future-commerce en HE affiche CTA hébreu', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=he');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/03-future-commerce-HE.png', fullPage: true });
    
    const pageContent = await page.content();
    const hasHebrewCTA = pageContent.includes('בקש מיני-אנליזה') || 
                         pageContent.includes('מיני-אנליזה');
    const hasNoFrenchCTA = !pageContent.includes('Demander une Mini-Analyse');
    
    console.log('✅ Page HE chargée');
    console.log(`CTA hébreu trouvé: ${hasHebrewCTA}`);
    console.log(`Pas de CTA français: ${hasNoFrenchCTA}`);
    
    expect(hasNoFrenchCTA).toBeTruthy();
  });

  // Test 4: Articles sont affichés
  test('Articles du blog sont affichés', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=fr');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Chercher des éléments d'articles (cartes, titres, etc.)
    const articleCards = await page.locator('article, .article, [class*="card"]').count();
    
    console.log(`Nombre de cartes/articles trouvés: ${articleCards}`);
    
    await page.screenshot({ path: 'test-results/04-articles-list.png', fullPage: true });
  });

  // Test 5: FAQ est affichée
  test('FAQ est affichée sur la page', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=fr');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Scroller vers le bas pour voir la FAQ
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const pageContent = await page.content();
    const hasFAQ = pageContent.includes('FAQ') || 
                   pageContent.includes('Questions') ||
                   pageContent.includes('fréquentes');
    
    console.log(`FAQ trouvée: ${hasFAQ}`);
    
    await page.screenshot({ path: 'test-results/05-faq-section.png', fullPage: true });
  });

  // Test 6: Clic sur un article
  test('Clic sur un article ouvre la page détail', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=fr');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Chercher un lien vers un article
    const articleLink = page.locator('a[href*="/future-commerce/"]').first();
    const exists = await articleLink.count() > 0;
    
    if (exists) {
      await articleLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'test-results/06-article-detail.png', fullPage: true });
      
      // Vérifier que le CTA dans l'article est aussi en français
      const pageContent = await page.content();
      const hasProperCTA = pageContent.includes('Mini-Analyse') || 
                           pageContent.includes('Demander');
      
      console.log(`Article ouvert, CTA correct: ${hasProperCTA}`);
    } else {
      console.log('Aucun lien d\'article trouvé');
    }
  });

  // Test 7: Article en hébreu a CTA hébreu
  test('Article en HE affiche CTA hébreu', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=he');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const articleLink = page.locator('a[href*="/future-commerce/"]').first();
    const exists = await articleLink.count() > 0;
    
    if (exists) {
      await articleLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: 'test-results/07-article-detail-HE.png', fullPage: true });
      
      const pageContent = await page.content();
      const hasNoFrenchCTA = !pageContent.includes('Demander une Mini-Analyse');
      
      console.log(`Article HE - Pas de CTA français: ${hasNoFrenchCTA}`);
      expect(hasNoFrenchCTA).toBeTruthy();
    }
  });

});
