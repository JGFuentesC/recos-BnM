# Sprint 1 — Luis Téllez Domínguez
**Nivel:** Bajo | **Épica:** 3 | **Wave:** 🟡 2 (después de Andrés + Manuel)

---

## 🎯 Tu misión

Construir los dos endpoints más usados del backend: el **feed** (lo que el usuario swipea) y el **registro de swipes** (cada like o dislike). Son la columna vertebral de la experiencia principal.

**Entrega el miércoles 10 jun:**
- `GET /api/feed` — devuelve lista paginada de contenido para swipe, usando el scoring de Manuel, excluyendo ya-vistos
- `POST /api/swipe` — guarda cada like/dislike en Firestore

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Schema `swipes` y `content` | **[[01-Israel-Perez\|Israel Pérez]]** — `docs/SCHEMA.md` | Wave 0 |
| `auth.js` middleware | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| `services/scoring.js` | **[[03-Manuel-Serrania\|Manuel Serranía]]** | Wave 1 |
| Colección `content` poblada | **[[03-Manuel-Serrania\|Manuel Serranía]]** | Wave 1 |

> 💡 **Puedes empezar con datos mock** en `content` y sin middleware mientras Andrés y Manuel terminan. Reemplaza los mocks cuando estén listos.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[10-Monserrat-Miranda|Monserrat]]** necesita `GET /api/feed` y `POST /api/swipe` para el SwipeDeck
- ✅ **[[07-Edgar-Coronel|Edgar]]** usa los mismos datos del feed para el ContentCard (puede mockearlos)
- ✅ **[[13-Ulises-Chaparro|Ulises]]** verifica estos endpoints en QA

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/04-Luis-agent-context.md — define qué archivos puedes tocar.

Necesito implementar los endpoints GET /api/feed y POST /api/swipe para el proyecto Recos-BnM.
Stack: Node.js + Express en backend/src/, Firestore (emulador localhost:8080 en dev).

CONTEXTO del schema Firestore:
  content/{contentId}: type, externalId, source, title, cover, year, genres (array),
    synopsis, popularity (float), rating (float 0-10), watchProviders (array), syncedAt
  swipes/{swipeId}: userId, contentId, contentType, action ("like"|"dislike"), timestamp

Middleware disponible: backend/src/middleware/auth.js
  - Ya verifica el token y añade req.user = { uid, email }
  - Importar con: const authMiddleware = require('../middleware/auth')

Módulo de scoring disponible: backend/src/services/scoring.js
  - Exporta: scoreCandidates(items) → array ordenado por score DESC

TAREA 1 — backend/src/routes/feed.js
Implementar GET /api/feed con authMiddleware aplicado:

Parámetros de query: userId (string), type ("movie"|"book"), cursor (string, opcional, para paginación)

Lógica:
1. Verificar que req.user.uid === userId (seguridad)
2. Leer prefs.genres del doc users/{userId} de Firestore
3. Consultar colección content donde type == type (query param)
   - Si hay géneros en prefs: filtrar donde genres array-contains-any prefs.genres
   - Limitar a 50 candidatos para scoring
4. Consultar colección swipes donde userId == userId — obtener todos los contentId ya vistos
5. Filtrar los candidatos excluyendo los ya-swipeados
6. Llamar a scoreCandidates(candidatosFiltrados) para ordenarlos
7. Implementar paginación por cursor (índice del último ítem devuelto)
8. Devolver máximo 10 items por página en formato:
   [{ contentId, title, cover, genres, rating, synopsis }]

Manejo de errores: 400 si faltan parámetros, 500 con mensaje genérico si falla Firestore.

TAREA 2 — backend/src/routes/swipe.js
Implementar POST /api/swipe con authMiddleware aplicado:

Body esperado: { userId, contentId, contentType, action }

Validaciones:
- userId debe coincidir con req.user.uid
- action debe ser "like" o "dislike"
- contentId y contentType son requeridos

Lógica:
- Crear doc en swipes/ con: userId, contentId, contentType, action, timestamp: Firestore.Timestamp.now()
- Responder HTTP 204 (sin body)
- Manejo de error: 400 si validación falla, 500 si falla Firestore

TAREA 3 — Verificar registro en backend/src/app.js
⚠️ NO modificar app.js — Andrés González creó el scaffold con todas las rutas pre-registradas.
Las siguientes líneas YA existen en app.js desde Wave 1:
  app.use('/api/feed',  require('./routes/feed'))
  app.use('/api/swipe', require('./routes/swipe'))
Solo asegúrate de que tu archivo backend/src/routes/feed.js y swipe.js existan
y exporten el router correctamente. app.js los cargará automáticamente.

TAREA 4 — Tests básicos
Crear backend/tests/feed.test.js y swipe.test.js usando Jest + supertest:
- GET /api/feed sin token → 401
- GET /api/feed sin userId/type → 400
- GET /api/feed válido → 200 con array
- POST /api/swipe válido → 204
- POST /api/swipe con action inválida → 400

