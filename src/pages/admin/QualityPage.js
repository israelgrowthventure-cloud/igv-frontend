import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, AlertTriangle, CheckCircle, Users, UserCheck, Merge, 
  RefreshCw, ChevronDown, ChevronUp, Trash2, Eye, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * QualityPage - Gestion de la qualité des données
 * Point 2 de la mission - Détection et fusion des doublons
 */
const QualityPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('duplicates');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [leadDuplicates, setLeadDuplicates] = useState([]);
  const [contactDuplicates, setContactDuplicates] = useState([]);
  const [threshold, setThreshold] = useState(0.8);
  const [expandedPair, setExpandedPair] = useState(null);
  const [merging, setMerging] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, threshold]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadDupsRes, contactDupsRes] = await Promise.all([
        api.get('/api/crm/quality/stats'),
        api.get('/api/crm/quality/duplicates/leads', { params: { threshold } }),
        api.get('/api/crm/quality/duplicates/contacts', { params: { threshold } })
      ]);
      
      setStats(statsRes);
      setLeadDuplicates(leadDupsRes.duplicates || []);
      setContactDuplicates(contactDupsRes.duplicates || []);
    } catch (error) {
      console.error('Error loading quality data:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const handleMergeLeads = async (keepId, mergeId) => {
    if (!window.confirm(t('crm.quality.confirm_merge', 'Êtes-vous sûr de vouloir fusionner ces enregistrements ?'))) {
      return;
    }

    try {
      setMerging(true);
      await api.post('/api/crm/quality/merge/leads', {
        keep_id: keepId,
        merge_id: mergeId
      });
      toast.success(t('crm.quality.merged', 'Fusion réussie'));
      await loadData();
    } catch (error) {
      console.error('Error merging leads:', error);
      toast.error(t('crm.errors.merge_failed', 'Erreur de fusion'));
    } finally {
      setMerging(false);
    }
  };

  const handleMergeContacts = async (keepId, mergeId) => {
    if (!window.confirm(t('crm.quality.confirm_merge', 'Êtes-vous sûr de vouloir fusionner ces enregistrements ?'))) {
      return;
    }

    try {
      setMerging(true);
      await api.post('/api/crm/quality/merge/contacts', {
        keep_id: keepId,
        merge_id: mergeId
      });
      toast.success(t('crm.quality.merged', 'Fusion réussie'));
      await loadData();
    } catch (error) {
      console.error('Error merging contacts:', error);
      toast.error(t('crm.errors.merge_failed', 'Erreur de fusion'));
    } finally {
      setMerging(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">{t('crm.errors.admin_only', 'Accès réservé aux administrateurs')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'duplicates', label: t('crm.quality.duplicates', 'Doublons'), icon: Users },
    { id: 'stats', label: t('crm.quality.stats', 'Statistiques'), icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crm.quality.title', 'Qualité des données')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.quality.subtitle', 'Détectez et fusionnez les doublons')}
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh', 'Actualiser')}
        </button>
      </div>

      {/* Score Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('crm.quality.lead_completeness', 'Complétude Leads')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.leads?.completeness_score || 0}%</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stats.leads?.completeness_score >= 80 ? 'bg-green-100' : 
                stats.leads?.completeness_score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {stats.leads?.completeness_score >= 80 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.leads?.missing_email || 0} sans email, {stats.leads?.missing_phone || 0} sans téléphone
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('crm.quality.contact_completeness', 'Complétude Contacts')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contacts?.completeness_score || 0}%</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                stats.contacts?.completeness_score >= 80 ? 'bg-green-100' : 
                stats.contacts?.completeness_score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('crm.quality.duplicates_found', 'Doublons détectés')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leadDuplicates.length + contactDuplicates.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Merge className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {leadDuplicates.length} leads, {contactDuplicates.length} contacts
            </p>
          </div>
        </div>
      )}

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
              </button>
            );
          })}
        </nav>
      </div>

      {/* Duplicates Tab */}
      {activeTab === 'duplicates' && (
        <div className="space-y-6">
          {/* Threshold Control */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('crm.quality.threshold', 'Seuil de similarité')}: {Math.round(threshold * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('crm.quality.threshold_hint', 'Plus le seuil est élevé, moins de doublons seront détectés mais avec plus de certitude')}
            </p>
          </div>

          {/* Lead Duplicates */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                {t('crm.quality.lead_duplicates', 'Doublons Leads')} ({leadDuplicates.length})
              </h3>
            </div>
            
            {leadDuplicates.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                {t('crm.quality.no_duplicates', 'Aucun doublon détecté')}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {leadDuplicates.map((pair, index) => (
                  <div key={index} className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPair(expandedPair === `lead-${index}` ? null : `lead-${index}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          pair.confidence >= 0.9 ? 'bg-red-100 text-red-800' :
                          pair.confidence >= 0.8 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {Math.round(pair.confidence * 100)}%
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {pair.lead1?.name || pair.lead1?.email} ↔ {pair.lead2?.name || pair.lead2?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {pair.reasons?.join(', ')}
                          </p>
                        </div>
                      </div>
                      {expandedPair === `lead-${index}` ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    {expandedPair === `lead-${index}` && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-sm mb-2">Lead 1 (ID: {pair.lead1?.id})</p>
                          <p className="text-sm"><strong>Nom:</strong> {pair.lead1?.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {pair.lead1?.email}</p>
                          <p className="text-sm"><strong>Tél:</strong> {pair.lead1?.phone}</p>
                          <p className="text-sm"><strong>Créé:</strong> {pair.lead1?.created_at}</p>
                          <button
                            onClick={() => handleMergeLeads(pair.lead1?.id, pair.lead2?.id)}
                            disabled={merging}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {merging ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Garder celui-ci'}
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-sm mb-2">Lead 2 (ID: {pair.lead2?.id})</p>
                          <p className="text-sm"><strong>Nom:</strong> {pair.lead2?.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {pair.lead2?.email}</p>
                          <p className="text-sm"><strong>Tél:</strong> {pair.lead2?.phone}</p>
                          <p className="text-sm"><strong>Créé:</strong> {pair.lead2?.created_at}</p>
                          <button
                            onClick={() => handleMergeLeads(pair.lead2?.id, pair.lead1?.id)}
                            disabled={merging}
                            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {merging ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Garder celui-ci'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Duplicates */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                {t('crm.quality.contact_duplicates', 'Doublons Contacts')} ({contactDuplicates.length})
              </h3>
            </div>
            
            {contactDuplicates.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                {t('crm.quality.no_duplicates', 'Aucun doublon détecté')}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {contactDuplicates.map((pair, index) => (
                  <div key={index} className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedPair(expandedPair === `contact-${index}` ? null : `contact-${index}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          pair.confidence >= 0.9 ? 'bg-red-100 text-red-800' :
                          pair.confidence >= 0.8 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {Math.round(pair.confidence * 100)}%
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {pair.contact1?.name || pair.contact1?.email} ↔ {pair.contact2?.name || pair.contact2?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {pair.reasons?.join(', ')}
                          </p>
                        </div>
                      </div>
                      {expandedPair === `contact-${index}` ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    {expandedPair === `contact-${index}` && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-sm mb-2">Contact 1</p>
                          <p className="text-sm"><strong>Nom:</strong> {pair.contact1?.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {pair.contact1?.email}</p>
                          <p className="text-sm"><strong>Tél:</strong> {pair.contact1?.phone}</p>
                          <button
                            onClick={() => handleMergeContacts(pair.contact1?.id, pair.contact2?.id)}
                            disabled={merging}
                            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Garder celui-ci
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-sm mb-2">Contact 2</p>
                          <p className="text-sm"><strong>Nom:</strong> {pair.contact2?.name}</p>
                          <p className="text-sm"><strong>Email:</strong> {pair.contact2?.email}</p>
                          <p className="text-sm"><strong>Tél:</strong> {pair.contact2?.phone}</p>
                          <button
                            onClick={() => handleMergeContacts(pair.contact2?.id, pair.contact1?.id)}
                            disabled={merging}
                            className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Garder celui-ci
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t('crm.quality.data_stats', 'Statistiques de qualité')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Leads ({stats.leads?.total || 0})</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sans email</span>
                  <span className="font-medium text-red-600">{stats.leads?.missing_email || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sans téléphone</span>
                  <span className="font-medium text-orange-600">{stats.leads?.missing_phone || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sans nom</span>
                  <span className="font-medium text-yellow-600">{stats.leads?.missing_name || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${stats.leads?.completeness_score || 0}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Contacts ({stats.contacts?.total || 0})</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sans email</span>
                  <span className="font-medium text-red-600">{stats.contacts?.missing_email || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sans téléphone</span>
                  <span className="font-medium text-orange-600">{stats.contacts?.missing_phone || 0}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-2 bg-green-600 rounded-full" 
                    style={{ width: `${stats.contacts?.completeness_score || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Score global:</strong> {stats.overall_score || 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityPage;
