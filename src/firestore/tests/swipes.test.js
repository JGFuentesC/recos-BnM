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

describe('Swipes Collection Rules', () => {
  it('permite a un usuario registrar su propio swipe', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertSucceeds(db.collection('swipes').doc('swipe1').set({ userId: 'user123', action: 'like' }));
  });

  it('bloquea registrar un swipe a nombre de otro usuario', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertFails(db.collection('swipes').doc('swipe1').set({ userId: 'user456', action: 'like' }));
  });
});