Para los tests, mockear firebase-admin y el middleware de auth.

Muéstrame los endpoints funcionando con curl de ejemplo al terminar.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-luis-feed-api.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Luis Téllez Domínguez"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: No modificaste backend/src/app.js (ya existía del scaffold de Andrés).
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `backend/src/routes/feed.js` — GET /api/feed con paginación
- [ ] `backend/src/routes/swipe.js` — POST /api/swipe → 204
- [ ] Rutas registradas en `app.js`
- [ ] Tests: 401 sin token, 400 sin params, 204 en swipe válido
- [ ] Probado contra emulador de Firestore con datos reales de Manuel

---

## 🚀 Fase 2 — Engagement (Jun 13–15, 2026)

> **Tienes dos features P1 de Fase 2:** integrar el scoring de afinidad histórica de Manuel en `/api/feed`, y crear el endpoint de búsqueda `/api/search` que Juan Carlos necesita para el frontend.

### 🎯 Tu misión Fase 2

**Tarea 1 — Mejorar afinidad histórica en `/api/feed` (Feature P1 Fase 2):**

> ⚠️ CONTEXTO REAL DEL CÓDIGO: `backend/src/routes/feed.js` ya tiene afinidad básica implementada:
> ```javascript
> const genreAffinity = userGenres.reduce((acc, g) => ({ ...acc, [g]: 1.2 }), {})
> const scored = computeScore(unseen, genreAffinity)
> ```
> Esto aplica un multiplier PLANO de 1.2 a todos los géneros preferidos del usuario.
> **Tu tarea Fase 2 es REEMPLAZAR ese bloque** con `buildGenreAffinity()` que calcula multipliers DINÁMICOS basados en el historial real de likes/dislikes.

Reemplazar el bloque de affinity en `feed.js`:

```javascript
// ANTES (Fase 1 — quitar esto):
const genreAffinity = userGenres.reduce((acc, g) => ({ ...acc, [g]: 1.2 }), {})

// DESPUÉS (Fase 2 — reemplazar con esto):
const { computeScore, buildGenreAffinity } = require('../services/scoring')

// Obtener historial de swipes para afinidad dinámica
let genreAffinity = {}
if (swipesSnap.size >= 10) {
  // swipesSnap ya fue obtenido arriba para filtrar seen — reutilizar
  // Necesitamos genres de cada swipe: combinar con candidatos ya cargados
  const swipeData = swipesSnap.docs.map(swipeDoc => {
    const { contentId, action } = swipeDoc.data()
    const candidate = candidates.find(c => c.contentId === contentId)
    return { genres: candidate?.genres || [], action }
  }).filter(d => d.genres.length > 0)
  genreAffinity = buildGenreAffinity(swipeData)
}
// Si <10 swipes: genreAffinity = {} → computeScore usa baseScore sin ajuste (Fase 1 behavior)

const scored = computeScore(unseen, genreAffinity)
```

> Nota: `computeScore` ya está importado en `feed.js`. Solo agregar `buildGenreAffinity` al destructuring del require.

**Tarea 2 — Nuevo endpoint `GET /api/search` (Feature P1 Fase 2):**

Crear `backend/src/routes/search.js` para que Juan Carlos pueda integrar el buscador en el frontend.

```javascript
// backend/src/routes/search.js
const express = require('express')
const router  = express.Router()
const admin   = require('../firebase/admin')
const auth    = require('../middleware/auth')
const db      = admin.firestore()

// GET /api/search?q=interstellar&type=movie
router.get('/', auth, async (req, res) => {
  const { q, type } = req.query
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'El parámetro q debe tener al menos 2 caracteres' })
  }
  
  try {
    // Búsqueda case-insensitive por título (Firestore no soporta LIKE, usar rango alfanumérico)
    const qLower = q.toLowerCase()
    let query = db.collection('content').orderBy('titleLower')
      .startAt(qLower).endAt(qLower + '')
      .limit(20)
    
    if (type && ['movie', 'book'].includes(type)) {
      query = db.collection('content')
        .where('type', '==', type)
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
      genres:    doc.data().genres,
      rating:    doc.data().rating,
      synopsis:  doc.data().synopsis
    }))
    
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: 'Error en búsqueda' })
  }
})

module.exports = router
```

> ⚠️ Para que la búsqueda por `titleLower` funcione, el ingest de Manuel debe guardar `titleLower: title.toLowerCase()` en cada doc. Coordinarlo con Manuel.

**Tarea 3 — Registrar `/api/search` en `app.js`:**

⚠️ `backend/src/app.js` ya tiene la seguridad de Fase 1 (helmet, rate-limit). Solo agregar la línea de la ruta. Coordinar con Andrés si hace el cambio él o tú:

