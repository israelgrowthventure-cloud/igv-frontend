# TODO_MASTER — Audit de cohérence & suppression dette technique (IGV CRM)
## Date: 26 Janvier 2026
## Status: 🔄 EN COURS

---

## CHECKLIST GLOBALE

### PHASE 0 — PRÉFLIGHT (preuves & base)
- [x] Identifier repos exacts: `igv-backend` + `igv-frontend`
- [x] Confirmer URLs prod: `https://igv-cms-backend.onrender.com`
- [ ] Ajouter mode "audit" console.log pour appels API legacy (dev only)

### PHASE 1 — AUDIT ROUTES (server.py ↔ App.js)
- [x] Lister routes canoniques backend (server.py)
- [x] Lister routes legacy API Bridge (api_bridge.py)
- [ ] Analyser tous les appels API frontend
- [ ] Générer tableau audit dans REPORT_MIDWAY_CMD.md
- [ ] Identifier fichiers utilisant routes legacy

### PHASE 2 — DÉ-BRIDGE PLAN (suppression progressive pont)
- [x] Centraliser TOUTES routes dans src/api/routes.js
- [x] Imposer usage helper apiPath() ou ROUTES.*
- [x] Remplacer occurrences legacy par chemins canoniques:
  - [x] `/api/crm/team` → `/api/crm/settings/users`
  - [x] `/api/crm/roles` → `/api/crm/rbac/roles`
  - [x] `/api/crm/audit` → `/api/crm/audit-logs` (déjà OK)
  - [x] `/api/crm/duplicates/*` → `/api/crm/quality/duplicates/*` (dans routes.js)
- [ ] Ajouter warning dev si route legacy utilisée
- [ ] Validation: logs LEGACY_ROUTE_USED ≈ 0

### PHASE 3 — I18N GLOBAL (réparer chargement)
- [x] Inspecter initialisation i18n (config.js, index.js)
- [x] Vérifier ordre montage: i18n.init AVANT App
- [x] Confirmer fallbackLng: 'fr'
- [ ] Vérifier clés manquantes dans fr.json/en.json/he.json
- [ ] Ajouter test anti-clés i18n visible
- [ ] Validation: aucune clé brute visible en prod

### PHASE 4 — NORMALISATION AUTH/RBAC
- [x] Identifier source vérité rôle backend: token + localStorage
- [x] Vérifier ce que frontend lit: AuthContext.js
- [x] Problème identifié: 2 sources de token (`token` vs `admin_token`)
- [x] Unifier source token sur une seule clé (admin_token comme principal)
- [x] Standardiser role sur valeur stable ("admin" / "sales")
- [ ] Vérifier badge Admin s'affiche
- [ ] Vérifier menus admin visibles
- [ ] Validation: appels admin ne renvoient plus 403

### PHASE 5 — DÉPLOIEMENT & PREUVES
- [ ] Commits séparés backend/frontend
- [ ] Push backend → Render auto-deploy
- [ ] Push frontend → Render auto-deploy
- [ ] Captures UI: Paramètres, Mini-analyses, Prospects
- [ ] Logs Render: LEGACY_ROUTE_USED ≈ 0
- [ ] Logs Render: i18n OK
- [ ] Logs Render: rôle admin OK

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
