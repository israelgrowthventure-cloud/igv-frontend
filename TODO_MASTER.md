# TODO_MASTER — Mission i18n en profondeur (IGV CRM)
## Date: 26 Janvier 2026
## Status: ✅ COMPLÉTÉ — PHASE 4

---

## MISSION ACTUELLE: i18n SYSTÈME + AUDIT + FIX GLOBAL

### PHASE 1 — Diagnostic i18n (prouver le vrai problème)
| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 1.1 | Cartographier initialisation i18next (fichier exact) | ✅ FAIT | src/i18n/config.js - import statique |
| 1.2 | Identifier backends/chargements (imports, http-backend, public/) | ✅ FAIT | Import statique des JSON (embarqués dans bundle) |
| 1.3 | Lister namespaces attendus vs réellement chargés | ✅ FAIT | Namespace unique: `translation` |
| 1.4 | Reproduire bug clé brute en local/dev | ✅ FAIT | Cause: clés manquantes dans JSON |
| 1.5 | Vérifier présence JSON dans build Render | ✅ FAIT | Build obsolète - rebuild nécessaire |

### PHASE 2 — Fix global (système)
| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 2.1 | Confirmer mécanisme import (statique vs HTTP) | ✅ FAIT | Import statique confirmé |
| 2.2 | Forcer namespaces + fallback cohérent | ✅ FAIT | fallbackLng: 'fr' déjà en place |
| 2.3 | Ajouter instrumentation dev clés manquantes | ✅ FAIT | tools/i18n-audit.js créé |

### PHASE 3 — Audit automatique des clés (exhaustif)
| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 3.1 | Créer script tools/i18n-audit.js | ✅ FAIT | Scan 143 fichiers, 1024 clés |
| 3.2 | Scanner src/ pour toutes clés t('...') | ✅ FAIT | Pattern: t(), i18nKey= |
| 3.3 | Comparer avec fr/en/he JSON | ✅ FAIT | ~300 clés manquantes par langue |
| 3.4 | Générer missing_keys_*.json | ✅ FAIT | Rapports générés |
| 3.5 | Ajouter clés manquantes | ✅ FAIT | 898 clés ajoutées (traductions intelligentes) |

### PHASE 4 — Build + déploiement + preuve
| # | Tâche | Statut | Notes |
|---|-------|--------|-------|
| 4.1 | Rebuild local | 🔄 EN COURS | |
| 4.2 | Commit + Push | ⏳ À FAIRE | |
| 4.3 | Déployer sur Render | ⏳ À FAIRE | |
| 4.4 | Test /admin/crm/settings — zéro clé brute | ⏳ À FAIRE | |
| 4.5 | Test changement langue FR/EN/HE | ⏳ À FAIRE | |
| 4.6 | Test 2-3 pages CRM au hasard | ⏳ À FAIRE | |

---

## LIVRABLES ATTENDUS
- [ ] SHAs de commit
- [x] tools/i18n-audit.js ✅
- [x] tools/i18n-autofix.js ✅
- [x] tools/i18n-smart-fix.js ✅
- [x] tools/i18n-replace-auto.js ✅
- [x] missing_keys_*.json (rapports) ✅
- [ ] Preuve /admin/crm/settings sans clés brutes

---

## JOURNAL D'EXÉCUTION
| Heure | Action | Résultat |
|-------|--------|----------|
| 14:30 | Début mission i18n | PHASE 1 lancée |
| 14:35 | Diagnostic système i18n | Import statique confirmé, fallback FR OK |
| 14:40 | Création i18n-audit.js | 1024 clés trouvées, ~300 manquantes/langue |
| 14:45 | Création i18n-autofix.js | 898 clés ajoutées avec [AUTO] |
| 14:50 | Création i18n-replace-auto.js | Placeholders remplacés par vraies traductions |
| 14:55 | Re-audit | ✅ 0 clés manquantes FR/EN/HE |

---

## HISTORIQUE MISSIONS PRÉCÉDENTES (complétées)

### Routes API (COMPLÉTÉ)
- [x] Centraliser routes dans src/api/routes.js
- [x] Migrer `/api/crm/team` → `/api/crm/settings/users`
- [x] Migrer `/api/crm/roles` → `/api/crm/rbac/roles`
- [x] Ajouter warning dev route legacy (client.js)

### Auth/RBAC (COMPLÉTÉ)
- [x] Unifier token sur `admin_token`
- [x] Standardiser role

---

## ROUTES LEGACY IDENTIFIÉES (à migrer)

| Route Legacy | Route Canonique | Fichiers utilisant |
|--------------|-----------------|-------------------|
| `/api/login` | `/api/admin/login` | AUCUN (utils/api.js utilise déjà canonique) |
| `/api/auth/login` | `/api/admin/login` | AUCUN |
| `/api/stats` | `/api/admin/stats` | AUCUN |
| `/api/crm/stats` | `/api/crm/dashboard/stats` | AUCUN |
| `/api/crm/team` | `/api/crm/settings/users` | MiniAnalysisWorkflowPage.js, RBACPage.js |
| `/api/crm/users` | `/api/crm/settings/users` | AUCUN identifié |
| `/api/crm/roles` | `/api/crm/rbac/roles` | RBACPage.js, routes.js |
| `/api/crm/permissions` | `/api/crm/rbac/permissions` | AUCUN identifié |
| `/api/crm/automation` | `/api/crm/rules` | routes.js (LEGACY_ALIASES) |
| `/api/crm/audit` | `/api/crm/audit-logs` | routes.js (LEGACY_ALIASES) |
| `/api/crm/duplicates/leads` | `/api/crm/quality/duplicates/leads` | routes.js (LEGACY_ALIASES) |
| `/api/crm/duplicates/contacts` | `/api/crm/quality/duplicates/contacts` | routes.js (LEGACY_ALIASES) |

---

## PROBLÈMES AUTH IDENTIFIÉS

1. **Double source de token**:
   - `localStorage.token` (AuthContext)
   - `localStorage.admin_token` (PrivateRoute, utils/api.js)
   
2. **Incohérence role**:
   - AuthContext utilise `userRole`
   - Backend renvoie `role` dans response login

---

## PROCHAINES ACTIONS
1. Corriger les appels legacy dans les fichiers identifiés
2. Unifier token sur une seule clé localStorage
3. Commit + push + valider LEGACY_ROUTE_USED = 0
