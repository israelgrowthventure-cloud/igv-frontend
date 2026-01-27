#!/usr/bin/env python3
"""
Script d'ajout automatique des clés i18n manquantes
pour le projet IGV Frontend

Génère les traductions FR, EN, HE pour toutes les clés manquantes
et les insère aux bons emplacements dans les fichiers JSON.
"""

import json
from pathlib import Path

# Définir les nouvelles clés à ajouter avec traductions FR, EN, HE
NEW_KEYS = {
    # Section common (ajout attributs title)
    ("common", "logoAlt"): {
        "fr": "Israel Growth Venture",
        "en": "Israel Growth Venture",
        "he": "Israel Growth Venture"
    },
    ("common", "editTitle"): {
        "fr": "Modifier",
        "en": "Edit",
        "he": "ערוך"
    },
    ("common", "deleteTitle"): {
        "fr": "Supprimer",
        "en": "Delete",
        "he": "מחק"
    },
    ("common", "closeTitle"): {
        "fr": "Fermer",
        "en": "Close",
        "he": "סגור"
    },
    ("common", "copyTitle"): {
        "fr": "Copier",
        "en": "Copy",
        "he": "העתק"
    },
    
    # Section home.hero (images alt)
    ("home", "hero", "businessImageAlt"): {
        "fr": "Entreprise en Israël",
        "en": "Business in Israel",
        "he": "עסקים בישראל"
    },
    ("home", "hero", "yearsExperience"): {
        "fr": "Années d'expérience",
        "en": "Years of Experience",
        "he": "שנות ניסיון"
    },
    ("home", "about", "teamImageAlt"): {
        "fr": "Notre équipe",
        "en": "Our Team",
        "he": "הצוות שלנו"
    },
    
    # Section payment (cartes bancaires)
    ("payment", "visaAlt"): {
        "fr": "Visa",
        "en": "Visa",
        "he": "ויזה"
    },
    ("payment", "mastercardAlt"): {
        "fr": "Mastercard",
        "en": "Mastercard",
        "he": "מאסטרקארד"
    },
    ("payment", "cbAlt"): {
        "fr": "Carte Bancaire",
        "en": "Bank Card",
        "he": "כרטיס בנקאי"
    },
    
    # Section crm.activities
    ("crm", "activities", "searchPlaceholder"): {
        "fr": "Rechercher une activité...",
        "en": "Search for an activity...",
        "he": "חפש פעילות..."
    },
    
    # Section crm.companies
    ("crm", "companies", "domainPlaceholder"): {
        "fr": "example.com",
        "en": "example.com",
        "he": "example.com"
    },
    ("crm", "companies", "websitePlaceholder"): {
        "fr": "https://",
        "en": "https://",
        "he": "https://"
    },
    
    # Section crm.contacts
    ("crm", "contacts", "searchPlaceholder"): {
        "fr": "Rechercher un contact...",
        "en": "Search for a contact...",
        "he": "חפש איש קשר..."
    },
    ("crm", "contacts", "notePlaceholder"): {
        "fr": "Écrivez votre note ici...",
        "en": "Write your note here...",
        "he": "כתוב את ההערה שלך כאן..."
    },
    ("crm", "contacts", "sendEmailTitle"): {
        "fr": "Envoyer un email",
        "en": "Send Email",
        "he": "שלח אימייל"
    },
    
    # Section crm.emails
    ("crm", "emails", "namePlaceholder"): {
        "fr": "Ex: Bienvenue Lead",
        "en": "Ex: Welcome Lead",
        "he": "לדוגמה: ליד ברוך הבא"
    },
    ("crm", "emails", "subjectPlaceholder"): {
        "fr": "Ex: Bienvenue chez Israel Growth Venture",
        "en": "Ex: Welcome to Israel Growth Venture",
        "he": "לדוגמה: ברוכים הבאים ל-Israel Growth Venture"
    },
    ("crm", "emails", "bodyPlaceholder"): {
        "fr": "Bonjour {name},\\n\\nMerci pour votre intérêt...",
        "en": "Hello {name},\\n\\nThank you for your interest...",
        "he": "שלום {name},\\n\\nתודה על ההתעניינות שלך..."
    },
    
    # Section crm.nextAction
    ("crm", "nextAction", "detailsPlaceholder"): {
        "fr": "Détails sur l'action à effectuer...",
        "en": "Details about the action to take...",
        "he": "פרטים על הפעולה לביצוע..."
    },
    
    # Section crm.opportunities
    ("crm", "opportunities", "namePlaceholder"): {
        "fr": "Ex: Contrat ABC Corp",
        "en": "Ex: ABC Corp Contract",
        "he": "לדוגמה: חוזה ABC Corp"
    },
    ("crm", "opportunities", "valuePlaceholder"): {
        "fr": "10000",
        "en": "10000",
        "he": "10000"
    },
    ("crm", "opportunities", "notesPlaceholder"): {
        "fr": "Notes additionnelles...",
        "en": "Additional notes...",
        "he": "הערות נוספות..."
    },
    
    # Section crm.settings
    ("crm", "settings", "fullNamePlaceholder"): {
        "fr": "Nom complet",
        "en": "Full Name",
        "he": "שם מלא"
    },
    ("crm", "settings", "emailPlaceholder"): {
        "fr": "Email",
        "en": "Email",
        "he": "אימייל"
    },
    ("crm", "settings", "passwordPlaceholder"): {
        "fr": "Mot de passe",
        "en": "Password",
        "he": "סיסמה"
    },
    
    # Section crm.leads
    ("crm", "leads", "convertedToContactTitle"): {
        "fr": "Converti en contact",
        "en": "Converted to Contact",
        "he": "הומר לאיש קשר"
    },
    ("crm", "leads", "viewContactTitle"): {
        "fr": "Voir le contact créé",
        "en": "View Created Contact",
        "he": "צפה באיש הקשר שנוצר"
    },
    
    # Section crm.rbac
    ("crm", "rbac", "editPermissionsTitle"): {
        "fr": "Modifier les permissions",
        "en": "Edit Permissions",
        "he": "ערוך הרשאות"
    },
    
    # Section cms (nouveau)
    ("cms", "openEditorTitle"): {
        "fr": "Ouvrir l'éditeur de site (protégé)",
        "en": "Open Site Editor (Protected)",
        "he": "פתח עורך אתר (מוגן)"
    },
    
    # Section invoice (nouveau)
    ("invoice", "generatePdfTitle"): {
        "fr": "Générer le PDF",
        "en": "Generate PDF",
        "he": "צור PDF"
    },
    ("invoice", "sendEmailTitle"): {
        "fr": "Envoyer par email",
        "en": "Send by Email",
        "he": "שלח באימייל"
    }
}


