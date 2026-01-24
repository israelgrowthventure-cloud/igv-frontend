import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, History, User, Filter, RefreshCw, Search,
  Eye, Edit2, Trash2, Plus, Download, Calendar,
  ChevronLeft, ChevronRight, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AuditLogsPage - Logs d'audit complets
 * Point 12 de la mission - Traçabilité complète
 */
const AuditLogsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  });
  
  const [filters, setFilters] = useState({
    entity_type: '',
    action: '',
    user_email: '',
    start_date: '',
    end_date: ''
  });

  const [expandedLog, setExpandedLog] = useState(null);

  const entityTypes = [
    { value: '', label: 'Tous les types' },
    { value: 'lead', label: 'Leads' },
    { value: 'contact', label: 'Contacts' },
    { value: 'company', label: 'Sociétés' },
    { value: 'opportunity', label: 'Opportunités' },
    { value: 'activity', label: 'Activités' },
    { value: 'email', label: 'Emails' },
    { value: 'user', label: 'Utilisateurs' }
  ];

  const actionTypes = [
    { value: '', label: 'Toutes les actions' },
    { value: 'create', label: 'Création' },
    { value: 'update', label: 'Modification' },
    { value: 'delete', label: 'Suppression' },
    { value: 'view', label: 'Consultation' },
    { value: 'export', label: 'Export' },
    { value: 'merge', label: 'Fusion' },
    { value: 'assign', label: 'Assignation' }
  ];

  useEffect(() => {
    if (isAdmin) {
      loadLogs();
      loadStats();
    }
  }, [isAdmin, pagination.page, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        )
      };

      const response = await api.get('/api/crm/audit-logs', { params });
      setLogs(response.logs || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 1
      }));
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/api/crm/audit-logs/stats');
      setStats(response);
    } catch (error) {
      console.error('Error loading audit stats:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      entity_type: '',
      action: '',
      user_email: '',
      start_date: '',
      end_date: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4 text-green-600" />;
      case 'update': return <Edit2 className="w-4 h-4 text-blue-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'view': return <Eye className="w-4 h-4 text-gray-600" />;
      case 'export': return <Download className="w-4 h-4 text-purple-600" />;
      default: return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      case 'export': return 'bg-purple-100 text-purple-800';
      case 'merge': return 'bg-orange-100 text-orange-800';
      case 'assign': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatChanges = (changes) => {
    if (!changes || typeof changes !== 'object') return null;
    
    return Object.entries(changes).map(([field, change]) => {
      if (typeof change === 'object' && change !== null && 'old' in change && 'new' in change) {
        return (
          <div key={field} className="text-xs py-1 border-b border-gray-100 last:border-0">
            <span className="font-medium text-gray-700">{field}:</span>
            <span className="text-red-600 line-through ml-2">{String(change.old || '-')}</span>
            <span className="mx-1">→</span>
            <span className="text-green-600">{String(change.new || '-')}</span>
          </div>
        );
      }
      return (
        <div key={field} className="text-xs py-1">
          <span className="font-medium text-gray-700">{field}:</span>
          <span className="ml-2 text-gray-600">{String(change)}</span>
        </div>
      );
    });
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <History className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">{t('crm.errors.admin_only', 'Accès réservé aux administrateurs')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crm.audit.title', 'Logs d\'audit')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.audit.subtitle', 'Historique complet des actions')}
          </p>
        </div>
        <button
          onClick={() => { loadLogs(); loadStats(); }}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh', 'Actualiser')}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total logs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_logs || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Aujourd'hui</p>
            <p className="text-2xl font-bold text-blue-600">{stats.today || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Cette semaine</p>
            <p className="text-2xl font-bold text-green-600">{stats.this_week || 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Utilisateurs actifs</p>
            <p className="text-2xl font-bold text-purple-600">{stats.unique_users || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </h3>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Réinitialiser
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type d'entité</label>
            <select
              value={filters.entity_type}
              onChange={(e) => handleFilterChange('entity_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {entityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Action</label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {actionTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Utilisateur</label>
            <input
              type="text"
              value={filters.user_email}
              onChange={(e) => handleFilterChange('user_email', e.target.value)}
              placeholder="Email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date début</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date fin</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('crm.audit.no_logs', 'Aucun log trouvé')}</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(log.created_at || log.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <User className="w-3 h-3 text-gray-500" />
                          </div>
                          <span className="text-sm text-gray-900">
                            {log.user_email || log.user || 'Système'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                          <span className="ml-1 capitalize">{log.action}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600 capitalize">
                          {log.entity_type}
                        </span>
                        {log.entity_id && (
                          <span className="text-xs text-gray-400 ml-1">
                            #{log.entity_id.slice(-6)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {log.description || log.details || '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {log.changes && Object.keys(log.changes).length > 0 && (
                          <button
                            onClick={() => setExpandedLog(expandedLog === log._id ? null : log._id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {expandedLog === log._id ? 'Masquer' : 'Voir'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedLog === log._id && log.changes && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              Modifications
                            </h4>
                            <div className="max-h-40 overflow-y-auto">
                              {formatChanges(log.changes)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {pagination.page} sur {pagination.pages} ({pagination.total} logs)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
