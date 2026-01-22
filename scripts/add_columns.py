#!/usr/bin/env python3
"""Add missing column translations"""

import json

columns_translations = {
    "en": {
        "created": "Created",
        "priority": "Priority",
        "status": "Status",
        "sector": "Sector",
        "brand": "Brand",
        "email": "Email",
        "contact": "Contact Name",
        "name": "Name",
        "phone": "Phone"
    },
    "fr": {
        "created": "Créé le",
        "priority": "Priorité",
        "status": "Statut",
        "sector": "Secteur",
        "brand": "Marque",
        "email": "Email",
        "contact": "Nom du Contact",
        "name": "Nom",
        "phone": "Téléphone"
    },
    "he": {
        "created": "נוצר",
        "priority": "עדיפות",
        "status": "סטטוס",
        "sector": "תחום",
        "brand": "מותג",
        "email": "אימייל",
        "contact": "שם איש קשר",
        "name": "שם",
        "phone": "טלפון"
    }
}

def update_locale_columns(lang):
    filepath = rf'C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\locales\{lang}.json'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure structure
    if 'admin' not in data:
        data['admin'] = {}
    if 'crm' not in data['admin']:
        data['admin']['crm'] = {}
    if 'leads' not in data['admin']['crm']:
        data['admin']['crm']['leads'] = {}
    
    # Add columns
    data['admin']['crm']['leads']['columns'] = columns_translations[lang]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang}.json with columns")

for lang in ['en', 'fr', 'he']:
    update_locale_columns(lang)

print("\n✅ Column translations added!")
