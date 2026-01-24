import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Building2, Users, Globe, Phone, Mail, MapPin, Calendar, 
  Edit, Save, X, Loader2, Plus, Trash2, Link, DollarSign, Briefcase,
  StickyNote, Activity, FileText, User, Target
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CompanyDetail - Page de détail d'une entreprise
 * Affiche les informations, contacts liés, leads liés, opportunités
 */
const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({});

  // Linked entities
  const [linkedContacts, setLinkedContacts] = useState([]);
  const [linkedLeads, setLinkedLeads] = useState([]);
  const [linkedOpportunities, setLinkedOpportunities] = useState([]);
  
  // Notes
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Available contacts/leads for linking
  const [availableContacts, setAvailableContacts] = useState([]);
  const [availableLeads, setAvailableLeads] = useState([]);
  const [showLinkContactModal, setShowLinkContactModal] = useState(false);
  const [showLinkLeadModal, setShowLinkLeadModal] = useState(false);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/crm/companies/${id}`);
      const companyData = response.company || response;
      setCompany(companyData);
      setFormData({
        name: companyData.name || '',
        domain: companyData.domain || '',
        industry: companyData.industry || '',
        size: companyData.size || '',
        phone: companyData.phone || '',
        email: companyData.email || '',
        website: companyData.website || '',
        address: companyData.address || '',
        city: companyData.city || '',
        country: companyData.country || '',
        description: companyData.description || '',
        annual_revenue: companyData.annual_revenue || '',
        employee_count: companyData.employee_count || '',
        linkedin_url: companyData.linkedin_url || ''
      });
      
      // Set linked entities from response
      setLinkedContacts(companyData.linked_contacts || []);
      setLinkedLeads(companyData.linked_leads || []);
      setLinkedOpportunities(companyData.linked_opportunities || []);
      
    } catch (error) {
      console.error('Error fetching company:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  const fetchNotes = useCallback(async () => {
    try {
      setLoadingNotes(true);
      const response = await api.get(`/api/crm/companies/${id}/notes`);
      setNotes(response.notes || response || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    } finally {
      setLoadingNotes(false);
    }
  }, [id]);

  const fetchAvailableEntities = useCallback(async () => {
    try {
      const [contactsRes, leadsRes] = await Promise.all([
        api.get('/api/crm/contacts', { params: { limit: 200 } }),
        api.get('/api/crm/leads', { params: { limit: 200 } })
      ]);
      setAvailableContacts(contactsRes.contacts || []);
      setAvailableLeads(leadsRes.leads || []);
    } catch (error) {
      console.error('Error fetching available entities:', error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchNotes();
      fetchAvailableEntities();
    }
  }, [id, fetchCompany, fetchNotes, fetchAvailableEntities]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/crm/companies/${id}`, formData);
      toast.success(t('crm.companies.updated', 'Entreprise mise à jour'));
      setEditing(false);
      await fetchCompany();
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(t('crm.errors.save_failed', 'Erreur de sauvegarde'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error(t('crm.errors.admin_only', 'Action réservée aux administrateurs'));
      return;
    }
    if (!window.confirm(t('crm.companies.confirm_delete', 'Êtes-vous sûr de vouloir supprimer cette entreprise ?'))) {
      return;
    }
    try {
      await api.delete(`/api/crm/companies/${id}`);
      toast.success(t('crm.companies.deleted', 'Entreprise supprimée'));
      navigate('/admin/crm/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(t('crm.errors.delete_failed', 'Erreur de suppression'));
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await api.post(`/api/crm/companies/${id}/notes`, { content: newNote.trim() });
      toast.success(t('crm.notes.added', 'Note ajoutée'));
      setNewNote('');
      await fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error(t('crm.errors.note_failed', 'Erreur lors de l\'ajout de la note'));
    }
  };

  const handleLinkContact = async (contactId) => {
    try {
      await api.post(`/api/crm/companies/${id}/link-contact/${contactId}`);
      toast.success(t('crm.companies.contact_linked', 'Contact lié'));
      setShowLinkContactModal(false);
      await fetchCompany();
    } catch (error) {
      console.error('Error linking contact:', error);
      toast.error(error.message || t('crm.errors.link_failed', 'Erreur de liaison'));
    }
  };

  const handleLinkLead = async (leadId) => {
    try {
      await api.post(`/api/crm/companies/${id}/link-lead/${leadId}`);
      toast.success(t('crm.companies.lead_linked', 'Lead lié'));
      setShowLinkLeadModal(false);
      await fetchCompany();
    } catch (error) {
      console.error('Error linking lead:', error);
      toast.error(error.message || t('crm.errors.link_failed', 'Erreur de liaison'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('crm.errors.company_not_found', 'Entreprise introuvable')}</p>
        <button 
          onClick={() => navigate('/admin/crm/companies')}
          className="mt-4 text-blue-600 hover:underline"
        >
          {t('common.back', 'Retour')}
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'info', label: t('crm.tabs.info', 'Informations'), icon: Building2 },
    { id: 'contacts', label: t('crm.tabs.contacts', 'Contacts'), icon: Users, count: linkedContacts.length },
    { id: 'leads', label: t('crm.tabs.leads', 'Leads'), icon: Target, count: linkedLeads.length },
    { id: 'opportunities', label: t('crm.tabs.opportunities', 'Opportunités'), icon: DollarSign, count: linkedOpportunities.length },
    { id: 'notes', label: t('crm.tabs.notes', 'Notes'), icon: StickyNote, count: notes.length }
  ];

  // Contacts/Leads not yet linked to this company
  const unlinkkedContacts = availableContacts.filter(c => 
    !linkedContacts.find(lc => lc._id === c._id || lc.contact_id === c.contact_id)
  );
  const unlinkedLeads = availableLeads.filter(l => 
    !linkedLeads.find(ll => ll._id === l._id || ll.lead_id === l.lead_id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/crm/companies')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-blue-600" />
              {company.name}
            </h1>
            {company.industry && (
              <p className="text-sm text-gray-500 mt-1">{company.industry}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : <Save className="w-4 h-4 inline mr-1" />}
                {t('common.save', 'Sauvegarder')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 inline mr-1" />
                {t('common.edit', 'Modifier')}
              </button>
              {isAdmin && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  {t('common.delete', 'Supprimer')}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">{t('crm.companies.general_info', 'Informations générales')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.name', 'Nom de l\'entreprise')}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.name || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.domain', 'Domaine')}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.domain || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.industry', 'Secteur d\'activité')}
                </label>
                {editing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('common.select', 'Sélectionner...')}</option>
                    <option value="retail">Retail / Commerce</option>
                    <option value="food_beverage">Food & Beverage</option>
                    <option value="hospitality">Hôtellerie</option>
                    <option value="real_estate">Immobilier</option>
                    <option value="technology">Technologie</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Santé</option>
                    <option value="manufacturing">Industrie</option>
                    <option value="services">Services</option>
                    <option value="other">Autre</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{company.industry || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.size', 'Taille')}
                </label>
                {editing ? (
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('common.select', 'Sélectionner...')}</option>
                    <option value="1-10">1-10 {t('crm.companies.employees', 'employés')}</option>
                    <option value="11-50">11-50 {t('crm.companies.employees', 'employés')}</option>
                    <option value="51-200">51-200 {t('crm.companies.employees', 'employés')}</option>
                    <option value="201-500">201-500 {t('crm.companies.employees', 'employés')}</option>
                    <option value="501-1000">501-1000 {t('crm.companies.employees', 'employés')}</option>
                    <option value="1000+">1000+ {t('crm.companies.employees', 'employés')}</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{company.size || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.annual_revenue', 'Chiffre d\'affaires annuel')}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.annual_revenue}
                    onChange={(e) => setFormData({ ...formData, annual_revenue: e.target.value })}
                    placeholder="1M€"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.annual_revenue || '-'}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">{t('crm.companies.contact_info', 'Coordonnées')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {t('crm.companies.phone', 'Téléphone')}
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.phone || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t('crm.companies.email', 'Email')}
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.email || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  {t('crm.companies.website', 'Site web')}
                </label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : (
                    <p className="text-gray-900">-</p>
                  )
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('crm.companies.address', 'Adresse')}
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{company.address || '-'}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('crm.companies.city', 'Ville')}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{company.city || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('crm.companies.country', 'Pays')}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{company.country || '-'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.companies.description', 'Description')}
                </label>
                {editing ? (
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 whitespace-pre-wrap">{company.description || '-'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{t('crm.companies.linked_contacts', 'Contacts liés')}</h3>
              <button
                onClick={() => setShowLinkContactModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                {t('crm.companies.link_contact', 'Lier un contact')}
              </button>
            </div>
            
            {linkedContacts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('crm.companies.no_contacts', 'Aucun contact lié')}</p>
            ) : (
              <div className="space-y-2">
                {linkedContacts.map((contact) => (
                  <div 
                    key={contact._id || contact.contact_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/admin/crm/contacts/${contact._id || contact.contact_id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email} {contact.position && `• ${contact.position}`}</p>
                      </div>
                    </div>
                    <Link className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">{t('crm.companies.linked_leads', 'Leads liés')}</h3>
              <button
                onClick={() => setShowLinkLeadModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                {t('crm.companies.link_lead', 'Lier un lead')}
              </button>
            </div>
            
            {linkedLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('crm.companies.no_leads', 'Aucun lead lié')}</p>
            ) : (
              <div className="space-y-2">
                {linkedLeads.map((lead) => (
                  <div 
                    key={lead._id || lead.lead_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/admin/crm/leads/${lead._id || lead.lead_id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name || lead.email}</p>
                        <p className="text-sm text-gray-500">{lead.status} • {lead.source || 'N/A'}</p>
                      </div>
                    </div>
                    <Link className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t('crm.companies.linked_opportunities', 'Opportunités liées')}</h3>
            
            {linkedOpportunities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('crm.companies.no_opportunities', 'Aucune opportunité liée')}</p>
            ) : (
              <div className="space-y-2">
                {linkedOpportunities.map((opp) => (
                  <div 
                    key={opp._id || opp.opportunity_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/admin/crm/opportunities/${opp._id || opp.opportunity_id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{opp.name}</p>
                        <p className="text-sm text-gray-500">{opp.stage} • {opp.value ? `${opp.value.toLocaleString()}€` : 'N/A'}</p>
                      </div>
                    </div>
                    <Link className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">{t('crm.companies.notes', 'Notes')}</h3>
            
            {/* Add Note */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={t('crm.notes.add_placeholder', 'Ajouter une note...')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Notes List */}
            {loadingNotes ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : notes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('crm.notes.empty', 'Aucune note')}</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note._id || note.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {note.created_by} • {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Link Contact Modal */}
      {showLinkContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('crm.companies.select_contact', 'Sélectionner un contact')}</h3>
              <button onClick={() => setShowLinkContactModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            {unlinkkedContacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('crm.companies.all_contacts_linked', 'Tous les contacts sont déjà liés')}</p>
            ) : (
              <div className="space-y-2">
                {unlinkkedContacts.map((contact) => (
                  <button
                    key={contact._id || contact.contact_id}
                    onClick={() => handleLinkContact(contact._id || contact.contact_id)}
                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Link Lead Modal */}
      {showLinkLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('crm.companies.select_lead', 'Sélectionner un lead')}</h3>
              <button onClick={() => setShowLinkLeadModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            {unlinkedLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-4">{t('crm.companies.all_leads_linked', 'Tous les leads sont déjà liés')}</p>
            ) : (
              <div className="space-y-2">
                {unlinkedLeads.map((lead) => (
                  <button
                    key={lead._id || lead.lead_id}
                    onClick={() => handleLinkLead(lead._id || lead.lead_id)}
                    className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name || lead.email}</p>
                      <p className="text-sm text-gray-500">{lead.status} • {lead.source || 'N/A'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail;
