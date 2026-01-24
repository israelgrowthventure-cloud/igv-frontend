import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CompaniesTab from '../../components/crm/CompaniesTab';
import api from '../../utils/api';
import { toast } from 'sonner';

/**
 * CompaniesPage - Page dédiée à la gestion des entreprises/sociétés (B2B)
 * Point 1 de la mission: Gestion Companies/Sociétés
 */
const CompaniesPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({ companies: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingSelectedId, setPendingSelectedId] = useState(null);

  // Check for ?selected= URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      setPendingSelectedId(selectedId);
      navigate('/admin/crm/companies', { replace: true });
    }
  }, [location.search, navigate]);

  // Reset selectedItem when navigating back to list via menu
  useEffect(() => {
    if (location.pathname === '/admin/crm/companies' && !location.search) {
      if (!pendingSelectedId) {
        setSelectedItem(null);
      }
    }
  }, [location.pathname, location.search, pendingSelectedId]);

  // Listen for custom event from Sidebar
  useEffect(() => {
    const handleResetView = () => {
      setSelectedItem(null);
    };
    
    window.addEventListener('resetCompanyView', handleResetView);
    window.addEventListener('popstate', handleResetView);
    
    return () => {
      window.removeEventListener('resetCompanyView', handleResetView);
      window.removeEventListener('popstate', handleResetView);
    };
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [searchTerm, filters]);

  // Auto-select company when data is loaded and we have a pendingSelectedId
  useEffect(() => {
    if (pendingSelectedId && data.companies.length > 0 && !loading) {
      const companyToSelect = data.companies.find(c => c._id === pendingSelectedId || c.id === pendingSelectedId);
      if (companyToSelect) {
        setSelectedItem(companyToSelect);
      } else {
        // Company not in current list, try to fetch it directly
        api.get(`/api/crm/companies/${pendingSelectedId}`)
          .then(response => {
            if (response?.company || response) {
              setSelectedItem(response.company || response);
            }
          })
          .catch(err => {
            console.error('Could not fetch selected company:', err);
            toast.error(t('crm.errors.company_not_found', 'Entreprise introuvable'));
          });
      }
      setPendingSelectedId(null);
    }
  }, [pendingSelectedId, data.companies, loading, t]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/crm/companies', {
        params: { search: searchTerm, ...filters, limit: 100 }
      });
      setData({
        companies: Array.isArray(response?.companies) ? response.companies : [],
        total: response?.total || 0
      });
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('crm.nav.companies', 'Entreprises')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('crm.companies.subtitle', 'Gérez vos entreprises et sociétés (B2B)')}
        </p>
      </div>

      <CompaniesTab 
        data={data}
        loading={loading}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onRefresh={loadCompanies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        t={t} 
      />
    </div>
  );
};

export default CompaniesPage;
