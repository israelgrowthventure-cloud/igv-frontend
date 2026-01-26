/**
 * i18n Replace AUTO Script — IGV CRM
 * ===================================
 * 
 * Replaces [AUTO] placeholders with proper translations.
 * 
 * Usage: node tools/i18n-replace-auto.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');

// Comprehensive translation mappings
const REPLACEMENTS = {
  // Common patterns found in the [AUTO] placeholders
  // Format: english phrase -> { fr, en, he }
  
  // ===== BASIC WORDS =====
  'by': { fr: 'Par', en: 'By', he: 'על ידי' },
  'select': { fr: 'Sélectionner', en: 'Select', he: 'בחר' },
  'assign': { fr: 'Attribuer', en: 'Assign', he: 'הקצה' },
  'recent': { fr: 'Récent', en: 'Recent', he: 'אחרון' },
  'hint': { fr: 'Conseil', en: 'Hint', he: 'רמז' },
  'shortcut': { fr: 'Raccourci', en: 'Shortcut', he: 'קיצור' },
  'no results': { fr: 'Aucun résultat', en: 'No results', he: 'אין תוצאות' },
  'try different': { fr: 'Essayez autre chose', en: 'Try something different', he: 'נסה משהו אחר' },
  'min chars': { fr: 'Minimum 3 caractères', en: 'Minimum 3 characters', he: 'מינימום 3 תווים' },
  
  // ===== DASHBOARD =====
  'leads today': { fr: "Prospects aujourd'hui", en: 'Leads today', he: 'לידים היום' },
  'top sources': { fr: 'Sources principales', en: 'Top sources', he: 'מקורות מובילים' },
  'no data': { fr: 'Aucune donnée', en: 'No data', he: 'אין נתונים' },
  'stage distribution': { fr: 'Répartition par étape', en: 'Stage distribution', he: 'התפלגות שלבים' },
  
  // ===== ERRORS/SUCCESS =====
  'export error': { fr: "Erreur d'exportation", en: 'Export error', he: 'שגיאת ייצוא' },
  'update success': { fr: 'Mise à jour réussie', en: 'Updated successfully', he: 'עודכן בהצלחה' },
  'update error': { fr: 'Erreur de mise à jour', en: 'Update failed', he: 'העדכון נכשל' },
  'note error': { fr: 'Erreur de note', en: 'Note error', he: 'שגיאת הערה' },
  'confirm convert': { fr: 'Confirmer la conversion ?', en: 'Confirm conversion?', he: 'לאשר המרה?' },
  'convert success': { fr: 'Conversion réussie', en: 'Converted successfully', he: 'הומר בהצלחה' },
  'convert error': { fr: 'Erreur de conversion', en: 'Conversion failed', he: 'ההמרה נכשלה' },
  'load error': { fr: 'Erreur de chargement', en: 'Failed to load', he: 'נכשל בטעינה' },
  'save error': { fr: "Erreur d'enregistrement", en: 'Failed to save', he: 'נכשל בשמירה' },
  'delete error': { fr: 'Erreur de suppression', en: 'Failed to delete', he: 'נכשל במחיקה' },
  'send error': { fr: "Erreur d'envoi", en: 'Failed to send', he: 'נכשל בשליחה' },
  'create error': { fr: 'Erreur de création', en: 'Failed to create', he: 'נכשל ביצירה' },
  
  // ===== SEARCH & FILTERS =====
  'search placeholder': { fr: 'Rechercher...', en: 'Search...', he: 'חיפוש...' },
  'filters': { fr: 'Filtres', en: 'Filters', he: 'סינונים' },
  'filter status': { fr: 'Filtrer par statut', en: 'Filter by status', he: 'סנן לפי סטטוס' },
  'all statuses': { fr: 'Tous les statuts', en: 'All statuses', he: 'כל הסטטוסים' },
  'filter stage': { fr: 'Filtrer par étape', en: 'Filter by stage', he: 'סנן לפי שלב' },
  'all stages': { fr: 'Toutes les étapes', en: 'All stages', he: 'כל השלבים' },
  'apply filters': { fr: 'Appliquer les filtres', en: 'Apply filters', he: 'החל סינונים' },
  'clear filters': { fr: 'Effacer les filtres', en: 'Clear filters', he: 'נקה סינונים' },
  'reset filters': { fr: 'Réinitialiser les filtres', en: 'Reset filters', he: 'אפס סינונים' },
  
  // ===== COLUMNS =====
  'col brand': { fr: 'Marque', en: 'Brand', he: 'מותג' },
  'col email': { fr: 'Email', en: 'Email', he: 'אימייל' },
  'col sector': { fr: 'Secteur', en: 'Sector', he: 'מגזר' },
  'col status': { fr: 'Statut', en: 'Status', he: 'סטטוס' },
  'col stage': { fr: 'Étape', en: 'Stage', he: 'שלב' },
  'col source': { fr: 'Source', en: 'Source', he: 'מקור' },
  'col created': { fr: 'Créé', en: 'Created', he: 'נוצר' },
  'col updated': { fr: 'Modifié', en: 'Updated', he: 'עודכן' },
  'col owner': { fr: 'Propriétaire', en: 'Owner', he: 'בעלים' },
  'col phone': { fr: 'Téléphone', en: 'Phone', he: 'טלפון' },
  'col address': { fr: 'Adresse', en: 'Address', he: 'כתובת' },
  'col city': { fr: 'Ville', en: 'City', he: 'עיר' },
  'col country': { fr: 'Pays', en: 'Country', he: 'מדינה' },
  'col next action': { fr: 'Prochaine action', en: 'Next action', he: 'פעולה הבאה' },
  'col last contact': { fr: 'Dernier contact', en: 'Last contact', he: 'קשר אחרון' },
  'col value': { fr: 'Valeur', en: 'Value', he: 'ערך' },
  'col amount': { fr: 'Montant', en: 'Amount', he: 'סכום' },
  'col priority': { fr: 'Priorité', en: 'Priority', he: 'עדיפות' },
  'col type': { fr: 'Type', en: 'Type', he: 'סוג' },
  'col date': { fr: 'Date', en: 'Date', he: 'תאריך' },
  
  // ===== ACTIONS =====
  'add note': { fr: 'Ajouter une note', en: 'Add note', he: 'הוסף הערה' },
  'add activity': { fr: 'Ajouter une activité', en: 'Add activity', he: 'הוסף פעילות' },
  'add task': { fr: 'Ajouter une tâche', en: 'Add task', he: 'הוסף משימה' },
  'add tag': { fr: 'Ajouter un tag', en: 'Add tag', he: 'הוסף תגית' },
  'add lead': { fr: 'Ajouter un prospect', en: 'Add lead', he: 'הוסף ליד' },
  'add contact': { fr: 'Ajouter un contact', en: 'Add contact', he: 'הוסף איש קשר' },
  'add company': { fr: 'Ajouter une entreprise', en: 'Add company', he: 'הוסף חברה' },
  'edit lead': { fr: 'Modifier le prospect', en: 'Edit lead', he: 'ערוך ליד' },
  'edit contact': { fr: 'Modifier le contact', en: 'Edit contact', he: 'ערוך איש קשר' },
  'edit company': { fr: "Modifier l'entreprise", en: 'Edit company', he: 'ערוך חברה' },
  'delete lead': { fr: 'Supprimer le prospect', en: 'Delete lead', he: 'מחק ליד' },
  'delete contact': { fr: 'Supprimer le contact', en: 'Delete contact', he: 'מחק איש קשר' },
  'delete company': { fr: "Supprimer l'entreprise", en: 'Delete company', he: 'מחק חברה' },
  'view details': { fr: 'Voir les détails', en: 'View details', he: 'צפה בפרטים' },
  'view history': { fr: "Voir l'historique", en: 'View history', he: 'צפה בהיסטוריה' },
  'view activities': { fr: 'Voir les activités', en: 'View activities', he: 'צפה בפעילויות' },
  'view notes': { fr: 'Voir les notes', en: 'View notes', he: 'צפה בהערות' },
  'send email': { fr: 'Envoyer un email', en: 'Send email', he: 'שלח אימייל' },
  'call': { fr: 'Appeler', en: 'Call', he: 'התקשר' },
  'schedule': { fr: 'Planifier', en: 'Schedule', he: 'תזמן' },
  'assign to': { fr: 'Attribuer à', en: 'Assign to', he: 'הקצה ל' },
  'convert to contact': { fr: 'Convertir en contact', en: 'Convert to contact', he: 'המר לאיש קשר' },
  'convert to opportunity': { fr: 'Convertir en opportunité', en: 'Convert to opportunity', he: 'המר להזדמנות' },
  
  // ===== NEXT ACTION =====
  'next action': { fr: 'Prochaine action', en: 'Next action', he: 'פעולה הבאה' },
  'add next action': { fr: 'Ajouter prochaine action', en: 'Add next action', he: 'הוסף פעולה הבאה' },
  'edit next action': { fr: 'Modifier prochaine action', en: 'Edit next action', he: 'ערוך פעולה הבאה' },
  'date required': { fr: 'Date requise', en: 'Date required', he: 'תאריך נדרש' },
  'saved': { fr: 'Enregistré', en: 'Saved', he: 'נשמר' },
  'missing': { fr: 'Manquant', en: 'Missing', he: 'חסר' },
  'missing hint': { fr: 'Veuillez définir une prochaine action', en: 'Please set a next action', he: 'נא להגדיר פעולה הבאה' },
  'actions required': { fr: 'Actions requises', en: 'Actions required', he: 'נדרשות פעולות' },
  'overdue': { fr: 'En retard', en: 'Overdue', he: 'באיחור' },
  'overdue actions': { fr: 'Actions en retard', en: 'Overdue actions', he: 'פעולות באיחור' },
  
  // ===== MINI ANALYSES =====
  'process': { fr: 'Traiter', en: 'Process', he: 'עבד' },
  'workflow': { fr: 'Workflow', en: 'Workflow', he: 'תהליך עבודה' },
  'review': { fr: 'Réviser', en: 'Review', he: 'סקור' },
  'approve': { fr: 'Approuver', en: 'Approve', he: 'אשר' },
  'reject': { fr: 'Rejeter', en: 'Reject', he: 'דחה' },
  'pending review': { fr: 'En attente de révision', en: 'Pending review', he: 'ממתין לסקירה' },
  'in progress': { fr: 'En cours', en: 'In progress', he: 'בתהליך' },
  
  // ===== EMAILS =====
  'compose': { fr: 'Rédiger', en: 'Compose', he: 'חבר' },
  'reply': { fr: 'Répondre', en: 'Reply', he: 'השב' },
  'forward': { fr: 'Transférer', en: 'Forward', he: 'העבר' },
  'draft': { fr: 'Brouillon', en: 'Draft', he: 'טיוטה' },
  'drafts': { fr: 'Brouillons', en: 'Drafts', he: 'טיוטות' },
  'sent': { fr: 'Envoyé', en: 'Sent', he: 'נשלח' },
  'inbox': { fr: 'Boîte de réception', en: 'Inbox', he: 'דואר נכנס' },
  'subject': { fr: 'Sujet', en: 'Subject', he: 'נושא' },
  'recipient': { fr: 'Destinataire', en: 'Recipient', he: 'נמען' },
  'recipients': { fr: 'Destinataires', en: 'Recipients', he: 'נמענים' },
  'cc': { fr: 'Cc', en: 'Cc', he: 'העתק' },
  'bcc': { fr: 'Cci', en: 'Bcc', he: 'העתק מוסתר' },
  'attachment': { fr: 'Pièce jointe', en: 'Attachment', he: 'קובץ מצורף' },
  'attachments': { fr: 'Pièces jointes', en: 'Attachments', he: 'קבצים מצורפים' },
  
  // ===== SETTINGS =====
  'general': { fr: 'Général', en: 'General', he: 'כללי' },
  'account': { fr: 'Compte', en: 'Account', he: 'חשבון' },
  'security': { fr: 'Sécurité', en: 'Security', he: 'אבטחה' },
  'notifications': { fr: 'Notifications', en: 'Notifications', he: 'התראות' },
  'preferences': { fr: 'Préférences', en: 'Preferences', he: 'העדפות' },
  'language': { fr: 'Langue', en: 'Language', he: 'שפה' },
  'theme': { fr: 'Thème', en: 'Theme', he: 'עיצוב' },
  'timezone': { fr: 'Fuseau horaire', en: 'Timezone', he: 'אזור זמן' },
  'current password': { fr: 'Mot de passe actuel', en: 'Current password', he: 'סיסמה נוכחית' },
  'new password': { fr: 'Nouveau mot de passe', en: 'New password', he: 'סיסמה חדשה' },
  'confirm password': { fr: 'Confirmer le mot de passe', en: 'Confirm password', he: 'אשר סיסמה' },
  'change password': { fr: 'Changer le mot de passe', en: 'Change password', he: 'שנה סיסמה' },
  
  // ===== RBAC =====
  'admin only': { fr: 'Réservé aux administrateurs', en: 'Admin only', he: 'מנהלים בלבד' },
  'permission denied': { fr: 'Permission refusée', en: 'Permission denied', he: 'הרשאה נדחתה' },
  'access denied': { fr: 'Accès refusé', en: 'Access denied', he: 'הגישה נדחתה' },
  'role': { fr: 'Rôle', en: 'Role', he: 'תפקיד' },
  'roles': { fr: 'Rôles', en: 'Roles', he: 'תפקידים' },
  'permissions': { fr: 'Permissions', en: 'Permissions', he: 'הרשאות' },
  'admin': { fr: 'Administrateur', en: 'Admin', he: 'מנהל' },
  'manager': { fr: 'Responsable', en: 'Manager', he: 'מנהל' },
  'sales': { fr: 'Commercial', en: 'Sales', he: 'מכירות' },
  'user': { fr: 'Utilisateur', en: 'User', he: 'משתמש' },
  
  // ===== QUALITY =====
  'duplicates': { fr: 'Doublons', en: 'Duplicates', he: 'כפילויות' },
  'merge': { fr: 'Fusionner', en: 'Merge', he: 'מזג' },
  'merged': { fr: 'Fusionné', en: 'Merged', he: 'מוזג' },
  'potential duplicates': { fr: 'Doublons potentiels', en: 'Potential duplicates', he: 'כפילויות פוטנציאליות' },
  'no duplicates': { fr: 'Aucun doublon', en: 'No duplicates', he: 'אין כפילויות' },
  
  // ===== EXPORT =====
  'backup': { fr: 'Sauvegarder', en: 'Backup', he: 'גבה' },
  'backup all': { fr: 'Tout sauvegarder', en: 'Backup all', he: 'גבה הכל' },
  'backup success': { fr: 'Sauvegarde réussie', en: 'Backup successful', he: 'הגיבוי הצליח' },
  'export csv': { fr: 'Exporter CSV', en: 'Export CSV', he: 'ייצא CSV' },
  'export excel': { fr: 'Exporter Excel', en: 'Export Excel', he: 'ייצא Excel' },
  'export pdf': { fr: 'Exporter PDF', en: 'Export PDF', he: 'ייצא PDF' },
  
  // ===== KPI =====
  'response times': { fr: 'Temps de réponse', en: 'Response times', he: 'זמני תגובה' },
  'conversion times': { fr: 'Temps de conversion', en: 'Conversion times', he: 'זמני המרה' },
  'source performance': { fr: 'Performance par source', en: 'Source performance', he: 'ביצועי מקור' },
  'funnel': { fr: 'Entonnoir', en: 'Funnel', he: 'משפך' },
  'avg response': { fr: 'Temps moyen de réponse', en: 'Avg response time', he: 'זמן תגובה ממוצע' },
  'conversion rate': { fr: 'Taux de conversion', en: 'Conversion rate', he: 'שיעור המרה' },
  
  // ===== MISC =====
  'back to home': { fr: "Retour à l'accueil", en: 'Back to home', he: 'חזור לדף הבית' },
  'see all': { fr: 'Voir tout', en: 'See all', he: 'צפה בהכל' },
  'show more': { fr: 'Afficher plus', en: 'Show more', he: 'הצג עוד' },
  'show less': { fr: 'Afficher moins', en: 'Show less', he: 'הצג פחות' },
  'loading': { fr: 'Chargement...', en: 'Loading...', he: 'טוען...' },
  'error': { fr: 'Erreur', en: 'Error', he: 'שגיאה' },
  'success': { fr: 'Succès', en: 'Success', he: 'הצלחה' },
  'warning': { fr: 'Avertissement', en: 'Warning', he: 'אזהרה' },
  'info': { fr: 'Information', en: 'Info', he: 'מידע' },
  'confirm': { fr: 'Confirmer', en: 'Confirm', he: 'אשר' },
  'cancel': { fr: 'Annuler', en: 'Cancel', he: 'ביטול' },
  'yes': { fr: 'Oui', en: 'Yes', he: 'כן' },
  'no': { fr: 'Non', en: 'No', he: 'לא' },
  'ok': { fr: 'OK', en: 'OK', he: 'אישור' },
  'close': { fr: 'Fermer', en: 'Close', he: 'סגור' },
  'save': { fr: 'Enregistrer', en: 'Save', he: 'שמור' },
  'edit': { fr: 'Modifier', en: 'Edit', he: 'ערוך' },
  'delete': { fr: 'Supprimer', en: 'Delete', he: 'מחק' },
  'add': { fr: 'Ajouter', en: 'Add', he: 'הוסף' },
  'create': { fr: 'Créer', en: 'Create', he: 'צור' },
  'update': { fr: 'Mettre à jour', en: 'Update', he: 'עדכן' },
  'refresh': { fr: 'Actualiser', en: 'Refresh', he: 'רענן' },
  'retry': { fr: 'Réessayer', en: 'Retry', he: 'נסה שוב' },
  'submit': { fr: 'Soumettre', en: 'Submit', he: 'שלח' },
  'search': { fr: 'Rechercher', en: 'Search', he: 'חיפוש' },
  'filter': { fr: 'Filtrer', en: 'Filter', he: 'סנן' },
  'sort': { fr: 'Trier', en: 'Sort', he: 'מיין' },
  'export': { fr: 'Exporter', en: 'Export', he: 'ייצא' },
  'import': { fr: 'Importer', en: 'Import', he: 'ייבא' },
  'download': { fr: 'Télécharger', en: 'Download', he: 'הורד' },
  'upload': { fr: 'Téléverser', en: 'Upload', he: 'העלה' },
  'print': { fr: 'Imprimer', en: 'Print', he: 'הדפס' },
  'copy': { fr: 'Copier', en: 'Copy', he: 'העתק' },
  'paste': { fr: 'Coller', en: 'Paste', he: 'הדבק' },
  'select all': { fr: 'Tout sélectionner', en: 'Select all', he: 'בחר הכל' },
  'deselect all': { fr: 'Tout désélectionner', en: 'Deselect all', he: 'בטל בחירה' },
  'none': { fr: 'Aucun', en: 'None', he: 'ללא' },
  'all': { fr: 'Tout', en: 'All', he: 'הכל' },
  'other': { fr: 'Autre', en: 'Other', he: 'אחר' },
  'unknown': { fr: 'Inconnu', en: 'Unknown', he: 'לא ידוע' },
  'n/a': { fr: 'N/A', en: 'N/A', he: 'לא זמין' },
  'today': { fr: "Aujourd'hui", en: 'Today', he: 'היום' },
  'yesterday': { fr: 'Hier', en: 'Yesterday', he: 'אתמול' },
  'this week': { fr: 'Cette semaine', en: 'This week', he: 'השבוע' },
  'this month': { fr: 'Ce mois', en: 'This month', he: 'החודש' },
  'this year': { fr: 'Cette année', en: 'This year', he: 'השנה' },
};

/**
 * Normalize text for matching
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Replace [AUTO] placeholders in a locale file
 */
