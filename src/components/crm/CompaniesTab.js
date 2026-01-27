import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Building2, Globe, Phone, Mail, MapPin, Plus, Edit, Trash2, 
  X, Loader2, Users, DollarSign, ExternalLink, Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { SkeletonTable } from './Skeleton';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CompaniesTab - Composant de liste des entreprises
 * Affiche la liste, permet la recherche, création, modification, suppression
 */
const CompaniesTab = ({ 
  data, 
  loading, 
  selectedItem, 
  setSelectedItem, 
  onRefresh, 
  searchTerm, 
  setSearchTerm,
  filters,
  setFilters,
  t 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [loadingAction, setLoadingAction] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    country: ''
  });

  // Helper function for translations with fallback
  const tt = (key, fallback) => {
    const translation = t(key);
    if (translation === key || !translation) {
      return fallback || key;
    }
    return translation;
  };

  // Filter companies by search term
  const filteredCompanies = useMemo(() => {
    if (!data?.companies) return [];
    if (!searchTerm?.trim()) return data.companies;
    
    const term = searchTerm.toLowerCase().trim();
    return data.companies.filter(company => 
      company.name?.toLowerCase().includes(term) ||
      company.domain?.toLowerCase().includes(term) ||
      company.industry?.toLowerCase().includes(term) ||
      company.city?.toLowerCase().includes(term)
    );
  }, [data?.companies, searchTerm]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(tt('crm.companies.name_required', 'Le nom de l\'entreprise est requis'));
      return;
    }

    try {
      setLoadingAction(true);
      await api.post('/api/crm/companies', formData);
      toast.success(tt('crm.companies.created', 'Entreprise créée avec succès'));
      setShowCreateModal(false);
      setFormData({
        name: '',
        domain: '',
        industry: '',
        size: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        country: ''
      });
      await onRefresh();
    } catch (error) {
      console.error('Error creating company:', error);
      if (error.response?.status === 409) {
        toast.error(tt('crm.companies.duplicate', 'Une entreprise avec ce nom ou domaine existe déjà'));
      } else {
        toast.error(tt('crm.errors.create_failed', 'Erreur lors de la création'));
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (companyId, e) => {
    e?.stopPropagation();
    if (!isAdmin) {
      toast.error(tt('crm.errors.admin_only', 'Action réservée aux administrateurs'));
      return;
    }
    if (!window.confirm(tt('crm.companies.confirm_delete', 'Êtes-vous sûr de vouloir supprimer cette entreprise ?'))) {
      return;
    }
    try {
      setLoadingAction(true);
      await api.delete(`/api/crm/companies/${companyId}`);
      toast.success(tt('crm.companies.deleted', 'Entreprise supprimée'));
      await onRefresh();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(tt('crm.errors.delete_failed', 'Erreur de suppression'));
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRowClick = (company) => {
    navigate(`/admin/crm/companies/${company._id}`);
  };

  // Industry filter options
  const industries = [
    { value: '', label: tt('common.all', 'Tous') },
    { value: 'retail', label: 'Retail / Commerce' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'hospitality', label: 'Hôtellerie' },
    { value: 'real_estate', label: 'Immobilier' },
    { value: 'technology', label: 'Technologie' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Santé' },
    { value: 'manufacturing', label: 'Industrie' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Autre' }
  ];

  if (loading) {
    return <SkeletonTable rows={5} />;
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={tt('crm.companies.search_placeholder', 'Rechercher une entreprise...')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={filters?.industry || ''}
          onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {industries.map((ind) => (
            <option key={ind.value} value={ind.value}>{ind.label}</option>
          ))}
        </select>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          {tt('crm.companies.add', 'Ajouter')}
        </button>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{tt('crm.companies.empty', 'Aucune entreprise trouvée')}</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 text-blue-600 hover:underline"
          >
            {tt('crm.companies.create_first', 'Créer la première entreprise')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company._id}
              onClick={() => handleRowClick(company)}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                    {company.industry && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 mt-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {company.industry}
                      </span>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(company._id, e)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title={tt('common.delete', 'Supprimer')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {company.domain && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{company.domain}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.city && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{company.city}{company.country ? `, ${company.country}` : ''}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  {company.contacts_count !== undefined && (
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {company.contacts_count} contacts
                    </span>
                  )}
                  {company.opportunities_count !== undefined && (
                    <span className="flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {company.opportunities_count} opps
                    </span>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <span>{filteredCompanies.length} {tt('crm.companies.companies', 'entreprise(s)')}</span>
        {data?.total > filteredCompanies.length && (
          <span>{tt('crm.common.showing', 'Affichage de')} {filteredCompanies.length} / {data.total}</span>
        )}
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {tt('crm.companies.create_title', 'Nouvelle entreprise')}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.name', 'Nom de l\'entreprise')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.domain', 'Domaine')}
                  </label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder={t('crm.companies.domainPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.industry', 'Secteur')}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {industries.map((ind) => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.size', 'Taille')}
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{tt('common.select', 'Sélectionner...')}</option>
                    <option value="1-10">1-10 employés</option>
                    <option value="11-50">11-50 employés</option>
                    <option value="51-200">51-200 employés</option>
                    <option value="201-500">201-500 employés</option>
                    <option value="501-1000">501-1000 employés</option>
                    <option value="1000+">1000+ employés</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.phone', 'Téléphone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.email', 'Email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.website', 'Site web')}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder={t('crm.companies.websitePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.address', 'Adresse')}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.city', 'Ville')}
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tt('crm.companies.country', 'Pays')}
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {tt('common.cancel', 'Annuler')}
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loadingAction && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {tt('common.create', 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesTab;
