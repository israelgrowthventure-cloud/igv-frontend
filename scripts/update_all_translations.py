#!/usr/bin/env python3
"""Add login translations to all locale files"""

import json

# Login translations for each language
login_translations = {
    "en": {
        "page_title": "Admin Login",
        "title": "Admin Login",
        "email": "Email Address",
        "password": "Password",
        "submit": "Sign In",
        "logging_in": "Signing in...",
        "success": "Login successful",
        "security_notice": "Secure access reserved for authorized administrators",
        "rights_reserved": "All rights reserved.",
        "errors": {
            "required": "Email and password required",
            "invalid": "Invalid credentials",
            "wrong_credentials": "Wrong email or password",
            "server": "Server error. Please try again."
        }
    },
    "fr": {
        "page_title": "Connexion Admin",
        "title": "Connexion Admin",
        "email": "Adresse email",
        "password": "Mot de passe",
        "submit": "Se connecter",
        "logging_in": "Connexion en cours...",
        "success": "Connexion réussie",
        "security_notice": "Accès sécurisé réservé aux administrateurs autorisés",
        "rights_reserved": "Tous droits réservés.",
        "errors": {
            "required": "Email et mot de passe requis",
            "invalid": "Identifiants invalides",
            "wrong_credentials": "Email ou mot de passe incorrect",
            "server": "Erreur serveur. Veuillez réessayer."
        }
    },
    "he": {
        "page_title": "כניסת מנהל",
        "title": "כניסת מנהל",
        "email": "כתובת אימייל",
        "password": "סיסמה",
        "submit": "התחבר",
        "logging_in": "מתחבר...",
        "success": "התחברות הצליחה",
        "security_notice": "גישה מאובטחת למנהלים מורשים בלבד",
        "rights_reserved": "כל הזכויות שמורות.",
        "errors": {
            "required": "נדרשים אימייל וסיסמה",
            "invalid": "פרטי התחברות שגויים",
            "wrong_credentials": "אימייל או סיסמה שגויים",
            "server": "שגיאת שרת. אנא נסה שוב."
        }
    }
}

# Additional CRM translations that might be missing
crm_common_translations = {
    "en": {
        "filters": "Filters",
        "all_statuses": "All Statuses",
        "all_priorities": "All Priorities",
        "reset": "Reset",
        "back_to_list": "Back to list",
        "confirm_delete": "Are you sure you want to delete this item?",
        "send_email": "Send Email"
    },
    "fr": {
        "filters": "Filtres",
        "all_statuses": "Tous les statuts",
        "all_priorities": "Toutes les priorités",
        "reset": "Réinitialiser",
        "back_to_list": "Retour à la liste",
        "confirm_delete": "Êtes-vous sûr de vouloir supprimer cet élément ?",
        "send_email": "Envoyer un email"
    },
    "he": {
        "filters": "מסננים",
        "all_statuses": "כל הסטטוסים",
        "all_priorities": "כל העדיפויות",
        "reset": "איפוס",
        "back_to_list": "חזרה לרשימה",
        "confirm_delete": "האם אתה בטוח שברצונך למחוק פריט זה?",
        "send_email": "שלח אימייל"
    }
}

