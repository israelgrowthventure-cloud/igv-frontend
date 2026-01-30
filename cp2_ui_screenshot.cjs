const { chromium } = require('playwright');

async function captureUserCreation() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login admin
    console.log('📋 CP2 UI - Login admin...');
    await page.goto('https://israelgrowthventure.com/admin');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'postmaster@israelgrowthventure.com');
    await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'Admin@igv2025#');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/**', { timeout: 10000 });
    console.log('✅ Login admin réussi');

    // Naviguer vers Users
    console.log('📋 Accès page CRM Users...');
    await page.goto('https://israelgrowthventure.com/admin/crm/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Screenshot CP2
    const screenshotPath = `C:\\Users\\PC\\Desktop\\IGV\\igv-frontend\\verification_preuves\\screenshots\\CP2_USERS_VISIBLE_${timestamp}_PROD.png`;
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    console.log(`✅ Screenshot CP2 sauvegardé: ${screenshotPath}`);

    // Vérifier présence users list
    const usersListVisible = await page.locator('table, [role="table"], .users-list').count();
    if (usersListVisible > 0) {
      console.log('✅ VALIDATION: Liste users visible dans UI');
    } else {
      console.log('⚠️  User test NON VISIBLE dans table UI');
    }

  } catch (error) {
    console.error('❌ Erreur CP2 UI:', error.message);
  } finally {
    await browser.close();
  }
}

captureUserCreation();
