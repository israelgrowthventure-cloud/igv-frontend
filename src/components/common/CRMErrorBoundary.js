import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * CRMErrorBoundary - Capture les erreurs React dans les pages CRM
 * Empêche les pages blanches et affiche un message d'erreur
 */
class CRMErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRM Error Boundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to console for debugging
    console.group('🚨 CRM Error Details');
    console.error('Error:', error?.message || error);
    console.error('Component Stack:', errorInfo?.componentStack);
    console.groupEnd();
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/admin/crm/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Une erreur est survenue
            </h2>
            
            <p className="text-gray-600 mb-6">
              Cette page a rencontré un problème inattendu. 
              Veuillez recharger ou retourner au tableau de bord.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error?.message || String(this.state.error)}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-xs font-mono text-red-600 mt-2 overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack.slice(0, 500)}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharger
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Tableau de bord
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CRMErrorBoundary;
