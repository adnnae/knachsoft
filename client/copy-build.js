/**
 * Script pour copier le build React dans le dossier backend-server/public
 */

const fs = require('fs-extra');
const path = require('path');

const sourcePath = path.join(__dirname, 'build');
const destPath = path.join(__dirname, '..', 'public');

console.log('📦 Copie du build React...');
console.log(`   Source: ${sourcePath}`);
console.log(`   Destination: ${destPath}`);

try {
  // Supprimer l'ancien dossier public s'il existe
  if (fs.existsSync(destPath)) {
    fs.removeSync(destPath);
    console.log('🗑️  Ancien build supprimé');
  }

  // Copier le nouveau build
  fs.copySync(sourcePath, destPath);
  console.log('✅ Build copié avec succès !');
  console.log(`\n🚀 Vous pouvez maintenant démarrer le serveur avec: npm start`);
} catch (error) {
  console.error('❌ Erreur lors de la copie:', error.message);
  process.exit(1);
}

