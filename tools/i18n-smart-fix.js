/**
 * i18n Smart Fix Script — IGV CRM
 * ================================
 * 
 * Generates intelligent placeholder translations based on key patterns.
 * 
 * Usage: node tools/i18n-smart-fix.js
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'src', 'i18n', 'locales');
const TOOLS_DIR = __dirname;

// Common word translations
const TRANSLATIONS = {
  // Actions
  'save': { fr: 'Enregistrer', en: 'Save', he: 'שמור' },
  'saved': { fr: 'Enregistré', en: 'Saved', he: 'נשמר' },
  'cancel': { fr: 'Annuler', en: 'Cancel', he: 'ביטול' },
  'delete': { fr: 'Supprimer', en: 'Delete', he: 'מחק' },
  'deleted': { fr: 'Supprimé', en: 'Deleted', he: 'נמחק' },
  'edit': { fr: 'Modifier', en: 'Edit', he: 'ערוך' },
  'add': { fr: 'Ajouter', en: 'Add', he: 'הוסף' },
  'create': { fr: 'Créer', en: 'Create', he: 'צור' },
  'created': { fr: 'Créé', en: 'Created', he: 'נוצר' },
  'update': { fr: 'Mettre à jour', en: 'Update', he: 'עדכן' },
  'updated': { fr: 'Mis à jour', en: 'Updated', he: 'עודכן' },
  'confirm': { fr: 'Confirmer', en: 'Confirm', he: 'אשר' },
  'close': { fr: 'Fermer', en: 'Close', he: 'סגור' },
  'back': { fr: 'Retour', en: 'Back', he: 'חזור' },
  'next': { fr: 'Suivant', en: 'Next', he: 'הבא' },
  'previous': { fr: 'Précédent', en: 'Previous', he: 'הקודם' },
  'submit': { fr: 'Soumettre', en: 'Submit', he: 'שלח' },
  'search': { fr: 'Rechercher', en: 'Search', he: 'חיפוש' },
  'filter': { fr: 'Filtrer', en: 'Filter', he: 'סנן' },
  'export': { fr: 'Exporter', en: 'Export', he: 'ייצוא' },
  'import': { fr: 'Importer', en: 'Import', he: 'ייבוא' },
  'download': { fr: 'Télécharger', en: 'Download', he: 'הורדה' },
  'upload': { fr: 'Téléverser', en: 'Upload', he: 'העלאה' },
  'send': { fr: 'Envoyer', en: 'Send', he: 'שלח' },
  'sent': { fr: 'Envoyé', en: 'Sent', he: 'נשלח' },
  'copy': { fr: 'Copier', en: 'Copy', he: 'העתק' },
  'copied': { fr: 'Copié', en: 'Copied', he: 'הועתק' },
  'refresh': { fr: 'Actualiser', en: 'Refresh', he: 'רענן' },
  'reset': { fr: 'Réinitialiser', en: 'Reset', he: 'איפוס' },
  'apply': { fr: 'Appliquer', en: 'Apply', he: 'החל' },
  'assign': { fr: 'Attribuer', en: 'Assign', he: 'הקצה' },
  'assigned': { fr: 'Attribué', en: 'Assigned', he: 'הוקצה' },
  'convert': { fr: 'Convertir', en: 'Convert', he: 'המר' },
  'converted': { fr: 'Converti', en: 'Converted', he: 'הומר' },
  'merge': { fr: 'Fusionner', en: 'Merge', he: 'מזג' },
  'merged': { fr: 'Fusionné', en: 'Merged', he: 'מוזג' },
  'view': { fr: 'Voir', en: 'View', he: 'צפה' },
  'select': { fr: 'Sélectionner', en: 'Select', he: 'בחר' },
  'selected': { fr: 'Sélectionné', en: 'Selected', he: 'נבחר' },
  'load': { fr: 'Charger', en: 'Load', he: 'טען' },
  'loading': { fr: 'Chargement...', en: 'Loading...', he: 'טוען...' },
  'retry': { fr: 'Réessayer', en: 'Retry', he: 'נסה שוב' },
  
  // Status
  'success': { fr: 'Succès', en: 'Success', he: 'הצלחה' },
  'error': { fr: 'Erreur', en: 'Error', he: 'שגיאה' },
  'failed': { fr: 'Échec', en: 'Failed', he: 'נכשל' },
  'pending': { fr: 'En attente', en: 'Pending', he: 'ממתין' },
  'active': { fr: 'Actif', en: 'Active', he: 'פעיל' },
  'inactive': { fr: 'Inactif', en: 'Inactive', he: 'לא פעיל' },
  'enabled': { fr: 'Activé', en: 'Enabled', he: 'מופעל' },
  'disabled': { fr: 'Désactivé', en: 'Disabled', he: 'מושבת' },
  'completed': { fr: 'Terminé', en: 'Completed', he: 'הושלם' },
  'cancelled': { fr: 'Annulé', en: 'Cancelled', he: 'בוטל' },
  'new': { fr: 'Nouveau', en: 'New', he: 'חדש' },
  'open': { fr: 'Ouvert', en: 'Open', he: 'פתוח' },
  'closed': { fr: 'Fermé', en: 'Closed', he: 'סגור' },
  'draft': { fr: 'Brouillon', en: 'Draft', he: 'טיוטה' },
  'published': { fr: 'Publié', en: 'Published', he: 'פורסם' },
  'archived': { fr: 'Archivé', en: 'Archived', he: 'בארכיון' },
  'overdue': { fr: 'En retard', en: 'Overdue', he: 'באיחור' },
  'required': { fr: 'Requis', en: 'Required', he: 'נדרש' },
  'optional': { fr: 'Optionnel', en: 'Optional', he: 'אופציונלי' },
  'missing': { fr: 'Manquant', en: 'Missing', he: 'חסר' },
  'valid': { fr: 'Valide', en: 'Valid', he: 'תקף' },
  'invalid': { fr: 'Invalide', en: 'Invalid', he: 'לא תקף' },
  
  // Entities
  'lead': { fr: 'Prospect', en: 'Lead', he: 'ליד' },
  'leads': { fr: 'Prospects', en: 'Leads', he: 'לידים' },
  'contact': { fr: 'Contact', en: 'Contact', he: 'איש קשר' },
  'contacts': { fr: 'Contacts', en: 'Contacts', he: 'אנשי קשר' },
  'company': { fr: 'Entreprise', en: 'Company', he: 'חברה' },
  'companies': { fr: 'Entreprises', en: 'Companies', he: 'חברות' },
  'opportunity': { fr: 'Opportunité', en: 'Opportunity', he: 'הזדמנות' },
  'opportunities': { fr: 'Opportunités', en: 'Opportunities', he: 'הזדמנויות' },
  'task': { fr: 'Tâche', en: 'Task', he: 'משימה' },
  'tasks': { fr: 'Tâches', en: 'Tasks', he: 'משימות' },
  'activity': { fr: 'Activité', en: 'Activity', he: 'פעילות' },
  'activities': { fr: 'Activités', en: 'Activities', he: 'פעילויות' },
  'note': { fr: 'Note', en: 'Note', he: 'הערה' },
  'notes': { fr: 'Notes', en: 'Notes', he: 'הערות' },
  'email': { fr: 'Email', en: 'Email', he: 'אימייל' },
  'emails': { fr: 'Emails', en: 'Emails', he: 'אימיילים' },
  'template': { fr: 'Modèle', en: 'Template', he: 'תבנית' },
  'templates': { fr: 'Modèles', en: 'Templates', he: 'תבניות' },
  'invoice': { fr: 'Facture', en: 'Invoice', he: 'חשבונית' },
  'invoices': { fr: 'Factures', en: 'Invoices', he: 'חשבוניות' },
  'user': { fr: 'Utilisateur', en: 'User', he: 'משתמש' },
  'users': { fr: 'Utilisateurs', en: 'Users', he: 'משתמשים' },
  'role': { fr: 'Rôle', en: 'Role', he: 'תפקיד' },
  'roles': { fr: 'Rôles', en: 'Roles', he: 'תפקידים' },
  'permission': { fr: 'Permission', en: 'Permission', he: 'הרשאה' },
  'permissions': { fr: 'Permissions', en: 'Permissions', he: 'הרשאות' },
  'tag': { fr: 'Tag', en: 'Tag', he: 'תגית' },
  'tags': { fr: 'Tags', en: 'Tags', he: 'תגיות' },
  'stage': { fr: 'Étape', en: 'Stage', he: 'שלב' },
  'stages': { fr: 'Étapes', en: 'Stages', he: 'שלבים' },
  'pipeline': { fr: 'Pipeline', en: 'Pipeline', he: 'פייפליין' },
  'rule': { fr: 'Règle', en: 'Rule', he: 'כלל' },
  'rules': { fr: 'Règles', en: 'Rules', he: 'כללים' },
  'automation': { fr: 'Automatisation', en: 'Automation', he: 'אוטומציה' },
  'dashboard': { fr: 'Tableau de bord', en: 'Dashboard', he: 'לוח בקרה' },
  'settings': { fr: 'Paramètres', en: 'Settings', he: 'הגדרות' },
  'profile': { fr: 'Profil', en: 'Profile', he: 'פרופיל' },
  'analysis': { fr: 'Analyse', en: 'Analysis', he: 'ניתוח' },
  'analyses': { fr: 'Analyses', en: 'Analyses', he: 'ניתוחים' },
  'report': { fr: 'Rapport', en: 'Report', he: 'דוח' },
  'reports': { fr: 'Rapports', en: 'Reports', he: 'דוחות' },
  'audit': { fr: 'Audit', en: 'Audit', he: 'ביקורת' },
  'log': { fr: 'Journal', en: 'Log', he: 'יומן' },
  'logs': { fr: 'Journaux', en: 'Logs', he: 'יומנים' },
  'history': { fr: 'Historique', en: 'History', he: 'היסטוריה' },
  'notification': { fr: 'Notification', en: 'Notification', he: 'התראה' },
  'notifications': { fr: 'Notifications', en: 'Notifications', he: 'התראות' },
  'alert': { fr: 'Alerte', en: 'Alert', he: 'התראה' },
  'alerts': { fr: 'Alertes', en: 'Alerts', he: 'התראות' },
  'duplicate': { fr: 'Doublon', en: 'Duplicate', he: 'כפיל' },
  'duplicates': { fr: 'Doublons', en: 'Duplicates', he: 'כפילויות' },
  'quality': { fr: 'Qualité', en: 'Quality', he: 'איכות' },
  'performance': { fr: 'Performance', en: 'Performance', he: 'ביצועים' },
  'kpi': { fr: 'KPI', en: 'KPI', he: 'KPI' },
  
  // Fields
  'name': { fr: 'Nom', en: 'Name', he: 'שם' },
  'title': { fr: 'Titre', en: 'Title', he: 'כותרת' },
  'description': { fr: 'Description', en: 'Description', he: 'תיאור' },
  'date': { fr: 'Date', en: 'Date', he: 'תאריך' },
  'time': { fr: 'Heure', en: 'Time', he: 'שעה' },
  'datetime': { fr: 'Date et heure', en: 'Date and time', he: 'תאריך ושעה' },
  'phone': { fr: 'Téléphone', en: 'Phone', he: 'טלפון' },
  'address': { fr: 'Adresse', en: 'Address', he: 'כתובת' },
  'city': { fr: 'Ville', en: 'City', he: 'עיר' },
  'country': { fr: 'Pays', en: 'Country', he: 'מדינה' },
  'source': { fr: 'Source', en: 'Source', he: 'מקור' },
  'status': { fr: 'Statut', en: 'Status', he: 'סטטוס' },
  'priority': { fr: 'Priorité', en: 'Priority', he: 'עדיפות' },
  'type': { fr: 'Type', en: 'Type', he: 'סוג' },
  'category': { fr: 'Catégorie', en: 'Category', he: 'קטגוריה' },
  'value': { fr: 'Valeur', en: 'Value', he: 'ערך' },
  'amount': { fr: 'Montant', en: 'Amount', he: 'סכום' },
  'total': { fr: 'Total', en: 'Total', he: 'סה"כ' },
  'count': { fr: 'Nombre', en: 'Count', he: 'מספר' },
  'owner': { fr: 'Propriétaire', en: 'Owner', he: 'בעלים' },
  'assignee': { fr: 'Assigné', en: 'Assignee', he: 'משויך' },
  'creator': { fr: 'Créateur', en: 'Creator', he: 'יוצר' },
  'comment': { fr: 'Commentaire', en: 'Comment', he: 'תגובה' },
  'comments': { fr: 'Commentaires', en: 'Comments', he: 'תגובות' },
  'message': { fr: 'Message', en: 'Message', he: 'הודעה' },
  'subject': { fr: 'Sujet', en: 'Subject', he: 'נושא' },
  'body': { fr: 'Corps', en: 'Body', he: 'גוף' },
  'content': { fr: 'Contenu', en: 'Content', he: 'תוכן' },
  'password': { fr: 'Mot de passe', en: 'Password', he: 'סיסמה' },
  'username': { fr: "Nom d'utilisateur", en: 'Username', he: 'שם משתמש' },
  'color': { fr: 'Couleur', en: 'Color', he: 'צבע' },
  'order': { fr: 'Ordre', en: 'Order', he: 'סדר' },
  'position': { fr: 'Position', en: 'Position', he: 'מיקום' },
  
  // UI
  'home': { fr: 'Accueil', en: 'Home', he: 'בית' },
  'menu': { fr: 'Menu', en: 'Menu', he: 'תפריט' },
  'list': { fr: 'Liste', en: 'List', he: 'רשימה' },
  'table': { fr: 'Tableau', en: 'Table', he: 'טבלה' },
  'grid': { fr: 'Grille', en: 'Grid', he: 'רשת' },
  'card': { fr: 'Carte', en: 'Card', he: 'כרטיס' },
  'cards': { fr: 'Cartes', en: 'Cards', he: 'כרטיסים' },
  'form': { fr: 'Formulaire', en: 'Form', he: 'טופס' },
  'dialog': { fr: 'Dialogue', en: 'Dialog', he: 'דיאלוג' },
  'modal': { fr: 'Modale', en: 'Modal', he: 'חלון' },
  'panel': { fr: 'Panneau', en: 'Panel', he: 'פאנל' },
  'sidebar': { fr: 'Barre latérale', en: 'Sidebar', he: 'סרגל צד' },
  'header': { fr: 'En-tête', en: 'Header', he: 'כותרת' },
  'footer': { fr: 'Pied de page', en: 'Footer', he: 'תחתית' },
  'tab': { fr: 'Onglet', en: 'Tab', he: 'כרטיסייה' },
  'tabs': { fr: 'Onglets', en: 'Tabs', he: 'כרטיסיות' },
  'page': { fr: 'Page', en: 'Page', he: 'עמוד' },
  'pages': { fr: 'Pages', en: 'Pages', he: 'עמודים' },
  'section': { fr: 'Section', en: 'Section', he: 'סעיף' },
  'empty': { fr: 'Vide', en: 'Empty', he: 'ריק' },
  'no_data': { fr: 'Aucune donnée', en: 'No data', he: 'אין נתונים' },
  'no_results': { fr: 'Aucun résultat', en: 'No results', he: 'אין תוצאות' },
  'all': { fr: 'Tout', en: 'All', he: 'הכל' },
  'none': { fr: 'Aucun', en: 'None', he: 'ללא' },
  'other': { fr: 'Autre', en: 'Other', he: 'אחר' },
  'actions': { fr: 'Actions', en: 'Actions', he: 'פעולות' },
  'options': { fr: 'Options', en: 'Options', he: 'אפשרויות' },
  'details': { fr: 'Détails', en: 'Details', he: 'פרטים' },
  'info': { fr: 'Info', en: 'Info', he: 'מידע' },
  'help': { fr: 'Aide', en: 'Help', he: 'עזרה' },
  'hint': { fr: 'Indice', en: 'Hint', he: 'רמז' },
  'tip': { fr: 'Astuce', en: 'Tip', he: 'טיפ' },
  'warning': { fr: 'Avertissement', en: 'Warning', he: 'אזהרה' },
  'recent': { fr: 'Récent', en: 'Recent', he: 'אחרון' },
  'today': { fr: "Aujourd'hui", en: 'Today', he: 'היום' },
  'yesterday': { fr: 'Hier', en: 'Yesterday', he: 'אתמול' },
  'week': { fr: 'Semaine', en: 'Week', he: 'שבוע' },
  'month': { fr: 'Mois', en: 'Month', he: 'חודש' },
  'year': { fr: 'Année', en: 'Year', he: 'שנה' },
  'shortcut': { fr: 'Raccourci', en: 'Shortcut', he: 'קיצור' },
  'min_chars': { fr: 'Caractères minimum', en: 'Minimum characters', he: 'תווים מינימום' },
  'try_different': { fr: 'Essayez autre chose', en: 'Try something different', he: 'נסה משהו אחר' },
  
  // Messages
  'confirm_delete': { fr: 'Confirmer la suppression ?', en: 'Confirm delete?', he: 'לאשר מחיקה?' },
  'are_you_sure': { fr: 'Êtes-vous sûr ?', en: 'Are you sure?', he: 'האם אתה בטוח?' },
  'save_changes': { fr: 'Enregistrer les modifications', en: 'Save changes', he: 'שמור שינויים' },
  'unsaved_changes': { fr: 'Modifications non enregistrées', en: 'Unsaved changes', he: 'שינויים לא שמורים' },
  'changes_saved': { fr: 'Modifications enregistrées', en: 'Changes saved', he: 'השינויים נשמרו' },
  'load_failed': { fr: 'Échec du chargement', en: 'Failed to load', he: 'נכשל בטעינה' },
  'save_failed': { fr: 'Échec de l\'enregistrement', en: 'Failed to save', he: 'נכשל בשמירה' },
  'delete_failed': { fr: 'Échec de la suppression', en: 'Failed to delete', he: 'נכשל במחיקה' },
  'action_required': { fr: 'Action requise', en: 'Action required', he: 'נדרשת פעולה' },
  'actions_required': { fr: 'Actions requises', en: 'Actions required', he: 'נדרשות פעולות' },
  'admin_only': { fr: 'Réservé aux administrateurs', en: 'Admin only', he: 'מנהלים בלבד' },
  'access_denied': { fr: 'Accès refusé', en: 'Access denied', he: 'הגישה נדחתה' },
  'not_found': { fr: 'Non trouvé', en: 'Not found', he: 'לא נמצא' },
  'already_exists': { fr: 'Existe déjà', en: 'Already exists', he: 'כבר קיים' },
  'backup_success': { fr: 'Sauvegarde réussie', en: 'Backup successful', he: 'גיבוי הצליח' },
  'backup_all': { fr: 'Tout sauvegarder', en: 'Backup all', he: 'גבה הכל' },
  'date_required': { fr: 'Date requise', en: 'Date required', he: 'תאריך נדרש' },
  'field_required': { fr: 'Champ requis', en: 'Field required', he: 'שדה נדרש' },
  'invalid_email': { fr: 'Email invalide', en: 'Invalid email', he: 'אימייל לא תקין' },
  'invalid_phone': { fr: 'Téléphone invalide', en: 'Invalid phone', he: 'טלפון לא תקין' },
  'password_mismatch': { fr: 'Les mots de passe ne correspondent pas', en: 'Passwords do not match', he: 'הסיסמאות לא תואמות' },
  'password_changed': { fr: 'Mot de passe modifié', en: 'Password changed', he: 'הסיסמה שונתה' },
  'export_error': { fr: 'Erreur d\'exportation', en: 'Export error', he: 'שגיאת ייצוא' },
  'import_error': { fr: 'Erreur d\'importation', en: 'Import error', he: 'שגיאת ייבוא' },
  
  // CRM specific
  'next_action': { fr: 'Prochaine action', en: 'Next action', he: 'פעולה הבאה' },
  'follow_up': { fr: 'Suivi', en: 'Follow-up', he: 'מעקב' },
  'first_contact': { fr: 'Premier contact', en: 'First contact', he: 'קשר ראשון' },
  'last_contact': { fr: 'Dernier contact', en: 'Last contact', he: 'קשר אחרון' },
  'response_time': { fr: 'Temps de réponse', en: 'Response time', he: 'זמן תגובה' },
  'conversion_rate': { fr: 'Taux de conversion', en: 'Conversion rate', he: 'שיעור המרה' },
  'conversion_time': { fr: 'Temps de conversion', en: 'Conversion time', he: 'זמן המרה' },
  'source_performance': { fr: 'Performance par source', en: 'Source performance', he: 'ביצועי מקור' },
  'funnel': { fr: 'Entonnoir', en: 'Funnel', he: 'משפך' },
  'dispatch': { fr: 'Distribution', en: 'Dispatch', he: 'הפצה' },
  'mini_analysis': { fr: 'Mini-analyse', en: 'Mini-analysis', he: 'ניתוח מיני' },
  'mini_analyses': { fr: 'Mini-analyses', en: 'Mini-analyses', he: 'ניתוחי מיני' },
  'workflow': { fr: 'Workflow', en: 'Workflow', he: 'תהליך עבודה' },
};

/**
 * Get nested value from object
 */
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Set nested value in object
 */
function setNestedValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Generate smart translation for a key
 */
function generateTranslation(key, lang) {
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  const secondLast = parts.length > 1 ? parts[parts.length - 2] : '';
  
  // Check for exact match in translations
  const normalizedKey = lastPart.toLowerCase().replace(/_/g, '');
  
  for (const [word, translations] of Object.entries(TRANSLATIONS)) {
    if (normalizedKey === word.toLowerCase().replace(/_/g, '')) {
      return translations[lang];
    }
  }
  
  // Check for compound keys like "delete_confirm", "load_failed"
  const underscoreParts = lastPart.split('_');
  if (underscoreParts.length >= 2) {
    const translatedParts = underscoreParts.map(part => {
      const match = Object.entries(TRANSLATIONS).find(
        ([k]) => k.toLowerCase() === part.toLowerCase()
      );
      return match ? match[1][lang] : part;
    });
    
    // Check if we translated anything
    const hasTranslation = translatedParts.some((p, i) => p !== underscoreParts[i]);
    if (hasTranslation) {
      return translatedParts.join(' ');
    }
  }
  
  // Fallback: convert to readable format
  let readable = lastPart
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();
  
  readable = readable.charAt(0).toUpperCase() + readable.slice(1);
  
  return `[${readable}]`;
}

/**
 * Process missing keys for all languages
 */
