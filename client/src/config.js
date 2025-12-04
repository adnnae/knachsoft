// Configuration de l'API Backend
// À modifier selon votre environnement

const config = {
  // En développement local
  development: {
    apiUrl: '/api' // Proxy local
  },
  
  // En production (Firebase Hosting)
  production: {
    // Backend hébergé sur Render.com
    apiUrl: 'https://knachsoft-backend.onrender.com/api'
  }
};

// Détection automatique de l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

export const API_URL = isDevelopment 
  ? config.development.apiUrl 
  : config.production.apiUrl;

export default config;

