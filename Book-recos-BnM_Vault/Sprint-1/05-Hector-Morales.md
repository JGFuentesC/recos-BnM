# Sprint 1 — Héctor Morales Marbán
**Nivel:** Bajo | **Épica:** 4 | **Wave:** 🟡 2 (después de Andrés + Manuel)

---

## 🎯 Tu misión

Construir el endpoint de **detalle de contenido**: cuando el usuario toca una tarjeta para ver más info, tu endpoint entrega toda la información extendida — incluyendo en qué plataformas de streaming está disponible la película.

**Entrega el miércoles 10 jun:**
- `GET /api/content/{id}` — devuelve el objeto `content` completo desde Firestore, incluyendo `watchProviders`

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Schema `content` (campos exactos) | **[[01-Israel-Perez\|Israel Pérez]]** — `docs/SCHEMA.md` | Wave 0 |
| `auth.js` middleware | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Colección `content` poblada | **[[03-Manuel-Serrania\|Manuel Serranía]]** | Wave 1 |

> 💡 **Puedes empezar con un doc mock** hardcodeado mientras Manuel termina el ingest.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[11-Marina-Garcia|Marina]]** necesita este endpoint para el DetailSheet (la pantalla de detalle)
- ✅ **[[13-Ulises-Chaparro|Ulises]]** lo verifica en la colección Postman de QA

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/05-Hector-agent-context.md — define qué archivos puedes tocar.

Necesito implementar el endpoint GET /api/content/{id} para el proyecto Recos-BnM.
Stack: Node.js + Express en backend/src/, Firestore (emulador localhost:8080 en dev).

CONTEXTO del schema Firestore (colección content/{contentId}):
  type: "movie" | "book"
  externalId: string
  source: "tmdb" | "google_books"
  title: string, cover: string (URL), year: number, genres: array
  synopsis: string, popularity: number, rating: number (0-10)
  watchProviders: array de strings (nombres de plataformas, ej. ["Netflix","Disney+"])
    — puede ser [] si no hay dato para movies, siempre [] para books
  syncedAt: timestamp

Middleware disponible: backend/src/middleware/auth.js (req.user = { uid, email })

TAREA 1 — backend/src/routes/content.js
Implementar GET /api/content/:id con authMiddleware aplicado:

Lógica:
1. Leer el doc content/{id} de Firestore
2. Si no existe → responder 404 { error: "Content not found" }
3. Si el campo watchProviders está vacío o undefined → devolver watchProviders: []
   IMPORTANTE: nunca inventar disponibilidad de streaming. Devolver solo lo que está en Firestore.
4. Incluir en la respuesta la atribución TMDB si source === "tmdb":
   añadir campo: attribution: "This product uses the TMDB API but is not endorsed or certified by TMDB"
5. Responder 200 con el objeto completo:
   { contentId, type, title, cover, year, genres, synopsis, rating, 
     watchProviders, source, attribution (si aplica) }

Manejo de errores:
- 401 sin token (el middleware lo maneja)
- 404 si el doc no existe
- 500 con mensaje genérico si falla Firestore

TAREA 2 — Verificar registro en backend/src/app.js
⚠️ NO modificar app.js — Andrés González creó el scaffold con todas las rutas pre-registradas.
La siguiente línea YA existe en app.js desde Wave 1:
  app.use('/api/content', require('./routes/content'))
Solo asegúrate de que backend/src/routes/content.js exista y exporte el router correctamente.

TAREA 3 — Tests básicos con Jest + supertest
Crear backend/tests/content.test.js:
- GET /api/content/id-valido sin token → 401
- GET /api/content/id-que-no-existe → 404
- GET /api/content/id-valido → 200 con objeto completo
- Verificar que watchProviders siempre es array (nunca undefined/null)
- Verificar que movies de TMDB incluyen el campo attribution

Para los tests, usar un doc mock hardcodeado en vez del emulador real.

Muéstrame un ejemplo de respuesta completa de GET /api/content/{id} al terminar.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-hector-content-api.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Héctor Morales Marbán"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: No modificaste backend/src/app.js. GET /api/collections NO es tu endpoint (es de Christian).
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `backend/src/routes/content.js` — GET /api/content/:id
- [ ] `watchProviders: []` cuando no hay dato (nunca undefined)
- [ ] Campo `attribution` incluido para items de TMDB
- [ ] 404 cuando el id no existe
- [ ] Tests: 401, 404, 200 con watchProviders como array
- [ ] Ruta registrada en `app.js`
