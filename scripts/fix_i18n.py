#!/usr/bin/env python3
"""Update i18n config and Login page with proper translations"""

# Update i18n config
i18n_config = '''import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';
import he from './locales/he.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      he: { translation: he }
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'he'],
    detection: {
      // Order: URL param first, then localStorage, then browser
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

// Update HTML lang and dir attributes on language change
i18n.on('languageChanged', (lng) => {
  const html = document.documentElement;
  html.setAttribute('lang', lng);
  html.setAttribute('dir', lng === 'he' ? 'rtl' : 'ltr');
  // Also store in localStorage so it persists
  localStorage.setItem('i18nextLng', lng);
});

// Set initial lang and dir
const currentLang = i18n.language || 'fr';
document.documentElement.setAttribute('lang', currentLang);
document.documentElement.setAttribute('dir', currentLang === 'he' ? 'rtl' : 'ltr');

export default i18n;
'''

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\i18n\config.js', 'w', encoding='utf-8') as f:
    f.write(i18n_config)

print("✅ i18n config updated with querystring detection")

# Update Login page with i18n
login_page = '''import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('admin.login.errors.required'));
      return;
    }

    setLoading(true);

    try {
      const data = await api.adminLogin({ email, password });

      if (data.access_token) {
        login(
          data.access_token,
          data.email || email,
          data.name || email.split('@')[0],
          data.role || 'admin'
        );

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_role', data.role || 'admin');

        toast.success(t('admin.login.success'));
        navigate('/admin/crm/dashboard');
      } else {
        setError(t('admin.login.errors.invalid'));
        toast.error(t('admin.login.errors.invalid'));
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response && error.response.status === 401) {
        setError(t('admin.login.errors.wrong_credentials'));
        toast.error(t('admin.login.errors.invalid'));
      } else {
        setError(t('admin.login.errors.server'));
        toast.error(t('admin.login.errors.server'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('admin.login.page_title')} | IGV</title>
      </Helmet>

      <div className={`min-h-screen bg-gray-50 flex items-center justify-center px-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-600/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('admin.login.title')}
            </h1>
            <p className="text-sm text-gray-600">
              Israel Growth Venture CRM
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.login.email')}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="postmaster@israelgrowthventure.com"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.login.password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('admin.login.logging_in')}
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    {t('admin.login.submit')}
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                🔒 {t('admin.login.security_notice')}
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            © 2025 Israel Growth Venture. {t('admin.login.rights_reserved')}
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
'''

with open(r'C:\Users\PC\Desktop\IGV\igv-frontend\src\pages\admin\Login.js', 'w', encoding='utf-8') as f:
    f.write(login_page)

print("✅ Login page updated with i18n")
print("Done!")
