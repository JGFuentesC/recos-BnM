/**
 * Tests para GET /api/search
 *
 * Mocks:
 *   - firebase-admin  → Firestore en memoria
 *   - auth middleware → inyecta req.user directamente
 */

const request = require('supertest')
const express = require('express')

// ─── Datos de mock ────────────────────────────────────────────────────────────
const mockContentDocs = [
  { id: 'c1', data: () => ({ title: 'Interstellar', cover: 'http://a.jpg', genres: ['Sci-Fi'], rating: 8.6, synopsis: 'Synopsis A', type: 'movie', titleLower: 'interstellar' }) },
  { id: 'c2', data: () => ({ title: 'Introduction to Algorithms', cover: 'http://b.jpg', genres: ['Education'], rating: 9.0, synopsis: 'Synopsis B', type: 'book', titleLower: 'introduction to algorithms' }) },
]

const mockCollection = jest.fn().mockImplementation((col) => {
  if (col === 'content') {
    return {
      orderBy: jest.fn().mockReturnThis(),
      startAt: jest.fn().mockReturnThis(),
      endAt:   jest.fn().mockReturnThis(),
      limit:   jest.fn().mockReturnThis(),
      get:     jest.fn().mockResolvedValue({ docs: mockContentDocs }),
    }
  }
})

// ─── Mock firebase/admin ──────────────────────────────────────────────────────
jest.mock('../src/firebase/admin', () => {
  const firestoreFn = jest.fn(() => ({ collection: mockCollection }))
  return { firestore: firestoreFn, auth: jest.fn() }
})

// ─── Mock auth middleware ─────────────────────────────────────────────────────
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token' })
  }
  req.user = { uid: 'user-test-123', email: 'luis@test.com' }
  return next()
})

// ─── App setup ────────────────────────────────────────────────────────────────
const searchRouter = require('../src/routes/search')
const app = express()
app.use(express.json())
app.use('/api/search', searchRouter)

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('GET /api/search', () => {

  test('401 — sin token de autorización', async () => {
    const res = await request(app)
      .get('/api/search')
      .query({ q: 'interstellar' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('missing_token')
  })

  test('400 — falta parámetro q', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', 'Bearer fake-token')

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('missing_query')
  })

  test('400 — parámetro q muy corto', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', 'Bearer fake-token')
      .query({ q: 'a' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('query_too_short')
  })

  test('200 — búsqueda válida por query', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', 'Bearer fake-token')
      .query({ q: 'inter' })

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
    expect(res.body[0]).toHaveProperty('contentId')
    expect(res.body[0]).toHaveProperty('title')
  })

  test('200 — q con caracteres especiales se sanitiza y no truena', async () => {
    const res = await request(app)
      .get('/api/search')
      .set('Authorization', 'Bearer fake-token')
      .query({ q: 'inter!!@#$' })

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

})
