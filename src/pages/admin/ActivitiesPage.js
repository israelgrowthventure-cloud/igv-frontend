import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Phone, Calendar, CheckCircle, XCircle, Clock,
  Search, Filter, Plus, Trash2, Loader2, Edit2, RefreshCw,
  MessageSquare, Mail, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

const ActivitiesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'call',
    subject: '',
    lead_id: '',
    due_date: '',
    notes: ''
  });

  const isRTL = i18n.language === 'he';

  useEffect(() => {
    fetchActivities();
  }, [activeTab]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (activeTab !== 'all') params.type = activeTab;

      const response = await api.get('/api/crm/activities', { params });
      setActivities(response?.activities || response || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error(t('admin.crm.activities.errors.load_failed') || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/crm/activities', newActivity);
      toast.success(t('admin.crm.activities.created') || 'Activity created');
      setShowAddModal(false);
      setNewActivity({ type: 'call', subject: '', lead_id: '', due_date: '', notes: '' });
      fetchActivities();
    } catch (error) {
      toast.error(t('admin.crm.activities.errors.create_failed') || 'Failed to create activity');
    }
  };

  const handleComplete = async (activityId) => {
    try {
      await api.put(`/api/crm/activities/${activityId}`, { status: 'completed' });
      toast.success(t('admin.crm.activities.completed') || 'Activity completed');
      fetchActivities();
    } catch (error) {
      toast.error(t('admin.crm.activities.errors.update_failed') || 'Failed to update activity');
    }
  };

  const handleDelete = async (activityId) => {
    if (!window.confirm(t('admin.crm.activities.delete_confirm') || 'Delete this activity?')) return;
    try {
      await api.delete(`/api/crm/activities/${activityId}`);
      toast.success(t('admin.crm.activities.deleted') || 'Activity deleted');
      fetchActivities();
    } catch (error) {
      toast.error(t('admin.crm.activities.errors.delete_failed') || 'Failed to delete activity');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      call: Phone,
      meeting: Calendar,
      email: Mail,
      task: CheckCircle,
      note: MessageSquare,
      conversion: ExternalLink,
      status_change: Activity,
      stage_change: Activity
    };
    return icons[type] || Activity;
  };

  const getTypeLabel = (type) => {
    const labels = {
      call: t('admin.crm.activities.types.call') || 'Appel',
      meeting: t('admin.crm.activities.types.meeting') || 'Réunion',
      email: t('admin.crm.activities.types.email') || 'Email',
      task: t('admin.crm.activities.types.task') || 'Tâche',
      note: 'Note',
      conversion: 'Conversion',
      status_change: 'Changement statut',
      stage_change: 'Changement étape'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-green-100 text-green-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t('admin.crm.activities.status.pending') || 'En attente',
      completed: t('admin.crm.activities.status.completed') || 'Terminé',
      cancelled: t('admin.crm.activities.status.cancelled') || 'Annulé',
      overdue: t('admin.crm.activities.status.overdue') || 'En retard'
    };
    return labels[status] || status || 'Terminé';
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    return dueDate && new Date(dueDate) < new Date();
  };

  // Get display subject - for notes, show the content
  const getDisplaySubject = (activity) => {
    if (activity.type === 'note') {
      const content = activity.description || activity.note_text || activity.subject || '';
      return content.length > 60 ? content.substring(0, 60) + '...' : content;
    }
    return activity.subject || '-';
  };

  // Filter activities by search term
  const filteredActivities = activities.filter(activity => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (activity.subject || '').toLowerCase().includes(searchLower) ||
      (activity.description || '').toLowerCase().includes(searchLower) ||
      (activity.lead_name || '').toLowerCase().includes(searchLower) ||
      (activity.contact_name || '').toLowerCase().includes(searchLower) ||
      (activity.type || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <Helmet>
        <title>{t('admin.crm.activities.title') || 'Activités'} | IGV CRM</title>
        <html lang={i18n.language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-600" />
                  {t('admin.crm.activities.title') || 'Activités'}
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredActivities.length} {t('admin.crm.activities.count') || 'activités'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchActivities}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('admin.crm.common.refresh') || 'Actualiser'}
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  {t('admin.crm.activities.add') || 'Ajouter une activité'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-4 overflow-x-auto">
              {[
                { id: 'all', label: t('admin.crm.activities.tabs.all') || 'Toutes' },
                { id: 'call', label: t('admin.crm.activities.tabs.calls') || 'Appels' },
                { id: 'meeting', label: t('admin.crm.activities.tabs.meetings') || 'Réunions' },
                { id: 'task', label: t('admin.crm.activities.tabs.tasks') || 'Tâches' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('admin.crm.common.search') || 'Rechercher...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full max-w-md"
            />
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 pb-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">{t('admin.crm.activities.empty') || 'Aucune activité'}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('admin.crm.activities.columns.type') || 'Type'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('admin.crm.activities.columns.subject') || 'Sujet'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('admin.crm.activities.columns.related') || 'Lié à'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('admin.crm.activities.columns.due_date') || 'Date limite'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('admin.crm.activities.columns.status') || 'Statut'}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                      {t('admin.crm.common.actions') || 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredActivities.map((activity) => {
                    const TypeIcon = getTypeIcon(activity.type);
                    const overdue = isOverdue(activity.due_date, activity.status);
                    
                    return (
                      <tr key={activity._id || activity.activity_id || activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{getTypeLabel(activity.type)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{getDisplaySubject(activity)}</p>
                          {activity.notes && activity.type !== 'note' && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">{activity.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {activity.lead_id && activity.lead_name ? (
                            <button
                              onClick={() => navigate(`/admin/crm/leads?selected=${activity.lead_id}`)}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {activity.lead_name}
                            </button>
                          ) : activity.contact_id && activity.contact_name ? (
                            <button
                              onClick={() => navigate(`/admin/crm/contacts?selected=${activity.contact_id}`)}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {activity.contact_name}
                            </button>
                          ) : activity.lead_id ? (
                            <button
                              onClick={() => navigate(`/admin/crm/leads?selected=${activity.lead_id}`)}
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Prospect #{activity.lead_id.slice(0, 8)}
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={overdue ? 'text-red-600 font-medium' : ''}>
                            {activity.due_date
                              ? new Date(activity.due_date).toLocaleDateString()
                              : activity.created_at
                                ? new Date(activity.created_at).toLocaleDateString()
                                : '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(activity.status)}`}>
                            {getStatusLabel(activity.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {activity.status !== 'completed' && (
                              <button
                                onClick={() => handleComplete(activity._id || activity.activity_id || activity.id)}
                                className="p-2 hover:bg-green-50 rounded-lg"
                                title={t('admin.crm.activities.complete') || 'Terminer'}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(activity._id || activity.activity_id || activity.id)}
                              className="p-2 hover:bg-red-50 rounded-lg"
                              title={t('admin.crm.common.delete') || 'Supprimer'}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* Add Activity Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">{t('admin.crm.activities.add') || 'Ajouter une activité'}</h3>
              <form onSubmit={handleAddActivity} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.crm.activities.columns.type') || 'Type'}
                  </label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="call">{t('admin.crm.activities.types.call') || 'Appel'}</option>
                    <option value="meeting">{t('admin.crm.activities.types.meeting') || 'Réunion'}</option>
                    <option value="email">{t('admin.crm.activities.types.email') || 'Email'}</option>
                    <option value="task">{t('admin.crm.activities.types.task') || 'Tâche'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.crm.activities.columns.subject') || 'Sujet'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newActivity.subject}
                    onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.crm.activities.columns.due_date') || 'Date limite'}
                  </label>
                  <input
                    type="datetime-local"
                    value={newActivity.due_date}
                    onChange={(e) => setNewActivity({...newActivity, due_date: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {t('admin.crm.activities.columns.notes') || 'Notes'}
                  </label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {t('admin.crm.common.cancel') || 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {t('admin.crm.common.create') || 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ActivitiesPage;
