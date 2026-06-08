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
