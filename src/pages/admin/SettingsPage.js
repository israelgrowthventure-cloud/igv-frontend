import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { 
  Settings, Users, Tag, Layers, Save, Loader2, Plus, Trash2, Edit2, X, Check,
  Send, BarChart3, AlertTriangle, User, Lock, Mail, ClipboardList, Target, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [stages, setStages] = useState([]);
  const [dispatch, setDispatch] = useState({ unassigned_leads: [], commercials: [] });
  const [quality, setQuality] = useState({ duplicates: [], incomplete: [] });
  const [performance, setPerformance] = useState({});
  const [templates, setTemplates] = useState([]);
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    language: i18n.language,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // New user form
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    role: 'commercial',
    language: 'fr'
  });
  const [showNewUser, setShowNewUser] = useState(false);
  
  // Form states
  const [newTag, setNewTag] = useState({ name: '', color: '#3B82F6' });
  const [editingTag, setEditingTag] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [newStage, setNewStage] = useState({ 
    id: '', 
    name: '', 
    order: 0, 
    color: '#3B82F6',
    probability: 0 
  });

  const isRTL = i18n.language === 'he';
  const isUserAdmin = isAdmin && isAdmin();

  // Define tabs based on role
  const adminTabs = [
    { id: 'profile', icon: User, label: t('crm.settings.tabs.profile') || 'Mon Profil' },
    { id: 'users', icon: Users, label: t('crm.settings.tabs.users') || 'Utilisateurs' },
    { id: 'dispatch', icon: Send, label: t('crm.settings.tabs.dispatch') || 'Dispatch Leads' },
    { id: 'tags', icon: Tag, label: t('crm.settings.tabs.tags') || 'Tags' },
    { id: 'stages', icon: Layers, label: t('crm.settings.tabs.stages') || 'Pipeline' },
    { id: 'templates', icon: Mail, label: t('crm.settings.tabs.templates') || 'Templates Email' },
    { id: 'quality', icon: AlertTriangle, label: t('crm.settings.tabs.quality') || 'Qualité' },
    { id: 'performance', icon: BarChart3, label: t('crm.settings.tabs.performance') || 'Performance' }
  ];

  const commercialTabs = [
    { id: 'profile', icon: User, label: t('crm.settings.tabs.profile') || 'Mon Profil' },
    { id: 'activity', icon: ClipboardList, label: t('crm.settings.tabs.activity') || 'Mon Activité' }
  ];

  const tabs = isUserAdmin ? adminTabs : commercialTabs;

  useEffect(() => {
    fetchSettingsData();
  }, [activeTab]);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'users' && isUserAdmin) {
        const res = await api.get('/api/admin/users');
        setUsers(res?.users || res || []);
      } else if (activeTab === 'tags') {
        const res = await api.get('/api/crm/settings/tags');
        setTags(res?.tags || res || []);
      } else if (activeTab === 'stages' && isUserAdmin) {
        const res = await api.get('/api/crm/settings/pipeline-stages');
        setStages(res?.stages || res || []);
      } else if (activeTab === 'dispatch' && isUserAdmin) {
        const res = await api.get('/api/crm/settings/dispatch');
        setDispatch(res || { unassigned_leads: [], commercials: [] });
      } else if (activeTab === 'quality' && isUserAdmin) {
        const res = await api.get('/api/crm/settings/quality');
        setQuality(res || { duplicates: [], incomplete: [] });
      } else if (activeTab === 'performance' && isUserAdmin) {
        const res = await api.get('/api/crm/settings/performance');
        setPerformance(res || {});
      } else if (activeTab === 'templates' && isUserAdmin) {
        const res = await api.get('/api/crm/emails/templates');
        setTemplates(res?.templates || res || []);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Profile update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast.error(t('crm.settings.profile.password_mismatch') || 'Passwords do not match');
      return;
    }
    try {
      setSaving(true);
      await api.put('/api/admin/profile', {
        name: profileForm.name,
        phone: profileForm.phone,
        language: profileForm.language
      });
      if (profileForm.newPassword) {
        await api.post('/api/admin/change-password', {
          current_password: profileForm.currentPassword,
          new_password: profileForm.newPassword
        });
      }
      toast.success(t('crm.settings.profile.updated') || 'Profile updated');
      i18n.changeLanguage(profileForm.language);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Create user handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/api/admin/users', newUser);
      toast.success(t('crm.settings.users.created') || 'User created');
      setNewUser({ email: '', name: '', password: '', role: 'commercial', language: 'fr' });
      setShowNewUser(false);
      fetchSettingsData();
    } catch (error) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (email) => {
    if (!window.confirm(t('crm.settings.users.delete_confirm') || 'Delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${email}`);
      toast.success(t('crm.settings.users.deleted') || 'User deleted');
      fetchSettingsData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Assign lead handler (dispatch)
  const handleAssignLead = async (leadId, commercialEmail) => {
    try {
      await api.post(`/api/crm/leads/${leadId}/assign`, { commercial_email: commercialEmail });
      toast.success(t('crm.leads.assigned') || 'Lead assigned');
      fetchSettingsData();
    } catch (error) {
      toast.error('Failed to assign lead');
    }
  };

  // Users
  const handleToggleUserStatus = async (email, isActive) => {
    try {
      await api.put(`/api/admin/users/${email}`, { 
        is_active: !isActive 
      });
      toast.success(t('crm.settings.users.updated') || 'User updated');
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.users.errors.update_failed') || 'Failed to update user');
    }
  };

  // Tags
  const handleAddTag = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/crm/settings/tags', newTag);
      toast.success(t('crm.settings.tags.created') || 'Tag created');
      setNewTag({ name: '', color: '#3B82F6' });
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.tags.errors.create_failed') || 'Failed to create tag');
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm(t('crm.settings.tags.delete_confirm') || 'Delete this tag?')) return;
    try {
      await api.delete(`/api/crm/settings/tags/${tagId}`);
      toast.success(t('crm.settings.tags.deleted') || 'Tag deleted');
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.tags.errors.delete_failed') || 'Failed to delete tag');
    }
  };

  // Stages
  const handleAddStage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/crm/settings/pipeline-stages', newStage);
      toast.success(t('crm.settings.stages.created') || 'Stage created');
      setNewStage({ id: '', name: '', order: stages.length, color: '#3B82F6', probability: 0 });
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.stages.errors.create_failed') || 'Failed to create stage');
    }
  };

  const handleUpdateStage = async (stageId, data) => {
    try {
      await api.put(`/api/crm/settings/pipeline-stages/${stageId}`, data);
      toast.success(t('crm.settings.stages.updated') || 'Stage updated');
      setEditingStage(null);
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.stages.errors.update_failed') || 'Failed to update stage');
    }
  };

  const handleDeleteStage = async (stageId) => {
    if (!window.confirm(t('crm.settings.stages.delete_confirm') || 'Delete this stage?')) return;
    try {
      await api.delete(`/api/crm/settings/pipeline-stages/${stageId}`);
      toast.success(t('crm.settings.stages.deleted') || 'Stage deleted');
      fetchSettingsData();
    } catch (error) {
      toast.error(t('crm.settings.stages.errors.delete_failed') || 'Failed to delete stage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('crm.settings.title') || 'Settings'} | IGV CRM</title>
        <html lang={i18n.language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="w-6 h-6 text-gray-600" />
                {t('crm.settings.title') || 'Settings'}
              </h1>
              <p className="text-sm text-gray-600">
                {t('crm.settings.subtitle') || 'Manage users, tags, and pipeline stages'}
              </p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-2 overflow-x-auto py-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('crm.settings.users.columns.name') || 'Name'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('crm.settings.users.columns.email') || 'Email'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('crm.settings.users.columns.role') || 'Role'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('crm.settings.users.columns.status') || 'Status'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {t('crm.settings.users.columns.created') || 'Created'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id || user.user_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {t(`admin.roles.${user.role}`, user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          className={`px-3 py-1 rounded text-xs font-semibold ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {user.status === 'active' ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div className="space-y-6">
              {/* Add Tag Form */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">{t('crm.settings.tags.add') || 'Add Tag'}</h3>
                <form onSubmit={handleAddTag} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('crm.settings.tags.columns.name') || 'Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTag.name}
                      onChange={(e) => setNewTag({...newTag, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Tag name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('crm.settings.tags.columns.color') || 'Color'}
                    </label>
                    <input
                      type="color"
                      value={newTag.color}
                      onChange={(e) => setNewTag({...newTag, color: e.target.value})}
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('crm.common.add') || 'Add'}
                  </button>
                </form>
              </div>

              {/* Tags List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {t('crm.settings.tags.columns.name') || 'Name'}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {t('crm.settings.tags.columns.color') || 'Color'}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {t('crm.settings.tags.columns.count') || 'Usage Count'}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                        {t('crm.common.actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tags.map((tag) => (
                      <tr key={tag.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span 
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className="inline-block px-2 py-1 rounded text-xs font-mono"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
                            {tag.color}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {tag.usage_count || 0}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stages Tab */}
          {activeTab === 'stages' && (
            <div className="space-y-6">
              {/* Add Stage Form */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">{t('crm.settings.stages.add') || 'Add Stage'}</h3>
                <form onSubmit={handleAddStage} className="flex gap-4 items-end flex-wrap">
                  <div className="w-32">
                    <label className="block text-sm text-gray-600 mb-1">ID</label>
                    <input
                      type="text"
                      required
                      value={newStage.id}
                      onChange={(e) => setNewStage({...newStage, id: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                      className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                      placeholder="stage_id"
                    />
                  </div>
                  <div className="flex-1 min-w-48">
                    <label className="block text-sm text-gray-600 mb-1">
                      {t('crm.settings.stages.columns.name') || 'Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newStage.name}
                      onChange={(e) => setNewStage({...newStage, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Stage name"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm text-gray-600 mb-1">Order</label>
                    <input
                      type="number"
                      value={newStage.order}
                      onChange={(e) => setNewStage({...newStage, order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm text-gray-600 mb-1">Prob %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newStage.probability}
                      onChange={(e) => setNewStage({...newStage, probability: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Color</label>
                    <input
                      type="color"
                      value={newStage.color}
                      onChange={(e) => setNewStage({...newStage, color: e.target.value})}
                      className="w-12 h-10 border rounded cursor-pointer"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('crm.common.add') || 'Add'}
                  </button>
                </form>
              </div>

              {/* Stages List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {t('crm.settings.stages.columns.name') || 'Name'}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Probability</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Color</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                        {t('crm.common.actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[...stages].sort((a, b) => a.order - b.order).map((stage) => (
                      <tr key={stage.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">{stage.order}</td>
                        <td className="px-4 py-3 font-mono text-sm text-gray-500">{stage.id}</td>
                        <td className="px-4 py-3 font-medium">
                          {editingStage === stage.id ? (
                            <input
                              type="text"
                              defaultValue={stage.name}
                              id={`stage-name-${stage.id}`}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            <span 
                              className="inline-block w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: stage.color }}
                            />
                          )}
                          {editingStage === stage.id ? stage.id : stage.name}
                        </td>
                        <td className="px-4 py-3">
                          {editingStage === stage.id ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={stage.probability}
                              id={`stage-prob-${stage.id}`}
                              className="w-20 px-2 py-1 border rounded"
                            />
                          ) : (
                            `${stage.probability}%`
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span 
                            className="inline-block px-2 py-1 rounded text-xs font-mono"
                            style={{ backgroundColor: stage.color + '20', color: stage.color }}
                          >
                            {stage.color}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {editingStage === stage.id ? (
                              <>
                                <button
                                  onClick={() => {
                                    handleUpdateStage(stage.id, {
                                      name: document.getElementById(`stage-name-${stage.id}`).value,
                                      probability: parseInt(document.getElementById(`stage-prob-${stage.id}`).value)
                                    });
                                  }}
                                  className="p-2 hover:bg-green-50 rounded-lg"
                                >
                                  <Check className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => setEditingStage(null)}
                                  className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <X className="w-4 h-4 text-gray-600" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setEditingStage(stage.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit2 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStage(stage.id)}
                                  className="p-2 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== PROFILE TAB ========== */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('crm.settings.profile.title') || 'Mon Profil'}
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('crm.settings.profile.name') || 'Nom'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('crm.settings.profile.language') || 'Langue'}
                    </label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({...profileForm, language: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="he">עברית</option>
                    </select>
                  </div>
                  
                  <hr className="my-4" />
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t('crm.settings.profile.change_password') || 'Changer le mot de passe'}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('crm.settings.profile.current_password') || 'Mot de passe actuel'}
                    </label>
                    <input
                      type="password"
                      value={profileForm.currentPassword}
                      onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('crm.settings.profile.new_password') || 'Nouveau mot de passe'}
                      </label>
                      <input
                        type="password"
                        value={profileForm.newPassword}
                        onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('crm.settings.profile.confirm_password') || 'Confirmer'}
                      </label>
                      <input
                        type="password"
                        value={profileForm.confirmPassword}
                        onChange={(e) => setProfileForm({...profileForm, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {t('crm.common.save') || 'Enregistrer'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========== DISPATCH TAB (Admin only) ========== */}
          {activeTab === 'dispatch' && isUserAdmin && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Send className="w-5 h-5" />
                {t('crm.settings.dispatch.title') || 'Distribution des Prospects'}
              </h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Leads non assignés</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {dispatch.unassigned_leads?.length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Commerciaux actifs</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {dispatch.commercials?.length || 0}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Assignations ce mois</p>
                  <p className="text-3xl font-bold text-green-600">
                    {dispatch.assignments_this_month || 0}
                  </p>
                </div>
              </div>

              {/* Unassigned Leads */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-semibold">Leads à assigner</h3>
                  <button onClick={fetchSettingsData} className="p-2 hover:bg-gray-100 rounded">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                {dispatch.unassigned_leads?.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>Tous les leads sont assignés!</p>
                  </div>
                ) : (
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {dispatch.unassigned_leads?.map((lead) => (
                      <div key={lead.id || lead._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{lead.brand_name || lead.email}</p>
                          <p className="text-sm text-gray-500">{lead.email} • {lead.source || 'N/A'}</p>
                        </div>
                        <select
                          onChange={(e) => e.target.value && handleAssignLead(lead.id || lead._id, e.target.value)}
                          className="px-3 py-2 border rounded-lg text-sm"
                          defaultValue=""
                        >
                          <option value="">Assigner à...</option>
                          {dispatch.commercials?.map((c) => (
                            <option key={c.email} value={c.email}>{c.name || c.email}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== TEMPLATES TAB (Admin only) ========== */}
          {activeTab === 'templates' && isUserAdmin && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t('crm.settings.templates.title', 'Email Templates')}
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('crm.settings.users.columns.name', 'Name')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('crm.settings.templates.category', 'Category')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('crm.settings.templates.languages', 'Languages')}</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('crm.settings.users.columns.status', 'Status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {templates.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-gray-500">{t('crm.settings.templates.no_templates', 'No templates')}</td></tr>
                    ) : templates.map((tpl) => (
                      <tr key={tpl.id || tpl.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{tpl.name}</td>
                        <td className="px-4 py-3 text-sm">{tpl.category || 'General'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {(tpl.languages || ['fr']).map((lang) => (
                              <span key={lang} className="px-2 py-1 bg-gray-100 text-xs rounded">{lang.toUpperCase()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${tpl.active !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {tpl.active !== false ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== QUALITY TAB (Admin only) ========== */}
          {activeTab === 'quality' && isUserAdmin && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t('crm.quality.title', 'Data Quality')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-medium mb-2 text-orange-600">{t('crm.quality.duplicates', 'Potential Duplicates')}</h3>
                  <p className="text-3xl font-bold">{quality.duplicates?.length || 0}</p>
                  <p className="text-sm text-gray-500">{t('crm.quality.duplicates_desc', 'Leads with same email')}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-medium mb-2 text-yellow-600">{t('crm.quality.incomplete', 'Incomplete Data')}</h3>
                  <p className="text-3xl font-bold">{quality.incomplete?.length || 0}</p>
                  <p className="text-sm text-gray-500">{t('crm.quality.incomplete_desc', 'Leads without phone or name')}</p>
                </div>
              </div>

              {quality.duplicates?.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-3 border-b">
                    <h3 className="font-semibold">{t('crm.quality.duplicates_detected', 'Duplicates Detected')}</h3>
                  </div>
                  <div className="divide-y max-h-64 overflow-y-auto">
                    {quality.duplicates?.slice(0, 10).map((dup, idx) => (
                      <div key={idx} className="p-4">
                        <p className="font-medium">{dup.email}</p>
                        <p className="text-sm text-gray-500">{dup.count} {t('crm.quality.occurrences', 'occurrences')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== PERFORMANCE TAB (Admin only) ========== */}
          {activeTab === 'performance' && isUserAdmin && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Suivi Performance
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Leads ce mois</p>
                  <p className="text-3xl font-bold text-blue-600">{performance.leads_this_month || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Convertis</p>
                  <p className="text-3xl font-bold text-green-600">{performance.leads_converted || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Taux conversion</p>
                  <p className="text-3xl font-bold text-purple-600">{performance.conversion_rate || 0}%</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Opportunités</p>
                  <p className="text-3xl font-bold text-orange-600">{performance.opportunities_count || 0}</p>
                </div>
              </div>

              {performance.by_commercial && performance.by_commercial.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                  <div className="px-4 py-3 border-b">
                    <h3 className="font-semibold">Performance par Commercial</h3>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Commercial</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Leads assignés</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Convertis</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Taux</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {performance.by_commercial?.map((c) => (
                        <tr key={c.email} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{c.name || c.email}</td>
                          <td className="px-4 py-3">{c.leads || 0}</td>
                          <td className="px-4 py-3">{c.converted || 0}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {c.rate || 0}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========== ACTIVITY TAB (Commercial only) ========== */}
          {activeTab === 'activity' && !isUserAdmin && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Mon Activité
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Mes leads assignés</p>
                  <p className="text-3xl font-bold text-blue-600">-</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Mes opportunités</p>
                  <p className="text-3xl font-bold text-green-600">-</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                  <p className="text-sm text-gray-600">Tâches en attente</p>
                  <p className="text-3xl font-bold text-orange-600">-</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Accédez à vos leads et opportunités via le menu principal</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default SettingsPage;
