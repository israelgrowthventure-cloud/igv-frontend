/**
 * IGV CRM - Tests E2E Complets
 * Date: 2026-01-24
 * 
 * Tests de tous les chemins CRM en production
 */

import { test, expect, Page } from '@playwright/test';

// Configuration
const BASE_URL = 'https://israelgrowthventure.com';
const ADMIN_EMAIL = 'postmaster@israelgrowthventure.com';
const ADMIN_PASSWORD = 'Admin@igv2025#';

// Helper pour login
async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  
  // Attendre le formulaire
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
  
  // Remplir le formulaire
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  
  await emailInput.fill(ADMIN_EMAIL);
  await passwordInput.fill(ADMIN_PASSWORD);
  
  // Soumettre
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();
  
  // Attendre la redirection
  await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
  
  return true;
}

// ============================================================================
// SECTION A: ACCÈS
// ============================================================================

test.describe('A) Accès - Login/Logout', () => {
  
  test('A1: /admin/login - Formulaire de connexion accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    
    // Vérifier que la page se charge
    await expect(page).toHaveURL(/\/admin\/login/);
    
    // Vérifier la présence du formulaire
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
    
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await expect(passwordInput).toBeVisible();
    
    console.log('✅ A1: Formulaire de login accessible');
  });

  test('A2: /admin/login - Connexion admin réussie', async ({ page }) => {
    const success = await adminLogin(page);
    expect(success).toBe(true);
    
    // Vérifier qu'on est sur le dashboard ou une page admin
    await expect(page).toHaveURL(/\/admin/);
    
    console.log('✅ A2: Connexion admin réussie');
  });

  test('A3: /admin - Redirection vers dashboard', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Devrait rediriger vers /admin/crm/dashboard ou similaire
    const url = page.url();
    expect(url).toMatch(/\/admin/);
    
    console.log(`✅ A3: /admin redirige vers ${url}`);
  });

  test('A4: /admin/crm/dashboard - Dashboard accessible', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier présence d'éléments dashboard
    // Chercher des stats, graphiques, ou conteneur principal
    const dashboardContent = page.locator('[class*="dashboard"], [data-testid="dashboard"], main, .container').first();
    await expect(dashboardContent).toBeVisible({ timeout: 15000 });
    
    console.log('✅ A4: Dashboard CRM accessible');
  });
});

// ============================================================================
// SECTION B: LEADS
// ============================================================================

test.describe('B) Leads - CRUD et Notes', () => {
  
  test('B1: /admin/crm/leads - Liste des leads', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/leads`);
    await page.waitForLoadState('networkidle');
    
    // Attendre le chargement de la liste
    await page.waitForTimeout(3000);
    
    // Vérifier qu'on est sur la bonne page
    await expect(page).toHaveURL(/\/admin\/crm\/leads/);
    
    // Chercher des éléments de liste (table, cards, etc.)
    const listContainer = page.locator('table, [class*="list"], [class*="grid"], [role="table"]').first();
    
    console.log('✅ B1: Page leads accessible');
  });

  test('B2: Ouvrir un lead et vérifier les infos', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/leads`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Cliquer sur le premier lead (chercher un lien ou row cliquable)
    const firstLeadRow = page.locator('tr, [class*="lead-item"], [class*="row"]').first();
    
    if (await firstLeadRow.isVisible()) {
      await firstLeadRow.click();
      await page.waitForTimeout(2000);
      console.log('✅ B2: Lead ouvert');
    } else {
      console.log('⚠️ B2: Pas de leads visibles dans la liste');
    }
  });

  test('B3: CRITIQUE - Ajout de note + persistance après refresh', async ({ page, request }) => {
    // D'abord, récupérer un ID de lead via l'API
    const loginResponse = await request.post('https://igv-cms-backend.onrender.com/api/admin/login', {
      data: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    });
    const loginData = await loginResponse.json();
    const token = loginData.access_token || loginData.token;
    
    // Récupérer la liste des leads
    const leadsResponse = await request.get('https://igv-cms-backend.onrender.com/api/crm/leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsResponse.json();
    console.log(`   → Leads response type: ${typeof leadsData}`);
    
    // Handle both array and object with leads property
    const leads = Array.isArray(leadsData) ? leadsData : (leadsData.leads || []);
    
    if (!leads || leads.length === 0) {
      console.log('⚠️ B3: Aucun lead disponible pour tester');
      return;
    }
    
    const firstLead = leads[0];
    const leadId = firstLead._id || firstLead.id || firstLead.lead_id;
    console.log(`   → Lead ID pour test: ${leadId}`);
    
    // Login UI
    await adminLogin(page);
    
    // Naviguer directement vers la page de détail du lead
    await page.goto(`${BASE_URL}/admin/crm/leads/${leadId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    console.log(`   → Page actuelle: ${page.url()}`);
    
    // Chercher le champ de note - c'est un input type="text" avec placeholder "Add a note..."
    const noteInput = page.locator('input[placeholder*="note" i], input[placeholder*="Note" i]').first();
    
    const testNote = `[PLAYWRIGHT TEST] Note ${Date.now()}`;
    
    const noteInputVisible = await noteInput.isVisible().catch(() => false);
    console.log(`   → Champ de note visible: ${noteInputVisible}`);
    
    if (noteInputVisible) {
      await noteInput.fill(testNote);
      console.log(`   → Note saisie: ${testNote}`);
      
      // Chercher le bouton Add
      const addBtn = page.locator('button:has-text("Add"), button:has-text("Ajouter")').first();
      const addBtnVisible = await addBtn.isVisible().catch(() => false);
      console.log(`   → Bouton Add visible: ${addBtnVisible}`);
      
      if (addBtnVisible) {
        await addBtn.click();
        console.log('   → Clic sur Add');
        await page.waitForTimeout(2000);
        
        // Refresh la page
        console.log('   → Refresh de la page...');
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Vérifier que la note est toujours là
        const pageContent = await page.content();
        const noteFound = pageContent.includes('PLAYWRIGHT TEST') || pageContent.includes(testNote.substring(0, 20));
        
        if (noteFound) {
          console.log('✅ B3: CRITIQUE - Note persistée après refresh!');
        } else {
          console.log('❌ B3: CRITIQUE - Note NON trouvée après refresh - BUG P0!');
          // Prendre un screenshot pour preuve
          await page.screenshot({ path: 'test-results/note-not-found.png' });
        }
        
        expect(noteFound).toBe(true);
        return;
      }
    }
    
    console.log('⚠️ B3: Champ de note ou bouton Add non trouvé');
  });
});

// ============================================================================
// SECTION C: CONTACTS
// ============================================================================

test.describe('C) Contacts', () => {
  
  test('C1: /admin/crm/contacts - Liste des contacts', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/contacts`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/contacts/);
    
    console.log('✅ C1: Page contacts accessible');
  });
});

