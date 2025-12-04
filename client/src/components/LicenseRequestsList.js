import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function LicenseRequestsList({ requests, onApprove, onReject, onRefresh }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [expiresAt, setExpiresAt] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setExpiresAt('');
    setShowApproveModal(true);
  };

  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (selectedRequest) {
      await onApprove(selectedRequest.requestId || selectedRequest.id, expiresAt || null);
      setShowApproveModal(false);
      setSelectedRequest(null);
    }
  };

  const confirmReject = async () => {
    if (selectedRequest) {
      await onReject(selectedRequest.requestId || selectedRequest.id, rejectReason);
      setShowRejectModal(false);
      setSelectedRequest(null);
    }
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucune demande
        </h3>
        <p className="text-gray-500">
          Les nouvelles demandes de licence apparaîtront ici
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id || request.requestId}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {request.clientName}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {request.status === 'pending'
                        ? '⏳ En attente'
                        : request.status === 'approved'
                        ? '✅ Approuvée'
                        : '❌ Rejetée'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">📧 Email généré</p>
                      <p className="font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded">
                        {request.generatedEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 mb-1">📅 Date de demande</p>
                      <p className="text-gray-900">
                        {request.requestedAt
                          ? format(new Date(request.requestedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-gray-500 mb-1">🖥️ ID Machine</p>
                      <p className="font-mono text-xs text-gray-900 bg-gray-50 px-3 py-2 rounded break-all">
                        {request.hardwareFingerprint}
                      </p>
                    </div>

                    {request.machineInfo && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 mb-1">ℹ️ Informations machine</p>
                        <pre className="text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded overflow-x-auto">
                          {JSON.stringify(request.machineInfo, null, 2)}
                        </pre>
                      </div>
                    )}

                    {request.licenseKey && (
                      <div className="md:col-span-2">
                        <p className="text-gray-500 mb-1">🔑 Clé de licence générée</p>
                        <p className="font-mono text-xs text-gray-900 bg-green-50 px-3 py-2 rounded break-all">
                          {request.licenseKey}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleApproveClick(request)}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    ✅ Approuver et Générer la Licence
                  </button>
                  <button
                    onClick={() => handleRejectClick(request)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    ❌ Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'approbation */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ✅ Approuver la Licence
            </h3>
            <p className="text-gray-600 mb-6">
              Client: <span className="font-semibold">{selectedRequest?.clientName}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration (optionnel)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                Laissez vide pour une licence permanente
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmApprove}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirmer
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ❌ Rejeter la Demande
            </h3>
            <p className="text-gray-600 mb-6">
              Client: <span className="font-semibold">{selectedRequest?.clientName}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du rejet (optionnel)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Ex: Informations incomplètes..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmReject}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Confirmer le Rejet
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LicenseRequestsList;

