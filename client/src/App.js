import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import LicenseRequestsList from './components/LicenseRequestsList';
import Login from './components/Login';
import { API_URL } from './config';
import './App.css';

// Configuration Firebase - KnachSoft
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
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        loadRequests();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [filter, user]);

  const loadRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/license-requests`, {
        params: { status: filter !== 'all' ? filter : undefined }
      });
      setRequests(response.data.requests);
      
      // Calculer les statistiques
      const allRequests = await axios.get(`${API_URL}/license-requests`);
      const stats = {
        pending: allRequests.data.requests.filter(r => r.status === 'pending').length,
        approved: allRequests.data.requests.filter(r => r.status === 'approved').length,
        rejected: allRequests.data.requests.filter(r => r.status === 'rejected').length
      };
      setStats(stats);
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setRequests([]);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const handleApprove = async (requestId, expiresAt) => {
    try {
      await axios.post(`${API_URL}/license-requests/${requestId}/approve`, {
        expiresAt: expiresAt || null
      });
      await loadRequests();
      alert('✅ Licence approuvée et envoyée au client !');
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('❌ Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      await axios.post(`${API_URL}/license-requests/${requestId}/reject`, {
        reason: reason || 'Non spécifié'
      });
      await loadRequests();
      alert('❌ Demande rejetée');
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('❌ Erreur lors du rejet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🔐 KnachSoft - Gestion des Licences
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Panel d'administration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">En Attente</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Approuvées</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.approved}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Rejetées</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{stats.rejected}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ En Attente
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Approuvées
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ Rejetées
            </button>
          </div>
        </div>

        {/* Requests List */}
        <LicenseRequestsList
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
          onRefresh={loadRequests}
        />
      </div>
    </div>
  );
}

export default App;

