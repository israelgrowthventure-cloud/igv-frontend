/**
 * API Routes — Centralized Endpoint Definitions for IGV CRM
 * ==========================================================
 * 
 * Single source of truth for all API endpoints.
 * This file maps logical names to actual API paths.
 * 
 * Usage:
 *   import { ROUTES, apiPath } from '@/api/routes';
 *   
 *   // Direct access
 *   const url = ROUTES.crm.leads.list;
 *   
 *   // With helper
 *   const url = apiPath('crm.leads.list');
 * 
 * Created: 26 Janvier 2026
 */

// ============================================================
// ROUTE DEFINITIONS
// ============================================================

export const ROUTES = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  auth: {
    login: '/api/admin/login',
    logout: '/api/admin/logout',
    verify: '/api/admin/verify',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyResetToken: '/api/auth/verify-reset-token',
  },
  
  // ==========================================
  // ADMIN
  // ==========================================
  admin: {
    stats: '/api/admin/stats',
    statsVisits: '/api/admin/stats/visits',
    statsLeads: '/api/admin/stats/leads',
    pendingStats: '/api/admin/pending-stats',
    processPending: '/api/admin/process-pending',
    users: '/api/admin/users',
    settings: '/api/admin/settings',
    media: '/api/admin/media',
    mediaUpload: '/api/admin/media/upload',
  },
  
  // ==========================================
  // CRM - DASHBOARD
  // ==========================================
  crm: {
    debug: '/api/crm/debug',
    
    dashboard: {
      stats: '/api/crm/dashboard/stats',
    },
    
    // ==========================================
    // CRM - LEADS
    // ==========================================
    leads: {
      list: '/api/crm/leads',
      create: '/api/crm/leads',
      detail: (id) => `/api/crm/leads/${id}`,
      update: (id) => `/api/crm/leads/${id}`,
      delete: (id) => `/api/crm/leads/${id}`,
      notes: (id) => `/api/crm/leads/${id}/notes`,
      activities: (id) => `/api/crm/leads/${id}/activities`,
      emails: (id) => `/api/crm/leads/${id}/emails`,
      sendEmail: (id) => `/api/crm/leads/${id}/emails/send`,
      convert: (id) => `/api/crm/leads/${id}/convert-to-contact`,
      assign: (id) => `/api/crm/leads/${id}/assign`,
      nextAction: (id) => `/api/crm/leads/${id}/next-action`,
      missingNextAction: '/api/crm/leads/missing-next-action',
      overdueActions: '/api/crm/leads/overdue-actions',
      export: '/api/crm/leads/export/csv',
    },
    
    // ==========================================
    // CRM - CONTACTS
    // ==========================================
    contacts: {
      list: '/api/crm/contacts',
      create: '/api/crm/contacts',
      detail: (id) => `/api/crm/contacts/${id}`,
      update: (id) => `/api/crm/contacts/${id}`,
      delete: (id) => `/api/crm/contacts/${id}`,
      notes: (id) => `/api/crm/contacts/${id}/notes`,
      activities: (id) => `/api/crm/contacts/${id}/activities`,
      emails: (id) => `/api/crm/contacts/${id}/emails`,
    },
    
    // ==========================================
    // CRM - COMPANIES
    // ==========================================
    companies: {
      list: '/api/crm/companies',
      create: '/api/crm/companies',
      detail: (id) => `/api/crm/companies/${id}`,
      update: (id) => `/api/crm/companies/${id}`,
      delete: (id) => `/api/crm/companies/${id}`,
      notes: (id) => `/api/crm/companies/${id}/notes`,
      linkLead: (companyId, leadId) => `/api/crm/companies/${companyId}/link-lead/${leadId}`,
      linkContact: (companyId, contactId) => `/api/crm/companies/${companyId}/link-contact/${contactId}`,
    },
    
    // ==========================================
    // CRM - OPPORTUNITIES
    // ==========================================
    opportunities: {
      list: '/api/crm/opportunities',
      create: '/api/crm/opportunities',
      detail: (id) => `/api/crm/opportunities/${id}`,
      update: (id) => `/api/crm/opportunities/${id}`,
      delete: (id) => `/api/crm/opportunities/${id}`,
      notes: (id) => `/api/crm/opportunities/${id}/notes`,
      activities: (id) => `/api/crm/opportunities/${id}/activities`,
    },
    
    // ==========================================
    // CRM - PIPELINE
    // ==========================================
    pipeline: {
      view: '/api/crm/pipeline',
    },
    
    // ==========================================
    // CRM - TASKS
    // ==========================================
    tasks: {
      list: '/api/crm/tasks',
      create: '/api/crm/tasks',
      detail: (id) => `/api/crm/tasks/${id}`,
      update: (id) => `/api/crm/tasks/${id}`,
      delete: (id) => `/api/crm/tasks/${id}`,
      export: '/api/crm/tasks/export/csv',
    },
    
    // ==========================================
    // CRM - ACTIVITIES
    // ==========================================
    activities: {
      list: '/api/crm/activities',
      detail: (id) => `/api/crm/activities/${id}`,
      create: '/api/crm/activities',
      update: (id) => `/api/crm/activities/${id}`,
      delete: (id) => `/api/crm/activities/${id}`,
    },
    
    // ==========================================
    // CRM - EMAILS
    // ==========================================
    emails: {
      send: '/api/crm/emails/send',
      history: '/api/crm/emails/history',
      templates: '/api/crm/emails/templates',
      createTemplate: '/api/crm/emails/templates',
      deleteTemplate: (id) => `/api/crm/emails/templates/${id}`,
      templatesCount: '/api/crm/emails/templates/count',
      templatesSeed: '/api/crm/emails/templates/seed',
      drafts: '/api/crm/emails/drafts',
      createDraft: '/api/crm/emails/drafts',
      updateDraft: (id) => `/api/crm/emails/drafts/${id}`,
      deleteDraft: (id) => `/api/crm/emails/drafts/${id}`,
      stats: (id) => `/api/crm/emails/${id}/stats`,
    },
    
    // ==========================================
    // CRM - MINI-ANALYSES
    // ==========================================
    miniAnalyses: {
      list: '/api/crm/mini-analyses',
      stats: '/api/crm/mini-analyses/stats',
      detail: (id) => `/api/crm/mini-analyses/${id}`,
      updateStatus: (id) => `/api/crm/mini-analyses/${id}/status`,
      assign: (id) => `/api/crm/mini-analyses/${id}/assign`,
      convert: (id) => `/api/crm/mini-analyses/${id}/convert`,
    },
    
    // ==========================================
    // CRM - QUALITY / DUPLICATES
    // ==========================================
    quality: {
      stats: '/api/crm/quality/stats',
      duplicatesLeads: '/api/crm/quality/duplicates/leads',
      duplicatesContacts: '/api/crm/quality/duplicates/contacts',
      mergeLeads: '/api/crm/quality/merge/leads',
      mergeContacts: '/api/crm/quality/merge/contacts',
    },
    
    // ==========================================
    // CRM - AUTOMATION / RULES
    // ==========================================
    automation: {
      rules: '/api/crm/rules',
      createRule: '/api/crm/rules',
      updateRule: (id) => `/api/crm/rules/${id}`,
      deleteRule: (id) => `/api/crm/rules/${id}`,
      execute: '/api/crm/rules/execute',
    },
    
    // ==========================================
    // CRM - KPI
    // ==========================================
    kpi: {
      responseTimes: '/api/crm/kpi/response-times',
      conversionTimes: '/api/crm/kpi/conversion-times',
      sourcePerformance: '/api/crm/kpi/source-performance',
      funnel: '/api/crm/kpi/funnel',
    },
    
    // ==========================================
    // CRM - SEARCH
    // ==========================================
    search: {
      global: '/api/crm/search',
      quick: '/api/crm/search/quick',
    },
    
    // ==========================================
    // CRM - RBAC (routes canoniques)
    // ==========================================
    rbac: {
      roles: '/api/crm/rbac/roles',
      permissions: '/api/crm/rbac/permissions',
      updateUserRole: (userId) => `/api/crm/users/${userId}/role`,
      setCustomPermissions: (userId) => `/api/crm/users/${userId}/permissions`,
    },
    
    // ==========================================
    // CRM - TEAM (routes canoniques vers admin/users)
    // ==========================================
    team: {
      list: '/api/admin/users',
      assign: '/api/admin/users/assign',
    },
    
    // ==========================================
    // CRM - AUDIT LOGS
    // ==========================================
    audit: {
      logs: '/api/crm/audit-logs',
      stats: '/api/crm/audit-logs/stats',
      entity: (type, id) => `/api/crm/audit-logs/entity/${type}/${id}`,
      user: (email) => `/api/crm/audit-logs/user/${email}`,
    },
    
    // ==========================================
    // CRM - EXPORTS
    // ==========================================
    export: {
      leads: '/api/crm/export/leads',
      contacts: '/api/crm/export/contacts',
      companies: '/api/crm/export/companies',
      opportunities: '/api/crm/export/opportunities',
      activities: '/api/crm/export/activities',
      all: '/api/crm/export/all',
    },
    
    // ==========================================
    // CRM - SETTINGS
    // ==========================================
    settings: {
      general: '/api/crm/settings',
      users: '/api/admin/users',
      createUser: '/api/admin/users',
      updateUser: (id) => `/api/admin/users/${id}`,
      deleteUser: (id) => `/api/admin/users/${id}`,
      changePassword: (id) => `/api/admin/users/${id}/change-password`,
      assignUser: (id) => `/api/admin/users/${id}/assign`,
      tags: '/api/crm/settings/tags',
      createTag: '/api/crm/settings/tags',
      pipelineStages: '/api/crm/settings/pipeline-stages',
      dispatch: '/api/crm/settings/dispatch',
      quality: '/api/crm/settings/quality',
      performance: '/api/crm/settings/performance',
    },
  },
  
  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================
  public: {
    contact: '/api/contact',
    contactExpert: '/api/contact-expert',
    miniAnalysis: '/api/mini-analysis',
    detectLocation: '/api/detect-location',
    cart: '/api/cart',
    health: '/api/health',
  },
  
  // ==========================================
  // GDPR
  // ==========================================
  gdpr: {
    consent: '/api/gdpr/consent',
    myData: '/api/gdpr/my-data',
    deleteAllData: '/api/gdpr/delete-all-data',
    newsletterSubscribe: '/api/gdpr/newsletter/subscribe',
    newsletterUnsubscribe: '/api/gdpr/newsletter/unsubscribe',
    trackVisit: '/api/gdpr/track/visit',
  },
  
  // ==========================================
  // INVOICES
  // ==========================================
  invoices: {
    list: '/api/invoices/',
    create: '/api/invoices/',
    detail: (id) => `/api/invoices/${id}`,
    update: (id) => `/api/invoices/${id}`,
    delete: (id) => `/api/invoices/${id}`,
    generatePdf: (id) => `/api/invoices/${id}/generate-pdf`,
    send: (id) => `/api/invoices/${id}/send`,
    stats: '/api/invoices/stats/overview',
  },
  
  // ==========================================
  // MONETICO / PAYMENTS
  // ==========================================
  monetico: {
    config: '/api/monetico/config',
    initPayment: '/api/monetico/init-payment',
    payments: '/api/monetico/payments',
    paymentDetail: (id) => `/api/monetico/payment/${id}`,
  },
  
  // ==========================================
  // CMS / PAGES
  // ==========================================
  cms: {
    content: '/api/cms/content',
    syncI18n: '/api/cms/sync-i18n',
    pagesList: '/api/pages/list',
    page: (page) => `/api/pages/${page}`,
    updatePage: '/api/pages/update',
    pageHistory: (page) => `/api/pages/${page}/history`,
  },
  
  // ==========================================
  // PDF
  // ==========================================
  pdf: {
    generate: '/api/pdf/generate',
    emailPdf: '/api/email/send-pdf',
  },
  
  // ==========================================
  // CALENDAR
  // ==========================================
  calendar: {
    createEvent: '/api/calendar/create-event',
  },
};

