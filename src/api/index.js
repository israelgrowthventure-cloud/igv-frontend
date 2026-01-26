/**
 * API Module - IGV CRM
 * =====================
 * 
 * Central export for all API-related functionality.
 * 
 * Usage:
 *   import api, { ROUTES, apiPath } from '@/api';
 *   
 *   // Using the client
 *   const data = await api.get(ROUTES.crm.leads.list);
 *   
 *   // Using path helper
 *   const data = await api.get(apiPath('crm.leads.detail', '123'));
 */

export { default, get, post, put, patch, del, apiClient, BACKEND_URL, TIMEOUTS } from './client';
export { ROUTES, apiPath, LEGACY_ALIASES } from './routes';
