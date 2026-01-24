import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Loader2, Users, UserCheck, Building2, 
  Briefcase, ArrowRight, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

/**
 * GlobalSearchBar - Barre de recherche globale cross-objects
 * Point 7 de la mission - Vraie recherche globale
 */
const GlobalSearchBar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounce search
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('crm_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches', e);
      }
    }
  }, []);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/crm/search/quick', {
        params: { q: searchQuery }
      });
      setResults(response);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      // Don't show error toast for search, just clear results
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, performSearch]);

  const handleKeyDown = (e) => {
    const allResults = getAllResults();

    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const item = allResults[selectedIndex];
      if (item) {
        navigateToResult(item);
      }
    }
  };

  const getAllResults = () => {
    if (!results) return [];
    
    const all = [];
    if (results.leads) {
      results.leads.forEach(item => all.push({ ...item, type: 'lead' }));
    }
    if (results.contacts) {
      results.contacts.forEach(item => all.push({ ...item, type: 'contact' }));
    }
    if (results.companies) {
      results.companies.forEach(item => all.push({ ...item, type: 'company' }));
    }
    if (results.opportunities) {
      results.opportunities.forEach(item => all.push({ ...item, type: 'opportunity' }));
    }
    return all;
  };

  const navigateToResult = (item) => {
    // Save to recent searches
    const newSearch = {
      query,
      type: item.type,
      id: item._id || item.id,
      name: item.name || item.email || 'Sans nom',
      timestamp: new Date().toISOString()
    };

    const updated = [newSearch, ...recentSearches.filter(s => s.id !== newSearch.id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('crm_recent_searches', JSON.stringify(updated));

    // Navigate based on type
    switch (item.type) {
      case 'lead':
        navigate(`/crm/leads/${item._id || item.id}`);
        break;
      case 'contact':
        navigate(`/crm/contacts/${item._id || item.id}`);
        break;
      case 'company':
        navigate(`/crm/companies/${item._id || item.id}`);
        break;
      case 'opportunity':
        navigate(`/crm/opportunities/${item._id || item.id}`);
        break;
      default:
        break;
    }

    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'lead': return <Users className="w-4 h-4 text-blue-600" />;
      case 'contact': return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'company': return <Building2 className="w-4 h-4 text-purple-600" />;
      case 'opportunity': return <Briefcase className="w-4 h-4 text-orange-600" />;
      default: return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'lead': return 'Lead';
      case 'contact': return 'Contact';
      case 'company': return 'Société';
      case 'opportunity': return 'Opportunité';
      default: return type;
    }
  };

  const getTypeBgColor = (type) => {
    switch (type) {
      case 'lead': return 'bg-blue-50';
      case 'contact': return 'bg-green-50';
      case 'company': return 'bg-purple-50';
      case 'opportunity': return 'bg-orange-50';
      default: return 'bg-gray-50';
    }
  };

  if (!isOpen) return null;

  const allResults = getAllResults();
  let currentResultIndex = -1;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      
      {/* Search Modal */}
      <div 
        className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('crm.search.placeholder', 'Rechercher leads, contacts, sociétés...')}
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />
          {loading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* No query - show recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {t('crm.search.recent', 'Recherches récentes')}
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search.query);
                      navigateToResult({ 
                        type: search.type, 
                        _id: search.id,
                        name: search.name 
                      });
                    }}
                    className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 text-left"
                  >
                    {getTypeIcon(search.type)}
                    <span className="ml-2 text-gray-700">{search.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{getTypeLabel(search.type)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No query and no recent */}
          {!query && recentSearches.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('crm.search.hint', 'Commencez à taper pour rechercher')}</p>
              <p className="text-sm mt-1">
                {t('crm.search.shortcut', 'Utilisez Ctrl+K pour ouvrir la recherche rapidement')}
              </p>
            </div>
          )}

          {/* No results */}
          {query && query.length >= 2 && !loading && allResults.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('crm.search.no_results', 'Aucun résultat trouvé')}</p>
              <p className="text-sm mt-1">
                {t('crm.search.try_different', 'Essayez une recherche différente')}
              </p>
            </div>
          )}

          {/* Query too short */}
          {query && query.length < 2 && !loading && (
            <div className="p-4 text-center text-gray-500">
              <p>{t('crm.search.min_chars', 'Tapez au moins 2 caractères')}</p>
            </div>
          )}

          {/* Results by type */}
          {results && allResults.length > 0 && (
            <div className="divide-y divide-gray-100">
              {/* Leads */}
              {results.leads && results.leads.length > 0 && (
                <div className="p-2">
                  <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <Users className="w-3 h-3 mr-1 text-blue-600" />
                    Leads ({results.leads.length})
                  </h3>
                  {results.leads.map((lead) => {
                    currentResultIndex++;
                    const isSelected = selectedIndex === currentResultIndex;
                    const idx = currentResultIndex;
                    return (
                      <button
                        key={lead._id || lead.id}
                        onClick={() => navigateToResult({ ...lead, type: 'lead' })}
                        className={`w-full flex items-center p-2 rounded-lg text-left ${
                          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${getTypeBgColor('lead')} flex items-center justify-center mr-3`}>
                          {getTypeIcon('lead')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {lead.name || 'Sans nom'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {lead.email} {lead.phone && `• ${lead.phone}`}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Contacts */}
              {results.contacts && results.contacts.length > 0 && (
                <div className="p-2">
                  <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <UserCheck className="w-3 h-3 mr-1 text-green-600" />
                    Contacts ({results.contacts.length})
                  </h3>
                  {results.contacts.map((contact) => {
                    currentResultIndex++;
                    const isSelected = selectedIndex === currentResultIndex;
                    return (
                      <button
                        key={contact._id || contact.id}
                        onClick={() => navigateToResult({ ...contact, type: 'contact' })}
                        className={`w-full flex items-center p-2 rounded-lg text-left ${
                          isSelected ? 'bg-green-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${getTypeBgColor('contact')} flex items-center justify-center mr-3`}>
                          {getTypeIcon('contact')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {contact.name || 'Sans nom'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.email} {contact.company_name && `• ${contact.company_name}`}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Companies */}
              {results.companies && results.companies.length > 0 && (
                <div className="p-2">
                  <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <Building2 className="w-3 h-3 mr-1 text-purple-600" />
                    Sociétés ({results.companies.length})
                  </h3>
                  {results.companies.map((company) => {
                    currentResultIndex++;
                    const isSelected = selectedIndex === currentResultIndex;
                    return (
                      <button
                        key={company._id || company.id}
                        onClick={() => navigateToResult({ ...company, type: 'company' })}
                        className={`w-full flex items-center p-2 rounded-lg text-left ${
                          isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${getTypeBgColor('company')} flex items-center justify-center mr-3`}>
                          {getTypeIcon('company')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {company.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {company.industry} {company.city && `• ${company.city}`}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Opportunities */}
              {results.opportunities && results.opportunities.length > 0 && (
                <div className="p-2">
                  <h3 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                    <Briefcase className="w-3 h-3 mr-1 text-orange-600" />
                    Opportunités ({results.opportunities.length})
                  </h3>
                  {results.opportunities.map((opp) => {
                    currentResultIndex++;
                    const isSelected = selectedIndex === currentResultIndex;
                    return (
                      <button
                        key={opp._id || opp.id}
                        onClick={() => navigateToResult({ ...opp, type: 'opportunity' })}
                        className={`w-full flex items-center p-2 rounded-lg text-left ${
                          isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${getTypeBgColor('opportunity')} flex items-center justify-center mr-3`}>
                          {getTypeIcon('opportunity')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {opp.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {opp.amount && `${opp.amount.toLocaleString()} €`} {opp.stage && `• ${opp.stage}`}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] mr-1">↓</kbd>
              naviguer
            </span>
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] mr-1">↵</kbd>
              sélectionner
            </span>
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[10px] mr-1">esc</kbd>
              fermer
            </span>
          </div>
          {results && (
            <span>
              {allResults.length} résultat{allResults.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchBar;
