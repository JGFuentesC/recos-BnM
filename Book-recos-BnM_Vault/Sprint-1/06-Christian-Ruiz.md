# Sprint 1 — Christian Ruiz Hurtado
**Nivel:** Bajo | **Épica:** 5 | **Wave:** 🟡 2 (después de Andrés + Israel)

---

## 🎯 Tu misión

Construir los endpoints CRUD de **colecciones**: son los que permiten guardar, editar y borrar títulos en la biblioteca del usuario. Tu trabajo conecta el swipe con la biblioteca de Diana.

**Entrega el miércoles 10 jun:**
- `POST /api/collections` — guardar un título con lista y nota personal
- `PATCH /api/collections/{id}` — editar nota o lista
- `DELETE /api/collections/{id}` — quitar de la biblioteca

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Schema `collections` | **[[01-Israel-Perez\|Israel Pérez]]** — `docs/SCHEMA.md` | Wave 0 |
| `auth.js` middleware | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Patrón de endpoints | **[[04-Luis-Tellez\|Luis Téllez]]** (solo referencia, no bloqueante) | Wave 2 |

> 💡 **Puedes empezar en cuanto Andrés e Israel terminen** — Luis es solo referencia de estructura. El patrón de Express + middleware es el mismo para todos. No necesitas esperar a Luis.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[11-Marina-Garcia|Marina]]** necesita `POST /api/collections` para el botón "Guardar" del DetailSheet
- ✅ **[[12-Diana-Alvarez|Diana]]** necesita `PATCH /api/collections/{id}` para editar notas en la Biblioteca

---

## ✅ RESUELTO — `GET /api/collections` asignado a ti

El endpoint `GET /api/collections` fue asignado incorrectamente a Héctor en el plan original. Eduardo (PM) confirmó el **2026-06-05** que tú eres el responsable del endpoint completo.

Tienes el CRUD completo de `/api/collections`:
- `GET /api/collections` — listar colecciones del usuario ← **tuyo**
- `POST /api/collections` — crear ítem ← tuyo
- `PATCH /api/collections/:id` — editar nota/lista ← tuyo
- `DELETE /api/collections/:id` — eliminar ← tuyo

[[12-Diana-Alvarez|Diana]] depende de tu `GET` para mostrar la Biblioteca. El prompt de abajo ya incluye todos los endpoints.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/06-Christian-agent-context.md — define qué archivos puedes tocar.

Necesito implementar los endpoints CRUD de /api/collections para el proyecto Recos-BnM.
Stack: Node.js + Express en backend/src/, Firestore (emulador localhost:8080 en dev).

CONTEXTO del schema Firestore (colección collections/{collectionId}):
  userId: string
  contentId: string
  contentType: "movie" | "book"
  listName: string (default: "Guardados")
  personalNote: string (puede ser "")
  savedAt: timestamp

Middleware disponible: backend/src/middleware/auth.js (req.user = { uid, email })

TAREA 1 — backend/src/routes/collections.js
Implementar los siguientes endpoints, todos con authMiddleware:

GET /api/collections (✅ asignado a ti — confirmado por Eduardo el 2026-06-05)
  Query params: userId (required), type (optional: "movie"|"book"), listName (optional)
  Lógica:
  1. Verificar req.user.uid === userId
  2. Query a collections donde userId == userId
  3. Si type → filtrar por contentType
  4. Si listName → filtrar por listName
  5. Ordenar por savedAt DESC
  6. Devolver array de colecciones: [{ collectionId, contentId, contentType, listName, personalNote, savedAt }]

POST /api/collections
  Body: { userId, contentId, contentType, listName, personalNote }
  Validaciones: userId == req.user.uid, contentId y contentType requeridos
  listName por defecto "Guardados" si no se envía
  personalNote por defecto "" si no se envía
  Verificar que no exista ya el mismo contentId para ese userId (no duplicar)
  Crear doc con savedAt: Firestore.Timestamp.now()
  Responder 201 con { collectionId }

PATCH /api/collections/:id
  Body: { personalNote, listName } (cualquiera de los dos es opcional)
  Verificar que el doc existe y que resource.data.userId == req.user.uid
  Actualizar solo los campos enviados (update parcial, no reemplazar todo el doc)
  Responder 200 con { collectionId, updated: { personalNote, listName } }
  Si no existe → 404
  Si no es el dueño → 403

DELETE /api/collections/:id
  Verificar que el doc existe y que resource.data.userId == req.user.uid
  Eliminar el doc
  Responder 204 (sin body)
  Si no existe → 404
  Si no es el dueño → 403

TAREA 2 — Verificar registro en backend/src/app.js
⚠️ NO modificar app.js — Andrés González creó el scaffold con todas las rutas pre-registradas.
La siguiente línea YA existe en app.js desde Wave 1:
  app.use('/api/collections', require('./routes/collections'))
Solo asegúrate de que backend/src/routes/collections.js exista y exporte el router correctamente.

TAREA 3 — Tests básicos con Jest + supertest
Crear backend/tests/collections.test.js:
- POST sin token → 401
- POST con userId distinto al token → 403
- POST válido → 201 con collectionId
- PATCH de colección ajena → 403
- PATCH válida → 200
- DELETE válida → 204
- GET con filtro type → array filtrado

Muéstrame un ejemplo de cada respuesta (201, 200, 204) al terminar.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-christian-collections-api.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Christian Ruiz Hurtado"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que implementaste el GET /api/collections (el que estaba sin asignar y fue reasignado a ti).
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `POST /api/collections` → 201
- [ ] `PATCH /api/collections/:id` → 200 (solo campos enviados)
- [ ] `DELETE /api/collections/:id` → 204
- [ ] `GET /api/collections` → 200 (✅ confirmado — tuyo)
- [ ] 403 si intenta modificar colección ajena
- [ ] Tests cubriendo los casos anteriores
- [ ] Ruta registrada en `app.js`

