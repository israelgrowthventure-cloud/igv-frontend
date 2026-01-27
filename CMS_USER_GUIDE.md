# 📝 Guide Utilisateur - CMS IGV

**Interface de gestion de contenu pour Israel Growth Venture**

---

## 🔐 Accès au CMS

### 1. Connexion à l'admin
1. Allez sur https://israelgrowthventure.com/admin/login
2. Connectez-vous avec vos identifiants admin :
   - Email : `postmaster@israelgrowthventure.com`
   - Mot de passe : (fourni séparément)

### 2. Accéder au CMS
1. Une fois connecté, cliquez sur le bouton **"Modifier le Site"** (icône palette 🎨)
   - Visible uniquement pour les administrateurs
   - Situé dans la barre latérale du CRM
2. Entrez le **mot de passe CMS** (protection supplémentaire)
3. Vous êtes redirigé vers l'éditeur de contenu

---

## 📄 Éditer une Page

### Sélectionner la page à modifier

Utilisez le menu déroulant **"Page"** pour choisir la page à éditer :
- **Home** - Page d'accueil
- **About** - À propos
- **Contact** - Contact
- **Packs** - Nos offres
- **Terms** - Conditions générales
- etc.

### Choisir la langue

Sélectionnez la langue dans le menu déroulant **"Langue"** :
- 🇫🇷 **Français** - Version française
- 🇬🇧 **English** - Version anglaise
- 🇮🇱 **עברית** - Version hébraïque (RTL automatique)

> ⚠️ **Important** : Éditez chaque langue séparément. Gardez la même structure dans les 3 versions.

---

## ✍️ Utiliser l'éditeur WYSIWYG

L'éditeur Quill vous permet de formater le contenu visuellement (What You See Is What You Get).

### Barre d'outils

| Icône | Fonction | Raccourci |
|-------|----------|-----------|
| **H1-H6** | Titres (1 à 6) | - |
| **B** | Gras | Ctrl+B (⌘+B) |
| **I** | Italique | Ctrl+I (⌘+I) |
| **U** | Souligné | Ctrl+U (⌘+U) |
| **S** | Barré | - |
| **1.** | Liste numérotée | - |
| **•** | Liste à puces | - |
| **🎨** | Couleur du texte | - |
| **🖍️** | Couleur de fond | - |
| **🔗** | Insérer un lien | Ctrl+K (⌘+K) |
| **🖼️** | Insérer une image | - |
| **🎬** | Insérer une vidéo | - |
| **🧹** | Nettoyer le formatage | - |

### Ajouter un lien

1. Sélectionnez le texte à transformer en lien
2. Cliquez sur l'icône **🔗** ou appuyez sur **Ctrl+K**
3. Entrez l'URL complète (ex: `https://israelgrowthventure.com/contact`)
4. Validez

### Ajouter une image

**Option A : Depuis une URL**
1. Cliquez sur l'icône **🖼️**
2. Collez l'URL de l'image
3. Validez

**Option B : Depuis la bibliothèque média**
1. Cliquez sur le bouton **📁 Médias** (en haut à droite)
2. Uploadez votre image ou sélectionnez-en une existante
3. Cliquez sur **"Copier URL"**
4. Fermez la bibliothèque
5. Cliquez sur l'icône **🖼️** dans l'éditeur
6. Collez l'URL copiée

---

## 📁 Bibliothèque Média

### Uploader des images

**Méthode 1 : Glisser-déposer**
1. Cliquez sur **📁 Médias**
2. Glissez vos images dans la zone de drop
3. Attendez la confirmation de l'upload

**Méthode 2 : Sélection de fichiers**
1. Cliquez sur **📁 Médias**
2. Cliquez dans la zone de drop
3. Sélectionnez vos images depuis votre ordinateur

### Formats acceptés
- **JPG / JPEG** (recommandé pour photos)
- **PNG** (recommandé pour logos, transparence)
- **GIF** (animations)
- **WebP** (format optimisé)

### Taille recommandée
- **Bannières** : 1920x1080 px
- **Logos** : 500x500 px
- **Images d'article** : 1200x800 px
- **Poids maximum** : 10 MB par fichier

### Utiliser une image de la bibliothèque

1. Cliquez sur une image dans la grille
2. Cliquez sur **"Copier URL"**
3. L'URL est copiée dans votre presse-papiers
4. Collez-la dans l'éditeur ou votre code HTML

