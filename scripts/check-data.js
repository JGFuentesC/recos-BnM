const admin = require('../backend/src/firebase/admin');
const db = admin.firestore();

async function checkContent() {
  const snap = await db.collection('content').limit(1).get();
  if (snap.empty) {
    console.log('[DATA] Collection "content" is EMPTY.');
  } else {
    console.log(`[DATA] Collection "content" is populated. Found: ${snap.docs[0].id}`);
  }
}

checkContent();