---

## 🚀 Fase 2 — Engagement (Jun 13–15, 2026)

> **Feature P2 de Fase 2:** Listas compartibles. Los usuarios podrán generar un link público de sus listas y compartirlo con cualquier persona (sin necesidad de login para ver).

### 🎯 Tu misión Fase 2

**Tarea 1 — Endpoint `POST /api/collections/:id/share` (genera share link):**

```javascript
// backend/src/routes/collections.js — agregar al final del router existente

// POST /api/collections/:id/share — genera un token de compartir para una lista
router.post('/:id/share', auth, async (req, res) => {
  const { id } = req.params
  
  try {
    const docRef = db.collection('collections').doc(id)
    const snap   = await docRef.get()
    
    if (!snap.exists)                             return res.status(404).json({ error: 'Not found' })
    if (snap.data().userId !== req.user.uid)      return res.status(403).json({ error: 'Forbidden' })
    
    // Generar token único (usar crypto nativo de Node.js)
    const { randomBytes } = require('crypto')
    const shareToken = randomBytes(16).toString('hex')
    
    await docRef.update({ shareToken, isPublic: true })
    
    const shareUrl = `${process.env.FRONTEND_URL || 'https://recos-bnm.web.app'}/shared/${shareToken}`
    res.json({ shareToken, shareUrl })
  } catch (err) {
    res.status(500).json({ error: 'Error al generar link de compartir' })
  }
})
```

**Tarea 2 — Endpoint `GET /api/collections/share/:token` (acceso público sin auth):**

```javascript
// GET /api/collections/share/:token — NO requiere auth, acceso público
router.get('/share/:token', async (req, res) => {
  const { token } = req.params
  
  try {
    const snap = await db.collection('collections')
      .where('shareToken', '==', token)
      .where('isPublic', '==', true)
      .limit(1)
      .get()
    
    if (snap.empty) return res.status(404).json({ error: 'Lista no encontrada o no pública' })
    
    const doc   = snap.docs[0]
    const data  = doc.data()
    
    // Devolver la lista con info básica (sin datos privados del usuario)
    res.json({
      collectionId: doc.id,
      listName:     data.listName,
      contentId:    data.contentId,
      contentType:  data.contentType,
      savedAt:      data.savedAt,
      personalNote: data.personalNote  // Incluir la nota — el dueño eligió compartir
    })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener lista compartida' })
  }
})
```

**Tarea 3 — Endpoint `DELETE /api/collections/:id/share` (revocar acceso público):**

```javascript
// DELETE /api/collections/:id/share — revocar compartir (solo el dueño)
router.delete('/:id/share', auth, async (req, res) => {
  const { id } = req.params
  const docRef  = db.collection('collections').doc(id)
  const snap    = await docRef.get()
  
  if (!snap.exists)                        return res.status(404).json({ error: 'Not found' })
  if (snap.data().userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
  
  await docRef.update({ shareToken: admin.firestore.FieldValue.delete(), isPublic: false })
  res.status(204).send()
})
```

**Tarea 4 — Coordinar con Diana Álvarez y Israel Pérez:**

- **Diana**: necesita el endpoint `/api/collections/:id/share` para el botón "Compartir lista" en Library.jsx
- **Israel**: ya actualizó las reglas de Firestore para permitir lectura pública cuando `isPublic == true`

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Christian Ruiz, responsable de /api/collections.

TAREA 1 — Agregar 3 nuevos endpoints a backend/src/routes/collections.js:

1. POST /:id/share (con authMiddleware)
   - Verificar que el doc existe y que userId == req.user.uid
   - Generar shareToken = require('crypto').randomBytes(16).toString('hex')
   - Hacer update({ shareToken, isPublic: true })
   - Responder { shareToken, shareUrl: process.env.FRONTEND_URL + '/shared/' + shareToken }

2. GET /share/:token (SIN authMiddleware — acceso público)
   - IMPORTANTE: este route debe definirse ANTES de GET /:id para que Express no confunda 'share' con un :id
   - Query: collections donde shareToken == token Y isPublic == true, limit 1
   - Si no hay resultados → 404
   - Responder: { collectionId, listName, contentId, contentType, savedAt, personalNote }

3. DELETE /:id/share (con authMiddleware)
   - Verificar ownership (userId == req.user.uid)
   - Update({ shareToken: FieldValue.delete(), isPublic: false })
   - Responder 204

TAREA 2 — Agregar tests para los 3 nuevos endpoints:
- POST share → 201 con shareToken y shareUrl
- GET share/:token válido → 200 con datos de colección
- GET share/:token inexistente → 404
- DELETE share → 204

⚠️ El order de los routes importa: definir GET /share/:token ANTES de GET /:id
```

### ✅ Checklist Fase 2

- [ ] `POST /api/collections/:id/share` → genera shareToken y shareUrl
- [ ] `GET /api/collections/share/:token` → sin auth, devuelve lista pública
- [ ] `DELETE /api/collections/:id/share` → revoca acceso, borra shareToken
- [ ] Orden correcto de routes (share antes que :id)
- [ ] Tests para los 3 nuevos endpoints
- [ ] Coordinado con Diana: ella tiene el shareUrl para el botón de compartir
- [ ] Coordinado con Israel: reglas Firestore permiten lectura pública