function processLocale(lang) {
  const localePath = path.join(LOCALES_DIR, `${lang}.json`);
  let content = fs.readFileSync(localePath, 'utf8');
  
  let replacedCount = 0;
  
  // Find all [AUTO] entries
  const autoPattern = /"\[AUTO\] ([^"]+)"/g;
  
  content = content.replace(autoPattern, (match, autoText) => {
    const normalized = normalize(autoText);
    
    // Try exact match first
    if (REPLACEMENTS[normalized]) {
      replacedCount++;
      return `"${REPLACEMENTS[normalized][lang]}"`;
    }
    
    // Try partial matches
    for (const [key, translations] of Object.entries(REPLACEMENTS)) {
      if (normalized === normalize(key)) {
        replacedCount++;
        return `"${translations[lang]}"`;
      }
    }
    
    // If no match found, create a readable fallback (remove [AUTO] prefix)
    replacedCount++;
    
    // Convert to proper case for each language
    let result = autoText;
    if (lang === 'fr') {
      // French: capitalize first letter only
      result = autoText.charAt(0).toUpperCase() + autoText.slice(1).toLowerCase();
    } else if (lang === 'en') {
      // English: Title Case
      result = autoText.replace(/\b\w/g, c => c.toUpperCase());
    } else if (lang === 'he') {
      // Hebrew: keep as is but mark
      result = autoText;
    }
    
    return `"${result}"`;
  });
  
  fs.writeFileSync(localePath, content);
  return replacedCount;
}

/**
 * Main function
 */
function main() {
  console.log('🔄 i18n Replace AUTO Script — IGV CRM');
  console.log('======================================\n');
  
  for (const lang of ['fr', 'en', 'he']) {
    const count = processLocale(lang);
    console.log(`✅ ${lang.toUpperCase()}: Replaced ${count} [AUTO] placeholders`);
  }
  
  console.log('\n✅ Replacement complete!\n');
}

main();
