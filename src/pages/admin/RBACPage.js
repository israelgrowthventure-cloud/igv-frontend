import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Loader2, Shield, Users, UserCheck, Eye, Edit2, Lock,
  CheckCircle, XCircle, AlertTriangle, Save, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * RBACPage - Gestion des rôles et permissions avancées
 * Point 8 de la mission - RBAC avancé
 */
const RBACPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [customPermissions, setCustomPermissions] = useState({});

  const defaultPermissions = {
    leads: { create: true, read: true, update: true, delete: false },
    contacts: { create: true, read: true, update: true, delete: false },
    companies: { create: true, read: true, update: true, delete: false },
    opportunities: { create: true, read: true, update: true, delete: false },
    activities: { create: true, read: true, update: true, delete: false },
    emails: { create: true, read: true, update: false, delete: false },
    exports: { create: false, read: false, update: false, delete: false },
    admin: { create: false, read: false, update: false, delete: false }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Canonical routes (replaces legacy /api/crm/team and /api/crm/roles)
      const [teamRes, rolesRes] = await Promise.all([
        api.get('/api/crm/settings/users'),
        api.get('/api/crm/rbac/roles')
      ]);
      
      // Normalize team to array (response may have 'users' or 'team' key)
      const teamData = teamRes?.users || teamRes?.team || teamRes?.data?.team || [];
      setTeam(Array.isArray(teamData) ? teamData : []);
      
      // Convert roles object to array for .map() compatibility
      // API returns {roles: {admin: {...}, manager: {...}}} 
      const rolesData = rolesRes?.roles || rolesRes?.data?.roles || {};
      if (typeof rolesData === 'object' && !Array.isArray(rolesData)) {
        // Convert object to array: {admin: {description:...}} → [{name: 'admin', description:...}]
        const rolesArray = Object.entries(rolesData).map(([name, config]) => ({
          name,
          description: config?.description || '',
          permissions: config?.permissions || []
        }));
        setRoles(rolesArray);
      } else if (Array.isArray(rolesData)) {
        setRoles(rolesData);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error loading RBAC data:', error);
      toast.error(t('crm.errors.load_failed', 'Erreur de chargement'));
      setTeam([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/api/crm/users/${userId}/role`, { role: newRole });
      toast.success(t('crm.rbac.role_updated', 'Rôle mis à jour'));
      await loadData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(t('crm.errors.update_failed', 'Erreur de mise à jour'));
    }
  };

  const handleCustomPermissions = async (userId) => {
    try {
      await api.post(`/api/crm/users/${userId}/permissions`, {
        permissions: customPermissions
      });
      toast.success(t('crm.rbac.permissions_updated', 'Permissions mises à jour'));
      setEditingUser(null);
      setCustomPermissions({});
      await loadData();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(t('crm.errors.update_failed', 'Erreur de mise à jour'));
    }
  };

  const startEditPermissions = (member) => {
    setEditingUser(member);
    setCustomPermissions(member.custom_permissions || {});
  };

  const updatePermission = (resource, action, value) => {
    setCustomPermissions(prev => ({
      ...prev,
      [resource]: {
        ...(prev[resource] || defaultPermissions[resource] || {}),
        [action]: value
      }
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-blue-100 text-blue-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'readonly': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      case 'commercial': return 'Commercial';
      case 'support': return 'Support';
      case 'readonly': return 'Lecture seule';
      default: return role;
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
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
            {t('crm.rbac.title', 'Rôles & Permissions')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('crm.rbac.subtitle', 'Gérez les accès de votre équipe')}
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

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(Array.isArray(roles) ? roles : []).map((role) => (
          <div key={role.name} className={`p-4 rounded-lg border ${getRoleColor(role.name).replace('text-', 'border-').replace('100', '200')}`}>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.name)} mb-2`}>
              {getRoleLabel(role.name)}
            </div>
            <p className="text-sm text-gray-600">{role.description || ''}</p>
            <div className="mt-2 text-xs text-gray-500">
              {(Array.isArray(team) ? team : []).filter(m => m.role === role.name).length} utilisateur(s)
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            {t('crm.rbac.team', 'Équipe')} ({team.length})
          </h3>
        </div>

        {team.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{t('crm.rbac.no_team', 'Aucun membre d\'équipe')}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rbac.user', 'Utilisateur')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rbac.role', 'Rôle')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rbac.leads_assigned', 'Leads assignés')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t('crm.rbac.custom_perms', 'Perms. custom')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t('common.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {team.map((member) => (
                <tr key={member._id || member.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-600">
                          {(member.name || member.email || '?')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name || 'Sans nom'}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={member.role || 'commercial'}
                      onChange={(e) => handleRoleChange(member._id || member.email, e.target.value)}
                      disabled={member.email === user?.email}
                      className={`px-2 py-1 rounded-lg text-sm font-medium ${getRoleColor(member.role || 'commercial')} border-0 cursor-pointer disabled:cursor-not-allowed`}
                    >
                      <option value="admin">Administrateur</option>
                      <option value="manager">Manager</option>
                      <option value="commercial">Commercial</option>
                      <option value="support">Support</option>
                      <option value="readonly">Lecture seule</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {member.leads_count || 0}
                  </td>
                  <td className="px-6 py-4">
                    {member.has_custom_permissions ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Oui
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Non</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEditPermissions(member)}
                      disabled={member.email === user?.email}
                      className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50"
                      title="Modifier les permissions"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Permission Matrix Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-purple-600" />
          {t('crm.rbac.permissions_matrix', 'Matrice des permissions par rôle')}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left font-medium text-gray-700">Ressource</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700">Admin</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700">Manager</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700">Commercial</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700">Support</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700">Lecture seule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Leads', admin: 'CRUD', manager: 'CRUD', commercial: 'CRU', support: 'R', readonly: 'R' },
                { name: 'Contacts', admin: 'CRUD', manager: 'CRUD', commercial: 'CRU', support: 'R', readonly: 'R' },
                { name: 'Sociétés', admin: 'CRUD', manager: 'CRUD', commercial: 'CRU', support: 'R', readonly: 'R' },
                { name: 'Opportunités', admin: 'CRUD', manager: 'CRUD', commercial: 'CRU', support: 'R', readonly: 'R' },
                { name: 'Activités', admin: 'CRUD', manager: 'CRUD', commercial: 'CRU', support: 'CR', readonly: 'R' },
                { name: 'Emails', admin: 'CRUD', manager: 'CRU', commercial: 'CR', support: 'R', readonly: '-' },
                { name: 'Exports', admin: '✓', manager: '✓', commercial: '-', support: '-', readonly: '-' },
                { name: 'Admin', admin: '✓', manager: '-', commercial: '-', support: '-', readonly: '-' }
              ].map((row) => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium text-gray-900">{row.name}</td>
                  <td className="py-2 px-3 text-center text-green-600">{row.admin}</td>
                  <td className="py-2 px-3 text-center text-purple-600">{row.manager}</td>
                  <td className="py-2 px-3 text-center text-blue-600">{row.commercial}</td>
                  <td className="py-2 px-3 text-center text-green-600">{row.support}</td>
                  <td className="py-2 px-3 text-center text-gray-400">{row.readonly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          C = Créer, R = Lire, U = Modifier, D = Supprimer
        </p>
      </div>

      {/* Custom Permissions Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('crm.rbac.custom_permissions', 'Permissions personnalisées')}
                </h3>
                <p className="text-sm text-gray-500">{editingUser.name || editingUser.email}</p>
              </div>
              <button
                onClick={() => { setEditingUser(null); setCustomPermissions({}); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Les permissions personnalisées écrasent les permissions du rôle
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(defaultPermissions).map(([resource, actions]) => (
                  <div key={resource} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">{resource}</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(actions).map(([action, defaultValue]) => {
                        const currentValue = customPermissions[resource]?.[action] ?? defaultValue;
                        return (
                          <label key={action} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentValue}
                              onChange={(e) => updatePermission(resource, action, e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{action}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => { setEditingUser(null); setCustomPermissions({}); }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={() => handleCustomPermissions(editingUser._id || editingUser.email)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
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

export default RBACPage;
