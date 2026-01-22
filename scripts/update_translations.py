#!/usr/bin/env python3
"""
Script pour mettre à jour les traductions CRM dans les 3 langues (EN, FR, HE)
Mission: Reconstruction totale CRM - zéro texte hardcodé
"""
import json
import os

LOCALES_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'i18n', 'locales')

# Traductions complètes pour admin.crm.users
USERS_EN = {
    "title": "Users",
    "new": "New User",
    "edit": "Edit User",
    "search_placeholder": "Search users...",
    "all_roles": "All Roles",
    "all_statuses": "All Statuses",
    "active": "Active",
    "inactive": "Inactive",
    "columns": {
        "user": "User",
        "email": "Email",
        "role": "Role",
        "status": "Status",
        "assigned_leads": "Assigned Leads",
        "actions": "Actions"
    },
    "empty": "No users found",
    "no_name": "No name",
    "created": "User created successfully",
    "updated": "User updated successfully",
    "deleted": "User deleted successfully",
    "delete_confirm": "Are you sure you want to delete this user?",
    "form": {
        "email": "Email",
        "first_name": "First Name",
        "last_name": "Last Name",
        "password": "Password",
        "password_edit": "New password (leave empty to keep current)",
        "role": "Role",
        "active_account": "Active account"
    },
    "roles": {
        "admin": "Admin",
        "commercial": "Sales",
        "support": "Support"
    },
    "errors": {
        "load_failed": "Failed to load users",
        "email_required": "Email is required",
        "password_required": "Password is required",
        "update_failed": "Failed to update user",
        "delete_failed": "Failed to delete user"
    },
    "buttons": {
        "save": "Save",
        "cancel": "Cancel",
        "create": "Create",
        "modify": "Modify"
    }
}

USERS_FR = {
    "title": "Utilisateurs",
    "new": "Nouvel Utilisateur",
    "edit": "Modifier l'Utilisateur",
    "search_placeholder": "Rechercher des utilisateurs...",
    "all_roles": "Tous les Rôles",
    "all_statuses": "Tous les Statuts",
    "active": "Actif",
    "inactive": "Inactif",
    "columns": {
        "user": "Utilisateur",
        "email": "Email",
        "role": "Rôle",
        "status": "Statut",
        "assigned_leads": "Leads Assignés",
        "actions": "Actions"
    },
    "empty": "Aucun utilisateur trouvé",
    "no_name": "Sans nom",
    "created": "Utilisateur créé avec succès",
    "updated": "Utilisateur mis à jour avec succès",
    "deleted": "Utilisateur supprimé avec succès",
    "delete_confirm": "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
    "form": {
        "email": "Email",
        "first_name": "Prénom",
        "last_name": "Nom",
        "password": "Mot de passe",
        "password_edit": "Nouveau mot de passe (laisser vide pour ne pas changer)",
        "role": "Rôle",
        "active_account": "Compte actif"
    },
    "roles": {
        "admin": "Admin",
        "commercial": "Commercial",
        "support": "Support"
    },
    "errors": {
        "load_failed": "Erreur lors du chargement des utilisateurs",
        "email_required": "L'email est requis",
        "password_required": "Le mot de passe est requis",
        "update_failed": "Erreur lors de la mise à jour",
        "delete_failed": "Erreur lors de la suppression"
    },
    "buttons": {
        "save": "Enregistrer",
        "cancel": "Annuler",
        "create": "Créer",
        "modify": "Modifier"
    }
}

USERS_HE = {
    "title": "משתמשים",
    "new": "משתמש חדש",
    "edit": "עריכת משתמש",
    "search_placeholder": "חיפוש משתמשים...",
    "all_roles": "כל התפקידים",
    "all_statuses": "כל הסטטוסים",
    "active": "פעיל",
    "inactive": "לא פעיל",
    "columns": {
        "user": "משתמש",
        "email": "אימייל",
        "role": "תפקיד",
        "status": "סטטוס",
        "assigned_leads": "לידים מוקצים",
        "actions": "פעולות"
    },
    "empty": "לא נמצאו משתמשים",
    "no_name": "ללא שם",
    "created": "משתמש נוצר בהצלחה",
    "updated": "משתמש עודכן בהצלחה",
    "deleted": "משתמש נמחק בהצלחה",
    "delete_confirm": "האם אתה בטוח שברצונך למחוק משתמש זה?",
    "form": {
        "email": "אימייל",
        "first_name": "שם פרטי",
        "last_name": "שם משפחה",
        "password": "סיסמה",
        "password_edit": "סיסמה חדשה (השאר ריק לשמור על הנוכחית)",
        "role": "תפקיד",
        "active_account": "חשבון פעיל"
    },
    "roles": {
        "admin": "מנהל",
        "commercial": "מכירות",
        "support": "תמיכה"
    },
    "errors": {
        "load_failed": "שגיאה בטעינת משתמשים",
        "email_required": "אימייל נדרש",
        "password_required": "סיסמה נדרשת",
        "update_failed": "שגיאה בעדכון",
        "delete_failed": "שגיאה במחיקה"
    },
    "buttons": {
        "save": "שמור",
        "cancel": "ביטול",
        "create": "צור",
        "modify": "שנה"
    }
}

