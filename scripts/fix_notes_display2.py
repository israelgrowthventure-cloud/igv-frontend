#!/usr/bin/env python3
"""Fix notes display to use notes state instead of selectedItem.notes"""

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\LeadsTab.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the notes display section
old_notes_section = '''<div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4">{t('admin.crm.leads.details.notes')}</h3>        
            <div className="space-y-3 mb-4">
              {selectedItem.notes && selectedItem.notes.length > 0 ? (
                selectedItem.notes.map((note, idx) => (
                  <div key={note.id || idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{note.content || note.note_text || note.details || ''}</p>
                        <p className="text-xs text-gray-500 mt-1">
                      {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
                      {note.created_by ? ` • ${note.created_by}` : ''}
                    </p>
                  </div>
                ))
              ) : (
                !loadingNotes && <p className="text-gray-500 text-sm">{t('admin.crm.common.no_notes')}</p>
              )}
            </div>'''

new_notes_section = '''<div className="mt-6 border-t pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              {t('admin.crm.leads.details.notes')}
              {loadingNotes && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              <span className="text-sm font-normal text-gray-500">({notes.length})</span>
            </h3>
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {notes.length > 0 ? (
                notes.map((note, idx) => (
                  <div key={note._id || note.id || idx} className="p-3 bg-white rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-800">{note.content || note.note_text || note.details || note.text || ''}</p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                      <span>{note.created_at ? new Date(note.created_at).toLocaleString() : ''}</span>
                      {note.created_by && <span>• {note.created_by}</span>}
                    </p>
                  </div>
                ))
              ) : (
                !loadingNotes && (
                  <p className="text-gray-500 text-sm text-center py-4">{t('admin.crm.common.no_notes')}</p>
                )
              )}
            </div>'''

# Try different variations of the string (with different whitespace)
import re

# First, let's see what we're working with
pattern = r'<div className="mt-6 border-t pt-6">\s*<h3 className="font-semibold mb-4">\{t\(\'admin\.crm\.leads\.details\.notes\'\)\}</h3>'
match = re.search(pattern, content)
if match:
    print("Found notes section header")
else:
    print("Could not find notes section with regex")

# Try a simpler approach - replace specific strings
content = content.replace(
    'selectedItem.notes && selectedItem.notes.length > 0',
    'notes.length > 0'
)
content = content.replace(
    'selectedItem.notes.map((note, idx)',
    'notes.map((note, idx)'
)

# Add header with count and loading indicator
content = content.replace(
    '<h3 className="font-semibold mb-4">{t(\'admin.crm.leads.details.notes\')}</h3>',
    '''<h3 className="font-semibold mb-4 flex items-center gap-2">
              {t('admin.crm.leads.details.notes')}
              {loadingNotes && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
              <span className="text-sm font-normal text-gray-500">({notes.length})</span>
            </h3>'''
)

# Make the notes container scrollable with better styling
content = content.replace(
    '<div className="space-y-3 mb-4">',
    '<div className="space-y-3 mb-4 max-h-80 overflow-y-auto">'
)

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\crm\LeadsTab.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Notes display fixed in LeadsTab.js")
print("   - Now uses 'notes' state instead of 'selectedItem.notes'")
print("   - Added loading indicator")
print("   - Added notes count")
print("   - Made notes scrollable")
