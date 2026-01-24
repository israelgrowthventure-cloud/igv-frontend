import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, Plus, Edit2, Trash2, Play, Pause, Settings, 
  Zap, Clock, Filter, Save, X, AlertCircle, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AutomationRulesPage - Gestion des règles d'automatisation
 * Point 3 de la mission - Règles métier automatiques
 */
const AutomationRulesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [executing, setExecuting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'status_change',
    trigger_conditions: {},
    actions: [],
    is_active: true
  });

  const triggerTypes = [
    { value: 'status_change', label: 'Changement de statut' },
    { value: 'new_lead', label: 'Nouveau lead' },
    { value: 'inactivity', label: 'Inactivité' },
    { value: 'score_threshold', label: 'Seuil de score' },
    { value: 'date_based', label: 'Basé sur une date' }
  ];

  const actionTypes = [
    { value: 'update_status', label: 'Modifier le statut' },
    { value: 'assign_user', label: 'Assigner à un utilisateur' },
    { value: 'send_email', label: 'Envoyer un email' },
    { value: 'create_activity', label: 'Créer une activité' },
    { value: 'update_field', label: 'Modifier un champ' },
    { value: 'add_tag', label: 'Ajouter un tag' }
  ];

  useEffect(() => {
    if (isAdmin) {
      loadRules();
    }
  }, [isAdmin]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/crm/rules');
      setRules(response.rules || []);
    } catch (error) {
      console.error('Error loading rules:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingRule) {
        await api.put(`/api/crm/rules/${editingRule._id}`, formData);
        toast.success(t('crm.rules.updated', 'Règle mise à jour'));
      } else {
        await api.post('/api/crm/rules', formData);
        toast.success(t('crm.rules.created', 'Règle créée'));
      }
      setShowModal(false);
      setEditingRule(null);
      resetForm();
      await loadRules();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error(t('crm.errors.save_failed', 'Erreur de sauvegarde'));
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm(t('crm.rules.confirm_delete', 'Supprimer cette règle ?'))) {
      return;
    }

    try {
      await api.delete(`/api/crm/rules/${ruleId}`);
      toast.success(t('crm.rules.deleted', 'Règle supprimée'));
      await loadRules();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error(t('crm.errors.delete_failed', 'Erreur de suppression'));
    }
  };

  const handleToggleActive = async (rule) => {
    try {
      await api.put(`/api/crm/rules/${rule._id}`, {
        ...rule,
        is_active: !rule.is_active
      });
      toast.success(rule.is_active 
        ? t('crm.rules.deactivated', 'Règle désactivée')
        : t('crm.rules.activated', 'Règle activée')
      );
      await loadRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error(t('crm.errors.update_failed', 'Erreur de mise à jour'));
    }
  };

  const handleExecuteRules = async () => {
    try {
      setExecuting(true);
      const result = await api.post('/api/crm/rules/execute');
      toast.success(
        t('crm.rules.executed', 'Règles exécutées: {{count}} actions', { count: result.actions_taken || 0 })
      );
    } catch (error) {
      console.error('Error executing rules:', error);
      toast.error(t('crm.errors.execution_failed', 'Erreur d\'exécution'));
    } finally {
      setExecuting(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      trigger_type: rule.trigger_type,
      trigger_conditions: rule.trigger_conditions || {},
      actions: rule.actions || [],
      is_active: rule.is_active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger_type: 'status_change',
      trigger_conditions: {},
      actions: [],
      is_active: true
    });
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'update_status', params: {} }]
    }));
  };

  const removeAction = (index) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crm.rules.title', 'Règles d\'automatisation')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.rules.subtitle', 'Automatisez vos processus CRM')}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExecuteRules}
            disabled={executing}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            {executing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {t('crm.rules.execute', 'Exécuter les règles')}
          </button>
          <button
            onClick={() => { resetForm(); setEditingRule(null); setShowModal(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('crm.rules.add', 'Nouvelle règle')}
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {rules.length === 0 ? (
          <div className="p-12 text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t('crm.rules.empty', 'Aucune règle configurée')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              {t('crm.rules.create_first', 'Créer votre première règle')}
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rules.name', 'Nom')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rules.trigger', 'Déclencheur')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rules.actions', 'Actions')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rules.status', 'Statut')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t('common.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{rule.name}</p>
                      {rule.description && (
                        <p className="text-sm text-gray-500">{rule.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {triggerTypes.find(t => t.value === rule.trigger_type)?.label || rule.trigger_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {rule.actions?.length || 0} action(s)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(rule)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {rule.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actif
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Inactif
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(rule)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rule._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rule Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRule 
                  ? t('crm.rules.edit', 'Modifier la règle')
                  : t('crm.rules.create', 'Créer une règle')
                }
              </h3>
              <button
                onClick={() => { setShowModal(false); setEditingRule(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.rules.name', 'Nom')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Relancer les leads inactifs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.rules.description', 'Description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Trigger Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('crm.rules.trigger_type', 'Type de déclencheur')} *
                </label>
                <select
                  value={formData.trigger_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, trigger_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {triggerTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trigger Conditions */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('crm.rules.conditions', 'Conditions')}
                </h4>
                
                {formData.trigger_type === 'status_change' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">De</label>
                      <select
                        value={formData.trigger_conditions.from_status || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          trigger_conditions: { ...prev.trigger_conditions, from_status: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Tout statut</option>
                        <option value="new">Nouveau</option>
                        <option value="contacted">Contacté</option>
                        <option value="qualified">Qualifié</option>
                        <option value="proposal">Proposition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Vers</label>
                      <select
                        value={formData.trigger_conditions.to_status || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          trigger_conditions: { ...prev.trigger_conditions, to_status: e.target.value }
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Tout statut</option>
                        <option value="contacted">Contacté</option>
                        <option value="qualified">Qualifié</option>
                        <option value="proposal">Proposition</option>
                        <option value="won">Gagné</option>
                        <option value="lost">Perdu</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.trigger_type === 'inactivity' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Jours d'inactivité</label>
                    <input
                      type="number"
                      value={formData.trigger_conditions.days || 7}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        trigger_conditions: { ...prev.trigger_conditions, days: parseInt(e.target.value) }
                      }))}
                      min="1"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}

                {formData.trigger_type === 'score_threshold' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Score minimum</label>
                    <input
                      type="number"
                      value={formData.trigger_conditions.min_score || 50}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        trigger_conditions: { ...prev.trigger_conditions, min_score: parseInt(e.target.value) }
                      }))}
                      min="0"
                      max="100"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-700 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    {t('crm.rules.actions', 'Actions')}
                  </h4>
                  <button
                    onClick={addAction}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Ajouter une action
                  </button>
                </div>
                
                {formData.actions.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune action configurée</p>
                ) : (
                  <div className="space-y-2">
                    {formData.actions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-white p-2 rounded">
                        <select
                          value={action.type}
                          onChange={(e) => updateAction(index, 'type', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          {actionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {action.type === 'update_status' && (
                          <select
                            value={action.params?.new_status || ''}
                            onChange={(e) => updateAction(index, 'params', { new_status: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Statut</option>
                            <option value="contacted">Contacté</option>
                            <option value="qualified">Qualifié</option>
                            <option value="proposal">Proposition</option>
                          </select>
                        )}
                        <button
                          onClick={() => removeAction(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  {t('crm.rules.active', 'Règle active')}
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => { setShowModal(false); setEditingRule(null); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || formData.actions.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationRulesPage;
