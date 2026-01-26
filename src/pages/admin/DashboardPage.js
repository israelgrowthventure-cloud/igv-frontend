import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Users, Target, Loader2, AlertTriangle, 
  Clock, Send, FileText, RefreshCw, ChevronRight, UserCheck
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import OverdueActionsAlert from '../../components/crm/OverdueActionsAlert';

/**
 * DashboardPage - Vue tableau de bord principal du CRM
 * Admin: Leads à dispatcher, urgents, mini-analyses, stats globales
 * Commercial: Mes leads, mes opportunités, mes tâches
 */
const DashboardPage = () => {
  const { t } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dispatch, setDispatch] = useState({ unassigned_leads: [] });
  const [urgentLeads, setUrgentLeads] = useState([]);
  const [miniAnalyses, setMiniAnalyses] = useState({ pending: 0, sent: 0 });
  const [loading, setLoading] = useState(true);

  const isUserAdmin = isAdmin && isAdmin();

  useEffect(() => {
    loadStats();
    if (isUserAdmin) {
      loadAdminWidgets();
    }
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/crm/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const loadAdminWidgets = async () => {
    try {
      // Load dispatch data (unassigned leads)
      const dispatchData = await api.get('/api/crm/settings/dispatch').catch(() => ({ unassigned_leads: [] }));
      setDispatch(dispatchData);
      
      // Load urgent leads (no activity in 7 days)
      const leadsData = await api.get('/api/crm/leads?limit=100').catch(() => ({ leads: [] }));
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const urgent = (leadsData.leads || leadsData || []).filter(lead => {
        const lastActivity = new Date(lead.updated_at || lead.created_at);
        return lastActivity < sevenDaysAgo && lead.status !== 'CONVERTED' && lead.status !== 'LOST';
      }).slice(0, 5);
      setUrgentLeads(urgent);
      
      // Load mini-analyses stats
      const miniData = await api.get('/api/crm/leads?source=mini-analyse&limit=100').catch(() => ({ leads: [] }));
      const pending = (miniData.leads || miniData || []).filter(l => l.status === 'NEW' || l.status === 'PENDING').length;
      const sent = (miniData.leads || miniData || []).filter(l => l.status === 'SENT' || l.status === 'CONVERTED').length;
      setMiniAnalyses({ pending, sent, total: (miniData.leads || miniData || []).length });
    } catch (error) {
      console.error('Error loading admin widgets:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      label: t('crm.dashboard.totalLeads', 'Total Prospects'),
      value: stats?.leads?.total || '0',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: t('crm.dashboard.leadsToday', 'Prospects Aujourd\'hui'),
      value: stats?.leads?.today || '0',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      label: t('crm.dashboard.pipelineValue', 'Valeur Pipeline'),
      value: stats?.opportunities?.pipeline_value 
        ? `${stats.opportunities.pipeline_value.toLocaleString()} €` 
        : '0 €',
      icon: BarChart3,
      color: 'bg-purple-500'
    },
    {
      label: t('crm.dashboard.totalOpportunities', 'Total Opportunités'),
      value: stats?.opportunities?.total || '0',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('crm.dashboard.title', 'Tableau de bord')}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('crm.dashboard.subtitle', 'Vue d\'ensemble de votre activité CRM')}
        </p>
      </div>

      {/* Overdue Actions Alert - Point 4 Mission */}
      <OverdueActionsAlert />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Only Widgets */}
      {isUserAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Leads à dispatcher */}
          <div className="bg-white rounded-lg shadow border border-orange-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-orange-800 flex items-center gap-2">
                <Send className="w-5 h-5" />
                {t('crm.dashboard.leads_to_dispatch', 'Leads to Dispatch')}
              </h2>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                {dispatch.unassigned_leads?.length || 0}
              </span>
            </div>
            {dispatch.unassigned_leads?.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dispatch.unassigned_leads.slice(0, 5).map((lead, idx) => (
                  <Link
                    key={lead.id || idx}
                    to={`/admin/crm/leads/${lead.id}`}
                    className="block p-2 hover:bg-orange-50 rounded border-l-2 border-orange-400"
                  >
                    <p className="font-medium text-sm">{lead.brand_name || lead.email}</p>
                    <p className="text-xs text-gray-500">{lead.source || 'Direct'}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-green-600 py-4">✓ {t('crm.dashboard.all_leads_assigned', 'All leads are assigned')}</p>
            )}
            <Link to="/admin/crm/settings" className="block mt-4 text-center text-orange-600 hover:underline text-sm">
              {t('crm.dashboard.manage_assignments', 'Manage assignments')} →
            </Link>
          </div>

          {/* Leads urgents */}
          <div className="bg-white rounded-lg shadow border border-red-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t('crm.dashboard.urgent_leads', 'Urgent Leads')}
              </h2>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                {urgentLeads.length}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{t('crm.dashboard.no_activity_7d', 'No activity for 7+ days')}</p>
            {urgentLeads.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {urgentLeads.map((lead, idx) => (
                  <Link
                    key={lead._id || lead.id || idx}
                    to={`/admin/crm/leads/${lead._id || lead.id}`}
                    className="block p-2 hover:bg-red-50 rounded border-l-2 border-red-400"
                  >
                    <p className="font-medium text-sm">{lead.brand_name || lead.email}</p>
                    <p className="text-xs text-gray-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString() : '-'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-green-600 py-4">✓ {t('crm.dashboard.no_urgent_leads', 'No urgent leads')}</p>
            )}
          </div>

          {/* Mini-Analyses */}
          <div className="bg-white rounded-lg shadow border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('crm.nav.mini_analyses', 'Mini-Analyses')}
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-yellow-800">{t('crm.mini_analysis.status.pending', 'Pending')}</span>
                <span className="font-bold text-yellow-800">{miniAnalyses.pending}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-800">{t('crm.mini_analysis.status.sent', 'Sent')}</span>
                <span className="font-bold text-green-800">{miniAnalyses.sent}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-800">{t('common.total', 'Total')}</span>
                <span className="font-bold text-purple-800">{miniAnalyses.total || 0}</span>
              </div>
            </div>
            <Link to="/admin/crm/leads?source=mini-analyse" className="block mt-4 text-center text-purple-600 hover:underline text-sm">
              {t('crm.mini_analysis.view_all', 'View mini-analyses')} →
            </Link>
          </div>
        </div>
      )}

      {/* Top Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('crm.dashboard.topSources', 'Top Sources')}
          </h2>
          {stats?.top_sources?.length > 0 ? (
            <div className="space-y-2">
              {stats.top_sources.map((source, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span>{source.source || 'Direct'}</span>
                  <span className="font-semibold">{source.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('crm.dashboard.noData', 'Aucune donnée')}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('crm.dashboard.stageDistribution', 'Distribution par étape')}
          </h2>
          {stats?.stage_distribution?.length > 0 ? (
            <div className="space-y-2">
              {stats.stage_distribution.map((stage, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b">
                  <span className="capitalize">{stage.stage?.replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{stage.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('crm.dashboard.noData', 'Aucune donnée')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
