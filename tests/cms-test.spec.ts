import { test, expect } from '@playwright/test';

const BASE_URL = 'https://israelgrowthventure.com';
const ADMIN_EMAIL = 'postmaster@israelgrowthventure.com';
const ADMIN_PASSWORD = 'Admin@igv2025#';

test.describe('CMS Pages Test', () => {
  test('CMS loads pages list', async ({ page }) => {
    // Enable console log
    page.on('console', msg => console.log('Browser:', msg.text()));
    page.on('response', response => {
      if (response.url().includes('pages/list')) {
        console.log('API Response:', response.status(), response.url());
      }
    });

    // 1. Login first
    console.log('Step 1: Login...');
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    console.log('After login, URL:', page.url());
    
    // Check if token is stored
    const token = await page.evaluate(() => localStorage.getItem('admin_token'));
    console.log('Token stored:', token ? 'YES' : 'NO');
    
    // Navigate manually to admin dashboard if still on login
    if (page.url().includes('/login')) {
      console.log('Still on login, navigating to dashboard...');
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
    }
    console.log('Login successful, URL:', page.url());
    
    // 2. Navigate to CMS
    console.log('Step 2: Go to CMS...');
    await page.goto(`${BASE_URL}/admin/crm/cms`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for API call
    
    // 3. Take screenshot
    await page.screenshot({ path: 'cms-test-result.png', fullPage: true });
    console.log('Screenshot saved: cms-test-result.png');
    
    // 4. Check for error messages
    const errorText = await page.locator('text=Erreur').count();
    const noPageText = await page.locator('text=Aucune page').count();
    
    console.log('Error messages found:', errorText);
    console.log('No page message found:', noPageText);
    
    // 5. Check select options
    const selectOptions = await page.locator('select option').count();
    console.log('Select options:', selectOptions);
    
    // 6. Get all option values
    const options = await page.locator('select').first().locator('option').allTextContents();
    console.log('Page options:', options);
    
    // Assert we have pages
    expect(selectOptions).toBeGreaterThan(0);
    expect(errorText).toBe(0);
    
    console.log('✅ CMS test passed!');
  });
});
