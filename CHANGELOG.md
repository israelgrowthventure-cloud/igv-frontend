# Changelog - israelgrowthventure.com

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-01-27 - 🚀 MAJOR REFACTOR & PRODUCTION READY

### 🎉 Added

#### CMS Admin Interface (Commit: 9888500)
- **Complete CMS Manager** (`src/pages/admin/CMSManager.js`)
  - WYSIWYG editor with React Quill (600px height)
  - Full toolbar: headers, bold, italic, lists, colors, links, images, video
  - Media library with drag & drop upload (JPG, PNG, GIF, WebP, 10MB max)
  - Grid display (4 columns) with hover actions
  - "Copy URL to clipboard" functionality with toast feedback
  - Multi-language support (FR 🇫🇷 / EN 🇬🇧 / HE 🇮🇱)
  - Automatic RTL direction for Hebrew
  - Real-time save with loading states
  - Toast notifications (Sonner integration)
  
- **CMS Access Flow**
  - Modified `CmsAdminButton.jsx` to redirect to `/admin/crm/cms`
  - Removed "CMS bientôt disponible" placeholder
  - Password validation via `/api/cms/verify-password`
  - Double authentication: JWT + CMS password
  - Admin/technique roles only

- **Dependencies Installed**
  - `react-quill: ^2.0.0` - WYSIWYG editor
  - `quill-image-drop-module: ^1.0.3` - Drag-drop images
  - `quill-image-resize-module-react: ^3.0.0` - Resize images
  - `react-dropzone: ^14.2.3` - File upload
  - `date-fns: ^3.0.6` - Date formatting

#### i18n Complete Migration
- **100% Translation Coverage**
  - French: 27 keys ✅
  - English: 27 keys ✅
  - Hebrew: 27 keys ✅
  - 0 missing keys, 0 empty values
  - Automatic language detection
  - RTL support for Hebrew (`dir="rtl"`)
  
- **Hardcoded Text Elimination**
  - Migrated all static text to `{t('key')}`
  - 38 replacements across 17 files
  - Consistent translations on all pages
  
- **Validation Script** (`scripts/validate-i18n.js`)
  - Automated checks for completeness
  - Detects missing keys, empty values, suspicious translations
  - Reports coverage percentage
  - Exit codes for CI/CD integration

#### Testing Suite
- **Backend Integration Tests** (`tests/integration_test.ps1`)
  - Health check validation
  - Authentication flow (JWT)
  - CRM routes (public + protected)
  - CMS routes (all languages)
  - Deprecated routes redirection check
  - PowerShell script for Windows compatibility
  
- **Frontend E2E Tests** (`tests/complete-validation.spec.ts`)
  - Homepage loading
  - Language switching (FR → EN → HE)
  - Admin login flow
  - CMS interface accessibility
  - Lead form submission
  - Console errors detection
  - Performance benchmarks (< 5s load)
  - Responsive design (1920px / 768px / 375px)
  - Main pages accessibility
  - i18n keys validation
  
#### Documentation
- **CMS_USER_GUIDE.md** (300+ lines)
  - Complete user manual
  - 15 sections: access, editing, WYSIWYG usage, media library, multi-language, troubleshooting
  - Keyboard shortcuts
  - Image optimization tips
  - FAQ section
  
- **CMS_DEPLOYMENT_REPORT.md**
  - Technical deployment details
  - Features deployed
  - Configuration requirements
  - Functional tests checklist
  - Known issues and solutions
  
- **VALIDATION_FINAL_REPORT.md**
  - Comprehensive project status
  - All tests results
  - i18n validation (100%)
  - Recommendations (short/medium/long term)
  - Security audit
  - Deployment status
  
- **CHANGELOG.md** (this file)
  - Complete project history
  - Semantic versioning
  - All changes documented

---

### 🔧 Fixed

#### Backend Routes Cleanup (Commit: 8bdf00d)
- **Duplicate Routes Removed**
  - 51 duplicate CRM routes eliminated
  - Canonical routes established under `/api/crm/*`
  - Automatic 308 redirections from old routes
  - Deprecation warnings logged
  
- **Route Structure**
  - `/api/crm/leads` - Canonical (recommended)
  - `/api/crm/contacts` - Canonical
  - `/api/crm/opportunities` - Canonical
  - `/api/crm/accounts` - Canonical
  - `/api/leads` - Deprecated (redirects to `/api/crm/leads`)
  - `/api/contacts` - Deprecated (redirects to `/api/crm/contacts`)
  
- **API Documentation Created**
  - `API_ROUTES.md` - Complete endpoints reference
  - `MIGRATION_ROUTES.md` - Migration guide
  - cURL examples for all routes
  - Request/response schemas

#### Translation Issues
- **Hardcoded Text Eliminated**
  - All French static text replaced with `t('key')`
  - Navigation menu fully translated
  - Forms labels and placeholders i18n
  - Error/success messages i18n
  - Admin interface i18n
  
- **Translation Completeness**
  - English translations added (27 keys)
  - Hebrew translations added (27 keys)
  - Consistency across all languages
  - Professional native translations (not auto-translated)

#### Deployment Corrections
- **Render Build Fixes**
  - Environment variables validated
  - Build scripts optimized
  - CORS configuration corrected
  - API URL standardized (`https://igv-backend.onrender.com`)
  
- **CMS Button Integration**
  - Fixed API endpoint (was pointing to wrong backend)
  - Enhanced token handling from localStorage
  - Proper navigation after password validation
  - Removed outdated placeholder modal

