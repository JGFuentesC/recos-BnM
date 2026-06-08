/**
 * Tests para GET /api/content/:id
 *
 * Mocks:
 *   - firebase-admin → Firestore en memoria (sin emulador)
 *   - auth middleware → inyecta req.user directamente
 *
 * Requiere devDependencies: jest, supertest
 *   (coordinar alta en backend/package.json con Andrés González).
 */

const request = require('supertest')
const express = require('express')

// ─── Datos de mock ──────────────────────────────────────────────────────────
const mockDocs = {
  'movie-tmdb': {
    type: 'movie',
    title: 'Inception',
    cover: 'http://img/inception.jpg',
    year: 2010,
    genres: ['Action', 'Sci-Fi'],
    creator: ['Christopher Nolan'],
    synopsis: 'A thief who steals corporate secrets through dream-sharing.',
    rating: 8.8,
    watchProviders: ['Netflix', 'Disney+'],
    source: 'tmdb',
    // Campos internos que NO deben filtrarse en la respuesta:
    externalId: 'tmdb-27205',
    popularity: 150,
    syncedAt: '2026-06-06T00:00:00Z',
  },
  'book-no-providers': {
    type: 'book',
    title: 'The Great Gatsby',
    cover: 'http://img/gatsby.jpg',
    year: 1925,
    genres: ['Classic'],
    creator: ['F. Scott Fitzgerald'],
    synopsis: 'A portrait of the Jazz Age in all its decadence and excess.',
    rating: 7.2,
    // watchProviders ausente a propósito → debe normalizarse a []
    source: 'google_books',
  },
}

const makeDoc = (id) => ({
  id,
  exists: Boolean(mockDocs[id]),
  data: () => mockDocs[id],
})

const mockCollection = jest.fn().mockImplementation((col) => {
  if (col === 'content') {
    return {
      doc: jest.fn().mockImplementation((id) => ({
        get: jest.fn().mockResolvedValue(makeDoc(id)),
      })),
    }
  }
})

// ─── Mock firebase/admin ──────────────────────────────────────────────────────
jest.mock('../src/firebase/admin', () => {
  const firestoreFn = jest.fn(() => ({ collection: mockCollection }))
  firestoreFn.FieldValue = { serverTimestamp: jest.fn() }
  return { firestore: firestoreFn, auth: jest.fn() }
})

// ─── Mock auth middleware ─────────────────────────────────────────────────────
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token' })
  }
  req.user = { uid: 'user-test-123', email: 'hector@test.com' }
  return next()
})

// ─── App setup ────────────────────────────────────────────────────────────────
const contentRouter = require('../src/routes/content')
const app = express()
app.use(express.json())
app.use('/api/content', contentRouter)

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('GET /api/content/:id', () => {

  test('401 — sin token de autorización', async () => {
    const res = await request(app).get('/api/content/movie-tmdb')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('missing_token')
  })

  test('404 — id que no existe', async () => {
    const res = await request(app)
      .get('/api/content/no-existe')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Content not found')
  })

  test('200 — objeto completo con los campos esperados', async () => {
    const res = await request(app)
      .get('/api/content/movie-tmdb')
      .set('Authorization', 'Bearer fake-token')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      contentId: 'movie-tmdb',
      type: 'movie',
      title: 'Inception',
      source: 'tmdb',
    })
    ;['contentId', 'type', 'title', 'cover', 'year', 'genres',
      'creator', 'synopsis', 'rating', 'watchProviders', 'source']
      .forEach(field => expect(res.body).toHaveProperty(field))
  })

  test('200 — no expone campos internos (externalId, popularity, syncedAt)', async () => {
    const res = await request(app)
      .get('/api/content/movie-tmdb')
      .set('Authorization', 'Bearer fake-token')
    expect(res.body).not.toHaveProperty('externalId')
    expect(res.body).not.toHaveProperty('popularity')
    expect(res.body).not.toHaveProperty('syncedAt')
  })

  test('watchProviders SIEMPRE es array — con valor', async () => {
    const res = await request(app)
      .get('/api/content/movie-tmdb')
      .set('Authorization', 'Bearer fake-token')
    expect(Array.isArray(res.body.watchProviders)).toBe(true)
    expect(res.body.watchProviders).toEqual(['Netflix', 'Disney+'])
  })

  test('watchProviders SIEMPRE es array — normalizado a [] cuando falta', async () => {
    const res = await request(app)
      .get('/api/content/book-no-providers')
      .set('Authorization', 'Bearer fake-token')
    expect(Array.isArray(res.body.watchProviders)).toBe(true)
    expect(res.body.watchProviders).toEqual([])
  })

  test('attribution presente solo cuando source === "tmdb"', async () => {
    const tmdb = await request(app)
      .get('/api/content/movie-tmdb')
      .set('Authorization', 'Bearer fake-token')
    expect(tmdb.body.attribution).toBe(
      'This product uses the TMDB API but is not endorsed or certified by TMDB'
    )

    const book = await request(app)
      .get('/api/content/book-no-providers')
      .set('Authorization', 'Bearer fake-token')
    expect(book.body).not.toHaveProperty('attribution')
  })

  test('400 — id inválido con separador de path', async () => {
    const res = await request(app)
      .get('/api/content/foo%2Fbar')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('invalid_id')
  })

})
