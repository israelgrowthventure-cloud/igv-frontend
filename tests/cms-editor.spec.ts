import { test, expect } from '@playwright/test';

const CMS_PASSWORD = 'LuE1lN-aYvn5JOrq4JhGnQ';

test.describe('CMS Editor Tests', () => {

  test('Access CMS Editor and verify content loads', async ({ page }) => {
    // Go to CMS editor page
    await page.goto('https://israelgrowthventure.com/admin/cms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/cms-editor-initial.png', fullPage: true });
    
    // Check if there's a password prompt or login form
    const pageContent = await page.content();
    console.log('Page has password input:', pageContent.includes('password'));
    console.log('Page has CMS content:', pageContent.includes('CMS') || pageContent.includes('Éditeur'));
    
    // If there's a password field, enter the CMS password
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.count() > 0) {
      console.log('Password field found, entering CMS password...');
      await passwordInput.fill(CMS_PASSWORD);
      
      // Look for submit button
      const submitBtn = page.locator('button[type="submit"], button:has-text("Accéder"), button:has-text("Valider")');
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click();
        await page.waitForTimeout(2000);
      }
    }
    
    await page.screenshot({ path: 'test-results/cms-editor-after-password.png', fullPage: true });
    
    // Check for page selector
    const pageSelector = page.locator('select, [class*="select"], button:has-text("Accueil"), button:has-text("home")');
    const hasPagesSelector = await pageSelector.count() > 0;
    console.log('Has page selector:', hasPagesSelector);
    
    // Check for language selector
    const langSelector = page.locator('button:has-text("🇫🇷"), button:has-text("FR"), button:has-text("Français")');
    const hasLangSelector = await langSelector.count() > 0;
    console.log('Has language selector:', hasLangSelector);
    
    // Check for future-commerce in pages list
    const futureCommerce = page.locator('text=future-commerce, text=Blog, text=Future Commerce');
    const hasFutureCommerce = await futureCommerce.count() > 0;
    console.log('Has future-commerce page option:', hasFutureCommerce);
  });

  test('BlogManager shows articles and FAQ', async ({ page }) => {
    // Go to Blog Manager
    await page.goto('https://israelgrowthventure.com/admin/blog');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/blog-manager-full.png', fullPage: true });
    
    // Check for articles tab
    const articlesTab = page.locator('button:has-text("Articles"), [class*="tab"]:has-text("Articles")');
    console.log('Articles tab found:', await articlesTab.count() > 0);
    
    // Check for FAQ tab
    const faqTab = page.locator('button:has-text("FAQ")');
    console.log('FAQ tab found:', await faqTab.count() > 0);
    
    // Check for "Nouvel Article" button
    const newArticleBtn = page.locator('button:has-text("Nouvel Article"), button:has-text("Nouveau")');
    console.log('New Article button found:', await newArticleBtn.count() > 0);
    
    // Check article count in list
    const articleCards = page.locator('[class*="card"], [class*="article"], .bg-white.rounded');
    const articleCount = await articleCards.count();
    console.log('Article cards in list:', articleCount);
    
    // Click on "Nouvel Article" to open the form
    if (await newArticleBtn.count() > 0) {
      await newArticleBtn.first().click();
      await page.waitForTimeout(1000);
      
      await page.screenshot({ path: 'test-results/blog-manager-new-article-form.png', fullPage: true });
      
      // Check for translation checkboxes
      const translateEnCheckbox = page.locator('text=Traduire en Anglais, text=EN, input[name*="translate"]');
      const translateHeCheckbox = page.locator('text=Traduire en Hébreu, text=HE');
      
      console.log('Translation EN checkbox/text found:', await translateEnCheckbox.count() > 0);
      console.log('Translation HE checkbox/text found:', await translateHeCheckbox.count() > 0);
      
      // Look for the blue translation box
      const translationBox = page.locator('.bg-blue-50, [class*="blue"]');
      console.log('Blue translation box found:', await translationBox.count() > 0);
    }
  });

  test('Verify articles are displayed on public page', async ({ page }) => {
    // Go to future-commerce page
    await page.goto('https://israelgrowthventure.com/future-commerce');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'test-results/future-commerce-articles.png', fullPage: true });
    
    // Count visible article cards
    const articleLinks = await page.locator('a[href*="/future-commerce/"]').all();
    console.log('Article links on page:', articleLinks.length);
    
    // Get article titles
    const titles = await page.locator('h2, h3').allTextContents();
    console.log('Titles found:', titles.filter(t => t.length > 5).slice(0, 5));
    
    // Check FAQ section
    const faqSection = page.locator('text=FAQ, text=Questions');
    console.log('FAQ section found:', await faqSection.count() > 0);
    
    // Count FAQ items (accordions)
    const faqItems = page.locator('[class*="accordion"], details, [class*="faq"]');
    console.log('FAQ items found:', await faqItems.count());
  });

});
