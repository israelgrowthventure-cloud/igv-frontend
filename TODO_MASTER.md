# TODO MASTER — Audit First + Dynamic Pricing
**Date**: 2026-02-22 | **Branche**: feat/nextjs-migration
**Statut**: ✅ TOUTES TÂCHES COMPLETÉES

## CHECKLIST 2026-02-22

- [x] **T1A** - Ajout CTA audit dans MASTER_PROMPT_RESTAURATION.txt (FR)
  - Phrase: "Réservez votre Audit Stratégique (60 min) avec Mickael Benmoussa..."
  - Lien: https://israelgrowthventure.com/audit
- [x] **T1A** - Ajout CTA audit dans MASTER_PROMPT_RETAIL_NON_FOOD.txt (FR)
- [x] **T1A** - Ajout CTA audit dans MASTER_PROMPT_SERVICES_PARAMEDICAL.txt (FR)
- [x] **T1A** - Ajout CTA audit dans MASTER_PROMPT_*_EN.txt (3 fichiers EN)
- [x] **T1A** - Ajout CTA audit dans MASTER_PROMPT_*_HE.txt (3 fichiers HE)
- [x] **T1B** - Lien /audit dans send_mini_analysis_email (FR/EN/HE)
  - Fichier: igv-backend/mini_analysis_routes.py
- [x] **T2** - Prix dynamique Pack Analyse via api.detectLocation() + getPricing()
  - ISRAËL: 7 000 ₪ | USA/ASIE: 4 000 $ | EUROPE/AUTRE: 3 000 €
- [x] **T2** - "Tarif ajusté selon votre zone géographique." sous le prix
- [x] **T2** - Succursales/Franchise: "Accompagnement Premium — Sur devis après audit."
- [x] **T2** - CTA UNIQUE "Réservez dès maintenant votre audit" → /audit
- [x] **T3** - /audit: 900€ visible (Audit.js line 359 + JSON-LD)
- [x] **GIT** - feat(audit): commit backend SHA 737d8ac → main
- [x] **GIT** - feat(pricing): commit frontend SHA 749c232 → feat/nextjs-migration
- [x] **DEPLOY** - Backend poussé main → Render auto-deploy igv-cms-backend
- [x] **DEPLOY** - Frontend poussé feat/nextjs-migration → Render auto-deploy

---

# TODO PRÉCÉDENTE — CMS WYSIWYG REPAIR
**Date début**: 2026-01-30  
**Mission**: Réparer CMS WYSIWYG - ÉDITER = APERÇU + édition inline + persistance PROD  
**Statut**: 🔴 EN COURS - ANALYSE

---

## PHASE 1: ANALYSE & DIAGNOSTIC ⏳

### 1.1 État actuel CMSEditor.js
- [x] Fichier: src/pages/admin/CMSEditor.js (427 lignes)
- [x] Mode APERÇU: iframe → `${SITE_URL}${page.url}?lang=${language}&preview=true`
- [x] Mode ÉDITER: formulaire ReactQuill + inputs séparés du rendu
- [ ] **PROBLÈME**: ÉDITER ne montre PAS la page rendue, juste des champs de saisie
- [ ] **PROBLÈME**: Pas d'édition inline sur le canvas visuel

### 1.2 Backend CMS (cms_routes.py)
- [x] Endpoint GET `/api/pages/{page}?language=fr` (ligne 142)
- [x] Endpoint POST `/api/pages/update` (ligne 175)
- [ ] **À VÉRIFIER**: Structure update (section-based vs flat)
- [ ] **À CORRIGER**: Support update partiel complet

### 1.3 Écart APERÇU vs ÉDITER
- [ ] APERÇU: iframe de la vraie page (✅ correct)
- [ ] ÉDITER: formulaires isolés (❌ pas de canvas visuel)
- [ ] **REQUIS**: Un seul PageRenderer partagé

---

## PHASE 2: CONCEPTION SOLUTION 📋

### 2.1 Architecture unifiée
- [ ] Créer composant PageRenderer.js partagé
- [ ] APERÇU: PageRenderer en mode lecture seule
- [ ] ÉDITER: PageRenderer + couche editable (data-cms-key)

### 2.2 Édition inline
- [ ] Attributs data-cms-key sur éléments éditables
- [ ] Surbrillance hover (.cms-editable:hover)
- [ ] Click-to-edit → contenteditable ou modal
- [ ] Sync temps réel canvas ↔ état React

### 2.3 Persistance
- [ ] Save button actif si dirty state
- [ ] POST /api/pages/update structure plate
- [ ] Confirm sauvegarde (toast)
- [ ] Refresh garde changements

