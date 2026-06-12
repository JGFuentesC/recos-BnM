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

---

## 🧪 QA Physical Testing — Tu asignación (Jun 13–15, 2026)

> **Eres parte del equipo de QA/Testing.** Tu rol en Fase 2 es ejecutar las pruebas físicas del sistema en producción (Firebase Hosting + Cloud Run). Trabajas con el archivo `Book-recos-BnM_Vault/PHYSICAL_TEST_VALIDATION.md`.
>
> **Herramienta requerida:** Postman o Bruno con la colección `docs/Recos-BnM-API-Collection.json`
> **URL a probar:** Confirmar con Germán antes del viernes (Firebase Hosting + Cloud Run)

### 📋 Tus secciones asignadas: 39 casos

Eres el responsable de las secciones de Auth y API — las más técnicas, que requieren conocer los endpoints.

---

#### Sección 0 — Pre-requisitos (7 casos: P-01 a P-07)

**Ejecutar PRIMERO — sin esto no se puede continuar.**

| Caso | Qué verificar | Cómo |
|------|--------------|------|
| P-01 | URL Firebase Hosting activa | Abrir en browser, confirmar carga |
| P-02 | Backend Cloud Run responde | `GET [API_URL]/health` → `{"ok":true}` |
| P-03 | 2 cuentas de prueba disponibles | Una Google + una email/password ya creadas |
| P-04 | Acceso a Postman/Bruno | Colección `Recos-BnM-API-Collection.json` importada |
| P-05 | Firebase Console abierta | Firestore visible para verificar docs escritos |
| P-06 | Modo responsive 375px | Chrome DevTools → Toggle device → iPhone SE |
| P-07 | Catálogo ≥20 items | Firebase Console → Firestore → collection `content` |

✅ **Si algún pre-requisito falla:** avisar a Germán (P-01/P-02/P-08) o Israel (P-07) ANTES de continuar.

---

#### Sección 1 — HU1.1 Registro y Login (16 casos: R-01 a R-09, L-01 a L-07)

**Orden de ejecución:**

**1A. Registro con Email** (R-01 a R-07):

```
☐ R-01: Navegar a /register → pantalla con 4 campos (Nombre, Correo, Contraseña, Confirmar)
☐ R-02: Dejar vacíos + registrar → error "Escribe tu nombre."
☐ R-03: Nombre + correo inválido → error "Correo invalido."
☐ R-04: Nombre + correo OK + contraseña 5 chars → error "al menos 6 caracteres"
☐ R-05: Todo OK pero contraseñas distintas → error "no coinciden"
☐ R-06: Todo correcto → "Creando cuenta..." → redirige a /onboarding
☐ R-07: Firebase Console → Firestore → users → doc {userId} creado ✓
```

**1B. Registro con Google** (R-08 a R-09):

```
☐ R-08: Botón "Registrarse con Google" → popup → seleccionar cuenta → /onboarding ✓
☐ R-09: Abrir popup y cerrarlo → error "Cerraste la ventana..."
```

**1C. Login con Email** (L-01 a L-06):

```
☐ L-01: Navegar a /login → pantalla "Match&Read" con botón Google y formulario
☐ L-02: Email + contraseña incorrectos → error "Correo o contraseña incorrectos."
☐ L-03: Login cuenta con onboarding hecho → redirige a /feed (NO a /onboarding)
☐ L-04: Login cuenta nueva (sin onboarding) → redirige a /onboarding
☐ L-05: Acceder a /feed sin auth → redirige a /login automáticamente
☐ L-06: Acceder a /onboarding sin auth → redirige a /login automáticamente
```

**1D. Login con Google** (L-07):

```
☐ L-07: Botón "Continuar con Google" → popup → /feed si cold_start_done, /onboarding si no
```

---

#### Sección 8 — API Backend Postman/Bruno (16 casos: A-01 a A-16)

**Preparación:** Obtener token con Firebase Auth → en DevTools → Network → cualquier request autenticado → copiar el Bearer token.

```
☐ A-01: GET /health → {"ok":true} HTTP 200
☐ A-02: GET /api/private/ping SIN token → HTTP 401
☐ A-03: GET /api/private/ping CON token → {"ok":true,"uid":"..."} HTTP 200
☐ A-04: GET /api/feed?userId={uid}&type=movie SIN token → HTTP 401
☐ A-05: GET /api/feed CON token (type=movie) → HTTP 200, array con score ordenado
☐ A-06: GET /api/feed CON token (type=book) → HTTP 200, array de libros
☐ A-07: GET /api/feed con cursor (paginación) → HTTP 200, siguiente página
☐ A-08: POST /api/swipe token + action:like → HTTP 204 sin body
☐ A-09: POST /api/swipe token + action:dislike → HTTP 204 sin body
☐ A-10: GET /api/content/{id} válido → HTTP 200, objeto completo + watchProviders array
☐ A-11: GET /api/content/INVALID_ID → HTTP 404
☐ A-12: GET /api/collections?userId={uid} → HTTP 200, array colecciones
☐ A-13: POST /api/collections → HTTP 201 con collectionId
☐ A-14: PATCH /api/collections/{id} → HTTP 200
☐ A-15: DELETE /api/collections/{id} → HTTP 204
☐ A-16: Cualquier endpoint con token expirado → HTTP 401
```

---

### 📝 Cómo registrar bugs

Cuando un caso falla:

1. Marca con ❌ en el archivo `PHYSICAL_TEST_VALIDATION.md`
2. Pega en el canal del equipo:
```
BUG-XXX | Caso: [A-05] | Descripción: [qué pasó vs qué esperabas]
Sección: API Backend | Severidad: Alta/Media/Baja
```
3. Abre Claude Code y usa el prompt del PHYSICAL_TEST_VALIDATION.md §14

### ✅ Checklist QA Héctor

- [ ] Sección 0 Pre-req: 7/7 casos verificados ✅ antes de continuar
- [ ] Sección 1 Auth: 16/16 casos ejecutados y documentados
- [ ] Sección 8 API: 16/16 casos ejecutados en Postman/Bruno
- [ ] Bugs encontrados registrados en PHYSICAL_TEST_VALIDATION.md §14
- [ ] Resumen de resultados completado en §15A (columna Auth + API)
