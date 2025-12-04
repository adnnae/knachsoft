/**
 * Serveur d'activation automatique de licences KnachSoft
 * 
 * Endpoints:
 * - POST /api/license-requests : Recevoir une demande de licence
 * - GET /api/license-requests/:id/status : Vérifier le statut d'une demande
 * - GET /api/license-requests : Liste toutes les demandes (pour l'admin)
 * - POST /api/license-requests/:id/approve : Approuver une demande
 * - POST /api/license-requests/:id/reject : Rejeter une demande
 * - GET /api/check-name : Vérifier la disponibilité d'un nom
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const licenseGenerator = require('./licenseGenerator');

// Charger la configuration
const config = require('./config');

// Initialiser Firebase Admin
try {
  console.log('🔥 Initialisation Firebase Admin...');
  
  // Utiliser directement le service account depuis config.js
  const serviceAccount = config.FIREBASE_SERVICE_ACCOUNT;
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.FIREBASE_DATABASE_URL
  });
  
  console.log('✅ Firebase Admin initialisé avec succès');
  console.log(`📊 Project ID: ${config.FIREBASE_PROJECT_ID}`);
} catch (error) {
  console.error('❌ Erreur initialisation Firebase:', error.message);
  console.error('📍 Stack:', error.stack);
  process.exit(1);
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(cors({
  origin: [
    config.ADMIN_PANEL_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'https://knachsoft.web.app',              // Firebase Hosting site principal
    'https://knachsoft.firebaseapp.com',      // Firebase Hosting alternative
    'https://knachsoft-admin.web.app',        // Firebase Hosting Admin Panel
    'https://knachsoft-admin.firebaseapp.com' // Firebase Hosting Admin alternative
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// Servir les fichiers statiques du React build (Admin Panel)
const adminPanelPath = path.join(__dirname, 'public');
app.use(express.static(adminPanelPath));

// ================== ROUTES ==================

/**
 * POST /api/license-requests
 * Recevoir une demande de licence depuis l'application C#
 */
