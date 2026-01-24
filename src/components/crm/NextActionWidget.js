import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, Clock, Phone, Mail, FileText, Users, Video,
  AlertTriangle, CheckCircle, Plus, Edit2, Save, X, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

/**
 * NextActionWidget - Widget pour gérer la prochaine action sur un lead
 * Point 4 de la mission - Prochaine action obligatoire
 */
const NextActionWidget = ({ leadId, lead, onUpdate }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextAction, setNextAction] = useState({
    type: lead?.next_action?.type || 'call',
    date: lead?.next_action?.date || '',
    description: lead?.next_action?.description || ''
  });

  const actionTypes = [
    { value: 'call', label: 'Appel', icon: Phone, color: 'text-blue-600 bg-blue-100' },
    { value: 'email', label: 'Email', icon: Mail, color: 'text-green-600 bg-green-100' },
    { value: 'meeting', label: 'Réunion', icon: Users, color: 'text-purple-600 bg-purple-100' },
    { value: 'demo', label: 'Démo', icon: Video, color: 'text-orange-600 bg-orange-100' },
    { value: 'followup', label: 'Relance', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { value: 'document', label: 'Document', icon: FileText, color: 'text-gray-600 bg-gray-100' }
  ];

  useEffect(() => {
    if (lead?.next_action) {
      setNextAction({
        type: lead.next_action.type || 'call',
        date: lead.next_action.date ? lead.next_action.date.split('T')[0] : '',
        description: lead.next_action.description || ''
      });
    }
  }, [lead]);

  const handleSave = async () => {
    if (!nextAction.date) {
      toast.error(t('crm.next_action.date_required', 'La date est obligatoire'));
      return;
    }

    try {
      setLoading(true);
      await api.put(`/api/crm/leads/${leadId}/next-action`, {
        type: nextAction.type,
        date: nextAction.date,
        description: nextAction.description
      });
      
      toast.success(t('crm.next_action.saved', 'Prochaine action enregistrée'));
      setEditing(false);
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving next action:', error);
      toast.error(t('crm.errors.save_failed', 'Erreur de sauvegarde'));
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = () => {
    if (!lead?.next_action?.date) return false;
    return new Date(lead.next_action.date) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    }

    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const currentActionType = actionTypes.find(a => a.value === (lead?.next_action?.type || nextAction.type));
  const CurrentIcon = currentActionType?.icon || Phone;

  // No next action set
  if (!lead?.next_action?.date && !editing) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800">
              {t('crm.next_action.missing', 'Aucune prochaine action définie')}
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              {t('crm.next_action.missing_hint', 'Définissez la prochaine action pour ce lead')}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 inline-flex items-center px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              {t('crm.next_action.add', 'Ajouter une action')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Editing mode
  if (editing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          {t('crm.next_action.edit', 'Prochaine action')}
        </h4>
        
        <div className="space-y-4">
          {/* Action Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'action
            </label>
            <div className="grid grid-cols-3 gap-2">
              {actionTypes.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.value}
                    onClick={() => setNextAction(prev => ({ ...prev, type: action.value }))}
                    className={`p-2 rounded-lg border text-sm flex flex-col items-center transition-colors ${
                      nextAction.type === action.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={nextAction.date}
              onChange={(e) => setNextAction(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={nextAction.description}
              onChange={(e) => setNextAction(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="Détails sur l'action à effectuer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !nextAction.date}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={`border rounded-lg p-4 ${
      isOverdue() 
        ? 'bg-red-50 border-red-200' 
        : 'bg-green-50 border-green-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-full ${currentActionType?.color || 'bg-blue-100'} flex items-center justify-center mr-3`}>
            <CurrentIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h4 className={`font-medium ${isOverdue() ? 'text-red-800' : 'text-green-800'}`}>
                {currentActionType?.label || 'Action'}
              </h4>
              {isOverdue() && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  En retard
                </span>
              )}
            </div>
            <div className={`flex items-center mt-1 text-sm ${isOverdue() ? 'text-red-600' : 'text-green-600'}`}>
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(lead?.next_action?.date)}
            </div>
            {lead?.next_action?.description && (
              <p className={`text-sm mt-2 ${isOverdue() ? 'text-red-700' : 'text-green-700'}`}>
                {lead.next_action.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className={`p-1.5 rounded-lg ${
            isOverdue() 
              ? 'text-red-600 hover:bg-red-100' 
              : 'text-green-600 hover:bg-green-100'
          }`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NextActionWidget;