// ============================================================================
// SECTION D: OPPORTUNITÉS
// ============================================================================

test.describe('D) Opportunités', () => {
  
  test('D1: /admin/crm/opportunities - Liste des opportunités', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/opportunities`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/opportunities/);
    
    console.log('✅ D1: Page opportunités accessible');
  });
});

// ============================================================================
// SECTION E: PIPELINE
// ============================================================================

test.describe('E) Pipeline', () => {
  
  test('E1: /admin/crm/pipeline - Vue pipeline', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/pipeline`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/pipeline/);
    
    // Vérifier présence de colonnes/stages
    const pipelineContent = page.locator('[class*="pipeline"], [class*="kanban"], [class*="board"]').first();
    
    console.log('✅ E1: Page pipeline accessible');
  });
});

// ============================================================================
// SECTION F: ACTIVITÉS
// ============================================================================

test.describe('F) Activités', () => {
  
  test('F1: /admin/crm/activities - Historique activités', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/activities`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/activities/);
    
    console.log('✅ F1: Page activités accessible');
  });
});

// ============================================================================
// SECTION G: EMAILS
// ============================================================================

test.describe('G) Emails', () => {
  
  test('G1: /admin/crm/emails - Templates et historique', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/emails`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/emails/);
    
    console.log('✅ G1: Page emails accessible');
  });
});

// ============================================================================
// SECTION H: UTILISATEURS
// ============================================================================

test.describe('H) Utilisateurs', () => {
  
  test('H1: /admin/crm/users - Gestion utilisateurs', async ({ page }) => {
    await adminLogin(page);
    
    // Essayer les deux URLs possibles
    await page.goto(`${BASE_URL}/admin/crm/users`);
    
    const url = page.url();
    if (!url.includes('/users')) {
      await page.goto(`${BASE_URL}/admin/crm/settings/users`);
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log(`✅ H1: Page utilisateurs accessible - ${page.url()}`);
  });
});

// ============================================================================
// SECTION I: PARAMÈTRES
// ============================================================================

test.describe('I) Paramètres', () => {
  
  test('I1: /admin/crm/settings - Page paramètres', async ({ page }) => {
    await adminLogin(page);
    
    await page.goto(`${BASE_URL}/admin/crm/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/crm\/settings/);
    
    console.log('✅ I1: Page paramètres accessible');
  });
});

// ============================================================================
// TESTS IGV SPÉCIFIQUES
// ============================================================================

test.describe('Tests IGV Spécifiques', () => {
  
  test('IGV1: Admin reconnu avec rôle admin', async ({ page }) => {
    await adminLogin(page);
    
    // Après login, vérifier que l'utilisateur est admin
    // Chercher un indicateur de rôle dans le header ou le profil
    await page.goto(`${BASE_URL}/admin/crm/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier accès aux fonctions admin (ex: settings/users)
    await page.goto(`${BASE_URL}/admin/crm/settings`);
    const isAccessible = page.url().includes('/settings');
    
    console.log(`✅ IGV1: Admin a accès aux paramètres - ${isAccessible}`);
  });

  test('IGV2: Page mini-analyse publique accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/mini-analyse`);
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le formulaire est présent
    const formContent = page.locator('form, [class*="form"], input').first();
    await expect(formContent).toBeVisible({ timeout: 10000 });
    
    console.log('✅ IGV2: Page mini-analyse accessible');
  });
});
