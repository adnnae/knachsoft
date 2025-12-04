# 🎨 Panel d'Administration KnachSoft

Interface web React pour gérer les demandes de licences automatiques.

## 📋 Fonctionnalités

- ✅ Voir toutes les demandes de licence en temps réel
- ✅ Approuver et générer automatiquement les licences
- ✅ Rejeter les demandes non valides
- ✅ Créer automatiquement les comptes Firebase Auth
- ✅ Statistiques en temps réel
- ✅ Interface moderne avec Tailwind CSS

## 🚀 Installation

### 1. Installer les dépendances

```bash
cd admin-panel
npm install
```

### 2. Configurer Firebase

Modifiez `src/App.js` et remplacez la configuration Firebase :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "knachsoft.firebaseapp.com",
  projectId: "knachsoft",
  storageBucket: "knachsoft.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

### 3. Configurer l'URL du backend

Dans `src/App.js`, ligne 24 :

```javascript
const API_URL = 'http://localhost:5000/api';  // Mode dev
// const API_URL = 'https://your-backend.com/api';  // Mode production
```

### 4. Créer un compte administrateur

Dans Firebase Console > Authentication > Users, créez manuellement un utilisateur admin :

```
Email: admin@knachsoft.com
Mot de passe: [Votre mot de passe sécurisé]
```

## 🎯 Démarrage

### Mode développement

```bash
npm start
```

L'application s'ouvre sur `http://localhost:3000`

### Build production

```bash
npm run build
```

Les fichiers optimisés sont dans le dossier `build/`

## 📱 Utilisation

### 1. Connexion

- Utilisez vos identifiants Firebase Admin
- Email: `admin@knachsoft.com`
- Mot de passe: [Celui que vous avez créé]

### 2. Gérer les demandes

**Demandes en attente** :
1. Cliquez sur "En Attente" pour filtrer
2. Examinez les informations du client
3. Cliquez sur "✅ Approuver" ou "❌ Rejeter"

**Approuver une licence** :
1. Cliquez sur "Approuver"
2. Choisissez une date d'expiration (optionnel)
3. Confirmez

→ **La licence est automatiquement** :
- Générée avec signature ES256
- Envoyée à l'application cliente
- Stockée dans Firebase
- Un compte Firebase Auth est créé

**Rejeter une demande** :
1. Cliquez sur "Rejeter"
2. Indiquez une raison (optionnel)
3. Confirmez

## 🎨 Aperçu des Écrans

### Écran de connexion
```
┌─────────────────────────────┐
│        🔐 KnachSoft         │
│                             │
│   Email: ___________        │
│   Password: ________        │
│                             │
│   [ Se Connecter ]          │
└─────────────────────────────┘
```

### Dashboard principal
```
┌──────────────────────────────────────┐
│  ⏳ En Attente  │  ✅ Approuvées  │  ❌ Rejetées  │
│       3         │       45        │       2       │
├──────────────────────────────────────┤
│  Filtres: [Toutes] [En Attente] ... │
├──────────────────────────────────────┤
│  📋 Société ABC                      │
│  📧 societeabc@knachsoft.com         │
│  🖥️ Hardware ID: 7f8a9b2c...         │
│  [✅ Approuver] [❌ Rejeter]          │
└──────────────────────────────────────┘
```

## 🔒 Sécurité

- Authentification Firebase obligatoire
- CORS configuré pour le backend
- Tokens d'authentification gérés automatiquement
- Sessions persistantes

## 🌐 Déploiement

### Netlify

```bash
npm run build
# Glissez le dossier build/ sur Netlify
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🛠️ Technologies

- **React 18** - Framework UI
- **Tailwind CSS** - Styling moderne
- **Firebase Auth** - Authentification
- **Axios** - Requêtes HTTP
- **date-fns** - Formatage des dates

## 📞 Support

Pour toute question, contactez l'équipe KnachSoft.

---

**Développé avec ❤️ pour KnachSoft**

