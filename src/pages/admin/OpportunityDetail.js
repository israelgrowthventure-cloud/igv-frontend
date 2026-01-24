import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Target, User, Building2, Calendar, DollarSign, Percent,
  MessageSquare, Activity, Mail, Plus, Send, Loader2, Edit2, Save, X,
  Clock, CheckCircle, AlertCircle, Phone, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * OpportunityDetail - Fiche opportunité complète
 * Affiche: montant, probabilité, étape pipeline, contact lié, notes, activités, emails
 */
const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  
  const [opportunity, setOpportunity] = useState(null);
  const [contact, setContact] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);
  
  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // New note
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  
  // Pipeline stages
  const [stages, setStages] = useState([]);

  const isRTL = i18n.language === 'he';
  const isUserAdmin = isAdmin && isAdmin();

  useEffect(() => {
    loadOpportunity();
    loadStages();
  }, [id]);

  const loadOpportunity = async () => {
    try {
      setLoading(true);
      const [oppData, notesData, activitiesData] = await Promise.all([
        api.get(`/api/crm/opportunities/${id}`),
        api.get(`/api/crm/opportunities/${id}/notes`).catch(() => ({ notes: [] })),
        api.get(`/api/crm/opportunities/${id}/activities`).catch(() => ({ activities: [] }))
      ]);
      
      setOpportunity(oppData);
      setEditForm({
        name: oppData.name || '',
        amount: oppData.amount || 0,
        probability: oppData.probability || 0,
        stage: oppData.stage || 'qualification',
        expected_close_date: oppData.expected_close_date?.split('T')[0] || '',
        description: oppData.description || ''
      });
      setNotes(notesData.notes || notesData || []);
      setActivities(activitiesData.activities || activitiesData || []);
      
      // Load linked contact if exists
      if (oppData.contact_id) {
        try {
          const contactData = await api.get(`/api/crm/contacts/${oppData.contact_id}`);
          setContact(contactData);
        } catch (e) {
          console.log('Contact not found');
        }
      }
    } catch (error) {
      console.error('Error loading opportunity:', error);
      toast.error(t('crm.errors.load_failed') || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadStages = async () => {
    try {
      const data = await api.get('/api/crm/settings/pipeline-stages');
      setStages(data.stages || data || []);
    } catch (e) {
      // Default stages
      setStages([
        { id: 'qualification', name: 'Qualification', probability: 10 },
        { id: 'proposal', name: 'Proposition', probability: 30 },
        { id: 'negotiation', name: 'Négociation', probability: 60 },
        { id: 'closing', name: 'Closing', probability: 80 },
        { id: 'won', name: 'Gagné', probability: 100 },
        { id: 'lost', name: 'Perdu', probability: 0 }
      ]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put(`/api/crm/opportunities/${id}`, editForm);
      toast.success(t('crm.opportunities.updated') || 'Opportunité mise à jour');
      setIsEditing(false);
      loadOpportunity();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      setAddingNote(true);
      await api.post(`/api/crm/opportunities/${id}/notes`, { content: newNote });
      toast.success(t('crm.notes.added') || 'Note ajoutée');
      setNewNote('');
      loadOpportunity();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleStageChange = async (newStage) => {
    try {
      await api.put(`/api/crm/opportunities/${id}`, { stage: newStage });
      toast.success(`Étape changée: ${newStage}`);
      loadOpportunity();
    } catch (error) {
      toast.error('Erreur lors du changement d\'étape');
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      qualification: 'bg-blue-100 text-blue-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closing: 'bg-purple-100 text-purple-800',
      won: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Opportunité non trouvée</h2>
          <button onClick={() => navigate('/admin/crm/opportunities')} className="mt-4 text-blue-600 hover:underline">
            Retour aux opportunités
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', icon: Target, label: 'Détails' },
    { id: 'notes', icon: MessageSquare, label: `Notes (${notes.length})` },
    { id: 'activities', icon: Activity, label: `Activités (${activities.length})` },
    { id: 'emails', icon: Mail, label: 'Emails' }
  ];

  return (
    <>
      <Helmet>
        <title>{opportunity.name} | Opportunité | IGV CRM</title>
        <html lang={i18n.language} dir={isRTL ? 'rtl' : 'ltr'} />
      </Helmet>

      <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <header className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/admin/crm/opportunities')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{opportunity.name}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(opportunity.stage)}`}>
                      {opportunity.stage}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {opportunity.amount?.toLocaleString()} € • {opportunity.probability}% probabilité
                  </p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Enregistrer
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Détails de l'opportunité
                  </h2>
                  
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={(e) => setEditForm({...editForm, amount: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Probabilité (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editForm.probability}
                          onChange={(e) => setEditForm({...editForm, probability: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Étape</label>
                        <select
                          value={editForm.stage}
                          onChange={(e) => setEditForm({...editForm, stage: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de closing estimée</label>
                        <input
                          type="date"
                          value={editForm.expected_close_date}
                          onChange={(e) => setEditForm({...editForm, expected_close_date: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Montant</p>
                          <p className="font-semibold">{opportunity.amount?.toLocaleString()} €</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Percent className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Probabilité</p>
                          <p className="font-semibold">{opportunity.probability}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date closing estimée</p>
                          <p className="font-semibold">
                            {opportunity.expected_close_date 
                              ? new Date(opportunity.expected_close_date).toLocaleDateString() 
                              : 'Non définie'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Créée le</p>
                          <p className="font-semibold">
                            {opportunity.created_at 
                              ? new Date(opportunity.created_at).toLocaleDateString() 
                              : '-'}
                          </p>
                        </div>
                      </div>
                      {opportunity.description && (
                        <div className="md:col-span-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Description</p>
                          <p>{opportunity.description}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Pipeline Stage Progress */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Progression Pipeline</h3>
                    <div className="flex gap-2 flex-wrap">
                      {stages.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => handleStageChange(stage.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            opportunity.stage === stage.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {stage.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Notes
                  </h2>
                  
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="mb-6">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Ajouter une note..."
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                    <button
                      type="submit"
                      disabled={addingNote || !newNote.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {addingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Ajouter
                    </button>
                  </form>
                  
                  {/* Notes List */}
                  <div className="space-y-4">
                    {notes.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Aucune note</p>
                    ) : notes.map((note, idx) => (
                      <div key={note.id || idx} className="p-4 bg-gray-50 rounded-lg">
                        <p className="whitespace-pre-wrap">{note.content || note.note_text}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {note.author || 'Anonyme'} • {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Historique d'activités
                  </h2>
                  
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Aucune activité</p>
                    ) : activities.map((activity, idx) => (
                      <div key={activity.id || idx} className="flex items-start gap-3 p-3 border-l-2 border-blue-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action || activity.type}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {activity.created_at ? new Date(activity.created_at).toLocaleString() : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Emails Tab */}
              {activeTab === 'emails' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Emails
                  </h2>
                  <p className="text-center text-gray-500 py-8">
                    Les emails sont liés au contact associé.
                    {contact && (
                      <Link to={`/admin/crm/contacts/${contact._id || contact.id}`} className="block mt-2 text-blue-600 hover:underline">
                        Voir les emails du contact
                      </Link>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact lié
                </h3>
                {contact ? (
                  <div className="space-y-3">
                    <p className="font-medium text-lg">{contact.name || `${contact.first_name} ${contact.last_name}`}</p>
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="w-4 h-4" />
                        {contact.company}
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    )}
                    <Link
                      to={`/admin/crm/contacts/${contact._id || contact.id}`}
                      className="block mt-4 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Voir le contact
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p>Aucun contact lié</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Résumé</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valeur pondérée</span>
                    <span className="font-semibold">
                      {((opportunity.amount || 0) * (opportunity.probability || 0) / 100).toLocaleString()} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes</span>
                    <span className="font-semibold">{notes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Activités</span>
                    <span className="font-semibold">{activities.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OpportunityDetail;
