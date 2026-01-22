#!/usr/bin/env python3
"""Capture visual proofs for CRM reconstruction - with localStorage clear and explicit lang change"""

import os
from datetime import datetime
from playwright.sync_api import sync_playwright

FRONTEND_URL = "https://israelgrowthventure.com"
ADMIN_EMAIL = "postmaster@israelgrowthventure.com"
ADMIN_PASSWORD = "Admin@igv2025#"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "visual_proofs_v2")

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_crm_proofs():
    print("=" * 60)
    print("   Visual Proof Capture - CRM Reconstruction V2")
    print("   (With localStorage clear and explicit language change)")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test HE version with login
        print("\n🇮🇱 Capturing Hebrew (HE) version...")
        context_he = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="he-IL"
        )
        page_he = context_he.new_page()
        
        # Clear localStorage and set language
        print("   🧹 Clearing localStorage and setting HE language...")
        page_he.goto(FRONTEND_URL, wait_until="networkidle", timeout=60000)
        page_he.evaluate("""
            localStorage.clear();
            localStorage.setItem('i18nextLng', 'he');
        """)
        
        # Navigate to login with lang parameter
        print("   📝 Navigating to login with ?lang=he...")
        page_he.goto(f"{FRONTEND_URL}/admin/login?lang=he", wait_until="networkidle", timeout=60000)
        page_he.wait_for_timeout(2000)
        page_he.screenshot(path=os.path.join(OUTPUT_DIR, "01_login_HE.png"))
        print("   ✅ 01_login_HE.png")
        
        # Fill login form
        try:
            page_he.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL)
            page_he.fill('input[type="password"], input[name="password"]', ADMIN_PASSWORD)
            page_he.click('button[type="submit"]')
            page_he.wait_for_timeout(3000)
            page_he.screenshot(path=os.path.join(OUTPUT_DIR, "02_after_login_HE.png"))
            print("   ✅ 02_after_login_HE.png")
            
            # Navigate to CRM Leads
            page_he.goto(f"{FRONTEND_URL}/admin/crm/leads?lang=he", wait_until="networkidle", timeout=60000)
            page_he.wait_for_timeout(2000)
            page_he.screenshot(path=os.path.join(OUTPUT_DIR, "03_crm_leads_HE.png"))
            print("   ✅ 03_crm_leads_HE.png")
            
            # Navigate to CRM Users
            page_he.goto(f"{FRONTEND_URL}/admin/crm/users?lang=he", wait_until="networkidle", timeout=60000)
            page_he.wait_for_timeout(2000)
            page_he.screenshot(path=os.path.join(OUTPUT_DIR, "04_crm_users_HE.png"))
            print("   ✅ 04_crm_users_HE.png")
            
        except Exception as e:
            print(f"   ⚠️ Login issue: {e}")
            page_he.screenshot(path=os.path.join(OUTPUT_DIR, "error_login_HE.png"))
        
        context_he.close()
        
        # Test EN version with login
        print("\n🇺🇸 Capturing English (EN) version...")
        context_en = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            locale="en-US"
        )
        page_en = context_en.new_page()
        
        # Clear localStorage and set language
        print("   🧹 Clearing localStorage and setting EN language...")
        page_en.goto(FRONTEND_URL, wait_until="networkidle", timeout=60000)
        page_en.evaluate("""
            localStorage.clear();
            localStorage.setItem('i18nextLng', 'en');
        """)
        
        # Navigate to login
        print("   📝 Navigating to login with ?lang=en...")
        page_en.goto(f"{FRONTEND_URL}/admin/login?lang=en", wait_until="networkidle", timeout=60000)
        page_en.wait_for_timeout(2000)
        page_en.screenshot(path=os.path.join(OUTPUT_DIR, "05_login_EN.png"))
        print("   ✅ 05_login_EN.png")
        
        # Fill login form
        try:
            page_en.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL)
            page_en.fill('input[type="password"], input[name="password"]', ADMIN_PASSWORD)
            page_en.click('button[type="submit"]')
            page_en.wait_for_timeout(3000)
            page_en.screenshot(path=os.path.join(OUTPUT_DIR, "06_after_login_EN.png"))
            print("   ✅ 06_after_login_EN.png")
            
            # Navigate to CRM Leads
            page_en.goto(f"{FRONTEND_URL}/admin/crm/leads?lang=en", wait_until="networkidle", timeout=60000)
            page_en.wait_for_timeout(2000)
            page_en.screenshot(path=os.path.join(OUTPUT_DIR, "07_crm_leads_EN.png"))
            print("   ✅ 07_crm_leads_EN.png")
            
            # Navigate to CRM Users
            page_en.goto(f"{FRONTEND_URL}/admin/crm/users?lang=en", wait_until="networkidle", timeout=60000)
            page_en.wait_for_timeout(2000)
            page_en.screenshot(path=os.path.join(OUTPUT_DIR, "08_crm_users_EN.png"))
            print("   ✅ 08_crm_users_EN.png")
            
        except Exception as e:
            print(f"   ⚠️ Login issue: {e}")
            page_en.screenshot(path=os.path.join(OUTPUT_DIR, "error_login_EN.png"))
        
        context_en.close()
        browser.close()
        
    print("\n" + "=" * 60)
    print(f"   Screenshots saved to: {OUTPUT_DIR}")
    print("=" * 60)
    
    # List files
    files = os.listdir(OUTPUT_DIR)
    print(f"\n📁 Captured files:")
    for f in sorted(files):
        full_path = os.path.join(OUTPUT_DIR, f)
        size = os.path.getsize(full_path)
        print(f"   - {f} ({size:,} bytes)")

if __name__ == "__main__":
    capture_crm_proofs()
