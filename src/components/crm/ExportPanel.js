import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Download, Loader2, FileSpreadsheet, Archive, CheckCircle,
  Users, UserCheck, Building2, Briefcase, Activity, Mail
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ExportPanel - Panneau d'export CSV pour tous les types de données
 * Point 11 de la mission - Exports globaux
 */
const ExportPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [exporting, setExporting] = useState(null);
  const [exportAll, setExportAll] = useState(false);

  const exportTypes = [
    { 
      id: 'leads', 
      label: 'Leads', 
      icon: Users, 
      color: 'text-blue-600 bg-blue-100',
      description: 'Tous les leads avec leurs informations'
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      icon: UserCheck, 
      color: 'text-green-600 bg-green-100',
      description: 'Tous les contacts convertis'
    },
    { 
      id: 'companies', 
      label: 'Sociétés', 
      icon: Building2, 
      color: 'text-purple-600 bg-purple-100',
      description: 'Toutes les sociétés B2B'
    },
    { 
      id: 'opportunities', 
      label: 'Opportunités', 
      icon: Briefcase, 
      color: 'text-orange-600 bg-orange-100',
      description: 'Toutes les opportunités commerciales'
    },
    { 
      id: 'activities', 
      label: 'Activités', 
      icon: Activity, 
      color: 'text-cyan-600 bg-cyan-100',
      description: 'Historique des activités'
    }
  ];

  const handleExport = async (type) => {
    try {
      setExporting(type);
      
      // Create a link and trigger download
      const response = await api.get(`/api/crm/export/${type}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('crm.export.success', `${type} exporté avec succès`));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('crm.export.error', 'Erreur lors de l\'export'));
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = async () => {
    if (!isAdmin) {
      toast.error(t('crm.errors.admin_only', 'Réservé aux administrateurs'));
      return;
    }

    try {
      setExportAll(true);
      
      const response = await api.get('/api/crm/export/all', {
        responseType: 'blob'
      });

      const blob = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crm_backup_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t('crm.export.backup_success', 'Backup complet exporté'));
    } catch (error) {
      console.error('Export all error:', error);
      toast.error(t('crm.export.error', 'Erreur lors de l\'export'));
    } finally {
      setExportAll(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {t('crm.export.title', 'Exporter les données')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {exportTypes.map((type) => {
              const Icon = type.icon;
              const isExporting = exporting === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => handleExport(type.id)}
                  disabled={!!exporting}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div className={`w-10 h-10 rounded-full ${type.color} flex items-center justify-center mr-4`}>
                    {isExporting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                  <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>

          {/* Export All (Admin only) */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleExportAll}
                disabled={exportAll || !!exporting}
                className="w-full flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {exportAll ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Archive className="w-5 h-5 mr-2" />
                )}
                {t('crm.export.backup_all', 'Exporter tout (Backup complet)')}
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Archive ZIP contenant tous les fichiers CSV
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
