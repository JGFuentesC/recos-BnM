const admin = require('firebase-admin')

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'proyectofinal-71637',
  })
}

module.exports = admin
