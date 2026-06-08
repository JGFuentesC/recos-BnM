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

describe('Content Collection Rules', () => {
  it('permite a un usuario autenticado leer el catálogo', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertSucceeds(db.collection('content').doc('movie1').get());
  });

  it('bloquea a un usuario autenticado escribir en el catálogo', async () => {
    const db = testEnv.authenticatedContext('user123').firestore();
    await assertFails(db.collection('content').doc('movie1').set({ title: 'Hack' }));
  });
});