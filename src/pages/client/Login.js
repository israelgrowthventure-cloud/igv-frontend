import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, UserPlus } from 'lucide-react';

const ClientLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company: '',
    phone: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
      if (!BACKEND_URL) {
        throw new Error('Backend URL not configured');
      }

      const endpoint = isLogin ? '/api/client/login' : '/api/client/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Store token
      localStorage.setItem('client_token', data.access_token);
      localStorage.setItem('client_data', JSON.stringify(data.client));

      toast.success(isLogin ? t('client.login.success') : t('client.register.success'));
      navigate('/client/dashboard');
    } catch (error) {
      toast.error(error.message || t('client.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            {isLogin ? <LogIn className="h-6 w-6 text-blue-600" /> : <UserPlus className="h-6 w-6 text-blue-600" />}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? t('client.login.title', 'Client Login') : t('client.register.title', 'Create Account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? t('client.login.subtitle', 'Access your analyses and invoices') : t('client.register.subtitle', 'Join IGV to access your analyses')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="sr-only">
                      {t('client.register.firstName', 'First Name')}
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required={!isLogin}
                      value={formData.first_name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder={t('client.register.firstName', 'First Name')}
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="sr-only">
                      {t('client.register.lastName', 'Last Name')}
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required={!isLogin}
                      value={formData.last_name}
                      onChange={handleChange}
                      className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder={t('client.register.lastName', 'Last Name')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="sr-only">
                    {t('client.register.company', 'Company')}
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder={t('client.register.company', 'Company (optional)')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="sr-only">
                    {t('client.register.phone', 'Phone')}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder={t('client.register.phone', 'Phone (optional)')}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                {t('client.login.email', 'Email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('client.login.email', 'Email address')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t('client.login.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('client.login.password', 'Password')}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>{t('common.loading', 'Loading...')}</span>
              ) : (
                <span>{isLogin ? t('client.login.submit', 'Sign in') : t('client.register.submit', 'Create account')}</span>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin 
                ? t('client.login.switchToRegister', "Don't have an account? Sign up") 
                : t('client.register.switchToLogin', 'Already have an account? Sign in')
              }
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t('common.backToHome', 'Back to home')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientLogin;
