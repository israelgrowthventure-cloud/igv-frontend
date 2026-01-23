#!/usr/bin/env python3
"""Test notes functionality in CRM - create note and verify it appears"""

import os
from datetime import datetime
from playwright.sync_api import sync_playwright

FRONTEND_URL = "https://israelgrowthventure.com"
ADMIN_EMAIL = "postmaster@israelgrowthventure.com"
ADMIN_PASSWORD = "Admin@igv2025#"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "notes_proofs")

os.makedirs(OUTPUT_DIR, exist_ok=True)

def test_notes():
    print("=" * 60)
    print("   Notes Functionality Test")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        
        # Login
        print("\n📝 Step 1: Login...")
        page.goto(f"{FRONTEND_URL}/admin/login", wait_until="networkidle", timeout=60000)
        page.fill('input[type="email"]', ADMIN_EMAIL)
        page.fill('input[type="password"]', ADMIN_PASSWORD)
        page.click('button[type="submit"]')
        page.wait_for_timeout(3000)
        print("   ✅ Logged in")
        
        # Navigate to leads
        print("\n📝 Step 2: Navigate to leads...")
        page.goto(f"{FRONTEND_URL}/admin/crm/leads", wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "01_leads_list.png"))
        print("   ✅ 01_leads_list.png")
        
        # Click on first lead to open detail
        print("\n📝 Step 3: Open first lead...")
        try:
            # Try clicking on first table row
            first_row = page.locator('table tbody tr').first
            if first_row:
                first_row.click()
                page.wait_for_timeout(2000)
                page.screenshot(path=os.path.join(OUTPUT_DIR, "02_lead_detail_before_note.png"))
                print("   ✅ 02_lead_detail_before_note.png")
                
                # Scroll down to see notes section
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1000)
                page.screenshot(path=os.path.join(OUTPUT_DIR, "03_notes_section.png"))
                print("   ✅ 03_notes_section.png")
                
                # Try to add a note
                print("\n📝 Step 4: Add a test note...")
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                note_text = f"Test note added at {timestamp}"
                
                note_input = page.locator('input[placeholder*="note"], input[placeholder*="Note"]')
                if note_input.count() > 0:
                    note_input.first.fill(note_text)
                    page.wait_for_timeout(500)
                    
                    # Click add button
                    add_btn = page.locator('button:has-text("Add"), button:has-text("Ajouter"), button:has-text("הוסף")')
                    if add_btn.count() > 0:
                        add_btn.first.click()
                        page.wait_for_timeout(2000)
                        page.screenshot(path=os.path.join(OUTPUT_DIR, "04_after_adding_note.png"))
                        print("   ✅ 04_after_adding_note.png")
                        print(f"   ✅ Note added: '{note_text}'")
                    else:
                        print("   ⚠️ Could not find Add button")
                else:
                    print("   ⚠️ Could not find note input field")
                
            else:
                print("   ⚠️ No leads found in table")
                
        except Exception as e:
            print(f"   ⚠️ Error: {e}")
            page.screenshot(path=os.path.join(OUTPUT_DIR, "error.png"))
        
        # Navigate to contacts and test notes there too
        print("\n📝 Step 5: Navigate to contacts...")
        page.goto(f"{FRONTEND_URL}/admin/crm/contacts", wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(2000)
        page.screenshot(path=os.path.join(OUTPUT_DIR, "05_contacts_list.png"))
        print("   ✅ 05_contacts_list.png")
        
        try:
            first_contact = page.locator('table tbody tr').first
            if first_contact.count() > 0:
                first_contact.click()
                page.wait_for_timeout(2000)
                page.screenshot(path=os.path.join(OUTPUT_DIR, "06_contact_detail.png"))
                print("   ✅ 06_contact_detail.png")
                
                # Scroll to notes
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1000)
                page.screenshot(path=os.path.join(OUTPUT_DIR, "07_contact_notes_section.png"))
                print("   ✅ 07_contact_notes_section.png")
        except Exception as e:
            print(f"   ⚠️ Error with contacts: {e}")
        
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
    test_notes()
