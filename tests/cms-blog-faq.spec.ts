import { test, expect } from '@playwright/test';

const BASE_URL = 'https://israelgrowthventure.com';
const ADMIN_EMAIL = 'postmaster@israelgrowthventure.com';
const ADMIN_PASSWORD = 'Admin@igv2025#';

test.describe('CMS, Blog & FAQ Tests', () => {
  
  test('1. Blog page with FAQ sidebar', async ({ page }) => {
    console.log('📰 Test 1: Blog with FAQ...');
    
    await page.goto(`${BASE_URL}/blog`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check blog header
    const hasTitle = await page.locator('h1').first().isVisible();
    console.log('   Blog title visible:', hasTitle);
    
    // Check articles (should have at least the default ones)
    const articleCount = await page.locator('.rounded-xl.shadow-lg').count();
    console.log('   Articles found:', articleCount);
    
    // Check FAQ sidebar
    const hasFaq = await page.locator('text=FAQ').first().isVisible();
    console.log('   FAQ section visible:', hasFaq);
    
    // Take screenshot
    await page.screenshot({ path: 'test-blog-faq.png', fullPage: true });
    
    expect(hasTitle).toBeTruthy();
    expect(articleCount).toBeGreaterThan(0);
    
    console.log('✅ Blog page OK');
  });
  
  test('2. CMS Visual Preview', async ({ page }) => {
    console.log('🖼️ Test 2: CMS Visual...');
    
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Go to CMS
    await page.goto(`${BASE_URL}/admin/crm/cms`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check CMS elements
    const hasPageSelector = await page.locator('select').first().isVisible();
    const hasIframe = await page.locator('iframe').count() > 0;
    
    console.log('   Page selector:', hasPageSelector);
    console.log('   Preview iframe:', hasIframe);
    
    // Take screenshot
    await page.screenshot({ path: 'test-cms-visual.png', fullPage: true });
    
    expect(hasPageSelector).toBeTruthy();
    
    console.log('✅ CMS Visual OK');
  });
  
  test('3. Blog Manager with FAQ tab', async ({ page }) => {
    console.log('📝 Test 3: Blog Manager...');
    
    // Login
    await page.goto(`${BASE_URL}/admin/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Go to Blog Manager
    await page.goto(`${BASE_URL}/admin/crm/blog`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check tabs
    const hasArticlesTab = await page.locator('text=Articles').first().isVisible();
    const hasFaqTab = await page.locator('text=FAQ').first().isVisible();
    
    console.log('   Articles tab:', hasArticlesTab);
    console.log('   FAQ tab:', hasFaqTab);
    
    // Click FAQ tab
    await page.click('button:has-text("FAQ")');
    await page.waitForTimeout(1000);
    
    // Take screenshot of FAQ management
    await page.screenshot({ path: 'test-blog-manager-faq.png', fullPage: true });
    
    expect(hasArticlesTab).toBeTruthy();
    expect(hasFaqTab).toBeTruthy();
    
    console.log('✅ Blog Manager OK');
  });
});
