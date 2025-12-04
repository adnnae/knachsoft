# 🔑 Clés ES256 - KnachSoft

## ✅ Clés Déjà Configurées

Vos clés ES256 (ECDSA P-256) sont **déjà intégrées** dans le système !

### Clés JWK (JSON Web Key)

```javascript
{
  kty: 'EC',
  crv: 'P-256',
  x: 'FQJw6P7oQe5lO0l7n6P3VQbM7wqjL7AqY8y5jpl3w7E',  // Public
  y: '1b0h8bYh1i3q3zK0Rj6t2hmi8SgIY0R00V2x6CkF2lQ',  // Public
  d: 'qVqg1LZ2q9FJ3QG1KpO3X2YqQn7Z4oS5k4f2m1a0g9c'   // Privé (SECRET!)
}
```

---

## 📍 Où Sont Utilisées Ces Clés ?

### 1. Backend Server (Node.js)

**Fichier** : `backend-server/licenseGenerator.js`  
**Lignes** : 10-18

```javascript
const ES256_PRIVATE_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: 'FQJw6P7oQe5lO0l7n6P3VQbM7wqjL7AqY8y5jpl3w7E',
  y: '1b0h8bYh1i3q3zK0Rj6t2hmi8SgIY0R00V2x6CkF2lQ',
  d: 'qVqg1LZ2q9FJ3QG1KpO3X2YqQn7Z4oS5k4f2m1a0g9c'
};
```

**Utilisation** : Génération et signature des licences

---

### 2. Application C# (WPF)

**Fichier** : `Services/LicenseService.cs`  
**Lignes** : 20-21

```csharp
private static readonly string ES256_PUBLIC_JWK_X = "FQJw6P7oQe5lO0l7n6P3VQbM7wqjL7AqY8y5jpl3w7E";
private static readonly string ES256_PUBLIC_JWK_Y = "1b0h8bYh1i3q3zK0Rj6t2hmi8SgIY0R00V2x6CkF2lQ";
```

**Utilisation** : Validation des signatures de licences

---

## ✅ Vérification de Configuration

### Vérifier le Backend

```bash
cd backend-server
node licenseGenerator.js
```

**Résultat attendu** :
```
🧪 Test du générateur de licences
═══════════════════════════════════════════════════════════
✅ Licence générée avec succès!
```

### Vérifier l'Application C#

Ouvrez `Services/LicenseService.cs` et vérifiez les lignes 20-21 :

```csharp
// ✅ CORRECT :
private static readonly string ES256_PUBLIC_JWK_X = "FQJw6P7oQe5lO0l7n6P3VQbM7wqjL7AqY8y5jpl3w7E";
private static readonly string ES256_PUBLIC_JWK_Y = "1b0h8bYh1i3q3zK0Rj6t2hmi8SgIY0R00V2x6CkF2lQ";
```

---

## 🔒 Sécurité

### ⚠️ Clé Privée (Coordonnée 'd')

La valeur `d` est la **clé privée** et doit rester **SECRÈTE** :

```
d: 'qVqg1LZ2q9FJ3QG1KpO3X2YqQn7Z4oS5k4f2m1a0g9c'
```

**Points importants** :
- ✅ Stockée uniquement dans `licenseGenerator.js` (backend)
- ✅ **Jamais** dans l'application C#
- ✅ **Jamais** dans Git
- ✅ Utilisée uniquement pour **signer** les licences

### ✅ Clés Publiques (Coordonnées 'x' et 'y')

Les valeurs `x` et `y` sont les **clés publiques** :

```
x: 'FQJw6P7oQe5lO0l7n6P3VQbM7wqjL7AqY8y5jpl3w7E'
y: '1b0h8bYh1i3q3zK0Rj6t2hmi8SgIY0R00V2x6CkF2lQ'
```

**Points importants** :
- ✅ Peuvent être dans l'application C# (publiques)
- ✅ Utilisées pour **vérifier** les signatures
- ✅ Impossibles à utiliser pour **signer** sans la clé privée

---

## 🧪 Test de Génération

Pour tester que tout fonctionne :

```bash
cd backend-server
node licenseGenerator.js
```

Cela va :
1. Générer une licence de test
2. Valider la signature
3. Afficher la clé générée

**Si tout fonctionne → ✅ Configuration correcte !**

---

## 🔄 Compatibilité

Ces clés sont **100% compatibles** avec :

- ✅ Votre générateur JavaScript existant (HTML)
- ✅ Le nouveau backend Node.js
- ✅ L'application C# (LicenseService.cs)

**Même algorithme** : ECDSA P-256 (ES256)  
**Même format** : JWK (JSON Web Key)  
**Même signature** : IEEE P1363 (64 bytes)

---

## ⚠️ NE PAS Régénérer les Clés !

**Important** : Ces clés sont déjà utilisées dans votre générateur JavaScript existant.

❌ **NE PAS** exécuter de générateur qui créerait de nouvelles clés  
✅ **UTILISER** les clés existantes qui sont déjà configurées

**Raison** : Régénérer les clés invaliderait toutes les licences déjà émises !

---

## 📝 Si Vous Devez Changer les Clés (Futur)

⚠️ **Seulement si compromises ou nécessaire**

1. Générez de nouvelles clés JWK ES256
2. Mettez à jour `licenseGenerator.js`
3. Mettez à jour `LicenseService.cs`
4. Recompilez l'application C#
5. **IMPORTANT** : Les anciennes licences ne fonctionneront plus !

---

## ✅ Checklist

- [x] Clés configurées dans licenseGenerator.js
- [x] Clés publiques dans LicenseService.cs
- [ ] Vérifié avec `node licenseGenerator.js`
- [ ] Test de génération réussi
- [ ] Signature ES256 validée

---

**Vos clés sont prêtes à l'emploi !** 🚀

Passez maintenant à l'installation : `npm start` dans backend-server/

