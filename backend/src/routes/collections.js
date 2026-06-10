const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const admin = require('../firebase/admin')
const db = admin.firestore()

const router = Router()

/**
 * GET /api/collections   — Responsable: Héctor Morales
 *
 * Devuelve los ítems guardados por el usuario autenticado (biblioteca).
 *
 * Modelo: un documento por ítem guardado en `collections/{collectionId}`
 *   { userId, contentId, contentType, listName, personalNote, savedAt }
 *
 * Query params (opcionales):
 *   type     (string)  — filtra por contentType: "movie" | "book"
 *   listName (string)  — filtra por nombre de lista (default "Guardados")
 *
 * Response 200: array de colecciones del usuario, ordenado por savedAt desc
 *   [{ collectionId, contentId, contentType, listName, personalNote, savedAt }]
 * Response 401: sin token (lo maneja el middleware auth)
 * Response 500: error interno
 *
 * Reglas de negocio / seguridad:
 *   - SIEMPRE se filtra por userId === req.user.uid: un usuario solo ve lo suyo.
 *   - El userId NUNCA se toma del query (evita leer la biblioteca de otro).
 *   - El filtrado por type/listName y el orden por savedAt se hacen en memoria
 *     para no depender de índices compuestos nuevos (firestore.indexes.json es
 *     de Israel). La colección por usuario está acotada, así que es eficiente.
 *   - Respuesta siempre es array (nunca undefined/null).
 */
router.get('/', authMiddleware, async (req, res) => {
  const uid = req.user.uid
  const { type, listName } = req.query

  try {
    // 1. Traer solo los documentos del dueño (índice single-field automático)
    const snap = await db
      .collection('collections')
      .where('userId', '==', uid)
      .get()

    // 2. Mapear a la whitelist de campos que necesita el frontend
    let items = snap.docs.map((doc) => {
      const data = doc.data()
      return {
        collectionId: doc.id,
        contentId:    data.contentId,
        contentType:  data.contentType,
        listName:     data.listName,
        personalNote: typeof data.personalNote === 'string' ? data.personalNote : '',
        savedAt:      data.savedAt,
      }
    })

    // 3. Filtros opcionales en memoria
    if (type) {
      items = items.filter((it) => it.contentType === type)
    }
    if (listName) {
      items = items.filter((it) => it.listName === listName)
    }

    // 4. Orden por savedAt desc (Timestamp de Firestore expone toMillis)
    const toMillis = (ts) =>
      ts && typeof ts.toMillis === 'function' ? ts.toMillis() : (ts ? new Date(ts).getTime() : 0)
    items.sort((a, b) => toMillis(b.savedAt) - toMillis(a.savedAt))

    return res.status(200).json(items)
  } catch (err) {
    console.error('[collections] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// CRUD de escritura — Responsable: Christian Ruiz
//   POST   /api/collections        → 201
//   PATCH  /api/collections/:id     → 200
//   DELETE /api/collections/:id     → 204
// Agregar aquí sobre este mismo router. No modificar el GET de arriba.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = router
