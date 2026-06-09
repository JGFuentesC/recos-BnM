/**
 * Tests para backend/src/routes/collections.js
 *
 * Son self-contained: se mockea firebase-admin con un Firestore en memoria y el
 * middleware de auth con un parser de "Bearer <uid>", de modo que NO se requiere
 * el emulador ni credenciales reales para correr `npm test`.
 */

// ---- Fake Firestore en memoria -------------------------------------------

let store = {}
let autoId = 0

function makeSnap(id, data) {
  return {
    id,
    exists: data !== undefined,
    data: () => (data === undefined ? undefined : { ...data }),
  }
}

function fakeFirestore() {
  return {
    collection(name) {
      if (!store[name]) store[name] = {}
      const col = store[name]
      const filters = []

      const query = {
        where(field, _op, value) {
          filters.push({ field, value })
          return query
        },
        async get() {
          const docs = Object.entries(col)
            .filter(([, data]) => filters.every((f) => data[f.field] === f.value))
            .map(([id, data]) => makeSnap(id, data))
          return { empty: docs.length === 0, docs }
        },
        async add(data) {
          autoId += 1
          const id = `doc_${autoId}`
          col[id] = { ...data }
          return { id }
        },
        doc(id) {
          return {
            id,
            async get() {
              return makeSnap(id, col[id])
            },
            async update(patch) {
              col[id] = { ...col[id], ...patch }
            },
            async delete() {
              delete col[id]
            },
          }
        },
      }
      return query
    },
  }
}

// Timestamp falso comparable.
const FakeTimestamp = {
  now() {
    const millis = 1700000000000 + autoId
    return {
      toMillis: () => millis,
      toDate: () => new Date(millis),
    }
  },
}

jest.mock('../src/firebase/admin', () => {
  const firestore = () => fakeFirestore()
  firestore.Timestamp = FakeTimestamp
  return { firestore }
})

// ---- Mock del middleware de auth -----------------------------------------
// "Bearer <uid>" -> req.user = { uid }. Sin header -> 401.
jest.mock('../src/middleware/auth', () => (req, res, next) => {
  const header = req.headers.authorization || ''
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'missing_token' })
  }
  req.user = { uid: header.slice(7), email: `${header.slice(7)}@test.dev` }
  return next()
})

// ---- App de prueba --------------------------------------------------------

const express = require('express')
const request = require('supertest')
const collectionsRouter = require('../src/routes/collections')

const app = express()
app.use(express.json())
app.use('/api/collections', collectionsRouter)

beforeEach(() => {
  store = {}
  autoId = 0
})

const USER = 'user-123'
const OTHER = 'user-999'
const bearer = (uid) => ['Authorization', `Bearer ${uid}`]

describe('POST /api/collections', () => {
  test('sin token -> 401', async () => {
    const res = await request(app)
      .post('/api/collections')
      .send({ userId: USER, contentId: 'm1', contentType: 'movie' })
    expect(res.status).toBe(401)
  })

  test('userId distinto al token -> 403', async () => {
    const res = await request(app)
      .post('/api/collections')
      .set(...bearer(USER))
      .send({ userId: OTHER, contentId: 'm1', contentType: 'movie' })
    expect(res.status).toBe(403)
  })

  test('válido -> 201 con collectionId', async () => {
    const res = await request(app)
      .post('/api/collections')
      .set(...bearer(USER))
      .send({ userId: USER, contentId: 'm1', contentType: 'movie' })
    expect(res.status).toBe(201)
    expect(typeof res.body.collectionId).toBe('string')
    expect(res.body.collectionId.length).toBeGreaterThan(0)
  })

  test('duplicado (mismo contentId + userId) -> 409', async () => {
    const payload = { userId: USER, contentId: 'm1', contentType: 'movie' }
    await request(app).post('/api/collections').set(...bearer(USER)).send(payload)
    const res = await request(app).post('/api/collections').set(...bearer(USER)).send(payload)
    expect(res.status).toBe(409)
    expect(res.body.error).toBe('already_exists')
  })
})

describe('PATCH /api/collections/:id', () => {
  async function seed(uid) {
    const res = await request(app)
      .post('/api/collections')
      .set(...bearer(uid))
      .send({ userId: uid, contentId: 'm1', contentType: 'movie' })
    return res.body.collectionId
  }

  test('colección ajena -> 403', async () => {
    const id = await seed(OTHER)
    const res = await request(app)
      .patch(`/api/collections/${id}`)
      .set(...bearer(USER))
      .send({ personalNote: 'hack' })
    expect(res.status).toBe(403)
  })

  test('inexistente -> 404', async () => {
    const res = await request(app)
      .patch('/api/collections/nope')
      .set(...bearer(USER))
      .send({ personalNote: 'x' })
    expect(res.status).toBe(404)
  })

  test('válida -> 200 con campos actualizados', async () => {
    const id = await seed(USER)
    const res = await request(app)
      .patch(`/api/collections/${id}`)
      .set(...bearer(USER))
      .send({ personalNote: 'Me encantó', listName: 'Favoritos' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      collectionId: id,
      updated: { personalNote: 'Me encantó', listName: 'Favoritos' },
    })
  })
})

describe('DELETE /api/collections/:id', () => {
  test('válida -> 204 sin body', async () => {
    const seedRes = await request(app)
      .post('/api/collections')
      .set(...bearer(USER))
      .send({ userId: USER, contentId: 'm1', contentType: 'movie' })
    const id = seedRes.body.collectionId

    const res = await request(app)
      .delete(`/api/collections/${id}`)
      .set(...bearer(USER))
    expect(res.status).toBe(204)
    expect(res.text).toBe('')
  })

  test('ajena -> 403', async () => {
    const seedRes = await request(app)
      .post('/api/collections')
      .set(...bearer(OTHER))
      .send({ userId: OTHER, contentId: 'm1', contentType: 'movie' })
    const id = seedRes.body.collectionId

    const res = await request(app)
      .delete(`/api/collections/${id}`)
      .set(...bearer(USER))
    expect(res.status).toBe(403)
  })
})

describe('GET /api/collections', () => {
  beforeEach(async () => {
    await request(app).post('/api/collections').set(...bearer(USER))
      .send({ userId: USER, contentId: 'm1', contentType: 'movie', listName: 'Guardados' })
    await request(app).post('/api/collections').set(...bearer(USER))
      .send({ userId: USER, contentId: 'b1', contentType: 'book', listName: 'Guardados' })
  })

  test('filtro type=movie -> array filtrado', async () => {
    const res = await request(app)
      .get('/api/collections')
      .query({ userId: USER, type: 'movie' })
      .set(...bearer(USER))
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].contentType).toBe('movie')
    expect(res.body[0].contentId).toBe('m1')
  })

  test('sin filtro -> todas las del usuario', async () => {
    const res = await request(app)
      .get('/api/collections')
      .query({ userId: USER })
      .set(...bearer(USER))
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  test('userId distinto al token -> 403', async () => {
    const res = await request(app)
      .get('/api/collections')
      .query({ userId: OTHER })
      .set(...bearer(USER))
    expect(res.status).toBe(403)
  })
})
