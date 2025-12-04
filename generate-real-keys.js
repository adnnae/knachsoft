/**
 * 🔑 Générateur de VRAIES clés ES256 (ECDSA P-256) au format JWK
 * Ce script génère une paire de clés cryptographiques valides
 */

const { subtle } = require('crypto').webcrypto;
const fs = require('fs');

console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║           🔑 GÉNÉRATION DE CLÉS ES256 (ECDSA P-256) - JWK                   ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');

(async () => {
  try {
    console.log('⏳ Génération de la paire de clés en cours...\n');

    // Générer une paire de clés ECDSA P-256
    const keyPair = await subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true, // extractable
      ['sign', 'verify']
    );

    console.log('✅ Paire de clés générée avec succès!\n');

    // Exporter la clé privée au format JWK
    const privateKeyJwk = await subtle.exportKey('jwk', keyPair.privateKey);
    
    // Exporter la clé publique au format JWK
    const publicKeyJwk = await subtle.exportKey('jwk', keyPair.publicKey);

    console.log('📋 CLÉS JWK GÉNÉRÉES\n');
    console.log('═'.repeat(80));

    console.log('\n🔒 CLÉ PRIVÉE COMPLÈTE (JWK) :');
    console.log('─'.repeat(80));
    console.log(JSON.stringify(privateKeyJwk, null, 2));

    console.log('\n✅ CLÉ PUBLIQUE (JWK) :');
    console.log('─'.repeat(80));
    console.log(JSON.stringify(publicKeyJwk, null, 2));

    console.log('\n═'.repeat(80));
    console.log('\n📦 FORMAT POUR licenseGenerator.js :\n');
    console.log('─'.repeat(80));
    console.log('const ES256_PRIVATE_JWK = {');
    console.log(`  kty: '${privateKeyJwk.kty}',`);
    console.log(`  crv: '${privateKeyJwk.crv}',`);
    console.log(`  x: '${privateKeyJwk.x}',`);
    console.log(`  y: '${privateKeyJwk.y}',`);
    console.log(`  d: '${privateKeyJwk.d}'`);
    console.log('};');
    console.log('─'.repeat(80));

    console.log('\n📦 FORMAT POUR LicenseService.cs :\n');
    console.log('─'.repeat(80));
    console.log(`private static readonly string ES256_PUBLIC_JWK_X = "${publicKeyJwk.x}";`);
    console.log(`private static readonly string ES256_PUBLIC_JWK_Y = "${publicKeyJwk.y}";`);
    console.log('─'.repeat(80));

    // Sauvegarder dans un fichier
    const keysData = {
      generated_at: new Date().toISOString(),
      warning: 'GARDEZ CES CLÉS SECRÈTES! Ne les partagez JAMAIS!',
      private_key: privateKeyJwk,
      public_key: publicKeyJwk,
      usage: {
        private_key: 'backend-server/licenseGenerator.js',
        public_key: 'Services/LicenseService.cs'
      }
    };

    fs.writeFileSync('generated-keys.json', JSON.stringify(keysData, null, 2));
    console.log('\n💾 Clés sauvegardées dans : generated-keys.json\n');

    console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
    console.log('║                        ⚠️  PROCHAINES ÉTAPES                                 ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝\n');
    
    console.log('1️⃣  Copiez les valeurs JWK ci-dessus dans backend-server/licenseGenerator.js');
    console.log('    Remplacez les lignes 10-16 (ES256_PRIVATE_JWK)\n');
    
    console.log('2️⃣  Copiez les valeurs X et Y dans Services/LicenseService.cs');
    console.log('    Remplacez les lignes 20-21 (ES256_PUBLIC_JWK_X et ES256_PUBLIC_JWK_Y)\n');
    
    console.log('3️⃣  Testez avec : node test-license.js\n');

    console.log('═'.repeat(80));
    console.log('\n✨ Clés ES256 valides générées avec succès!\n');

  } catch (error) {
    console.error('\n❌ ERREUR lors de la génération des clés:\n');
    console.error('   Message:', error.message);
    console.error('\n   Stack trace:');
    console.error('   ' + error.stack.split('\n').join('\n   '));
    process.exit(1);
  }
})();

