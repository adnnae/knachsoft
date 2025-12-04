/**
 * Firebase Cloud Functions pour KnachSoft License Server
 * API Backend hébergé sur Firebase
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const licenseGenerator = require('./licenseGenerator');

// Initialiser Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Créer l'app Express
const app = express();

// Middleware
app.use(cors({ origin: true })); // Accepter toutes les origines pour Cloud Functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// ================== ROUTES ==================

/**
 * POST /license-requests
 */
app.post('/license-requests', async (req, res) => {
  try {
    const { clientName, hardwareFingerprint, machineInfo } = req.body;

    if (!clientName || !hardwareFingerprint) {
      return res.status(400).json({ 
        error: 'clientName et hardwareFingerprint sont requis' 
      });
    }

    const existingName = await db.collection('license-requests')
      .where('clientName', '==', clientName)
      .get();

    const activeRequests = existingName.docs.filter(doc => doc.data().status !== 'rejected');
    
    if (activeRequests.length > 0) {
      return res.status(409).json({ 
        error: 'Ce nom est déjà utilisé',
        available: false
      });
    }

    const emailName = clientName.toLowerCase().replace(/\\s+/g, '');
    const generatedEmail = `${emailName}@knachsoft.com`;

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
 * GET /license-requests/:id/status
 */
app.get('/license-requests/:id/status', async (req, res) => {
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
 * GET /license-requests
 */
app.get('/license-requests', async (req, res) => {
  try {
    const { status } = req.query;

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

    if (status) {
      requests = requests.filter(r => r.status === status);
    }

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
 * POST /license-requests/:id/approve
 */
app.post('/license-requests/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body;

    const docRef = db.collection('license-requests').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    const request = doc.data();

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Cette demande a déjà été traitée' });
    }

    const licenseData = {
      hardwareFingerprint: request.hardwareFingerprint,
      clientName: request.clientName,
      expiresAt: expiresAt || null,
      issuedAt: new Date().toISOString()
    };

    const licenseKey = await licenseGenerator.generateLicense(licenseData);

    let firebaseUser;
    try {
      try {
        firebaseUser = await admin.auth().getUserByEmail(request.generatedEmail);
        console.log(`✅ Compte Firebase existant trouvé: ${request.generatedEmail}`);
      } catch (getUserError) {
        if (getUserError.code === 'auth/user-not-found') {
          const defaultPassword = '12345678';
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

    await docRef.update({
      status: 'approved',
      licenseKey,
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      firebaseUserId: firebaseUser.uid
    });

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
      message: 'Licence générée et envoyée au client'
    });

  } catch (error) {
    console.error('❌ Erreur approbation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

/**
 * POST /license-requests/:id/reject
 */
app.post('/license-requests/:id/reject', async (req, res) => {
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
 * GET /check-name
 */
app.get('/check-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Paramètre name requis' });
    }

    const snapshot = await db.collection('license-requests')
      .where('clientName', '==', name)
      .get();

    const activeRequests = snapshot.docs.filter(doc => doc.data().status !== 'rejected');
    const available = activeRequests.length === 0;
    const emailName = name.toLowerCase().replace(/\\s+/g, '');
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
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Exporter l'API en tant que Cloud Function
exports.api = functions.https.onRequest(app);