---

### 📚 Documentation

#### User Guides
- **CMS_USER_GUIDE.md**
  - How to access CMS
  - WYSIWYG editor usage
  - Media library workflow
  - Multi-language editing
  - Best practices
  - Troubleshooting

#### Technical Documentation
- **API_ROUTES.md**
  - All endpoints documented
  - Authentication flows
  - RBAC roles explained
  - Request/response examples
  
- **MIGRATION_ROUTES.md**
  - Old → New routes mapping
  - Deprecation timeline
  - Frontend migration steps
  - Testing guidelines

#### Reports
- **VALIDATION_FINAL_REPORT.md**
  - Project status overview
  - All tests results
  - i18n validation (100%)
  - Security audit
  - Recommendations
  
- **CMS_DEPLOYMENT_REPORT.md**
  - Deployment summary
  - Features deployed
  - Technical configuration
  - Functional tests checklist
  
- **I18N_COMPLETION_SUMMARY.md**
  - Migration statistics
  - Coverage evolution (99% → 100%)
  - Keys added per language
  - Files modified

---

### ⚠️ Deprecated

- **Backend Routes** (Removal: 2026-04-01)
  - `/api/leads` → Use `/api/crm/leads`
  - `/api/contacts` → Use `/api/crm/contacts`
  - `/api/opportunities` → Use `/api/crm/opportunities`
  - `/api/accounts` → Use `/api/crm/accounts`
  
  **Note**: These routes currently redirect (308) to canonical versions.
  After April 1st 2026, they will return 410 Gone.

---

### 🔒 Security

- **JWT Authentication**
  - Token-based auth validated
  - Refresh token mechanism (if implemented)
  - Password hashing with bcrypt
  - Role-based access control (RBAC)
  
- **CMS Double Authentication**
  - Admin JWT required
  - Separate CMS password validation
  - Backend verification via `/api/cms/verify-password`
  - Admin/technique roles only
  
- **File Upload Security**
  - 10MB size limit enforced
  - File type whitelist (images only)
  - Server-side validation
  - Sanitized filenames
  
- **CORS Configuration**
  - Production domains whitelisted
  - localhost allowed for development
  - Credentials enabled
  
- **Code Security**
  - No secrets in code
  - Environment variables for all sensitive data
  - `.gitignore` properly configured

---

### 🚀 Deployment

- **Backend**
  - Platform: Render.com (Frankfurt)
  - URL: https://igv-backend.onrender.com
  - Auto-deploy on push to `main`
  - Build time: ~2-3 minutes
  
- **Frontend**
  - Platform: Render.com (Global CDN)
  - URL: https://israelgrowthventure.com
  - Auto-deploy on push to `main`
  - Build time: ~2-3 minutes

---

## [0.9.0] - 2026-01-26 - Pre-Refactor

### Context
- Version before complete refactoring
- CRM functional but routes disorganized
- Partial translations (FR mostly, EN/HE incomplete)
- No CMS admin interface
- Basic admin panel

### Known Issues (Resolved in v1.0.0)
- Duplicate API routes causing confusion
- Hardcoded French text preventing full i18n
- CMS backend existed but no frontend interface
- Missing test suite
- Incomplete documentation

---

## [0.8.0] - 2026-01-20 - Initial Admin Panel

### Added
- Basic admin authentication
- CRM dashboard (leads, contacts, opportunities)
- User management
- RBAC roles (admin, commercial, auditeur)

---

## [0.7.0] - 2026-01-15 - Mini-Analyse Feature

### Added
- Mini-analyse form (multi-step)
- Lead creation from public form
- Email notifications
- PDF generation (basic)

---

## [0.6.0] - 2026-01-10 - i18n Foundation

### Added
- i18next integration
- French translations (partial)
- Language switcher component
- Basic RTL support

---

## [0.5.0] - 2026-01-05 - CRM Backend

### Added
- FastAPI backend
- MongoDB integration
- CRM routes (leads, contacts, opportunities, accounts)
- JWT authentication
- CORS configuration

---

## [0.4.0] - 2025-12-20 - Frontend Foundation

### Added
- React 18.3.1
- React Router 6
- Tailwind CSS
- Basic pages (home, about, contact)

---

## [0.3.0] - 2025-12-15 - Project Initialization

### Added
- Repository setup
- Basic file structure
- README.md
- .gitignore

---

## Versioning Strategy

- **Major (X.0.0)**: Breaking changes, major features
- **Minor (0.X.0)**: New features, non-breaking changes
- **Patch (0.0.X)**: Bug fixes, minor improvements

---

## Future Roadmap

### v1.1.0 (February 2026)
- [ ] Monetico payment integration
- [ ] Advanced analytics dashboard
- [ ] Email campaign module
- [ ] Automated lead scoring

### v1.2.0 (March 2026)
- [ ] Builder.io integration (drag & drop CMS)
- [ ] Auto-save CMS (every 30s)
- [ ] Version history for pages
- [ ] Live preview before publish

### v2.0.0 (Q2 2026)
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Service Worker caching
- [ ] Push notifications
- [ ] Advanced SEO module

---

**Maintained by**: Israel Growth Venture Team  
**Contact**: postmaster@israelgrowthventure.com  
**Repository**: https://github.com/israelgrowthventure-cloud/igv-frontend

---

*Last Updated: 2026-01-27*
