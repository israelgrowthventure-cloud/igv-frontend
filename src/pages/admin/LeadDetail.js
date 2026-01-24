import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Mail, Phone, Building, MapPin, Save, Trash2, 
  Loader2, Edit2, X, UserPlus, MessageSquare, TrendingUp, DollarSign, Users,
  Activity, Clock, Send, FileText, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import NextActionWidget from '../../components/crm/NextActionWidget';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [noteText, setNoteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showOppModal, setShowOppModal] = useState(false);
  const [oppForm, setOppForm] = useState({ name: '', value: '', probability: 50, stage: 'qualification' });
  // Assignment modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [commercials, setCommercials] = useState([]);
  const [selectedCommercial, setSelectedCommercial] = useState('');
  
  // Tab system
  const [activeTab, setActiveTab] = useState('details');
  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ type: 'call', description: '' });
  // Emails state  
  const [emails, setEmails] = useState([]);
  const [emailsLoading, setEmailsLoading] = useState(false);

  const isRTL = i18n.language === 'he';
  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST', 'PENDING_QUOTA'];
  const priorities = ['A', 'B', 'C'];

  useEffect(() => {
    fetchLead();
    if (isAdmin()) {
      fetchCommercials();
    }
  }, [id]);

  // Fetch commercials list for assignment
  const fetchCommercials = async () => {
    try {
      const response = await api.get('/api/admin/users');
      const users = response?.users || response || [];
      setCommercials(users.filter(u => u.role === 'commercial'));
    } catch (error) {
      console.error('Error fetching commercials:', error);
    }
  };

  // Fetch notes separately via dedicated API endpoint
  useEffect(() => {
    if (lead && lead.lead_id) {
      fetchNotes();
    }
  }, [lead]);

  // Fetch activities when tab is selected
  useEffect(() => {
    if (activeTab === 'activities' && lead && lead.lead_id) {
      fetchActivities();
    }
  }, [activeTab, lead]);

  // Fetch emails when tab is selected
  useEffect(() => {
    if (activeTab === 'emails' && lead && lead.lead_id) {
      fetchEmails();
    }
  }, [activeTab, lead]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/crm/leads/${id}`);
      setLead(response);
      setEditData(response);
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error(t('crm.errors.load_failed') || 'Failed to load lead');
      navigate('/admin/crm/leads');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes via dedicated API endpoint (Action 2 fix)
  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      const response = await api.get(`/api/crm/leads/${id}/notes`);
      setNotes(response?.notes || response || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Don't show error toast for notes - not critical
    } finally {
      setNotesLoading(false);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await api.get(`/api/crm/leads/${id}/activities`);
      setActivities(response?.activities || response || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fetch emails
  const fetchEmails = async () => {
    try {
      setEmailsLoading(true);
      const response = await api.get(`/api/crm/leads/${id}/emails`);
      setEmails(response?.emails || response || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setEmails([]);
    } finally {
      setEmailsLoading(false);
    }
  };

  // Add activity
  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityForm.description.trim()) return;
    try {
      setSaving(true);
      await api.post(`/api/crm/leads/${id}/activities`, activityForm);
      toast.success(t('crm.activities.added') || 'Activity added');
      setShowActivityModal(false);
      setActivityForm({ type: 'call', description: '' });
      fetchActivities();
    } catch (error) {
      toast.error(t('crm.errors.activity_failed') || 'Failed to add activity');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/crm/leads/${id}`, editData);
      toast.success(t('crm.leads.updated') || 'Lead updated successfully');
      setLead(editData);
      setEditing(false);
    } catch (error) {
      toast.error(t('crm.errors.update_failed') || 'Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      await api.delete(`/api/crm/leads/${id}`);
      toast.success(t('crm.leads.deleted') || 'Lead deleted successfully');
      navigate('/admin/crm/leads');
    } catch (error) {
      toast.error(t('crm.errors.delete_failed') || 'Failed to delete lead');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      setSaving(true);
      await api.post(`/api/crm/leads/${id}/notes`, { note_text: noteText });
      toast.success(t('crm.leads.note_added') || 'Note added');
      setNoteText('');
      // P0-002 FIX: Call fetchNotes directly instead of fetchLead to ensure notes are refreshed
      // fetchLead triggers useEffect which may not always re-fetch notes due to object reference comparison
      await fetchNotes();
    } catch (error) {
      toast.error(t('crm.errors.note_failed') || 'Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToContact = async () => {
    try {
      setSaving(true);
      await api.post(`/api/crm/leads/${id}/convert-to-contact`);
      toast.success(t('crm.leads.converted') || 'Lead converted to contact');
      navigate('/admin/crm/leads');
    } catch (error) {
      toast.error(t('crm.errors.convert_failed') || 'Failed to convert lead');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/api/crm/opportunities', {
        name: oppForm.name || `${lead.brand_name} - Opportunity`,
        lead_id: id,
        value: parseFloat(oppForm.value) || 0,
        probability: parseInt(oppForm.probability) || 50,
        stage: oppForm.stage || 'qualification'
      });
      toast.success(t('crm.opportunities.created') || 'Opportunity created');
      setShowOppModal(false);
      setOppForm({ name: '', value: '', probability: 50, stage: 'qualification' });
      navigate('/admin/crm/leads');
    } catch (error) {
      toast.error(t('crm.errors.create_failed') || 'Failed to create opportunity');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignCommercial = async () => {
    if (!selectedCommercial) return;
    try {
      setSaving(true);
      await api.post(`/api/crm/leads/${id}/assign`, { commercial_email: selectedCommercial });
      toast.success(t('crm.leads.assigned') || 'Lead assigned successfully');
      setShowAssignModal(false);
      setSelectedCommercial('');
      fetchLead(); // Reload to show updated assignment
    } catch (error) {
      toast.error(t('crm.errors.assign_failed') || 'Failed to assign lead');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{t('crm.leads.not_found') || 'Lead not found'}</p>
          <button onClick={() => navigate('/admin/crm/leads')} className="text-blue-600 hover:underline">
            {t('crm.common.back') || 'Back to CRM'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{lead.contact_name || lead.email} | IGV CRM</title>
        <html lang={i18n.language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/admin/crm/leads')} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{lead.contact_name || lead.email}</h1>
                <p className="text-sm text-gray-600">{lead.brand_name || t('crm.leads.no_brand') || 'No brand'}</p>
              </div>
              <div className="flex items-center gap-2">
                {!editing ? (
                  <>
                    <button 
                      onClick={() => setEditing(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      {t('crm.common.edit') || 'Edit'}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)} 
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t('crm.common.delete') || 'Delete'}
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleSave} 
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {t('crm.common.save') || 'Save'}
                    </button>
                    <button 
                      onClick={() => { setEditing(false); setEditData(lead); }} 
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      {t('crm.common.cancel') || 'Cancel'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow border">
            <div className="flex border-b">
              {[
                { key: 'details', label: t('crm.tabs.details') || 'Details', icon: FileText },
                { key: 'notes', label: t('crm.tabs.notes') || 'Notes', icon: MessageSquare },
                { key: 'activities', label: t('crm.tabs.activities') || 'Activities', icon: Activity },
                { key: 'emails', label: t('crm.tabs.emails') || 'Emails', icon: Mail }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <>
          {/* Next Action Widget - Point 4 Mission */}
          <NextActionWidget leadId={id} lead={lead} onUpdate={fetchLead} />

          {/* Status and Priority */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-semibold mb-4">{t('crm.leads.details.status_priority') || 'Status & Priority'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.leads.columns.status') || 'Status'}</label>
                {editing ? (
                  <select 
                    value={editData.status} 
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {statuses.map(s => <option key={s} value={s}>{t(`crm.statuses.${s}`) || s}</option>)}
                  </select>
                ) : (
                  <StatusBadge status={lead.status} />
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.leads.columns.priority') || 'Priority'}</label>
                {editing ? (
                  <select 
                    value={editData.priority || 'C'} 
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {priorities.map(p => <option key={p} value={p}>{t(`crm.priorities.${p}`) || `Priority ${p}`}</option>)}
                  </select>
                ) : (
                  <PriorityBadge priority={lead.priority} />
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-semibold mb-4">{t('crm.leads.details.contact_info') || 'Contact Information'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('crm.leads.columns.email') || 'Email'}</p>
                    {editing ? (
                      <input 
                        type="email" 
                        value={editData.email || ''} 
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg mt-1"
                      />
                    ) : (
                      <p className="font-medium">{lead.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('crm.leads.phone') || 'Phone'}</p>
                    {editing ? (
                      <input 
                        type="text" 
                        value={editData.phone || ''} 
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg mt-1"
                      />
                    ) : (
                      <p className="font-medium">{lead.phone || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('crm.leads.columns.brand') || 'Brand'}</p>
                    {editing ? (
                      <input 
                        type="text" 
                        value={editData.brand_name || ''} 
                        onChange={(e) => setEditData({...editData, brand_name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg mt-1"
                      />
                    ) : (
                      <p className="font-medium">{lead.brand_name || '-'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t('crm.leads.columns.sector') || 'Sector'}</p>
                    {editing ? (
                      <input 
                        type="text" 
                        value={editData.sector || ''} 
                        onChange={(e) => setEditData({...editData, sector: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg mt-1"
                      />
                    ) : (
                      <p className="font-medium">{lead.sector || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini-Analysis Section */}
          {lead.analysis && lead.analysis.trim() && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md border border-blue-200 p-6">
              <h2 className="font-semibold text-lg text-blue-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('crm.leads.mini_analysis') || 'Mini-Analyse IGV'}
              </h2>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{lead.analysis}</p>
              </div>
              {lead.analysis_meta && (
                <div className="mt-3 text-xs text-blue-700">
                  <p>
                    <strong>{t('crm.leads.generated_on') || 'Générée le'} :</strong>{' '}
                    {new Date(lead.analysis_meta.generated_at).toLocaleString()}
                  </p>
                  {lead.analysis_meta.language && (
                    <p>
                      <strong>{t('crm.leads.language') || 'Langue'} :</strong>{' '}
                      {lead.analysis_meta.language.toUpperCase()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Additional Info */}
          {editing && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="font-semibold mb-4">{t('crm.leads.details.additional') || 'Additional Information'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t('crm.leads.columns.name') || 'Contact Name'}</label>
                  <input 
                    type="text" 
                    value={editData.contact_name || ''} 
                    onChange={(e) => setEditData({...editData, contact_name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t('crm.leads.target_city') || 'Target City'}</label>
                  <input 
                    type="text" 
                    value={editData.target_city || ''} 
                    onChange={(e) => setEditData({...editData, target_city: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Focus Notes */}
          {lead.focus_notes && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h2 className="font-semibold text-blue-900 mb-2">{t('crm.leads.details.focus_notes') || 'Focus Notes'}</h2>
              <p className="text-blue-800">{lead.focus_notes}</p>
            </div>
          )}

          {/* Actions */}
          {!editing && lead.status !== 'CONVERTED' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="font-semibold mb-4">{t('crm.leads.actions') || 'Actions'}</h2>
              <div className="flex flex-wrap gap-3">
                {isAdmin() && (
                  <button 
                    onClick={() => setShowAssignModal(true)} 
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    <Users className="w-4 h-4" />
                    {t('crm.leads.assign_commercial') || 'Assign to Commercial'}
                  </button>
                )}
                <button 
                  onClick={handleConvertToContact} 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('crm.leads.convert_to_contact') || 'Convert to Contact'}
                </button>
                <button 
                  onClick={() => setShowOppModal(true)} 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4" />
                  {t('crm.leads.create_opportunity') || 'Create Opportunity'}
                </button>
              </div>
              {/* Show current assignment */}
              {lead.assigned_to && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>{t('crm.leads.assigned_to') || 'Assigned to'}:</strong> {lead.assigned_to}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="font-medium">{t('crm.common.created') || 'Created'}</p>
                <p>{new Date(lead.created_at).toLocaleString()}</p>
              </div>
              {lead.updated_at && (
                <div>
                  <p className="font-medium">{t('crm.common.updated') || 'Updated'}</p>
                  <p>{new Date(lead.updated_at).toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="font-medium">{t('crm.common.language') || 'Language'}</p>
                <p>{lead.language || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">ID</p>
                <p className="font-mono text-xs">{lead.lead_id}</p>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('crm.leads.details.notes') || 'Notes'}
              </h2>
              {notesLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">{t('crm.common.loading') || 'Loading...'}</span>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {notes && notes.length > 0 ? notes.map((note, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{note.note_text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.created_at).toLocaleString()} • {note.created_by}
                        </p>
                      </div>
                    )) : (
                      <p className="text-gray-500 text-sm">{t('crm.common.no_notes') || 'No notes yet'}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={t('crm.leads.add_note_placeholder') || 'Add a note...'} 
                      value={noteText} 
                      onChange={(e) => setNoteText(e.target.value)} 
                      className="flex-1 px-3 py-2 border rounded-lg" 
                    />
                    <button 
                      onClick={handleAddNote} 
                      disabled={!noteText.trim() || saving} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('crm.common.add') || 'Add'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('crm.leads.activities') || 'Activities'}
                </h2>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  {t('crm.activities.add') || 'Add Activity'}
                </button>
              </div>
              {activitiesLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">{t('crm.common.loading') || 'Loading...'}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities && activities.length > 0 ? activities.map((activity, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          activity.type === 'call' ? 'bg-green-100 text-green-800' :
                          activity.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`crm.activities.types.${activity.type}`) || activity.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('crm.common.by') || 'By'}: {activity.created_by}</p>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t('crm.activities.no_activities') || 'No activities yet'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('crm.leads.emails') || 'Emails'}
                </h2>
                <button
                  onClick={() => navigate(`/admin/crm/emails/compose?lead_id=${id}&email=${lead.email}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  {t('crm.emails.compose') || 'Compose Email'}
                </button>
              </div>
              {emailsLoading ? (
                <div className="flex items-center gap-2 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">{t('crm.common.loading') || 'Loading...'}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {emails && emails.length > 0 ? emails.map((email, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{email.subject}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          email.status === 'sent' ? 'bg-green-100 text-green-800' :
                          email.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          email.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`crm.emails.status.${email.status}`) || email.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{email.body_preview || email.body?.substring(0, 100)}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span><Clock className="w-3 h-3 inline mr-1" />{new Date(email.created_at || email.sent_at).toLocaleString()}</span>
                        <span>{t('crm.emails.to') || 'To'}: {email.to}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{t('crm.emails.no_emails') || 'No emails yet'}</p>
                      <button
                        onClick={() => navigate(`/admin/crm/emails/compose?lead_id=${id}&email=${lead.email}`)}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        {t('crm.emails.send_first') || 'Send your first email'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{t('crm.activities.add_title') || 'Add Activity'}</h3>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.activities.type') || 'Type'}</label>
                <select 
                  value={activityForm.type} 
                  onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="call">{t('crm.activities.types.call') || 'Call'}</option>
                  <option value="email">{t('crm.activities.types.email') || 'Email'}</option>
                  <option value="meeting">{t('crm.activities.types.meeting') || 'Meeting'}</option>
                  <option value="note">{t('crm.activities.types.note') || 'Note'}</option>
                  <option value="task">{t('crm.activities.types.task') || 'Task'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.activities.description') || 'Description'}</label>
                <textarea 
                  value={activityForm.description} 
                  onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                  placeholder={t('crm.activities.description_placeholder') || 'Describe the activity...'}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => { setShowActivityModal(false); setActivityForm({ type: 'call', description: '' }); }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {t('crm.common.cancel') || 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={saving || !activityForm.description.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('crm.common.add') || 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-2">{t('crm.leads.delete_confirm_title') || 'Delete Lead?'}</h3>
            <p className="text-gray-600 mb-4">
              {t('crm.leads.delete_confirm_message') || 'This action cannot be undone. Are you sure you want to delete this lead?'}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                {t('crm.common.cancel') || 'Cancel'}
              </button>
              <button 
                onClick={handleDelete} 
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('crm.common.delete') || 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Opportunity Modal */}
      {showOppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{t('crm.opportunities.new') || 'New Opportunity'}</h3>
            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.opportunities.name') || 'Name'}</label>
                <input 
                  type="text" 
                  value={oppForm.name} 
                  onChange={(e) => setOppForm({...oppForm, name: e.target.value})}
                  placeholder={lead?.brand_name || 'Opportunity name'}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.opportunities.value') || 'Value (€)'}</label>
                <input 
                  type="number" 
                  value={oppForm.value} 
                  onChange={(e) => setOppForm({...oppForm, value: e.target.value})}
                  placeholder="10000"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.opportunities.probability') || 'Probability (%)'}</label>
                <input 
                  type="number" 
                  value={oppForm.probability} 
                  onChange={(e) => setOppForm({...oppForm, probability: e.target.value})}
                  min="0" max="100"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.opportunities.stage') || 'Stage'}</label>
                <select 
                  value={oppForm.stage} 
                  onChange={(e) => setOppForm({...oppForm, stage: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="qualification">{t('crm.opportunities.stages.qualification') || 'Qualification'}</option>
                  <option value="proposal">{t('crm.opportunities.stages.proposal') || 'Proposal'}</option>
                  <option value="negotiation">{t('crm.opportunities.stages.negotiation') || 'Negotiation'}</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setShowOppModal(false)} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {t('crm.common.cancel') || 'Cancel'}
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('crm.common.create') || 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Commercial Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{t('crm.leads.assign_title') || 'Assign Lead to Commercial'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('crm.leads.select_commercial') || 'Select Commercial'}</label>
                <select 
                  value={selectedCommercial} 
                  onChange={(e) => setSelectedCommercial(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">{t('crm.common.select') || 'Select...'}</option>
                  {commercials.map((c) => (
                    <option key={c.email} value={c.email}>{c.name || c.email}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => { setShowAssignModal(false); setSelectedCommercial(''); }} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  {t('crm.common.cancel') || 'Cancel'}
                </button>
                <button 
                  onClick={handleAssignCommercial}
                  disabled={saving || !selectedCommercial}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('crm.common.assign') || 'Assign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-purple-100 text-purple-800',
    CONVERTED: 'bg-green-100 text-green-800',
    LOST: 'bg-gray-100 text-gray-800',
    PENDING_QUOTA: 'bg-orange-100 text-orange-800'
  };
  return <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    A: 'bg-red-100 text-red-800',
    B: 'bg-yellow-100 text-yellow-800',
    C: 'bg-green-100 text-green-800'
  };
  return <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${colors[priority] || 'bg-gray-100 text-gray-800'}`}>Priority {priority || 'C'}</span>;
};

export default LeadDetail;
