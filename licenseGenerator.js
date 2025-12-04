/**
 * Générateur de licences avec signature ES256 (ECDSA P-256)
 * Utilise les clés JWK existantes de KnachSoft
 */

const crypto = require('crypto');
const { subtle } = require('crypto').webcrypto;

// ════════════════════════════════════════════════════════════════════════════
// 🔑 CLÉS ES256 - KNACHSOFT
// ════════════════════════════════════════════════════════════════════════════
// ⚠️ Ces clés correspondent exactement au générateur JavaScript existant

const ES256_PRIVATE_JWK = {
  kty: 'EC',
  crv: 'P-256',
  // Clés publiques (doivent matcher LicenseService.cs)
  x: 'zi8FKUjUPnW9YN3CaQf1piXBiLpFzM_aFb-T8ExM8Hw',
  y: 'DchLUw4PPDAmobzSfZ6GV_ASB5-vBH508uI5Bh2Ah18',
  // Clé privée (à garder SECRET!)
  d: 'WeBRsjbAjiHr5pOq3oq-IrIr2-P885CIagyKCPiuOUI'
};

// ════════════════════════════════════════════════════════════════════════════
// 🔧 FONCTIONS UTILITAIRES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Encode en base64url (compatible avec le générateur JavaScript)
 */
function base64urlEncode(buffer) {
  const b64 = Buffer.from(buffer).toString('base64');
  return b64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

/**
 * Nettoie l'ID matériel (garde uniquement hex a-f0-9)
 */
function sanitizeHardwareId(hardwareId) {
  if (!hardwareId) return '';
  return hardwareId.toString().trim().toLowerCase().replace(/[^a-f0-9]/g, '');
}

/**
 * Encode en base64 (UTF-8 safe)
 */
function toBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

/**
 * Découpe la clé en groupes de 4 caractères avec tirets
 * (même format que le générateur JavaScript)
 */
function chunk4WithDashes(b64) {
  const groups = b64.match(/.{1,4}/g) || [];
  return groups.join('-');
}

// ════════════════════════════════════════════════════════════════════════════
// 🔐 SIGNATURE ES256
// ════════════════════════════════════════════════════════════════════════════

/**
 * Importe la clé privée JWK pour la signature
 */
async function importPrivateKeyEs256() {
  return await subtle.importKey(
    'jwk',
    ES256_PRIVATE_JWK,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

/**
 * Signe un message avec ES256 (ECDSA P-256)
 */
async function signEs256(messageUtf8) {
  const encoder = new TextEncoder();
  const msgData = encoder.encode(messageUtf8);
  const privateKey = await importPrivateKeyEs256();
  
  const signature = await subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    privateKey,
    msgData
  );
  
  return base64urlEncode(new Uint8Array(signature));
}

// ════════════════════════════════════════════════════════════════════════════
// 🎯 GÉNÉRATION DE LICENCE
// ════════════════════════════════════════════════════════════════════════════

/**
 * Génère une licence signée avec ES256
 * Format compatible avec le générateur JavaScript et l'app C#
 * 
 * @param {Object} licenseData - Données de la licence
 * @param {string} licenseData.hardwareFingerprint - Empreinte matérielle
 * @param {string} licenseData.clientName - Nom du client
 * @param {string|null} licenseData.expiresAt - Date d'expiration (ISO ou null)
 * @param {string} licenseData.issuedAt - Date d'émission (ISO)
 * @returns {Promise<string>} Clé de licence encodée en base64url avec tirets
 */
async function generateLicense(licenseData) {
  const { hardwareFingerprint, clientName, expiresAt, issuedAt } = licenseData;

  // Validation
  if (!hardwareFingerprint || !clientName) {
    throw new Error('hardwareFingerprint et clientName sont requis');
  }

  // Normaliser l'empreinte matérielle (garder uniquement hex)
  const normalizedFingerprint = sanitizeHardwareId(hardwareFingerprint);

  if (!normalizedFingerprint) {
    throw new Error('hardwareFingerprint invalide après normalisation');
  }

  // Créer le payload (même structure que le générateur JavaScript)
  const payload = {
    clientName: clientName,
    hardwareFingerprint: normalizedFingerprint,
    expiresAt: expiresAt || null,
    issuedAt: issuedAt || new Date().toISOString()
  };

  // Créer le message à signer (même format que JS)
  const signTarget = JSON.stringify({
    fingerprint: payload.hardwareFingerprint,
    clientName: payload.clientName,
    expiresAt: payload.expiresAt
  });

  console.log('📝 Message à signer:', signTarget);

  // Signer avec ES256
  try {
    const signature = await signEs256(signTarget);
    
    // Format de signature compatible avec l'app C#
    payload.signature = {
      alg: 'ES256',
      sig: signature
    };

    console.log('✅ Signature ES256 générée:', signature.substring(0, 32) + '...');
  } catch (error) {
    console.error('❌ Erreur signature ES256:', error);
    throw new Error('Erreur lors de la signature de la licence');
  }

  // Encoder en base64 (UTF-8 safe)
  const licenseJson = JSON.stringify(payload);
  const encoded = toBase64(licenseJson);

  // Découper avec tirets (même format que JS)
  const licenseKey = chunk4WithDashes(encoded);

  console.log('🔑 Licence générée pour:', clientName);
  console.log('   Longueur:', licenseKey.length, 'caractères');
  console.log('   Format:', licenseKey.substring(0, 20) + '...');

  return licenseKey;
}

// ════════════════════════════════════════════════════════════════════════════
// 🧪 VALIDATION DE LICENCE (pour tests)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Valide une licence (pour tests locaux)
 */
async function validateLicense(licenseKey, hardwareFingerprint) {
  try {
    // Retirer les tirets et décoder
    const normalized = licenseKey.replace(/-/g, '');
    const decoded = Buffer.from(normalized, 'base64').toString('utf8');
    const license = JSON.parse(decoded);

    console.log('🔍 Validation de la licence:', license.clientName);

    // Vérifier l'empreinte
    const normalizedLicense = sanitizeHardwareId(license.hardwareFingerprint);
    const normalizedCurrent = sanitizeHardwareId(hardwareFingerprint);

    if (normalizedLicense !== normalizedCurrent) {
      console.log('❌ Empreinte matérielle invalide');
      console.log('   Attendu:', normalizedLicense.substring(0, 16) + '...');
      console.log('   Reçu:', normalizedCurrent.substring(0, 16) + '...');
      return false;
    }

    // Vérifier l'expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      console.log('❌ Licence expirée:', license.expiresAt);
      return false;
    }

    console.log('✅ Licence valide');
    return true;
  } catch (error) {
    console.error('❌ Erreur validation:', error.message);
    return false;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 📤 EXPORTS
// ════════════════════════════════════════════════════════════════════════════

module.exports = {
  generateLicense,
  validateLicense,
  ES256_PRIVATE_JWK // Exporté pour référence (ne pas exposer publiquement!)
};

// ════════════════════════════════════════════════════════════════════════════
// 🧪 TEST LOCAL (si exécuté directement)
// ════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  (async () => {
    console.log('\n🧪 Test du générateur de licences\n');
    console.log('═'.repeat(60));

    // Données de test
    const testData = {
      hardwareFingerprint: 'abc123def456789012345678901234567890abcdef123456',
      clientName: 'Test Société',
      expiresAt: null, // Licence permanente
      issuedAt: new Date().toISOString()
    };

    try {
      console.log('\n📋 Génération d\'une licence de test...\n');
      const licenseKey = await generateLicense(testData);

      console.log('\n✅ Licence générée avec succès!\n');
      console.log('Client:', testData.clientName);
      console.log('Hardware ID:', testData.hardwareFingerprint.substring(0, 16) + '...');
      console.log('Expiration:', testData.expiresAt || 'Permanente');
      console.log('\nClé de licence:');
      console.log('─'.repeat(60));
      console.log(licenseKey);
      console.log('─'.repeat(60));

      // Test de validation
      console.log('\n🔍 Test de validation...\n');
      const isValid = await validateLicense(licenseKey, testData.hardwareFingerprint);
      
      if (isValid) {
        console.log('✅ Validation réussie!\n');
      } else {
        console.log('❌ Validation échouée!\n');
      }
    } catch (error) {
      console.error('\n❌ Erreur:', error.message);
      console.error(error.stack);
    }

    console.log('═'.repeat(60));
  })();
}