```javascript
app.use('/api/search', require('./routes/search'))
```

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Luis Téllez, responsable de /api/feed y /api/swipe.

TAREA 1 — Actualizar backend/src/routes/feed.js para usar genreAffinity:
Importar buildGenreAffinity de '../services/scoring'.
Cuando el usuario tiene ≥10 swipes, calcular el historial:
  - Consultar swipes collection: userId==userId AND contentType==type, limit 200, orderBy timestamp DESC
  - Combinar con los candidatos del feed para obtener genres por swipe
  - Llamar buildGenreAffinity(swipeData)
  - Pasar genreAffinity a scoreCandidates(candidatosFiltrados, genreAffinity)
Si el usuario tiene <10 swipes: llamar scoreCandidates(candidatosFiltrados) sin affinity (Fase 1 behavior).

TAREA 2 — Crear backend/src/routes/search.js
Endpoint GET /api/search?q={query}&type={movie|book} con authMiddleware:
- Validar que q tiene al menos 2 caracteres (400 si no)
- Buscar en content collection usando titleLower field (range query: startAt(qLower) endAt(qLower+''))
- Filtrar por type si se proporciona
- Devolver los campos: contentId, title, cover, type, genres, rating, synopsis
- Máximo 20 resultados
- Manejar el caso donde el índice compuesto no existe aún (graceful degradation)

TAREA 3 — Verificar que la nueva ruta se puede agregar a app.js
Solo decirme la línea exacta para agregar en app.js (no modificarlo tú, Andrés lo hace).
```

### ✅ Checklist Fase 2

- [x] `backend/src/routes/feed.js` — affinity plana (1.2) **reemplazada** por `buildGenreAffinity(swipeData)` cuando ≥10 swipes
- [x] `backend/src/routes/search.js` — `GET /api/search?q=&type=` funcional con sanitización
- [x] Coordinado con Manuel: campo `titleLower` en ingest + `buildGenreAffinity` exportado en `scoring.js`
- [x] Coordinado con Andrés: línea `/api/search` agregada a `app.js`
- [x] Tests de swipe: cambiados de **204** a **200** `{success:true}` (ya fue cambiado en el código)
- [x] Tests feed con affinity (mockear `buildGenreAffinity`)

---

## 🔐 Seguridad — Auditoría y Corrección (Jun 14, 2026)

> **Tu área de ownership es:** `backend/src/routes/feed.js`, `backend/src/routes/swipe.js`, `backend/src/routes/search.js`
> Ejecuta esta auditoría el sábado antes de abrir el PR de Fase 2. Si encuentras un bug, corrígelo en el mismo PR.

### Vulnerabilidades a revisar y testear

#### SEC-L-01 — IDOR en `/api/feed` y `/api/swipe` (Prioridad ALTA — ✅ YA IMPLEMENTADO, solo verificar)

> ⚠️ CONTEXTO: `feed.js` y `swipe.js` ya tienen la validación `if (req.user.uid !== userId) return 403`. Esta protección está en el código actual en main. Tu tarea es **verificar** que sigue funcionando en producción, no implementarla.

**Verificación** (ejecutar con Postman o curl):
```bash
# 1. Obtén tu token real desde la app
TOKEN="Bearer eyJ..."

# 2. Intenta pedir el feed de OTRO usuario (usa un uid que exista en Firestore)
curl -H "Authorization: $TOKEN" \
  "https://[CLOUD_RUN_URL]/api/feed?userId=UID_DE_OTRO_USUARIO&type=movie"
# Resultado esperado: HTTP 403 "Forbidden"
# Resultado actual: ¿qué responde?

# 3. Intenta registrar un swipe con el userId de otro
curl -X POST -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"UID_DE_OTRO","contentId":"abc","contentType":"movie","action":"like"}' \
  "https://[CLOUD_RUN_URL]/api/swipe"
# Resultado esperado: HTTP 403
```

**Fix si falla** — confirmar que feed.js y swipe.js tienen esta validación:
```javascript
// feed.js y swipe.js — ambos deben tener esto
if (req.user.uid !== userId) {
  return res.status(403).json({ error: 'Forbidden' })
}
```

---

#### SEC-L-02 — Inyección en `/api/search` (Prioridad ALTA)

**Qué es:** El parámetro `q` llega del cliente. Aunque Firestore no tiene SQL injection, sí puede haber problemas con payloads especiales.

**Verificación:**
```bash
# Probar con caracteres especiales y payloads
curl -H "Authorization: $TOKEN" \
  "https://[CLOUD_RUN_URL]/api/search?q='; DROP TABLE users; --"

curl -H "Authorization: $TOKEN" \
  "https://[CLOUD_RUN_URL]/api/search?q=<script>alert(1)</script>"

