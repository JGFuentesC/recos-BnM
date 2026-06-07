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

describe('Collections Rules', () => {
  it('permite a un usuario crear un item en su colección', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertSucceeds(db.collection('collections').doc('item1').set({ userId: 'user123', contentId: 'movie1' }));
  });

  it('bloquea modificar la colección de otro usuario', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertFails(db.collection('collections').doc('item1').set({ userId: 'user456', contentId: 'movie1' }));
  });
});