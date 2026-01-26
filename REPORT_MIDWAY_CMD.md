# REPORT MIDWAY CMD — Audit de cohérence & suppression dette technique
## Date: 26 Janvier 2026
## Status: 🔄 EN COURS

---

## PHASE 0 — PRÉFLIGHT

### Repos identifiés
| Repo | URL GitHub | URL Render |
|------|------------|------------|
| igv-backend | israelgrowthventure-cloud/igv-backend | https://igv-cms-backend.onrender.com |
| igv-frontend | israelgrowthventure-cloud/igv-frontend | https://igv-frontend.onrender.com |

### Backend URL confirmée
```javascript
// src/api/client.js ligne 23
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://igv-cms-backend.onrender.com';
```

---

## PHASE 1 — AUDIT ROUTES

### Routes Canoniques Backend (server.py)

| Préfixe | Router | Routes principales |
|---------|--------|-------------------|
| `/api/admin` | admin_routes | login, logout, verify, stats, users |
| `/api/crm` | crm_complete_routes | leads, contacts, companies, opportunities, pipeline |
| `/api/crm` | crm_additional_routes | activities, notes, emails |
| `/api/crm/dashboard` | crm_complete_routes | stats |
| `/api/crm/settings` | crm_additional_routes | users, tags, pipeline-stages |
| `/api/crm/quality` | quality_router | duplicates/leads, duplicates/contacts, merge |
| `/api/crm/rules` | automation_kpi_router | list, create, update, delete, execute |
| `/api/crm/kpi` | automation_kpi_router | response-times, conversion-times, source-performance |
| `/api/crm/search` | search_rbac_router | global, quick |
| `/api/crm/rbac` | search_rbac_router | roles, permissions, users/{id}/role |
| `/api/crm/emails` | email_export_router | send, history, templates |
| `/api/crm/export` | email_export_router | leads, contacts, all |
| `/api/crm/mini-analyses` | mini_audit_router | list, stats, detail |
| `/api/crm/audit-logs` | mini_audit_router | list, stats, entity, user |

### Routes Legacy API Bridge (api_bridge.py)

| Route Legacy | Route Canonique | Méthode |
|--------------|-----------------|---------|
| `/api/login` | `/api/admin/login` | POST |
| `/api/auth/login` | `/api/admin/login` | POST |
| `/api/stats` | `/api/admin/stats` | GET |
| `/api/crm/stats` | `/api/crm/dashboard/stats` | GET |
| `/api/crm/automation` | `/api/crm/rules` | GET |
| `/api/crm/automation/rules` | `/api/crm/rules` | GET/POST |
| `/api/crm/automation/rules/{id}` | `/api/crm/rules/{id}` | PUT/DELETE |
| `/api/crm/automation/execute` | `/api/crm/rules/execute` | POST |
| `/api/crm/audit` | `/api/crm/audit-logs` | GET |
| `/api/crm/audit/stats` | `/api/crm/audit-logs/stats` | GET |
| `/api/crm/audit/entity/{type}/{id}` | `/api/crm/audit-logs/entity/{type}/{id}` | GET |
| `/api/crm/audit/user/{email}` | `/api/crm/audit-logs/user/{email}` | GET |
| `/api/crm/roles` | `/api/crm/rbac/roles` | GET |
| `/api/crm/permissions` | `/api/crm/rbac/permissions` | GET |
| `/api/crm/users/{id}/role` | `/api/crm/rbac/users/{id}/role` | PUT |
| `/api/crm/duplicates/leads` | `/api/crm/quality/duplicates/leads` | GET |
| `/api/crm/duplicates/contacts` | `/api/crm/quality/duplicates/contacts` | GET |
| `/api/crm/team` | `/api/crm/settings/users` | GET |
| `/api/crm/users` | `/api/crm/settings/users` | GET |

### Fichiers Frontend utilisant routes Legacy

| Fichier | Ligne | Appel Legacy | Route Canonique | Action |
|---------|-------|--------------|-----------------|--------|
| MiniAnalysisWorkflowPage.js | 82 | `/api/crm/team` | `/api/crm/settings/users` | ⏳ À migrer |
| RBACPage.js | 47 | `/api/crm/team` | `/api/crm/settings/users` | ⏳ À migrer |
| RBACPage.js | 48 | `/api/crm/roles` | `/api/crm/rbac/roles` | ⏳ À migrer |
| src/api/routes.js | 224 | `roles: '/api/crm/roles'` | `/api/crm/rbac/roles` | ⏳ À migrer |
| src/api/routes.js | 234-235 | `list: '/api/crm/team'` | `/api/crm/settings/users` | ⏳ À migrer |

### Fichiers utilisant routes Canoniques ✓
- utils/api.js: `/api/admin/login`, `/api/admin/verify`, `/api/admin/stats` ✓
- AuditLogsPage.js: `/api/crm/audit-logs` ✓
- DashboardPage.js (après refactor): `ROUTES.crm.dashboard.stats` ✓
- AdminTasks.js (après refactor): `ROUTES.crm.tasks.*` ✓
- AdminPayments.js (après refactor): `ROUTES.monetico.payments` ✓
- AdminInvoices.js (après refactor): `ROUTES.invoices.*` ✓

---

## PHASE 3 — I18N DIAGNOSTIC

### Configuration actuelle (OK)
```javascript
// src/i18n/config.js
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      he: { translation: he }
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'he'],
    // ...
  });
```

### Ordre de montage (OK)
```javascript
// src/index.js
import './i18n/config';  // i18n initialisé AVANT App
import App from './App';
```

### Cause potentielle clés visibles
- Clés non définies dans certains fichiers JSON
- À vérifier: audit complet des clés utilisées vs définies

---

## PHASE 4 — AUTH/RBAC DIAGNOSTIC

### Problème identifié: Double source token

| Source | Clé localStorage | Utilisé par |
|--------|------------------|-------------|
| AuthContext | `token`, `userEmail`, `userName`, `userRole` | useAuth(), Login.js |
| PrivateRoute/utils/api | `admin_token` | PrivateRoute.js, utils/api.js |

### Solution requise
1. Unifier sur une seule clé (`admin_token` recommandé car déjà utilisé par backend calls)
2. AuthContext doit lire/écrire `admin_token`
3. Supprimer usage de `token` simple

### Schéma CurrentUser attendu (backend)
```json
{
  "token": "jwt...",
  "user": {
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"  // "admin" | "sales" | "manager"
  }
}
```

---

## ACTIONS EN COURS

### ⏳ Migrer routes legacy dans frontend
Fichiers à modifier:
1. `src/api/routes.js` - Corriger ROUTES.crm.team et ROUTES.rbac
2. `MiniAnalysisWorkflowPage.js` - Utiliser ROUTES.crm.settings.users
3. `RBACPage.js` - Utiliser ROUTES.crm.rbac.roles et ROUTES.crm.settings.users

### ⏳ Unifier token localStorage
Fichiers à modifier:
1. `AuthContext.js` - Utiliser `admin_token` partout
2. `Login.js` - S'assurer stockage dans `admin_token`

---

## PREUVES (à compléter)
- [ ] Capture Network montrant appels canoniques
- [ ] Logs Render `LEGACY_ROUTE_USED` ≈ 0
- [ ] SHA commit frontend
- [ ] SHA commit backend (si modifié)


