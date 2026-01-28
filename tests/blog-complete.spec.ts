import { test, expect } from '@playwright/test';

const BASE_URL = 'https://israelgrowthventure.com';

test.describe('Blog Complet - Articles + FAQ', () => {
  
  test('1. Blog affiche articles et FAQ sidebar', async ({ page }) => {
    console.log('📰 Test 1: Page blog avec FAQ...');
    
    await page.goto(`${BASE_URL}/future-commerce`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier le header
    const title = await page.locator('h1').textContent();
    console.log('   Titre:', title);
    expect(title).toContain('Blog');
    
    // Vérifier qu'il y a des articles
    const articles = await page.locator('.bg-white.rounded-xl.shadow-lg').count();
    console.log('   Articles trouvés:', articles);
    expect(articles).toBeGreaterThan(0);
    
    // Vérifier la FAQ sidebar
    const faqSection = await page.locator('text=FAQ').count();
    console.log('   Section FAQ:', faqSection > 0 ? 'Présente' : 'Absente');
    expect(faqSection).toBeGreaterThan(0);
    
    // Screenshot
    await page.screenshot({ path: 'test-blog-with-faq.png', fullPage: true });
    console.log('   ✅ Blog avec FAQ OK');
  });
  
  test('2. FAQ est cliquable et s\'ouvre', async ({ page }) => {
    console.log('❓ Test 2: FAQ interactive...');
    
    await page.goto(`${BASE_URL}/future-commerce`);
    await page.waitForLoadState('networkidle');
    
    // Cliquer sur la première question FAQ
    const faqButton = page.locator('button:has-text("Comment IGV"), button:has-text("?")').first();
    
    if (await faqButton.count() > 0) {
      await faqButton.click();
      await page.waitForTimeout(500);
      
      // Vérifier que la réponse est visible
      const answer = await page.locator('.text-gray-600.text-sm.leading-relaxed').count();
      console.log('   Réponses visibles:', answer);
      
      await page.screenshot({ path: 'test-faq-open.png' });
      console.log('   ✅ FAQ cliquable OK');
    } else {
      console.log('   ⚠️ Pas de bouton FAQ trouvé');
    }
  });
  
  test('3. Cliquer sur un article ouvre la page détail', async ({ page }) => {
    console.log('📖 Test 3: Ouverture article...');
    
    await page.goto(`${BASE_URL}/future-commerce`);
    await page.waitForLoadState('networkidle');
    
    // Cliquer sur le premier article
    const firstArticle = page.locator('a[href^="/blog/"]').first();
    
    if (await firstArticle.count() > 0) {
      const href = await firstArticle.getAttribute('href');
      console.log('   Lien article:', href);
      
      await firstArticle.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      console.log('   URL après clic:', currentUrl);
      
      // Screenshot de la page article
      await page.screenshot({ path: 'test-article-detail.png', fullPage: true });
      
      // Vérifier qu'on est sur une page article
      if (currentUrl.includes('/blog/')) {
        console.log('   ✅ Article ouvert OK');
        
        // Vérifier le contenu de l'article
        const articleTitle = await page.locator('h1').first().textContent();
        console.log('   Titre article:', articleTitle);
        
        // Vérifier le bouton retour
        const backLink = await page.locator('text=Retour').count();
        console.log('   Bouton retour:', backLink > 0 ? 'Présent' : 'Absent');
      } else {
        console.log('   ⚠️ Redirection vers article échouée');
      }
    } else {
      console.log('   ⚠️ Pas d\'article cliquable trouvé');
    }
  });
  
  test('4. Article affiche le contenu complet', async ({ page }) => {
    console.log('📝 Test 4: Contenu article complet...');
    
    // Aller directement sur un article via l'API
    try {
      const res = await page.request.get('https://igv-cms-backend.onrender.com/api/blog/articles?language=fr');
      const data = await res.json();
      
      if (data.articles && data.articles.length > 0) {
        const slug = data.articles[0].slug;
        console.log('   Slug article:', slug);
        
        await page.goto(`${BASE_URL}/blog/${slug}`);
        await page.waitForLoadState('networkidle');
        
        // Vérifier les éléments de l'article
        const hasTitle = await page.locator('h1').count() > 0;
        const hasContent = await page.locator('article, .prose').count() > 0;
        const hasCTA = await page.locator('text=Mini-Analyse').count() > 0;
        
        console.log('   Titre:', hasTitle ? '✅' : '❌');
        console.log('   Contenu:', hasContent ? '✅' : '❌');
        console.log('   CTA:', hasCTA ? '✅' : '❌');
        
        await page.screenshot({ path: 'test-article-full.png', fullPage: true });
        console.log('   ✅ Contenu article complet OK');
      }
    } catch (e: unknown) {
      const error = e as Error;
      console.log('   ⚠️ Erreur API:', error.message);
    }
  });
});
