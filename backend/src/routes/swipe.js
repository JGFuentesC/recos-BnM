const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const admin = require('../firebase/admin')
const db = admin.firestore()

const router = Router()

const VALID_ACTIONS = ['like', 'dislike']
const VALID_CONTENT_TYPES = ['movie', 'book']

/**
 * POST /api/swipe
 *
 * Registra un like o dislike de un usuario sobre un contenido.
 *
 * Body esperado:
 *   { userId, contentId, contentType, action }
 *
 * Response 204: swipe guardado (sin body)
 * Response 400: validación fallida
 * Response 403: userId no coincide con token
 * Response 500: error interno
 */
router.post('/', authMiddleware, async (req, res) => {
  const { userId, contentId, contentType, action } = req.body

  // Validar campos requeridos primero
  if (!userId || !contentId || !contentType || !action) {
    return res.status(400).json({
      error: 'missing_fields',
      required: ['userId', 'contentId', 'contentType', 'action'],
    })
  }

  // Validar que userId coincide con el token
  if (req.user.uid !== userId) {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({
      error: 'invalid_action',
      allowed: VALID_ACTIONS,
    })
  }

  if (!VALID_CONTENT_TYPES.includes(contentType)) {
    return res.status(400).json({
      error: 'invalid_content_type',
      allowed: VALID_CONTENT_TYPES,
    })
  }

  try {
    await db.collection('swipes').add({
      userId,
      contentId,
      contentType,
      action,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(204).send()

  } catch (err) {
    console.error('[swipe] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
