import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

let testEnv;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'recos-bnm-test',
    firestore: { rules: readFileSync('src/firestore/firestore.rules', 'utf8') },
  });
});

afterAll(async () => { await testEnv.cleanup(); });

describe('Users Collection Rules', () => {
  it('permite a un usuario leer su propio documento', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertSucceeds(db.collection('users').doc('user123').get());
  });

  it('bloquea a un usuario leer el documento de otro', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertFails(db.collection('users').doc('user456').get());
  });
});