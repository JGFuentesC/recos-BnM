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