leads_translations = {
    "en": {
        "title": "Leads",
        "subtitle": "Manage your leads and convert them to contacts",
        "new_lead": "New Lead",
        "export": "Export CSV",
        "search": "Search leads...",
        "filter_sector": "Filter by sector",
        "created": "Lead created successfully",
        "deleted": "Lead deleted successfully",
        "status_updated": "Status updated",
        "note_added": "Note added successfully",
        "export_success": "Leads exported successfully",
        "empty_title": "No leads yet",
        "empty_description": "Create your first lead to get started",
        "columns": {
            "created": "Created",
            "priority": "Priority",
            "status": "Status",
            "sector": "Sector",
            "brand": "Brand",
            "email": "Email",
            "contact": "Contact Name"
        },
        "toast": {
            "convert_success": "Lead converted to contact successfully",
            "contact_created": "Contact created",
            "view_contact": "View Contact",
            "opportunity_created": "Opportunity created",
            "view_opportunity": "View Opportunity",
            "already_converted": "This lead has already been converted",
            "lead_not_found": "Lead not found",
            "missing_info": "Lead must have at least email or name to convert",
            "convert_error": "Error converting lead"
        },
        "details": {
            "back": "Back to leads",
            "info": "Lead Information",
            "notes": "Notes",
            "add_note": "Add a note...",
            "activities": "Activities"
        }
    },
    "fr": {
        "title": "Prospects",
        "subtitle": "Gérez vos prospects et convertissez-les en contacts",
        "new_lead": "Nouveau Prospect",
        "export": "Exporter CSV",
        "search": "Rechercher des prospects...",
        "filter_sector": "Filtrer par secteur",
        "created": "Prospect créé avec succès",
        "deleted": "Prospect supprimé avec succès",
        "status_updated": "Statut mis à jour",
        "note_added": "Note ajoutée avec succès",
        "export_success": "Prospects exportés avec succès",
        "empty_title": "Aucun prospect",
        "empty_description": "Créez votre premier prospect pour commencer",
        "columns": {
            "created": "Créé le",
            "priority": "Priorité",
            "status": "Statut",
            "sector": "Secteur",
            "brand": "Marque",
            "email": "Email",
            "contact": "Nom du Contact"
        },
        "toast": {
            "convert_success": "Prospect converti en contact avec succès",
            "contact_created": "Contact créé",
            "view_contact": "Voir le Contact",
            "opportunity_created": "Opportunité créée",
            "view_opportunity": "Voir l'Opportunité",
            "already_converted": "Ce prospect a déjà été converti",
            "lead_not_found": "Prospect introuvable",
            "missing_info": "Le prospect doit avoir au moins un email ou un nom pour être converti",
            "convert_error": "Erreur lors de la conversion du prospect"
        },
        "details": {
            "back": "Retour aux prospects",
            "info": "Informations du Prospect",
            "notes": "Notes",
            "add_note": "Ajouter une note...",
            "activities": "Activités"
        }
    },
    "he": {
        "title": "לידים",
        "subtitle": "נהל את הלידים שלך והמר אותם לאנשי קשר",
        "new_lead": "ליד חדש",
        "export": "ייצוא CSV",
        "search": "חיפוש לידים...",
        "filter_sector": "סינון לפי תחום",
        "created": "הליד נוצר בהצלחה",
        "deleted": "הליד נמחק בהצלחה",
        "status_updated": "הסטטוס עודכן",
        "note_added": "הערה נוספה בהצלחה",
        "export_success": "הלידים יוצאו בהצלחה",
        "empty_title": "אין לידים עדיין",
        "empty_description": "צור את הליד הראשון שלך כדי להתחיל",
        "columns": {
            "created": "נוצר",
            "priority": "עדיפות",
            "status": "סטטוס",
            "sector": "תחום",
            "brand": "מותג",
            "email": "אימייל",
            "contact": "שם איש קשר"
        },
        "toast": {
            "convert_success": "הליד הומר לאיש קשר בהצלחה",
            "contact_created": "איש קשר נוצר",
            "view_contact": "צפה באיש קשר",
            "opportunity_created": "הזדמנות נוצרה",
            "view_opportunity": "צפה בהזדמנות",
            "already_converted": "ליד זה כבר הומר",
            "lead_not_found": "הליד לא נמצא",
            "missing_info": "הליד חייב להכיל לפחות אימייל או שם כדי להמיר",
            "convert_error": "שגיאה בהמרת הליד"
        },
        "details": {
            "back": "חזרה ללידים",
            "info": "מידע על הליד",
            "notes": "הערות",
            "add_note": "הוסף הערה...",
            "activities": "פעילויות"
        }
    }
}

statuses = {
    "en": {
        "NEW": "New",
        "CONTACTED": "Contacted",
        "QUALIFIED": "Qualified",
        "CONVERTED": "Converted",
        "LOST": "Lost",
        "PENDING_QUOTA": "Pending Quota"
    },
    "fr": {
        "NEW": "Nouveau",
        "CONTACTED": "Contacté",
        "QUALIFIED": "Qualifié",
        "CONVERTED": "Converti",
        "LOST": "Perdu",
        "PENDING_QUOTA": "En attente quota"
    },
    "he": {
        "NEW": "חדש",
        "CONTACTED": "נוצר קשר",
        "QUALIFIED": "מוכשר",
        "CONVERTED": "הומר",
        "LOST": "אבוד",
        "PENDING_QUOTA": "ממתין למכסה"
    }
}

priorities = {
    "en": {"A": "High (A)", "B": "Medium (B)", "C": "Low (C)"},
    "fr": {"A": "Haute (A)", "B": "Moyenne (B)", "C": "Basse (C)"},
    "he": {"A": "גבוהה (A)", "B": "בינונית (B)", "C": "נמוכה (C)"}
}

def update_locale(lang):
    filepath = rf'C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\locales\{lang}.json'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure admin section exists
    if 'admin' not in data:
        data['admin'] = {}
    
    # Add login translations
    data['admin']['login'] = login_translations[lang]
    
    # Ensure crm section exists
    if 'crm' not in data['admin']:
        data['admin']['crm'] = {}
    
    # Add/update common translations
    if 'common' not in data['admin']['crm']:
        data['admin']['crm']['common'] = {}
    data['admin']['crm']['common'].update(crm_common_translations[lang])
    
    # Add/update leads translations
    data['admin']['crm']['leads'] = leads_translations[lang]
    
    # Add/update statuses
    data['admin']['crm']['statuses'] = statuses[lang]
    
    # Add/update priorities
    data['admin']['crm']['priorities'] = priorities[lang]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang}.json")

# Update all locales
for lang in ['en', 'fr', 'he']:
    update_locale(lang)

print("\n✅ All translations updated!")