# Traductions pour leads (textes manquants)
LEADS_EN = {
    "convert_to_contact": "Convert to Contact",
    "create_opportunity": "Create Opportunity",
    "already_converted": "Lead already converted",
    "view_contact": "View Contact",
    "converting": "Converting...",
    "add_note_placeholder": "Add a note...",
    "phone": "Phone",
    "target_city": "Target City",
    "mini_analysis": "IGV Market Mini-Analysis",
    "generated_on": "Generated on",
    "language": "Language",
    "actions": "Actions",
    "delete_confirm_title": "Delete Lead?",
    "delete_confirm_message": "This action cannot be undone. Are you sure you want to delete this lead?",
    "empty_title": "No leads yet",
    "empty_subtitle": "Create your first lead to get started",
    "details": {
        "status_priority": "Status & Priority",
        "focus_notes": "Focus Notes",
        "contact_info": "Contact Information",
        "additional": "Additional Information",
        "notes": "Notes",
        "email": "Email",
        "phone": "Phone",
        "sector": "Sector",
        "city": "City",
        "status": "Status",
        "priority": "Priority"
    },
    "columns": {
        "name": "Contact Name",
        "email": "Email",
        "brand": "Brand",
        "sector": "Sector",
        "status": "Status",
        "priority": "Priority",
        "created": "Created"
    },
    "toast": {
        "opportunity_created": "Opportunity created successfully!",
        "view_opportunity": "View opportunity",
        "convert_success": "Lead converted to contact successfully",
        "contact_created": "Contact created successfully!",
        "view_contact": "View contact",
        "already_converted": "This lead has already been converted",
        "lead_not_found": "Lead not found",
        "missing_info": "Missing required information to convert",
        "convert_error": "Error converting lead"
    }
}

LEADS_FR = {
    "convert_to_contact": "Convertir en Contact",
    "create_opportunity": "Créer une Opportunité",
    "already_converted": "Lead déjà converti",
    "view_contact": "Voir le Contact",
    "converting": "Conversion...",
    "add_note_placeholder": "Ajouter une note...",
    "phone": "Téléphone",
    "target_city": "Ville Cible",
    "mini_analysis": "Mini-Analyse de Marché IGV",
    "generated_on": "Généré le",
    "language": "Langue",
    "actions": "Actions",
    "delete_confirm_title": "Supprimer le Lead ?",
    "delete_confirm_message": "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce lead ?",
    "empty_title": "Aucun prospect",
    "empty_subtitle": "Créez votre premier prospect pour commencer",
    "details": {
        "status_priority": "Statut & Priorité",
        "focus_notes": "Notes Focus",
        "contact_info": "Informations de Contact",
        "additional": "Informations Supplémentaires",
        "notes": "Notes",
        "email": "Email",
        "phone": "Téléphone",
        "sector": "Secteur",
        "city": "Ville",
        "status": "Statut",
        "priority": "Priorité"
    },
    "columns": {
        "name": "Nom du Contact",
        "email": "Email",
        "brand": "Marque",
        "sector": "Secteur",
        "status": "Statut",
        "priority": "Priorité",
        "created": "Créé le"
    },
    "toast": {
        "opportunity_created": "Opportunité créée avec succès !",
        "view_opportunity": "Voir l'opportunité",
        "convert_success": "Lead converti en contact avec succès",
        "contact_created": "Contact créé avec succès !",
        "view_contact": "Voir le contact",
        "already_converted": "Ce lead a déjà été converti",
        "lead_not_found": "Lead introuvable",
        "missing_info": "Informations requises manquantes pour la conversion",
        "convert_error": "Erreur lors de la conversion"
    }
}

