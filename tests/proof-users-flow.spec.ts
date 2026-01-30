import { test, expect } from '@playwright/test';

/**
 * Test end-to-end: CREATE → ASSIGN → LOGIN → DELETE
 * Preuves visuelles obligatoires: 4 screenshots en PROD
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'postmaster@israelgrowthventure.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@igv2025#';
const BASE_URL = 'https://israelgrowthventure.com';

test.describe('Users Flow PROD - CREATE → ASSIGN → LOGIN → DELETE', () => {
  test.setTimeout(180000); // 3 minutes timeout total
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const testUserEmail = `cp_user_${timestamp}@example.com`;
  const testUserPassword = 'TestUser2026!';
  const testUserFirstName = 'Test';
  const testUserLastName = 'User';
  
  let userId: string | null = null;

  test('Flow complet avec 4 screenshots PROD', async ({ page }) => {
    // ====================================================================
    // ÉTAPE 1: LOGIN ADMIN
    // ====================================================================
    await test.step('1. Login admin', async () => {
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/admin/**', { timeout: 10000 });
      console.log('✅ Admin login réussi');
    });

    // ====================================================================
    // ÉTAPE 2: CREATE USER + SCREENSHOT CP2
    // ====================================================================
    await test.step('2. Créer user test', async () => {
      await page.goto(`${BASE_URL}/admin/crm/users`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);

      // Attendre que le bouton soit visible et cliquable
      const btnNewUser = page.locator('[data-testid="btn-new-user"]');
      await btnNewUser.waitFor({ state: 'visible', timeout: 15000 });
      await btnNewUser.click();
      await page.waitForTimeout(1500);

      // Remplir formulaire (champs exacts du modal)
      await page.fill('input[type="email"]', testUserEmail);
      await page.fill('input[type="text"][value=""]', testUserFirstName); // Prénom
      await page.locator('input[type="text"]').nth(1).fill(testUserLastName); // Nom
      await page.fill('input[type="password"]', testUserPassword);
      
      // Sélectionner rôle commercial (déjà sélectionné par défaut)
      await page.selectOption('select', 'commercial');

      // Soumettre (bouton "Créer" dans modal)
      await page.click('button[type="submit"]');
      
      // Attendre toast success + fermeture modal
      await page.waitForTimeout(3000);

      // Rechercher user créé pour vérifier visibilité
      const searchInput = page.locator('input[type="text"][placeholder*="Rechercher"]').first();
      await searchInput.fill(testUserEmail);
      await page.waitForTimeout(1500);

      // Vérifier présence email dans table
      const emailCell = page.locator(`td:has-text("${testUserEmail}"), div:has-text("${testUserEmail}")`).first();
      await expect(emailCell).toBeVisible({ timeout: 5000 });

      // SCREENSHOT CP2
      await page.screenshot({
        path: `verification_preuves/screenshots/CP2_USER_VISIBLE_${timestamp}_PROD.png`,
        fullPage: true
      });
      console.log(`✅ CP2 Screenshot: CP2_USER_VISIBLE_${timestamp}_PROD.png`);
      console.log(`✅ User créé: ${testUserEmail}`);
    });

    // ====================================================================
    // ÉTAPE 3: ASSIGN PERMISSIONS + SCREENSHOT CP3
    // ====================================================================
    await test.step('3. Assigner permissions', async () => {
      // Cliquer sur le user pour ouvrir fiche/modal édition
      const userRow = page.locator(`tr:has-text("${testUserEmail}"), div:has-text("${testUserEmail}")`).first();
      const editButton = userRow.locator('button:has-text("Edit"), button:has-text("Modifier"), svg').first();
      await editButton.click();
      await page.waitForTimeout(1000);

      // Changer role vers admin
      const roleSelect = page.locator('select[name="role"], select[id*="role"]').first();
      await roleSelect.selectOption('admin');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Enregistrer"), button:has-text("Save"), button[type="submit"]').first();
      await saveButton.click();
      await page.waitForTimeout(2000);

      // Vérifier que role admin est visible
      const adminBadge = page.locator(`tr:has-text("${testUserEmail}") td:has-text("admin"), div:has-text("${testUserEmail}") ~ div:has-text("admin")`).first();
      await expect(adminBadge).toBeVisible({ timeout: 5000 });

      // SCREENSHOT CP3
      await page.screenshot({
        path: `verification_preuves/screenshots/CP3_PERMS_VISIBLE_${timestamp}_PROD.png`,
        fullPage: true
      });
      console.log(`✅ CP3 Screenshot: CP3_PERMS_VISIBLE_${timestamp}_PROD.png`);
      console.log(`✅ Permissions assignées: role=admin`);
    });

    // ====================================================================
    // ÉTAPE 4: LOGIN USER TEST + SCREENSHOT CP4
    // ====================================================================
    await test.step('4. Login user test', async () => {
      // Logout admin
      const logoutButton = page.locator('button:has-text("Déconnexion"), button:has-text("Logout"), a:has-text("Déconnexion")').first();
      await logoutButton.click();
      await page.waitForTimeout(1000);

      // Login user test
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[type="email"]', testUserEmail);
      await page.fill('input[type="password"]', testUserPassword);
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/admin/**', { timeout: 10000 });

      // Vérifier élément UI post-login (header user, menu, etc.)
      const userIndicator = page.locator(`text=${testUserEmail}, text=${testUserFirstName}`).first();
      await expect(userIndicator).toBeVisible({ timeout: 5000 });

      // SCREENSHOT CP4
      await page.screenshot({
        path: `verification_preuves/screenshots/CP4_LOGIN_OK_${timestamp}_PROD.png`,
        fullPage: true
      });
      console.log(`✅ CP4 Screenshot: CP4_LOGIN_OK_${timestamp}_PROD.png`);
      console.log(`✅ User test connecté: ${testUserEmail}`);
    });

    // ====================================================================
    // ÉTAPE 5: DELETE USER + SCREENSHOT CP5
    // ====================================================================
    await test.step('5. Supprimer user test', async () => {
      // Logout user test
      const logoutButton = page.locator('button:has-text("Déconnexion"), button:has-text("Logout"), a:has-text("Déconnexion")').first();
      await logoutButton.click();
      await page.waitForTimeout(1000);

      // Re-login admin
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
      await page.fill('input[type="email"]', ADMIN_EMAIL);
      await page.fill('input[type="password"]', ADMIN_PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/admin/**', { timeout: 10000 });

      // Aller sur page Users
      await page.goto(`${BASE_URL}/admin/crm/users`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Rechercher user test
      const searchInput = page.locator('input[placeholder*="Recherch"], input[type="search"]').first();
      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchInput.fill(testUserEmail);
        await page.waitForTimeout(1000);
      }

      // Supprimer
      const userRow = page.locator(`tr:has-text("${testUserEmail}"), div:has-text("${testUserEmail}")`).first();
      const deleteButton = userRow.locator('button:has-text("Supprimer"), button:has-text("Delete"), svg[class*="trash"]').first();
      await deleteButton.click();
      await page.waitForTimeout(500);

      // Confirmer suppression si modal
      const confirmButton = page.locator('button:has-text("Confirmer"), button:has-text("Oui"), button:has-text("Delete")').first();
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }
      await page.waitForTimeout(2000);

      // Vérifier absence (recherche = 0 résultats)
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill(testUserEmail);
        await page.waitForTimeout(1000);
      }

      // Vérifier message "Aucun résultat" ou table vide
      const noResultsIndicator = page.locator('text=/Aucun.*résultat|No.*results|0.*utilisateur/i').first();
      await expect(noResultsIndicator).toBeVisible({ timeout: 5000 });

      // SCREENSHOT CP5
      await page.screenshot({
        path: `verification_preuves/screenshots/CP5_USER_DELETED_${timestamp}_PROD.png`,
        fullPage: true
      });
      console.log(`✅ CP5 Screenshot: CP5_USER_DELETED_${timestamp}_PROD.png`);
      console.log(`✅ User supprimé: ${testUserEmail}`);
    });

    // ====================================================================
    // ÉTAPE 6: VÉRIFIER LOGIN USER SUPPRIMÉ = ÉCHEC
    // ====================================================================
    await test.step('6. Vérifier login user supprimé échoue', async () => {
      // Logout admin
      const logoutButton = page.locator('button:has-text("Déconnexion"), button:has-text("Logout"), a:has-text("Déconnexion")').first();
      await logoutButton.click();
      await page.waitForTimeout(1000);

      // Tenter login user supprimé
      await page.goto(`${BASE_URL}/admin`);
      await page.waitForLoadState('networkidle');
      
      await page.fill('input[type="email"]', testUserEmail);
      await page.fill('input[type="password"]', testUserPassword);
      await page.click('button[type="submit"]');
      
      // Attendre message erreur
      await page.waitForTimeout(2000);

      // Vérifier message erreur visible (Unauthorized, Invalid credentials, etc.)
      const errorMessage = page.locator('text=/Invalid.*credentials|Unauthorized|Identifiants.*incorrects/i').first();
      await expect(errorMessage).toBeVisible({ timeout: 5000 });

      console.log(`✅ Assertion: Login user supprimé = ÉCHEC (Unauthorized/Invalid credentials)`);
    });
  });
});
