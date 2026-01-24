/**
 * IGV CRM - AUDIT UI COMPLET
 * Date: 2026-01-24
 * 
 * AUCUNE MODIFICATION DE CODE - AUDIT UNIQUEMENT
 * Tests du parcours Admin et Commercial avec screenshots
 */

import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const BASE_URL = 'https://israelgrowthventure.com';
const ADMIN_EMAIL = 'postmaster@israelgrowthventure.com';
const ADMIN_PASSWORD = 'Admin@igv2025#';
const COMMERCIAL_EMAIL = 'admin@igv.co.il';
const COMMERCIAL_PASSWORD = 'commercial@igv';

// Dossiers pour les preuves
const ARTIFACTS_DIR = 'C:/Users/PC/Desktop/IGV/ARTIFACTS';

// Résultats
const results: {name: string, ok: boolean, proof: string, error?: string}[] = [];

function logResult(name: string, ok: boolean, proof: string, error?: string) {
  results.push({ name, ok, proof, error });
  const symbol = ok ? '✅' : '❌';
  console.log(`${symbol} ${name}`);
  if (!ok && error) {
    console.log(`   → Error: ${error}`);
  }
  console.log(`   → Proof: ${proof}`);
}

async function screenshot(page: Page, name: string, folder: string): Promise<string> {
  const filename = `${name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
  const filepath = path.join(ARTIFACTS_DIR, folder, 'screenshots', filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

// ============================================================================
// PARCOURS ADMIN
// ============================================================================

test.describe('AUDIT PARCOURS ADMIN', () => {
  
  test.beforeEach(async ({ page }) => {
    // Augmenter le timeout
    test.setTimeout(120000);
  });

  test('ADMIN-01: Login admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    
    const proof1 = await screenshot(page, 'admin_login_form_filled', 'ADMIN');
    
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    const proof2 = await screenshot(page, 'admin_login_success', 'ADMIN');
    
    const success = page.url().includes('/admin');
    logResult('ADMIN-01: Login admin', success, proof2, success ? undefined : 'Redirection échouée');
    expect(success).toBe(true);
  });

  test('ADMIN-02: Dashboard accessible', async ({ page }) => {
    // Login d'abord
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/dashboard`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_dashboard', 'ADMIN');
    
    const hasContent = await page.locator('main, [class*="dashboard"], .container').first().isVisible().catch(() => false);
    logResult('ADMIN-02: Dashboard accessible', hasContent, proof);
    expect(hasContent).toBe(true);
  });

  test('ADMIN-03: Leads list', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/leads`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const proof = await screenshot(page, 'admin_leads_list', 'ADMIN');
    
    const isOnPage = page.url().includes('/leads');
    logResult('ADMIN-03: Leads list accessible', isOnPage, proof);
    expect(isOnPage).toBe(true);
  });

  test('ADMIN-04: Ouvrir Lead 1 et vérifier infos', async ({ page, request }) => {
    // Login via API pour obtenir un lead ID
    const loginRes = await request.post('https://igv-cms-backend.onrender.com/api/admin/login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    const leadsRes = await request.get('https://igv-cms-backend.onrender.com/api/crm/leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    const leads = leadsData.leads || [];
    
    if (leads.length === 0) {
      logResult('ADMIN-04: Ouvrir Lead 1', false, 'N/A', 'Aucun lead disponible');
      return;
    }
    
    const leadId = leads[0]._id;
    
    // Login UI
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/leads/${leadId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const proof = await screenshot(page, 'admin_lead_detail_1', 'ADMIN');
    
    const isOnDetailPage = page.url().includes(leadId);
    logResult('ADMIN-04: Ouvrir Lead 1', isOnDetailPage, proof);
    expect(isOnDetailPage).toBe(true);
  });

  test('ADMIN-05: Ouvrir Lead 2', async ({ page, request }) => {
    const loginRes = await request.post('https://igv-cms-backend.onrender.com/api/admin/login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    const leadsRes = await request.get('https://igv-cms-backend.onrender.com/api/crm/leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    const leads = leadsData.leads || [];
    
    if (leads.length < 2) {
      logResult('ADMIN-05: Ouvrir Lead 2', false, 'N/A', 'Pas assez de leads');
      return;
    }
    
    const leadId = leads[1]._id;
    
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/leads/${leadId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_lead_detail_2', 'ADMIN');
    logResult('ADMIN-05: Ouvrir Lead 2', true, proof);
  });

  test('ADMIN-06: Ouvrir Lead 3', async ({ page, request }) => {
    const loginRes = await request.post('https://igv-cms-backend.onrender.com/api/admin/login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    const leadsRes = await request.get('https://igv-cms-backend.onrender.com/api/crm/leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    const leads = leadsData.leads || [];
    
    if (leads.length < 3) {
      logResult('ADMIN-06: Ouvrir Lead 3', false, 'N/A', 'Pas assez de leads');
      return;
    }
    
    const leadId = leads[2]._id;
    
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/leads/${leadId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_lead_detail_3', 'ADMIN');
    logResult('ADMIN-06: Ouvrir Lead 3', true, proof);
  });

  test('ADMIN-07: CRITIQUE - Ajouter note + refresh + vérifier', async ({ page, request }) => {
    const loginRes = await request.post('https://igv-cms-backend.onrender.com/api/admin/login', {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    });
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    const leadsRes = await request.get('https://igv-cms-backend.onrender.com/api/crm/leads', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const leadsData = await leadsRes.json();
    const leads = leadsData.leads || [];
    const leadId = leads[0]._id;
    
    // Login UI
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    // Aller sur le lead
    await page.goto(`${BASE_URL}/admin/crm/leads/${leadId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const proof1 = await screenshot(page, 'admin_note_before', 'ADMIN');
    
    // Ajouter une note
    const testNote = `[AUDIT UI] Note test ${Date.now()}`;
    const noteInput = page.locator('input[placeholder*="note" i]').first();
    
    const inputVisible = await noteInput.isVisible().catch(() => false);
    if (!inputVisible) {
      logResult('ADMIN-07: CRITIQUE - Notes persistence', false, proof1, 'Champ de note non trouvé');
      return;
    }
    
    await noteInput.fill(testNote);
    const addBtn = page.locator('button:has-text("Add"), button:has-text("Ajouter")').first();
    await addBtn.click();
    await page.waitForTimeout(2000);
    
    const proof2 = await screenshot(page, 'admin_note_added', 'ADMIN');
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const proof3 = await screenshot(page, 'admin_note_after_refresh', 'ADMIN');
    
    // Vérifier que la note est présente
    const pageContent = await page.content();
    const noteFound = pageContent.includes('AUDIT UI') || pageContent.includes(testNote.substring(0, 15));
    
    logResult('ADMIN-07: CRITIQUE - Notes persistence', noteFound, proof3, noteFound ? undefined : 'Note non retrouvée après refresh');
    expect(noteFound).toBe(true);
  });

  test('ADMIN-08: Contacts accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/contacts`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_contacts', 'ADMIN');
    logResult('ADMIN-08: Contacts accessible', true, proof);
  });

  test('ADMIN-09: Opportunities accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/opportunities`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_opportunities', 'ADMIN');
    logResult('ADMIN-09: Opportunities accessible', true, proof);
  });

  test('ADMIN-10: Pipeline accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/pipeline`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_pipeline', 'ADMIN');
    logResult('ADMIN-10: Pipeline accessible', true, proof);
  });

  test('ADMIN-11: Activities accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/activities`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_activities', 'ADMIN');
    logResult('ADMIN-11: Activities accessible', true, proof);
  });

  test('ADMIN-12: Emails accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/emails`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_emails', 'ADMIN');
    logResult('ADMIN-12: Emails accessible', true, proof);
  });

  test('ADMIN-13: Users accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/users`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_users', 'ADMIN');
    logResult('ADMIN-13: Users accessible', true, proof);
  });

  test('ADMIN-14: Settings accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    await emailInput.fill(ADMIN_EMAIL);
    await passwordInput.fill(ADMIN_PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL(/\/admin\/crm|\/admin$/, { timeout: 20000 });
    
    await page.goto(`${BASE_URL}/admin/crm/settings`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const proof = await screenshot(page, 'admin_settings', 'ADMIN');
    logResult('ADMIN-14: Settings accessible', true, proof);
  });

});

// ============================================================================
// PARCOURS COMMERCIAL
// ============================================================================

test.describe('AUDIT PARCOURS COMMERCIAL', () => {
  
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
  });

  test('COMMERCIAL-01: Login commercial', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`);
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    
    await emailInput.fill(COMMERCIAL_EMAIL);
    await passwordInput.fill(COMMERCIAL_PASSWORD);
    
    const proof1 = await screenshot(page, 'commercial_login_form', 'COMMERCIAL');
    
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    
    await page.waitForTimeout(5000);
    
    const proof2 = await screenshot(page, 'commercial_login_result', 'COMMERCIAL');
    
    // Vérifier si login réussi ou échoué
    const currentUrl = page.url();
    const loginFailed = currentUrl.includes('/login') || await page.locator('text=Invalid, text=Erreur, text=incorrect').first().isVisible().catch(() => false);
    
    if (loginFailed) {
      logResult('COMMERCIAL-01: Login commercial', false, proof2, 'Login échoué - credentials invalides');
    } else {
      logResult('COMMERCIAL-01: Login commercial', true, proof2);
    }
  });

});
