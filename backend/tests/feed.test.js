/**
 * Tests para GET /api/feed
 *
 * Mocks:
 *   - firebase-admin  → Firestore en memoria (sin emulador)
 *   - auth middleware → inyecta req.user directamente
 */

const request = require('supertest')
const express = require('express')

// ─── Mock firebase/admin ─────────────────────────────────────────────────────
const mockUserDoc   = { exists: true, data: () => ({ prefs: { genres: ['Action'] } }) }
const mockContentDocs = [
  { id: 'c1', data: () => ({ title: 'Movie A', cover: 'http://a.jpg', genres: ['Action'], rating: 8.0, synopsis: 'Synopsis A', type: 'movie', popularity: 100 }) },
  { id: 'c2', data: () => ({ title: 'Movie B', cover: 'http://b.jpg', genres: ['Drama'],  rating: 7.5, synopsis: 'Synopsis B', type: 'movie', popularity: 80  }) },
]
const mockSwipeDocs = [{ data: () => ({ contentId: 'c2' }) }]

const mockCollection = jest.fn().mockImplementation((col) => {
  if (col === 'users') {
    return { doc: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue(mockUserDoc) }) }
  }
  if (col === 'content') {
    return {
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get:   jest.fn().mockResolvedValue({ docs: mockContentDocs }),
    }
  }
  if (col === 'swipes') {
    return {
      where: jest.fn().mockReturnThis(),
      get:   jest.fn().mockResolvedValue({ docs: mockSwipeDocs }),
    }
  }
})

jest.mock('../src/firebase/admin', () => ({
  db: { collection: mockCollection },
  auth: jest.fn(),
  firestore: { FieldValue: { serverTimestamp: jest.fn() } },
}))

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
const feedRouter = require('../src/routes/feed')
const app = express()
app.use(express.json())
app.use('/api/feed', feedRouter)

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('GET /api/feed', () => {

  test('401 — sin token de autorización', async () => {
    const res = await request(app)
      .get('/api/feed')
      .query({ userId: 'user-test-123', type: 'movie' })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('missing_token')
  })

  test('400 — falta parámetro type', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', 'Bearer fake-token')
      .query({ userId: 'user-test-123' }) // sin type

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('missing_params')
  })

  test('400 — falta parámetro userId', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', 'Bearer fake-token')
      .query({ type: 'movie' }) // sin userId

    expect(res.status).toBe(400)
  })

  test('200 — devuelve array de ítems sin los ya swipeados', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', 'Bearer fake-token')
      .query({ userId: 'user-test-123', type: 'movie' })

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)

    // c2 fue swipeado → no debe aparecer
    const ids = res.body.map(item => item.contentId)
    expect(ids).not.toContain('c2')
    expect(ids).toContain('c1')
  })

  test('200 — respuesta contiene los campos esperados', async () => {
    const res = await request(app)
      .get('/api/feed')
      .set('Authorization', 'Bearer fake-token')
      .query({ userId: 'user-test-123', type: 'movie' })

    expect(res.status).toBe(200)
    if (res.body.length > 0) {
      const item = res.body[0]
      expect(item).toHaveProperty('contentId')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('cover')
      expect(item).toHaveProperty('genres')
      expect(item).toHaveProperty('rating')
      expect(item).toHaveProperty('synopsis')
      expect(item).toHaveProperty('type')
    }
  })

})
