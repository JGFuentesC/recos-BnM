/**
 * seed.js — Puebla el emulador de Firestore con datos de prueba.
 * Uso: FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seed.js <uid>
 *
 * El Admin SDK bypasea las security rules → escribe sin restricciones.
 */

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_PROJECT_ID     = 'recos-bnm'

const admin = require('../src/firebase/admin')
const db    = admin.firestore()

const uid = process.argv[2]
if (!uid) { console.error('Uso: node scripts/seed.js <uid>'); process.exit(1) }

async function seed() {
  const batch = db.batch()

  // ── Perfil de usuario ────────────────────────────────────────────────
  batch.set(db.collection('users').doc(uid), {
    email: 'luis@test.com',
    prefs: { genres: ['Sci-Fi', 'Action'] },
  })

  // ── Películas ────────────────────────────────────────────────────────
  const movies = [
    { id: 'movie-001', title: 'Inception',     genres: ['Action','Sci-Fi'],  rating: 8.8, popularity: 95.5, year: 2010, synopsis: 'Un ladrón roba secretos a través de los sueños.' },
    { id: 'movie-002', title: 'Interstellar',  genres: ['Sci-Fi','Drama'],   rating: 8.6, popularity: 88.2, year: 2014, synopsis: 'Exploradores viajan a través de un agujero de gusano.' },
    { id: 'movie-003', title: 'The Dark Knight',genres: ['Action','Drama'],  rating: 9.0, popularity: 99.0, year: 2008, synopsis: 'Batman enfrenta al Joker en Gotham City.' },
    { id: 'movie-004', title: 'Parasite',       genres: ['Drama','Thriller'], rating: 8.5, popularity: 82.1, year: 2019, synopsis: 'Una familia pobre se infiltra en una familia rica.' },
  ]

  // ── Libros ───────────────────────────────────────────────────────────
  const books = [
    { id: 'book-001', title: 'Dune',                    genres: ['Sci-Fi','Adventure'], rating: 8.7, popularity: 91.7, year: 1965, synopsis: 'Paul Atreides en el planeta desértico Arrakis.' },
    { id: 'book-002', title: 'El Señor de los Anillos', genres: ['Fantasy','Adventure'],rating: 9.0, popularity: 99.1, year: 1954, synopsis: 'Un hobbit debe destruir el Anillo Único.' },
    { id: 'book-003', title: 'Neuromante',               genres: ['Sci-Fi','Cyberpunk'], rating: 8.2, popularity: 74.3, year: 1984, synopsis: 'Un hacker es contratado para una misión en el ciberespacio.' },
  ]

  const allContent = [
    ...movies.map(m => ({ ...m, type: 'movie', source: 'tmdb',         cover: `https://image.tmdb.org/t/p/w500/${m.id}.jpg` })),
    ...books.map(b  => ({ ...b, type: 'book',  source: 'google_books', cover: `https://covers.openlibrary.org/b/id/${b.id}-L.jpg` })),
  ]

  for (const { id, ...data } of allContent) {
    batch.set(db.collection('content').doc(id), {
      ...data,
      externalId: id,
      syncedAt: new Date().toISOString(),
    })
  }

  // ── Un swipe previo (para probar que feed lo excluye) ────────────────
  batch.set(db.collection('swipes').doc('swipe-test-001'), {
    userId:      uid,
    contentId:   'movie-004',  // Parasite ya fue visto
    contentType: 'movie',
    action:      'like',
    timestamp:   admin.firestore.FieldValue.serverTimestamp(),
  })

  await batch.commit()

  const snap = await db.collection('content').get()
  console.log(`\n✅ Seed completado:`)
  console.log(`   👤 Usuario: ${uid}  (géneros: Sci-Fi, Action)`)
  console.log(`   🎬 ${movies.length} películas`)
  console.log(`   📚 ${books.length} libros`)
  console.log(`   👁  movie-004 (Parasite) marcado como ya visto\n`)
  snap.docs.forEach(d => {
    const { title, type } = d.data()
    console.log(`   [${type}] ${title}`)
  })
  process.exit(0)
}

seed().catch(err => { console.error('Error en seed:', err.message); process.exit(1) })
