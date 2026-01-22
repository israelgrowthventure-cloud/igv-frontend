#!/usr/bin/env python3
"""Fix Sidebar navigation and add CRM translations at correct path"""

import json

# Fix Sidebar.js - remove French fallbacks and use correct keys
sidebar_content = '''import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Target,
  BarChart3,
  Activity,
  Mail,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';
import CmsAdminButton from '../CmsAdminButton';

/**
 * Sidebar - CRM Main Navigation
 * Design: HubSpot/Salesforce style
 * Full i18n - no hardcoded text
 */
const Sidebar = ({ collapsed, onToggle }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'he';

  const navigationItems = [
    { id: 'dashboard', path: '/admin/crm/dashboard', icon: LayoutDashboard, label: t('admin.crm.nav.dashboard') },
    { id: 'leads', path: '/admin/crm/leads', icon: Users, label: t('admin.crm.nav.leads') },
    { id: 'contacts', path: '/admin/crm/contacts', icon: UserCheck, label: t('admin.crm.nav.contacts') },
    { id: 'opportunities', path: '/admin/crm/opportunities', icon: Target, label: t('admin.crm.nav.opportunities') },
    { id: 'pipeline', path: '/admin/crm/pipeline', icon: BarChart3, label: t('admin.crm.nav.pipeline') },
    { id: 'activities', path: '/admin/crm/activities', icon: Activity, label: t('admin.crm.nav.activities') },
    { id: 'emails', path: '/admin/crm/emails', icon: Mail, label: t('admin.crm.nav.emails') },
    { id: 'users', path: '/admin/crm/users', icon: UserCog, label: t('admin.crm.nav.users'), adminOnly: true },
    { id: 'settings', path: '/admin/crm/settings', icon: Settings, label: t('admin.crm.nav.settings') }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div
      className={`bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Logo + Company Name */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!collapsed && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <img
              src="/igv-logo.png"
              alt="IGV Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-semibold text-sm">Israel Growth Venture</span>
          </div>
        )}
        {collapsed && (
          <img
            src="/igv-logo.png"
            alt="IGV"
            className="w-10 h-10 object-contain mx-auto"
          />
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.id}>
                <button
                  data-testid={`nav-${item.id}`}
                  data-nav-item={item.id}
                  onClick={() => {
                    if (location.pathname === item.path) {
                      window.dispatchEvent(new CustomEvent('resetLeadView'));
                      navigate(item.path, { replace: true });
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`
                    w-full flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    ${active
                      ? `bg-blue-600 text-white ${isRTL ? 'border-r-4 border-blue-400' : 'border-l-4 border-blue-400'}`
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.label : ''}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* CMS Admin Button */}
      <div className="px-2 pb-2">
        <CmsAdminButton collapsed={collapsed} />
      </div>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
          title={collapsed ? t('admin.crm.sidebar.expand') : t('admin.crm.sidebar.collapse')}
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              <span className="text-sm">{t('admin.crm.sidebar.collapse')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
'''

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\components\common\Sidebar.js', 'w', encoding='utf-8') as f:
    f.write(sidebar_content)

print("✅ Sidebar.js fixed with proper i18n keys and RTL support")

# Add sidebar translations
sidebar_translations = {
    "en": {
        "expand": "Expand",
        "collapse": "Collapse"
    },
    "fr": {
        "expand": "Développer",
        "collapse": "Réduire"
    },
    "he": {
        "expand": "הרחב",
        "collapse": "צמצם"
    }
}

# Also add nav translations at root level for legacy support
crm_nav_root = {
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

def update_locale_sidebar(lang):
    filepath = rf'C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\locales\{lang}.json'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Ensure structure
    if 'admin' not in data:
        data['admin'] = {}
    if 'crm' not in data['admin']:
        data['admin']['crm'] = {}
    
    # Add sidebar translations
    data['admin']['crm']['sidebar'] = sidebar_translations[lang]
    
    # Also add at root crm.nav for legacy compatibility
    if 'crm' not in data:
        data['crm'] = {}
    data['crm']['nav'] = crm_nav_root[lang]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {lang}.json with sidebar translations")

for lang in ['en', 'fr', 'he']:
    update_locale_sidebar(lang)

print("\n✅ All sidebar translations added!")