app.post('/api/license-requests', async (req, res) => {
  try {
    const { clientName, hardwareFingerprint, machineInfo } = req.body;

    if (!clientName || !hardwareFingerprint) {
      return res.status(400).json({ 
        error: 'clientName et hardwareFingerprint sont requis' 
      });
    }

    // Vérifier si le nom est déjà utilisé (simplifié - pas d'index requis)
    const existingName = await db.collection('license-requests')
      .where('clientName', '==', clientName)
      .get();

    // Filtrer manuellement pour exclure les rejets
    const activeRequests = existingName.docs.filter(doc => doc.data().status !== 'rejected');
    
    if (activeRequests.length > 0) {
      return res.status(409).json({ 
        error: 'Ce nom est déjà utilisé',
        available: false
      });
    }

    // Générer un email
    const emailName = clientName.toLowerCase().replace(/\s+/g, '');
    const generatedEmail = `${emailName}@knachsoft.com`;

    // Vérifier si l'email existe déjà dans Firebase Auth
    let emailExists = false;
    try {
      await admin.auth().getUserByEmail(generatedEmail);
      emailExists = true;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        console.error('Erreur vérification email:', error);
      }
    }

    if (emailExists) {
      return res.status(409).json({ 
        error: 'Cet email existe déjà',
        available: false
      });
    }

    // Créer la demande
    const requestId = uuidv4();
    const request = {
      requestId,
      clientName,
      hardwareFingerprint,
      machineInfo: JSON.parse(machineInfo || '{}'),
      generatedEmail,
      status: 'pending',
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      approvedAt: null,
      licenseKey: null
    };

    await db.collection('license-requests').doc(requestId).set(request);

    console.log(`✅ Demande créée: ${clientName} (${requestId})`);

    res.status(201).json({
      requestId,
      generatedEmail,
      status: 'pending',
      message: 'Demande de licence enregistrée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur création demande:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/license-requests/:id/status
 * Vérifier le statut d'une demande (polling depuis l'application C#)
 */
app.get('/api/license-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('license-requests').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    const request = doc.data();

    res.json({
      status: request.status,
      licenseKey: request.licenseKey || null,
      approvedAt: request.approvedAt
    });

  } catch (error) {
    console.error('❌ Erreur récupération statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/license-requests
 * Liste toutes les demandes (pour le panel admin)
 */
app.get('/api/license-requests', async (req, res) => {
  try {
    const { status } = req.query;

    // Requête simplifiée sans orderBy pour éviter les index
    const snapshot = await db.collection('license-requests').get();
    let requests = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        ...data,
        requestedAt: data.requestedAt?.toDate()
      });
    });

    // Filtrer par statut si demandé
    if (status) {
      requests = requests.filter(r => r.status === status);
    }

    // Trier manuellement par date
    requests.sort((a, b) => {
      const dateA = a.requestedAt || new Date(0);
      const dateB = b.requestedAt || new Date(0);
      return dateB - dateA;
    });

    res.json({ requests });

  } catch (error) {
    console.error('❌ Erreur récupération demandes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/license-requests/:id/approve
 * Approuver une demande et générer la licence
 */
app.post('/api/license-requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body; // Optionnel: date d'expiration

    const docRef = db.collection('license-requests').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    const request = doc.data();

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Cette demande a déjà été traitée' });
    }

    // Générer la licence
    const licenseData = {
      hardwareFingerprint: request.hardwareFingerprint,
      clientName: request.clientName,
      expiresAt: expiresAt || null,
      issuedAt: new Date().toISOString()
    };

    const licenseKey = await licenseGenerator.generateLicense(licenseData);

    // Créer ou récupérer le compte Firebase Auth
    let firebaseUser;
    try {
      // Vérifier si l'utilisateur existe déjà
      try {
        firebaseUser = await admin.auth().getUserByEmail(request.generatedEmail);
        console.log(`✅ Compte Firebase existant trouvé: ${request.generatedEmail}`);
      } catch (getUserError) {
        // L'utilisateur n'existe pas, on le crée
        if (getUserError.code === 'auth/user-not-found') {
          const defaultPassword = generateRandomPassword();
          firebaseUser = await admin.auth().createUser({
            email: request.generatedEmail,
            password: defaultPassword,
            displayName: request.clientName,
            disabled: false
          });
          console.log(`✅ Nouveau compte Firebase créé: ${request.generatedEmail}`);
          console.log(`🔐 Mot de passe par défaut: ${defaultPassword}`);
        } else {
          throw getUserError;
        }
      }
    } catch (error) {
      console.error('❌ Erreur gestion compte Firebase:', error);
      return res.status(500).json({ error: 'Erreur création du compte utilisateur' });
    }

    // Mettre à jour la demande
    await docRef.update({
      status: 'approved',
      licenseKey,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      firebaseUserId: firebaseUser.uid
    });

    // Sauvegarder la licence dans Firestore
    await db.collection('licenses').doc(firebaseUser.uid).set({
      userId: firebaseUser.uid,
      email: request.generatedEmail,
      clientName: request.clientName,
      licenseKey,
      hardwareFingerprint: request.hardwareFingerprint,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      issuedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });

    console.log(`✅ Licence approuvée et générée pour ${request.clientName}`);

    res.json({
      success: true,
      licenseKey,
      email: request.generatedEmail,
      password: '(envoyé par email)', // Ne pas renvoyer le mot de passe
      message: 'Licence générée et envoyée au client'
    });

  } catch (error) {
    console.error('❌ Erreur approbation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /api/license-requests/:id/reject
 * Rejeter une demande
 */
app.post('/api/license-requests/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const docRef = db.collection('license-requests').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    await docRef.update({
      status: 'rejected',
      rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
      rejectionReason: reason || 'Non spécifié'
    });

    console.log(`❌ Demande rejetée: ${id}`);

    res.json({
      success: true,
      message: 'Demande rejetée'
    });

  } catch (error) {
    console.error('❌ Erreur rejet:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /api/check-name
 * Vérifier la disponibilité d'un nom
 */
app.get('/api/check-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Paramètre name requis' });
    }

    const snapshot = await db.collection('license-requests')
      .where('clientName', '==', name)
      .get();

    // Filtrer manuellement pour exclure les rejets
    const activeRequests = snapshot.docs.filter(doc => doc.data().status !== 'rejected');
    const available = activeRequests.length === 0;
    const emailName = name.toLowerCase().replace(/\s+/g, '');
    const suggestedEmail = `${emailName}@knachsoft.com`;

    res.json({
      available,
      suggestedEmail: available ? suggestedEmail : null
    });

  } catch (error) {
    console.error('❌ Erreur vérification nom:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * GET /health
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Catch-all route pour l'admin panel React
 * Doit être APRÈS toutes les routes API
 */
app.get('*', (req, res) => {
  // Si c'est une route API, retourner 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route non trouvée' });
  }
  
  // Sinon, servir l'index.html du React
  res.sendFile(path.join(adminPanelPath, 'index.html'));
});

// Mot de passe par défaut pour tous les comptes
function generateRandomPassword(length = 16) {
  // Mot de passe par défaut: 12345678
  return '12345678';
}

// Démarrage du serveur
const PORT = process.env.PORT || config.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Serveur KnachSoft License démarré sur le port ${PORT}`);
  console.log(`📡 API disponible à: http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health\n`);
});

