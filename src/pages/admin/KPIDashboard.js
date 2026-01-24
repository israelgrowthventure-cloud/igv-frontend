import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, TrendingUp, Clock, Target, Users, BarChart3,
  ArrowUp, ArrowDown, RefreshCw, Calendar, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

/**
 * KPIDashboard - Tableau de bord des KPIs CRM
 * Points 5-6 de la mission - Délais de réponse et performance sources
 */
const KPIDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [responseTimes, setResponseTimes] = useState(null);
  const [conversionTimes, setConversionTimes] = useState(null);
  const [sourcePerformance, setSourcePerformance] = useState([]);
  const [funnel, setFunnel] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    loadKPIs();
  }, [dateRange]);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      const days = parseInt(dateRange);
      
      const [respRes, convRes, srcRes, funnelRes] = await Promise.all([
        api.get('/api/crm/kpi/response-times', { params: { days } }),
        api.get('/api/crm/kpi/conversion-times', { params: { days } }),
        api.get('/api/crm/kpi/source-performance', { params: { days } }),
        api.get('/api/crm/kpi/funnel', { params: { days } })
      ]);

      setResponseTimes(respRes);
      setConversionTimes(convRes);
      setSourcePerformance(srcRes.sources || []);
      setFunnel(funnelRes);
    } catch (error) {
      console.error('Error loading KPIs:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (hours) => {
    if (!hours && hours !== 0) return '-';
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${Math.round(hours)} h`;
    return `${Math.round(hours / 24)} j`;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crm.kpi.title', 'KPIs & Performance')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.kpi.subtitle', 'Analysez vos performances commerciales')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">12 derniers mois</option>
          </select>
          <button
            onClick={loadKPIs}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh', 'Actualiser')}
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* First Response Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t('crm.kpi.first_response', 'Première réponse')}
            </span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatDuration(responseTimes?.average_first_response_hours)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Médiane: {formatDuration(responseTimes?.median_first_response_hours)}
          </p>
          {responseTimes?.average_first_response_hours && (
            <div className={`flex items-center mt-2 text-sm ${
              responseTimes.average_first_response_hours <= 2 ? 'text-green-600' : 
              responseTimes.average_first_response_hours <= 8 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {responseTimes.average_first_response_hours <= 2 ? (
                <ArrowDown className="w-4 h-4 mr-1" />
              ) : (
                <ArrowUp className="w-4 h-4 mr-1" />
              )}
              {responseTimes.average_first_response_hours <= 2 ? 'Excellent' : 
               responseTimes.average_first_response_hours <= 8 ? 'Acceptable' : 'À améliorer'}
            </div>
          )}
        </div>

        {/* Conversion Time */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t('crm.kpi.conversion_time', 'Temps de conversion')}
            </span>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatDuration(conversionTimes?.average_conversion_hours)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Lead → Contact
          </p>
        </div>

        {/* Total Leads Processed */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t('crm.kpi.leads_processed', 'Leads traités')}
            </span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {responseTimes?.total_leads || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Sur {dateRange} jours
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              {t('crm.kpi.conversion_rate', 'Taux de conversion')}
            </span>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {funnel?.conversion_rate || 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Lead → Opportunité gagnée
          </p>
        </div>
      </div>

      {/* Funnel Visualization */}
      {funnel && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            {t('crm.kpi.funnel', 'Entonnoir de conversion')}
          </h3>
          
          <div className="space-y-4">
            {funnel.stages?.map((stage, index) => {
              const maxCount = Math.max(...funnel.stages.map(s => s.count));
              const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
              
              return (
                <div key={stage.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{stage.label || stage.name}</span>
                    <span className="text-gray-500">{stage.count}</span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className={`h-full rounded-lg transition-all duration-500 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-blue-400' :
                        index === 2 ? 'bg-green-500' :
                        index === 3 ? 'bg-green-400' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {index < funnel.stages.length - 1 && funnel.stages[index + 1] && (
                    <div className="text-xs text-gray-500 text-right mt-1">
                      → {stage.count > 0 ? Math.round((funnel.stages[index + 1].count / stage.count) * 100) : 0}% passent à l'étape suivante
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Source Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          {t('crm.kpi.source_performance', 'Performance par source')}
        </h3>
        
        {sourcePerformance.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {t('crm.kpi.no_data', 'Pas de données disponibles')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Source</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Leads</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Convertis</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Taux</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">CA Généré</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sourcePerformance.map((source, index) => (
                  <tr key={source.source || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {source.source || 'Non renseigné'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {source.total_leads || 0}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {source.converted || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${
                        source.conversion_rate >= 30 ? 'text-green-600' :
                        source.conversion_rate >= 15 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {source.conversion_rate || 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {source.revenue ? `${source.revenue.toLocaleString()} €` : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            source.conversion_rate >= 30 ? 'bg-green-500' :
                            source.conversion_rate >= 15 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(source.conversion_rate * 2, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Response Time Breakdown */}
      {responseTimes?.by_user && responseTimes.by_user.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            {t('crm.kpi.response_by_user', 'Temps de réponse par utilisateur')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responseTimes.by_user.map((userData, index) => (
              <div key={userData.user || index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{userData.user || 'Inconnu'}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">Moyenne:</span>
                  <span className={`font-medium ${
                    userData.average_hours <= 2 ? 'text-green-600' :
                    userData.average_hours <= 8 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatDuration(userData.average_hours)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Leads traités:</span>
                  <span className="text-gray-700">{userData.count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIDashboard;
