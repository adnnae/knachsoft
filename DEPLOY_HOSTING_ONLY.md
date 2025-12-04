# 🔥 Déploiement Firebase Hosting (Admin Panel uniquement)

## 📋 Étape 1 : Installer Firebase CLI

```bash
npm install -g firebase-tools
```

## 🔑 Étape 2 : Se connecter à Firebase

```bash
firebase login
```

## 🎯 Étape 3 : Initialiser Firebase Hosting

```bash
cd "E:\Nouveau dossier\KnachSoft\backend-server"
firebase init hosting
```

**Répondez aux questions :**

1. **Select a default Firebase project** → `knachsoft`
2. **What do you want to use as your public directory?** → `public`
3. **Configure as a single-page app?** → `Yes`
4. **Set up automatic builds?** → `No`
5. **File public/index.html already exists. Overwrite?** → `No`

## 📦 Étape 4 : Build de l'Admin Panel React

```bash
cd client
npm run build
cd ..
npm run copy-build
```

OU en une seule commande depuis `backend-server/` :

```bash
npm run build
```

## 🚀 Étape 5 : Déployer sur Firebase Hosting

```bash
firebase deploy --only hosting
```

## 🌐 Étape 6 : Accéder à l'Admin Panel

Après le déploiement, vous obtiendrez une URL :

```
✔ Deploy complete!

Hosting URL: https://knachsoft.web.app
```

Votre admin panel est maintenant accessible publiquement !

---

## ⚙️ Étape 7 : Configurer l'URL du Backend dans React

### **Option A : Backend sur serveur externe**

Si votre backend est sur un VPS avec IP publique ou domaine :

**`client/src/App.js`** :

```javascript
// Remplacez par l'URL de votre serveur backend
const API_URL = 'https://votre-domaine.com/api';
// OU
const API_URL = 'http://123.45.67.89:5000/api';
```

### **Option B : Backend sur machine locale (DEV uniquement)**

**⚠️ Ne fonctionnera PAS depuis Firebase Hosting !**

Pour le développement local uniquement :

```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 🔒 Étape 8 : Configurer CORS sur le Backend

Votre backend doit autoriser les requêtes depuis Firebase Hosting.

**`backend-server/server.js`** :

```javascript
app.use(cors({
  origin: [
    'https://knachsoft.web.app',           // URL Firebase Hosting
    'https://knachsoft.firebaseapp.com',    // URL alternative Firebase
    'http://localhost:3000',                 // Dev local
    'http://localhost:5000'                  // Dev local
  ],
  credentials: true
}));
```

---

## 🔄 Étape 9 : Mise à jour après modifications

À chaque fois que vous modifiez l'admin panel :

```bash
# 1. Rebuild React
cd client
npm run build

# 2. Copier dans public/
cd ..
npm run copy-build

# 3. Redéployer
firebase deploy --only hosting
```

---

## 🎨 Configuration du fichier firebase.json

Votre fichier `firebase.json` devrait ressembler à :

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🌐 Configuration du domaine personnalisé (Optionnel)

Si vous voulez utiliser votre propre domaine :

```bash
firebase hosting:channel:deploy production
firebase hosting:sites:list
```

Puis dans Firebase Console :
1. Allez dans **Hosting**
2. Cliquez sur **Add custom domain**
3. Suivez les instructions pour configurer les DNS

---

## 📊 Commandes utiles

| Commande | Description |
|----------|-------------|
| `firebase deploy --only hosting` | Déployer l'hosting |
| `firebase hosting:channel:deploy preview` | Déployer sur canal preview |
| `firebase hosting:sites:list` | Liste des sites |
| `firebase open hosting:site` | Ouvrir dans le navigateur |

---

## 💰 Coûts

**Plan Gratuit (Spark)** :
- ✅ 10 GB de stockage
- ✅ 360 MB/jour de transfert
- ✅ SSL automatique
- ✅ CDN mondial

**C'est largement suffisant pour un admin panel !**

---

## ✅ Checklist finale

- [ ] Firebase CLI installé
- [ ] `firebase login` effectué
- [ ] `firebase init hosting` configuré
- [ ] Admin Panel buildé
- [ ] CORS configuré sur le backend
- [ ] URL backend mise à jour dans `App.js`
- [ ] `firebase deploy --only hosting` exécuté
- [ ] Admin panel accessible via https://knachsoft.web.app
- [ ] Test de connexion admin
- [ ] Test d'approbation de licence

---

## 🆘 Dépannage

### **Erreur CORS** :
```
Access to XMLHttpRequest at 'http://...' from origin 'https://knachsoft.web.app' has been blocked by CORS
```

**Solution** : Ajoutez l'URL Firebase dans le CORS du backend (voir Étape 8)

### **Page blanche** :
```
Cannot GET /admin
```

**Solution** : Vérifiez que `"rewrites"` est bien configuré dans `firebase.json`

### **API non trouvée** :
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```

**Solution** : Vérifiez que l'URL du backend est correcte dans `App.js`

