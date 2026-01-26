import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, FileText, User, Clock, CheckCircle, AlertTriangle,
  ArrowRight, RefreshCw, Filter, Eye, UserPlus, Zap, Play
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * MiniAnalysisWorkflowPage - Workflow complet des mini-analyses
 * Point 10 de la mission - Gestion des mini-analyses
 */
const MiniAnalysisWorkflowPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [team, setTeam] = useState([]);
  const [assignTo, setAssignTo] = useState('');

  const statusFilters = [
    { value: 'all', label: 'Toutes', count: stats?.total || 0 },
    { value: 'pending', label: 'En attente', count: stats?.pending || 0, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En cours', count: stats?.in_progress || 0, color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Terminées', count: stats?.completed || 0, color: 'bg-green-100 text-green-800' },
    { value: 'converted', label: 'Converties', count: stats?.converted || 0, color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    loadData();
  }, [activeFilter, pagination.page]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(activeFilter !== 'all' && { status: activeFilter })
      };

      const [analysesRes, statsRes] = await Promise.all([
        api.get('/api/crm/mini-analyses', { params }),
        api.get('/api/crm/mini-analyses/stats').catch(() => ({}))
      ]);

      // API returns {mini_analyses: [...]} not {analyses: [...]}
      const analysesData = analysesRes?.mini_analyses || analysesRes?.analyses || analysesRes?.data?.mini_analyses || [];
      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      setStats(statsRes || {});
      setPagination(prev => ({
        ...prev,
        total: analysesRes?.total || analysesRes?.data?.total || 0
      }));
    } catch (error) {
      console.error('Error loading mini-analyses:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTeam = async () => {
    try {
      // Canonical route: /api/crm/settings/users (replaces legacy /api/crm/team)
      const response = await api.get('/api/crm/settings/users');
      const teamData = response?.users || response?.team || response?.data?.team || [];
      setTeam(Array.isArray(teamData) ? teamData : []);
    } catch (error) {
      console.error('Error loading team:', error);
      setTeam([]);
    }
  };

  const handleStatusChange = async (analysisId, newStatus) => {
    try {
      await api.put(`/api/crm/mini-analyses/${analysisId}/status`, {
        status: newStatus
      });
      toast.success(t('crm.mini_analysis.status_updated', 'Statut mis à jour'));
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('crm.errors.update_failed', 'Erreur de mise à jour'));
    }
  };

  const handleAssign = async () => {
    if (!selectedAnalysis || !assignTo) return;

    try {
      await api.post(`/api/crm/mini-analyses/${selectedAnalysis._id}/assign`, {
        assigned_to: assignTo
      });
      toast.success(t('crm.mini_analysis.assigned', 'Mini-analyse assignée'));
      setShowAssignModal(false);
      setSelectedAnalysis(null);
      setAssignTo('');
      await loadData();
    } catch (error) {
      console.error('Error assigning analysis:', error);
      toast.error(t('crm.errors.assign_failed', 'Erreur d\'assignation'));
    }
  };

  const handleConvertToLead = async (analysisId) => {
    if (!window.confirm(t('crm.mini_analysis.confirm_convert', 'Convertir cette mini-analyse en lead complet ?'))) {
      return;
    }

    try {
      const result = await api.post(`/api/crm/mini-analyses/${analysisId}/convert`);
      toast.success(t('crm.mini_analysis.converted', 'Converti en lead avec succès'));
      
      // Navigate to the new lead
      if (result.lead_id) {
        navigate(`/crm/leads/${result.lead_id}`);
      } else {
        await loadData();
      }
    } catch (error) {
      console.error('Error converting analysis:', error);
      toast.error(t('crm.errors.convert_failed', 'Erreur de conversion'));
    }
  };

  const openAssignModal = (analysis) => {
    setSelectedAnalysis(analysis);
    loadTeam();
    setShowAssignModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'converted': return 'Convertie';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crm.mini_analysis.title', 'Mini-Analyses')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.mini_analysis.subtitle', 'Gérez le workflow des mini-analyses')}
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
            <p className="text-sm text-yellow-700">En attente</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <p className="text-sm text-blue-700">En cours</p>
            <p className="text-2xl font-bold text-blue-900">{stats.in_progress || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <p className="text-sm text-green-700">Terminées</p>
            <p className="text-2xl font-bold text-green-900">{stats.completed || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
            <p className="text-sm text-purple-700">Converties</p>
            <p className="text-2xl font-bold text-purple-900">{stats.converted || 0}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeFilter === filter.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeFilter === filter.value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Analyses List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {t('crm.mini_analysis.empty', 'Aucune mini-analyse trouvée')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {analyses.map((analysis) => (
              <div key={analysis._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                        {getStatusLabel(analysis.status)}
                      </span>
                      <h3 className="font-medium text-gray-900">
                        {analysis.business_name || analysis.name || 'Sans nom'}
                      </h3>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-1 text-gray-900">{analysis.email || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Téléphone:</span>
                        <span className="ml-1 text-gray-900">{analysis.phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Source:</span>
                        <span className="ml-1 text-gray-900">{analysis.source || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Créé:</span>
                        <span className="ml-1 text-gray-900">{formatDate(analysis.created_at)}</span>
                      </div>
                    </div>

                    {analysis.assigned_to && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-1" />
                        Assigné à: {analysis.assigned_to}
                      </div>
                    )}

                    {analysis.notes && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {analysis.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {/* Status Actions */}
                    {analysis.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(analysis._id, 'in_progress')}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Démarrer
                      </button>
                    )}

                    {analysis.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(analysis._id, 'completed')}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Terminer
                      </button>
                    )}

                    {analysis.status === 'completed' && (
                      <button
                        onClick={() => handleConvertToLead(analysis._id)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Convertir
                      </button>
                    )}

                    {/* Assign Button */}
                    {isAdmin && analysis.status !== 'converted' && (
                      <button
                        onClick={() => openAssignModal(analysis)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Assigner
                      </button>
                    )}

                    {/* View Details */}
                    <button
                      onClick={() => navigate(`/crm/mini-analyses/${analysis._id}`)}
                      className="px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700 flex items-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && analyses.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {pagination.total} mini-analyse(s)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('crm.mini_analysis.assign', 'Assigner la mini-analyse')}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedAnalysis.business_name || selectedAnalysis.email}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigner à
              </label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un utilisateur</option>
                {team.map((member) => (
                  <option key={member._id || member.email} value={member.email}>
                    {member.name || member.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => { setShowAssignModal(false); setSelectedAnalysis(null); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleAssign}
                disabled={!assignTo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {t('common.assign', 'Assigner')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniAnalysisWorkflowPage;
