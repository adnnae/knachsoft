module.exports = {
  PORT: process.env.PORT || 5000,
  
  // Configuration Firebase
  FIREBASE_PROJECT_ID: 'knachsoft',
  FIREBASE_DATABASE_URL: 'https://knachsoft-default-rtdb.firebaseio.com',
  
  // Firebase credentials sont maintenant dans la variable d'environnement FIREBASE_CREDENTIALS
  // Pour développement local: créez un fichier .env avec FIREBASE_CREDENTIALS='{...json...}'
  
  ADMIN_PANEL_URL: 'https://knachsoft-admin.web.app'
};

