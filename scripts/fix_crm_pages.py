#!/usr/bin/env python3
"""Complete i18n fix for CRM pages"""

# Fix LeadsPage.js
leads_page = '''import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LeadsTab from '../../components/crm/LeadsTab';
import api from '../../utils/api';
import { toast } from 'sonner';

/**
 * LeadsPage - Page for lead/prospect management
 * Loads its own data and passes it to LeadsTab
 */
const LeadsPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'he';
  
  const [data, setData] = useState({ leads: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  // Reset selectedItem when navigating back to leads list via menu
  useEffect(() => {
    if (location.pathname === '/admin/crm/leads') {
      setSelectedItem(null);
    }
  }, [location.pathname]);

  // Listen for custom event from Sidebar when clicking on Leads menu
  useEffect(() => {
    const handleResetView = () => {
      setSelectedItem(null);
    };

    window.addEventListener('resetLeadView', handleResetView);
    window.addEventListener('popstate', handleResetView);

    return () => {
      window.removeEventListener('resetLeadView', handleResetView);
      window.removeEventListener('popstate', handleResetView);
    };
  }, []);

  useEffect(() => {
    loadLeads();
  }, [searchTerm, filters]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/crm/leads', {
        params: { search: searchTerm, ...filters, limit: 50 }
      });
      setData({
        leads: Array.isArray(response?.leads) ? response.leads : [],
        total: response?.total || 0
      });
    } catch (error) {
      console.error('Error loading leads:', error);
      toast.error(t('admin.crm.errors.load_failed'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('admin.crm.leads.title')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('admin.crm.leads.subtitle')}
        </p>
      </div>

      <LeadsTab
        data={data}
        loading={loading}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onRefresh={loadLeads}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        t={t}
      />
    </div>
  );
};

export default LeadsPage;
'''

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\pages\admin\LeadsPage.js', 'w', encoding='utf-8') as f:
    f.write(leads_page)

print("✅ LeadsPage.js fixed")

# Now update CRM sidebar nav translations in locale files
import json

nav_translations = {
    "en": {
        "dashboard": "Dashboard",
        "leads": "Leads",
        "contacts": "Contacts",
        "pipeline": "Pipeline",
        "opportunities": "Opportunities",
        "activities": "Activities",
        "emails": "Emails",
        "users": "Users",
        "settings": "Settings"
    },
    "fr": {
        "dashboard": "Tableau de bord",
        "leads": "Prospects",
        "contacts": "Contacts",
        "pipeline": "Pipeline",
        "opportunities": "Opportunités",
        "activities": "Activités",
        "emails": "Emails",
        "users": "Utilisateurs",
        "settings": "Paramètres"
    },
    "he": {
        "dashboard": "לוח בקרה",
        "leads": "לידים",
        "contacts": "אנשי קשר",
        "pipeline": "צינור מכירות",
        "opportunities": "הזדמנויות",
        "activities": "פעילויות",
        "emails": "אימיילים",
        "users": "משתמשים",
        "settings": "הגדרות"
    }
}

tabs_translations = {
    "en": {
        "dashboard": "Dashboard",
        "leads": "Leads",
        "pipeline": "Pipeline",
        "contacts": "Contacts",
        "settings": "Settings"
    },
    "fr": {
        "dashboard": "Tableau de bord",
        "leads": "Prospects",
        "pipeline": "Pipeline",
        "contacts": "Contacts",
        "settings": "Paramètres"
    },
    "he": {
        "dashboard": "לוח בקרה",
        "leads": "לידים",
        "pipeline": "צינור מכירות",
        "contacts": "אנשי קשר",
        "settings": "הגדרות"
    }
}

errors_translations = {
    "en": {
        "load_failed": "Failed to load data",
        "create_failed": "Failed to create",
        "update_failed": "Failed to update",
        "delete_failed": "Failed to delete",
        "export_failed": "Failed to export",
        "note_failed": "Failed to add note",
        "status_failed": "Failed to update status"
    },
    "fr": {
        "load_failed": "Échec du chargement",
        "create_failed": "Échec de la création",
        "update_failed": "Échec de la mise à jour",
        "delete_failed": "Échec de la suppression",
        "export_failed": "Échec de l'export",
        "note_failed": "Échec de l'ajout de note",
        "status_failed": "Échec de la mise à jour du statut"
    },
    "he": {
        "load_failed": "טעינה נכשלה",
        "create_failed": "יצירה נכשלה",
        "update_failed": "עדכון נכשל",
        "delete_failed": "מחיקה נכשלה",
        "export_failed": "ייצוא נכשל",
        "note_failed": "הוספת הערה נכשלה",
        "status_failed": "עדכון סטטוס נכשל"
    }
}

opportunities_translations = {
    "en": {
        "title": "Opportunity",
        "created": "Created from lead"
    },
    "fr": {
        "title": "Opportunité",
        "created": "Créée depuis prospect"
    },
    "he": {
        "title": "הזדמנות",
        "created": "נוצרה מליד"
    }
}

def update_locale_nav(lang):
    filepath = rf'C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\locales\{lang}.json'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure structure
    if 'admin' not in data:
        data['admin'] = {}
    if 'crm' not in data['admin']:
        data['admin']['crm'] = {}
    
    # Add nav translations
    data['admin']['crm']['nav'] = nav_translations[lang]
    
    # Add tabs translations
    data['admin']['crm']['tabs'] = tabs_translations[lang]
    
    # Add errors
    data['admin']['crm']['errors'] = errors_translations[lang]
    
    # Add opportunities  
    data['admin']['crm']['opportunities'] = opportunities_translations[lang]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang}.json with nav/tabs/errors")

for lang in ['en', 'fr', 'he']:
    update_locale_nav(lang)

print("\n✅ All done!")
