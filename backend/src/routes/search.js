const express = require('express')
const router  = express.Router()
const admin   = require('../firebase/admin')
const auth    = require('../middleware/auth')
const db      = admin.firestore()

// GET /api/search?q=interstellar&type=movie
router.get('/', auth, async (req, res) => {
  const { q, type } = req.query
  if (!q) {
    return res.status(400).json({ error: 'missing_query' })
  }

  // SEC-L-02: Sanitizar el parámetro q antes de usarlo en la query de Firestore
  const qSanitized = q.trim().replace(/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g, '').slice(0, 100)
  if (qSanitized.length < 2) {
    return res.status(400).json({ error: 'query_too_short' })
  }

  const qLower = qSanitized.toLowerCase()

  try {
    let query
    if (type && ['movie', 'book'].includes(type)) {
      query = db.collection('content')
        .where('type', '==', type)
        .orderBy('titleLower')
        .startAt(qLower).endAt(qLower + '')
        .limit(20)
    } else {
      query = db.collection('content')
        .orderBy('titleLower')
        .startAt(qLower).endAt(qLower + '')
        .limit(20)
    }

    const snap = await query.get()
    const results = snap.docs.map(doc => ({
      contentId: doc.id,
      title:     doc.data().title,
      cover:     doc.data().cover,
      type:      doc.data().type,
      genres:    doc.data().genres || [],
      rating:    doc.data().rating,
      synopsis:  doc.data().synopsis
    }))

    return res.status(200).json(results)
  } catch (err) {
    // SEC-L-04: Evitar fugas de errores (Leakage) retornando solo logs en servidor y error genérico al cliente
    console.warn('[search] Missing index or query error, falling back to memory filtering:', err.message)
    try {
      // Degradación graciosa (Graceful degradation)
      // Buscamos solo por titleLower (que usa el índice de un solo campo, garantizado) y filtramos por tipo en memoria
      const fallbackQuery = db.collection('content')
        .orderBy('titleLower')
        .startAt(qLower).endAt(qLower + '')
        .limit(100)

      const snap = await fallbackQuery.get()
      let results = snap.docs.map(doc => ({
        contentId: doc.id,
        title:     doc.data().title,
        cover:     doc.data().cover,
        type:      doc.data().type,
        genres:    doc.data().genres || [],
        rating:    doc.data().rating,
        synopsis:  doc.data().synopsis
      }))

      if (type && ['movie', 'book'].includes(type)) {
        results = results.filter(item => item.type === type)
      }

      return res.status(200).json(results.slice(0, 20))
    } catch (fallbackErr) {
      console.error('[search] Fallback error:', fallbackErr)
      return res.status(500).json({ error: 'internal_error' })
    }
  }
})

module.exports = router