---

## PHASE 3: IMPLÉMENTATION FRONTEND 🔧

### 3.1 PageRenderer.js
- [ ] Créer src/components/cms/PageRenderer.js
- [ ] Props: { page, language, content, editable }
- [ ] Render Hero, Services, etc depuis content
- [ ] Mode editable: ajouter data-cms-key + onClick

### 3.2 CMSEditor.js refactor
- [ ] Remplacer formulaires par <PageRenderer editable={true} />
- [ ] État: content object (hero_title, services_title, etc)
- [ ] handleInlineEdit(key, value) → update content[key]
- [ ] Save → flatten content object → POST /api/pages/update

### 3.3 Styles édition inline
- [ ] CSS: .cms-editable { outline, cursor: pointer }
- [ ] Hover: background jaune clair
- [ ] Active: border bleu + contenteditable
- [ ] Focus: auto-save on blur

---

## PHASE 4: BACKEND CORRECTIONS ⚙️

### 4.1 Endpoint GET /api/pages/{page}
- [ ] Vérifier structure retour: flat object
- [ ] Exemple: `{ hero_title: "...", hero_subtitle: "..." }`
- [ ] Pas de nested content.hero.title

### 4.2 Endpoint POST /api/pages/update
- [ ] Input: `{ page, language, hero_title, services_title, ... }`
- [ ] Update partiel: merge avec existant
- [ ] Return: full updated object + version
- [ ] Log audit: user, timestamp, champs modifiés

---

## PHASE 5: TESTS PLAYWRIGHT PROD 🎬

### 5.1 Script: cms_wysiwyg_flow.cjs
- [ ] Login admin
- [ ] Navigate /admin/crm/cms
- [ ] Select page=Accueil, lang=FR
- [ ] Click "Aperçu" → screenshot CP2
- [ ] Click "Éditer" → verify canvas visible → screenshot CP3
- [ ] Inline edit Hero title → "IGV HERO TEST <timestamp>"
- [ ] Verify text appears in canvas → screenshot CP4
- [ ] Click Save → reload admin → verify persisted → screenshot CP5
- [ ] Open public page → verify live → screenshot CP6
- [ ] Edit again → "IGV HERO UPDATED <timestamp>"
- [ ] Save → verify public updated

### 5.2 Screenshots PROD (obligatoires)
- [ ] CP2_CMS_PREVIEW_<ts>_PROD.png
- [ ] CP3_CMS_EDIT_MATCH_PREVIEW_<ts>_PROD.png
- [ ] CP4_CMS_INLINE_EDIT_<ts>_PROD.png
- [ ] CP5_CMS_SAVED_AND_RELOAD_<ts>_PROD.png
- [ ] CP6_CMS_PUBLIC_LIVE_<ts>_PROD.png

---

## PHASE 6: DÉPLOIEMENT 🚀

### 6.1 Commits
- [ ] Frontend: PageRenderer + CMSEditor refactor
- [ ] Backend: cms_routes.py update endpoint fix
- [ ] SHAs Git enregistrés

### 6.2 Render Deploy
- [ ] Push frontend → auto-deploy
- [ ] Push backend → auto-deploy
- [ ] Attendre déploiements (2x ~10min)

### 6.3 Validation PROD
- [ ] Re-run cms_wysiwyg_flow.cjs
- [ ] Verify 5 screenshots conformes
- [ ] curl.exe -i /api/pages/home
- [ ] curl.exe -i /api/pages/update (POST)

---

## PHASE 7: FINALISATION ✅

### 7.1 Preuves backend
- [ ] curl GET /api/pages/home → 200
- [ ] curl POST /api/pages/update → 200
- [ ] Outputs bruts (sans secrets)

### 7.2 Nettoyer warnings CMS
- [ ] Fix console warnings React
- [ ] Fix PropTypes si manquants
- [ ] Pas de refactor inutile

### 7.3 Re-test complet
- [ ] All Playwright tests → output brut
- [ ] Assertions validées

---

## LIVRABLES FINAUX 📦

- [ ] 5 screenshots CP2-CP6 (chemins exacts)
- [ ] SHAs Git (frontend + backend)
- [ ] Services Render déployés (noms)
- [ ] Output Playwright brut complet
- [ ] Preuves curl backend

---

**VERROU ANTI-ABANDON**: Mission continue jusqu'à 100% fonctionnel. Interdiction d'écrire "terminé/validé" sans CP2-CP6 + SHAs + services Render.
