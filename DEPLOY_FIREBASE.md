# 🚀 Déploiement sur Firebase

## 📋 Prérequis

1. **Firebase CLI installé** :
```bash
npm install -g firebase-tools
```

2. **Connexion à Firebase** :
```bash
firebase login
```

3. **Initialiser Firebase dans le projet** :
```bash
cd backend-server
firebase init
```

Sélectionnez :
- ✅ **Hosting** : Configure files for Firebase Hosting
- ✅ **Functions** : Configure a Cloud Functions directory

---

## 🏗️ Structure après initialisation

```
backend-server/
├── public/                 # Build React (Admin Panel)
├── functions/              # Cloud Functions (API Backend)
│   ├── index.js           # Point d'entrée
│   ├── package.json
│   └── node_modules/
├── server.js              # Serveur local (dev)
├── licenseGenerator.js
├── config.js
├── serviceAccountKey.json
└── firebase.json
```

---

## 📦 Étape 1 : Préparer Cloud Functions

### **Créer `functions/index.js`** :

```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialiser Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Importer votre logique serveur
// (Copiez le contenu de server.js ici, en adaptant)

// Routes API
app.post('/license-requests', async (req, res) => {
  // ... votre logique
});

app.get('/license-requests', async (req, res) => {
  // ... votre logique
});

// ... autres routes

// Exporter la fonction
exports.api = functions.https.onRequest(app);
```

### **Installer les dépendances dans functions/** :

```bash
cd functions
npm install express cors firebase-admin firebase-functions elliptic uuid
```

---

## 🎨 Étape 2 : Build de l'Admin Panel

```bash
# Depuis le dossier backend-server
npm run build
```

Cela compile React et copie le build dans `public/`.

---

## 🚀 Étape 3 : Déployer sur Firebase

### **Déploiement complet** :

```bash
firebase deploy
```

### **Déployer uniquement Hosting** :

```bash
firebase deploy --only hosting
```

### **Déployer uniquement Functions** :

```bash
firebase deploy --only functions
```

---

## 🌐 URLs après déploiement

- **Admin Panel** : `https://knachsoft.web.app` ou `https://knachsoft.firebaseapp.com`
- **API Backend** : `https://us-central1-knachsoft.cloudfunctions.net/api`

---

## ⚙️ Configuration

### **Mettre à jour l'URL dans le C#** :

Dans `Services/LicenseRequestService.cs` :

```csharp
private const string BACKEND_URL = "https://us-central1-knachsoft.cloudfunctions.net/api";
```

### **Mettre à jour dans le React** :

Dans `admin-panel/src/App.js` :

```javascript
const API_URL = '/api'; // Les rewrites Firebase géreront la redirection
```

---

## 💰 Coûts Firebase

### **Plan Gratuit (Spark)** :
- ✅ Firestore : 1 GB stockage
- ✅ Hosting : 10 GB/mois
- ✅ Functions : 125K invocations/mois
- ✅ Authentication : Illimité

### **Si vous dépassez** → Plan Blaze (pay-as-you-go)

---

## 🔒 Sécurité

### **Variables d'environnement** :

```bash
# Configurer les secrets
firebase functions:config:set license.private_key="votre_clé_privée"
firebase functions:config:set license.public_key_x="votre_clé_x"
firebase functions:config:set license.public_key_y="votre_clé_y"
```

### **Accéder dans le code** :

```javascript
const privateKey = functions.config().license.private_key;
```

---

## 🧪 Test en local avant déploiement

```bash
firebase emulators:start
```

Cela démarre :
- Hosting sur `http://localhost:5000`
- Functions sur `http://localhost:5001`

---

## 📝 Commandes utiles

| Commande | Description |
|----------|-------------|
| `firebase login` | Se connecter |
| `firebase projects:list` | Liste des projets |
| `firebase use knachsoft` | Sélectionner le projet |
| `firebase deploy` | Déployer tout |
| `firebase hosting:channel:deploy preview` | Déployer sur un canal de preview |
| `firebase functions:log` | Voir les logs des functions |

---

## ✅ Checklist de déploiement

- [ ] Firebase CLI installé
- [ ] `firebase login` effectué
- [ ] `firebase init` effectué
- [ ] Admin Panel buildé (`npm run build`)
- [ ] Functions configurées dans `functions/`
- [ ] `serviceAccountKey.json` ajouté (si nécessaire)
- [ ] `firebase deploy` exécuté
- [ ] URL backend mise à jour dans le C#
- [ ] Test de l'activation de licence

---

## 🆘 Support

En cas de problème :
1. Vérifiez les logs : `firebase functions:log`
2. Testez en local : `firebase emulators:start`
3. Consultez la doc : https://firebase.google.com/docs