curl -H "Authorization: $TOKEN" \
  "https://[CLOUD_RUN_URL]/api/search?q=../../../etc/passwd"

# Todos deben devolver HTTP 200 con resultados vacíos o 400 — NUNCA un 500 con stack trace
```

**Fix si devuelve 500 con detalle interno:**
```javascript
// search.js — sanitizar q antes de usarla
const q = req.query.q?.trim().replace(/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g, '').slice(0, 100)
if (!q || q.length < 2) return res.status(400).json({ error: 'Búsqueda muy corta' })
```

---

#### SEC-L-03 — Cobertura de auth en todas las rutas (Prioridad ALTA)

**Verificación:**
```bash
# Todos estos deben devolver 401 sin token
curl "https://[CLOUD_RUN_URL]/api/feed?userId=x&type=movie"
curl -X POST "https://[CLOUD_RUN_URL]/api/swipe" -d '{}'
curl "https://[CLOUD_RUN_URL]/api/search?q=test"

# Si alguno devuelve 200 o 400 en vez de 401 → el middleware de auth no está aplicado
```

**Fix si alguna ruta falta auth:**
```javascript
// Verificar que CADA router.get/post tiene el middleware como segundo parámetro
router.get('/', auth, async (req, res) => { ... })   // ✅ correcto
router.get('/',      async (req, res) => { ... })   // ❌ falta auth
```

---

#### SEC-L-04 — Leakage de errores internos (Prioridad MEDIA)

**Verificación:**
```bash
# Provocar un error interno (pasar parámetros absurdos)
curl -H "Authorization: $TOKEN" \
  "https://[CLOUD_RUN_URL]/api/feed?userId=&type=invalid_type_xyz"
# Esperado: {"error":"Bad request"} o similar — NO stack traces, NO nombres de archivos
```

**Fix si el 500 expone detalles:**
```javascript
// En el catch de cada ruta:
} catch (err) {
  console.error('[feed]', err)  // log solo en servidor, nunca al cliente
  res.status(500).json({ error: 'Error interno' })
}
```

---

#### SEC-L-05 — Rate limit funcionando en `/api/feed` y `/api/swipe` (Prioridad MEDIA)

**Verificación** (necesitas hacer >30 requests en 1 minuto a `/api/swipe`):
```bash
# Script para verificar que el rate limit funciona
for i in $(seq 1 35); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Authorization: $TOKEN" -H "Content-Type: application/json" \
    -d '{"userId":"UID","contentId":"x","contentType":"movie","action":"like"}' \
    "https://[CLOUD_RUN_URL]/api/swipe")
  echo "Request $i: $STATUS"
done
# A partir de la request 31 debe aparecer HTTP 429
```

---

### 🤖 Prompt para Claude Code — Auditoría de seguridad

```
Proyecto: Recos-BnM. Soy Luis Téllez, dueño de backend/src/routes/feed.js, swipe.js, search.js.

Necesito auditar y corregir vulnerabilidades de seguridad en mis 3 routes. Revisa cada archivo y:

1. Verificar que TODOS los endpoints tienen el middleware auth aplicado
2. En feed.js y swipe.js: confirmar que req.user.uid === userId antes de cualquier operación (SEC-L-01)
   - Si no está: agregar validación y devolver 403
3. En search.js: sanitizar el parámetro q antes de usarlo en la query de Firestore (SEC-L-02)
   - Remover caracteres especiales: q.trim().replace(/[^a-zA-Z0-9áéíóúñüÁÉÍÓÚÑÜ\s]/g, '').slice(0, 100)
4. En TODOS los catch blocks: asegurar que solo se devuelve {"error": "mensaje genérico"}, nunca stack traces (SEC-L-04)
5. Verificar en app.js que el rate limiter está aplicado a /api/swipe con windowMs: 60000, max: 30 (SEC-L-05)

Por cada vulnerabilidad encontrada:
- Mostrar el código ANTES y DESPUÉS del fix
- Explicar brevemente por qué es un riesgo

Al terminar, generar un mini reporte: cuántas vulnerabilidades encontradas, cuántas corregidas.
No tocar app.js (es de Andrés). No tocar scoring.js (es de Manuel).
```

### ✅ Checklist Seguridad Luis

- [x] SEC-L-01: IDOR bloqueado en /api/feed — probado con userId de otro usuario → 403
- [x] SEC-L-01: IDOR bloqueado en /api/swipe — probado con userId de otro usuario → 403
- [x] SEC-L-02: Sanitización en /api/search — probado con `<script>` y caracteres especiales → no falla
- [x] SEC-L-03: Todos los endpoints responden 401 sin token
- [x] SEC-L-04: Ningún 500 expone stack trace o paths internos
- [x] SEC-L-05: /api/swipe devuelve 429 después de 30 requests/min
- [x] DevLog actualizado con hallazgos de seguridad
