const admin = require('../backend/src/firebase/admin');

async function createTestUser() {
  const email = 'test-traceability@example.com';
  const password = 'password123';
  
  try {
    let user;
    try {
      user = await admin.auth().getUserByEmail(email);
      console.log(`[SETUP] User already exists: ${user.uid}`);
    } catch (e) {
      user = await admin.auth().createUser({
        email,
        password,
        displayName: 'Traceability Test User'
      });
      console.log(`[SETUP] Created test user: ${user.uid}`);
    }
    return user;
  } catch (error) {
    console.error('[SETUP] Error:', error);
    process.exit(1);
  }
}

createTestUser();
