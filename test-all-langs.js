const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = [];
  
  for (const lang of ['fr', 'en', 'he']) {
    console.log(`\n=== Testing /future-commerce?lng=${lang} ===`);
    await page.goto(`https://israelgrowthventure.com/future-commerce?lng=${lang}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `test-results/future-commerce-${lang}.png`, fullPage: true });
    
    // Check CTA buttons
    const hebrewCta = await page.locator('text=בקש מיני-אנליזה').count();
    const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
    const englishCta = await page.locator('text=Request a Mini-Analysis').count();
    
    const result = { lang, hebrewCta, frenchCta, englishCta };
    results.push(result);
    
    console.log(`Hebrew CTA: ${hebrewCta}, French CTA: ${frenchCta}, English CTA: ${englishCta}`);
    
    // Validate
    if (lang === 'fr' && frenchCta > 0) console.log('✅ French page has French CTA');
    else if (lang === 'fr') console.log('❌ French page missing French CTA');
    
    if (lang === 'en' && englishCta > 0) console.log('✅ English page has English CTA');
    else if (lang === 'en') console.log('❌ English page missing English CTA');
    
    if (lang === 'he' && hebrewCta > 0) console.log('✅ Hebrew page has Hebrew CTA');
    else if (lang === 'he') console.log('❌ Hebrew page missing Hebrew CTA');
  }
  
  await browser.close();
  
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(results, null, 2));
  console.log('\nScreenshots saved to test-results/');
})();
