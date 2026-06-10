/**
 * Tests para GET /api/collections   — Responsable: Héctor Morales
 *
 * Mocks:
 *   - firebase-admin → Firestore en memoria (sin emulador)
 *   - auth middleware → inyecta req.user con uid 'user-test-123'
 *
 * Nota: los tests del CRUD de escritura (POST/PATCH/DELETE) los agrega
 *       Christian Ruiz en este mismo archivo, en un describe aparte.
 */

const request = require('supertest')
const express = require('express')

// ─── Datos de mock ──────────────────────────────────────────────────────────
// Documentos de la colección "collections" (un doc por ítem guardado).
const ts = (iso) => ({ toMillis: () => new Date(iso).getTime() })

const allDocs = [
  {
    id: 'col-1',
    userId: 'user-test-123',
    contentId: 'movie-tmdb',
    contentType: 'movie',
    listName: 'Guardados',
    personalNote: 'Ver con calma',
    savedAt: ts('2026-06-01T10:00:00Z'),
  },
  {
    id: 'col-2',
    userId: 'user-test-123',
    contentId: 'book-gatsby',
    contentType: 'book',
    listName: 'Favoritos',
    // personalNote ausente a propósito → debe normalizarse a ''
    savedAt: ts('2026-06-05T10:00:00Z'),
  },
  {
    id: 'col-3',
    userId: 'user-test-123',
    contentId: 'movie-2',
    contentType: 'movie',
    listName: 'Favoritos',
    personalNote: '',
    savedAt: ts('2026-06-03T10:00:00Z'),
  },
  {
    // Documento de OTRO usuario → nunca debe aparecer en la respuesta
    id: 'col-otro',
    userId: 'otro-usuario',
    contentId: 'movie-secreta',
    contentType: 'movie',
    listName: 'Guardados',
    personalNote: 'privado',
    savedAt: ts('2026-06-09T10:00:00Z'),
  },
]

// Query builder mínimo que soporta .where('userId','==',x).get()
const makeQuery = (docs) => ({
  where: (field, op, value) =>
    makeQuery(docs.filter((d) => op === '==' && d[field] === value)),
  get: jest.fn().mockResolvedValue({
    docs: docs.map((d) => ({ id: d.id, data: () => d })),
  }),
})

const mockCollection = jest.fn().mockImplementation((col) => {
  if (col === 'collections') return makeQuery(allDocs)
  return makeQuery([])
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
const collectionsRouter = require('../src/routes/collections')
const app = express()
app.use(express.json())
app.use('/api/collections', collectionsRouter)

const authed = () =>
  request(app).get('/api/collections').set('Authorization', 'Bearer fake-token')

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('GET /api/collections', () => {

  test('401 — sin token de autorización', async () => {
    const res = await request(app).get('/api/collections')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('missing_token')
  })

  test('200 — devuelve solo los ítems del usuario autenticado', async () => {
    const res = await authed()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(3)
    // El doc de otro usuario nunca aparece
    expect(res.body.some((it) => it.collectionId === 'col-otro')).toBe(false)
  })

  test('200 — whitelist de campos esperados por ítem', async () => {
    const res = await authed()
    const item = res.body.find((it) => it.collectionId === 'col-1')
    ;['collectionId', 'contentId', 'contentType', 'listName', 'personalNote', 'savedAt']
      .forEach((field) => expect(item).toHaveProperty(field))
  })

  test('200 — ordenado por savedAt descendente', async () => {
    const res = await authed()
    const ids = res.body.map((it) => it.collectionId)
    // col-2 (jun 5) > col-3 (jun 3) > col-1 (jun 1)
    expect(ids).toEqual(['col-2', 'col-3', 'col-1'])
  })

  test('personalNote ausente se normaliza a ""', async () => {
    const res = await authed()
    const item = res.body.find((it) => it.collectionId === 'col-2')
    expect(item.personalNote).toBe('')
  })

  test('filtro ?type=movie devuelve solo películas', async () => {
    const res = await request(app)
      .get('/api/collections?type=movie')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body.every((it) => it.contentType === 'movie')).toBe(true)
  })

  test('filtro ?listName=Favoritos devuelve solo esa lista', async () => {
    const res = await request(app)
      .get('/api/collections?listName=Favoritos')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body.every((it) => it.listName === 'Favoritos')).toBe(true)
  })

  test('filtros combinados ?type=movie&listName=Favoritos', async () => {
    const res = await request(app)
      .get('/api/collections?type=movie&listName=Favoritos')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].collectionId).toBe('col-3')
  })

  test('200 — array vacío cuando el usuario no tiene ítems del filtro', async () => {
    const res = await request(app)
      .get('/api/collections?listName=NoExiste')
      .set('Authorization', 'Bearer fake-token')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

})
