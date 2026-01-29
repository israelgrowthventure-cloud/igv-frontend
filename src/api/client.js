/**
 * API Client — Unified Axios Instance for IGV CRM
 * ================================================
 * 
 * Single source of truth for all API calls.
 * Features:
 * - Unique axios instance with consistent baseURL
 * - Automatic Authorization header injection
 * - 401 handling with proper logout
 * - Configurable timeouts (longer for AI endpoints)
 * - Retry logic for transient failures
 * - Structured error logging
 * 
 * Created: 26 Janvier 2026
 */

import axios from 'axios';
import { LEGACY_ALIASES } from './routes';

// ============================================================
// CONFIGURATION
// ============================================================

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

if (!BACKEND_URL) {
  console.error('❌ CRITICAL: REACT_APP_BACKEND_URL or REACT_APP_API_URL must be set');
  throw new Error('Missing REACT_APP_BACKEND_URL or REACT_APP_API_URL environment variable');
}

const IS_DEV = process.env.NODE_ENV === 'development';

// Legacy route detection (warn in dev mode)
const LEGACY_ROUTE_PATTERNS = Object.keys(LEGACY_ALIASES);

function checkLegacyRoute(url) {
  if (!IS_DEV) return;
  
  const matchedLegacy = LEGACY_ROUTE_PATTERNS.find(legacy => url.startsWith(legacy));
  if (matchedLegacy) {
    console.warn(
      `[API AUDIT] ⚠️ Legacy route detected: ${url}\n` +
      `  → Use canonical: ${LEGACY_ALIASES[matchedLegacy]}\n` +
      `  → Import { ROUTES } from '@/api' and use ROUTES.* instead`
    );
  }
}

// Timeout configuration (milliseconds)
const TIMEOUTS = {
  DEFAULT: 8000,      // 8 seconds for standard requests
  CRM: 10000,         // 10 seconds for CRM operations
  AI: 60000,          // 60 seconds for AI/Gemini operations
  UPLOAD: 30000,      // 30 seconds for file uploads
  PDF: 30000,         // 30 seconds for PDF generation
};

// ============================================================
// AXIOS INSTANCE
// ============================================================

const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: TIMEOUTS.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

apiClient.interceptors.request.use(
  (config) => {
    // AUDIT: Check for legacy routes in dev mode
    checkLegacyRoute(config.url || '');
    
    // Add Authorization header if token exists
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Set appropriate timeout based on endpoint
    const url = config.url || '';
    if (url.includes('/mini-analysis') || url.includes('/ai/')) {
      config.timeout = TIMEOUTS.AI;
    } else if (url.includes('/pdf/') || url.includes('/generate')) {
      config.timeout = TIMEOUTS.PDF;
    } else if (url.includes('/upload') || url.includes('/media')) {
      config.timeout = TIMEOUTS.UPLOAD;
    } else if (url.includes('/crm/')) {
      config.timeout = TIMEOUTS.CRM;
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error.message);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

// Track if we're already handling a logout to prevent loops
const LOGOUT_KEY = 'isLoggingOut';

apiClient.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (!sessionStorage.getItem(LOGOUT_KEY)) {
        sessionStorage.setItem(LOGOUT_KEY, 'true');
        
        console.warn('[API] 401 Unauthorized - Token expired or invalid');
        
        // Clear token and redirect to login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        // Only redirect if we're in a browser context and not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
        
        // Reset flag after a short delay
        setTimeout(() => {
          sessionStorage.removeItem(LOGOUT_KEY);
        }, 2000);
      }
      
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('[API] Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle other errors with structured logging
    const status = error.response?.status;
    const detail = error.response?.data?.detail || error.response?.data?.message || error.message;
    
    console.error(`[API] Error ${status}:`, detail);
    
    // Retry logic for 5xx errors (server errors)
    if (status >= 500 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      if (originalRequest._retryCount <= 2) {
        console.info(`[API] Retrying request (attempt ${originalRequest._retryCount})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
        return apiClient(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================
// HELPER METHODS
// ============================================================

/**
 * GET request helper
 */
export const get = async (endpoint, config = {}) => {
  const response = await apiClient.get(endpoint, config);
  return response.data;
};

/**
 * POST request helper
 */
export const post = async (endpoint, data = {}, config = {}) => {
  const response = await apiClient.post(endpoint, data, config);
  return response.data;
};

/**
 * PUT request helper
 */
export const put = async (endpoint, data = {}, config = {}) => {
  const response = await apiClient.put(endpoint, data, config);
  return response.data;
};

/**
 * PATCH request helper
 */
export const patch = async (endpoint, data = {}, config = {}) => {
  const response = await apiClient.patch(endpoint, data, config);
  return response.data;
};

/**
 * DELETE request helper
 */
export const del = async (endpoint, config = {}) => {
  const response = await apiClient.delete(endpoint, config);
  return response.data;
};

// ============================================================
// EXPORTS
// ============================================================

export { apiClient, BACKEND_URL, TIMEOUTS };

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  client: apiClient,
  baseURL: BACKEND_URL,
};
