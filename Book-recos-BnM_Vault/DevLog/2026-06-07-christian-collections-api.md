---
project: "Recos-BnM"
date: "2026-06-07"
author_human: "Christian Ruiz Hurtado"
agent: "Claude Code"
model: "claude-opus-4-8"
session_duration: "1h"
tags: [devlog, sprint-1, wave-2, backend, collections]
---

# DevLog — 2026-06-07 — API CRUD /collections

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- Implementado el **CRUD completo** de `/api/collections` en `backend/src/routes/collections.js` (Express Router), todos los endpoints protegidos con `authMiddleware`:
  - **GET /api/collections** — ✅ confirmado implementado (el endpoint que estaba sin asignar y fue reasignado a Christian por Eduardo el 2026-06-05). Query params `userId` (req), `type` (opc: movie|book), `listName` (opc). Verifica `req.user.uid === userId`, filtra y ordena por `savedAt` DESC.
  - **POST /api/collections** — valida `userId === req.user.uid`, `contentId`/`contentType` requeridos, defaults `listName="Guardados"` y `personalNote=""`, **verificación de duplicados** (mismo `contentId` + `userId` → 409), crea doc con `savedAt: Timestamp.now()`, responde 201.
  - **PATCH /api/collections/:id** — update parcial de `personalNote`/`listName`; 404 si no existe, 403 si no es dueño, 200 con `{ collectionId, updated }`.
  - **DELETE /api/collections/:id** — 404 si no existe, 403 si no es dueño, 204 sin body.
- Creado `backend/tests/collections.test.js` (Jest + supertest) con los 7 casos requeridos + extras (404, duplicado, GET sin filtro). Self-contained: mockea `firebase-admin` con un Firestore en memoria y el middleware de auth con parser `Bearer <uid>`, por lo que **no requiere el emulador ni credenciales reales**.

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-opus-4-8)
- **Archivos creados/modificados:**
  - `backend/src/routes/collections.js` (creado — propio)
  - `backend/tests/collections.test.js` (creado — propio)
  - `Book-recos-BnM_Vault/DevLog/DevLog_Index.md` (fila de esta sesión)
  - **`backend/package.json`: NO se modifica.** El `main` actual ya incluye `jest`/`supertest`, el script `test` y un bloque de config `jest` con `testMatch: ["**/tests/**/*.test.js"]` que descubrirá automáticamente `backend/tests/collections.test.js`. La rama se rebaseó sobre el `main` actual para evitar conflictos de merge.
- **Decisiones autónomas del agente:**
  - **GET sin índices compuestos:** la consulta filtra por `userId` en Firestore y luego ordena/afina (`type`, `listName`, `savedAt` DESC) **en memoria**, para no depender de índices compuestos gestionados por Israel (`orderBy + where` los requeriría). Adecuado para el volumen del MVP; revisar si la data crece mucho.
  - **Códigos de estado extra:** 409 para duplicados en POST (`{ error: 'already_exists', collectionId }`), 400 para `type`/`contentType` inválidos y para PATCH sin campos (`no_fields`).
  - **Serialización de `savedAt`:** se devuelve como ISO string (`Timestamp.toDate().toISOString()`).
- **Correcciones manuales:** pendientes (ver Bloqueantes — el equipo debe resolver el registro de ruta y el toolchain antes de correr en verde).
- **Prompt inicial usado:** Sprint file de Christian (`06-Christian-agent-context.md`).

## Bloqueantes encontrados
1. **⚠️ La ruta NO está registrada en `app.js`.** El brief afirmaba que `app.use('/api/collections', require('./routes/collections'))` "ya existe desde Wave 1", pero `backend/src/app.js` **no la contiene** (de hecho `backend/src/routes/` no existía). Como `app.js` es propiedad de **Andrés (archivo PROHIBIDO)**, **no se modificó**. → **Andrés debe registrar la ruta** para que los endpoints respondan. El módulo ya exporta el router correctamente.
2. **⚠️ No hay toolchain de Node en el entorno.** `node`/`npm` no están instalados/en PATH y `backend/node_modules` no existe, por lo que **no fue posible ejecutar `npm install` ni `npm test` en esta sesión**. Los ejemplos de respuesta abajo son **ilustrativos, derivados del código** (no ejecutados). Una vez con Node disponible: `cd backend && npm install && npm test` (el `testMatch` de `main` ya incluye este archivo).

### Ejemplos de respuesta (ilustrativos, derivados del código)
- **POST 201** → `{ "collectionId": "doc_1" }`
- **PATCH 200** → `{ "collectionId": "doc_1", "updated": { "personalNote": "Me encantó", "listName": "Favoritos" } }`
- **DELETE 204** → (sin body)

## Actualización 2026-06-10 — ejecución real de tests + fix
- Se instaló Node 24 / npm 11 y se **ejecutó la suite de verdad** (ya no solo revisión estática).
- **Bug encontrado y corregido en el test** (no en la ruta): la fábrica de `jest.mock('../src/firebase/admin')` referenciaba helpers fuera de scope (`fakeFirestore`, `FakeTimestamp`), lo que Jest prohíbe por el *hoisting* de `jest.mock` (solo permite identificadores con prefijo `mock`). Renombrados a `mockFakeFirestore` / `mockFakeTimestamp`.
- **Casos de borde agregados** a `backend/tests/collections.test.js`: POST `missing_fields` / `invalid_content_type` / defaults `Guardados`+`""`; PATCH update parcial / `no_fields` (400); GET `missing_userId` / `invalid_type` / filtro por `listName`.
- **Resultado: 20/20 tests en verde** (`npx jest tests/collections.test.js --runInBand`).

## Próximos pasos para el siguiente colaborador
- **Andrés:** ✅ ya registró `app.use('/api/collections', require('./routes/collections'))` en `backend/src/app.js`. El tooling de tests ya está en `main`, no requiere cambios en `package.json`.
- Correr la suite: `cd backend && npm install && npm test` (20 casos).
- **Diana** puede consumir **GET /api/collections** para la Biblioteca (desbloqueada).
- **Marina** puede consumir **POST /api/collections** para el botón "Guardar" en DetailSheet (desbloqueada).
- Endpoints disponibles: `GET`, `POST`, `PATCH /:id`, `DELETE /:id` en `/api/collections`.
