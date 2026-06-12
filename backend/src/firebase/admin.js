const admin = require('firebase-admin')

const useFirebaseEmulators =
  process.env.USE_FIREBASE_EMULATORS === 'true' ||
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  process.env.FIRESTORE_EMULATOR_HOST

if (useFirebaseEmulators && process.env.NODE_ENV !== 'production') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST =
    process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099'
  process.env.FIRESTORE_EMULATOR_HOST =
    process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'
}

if (!admin.apps.length) {
  const firebaseOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'proyectofinal-71637',
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    firebaseOptions.credential = admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    )
  }

  admin.initializeApp(firebaseOptions)
}

module.exports = admin
