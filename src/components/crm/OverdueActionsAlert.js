import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Clock, Phone, Mail, Users, Video, 
  FileText, ChevronRight, X, Bell, RefreshCw, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

/**
 * OverdueActionsAlert - Alerte pour les actions en retard
 * Point 4 de la mission - Suivi des actions
 */
const OverdueActionsAlert = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overdueLeads, setOverdueLeads] = useState([]);
  const [missingActionLeads, setMissingActionLeads] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadAlerts();
    // Refresh every 5 minutes
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const [overdueRes, missingRes] = await Promise.all([
        api.get('/api/crm/leads/overdue-actions'),
        api.get('/api/crm/leads/missing-next-action', { params: { limit: 10 } })
      ]);

      setOverdueLeads(overdueRes.leads || []);
      setMissingActionLeads(missingRes.leads || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'demo': return <Video className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatOverdue = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    return `Il y a ${diffDays} jours`;
  };

  if (dismissed || loading) return null;
  
  const totalAlerts = overdueLeads.length + missingActionLeads.length;
  if (totalAlerts === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bell className="w-5 h-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {t('crm.alerts.actions_required', 'Actions requises')}
            </h3>
            <div className="mt-1 text-sm text-red-700">
              {overdueLeads.length > 0 && (
                <span className="font-medium">{overdueLeads.length} action(s) en retard</span>
              )}
              {overdueLeads.length > 0 && missingActionLeads.length > 0 && ' • '}
              {missingActionLeads.length > 0 && (
                <span>{missingActionLeads.length} lead(s) sans action planifiée</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            {expanded ? 'Masquer' : 'Détails'}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Overdue Actions */}
          {overdueLeads.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Actions en retard
              </h4>
              <div className="space-y-2">
                {overdueLeads.slice(0, 5).map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() => navigate(`/crm/leads/${lead._id}`)}
                    className="w-full flex items-center justify-between p-2 bg-white rounded-lg border border-red-200 hover:border-red-300 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        {getActionIcon(lead.next_action?.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.name || lead.email || 'Sans nom'}
                        </p>
                        <p className="text-xs text-red-600">
                          {lead.next_action?.type} • {formatOverdue(lead.next_action?.date)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
                {overdueLeads.length > 5 && (
                  <p className="text-xs text-red-600 text-center">
                    +{overdueLeads.length - 5} autres actions en retard
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Missing Actions */}
          {missingActionLeads.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Sans action planifiée
              </h4>
              <div className="space-y-2">
                {missingActionLeads.slice(0, 5).map((lead) => (
                  <button
                    key={lead._id}
                    onClick={() => navigate(`/crm/leads/${lead._id}`)}
                    className="w-full flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-orange-600">
                        ?
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.name || lead.email || 'Sans nom'}
                        </p>
                        <p className="text-xs text-orange-600">
                          Statut: {lead.status || 'nouveau'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
                {missingActionLeads.length > 5 && (
                  <p className="text-xs text-orange-600 text-center">
                    +{missingActionLeads.length - 5} autres sans action
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={loadAlerts}
            className="w-full py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
};

export default OverdueActionsAlert;
