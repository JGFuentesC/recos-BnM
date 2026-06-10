const express = require('express')
const request = require('supertest')

const mockVerifyIdToken = jest.fn()

jest.mock('../src/firebase/admin', () => ({
  auth: jest.fn(() => ({ verifyIdToken: mockVerifyIdToken })),
}))

const auth = require('../src/middleware/auth')

function buildApp() {
  const app = express()
  app.get('/private', auth, (req, res) => {
    res.status(200).json({ ok: true, user: req.user })
  })
  return app
}

describe('auth middleware', () => {
  beforeEach(() => {
    mockVerifyIdToken.mockReset()
  })

  test('401 when authorization header is missing', async () => {
    const app = buildApp()
    const res = await request(app).get('/private')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'missing_token' })
    expect(mockVerifyIdToken).not.toHaveBeenCalled()
  })

  test('401 when token verification fails', async () => {
    mockVerifyIdToken.mockRejectedValueOnce(new Error('invalid'))

    const app = buildApp()
    const res = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer bad-token')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: 'invalid_token' })
    expect(mockVerifyIdToken).toHaveBeenCalledWith('bad-token')
  })

  test('200 and injects req.user when token is valid', async () => {
    mockVerifyIdToken.mockResolvedValueOnce({
      uid: 'user-123',
      email: 'andres@test.com',
    })

    const app = buildApp()
    const res = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer good-token')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      ok: true,
      user: { uid: 'user-123', email: 'andres@test.com' },
    })
    expect(mockVerifyIdToken).toHaveBeenCalledWith('good-token')
  })
})