LEADS_HE = {
    "convert_to_contact": "המרה לאיש קשר",
    "create_opportunity": "יצירת הזדמנות",
    "already_converted": "ליד כבר הומר",
    "view_contact": "צפייה באיש קשר",
    "converting": "ממיר...",
    "add_note_placeholder": "הוסף הערה...",
    "phone": "טלפון",
    "target_city": "עיר יעד",
    "mini_analysis": "מיני-ניתוח שוק IGV",
    "generated_on": "נוצר ב",
    "language": "שפה",
    "actions": "פעולות",
    "delete_confirm_title": "למחוק ליד?",
    "delete_confirm_message": "פעולה זו אינה הפיכה. האם אתה בטוח שברצונך למחוק ליד זה?",
    "empty_title": "אין לידים עדיין",
    "empty_subtitle": "צור את הליד הראשון שלך כדי להתחיל",
    "details": {
        "status_priority": "סטטוס ועדיפות",
        "focus_notes": "הערות מיקוד",
        "contact_info": "פרטי יצירת קשר",
        "additional": "מידע נוסף",
        "notes": "הערות",
        "email": "אימייל",
        "phone": "טלפון",
        "sector": "תחום",
        "city": "עיר",
        "status": "סטטוס",
        "priority": "עדיפות"
    },
    "columns": {
        "name": "שם איש קשר",
        "email": "אימייל",
        "brand": "מותג",
        "sector": "תחום",
        "status": "סטטוס",
        "priority": "עדיפות",
        "created": "נוצר"
    },
    "toast": {
        "opportunity_created": "הזדמנות נוצרה בהצלחה!",
        "view_opportunity": "צפה בהזדמנות",
        "convert_success": "ליד הומר לאיש קשר בהצלחה",
        "contact_created": "איש קשר נוצר בהצלחה!",
        "view_contact": "צפה באיש קשר",
        "already_converted": "ליד זה כבר הומר",
        "lead_not_found": "ליד לא נמצא",
        "missing_info": "מידע נדרש חסר להמרה",
        "convert_error": "שגיאה בהמרת הליד"
    }
}

# Traductions communes manquantes
COMMON_EN = {
    "back_to_list": "Back to list",
    "confirm_delete": "Are you sure you want to delete?",
    "send_email": "Send Email"
}

COMMON_FR = {
    "back_to_list": "Retour à la liste",
    "confirm_delete": "Êtes-vous sûr de vouloir supprimer ?",
    "send_email": "Envoyer Email"
}

COMMON_HE = {
    "back_to_list": "חזרה לרשימה",
    "confirm_delete": "האם אתה בטוח שברצונך למחוק?",
    "send_email": "שלח אימייל"
}

# Statuts et priorités
STATUSES_EN = {
    "NEW": "New",
    "CONTACTED": "Contacted",
    "QUALIFIED": "Qualified",
    "CONVERTED": "Converted",
    "LOST": "Lost",
    "PENDING_QUOTA": "Pending Quota"
}

STATUSES_FR = {
    "NEW": "Nouveau",
    "CONTACTED": "Contacté",
    "QUALIFIED": "Qualifié",
    "CONVERTED": "Converti",
    "LOST": "Perdu",
    "PENDING_QUOTA": "En Attente"
}

STATUSES_HE = {
    "NEW": "חדש",
    "CONTACTED": "נוצר קשר",
    "QUALIFIED": "מוכשר",
    "CONVERTED": "הומר",
    "LOST": "אבוד",
    "PENDING_QUOTA": "ממתין"
}

PRIORITIES_EN = {
    "A": "High Priority",
    "B": "Medium Priority",
    "C": "Low Priority"
}

PRIORITIES_FR = {
    "A": "Priorité Haute",
    "B": "Priorité Moyenne",
    "C": "Priorité Basse"
}

PRIORITIES_HE = {
    "A": "עדיפות גבוהה",
    "B": "עדיפות בינונית",
    "C": "עדיפות נמוכה"
}

def deep_merge(base, override):
    """Merge override into base recursively"""
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result

def update_locale(filename, users_data, leads_data, common_data, statuses_data, priorities_data):
    filepath = os.path.join(LOCALES_DIR, filename)
    
    # Read existing file
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure admin.crm structure exists
    if 'admin' not in data:
        data['admin'] = {}
    if 'crm' not in data['admin']:
        data['admin']['crm'] = {}
    
    # Update users section
    data['admin']['crm']['users'] = users_data
    
    # Merge leads data
    if 'leads' not in data['admin']['crm']:
        data['admin']['crm']['leads'] = {}
    data['admin']['crm']['leads'] = deep_merge(data['admin']['crm']['leads'], leads_data)
    
    # Merge common data
    if 'common' not in data['admin']['crm']:
        data['admin']['crm']['common'] = {}
    data['admin']['crm']['common'] = deep_merge(data['admin']['crm']['common'], common_data)
    
    # Update statuses
    data['admin']['crm']['statuses'] = statuses_data
    
    # Update priorities
    data['admin']['crm']['priorities'] = priorities_data
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {filename}")

def main():
    print("Updating translations for CRM reconstruction...")
    
    # Update English
    update_locale('en.json', USERS_EN, LEADS_EN, COMMON_EN, STATUSES_EN, PRIORITIES_EN)
    
    # Update French  
    update_locale('fr.json', USERS_FR, LEADS_FR, COMMON_FR, STATUSES_FR, PRIORITIES_FR)
    
    # Update Hebrew
    update_locale('he.json', USERS_HE, LEADS_HE, COMMON_HE, STATUSES_HE, PRIORITIES_HE)
    
    print("All translations updated successfully!")

if __name__ == '__main__':
    main()