def add_key_to_nested_dict(d, key_path, value):
    """Ajoute une clé à un dictionnaire nested de manière récursive."""
    if len(key_path) == 1:
        # Dernière clé : ajouter la valeur si elle n'existe pas
        if key_path[0] not in d:
            d[key_path[0]] = value
            return True
        return False
    else:
        # Créer la section intermédiaire si elle n'existe pas
        if key_path[0] not in d:
            d[key_path[0]] = {}
        return add_key_to_nested_dict(d[key_path[0]], key_path[1:], value)


def update_locale_file(locale_path, lang):
    """Met à jour un fichier JSON locale avec les nouvelles clés."""
    with open(locale_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    added_count = 0
    for key_path, translations in NEW_KEYS.items():
        if add_key_to_nested_dict(data, key_path, translations[lang]):
            added_count += 1
            print(f"  ✓ Ajout {'.'.join(key_path)} = {translations[lang]}")
    
    # Sauvegarder avec indentation correcte
    with open(locale_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return added_count


def main():
    base_path = Path(r"C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\locales")
    
    print("🌍 Ajout automatique des clés i18n manquantes\n")
    
    for lang_file, lang_code in [("fr.json", "fr"), ("en.json", "en"), ("he.json", "he")]:
        locale_path = base_path / lang_file
        print(f"📝 {lang_file} ({lang_code.upper()}):")
        count = update_locale_file(locale_path, lang_code)
        print(f"  ✅ {count} clés ajoutées\n")
    
    print(f"✨ Migration terminée ! {len(NEW_KEYS)} clés ajoutées au total.")


if __name__ == "__main__":
    main()
