const { Router } = require('express')
const authMiddleware = require('../middleware/auth')
const admin = require('../firebase/admin')
const db = admin.firestore()

const router = Router()

const TMDB_ATTRIBUTION =
  'This product uses the TMDB API but is not endorsed or certified by TMDB'

/**
 * GET /api/content/:id
 *
 * Devuelve el detalle completo de un ítem de contenido para el DetailSheet.
 *
 * Path params:
 *   id (string, requerido) — contentId del documento en Firestore
 *
 * Response 200: objeto content completo
 *   { contentId, type, title, cover, year, genres, creator, synopsis,
 *     rating, watchProviders, source, attribution? }
 * Response 400: id ausente o inválido
 * Response 404: el contenido no existe
 * Response 500: error interno
 *
 * Reglas de negocio / compliance:
 *   - watchProviders SIEMPRE se devuelve como array (nunca undefined/null).
 *   - Nunca se inventa disponibilidad de streaming: solo lo que está en Firestore.
 *   - Si source === "tmdb" se añade el campo attribution (requisito TMDB).
 *   - Solo se exponen los campos en whitelist (no se devuelve el doc crudo).
 */
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params

  // Validar id: no vacío y sin separador de path (evita traversal a subcolecciones)
  if (!id || id.includes('/')) {
    return res.status(400).json({ error: 'invalid_id' })
  }

  try {
    // 1. Leer el documento content/{id}
    const doc = await db.collection('content').doc(id).get()

    // 2. Si no existe → 404
    if (!doc.exists) {
      return res.status(404).json({ error: 'Content not found' })
    }

    const data = doc.data()

    // 3. Formatear respuesta (whitelist de campos que necesita el frontend)
    const response = {
      contentId:      doc.id,
      type:           data.type,
      title:          data.title,
      cover:          data.cover,
      year:           data.year,
      genres:         Array.isArray(data.genres) ? data.genres : [],
      creator:        Array.isArray(data.creator) ? data.creator : [],
      synopsis:       data.synopsis,
      rating:         data.rating,
      // watchProviders SIEMPRE array, nunca undefined/null
      watchProviders: Array.isArray(data.watchProviders) ? data.watchProviders : [],
      source:         data.source,
    }

    // 4. Atribución obligatoria para contenido proveniente de TMDB
    if (data.source === 'tmdb') {
      response.attribution = TMDB_ATTRIBUTION
    }

    return res.status(200).json(response)

  } catch (err) {
    // El detalle del error se queda en el servidor; el cliente recibe mensaje genérico
    console.error('[content] Error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