function main() {
  console.log('🔧 i18n Smart Fix Script — IGV CRM');
  console.log('===================================\n');
  
  // Load existing locales
  const locales = {};
  for (const lang of ['fr', 'en', 'he']) {
    const localePath = path.join(LOCALES_DIR, `${lang}.json`);
    locales[lang] = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  }
  
  // Load missing keys
  const allMissingKeys = new Set();
  for (const lang of ['fr', 'en', 'he']) {
    const missingPath = path.join(TOOLS_DIR, `missing_keys_${lang}.json`);
    if (fs.existsSync(missingPath)) {
      const missing = JSON.parse(fs.readFileSync(missingPath, 'utf8'));
      Object.keys(missing).forEach(k => allMissingKeys.add(k));
    }
  }
  
  console.log(`📋 Processing ${allMissingKeys.size} unique missing keys...\n`);
  
  let stats = { fr: 0, en: 0, he: 0 };
  
  for (const key of allMissingKeys) {
    for (const lang of ['fr', 'en', 'he']) {
      // Check if key already exists
      if (getNestedValue(locales[lang], key) === undefined) {
        const translation = generateTranslation(key, lang);
        setNestedValue(locales[lang], key, translation);
        stats[lang]++;
      }
    }
  }
  
  // Write updated locales
  for (const lang of ['fr', 'en', 'he']) {
    const localePath = path.join(LOCALES_DIR, `${lang}.json`);
    fs.writeFileSync(localePath, JSON.stringify(locales[lang], null, 2) + '\n');
    console.log(`✅ ${lang.toUpperCase()}: Updated ${stats[lang]} keys`);
  }
  
  console.log('\n✅ Smart fix complete!\n');
}

main();
