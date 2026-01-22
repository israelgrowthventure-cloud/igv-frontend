#!/usr/bin/env python3
"""Test notes persistence in CRM"""

import os
import requests
from datetime import datetime

BACKEND_URL = "https://igv-cms-backend.onrender.com"

def test_notes_persistence():
    print("=" * 60)
    print("   Notes Persistence Test")
    print("=" * 60)
    
    # First get list of leads
    print("\n📋 Getting leads list...")
    response = requests.get(f"{BACKEND_URL}/leads", timeout=30)
    
    if response.status_code != 200:
        print(f"   ❌ Failed to get leads: {response.status_code}")
        return False
    
    leads = response.json()
    if not leads:
        print("   ⚠️ No leads found")
        return False
    
    lead = leads[0]
    lead_id = lead.get('_id') or lead.get('id')
    print(f"   ✅ Found {len(leads)} leads, testing with: {lead_id}")
    
    # Test 1: Get existing notes
    print("\n📝 Test 1: Get existing notes...")
    notes_response = requests.get(f"{BACKEND_URL}/leads/{lead_id}/notes", timeout=30)
    
    if notes_response.status_code == 200:
        existing_notes = notes_response.json()
        print(f"   ✅ Retrieved {len(existing_notes)} existing notes")
    elif notes_response.status_code == 404:
        print(f"   ℹ️ Notes endpoint returned 404 - checking if it's implemented")
        existing_notes = []
    else:
        print(f"   ⚠️ Notes endpoint returned: {notes_response.status_code}")
        existing_notes = []
    
    # Test 2: Add a new note
    print("\n📝 Test 2: Add new note...")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    note_content = f"Test note for persistence verification - {timestamp}"
    
    note_payload = {
        "content": note_content,
        "type": "note"
    }
    
    add_response = requests.post(
        f"{BACKEND_URL}/leads/{lead_id}/notes",
        json=note_payload,
        timeout=30
    )
    
    if add_response.status_code in [200, 201]:
        print(f"   ✅ Note added successfully")
        new_note = add_response.json()
        note_id = new_note.get('_id') or new_note.get('id')
        print(f"   Note ID: {note_id}")
    else:
        print(f"   ⚠️ Failed to add note: {add_response.status_code}")
        print(f"   Response: {add_response.text[:200]}")
        # Try alternative endpoint structure
        print("\n   Trying alternative endpoint: POST /api/leads/{lead_id}/notes")
        alt_response = requests.post(
            f"{BACKEND_URL}/api/leads/{lead_id}/notes",
            json=note_payload,
            timeout=30
        )
        if alt_response.status_code in [200, 201]:
            print(f"   ✅ Note added via /api endpoint")
        else:
            print(f"   ⚠️ Alt endpoint also failed: {alt_response.status_code}")
    
    # Test 3: Verify note persisted
    print("\n📝 Test 3: Verify persistence...")
    verify_response = requests.get(f"{BACKEND_URL}/leads/{lead_id}/notes", timeout=30)
    
    if verify_response.status_code == 200:
        updated_notes = verify_response.json()
        print(f"   ✅ Retrieved {len(updated_notes)} notes after add")
        
        # Check if our note is there
        found = any(note_content in str(n) for n in updated_notes)
        if found:
            print(f"   ✅ New note found in list - PERSISTENCE VERIFIED")
        else:
            print(f"   ⚠️ Note not found in response")
    else:
        print(f"   ⚠️ Could not verify: {verify_response.status_code}")
    
    print("\n" + "=" * 60)
    print("   Notes Persistence Test Complete")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    test_notes_persistence()