---

## 💾 Sauvegarder vos modifications

### Sauvegarder
1. Après avoir édité le contenu, cliquez sur **💾 Sauvegarder**
2. Un message de confirmation apparaît : "Sauvegardé avec succès"
3. Vos modifications sont **immédiatement visibles** sur le site

> ⚠️ **Attention** : Les modifications sont publiées **instantanément**. Vérifiez bien votre contenu avant de sauvegarder.

### Annuler des modifications
- **Avant sauvegarde** : Changez simplement de page ou de langue sans sauvegarder
- **Après sauvegarde** : Rechargez la page et rééditez le contenu

---

## 🌍 Édition Multilingue

### Workflow recommandé

1. **Français (FR)** - Langue de base
   - Éditez d'abord la version française
   - Sauvegardez
   
2. **Anglais (EN)**
   - Sélectionnez "English"
   - Traduisez le contenu FR → EN
   - Gardez la **même structure** (titres, paragraphes, listes)
   - Sauvegardez
   
3. **Hébreu (HE)**
   - Sélectionnez "עברית"
   - Traduisez le contenu FR → HE
   - Le texte s'affiche **automatiquement de droite à gauche** (RTL)
   - Sauvegardez

### Bonnes pratiques

✅ **À faire :**
- Gardez la même structure dans les 3 langues
- Vérifiez l'affichage RTL pour l'hébreu
- Utilisez des images avec du texte international (éviter FR only)
- Testez les liens dans chaque langue

❌ **À éviter :**
- Copier-coller depuis Word (perd le formatage)
- Utiliser trop de couleurs différentes
- Insérer des images trop lourdes (> 2 MB)
- Oublier de traduire une langue

---

## 🔧 Astuces et raccourcis

### Raccourcis clavier
- **Gras** : `Ctrl+B` (Mac: `⌘+B`)
- **Italique** : `Ctrl+I` (Mac: `⌘+I`)
- **Lien** : `Ctrl+K` (Mac: `⌘+K`)
- **Annuler** : `Ctrl+Z` (Mac: `⌘+Z`)
- **Refaire** : `Ctrl+Y` (Mac: `⌘+Shift+Z`)

### Optimisation des images
Avant d'uploader, optimisez vos images :
- Utilisez [TinyPNG](https://tinypng.com) pour réduire le poids
- Redimensionnez aux dimensions recommandées
- Convertissez en WebP pour de meilleures performances

### Nettoyage du formatage
Si vous copiez du texte depuis Word/Google Docs :
1. Collez le texte dans l'éditeur
2. Sélectionnez tout le texte
3. Cliquez sur **🧹** (Clean) pour supprimer le formatage parasite
4. Reformatez manuellement

---

## ❗ Résolution de problèmes

### L'éditeur ne charge pas
- Rafraîchissez la page (F5)
- Vérifiez votre connexion internet
- Videz le cache du navigateur
- Réessayez de vous connecter

### L'image ne s'affiche pas
- Vérifiez que l'URL est correcte (commence par `https://`)
- Assurez-vous que le fichier est bien uploadé
- Testez l'URL dans un nouvel onglet

### La sauvegarde échoue
- Vérifiez votre connexion internet
- Reconnectez-vous à l'admin
- Contactez le support technique

### Le texte hébreu ne s'affiche pas correctement
- Vérifiez que vous avez bien sélectionné la langue "עברית"
- Le RTL est automatique, n'inversez pas manuellement
- Testez sur le site live après sauvegarde

---

## 📞 Support

### Besoin d'aide ?

**Email** : postmaster@israelgrowthventure.com  
**Téléphone** : +972 (à compléter)

### Signaler un bug

1. Décrivez le problème en détail
2. Indiquez la page et la langue concernées
3. Joignez une capture d'écran si possible
4. Envoyez par email au support

---

## 📚 Ressources

- **Documentation technique** : [CMS_DEPLOYMENT_REPORT.md](./CMS_DEPLOYMENT_REPORT.md)
- **API Backend** : https://igv-backend.onrender.com/api/docs
- **Site live** : https://israelgrowthventure.com

---

**Version** : 1.0  
**Dernière mise à jour** : Janvier 2026  
**Auteur** : Israel Growth Venture - Équipe Technique
