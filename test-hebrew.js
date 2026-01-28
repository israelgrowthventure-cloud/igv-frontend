const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Testing /future-commerce?lng=he...');
  await page.goto('https://israelgrowthventure.com/future-commerce?lng=he');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/future-commerce-hebrew-lng.png', fullPage: true });
  
  // Get all text content
  const bodyText = await page.locator('body').textContent();
  
  // Check if Hebrew text is present
  const hebrewCta = await page.locator('text=בקש מיני-אנליזה').count();
  const frenchCta = await page.locator('text=Demander une Mini-Analyse').count();
  
  console.log('Hebrew CTA count:', hebrewCta);
  console.log('French CTA count (should be 0):', frenchCta);
  
  if (frenchCta > 0) {
    console.log('WARNING: French CTA still visible on Hebrew page!');
  }
  if (hebrewCta > 0) {
    console.log('SUCCESS: Hebrew CTA is visible!');
  }
  
  await browser.close();
  console.log('Screenshot saved to test-results/future-commerce-hebrew-lng.png');
})();
