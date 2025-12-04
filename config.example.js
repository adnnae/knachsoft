// Configuration du serveur
// Copiez ce fichier en config.js et remplissez vos valeurs

module.exports = {
  // Port du serveur
  PORT: process.env.PORT || 5000,

  // Chemin vers le fichier serviceAccountKey.json de Firebase
  // Téléchargez-le depuis Firebase Console > Project Settings > Service Accounts
  FIREBASE_SERVICE_ACCOUNT_PATH: './serviceAccountKey.json',

  // URL du panel admin React (pour CORS)
  ADMIN_PANEL_URL: 'http://localhost:3000',

  // URL de la base de données Firebase Realtime Database
  // ⚠️ Vérifiez votre région dans Firebase Console > Realtime Database
  FIREBASE_DATABASE_URL: 'https://knachsoft-default-rtdb.firebaseio.com',
  
  // Projet Firebase ID
  FIREBASE_PROJECT_ID: 'knachsoft'
};

