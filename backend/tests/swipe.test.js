/**
 * Tests para POST /api/swipe
 *
 * Mocks:
 *   - firebase-admin  → colección swipes en memoria
 *   - auth middleware → inyecta req.user directamente
 */

const request = require('supertest')
const express = require('express')

// ─── Mock firebase/admin ──────────────────────────────────────────────────────
const mockAdd = jest.fn().mockResolvedValue({ id: 'swipe-doc-id' })

jest.mock('../src/firebase/admin', () => {
  const firestoreFn = jest.fn(() => ({ collection: jest.fn().mockReturnValue({ add: mockAdd }) }))
  firestoreFn.FieldValue = { serverTimestamp: jest.fn().mockReturnValue('MOCK_TIMESTAMP') }
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
const swipeRouter = require('../src/routes/swipe')
const app = express()
app.use(express.json())
app.use('/api/swipe', swipeRouter)

// ─── Body válido de referencia ────────────────────────────────────────────────
const validBody = {
  userId:      'user-test-123',
  contentId:   'content-abc',
  contentType: 'movie',
  action:      'like',
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('POST /api/swipe', () => {

  beforeEach(() => {
    mockAdd.mockClear()
  })

  test('401 — sin token de autorización', async () => {
    const res = await request(app)
      .post('/api/swipe')
      .send(validBody)

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('missing_token')
  })

  test('400 — falta contentId', async () => {
    const { contentId: _, ...bodyWithoutContentId } = validBody
    const res = await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send(bodyWithoutContentId)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('missing_fields')
  })

  test('400 — falta userId → retorna 400 no 403', async () => {
    const { userId: _, ...bodyWithoutUserId } = validBody
    const res = await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send(bodyWithoutUserId)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('missing_fields')
  })

  test('400 — action inválida', async () => {
    const res = await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send({ ...validBody, action: 'superlike' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('invalid_action')
  })

  test('204 — swipe válido (like)', async () => {
    const res = await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send(validBody)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
    expect(mockAdd).toHaveBeenCalledTimes(1)
  })

  test('204 — swipe válido (dislike)', async () => {
    const res = await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send({ ...validBody, action: 'dislike' })

    expect(res.status).toBe(204)
    expect(mockAdd).toHaveBeenCalledTimes(1)
  })

  test('guarda en Firestore los campos correctos', async () => {
    await request(app)
      .post('/api/swipe')
      .set('Authorization', 'Bearer fake-token')
      .send(validBody)

    expect(mockAdd).toHaveBeenCalledWith({
      userId:      'user-test-123',
      contentId:   'content-abc',
      contentType: 'movie',
      action:      'like',
      timestamp:   'MOCK_TIMESTAMP',
    })
  })

})
