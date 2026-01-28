import { test, expect } from '@playwright/test';

test.describe('Future Commerce Translations & CTA Buttons', () => {
  
  test('Future Commerce page in Hebrew shows Hebrew CTA button', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=he');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/future-commerce-hebrew-cta.png', fullPage: true });
    
    const hebrewCta = await page.locator('text=בקש מיני-אנליזה').count();
    const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
    
    console.log(`Hebrew CTA visible: ${hebrewCta > 0}`);
    console.log(`French CTA visible (should be false): ${frenchCta > 0}`);
    
    expect(hebrewCta).toBeGreaterThan(0);
    expect(frenchCta).toBe(0);
  });

  test('Future Commerce page in English shows English CTA button', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/future-commerce-english-cta.png', fullPage: true });
    
    const englishCta = await page.locator('text=Request a Mini-Analysis').count();
    const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
    
    console.log(`English CTA visible: ${englishCta > 0}`);
    console.log(`French CTA visible (should be false): ${frenchCta > 0}`);
    
    expect(englishCta).toBeGreaterThan(0);
    expect(frenchCta).toBe(0);
  });

  test('Future Commerce page in French shows French CTA button', async ({ page }) => {
    await page.goto('https://israelgrowthventure.com/future-commerce?lng=fr');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-results/future-commerce-french-cta.png', fullPage: true });
    
    const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
    
    console.log(`French CTA visible: ${frenchCta > 0}`);
    expect(frenchCta).toBeGreaterThan(0);
  });

  test('All languages have correct CTAs - summary', async ({ page }) => {
    const results = [];
    
    for (const lang of ['fr', 'en', 'he']) {
      await page.goto(`https://israelgrowthventure.com/future-commerce?lng=${lang}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const hebrewCta = await page.locator('text=בקש מיני-אנליזה').count();
      const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
      const englishCta = await page.locator('text=Request a Mini-Analysis').count();
      
      results.push({ lang, hebrewCta, frenchCta, englishCta });
    }

    console.log('=== TRANSLATION TEST SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));
    
    // Validate results
    expect(results[0].frenchCta).toBeGreaterThan(0);  // FR page has FR CTA
    expect(results[1].englishCta).toBeGreaterThan(0); // EN page has EN CTA
    expect(results[2].hebrewCta).toBeGreaterThan(0);  // HE page has HE CTA
  });
});
