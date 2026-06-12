const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const { computeScore } = require('../services/scoring')
const admin = require('../firebase/admin')
const db = admin.firestore()

const router = Router()

/**
 * GET /api/feed
 *
 * Devuelve una página de contenido listo para swipe, ordenado por score.
 *
 * Query params:
 *   userId  (string, requerido) — debe coincidir con el uid del token
 *   type    ("movie" | "book", requerido)
 *   cursor  (number string, opcional) — índice desde el que continuar la paginación
 *
 * Response 200: array de hasta 10 ítems
 *   [{ contentId, title, cover, genres, rating, synopsis, type }]
 * Response 400: faltan parámetros
 * Response 403: userId no coincide con token
 * Response 500: error interno
 */
router.get('/', authMiddleware, async (req, res) => {
  const { userId, type, cursor } = req.query

  // Validar parámetros requeridos primero
  if (!userId || !type) {
    return res.status(400).json({ error: 'missing_params', required: ['userId', 'type'] })
  }

  // Validar que userId coincide con el token
  if (req.user.uid !== userId) {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (type !== 'movie' && type !== 'book') {
    return res.status(400).json({ error: 'invalid_type', allowed: ['movie', 'book'] })
  }

  try {
    // 1. Leer preferencias de géneros del usuario
    const userDoc = await db.collection('users').doc(userId).get()
    const prefs = userDoc.exists ? (userDoc.data().prefs || {}) : {}
    const userGenres = prefs.genres || []

    // 2. Consultar colección content filtrada por type (+ géneros si existen)
    let contentQuery = db.collection('content').where('type', '==', type)

    if (userGenres.length > 0) {
      contentQuery = contentQuery.where('genres', 'array-contains-any', userGenres)
    }

    const contentSnap = await contentQuery.limit(50).get()
    const candidates = contentSnap.docs.map(doc => ({
      contentId: doc.id,
      ...doc.data(),
    }))

    // 3. Obtener los contentIds ya swipeados por el usuario
    const swipesSnap = await db
      .collection('swipes')
      .where('userId', '==', userId)
      .get()

    // 🚀 NUEVO: También traemos las películas que ya guardó en favoritos
    const collectionsSnap = await db
      .collection('collections')
      .where('userId', '==', userId)
      .get()

    // ✨ Mantenemos la estructura original del Set para máxima eficiencia en memoria
    // Combinamos los arrays de IDs de ambas colecciones usando el operador spread (...)
    const swipedIds = new Set([
      ...swipesSnap.docs.map(doc => doc.data().contentId),
      ...collectionsSnap.docs.map(doc => doc.data().contentId)
    ])

    // 4. Filtrar los ya vistos (Se mantiene EXACTAMENTE igual a como estaba, manteniendo tu optimización)
    const unseen = candidates.filter(item => !swipedIds.has(item.contentId))

    // 5. Aplicar scoring con afinidad de géneros del usuario
    const genreAffinity = userGenres.reduce((acc, g) => ({ ...acc, [g]: 1.2 }), {})
    const scored = computeScore(unseen, genreAffinity)

    // 6. Paginación por cursor (índice numérico)
    const startIndex = cursor ? parseInt(cursor, 10) : 0
    const page = scored.slice(startIndex, startIndex + 10)

    // 7. Formatear respuesta (solo los campos que necesita el frontend)
    const response = page.map(item => ({
      contentId: item.contentId,
      title:     item.title,
      cover:     item.cover,
      genres:    item.genres || [],
      rating:    item.rating,
      synopsis:  item.synopsis,
      type:      item.type,
    }))

    return res.status(200).json(response)

  } catch (err) {
    console.error('[feed] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
