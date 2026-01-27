#!/usr/bin/env python3
"""
Script d'automatisation complète de la migration i18n
pour remplacer tous les textes hardcodés par des clés t()
"""

import re
from pathlib import Path

# Définir tous les remplacements à effectuer
# Format: (fichier, pattern_regex, replacement, description)
REPLACEMENTS = [
    # Payment.js - alt cartes bancaires
    ("src/pages/Payment.js", 
     r'alt="Visa"', 
     'alt={t(\'payment.visaAlt\')}',
     "Alt Visa"),
    ("src/pages/Payment.js", 
     r'alt="Mastercard"', 
     'alt={t(\'payment.mastercardAlt\')}',
     "Alt Mastercard"),
    ("src/pages/Payment.js", 
     r'alt="CB"', 
     'alt={t(\'payment.cbAlt\')}',
     "Alt CB"),
    
    # Sidebar.js - alt logo
    ("src/components/common/Sidebar.js", 
     r'alt="IGV Logo"', 
     'alt={t(\'common.logoAlt\')}',
     "Alt IGV Logo"),
    ("src/components/common/Sidebar.js", 
     r'alt="IGV"', 
     'alt={t(\'common.logoAlt\')}',
     "Alt IGV"),
    
    # ActivitiesTab.js - placeholder
    ("src/components/crm/ActivitiesTab.js",
     r'placeholder="Rechercher une activité..."',
     'placeholder={t(\'crm.activities.searchPlaceholder\')}',
     "Placeholder activité"),
    
    # CompaniesTab.js - placeholders
    ("src/components/crm/CompaniesTab.js",
     r'placeholder="example\.com"',
     'placeholder={t(\'crm.companies.domainPlaceholder\')}',
     "Placeholder domain"),
    ("src/components/crm/CompaniesTab.js",
     r'placeholder="https://"',
     'placeholder={t(\'crm.companies.websitePlaceholder\')}',
     "Placeholder website"),
    
    # ContactsTab.js - placeholders et titles
    ("src/components/crm/ContactsTab.js",
     r'placeholder="Rechercher un contact..."',
     'placeholder={t(\'crm.contacts.searchPlaceholder\')}',
     "Placeholder contact search"),
    ("src/components/crm/ContactsTab.js",
     r'placeholder="Écrivez votre note ici..."',
     'placeholder={t(\'crm.contacts.notePlaceholder\')}',
     "Placeholder note"),
    ("src/components/crm/ContactsTab.js",
     r'title="Envoyer un email"',
     'title={t(\'crm.contacts.sendEmailTitle\')}',
     "Title send email"),
    ("src/components/crm/ContactsTab.js",
     r'title="Modifier"',
     'title={t(\'common.editTitle\')}',
     "Title modifier"),
    ("src/components/crm/ContactsTab.js",
     r'title="Supprimer"',
     'title={t(\'common.deleteTitle\')}',
     "Title supprimer"),
    
    # EmailsTab.js - placeholders et titles
    ("src/components/crm/EmailsTab.js",
     r'placeholder="Ex: Bienvenue Lead"',
     'placeholder={t(\'crm.emails.namePlaceholder\')}',
     "Placeholder email name"),
    ("src/components/crm/EmailsTab.js",
     r'placeholder="Ex: Bienvenue chez Israel Growth Venture"',
     'placeholder={t(\'crm.emails.subjectPlaceholder\')}',
     "Placeholder email subject"),
    ("src/components/crm/EmailsTab.js",
     r'placeholder="Bonjour \{name\},\\n\\nMerci pour votre intérêt\.\.\."',
     'placeholder={t(\'crm.emails.bodyPlaceholder\')}',
     "Placeholder email body"),
    ("src/components/crm/EmailsTab.js",
     r'title="Copier"',
     'title={t(\'common.copyTitle\')}',
     "Title copier"),
    ("src/components/crm/EmailsTab.js",
     r'title="Supprimer"',
     'title={t(\'common.deleteTitle\')}',
     "Title supprimer"),
    
    # NextActionWidget.js - placeholder
    ("src/components/crm/NextActionWidget.js",
     r'placeholder="Détails sur l\'action à effectuer\.\.\."',
     'placeholder={t(\'crm.nextAction.detailsPlaceholder\')}',
     "Placeholder next action"),
    
    # OpportunitiesTab.js - placeholders
    ("src/components/crm/OpportunitiesTab.js",
     r'placeholder="Ex: Contrat ABC Corp"',
     'placeholder={t(\'crm.opportunities.namePlaceholder\')}',
     "Placeholder opportunity name"),
    ("src/components/crm/OpportunitiesTab.js",
     r'placeholder="10000"',
     'placeholder={t(\'crm.opportunities.valuePlaceholder\')}',
     "Placeholder opportunity value"),
    ("src/components/crm/OpportunitiesTab.js",
     r'placeholder="Notes additionnelles\.\.\."',
     'placeholder={t(\'crm.opportunities.notesPlaceholder\')}',
     "Placeholder opportunity notes"),
    
    # SettingsTab.js - placeholders
    ("src/components/crm/SettingsTab.js",
     r'placeholder="Nom complet"',
     'placeholder={t(\'crm.settings.fullNamePlaceholder\')}',
     "Placeholder full name"),
    ("src/components/crm/SettingsTab.js",
     r'placeholder="Email"',
     'placeholder={t(\'crm.settings.emailPlaceholder\')}',
     "Placeholder email"),
    ("src/components/crm/SettingsTab.js",
     r'placeholder="Mot de passe"',
     'placeholder={t(\'crm.settings.passwordPlaceholder\')}',
     "Placeholder password"),
    
    # LeadsTab.js - titles
    ("src/components/crm/LeadsTab.js",
     r'title="Converti en contact"',
     'title={t(\'crm.leads.convertedToContactTitle\')}',
     "Title converted"),
    ("src/components/crm/LeadsTab.js",
     r'title="Voir le contact créé"',
     'title={t(\'crm.leads.viewContactTitle\')}',
     "Title view contact"),
    ("src/components/crm/LeadsTab.js",
     r'title="Fermer"',
     'title={t(\'common.closeTitle\')}',
     "Title fermer"),
    
    # UsersTab.js - titles
    ("src/components/crm/UsersTab.js",
     r'title="Modifier"',
     'title={t(\'common.editTitle\')}',
     "Title modifier"),
    ("src/components/crm/UsersTab.js",
     r'title="Supprimer"',
     'title={t(\'common.deleteTitle\')}',
     "Title supprimer"),
    
    # CmsAdminButton.jsx - title
    ("src/components/CmsAdminButton.jsx",
     r'title="Ouvrir l\'éditeur de site \(protégé\)"',
     'title={t(\'cms.openEditorTitle\')}',
     "Title CMS editor"),
    
    # RBACPage.js - title
    ("src/pages/admin/RBACPage.js",
     r'title="Modifier les permissions"',
     'title={t(\'crm.rbac.editPermissionsTitle\')}',
     "Title edit permissions"),
    
    # AdminInvoices.js - titles
    ("src/pages/AdminInvoices.js",
     r'title="Generate PDF"',
     'title={t(\'invoice.generatePdfTitle\')}',
     "Title generate PDF"),
    ("src/pages/AdminInvoices.js",
     r'title="Send by Email"',
     'title={t(\'invoice.sendEmailTitle\')}',
     "Title send email"),
]


