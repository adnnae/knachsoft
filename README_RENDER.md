# 🚀 Déploiement sur Render.com

## 📋 Étapes de déploiement

### 1️⃣ Créer un repository Git (si pas déjà fait)

```bash
cd "E:\Nouveau dossier\KnachSoft\backend-server"
git init
git add .
git commit -m "Initial commit - KnachSoft Backend"
```

### 2️⃣ Pousser sur GitHub

1. Créez un nouveau repo sur GitHub : `knachsoft-backend`
2. Ajoutez le remote :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/knachsoft-backend.git
git branch -M main
git push -u origin main
```

### 3️⃣ Configurer sur Render.com

1. Sur https://dashboard.render.com/web/new :
   - **Connect your repository** → Sélectionnez `knachsoft-backend`
   - **Name** : `knachsoft-backend`
   - **Region** : `Frankfurt (EU Central)` (plus proche)
   - **Branch** : `main`
   - **Root Directory** : (laisser vide)
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server.js`
   - **Plan** : `Free`

2. Cliquez sur **"Advanced"** et ajoutez les **Environment Variables** :

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

3. Cliquez sur **"Create Web Service"**

### 4️⃣ Ajouter serviceAccountKey.json

⚠️ **IMPORTANT** : Le fichier `serviceAccountKey.json` ne doit PAS être dans Git !

**Sur Render.com** :
1. Allez dans **Environment** → **Secret Files**
2. Cliquez sur **"Add Secret File"**
3. **Filename** : `serviceAccountKey.json`
4. **Contents** : Copiez-collez le contenu de votre fichier local

### 5️⃣ Récupérer l'URL du service

Une fois déployé, vous obtiendrez une URL comme :
```
https://knachsoft-backend.onrender.com
```

### 6️⃣ Mettre à jour l'Admin Panel

Dans `client/src/config.js` :

```javascript
production: {
  apiUrl: 'https://knachsoft-backend.onrender.com/api'
}
```

Puis redéployez sur Firebase :

```bash
npm run build
firebase deploy --only hosting:admin
```

### 7️⃣ Mettre à jour l'application C#

Dans `Services/LicenseRequestService.cs` :

```csharp
private const string BACKEND_URL = "https://knachsoft-backend.onrender.com/api";
```

---

## ⚙️ Configuration CORS (déjà fait)

Le serveur est déjà configuré pour accepter les requêtes depuis :
- `https://knachsoft-admin.web.app`
- `https://knachsoft-admin.firebaseapp.com`

---

## 📊 Limites du plan gratuit

- ✅ 750 heures/mois
- ✅ SSL automatique (HTTPS)
- ⚠️ Se met en veille après 15 min d'inactivité
- ⚠️ Redémarre en ~30 secondes à la première requête

---

## 🔄 Mises à jour

Pour déployer des modifications :

```bash
git add .
git commit -m "Description des changements"
git push
```

Render redéploiera automatiquement ! 🚀

---

## 🆘 Dépannage

### Le service ne démarre pas
- Vérifiez les logs : Dashboard → Logs
- Vérifiez que `serviceAccountKey.json` est dans Secret Files

### Erreur Firebase
- Vérifiez que le fichier `serviceAccountKey.json` est correct
- Vérifiez les permissions Firestore

### Erreur CORS
- Ajoutez votre domaine dans `server.js` ligne 53-64

