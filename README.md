# 🚀 KnachSoft License Server

**Serveur unifié** pour la gestion des licences KnachSoft avec panel d'administration intégré.

## 📦 Structure du projet

```
backend-server/
├── server.js              # Serveur Express principal
├── licenseGenerator.js    # Générateur de licences ES256
├── config.js              # Configuration (Firebase, clés, etc.)
├── serviceAccountKey.json # Clé Firebase Admin (à télécharger)
├── package.json           # Dépendances Node.js
├── client/                # Admin Panel React
│   ├── src/              # Code source React
│   ├── public/           # Fichiers publics React
│   ├── build/            # Build React (généré)
│   └── package.json      # Dépendances React
└── public/               # Build React copié (servi par Express)
```

## 🛠️ Installation

### 1. Installer toutes les dépendances (serveur + client)

```bash
cd backend-server
npm run install:all
```

### 2. Configuration Firebase

1. Téléchargez votre `serviceAccountKey.json` depuis la [Console Firebase](https://console.firebase.google.com)
2. Placez-le dans le dossier `backend-server/`
3. Copiez `config.example.js` vers `config.js` et configurez vos clés

## 🚀 Démarrage

### Option 1 : Build + Start (Production)

```bash
npm run start:all
```

Cette commande :
1. Compile le client React
2. Copie le build dans `public/`
3. Démarre le serveur Express

### Option 2 : Start uniquement (si déjà build)

```bash
npm start
```

### Option 3 : Développement avec auto-reload

```bash
npm run dev
```

## 🌐 Accès

Une fois démarré, le serveur est accessible sur **http://localhost:5000**

- **Admin Panel** : http://localhost:5000
- **API Backend** : http://localhost:5000/api
- **Health Check** : http://localhost:5000/health

## 📡 Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/license-requests` | Créer une demande de licence |
| GET | `/api/license-requests` | Liste des demandes |
| GET | `/api/license-requests/:id/status` | Statut d'une demande |
| POST | `/api/license-requests/:id/approve` | Approuver une demande |
| POST | `/api/license-requests/:id/reject` | Rejeter une demande |
| GET | `/api/check-name` | Vérifier disponibilité d'un nom |
| GET | `/health` | Status du serveur |

## 🔧 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarre le serveur |
| `npm run dev` | Démarre avec auto-reload (nodemon) |
| `npm run build` | Compile le client React |
| `npm run build:full` | Installe + compile le client |
| `npm run install:all` | Installe toutes les dépendances |
| `npm run start:all` | Build + Start complet |

## 🔐 Sécurité

- Les clés ES256 sont dans `licenseGenerator.js`
- Le fichier `serviceAccountKey.json` ne doit **JAMAIS** être commité
- Utilisez `.gitignore` pour exclure les fichiers sensibles

## 📝 Notes

- Le serveur sert automatiquement l'admin panel sur `/`
- Les routes API sont préfixées par `/api`
- Pas de problèmes CORS car tout est sur le même serveur
- Les fichiers React sont servis en statique depuis `public/`

## 🐛 Débogage

Si le serveur ne démarre pas :

1. Vérifiez que `serviceAccountKey.json` existe
2. Vérifiez que `config.js` est configuré
3. Vérifiez que le port 5000 n'est pas déjà utilisé
4. Consultez les logs dans la console

## 📧 Support

Pour toute question, contactez le support KnachSoft.