def apply_replacements(base_path):
    """Applique tous les remplacements définis dans REPLACEMENTS."""
    total_replaced = 0
    files_modified = set()
    
    print("🔧 Application automatique des remplacements i18n\n")
    
    for file_rel_path, pattern, replacement, desc in REPLACEMENTS:
        file_path = base_path / file_rel_path
        
        if not file_path.exists():
            print(f"  ⚠ Fichier non trouvé: {file_rel_path}")
            continue
        
        # Lire le contenu
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Appliquer le remplacement
        new_content, count = re.subn(pattern, replacement, content)
        
        if count > 0:
            # Sauvegarder le fichier modifié
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"  ✓ {file_rel_path}: {desc} ({count} occurrence(s))")
            total_replaced += count
            files_modified.add(file_rel_path)
        else:
            print(f"  ⊘ {file_rel_path}: {desc} (déjà fait ou non trouvé)")
    
    print(f"\n✨ Terminé ! {total_replaced} remplacements appliqués dans {len(files_modified)} fichiers.")
    
    if files_modified:
        print("\n📂 Fichiers modifiés:")
        for file in sorted(files_modified):
            print(f"  - {file}")


def main():
    base_path = Path(r"C:\Users\PC\Desktop\IGV\igv-frontend")
    apply_replacements(base_path)


if __name__ == "__main__":
    main()