// ============================================================
// HELPER FUNCTION
// ============================================================

/**
 * Get API path from dot notation
 * 
 * @param {string} path - Dot notation path (e.g., 'crm.leads.list')
 * @param {...any} args - Arguments for dynamic paths
 * @returns {string} - The API endpoint path
 * 
 * @example
 * apiPath('crm.leads.list') // '/api/crm/leads'
 * apiPath('crm.leads.detail', '123') // '/api/crm/leads/123'
 */
export const apiPath = (path, ...args) => {
  const parts = path.split('.');
  let current = ROUTES;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`[API Routes] Unknown path: ${path}`);
      return path;
    }
    current = current[part];
  }
  
  // If it's a function, call it with args
  if (typeof current === 'function') {
    return current(...args);
  }
  
  return current;
};

// ============================================================
// LEGACY ALIASES (for backward compatibility)
// ============================================================

export const LEGACY_ALIASES = {
  // These aliases are now handled by the backend API bridge
  // Listed here for documentation purposes
  '/api/login': '/api/admin/login',
  '/api/auth/login': '/api/admin/login',
  '/api/stats': '/api/admin/stats',
  '/api/crm/stats': '/api/crm/dashboard/stats',
  '/api/crm/automation': '/api/crm/rules',
  '/api/crm/audit': '/api/crm/audit-logs',
  '/api/crm/duplicates/leads': '/api/crm/quality/duplicates/leads',
  '/api/crm/duplicates/contacts': '/api/crm/quality/duplicates/contacts',
};

export default ROUTES;
