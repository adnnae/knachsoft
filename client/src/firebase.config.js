/**
 * Configuration Firebase pour KnachSoft
 * Panel d'administration des licences
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBllj8GhX71zT2f_d6ONteZjrSibRjSBfw",
  authDomain: "knachsoft.firebaseapp.com",
  projectId: "knachsoft",
  storageBucket: "knachsoft.firebasestorage.app",
  messagingSenderId: "623641589801",
  appId: "1:623641589801:web:47763e26f3ac07f983c438",
  measurementId: "G-6TB2HTR54F"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;

