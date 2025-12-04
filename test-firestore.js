const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

console.log('🔥 Test de connexion Firebase Admin...\n');
console.log('📋 Service Account:', serviceAccount.client_email);
console.log('📋 Project ID:', serviceAccount.project_id);
console.log('');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
  });

  console.log('✅ Firebase Admin initialisé\n');

  const db = admin.firestore();
  console.log('📊 Tentative d\'accès à Firestore...\n');

  // Essayer de lire une collection
  db.collection('test').limit(1).get()
    .then(snapshot => {
      console.log('✅ ✅ ✅ FIRESTORE FONCTIONNE ! ✅ ✅ ✅');
      console.log(`📦 Nombre de documents trouvés: ${snapshot.size}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ ERREUR FIRESTORE:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('');
      
      if (error.code === 16) {
        console.log('🚨 DIAGNOSTIC: Firestore n\'est probablement PAS ACTIVÉ !');
        console.log('');
        console.log('📝 SOLUTION:');
        console.log('1. Allez sur: https://console.firebase.google.com/project/knachsoft/firestore');
        console.log('2. Si vous voyez "Create database" → Cliquez dessus');
        console.log('3. Sélectionnez "Start in test mode"');
        console.log('4. Choisissez une région (ex: europe-west1)');
        console.log('5. Cliquez sur "Enable"');
        console.log('');
      }
      
      process.exit(1);
    });

} catch (error) {
  console.error('❌ Erreur initialisation:', error.message);
  process.exit(1);
}

