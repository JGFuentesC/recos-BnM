const express = require('express')
const admin = require('../firebase/admin')
const auth = require('../middleware/auth')

const router = express.Router()

const COLLECTION = 'collections'
const VALID_TYPES = ['movie', 'book']

function db() {
  return admin.firestore()
}

// Firestore Timestamp -> ISO string (or passthrough for plain values).
function serializeSavedAt(savedAt) {
  if (!savedAt) return null
  if (typeof savedAt.toDate === 'function') return savedAt.toDate().toISOString()
  return savedAt
}

// Comparable millis for in-memory ordering by savedAt DESC.
function savedAtMillis(savedAt) {
  if (!savedAt) return 0
  if (typeof savedAt.toMillis === 'function') return savedAt.toMillis()
  if (typeof savedAt.toDate === 'function') return savedAt.toDate().getTime()
  const t = new Date(savedAt).getTime()
  return Number.isNaN(t) ? 0 : t
}

function toPublic(doc) {
  const data = doc.data()
  return {
    collectionId: doc.id,
    contentId: data.contentId,
    contentType: data.contentType,
    listName: data.listName,
    personalNote: data.personalNote,
    savedAt: serializeSavedAt(data.savedAt),
  }
}

/**
 * GET /api/collections
 * Query params: userId (required), type (optional: movie|book), listName (optional)
 * Devuelve las colecciones del usuario ordenadas por savedAt DESC.
 *
 * Nota: se filtra por userId en Firestore y se ordena/afina en memoria para no
 * depender de índices compuestos (orderBy + where) gestionados por Israel.
 */
router.get('/', auth, async (req, res) => {
  try {
    const { userId, type, listName } = req.query

    if (!userId) {
      return res.status(400).json({ error: 'missing_userId' })
    }
    if (req.user.uid !== userId) {
      return res.status(403).json({ error: 'forbidden' })
    }
    if (type && !VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'invalid_type' })
    }

    const snapshot = await db().collection(COLLECTION).where('userId', '==', userId).get()

    let items = snapshot.docs.map(toPublic)

    if (type) {
      items = items.filter((c) => c.contentType === type)
    }
    if (listName) {
      items = items.filter((c) => c.listName === listName)
    }

    items.sort((a, b) => savedAtMillis(b.savedAt) - savedAtMillis(a.savedAt))

    return res.status(200).json(items)
  } catch (error) {
    console.error('[collections] GET error', error)
    return res.status(500).json({ error: 'internal_error' })
  }
})

/**
 * POST /api/collections
 * Body: { userId, contentId, contentType, listName?, personalNote? }
 * Crea una colección evitando duplicados (mismo contentId para el mismo userId).
 */
router.post('/', auth, async (req, res) => {
  try {
    const { userId, contentId, contentType } = req.body || {}

    if (userId !== req.user.uid) {
      return res.status(403).json({ error: 'forbidden' })
    }
    if (!contentId || !contentType) {
      return res.status(400).json({ error: 'missing_fields' })
    }
    if (!VALID_TYPES.includes(contentType)) {
      return res.status(400).json({ error: 'invalid_content_type' })
    }

    const listName = req.body.listName || 'Guardados'
    const personalNote = req.body.personalNote != null ? req.body.personalNote : ''

    // Evitar duplicados: mismo contentId + userId.
    const dup = await db()
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .where('contentId', '==', contentId)
      .get()

    if (!dup.empty) {
      return res.status(409).json({ error: 'already_exists', collectionId: dup.docs[0].id })
    }

    const ref = await db().collection(COLLECTION).add({
      userId,
      contentId,
      contentType,
      listName,
      personalNote,
      savedAt: admin.firestore.Timestamp.now(),
    })

    return res.status(201).json({ collectionId: ref.id })
  } catch (error) {
    console.error('[collections] POST error', error)
    return res.status(500).json({ error: 'internal_error' })
  }
})

/**
 * PATCH /api/collections/:id
 * Body: { personalNote?, listName? } — update parcial.
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const ref = db().collection(COLLECTION).doc(id)
    const snap = await ref.get()

    if (!snap.exists) {
      return res.status(404).json({ error: 'not_found' })
    }
    if (snap.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'forbidden' })
    }

    const body = req.body || {}
    const update = {}
    if (body.personalNote != null) update.personalNote = body.personalNote
    if (body.listName != null) update.listName = body.listName

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'no_fields' })
    }

    await ref.update(update)

    return res.status(200).json({ collectionId: id, updated: update })
  } catch (error) {
    console.error('[collections] PATCH error', error)
    return res.status(500).json({ error: 'internal_error' })
  }
})

/**
 * DELETE /api/collections/:id
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const ref = db().collection(COLLECTION).doc(id)
    const snap = await ref.get()

    if (!snap.exists) {
      return res.status(404).json({ error: 'not_found' })
    }
    if (snap.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'forbidden' })
    }

    await ref.delete()

    return res.status(204).send()
  } catch (error) {
    console.error('[collections] DELETE error', error)
    return res.status(500).json({ error: 'internal_error' })
  }
})

module.exports = router
