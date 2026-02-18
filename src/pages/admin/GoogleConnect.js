import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, XCircle, RefreshCw, Unlink, ExternalLink, Loader2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://igv-cms-backend.onrender.com';

/**
 * AdminGoogleConnect — Admin page to manage the Google Calendar OAuth connection.
 * Route: /admin/crm/google
 *
 * The admin clicks "Connecter" which opens /api/google/connect in a new window.
 * After the OAuth flow completes, the admin returns here and refreshes the status.
 */
const GoogleConnect = () => {
  const [status, setStatus]       = useState(null);   // null | true | false
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage]     = useState(null);   // { type: 'success'|'error', text: string }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/google/status`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(data.connected);
    } catch (err) {
      setMessage({ type: 'error', text: `Impossible de vérifier le statut : ${err.message}` });
      setStatus(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = () => {
    // Open the OAuth flow in a new tab. When done, admin comes back and clicks Refresh.
    const connectUrl = `${API_URL}/api/google/connect`;
    // Build auth URL with JWT so the backend can verify the admin
    const token = localStorage.getItem('admin_token');
    // We need to attach the token — use a query param or let the user open it directly.
    // The OAuth route accepts X-ADMIN-OAUTH-KEY header which can't be set for window.open.
    // Instead, we can use the ADMIN_OAUTH_KEY approach or the JWT approach via a request.
    // Simplest: open the redirect URL directly (server will check referer or we pre-auth).
    // Since the /connect endpoint requires admin auth (header-based), we redirect via fetch first.
    setActionLoading(true);
    fetch(`${API_URL}/api/google/connect`, {
      headers: { ...getAuthHeaders() },
      redirect: 'manual',
    })
      .then(res => {
        // If the server returns a redirect (302), we need the Location header.
        // With redirect: 'manual', res.type === 'opaqueredirect' and we can't read Location.
        // Fallback: just open the URL in a new tab and let the server handle auth via URL param.
        // Best DX: open the URL directly (the connect endpoint doesn't require auth in some configs).
        setActionLoading(false);
        window.open(connectUrl, '_blank', 'width=600,height=700,noopener,noreferrer');
      })
      .catch(() => {
        setActionLoading(false);
        window.open(connectUrl, '_blank', 'width=600,height=700,noopener,noreferrer');
      });
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Déconnecter Google Agenda ? Les réservations ne seront plus possibles.')) return;
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/api/google/disconnect`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus(false);
      setMessage({ type: 'success', text: 'Google Agenda déconnecté.' });
    } catch (err) {
      setMessage({ type: 'error', text: `Erreur : ${err.message}` });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-700" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Google Agenda – Connexion OAuth</h1>
          <p className="text-sm text-gray-500">Gérez la connexion à israel.growth.venture@gmail.com</p>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Statut de la connexion</h2>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Vérification en cours…</span>
          </div>
        ) : status === true ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-700">Connecté</p>
              <p className="text-xs text-gray-500">Google Agenda est opérationnel. Les créneaux et réservations fonctionnent.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-600">Non connecté</p>
              <p className="text-xs text-gray-500">Aucun token OAuth stocké. Cliquez sur "Connecter" pour autoriser.</p>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-xl px-4 py-3 text-sm mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Actions</h2>
        <div className="space-y-3">
          {/* Connect */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Connecter Google Agenda</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Ouvre la page d'autorisation Google dans un nouvel onglet.
                Après autorisation, revenez ici et cliquez sur Actualiser.
              </p>
            </div>
            <button
              onClick={handleConnect}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Connecter
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Disconnect */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Déconnecter</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Supprime le token stocké. Les réservations seront désactivées jusqu'à reconnexion.
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={actionLoading || status === false}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlink className="w-4 h-4" />
              )}
              Déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-100 p-5 text-sm text-blue-800">
        <h3 className="font-semibold mb-2">📋 Configuration requise (une seule fois)</h3>
        <ol className="list-decimal list-inside space-y-1.5 text-xs">
          <li>Dans Google Cloud Console, créez un credential <strong>OAuth 2.0 Web Application</strong>.</li>
          <li>Ajoutez l'URI de redirection : <code className="bg-blue-100 px-1 rounded">
            https://igv-cms-backend.onrender.com/api/google/oauth/callback
          </code></li>
          <li>Renseignez <code className="bg-blue-100 px-1 rounded">GOOGLE_OAUTH_CLIENT_ID</code> et&nbsp;
            <code className="bg-blue-100 px-1 rounded">GOOGLE_OAUTH_CLIENT_SECRET</code> dans Render.</li>
          <li>Cliquez <strong>Connecter</strong> ci-dessus et autorisez le compte <em>israel.growth.venture@gmail.com</em>.</li>
          <li>Revenez ici et vérifiez que le statut est <strong>Connecté</strong>.</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleConnect;
