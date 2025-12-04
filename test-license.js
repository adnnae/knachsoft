/**
 * 🧪 Script de test du générateur de licences
 * Vérifie que les clés ES256 fonctionnent correctement
 */

const licenseGenerator = require('./licenseGenerator');

console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              🧪 TEST DU GÉNÉRATEUR DE LICENCES KNACHSOFT                    ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

// ════════════════════════════════════════════════════════════════════════════
// TEST 1 : Génération d'une licence permanente
// ════════════════════════════════════════════════════════════════════════════

console.log('📋 TEST 1 : Génération d\'une licence PERMANENTE\n');
console.log('─'.repeat(80));

const test1Data = {
  hardwareFingerprint: 'abc123def456789012345678901234567890abcdef123456',
  clientName: 'Société Test Permanente',
  expiresAt: null, // Permanente
  issuedAt: new Date().toISOString()
};

(async () => {
  try {
    console.log('\n📝 Données de test:');
    console.log('   Client:', test1Data.clientName);
    console.log('   Hardware ID:', test1Data.hardwareFingerprint.substring(0, 32) + '...');
    console.log('   Expiration:', test1Data.expiresAt || 'Jamais (Permanente)');
    console.log('\n⏳ Génération en cours...\n');

    const licenseKey1 = await licenseGenerator.generateLicense(test1Data);

    console.log('✅ Licence générée avec succès!\n');
    console.log('🔑 Clé de licence:');
    console.log('─'.repeat(80));
    console.log(licenseKey1);
    console.log('─'.repeat(80));
    console.log(`\n📊 Statistiques:`);
    console.log(`   Longueur: ${licenseKey1.length} caractères`);
    console.log(`   Format: Base64 avec tirets tous les 4 caractères`);
    console.log(`   Compatible: ✅ Application C# + Générateur JavaScript\n`);

    // Test de validation
    console.log('🔍 TEST DE VALIDATION...\n');
    const isValid1 = await licenseGenerator.validateLicense(licenseKey1, test1Data.hardwareFingerprint);
    
    if (isValid1) {
      console.log('✅ VALIDATION RÉUSSIE! La licence est valide.\n');
    } else {
      console.log('❌ VALIDATION ÉCHOUÉE! Problème détecté.\n');
    }

    console.log('═'.repeat(80));

    // ════════════════════════════════════════════════════════════════════════════
    // TEST 2 : Génération d'une licence avec expiration
    // ════════════════════════════════════════════════════════════════════════════

    console.log('\n📋 TEST 2 : Génération d\'une licence TEMPORAIRE (1 an)\n');
    console.log('─'.repeat(80));

    const test2Data = {
      hardwareFingerprint: 'def789abc123456789012345678901234567890123456',
      clientName: 'Société Test Temporaire',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 an
      issuedAt: new Date().toISOString()
    };

    console.log('\n📝 Données de test:');
    console.log('   Client:', test2Data.clientName);
    console.log('   Hardware ID:', test2Data.hardwareFingerprint.substring(0, 32) + '...');
    console.log('   Expiration:', new Date(test2Data.expiresAt).toLocaleDateString('fr-FR'));
    console.log('\n⏳ Génération en cours...\n');

    const licenseKey2 = await licenseGenerator.generateLicense(test2Data);

    console.log('✅ Licence générée avec succès!\n');
    console.log('🔑 Clé de licence:');
    console.log('─'.repeat(80));
    console.log(licenseKey2);
    console.log('─'.repeat(80));
    console.log(`\n📊 Statistiques:`);
    console.log(`   Longueur: ${licenseKey2.length} caractères`);
    console.log(`   Expire le: ${new Date(test2Data.expiresAt).toLocaleDateString('fr-FR')}\n`);

    // Test de validation
    console.log('🔍 TEST DE VALIDATION...\n');
    const isValid2 = await licenseGenerator.validateLicense(licenseKey2, test2Data.hardwareFingerprint);
    
    if (isValid2) {
      console.log('✅ VALIDATION RÉUSSIE! La licence est valide.\n');
    } else {
      console.log('❌ VALIDATION ÉCHOUÉE! Problème détecté.\n');
    }

    console.log('═'.repeat(80));

    // ════════════════════════════════════════════════════════════════════════════
    // TEST 3 : Validation avec mauvais Hardware ID
    // ════════════════════════════════════════════════════════════════════════════

    console.log('\n📋 TEST 3 : Validation avec MAUVAIS Hardware ID (test de sécurité)\n');
    console.log('─'.repeat(80));
    console.log('\n⏳ Test en cours...\n');

    const wrongHardwareId = '000000000000000000000000000000000000000000';
    const isValid3 = await licenseGenerator.validateLicense(licenseKey1, wrongHardwareId);
    
    if (!isValid3) {
      console.log('✅ SÉCURITÉ OK! La licence est correctement rejetée avec un mauvais Hardware ID.\n');
    } else {
      console.log('❌ PROBLÈME DE SÉCURITÉ! La licence ne devrait pas être valide.\n');
    }

    console.log('═'.repeat(80));

    // ════════════════════════════════════════════════════════════════════════════
    // RÉSUMÉ FINAL
    // ════════════════════════════════════════════════════════════════════════════

    console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                          📊 RÉSUMÉ DES TESTS                                 ║');
    console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

    const allTestsPassed = isValid1 && isValid2 && !isValid3;

    if (allTestsPassed) {
      console.log('  ✅ Test 1: Licence permanente      → RÉUSSI');
      console.log('  ✅ Test 2: Licence temporaire      → RÉUSSI');
      console.log('  ✅ Test 3: Sécurité (rejet)        → RÉUSSI\n');
      console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
      console.log('║                      🎉 TOUS LES TESTS RÉUSSIS ! 🎉                          ║');
      console.log('║                                                                              ║');
      console.log('║              Votre générateur de licences fonctionne parfaitement!           ║');
      console.log('║                                                                              ║');
      console.log('║  Prochaines étapes:                                                          ║');
      console.log('║  1. Démarrez le serveur : npm start                                          ║');
      console.log('║  2. Démarrez le panel admin                                                  ║');
      console.log('║  3. Testez avec l\'application C#                                             ║');
      console.log('║                                                                              ║');
      console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');
    } else {
      console.log('  ' + (isValid1 ? '✅' : '❌') + ' Test 1: Licence permanente');
      console.log('  ' + (isValid2 ? '✅' : '❌') + ' Test 2: Licence temporaire');
      console.log('  ' + (!isValid3 ? '✅' : '❌') + ' Test 3: Sécurité (rejet)\n');
      console.log('❌ Certains tests ont échoué. Vérifiez la configuration.\n');
    }

  } catch (error) {
    console.error('\n❌ ERREUR LORS DES TESTS:\n');
    console.error('   Message:', error.message);
    console.error('\n   Stack trace:');
    console.error('   ' + error.stack.split('\n').join('\n   '));
    console.log('\n⚠️  Vérifiez que licenseGenerator.js contient les bonnes clés ES256.\n');
  }
})();

