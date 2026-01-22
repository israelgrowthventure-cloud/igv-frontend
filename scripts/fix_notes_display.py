#!/usr/bin/env python3
"""
Fix notes display in LeadsTab and ContactsTab:
1. Add useEffect import
2. Add notes state
3. Load notes when selecting an item
4. Display notes from state
"""

import re

# ============================================
# FIX LEADS TAB
# ============================================

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\LeadsTab.js', 'r', encoding='utf-8') as f:
    leads_content = f.read()

# 1. Add useEffect to import
leads_content = leads_content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

# 2. Add notes state after other useState declarations
# Find the last useState and add after it
old_state_block = '''const [showEmailModal, setShowEmailModal] = useState(false);
  const [newLeadData, setNewLeadData] = useState({'''

new_state_block = '''const [showEmailModal, setShowEmailModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newLeadData, setNewLeadData] = useState({'''

leads_content = leads_content.replace(old_state_block, new_state_block)

# 3. Add useEffect to load notes when selectedItem changes
# Find position after state declarations and before first handler
# Look for the handleCreateLead function
use_effect_code = '''
  // Load notes when a lead is selected
  useEffect(() => {
    const loadNotes = async () => {
      if (selectedItem && selectedItem.lead_id) {
        setLoadingNotes(true);
        try {
          const response = await api.get(`/api/crm/leads/${selectedItem.lead_id}/notes`);
          setNotes(Array.isArray(response) ? response : (response.notes || []));
        } catch (error) {
          console.error('Error loading notes:', error);
          // Try alternative endpoint
          try {
            const altResponse = await api.get(`/leads/${selectedItem.lead_id}/notes`);
            setNotes(Array.isArray(altResponse) ? altResponse : (altResponse.notes || []));
          } catch (e) {
            setNotes([]);
          }
        } finally {
          setLoadingNotes(false);
        }
      } else {
        setNotes([]);
      }
    };
    loadNotes();
  }, [selectedItem]);

'''

# Insert useEffect before handleCreateLead
leads_content = leads_content.replace(
    "const handleCreateLead = async (e) => {",
    use_effect_code + "const handleCreateLead = async (e) => {"
)

# 4. Update handleAddNote to refresh notes after adding
old_add_note = '''const handleAddNote = async (leadId) => {
    if (!noteText.trim()) return;
    try {
      setLoadingAction(true);
      await api.post(`/api/crm/leads/${leadId}/notes`, { note_text: noteText });
      setNoteText('');
      toast.success(t('admin.crm.leads.note_added'));
      await onRefresh();'''

new_add_note = '''const handleAddNote = async (leadId) => {
    if (!noteText.trim()) return;
    try {
      setLoadingAction(true);
      await api.post(`/api/crm/leads/${leadId}/notes`, { note_text: noteText, content: noteText });
      setNoteText('');
      toast.success(t('admin.crm.leads.note_added'));
      // Reload notes immediately
      try {
        const response = await api.get(`/api/crm/leads/${leadId}/notes`);
        setNotes(Array.isArray(response) ? response : (response.notes || []));
      } catch (e) {
        console.error('Error reloading notes:', e);
      }
      await onRefresh();'''

leads_content = leads_content.replace(old_add_note, new_add_note)

# 5. Update notes display to use 'notes' state instead of 'selectedItem.notes'
old_notes_display = '''<div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4">{t('admin.crm.leads.details.notes')}</h3>        
            <div className="space-y-3 mb-4">
              {selectedItem.notes && selectedItem.notes.length > 0 ? (
                selectedItem.notes.map((note, idx) => ('''

new_notes_display = '''<div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              {t('admin.crm.leads.details.notes')}
              {loadingNotes && <Loader2 className="w-4 h-4 animate-spin" />}
              <span className="text-sm font-normal text-gray-500">({notes.length})</span>
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {notes.length > 0 ? (
                notes.map((note, idx) => ('''

leads_content = leads_content.replace(old_notes_display, new_notes_display)

# Also fix the closing of the notes map
old_notes_else = ''') : (
                <p className="text-gray-500 text-sm">{t('admin.crm.common.no_notes')}</p>'''

new_notes_else = ''') : (
                !loadingNotes && <p className="text-gray-500 text-sm">{t('admin.crm.common.no_notes')}</p>'''

leads_content = leads_content.replace(old_notes_else, new_notes_else)

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\LeadsTab.js', 'w', encoding='utf-8') as f:
    f.write(leads_content)

print("✅ LeadsTab.js updated with notes loading")

# ============================================
# FIX CONTACTS TAB
# ============================================

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\ContactsTab.js', 'r', encoding='utf-8') as f:
    contacts_content = f.read()

# Check if it already has useEffect
if 'useEffect' not in contacts_content:
    contacts_content = contacts_content.replace(
        "import React, { useState } from 'react';",
        "import React, { useState, useEffect } from 'react';"
    )

# Check current state of ContactsTab
print("\n📋 ContactsTab.js analysis:")
if 'notes' in contacts_content.lower():
    print("   - Already has notes handling")
else:
    print("   - Needs notes implementation")

# Save contacts for later review
with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\ContactsTab.js', 'w', encoding='utf-8') as f:
    f.write(contacts_content)

print("\n✅ Done! Now need to check ContactsTab structure")
