# Sprint 1 — Israel Pérez García
**Nivel:** Medio | **Épicas:** 1–5 / Infra | **Wave:** 🔴 0 (PRIMERO — bloquea a todos)

---

## 🎯 Tu misión

Eres el **camino crítico del proyecto completo**. Sin tu schema, nadie puede escribir código que funcione en producción. Tu tarea es crear la base de datos (Firestore), las reglas de seguridad, los índices, y el emulador local para que el equipo pueda desarrollar sin depender de internet ni del proyecto real de GCP.

**Entrega el miércoles 10 jun:**
- 4 colecciones Firestore con los campos exactos del PRD §6
- Reglas de seguridad del PRD §9 desplegadas
- `firestore.indexes.json` con índice compuesto (`type + genres`)
- `SCHEMA.md` documentado en el repo
- Firebase Emulator configurado y funcionando en local

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Estado |
|---|---|---|
| PRD §6 (modelo de datos) | `PRD Recos-BnM.md` | ✅ Disponible |
| PRD §9 (reglas de seguridad) | `PRD Recos-BnM.md` | ✅ Disponible |
| Proyecto Firebase creado | PM / tú mismo | Necesita confirmación |

> No dependes de ningún compañero. **Puedes empezar ahora.**

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[02-Andres-Gonzalez|Andrés]]** necesita el schema `users` para crear el documento al registrar
- ✅ **[[03-Manuel-Serrania|Manuel]]** necesita el schema `content` para el ingest job
- ✅ **[[04-Luis-Tellez|Luis]]** necesita el schema `swipes` para el endpoint POST /api/swipe
- ✅ **[[05-Hector-Morales|Héctor]]** necesita el schema `content` para GET /api/content/{id}
- ✅ **[[06-Christian-Ruiz|Christian]]** necesita el schema `collections` para el CRUD
- ✅ **[[12-Diana-Alvarez|Diana]]** necesita las reglas de `collections` para el acceso de lectura
- ✅ **Todo el equipo** necesita el emulador para desarrollar sin costos

---

## 📋 Pasos paso a paso

### Paso 1 — Inicializar Firebase en el repo
```bash
# Desde la raíz del repo
firebase init
# Seleccionar: Firestore, Emulators
# Proyecto: recos-bnm (el que creó el PM)
```

### Paso 2 — Configurar el emulador (`firebase.json`)
El archivo `firebase.json` debe quedar así:
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "ui": { "enabled": true }
  }
}
```

### Paso 3 — Escribir las reglas de seguridad (`firestore.rules`)
Copia exactamente las reglas del PRD §9 (el prompt de Claude Code las generará).

### Paso 4 — Crear el índice compuesto (`firestore.indexes.json`)
El feed necesita filtrar por `type` y ordenar por `popularity`. Claude Code generará este archivo.

### Paso 5 — Crear `docs/SCHEMA.md`
Documentar cada colección: campos, tipos, quién escribe, quién lee. Este documento es la referencia del equipo.

### Paso 6 — Arrancar el emulador y verificar
```bash
firebase emulators:start
# Abrir http://localhost:4000 para ver la UI del emulador
```

### Paso 7 — Compartir con el equipo
- Hacer commit de todos los archivos
- Abrir PR → main
- Avisar en el canal del equipo que el emulador ya funciona

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/01-Israel-agent-context.md — define qué archivos puedes tocar.

Necesito que configures la base de datos Firestore completa para el proyecto Recos-BnM.
El stack es: Firebase (Firestore + Auth + Hosting), Cloud Run (Node.js), GCP.

TAREA 1 — Crear firestore.rules con exactamente estas reglas de seguridad:
- users/{userId}: allow read, write si request.auth.uid == userId
- swipes/{swipeId}: allow read, write si request.resource.data.userId == request.auth.uid
- collections/{collectionId}: allow read, write si resource == null || resource.data.userId == request.auth.uid
- content/{contentId}: allow read si autenticado; allow write: if false (solo el job de ingest escribe)
Todas las reglas requieren request.auth != null.

TAREA 2 — Crear firestore.indexes.json con:
- Índice compuesto en colección "content": campos "type" (ASC) + "genres" (ARRAY) + "popularity" (DESC)
- Índice compuesto en colección "content": campos "type" (ASC) + "rating" (DESC)

TAREA 3 — Actualizar firebase.json para incluir los emulators de auth (puerto 9099), 
firestore (puerto 8080), hosting (puerto 5000) y ui habilitado.

TAREA 4 — Crear el archivo docs/SCHEMA.md documentando las 4 colecciones con 
exactamente los campos del PRD:

Colección users/{userId}:
  email (string), displayName (string), authProvider (string), createdAt (timestamp)
  prefs: { genres: array, authors: array, directors: array, cold_start_done: boolean }

Colección content/{contentId}:
  type ("movie" | "book"), externalId (string), source ("tmdb" | "google_books")
  title (string), cover (string, URL), year (number), genres (array of strings)
  synopsis (string), popularity (number, float), rating (number, 0-10 normalizado)
  watchProviders (array, solo movies; [] si no hay dato), syncedAt (timestamp)

Colección swipes/{swipeId}:
  userId (string), contentId (string), contentType ("movie" | "book")
  action ("like" | "dislike"), timestamp (timestamp)

Colección collections/{collectionId}:
  userId (string), contentId (string), contentType ("movie" | "book")
  listName (string, default "Guardados"), personalNote (string), savedAt (timestamp)

TAREA 5 — Verificar que firebase emulators:start arranca sin errores. 
Si hay errores, corrígelos antes de hacer commit.

Al terminar, genera un resumen de qué archivos creaste/modificaste y cómo verificar 
que el emulador funciona correctamente con firebase emulators:start.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-israel-schema.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Israel Pérez García"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-0]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `firestore.rules` — reglas del PRD §9 exactas
- [ ] `firestore.indexes.json` — índice `type + genres + popularity`
- [ ] `firebase.json` — emulators configurados
- [ ] `docs/SCHEMA.md` — 4 colecciones documentadas
- [ ] `firebase emulators:start` arranca sin errores
- [ ] PR abierto y el equipo notificado

---

## 🚀 Fase 2 — Engagement (Jun 13–15, 2026)

> **Objetivo:** Dejar la infraestructura lista para que el scoring de afinidad y las listas compartibles funcionen en producción.

### 🎯 Tu misión Fase 2

**Prioridad 0 — Deploy Fase 1 a producción (Jueves 12 jun, URGENTE):**

```bash
# Publicar reglas e índices a Firestore producción
# ⚠️ Las rutas ya están mapeadas en firebase.json:
#    "rules": "src/firestore/firestore.rules"
#    "indexes": "src/firestore/firestore.indexes.json"
# El comando usa firebase.json automáticamente — no hay que especificar rutas manualmente.
firebase deploy --only firestore:rules,firestore:indexes

# Verificar que las reglas estén activas (no en allow read/write: if true)
# Firebase Console → Firestore → Rules → confirmar fecha de publicación
```

**Tarea 1 — Dos nuevos índices en `src/firestore/firestore.indexes.json` (Fase 2):**

> ⚠️ Editar **`src/firestore/firestore.indexes.json`** (NO el `firestore.indexes.json` de la raíz — ese es una copia antigua). El `firebase.json` apunta al de `src/firestore/`.

**Índice A — Swipes para `buildGenreAffinity` (Manuel lo necesita):**
```json
{
  "collectionGroup": "swipes",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId",      "order": "ASCENDING" },
    { "fieldPath": "contentType", "order": "ASCENDING" },
    { "fieldPath": "action",      "order": "ASCENDING" }
  ]
}
```

**Índice B — Content por `titleLower` para búsqueda (Luis + Juan Carlos lo necesitan):**
```json
{
  "collectionGroup": "content",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "titleLower", "order": "ASCENDING" }
  ]
}
```

Después de agregar ambos índices, el archivo `src/firestore/firestore.indexes.json` quedará con **4 índices** (los 2 existentes + estos 2 nuevos).

**Tarea 2 — Campo `shareToken` en schema de collections (Fase 2 listas compartibles):**

Christian Ruiz va a agregar `shareToken` y `isPublic` a la colección `collections`. Actualizar `docs/SCHEMA.md` con los nuevos campos opcionales:

```
collections/{collectionId}
  ...campos existentes...
  shareToken: string (opcional, generado al compartir)
  isPublic: boolean (default: false)
```

Actualizar también las reglas para permitir lectura pública de colecciones con `isPublic == true`:

```javascript
match /collections/{collectionId} {
  // Lectura pública si la colección tiene shareToken
  allow read: if resource.data.isPublic == true
           || (request.auth != null && resource.data.userId == request.auth.uid);
  allow write: if request.auth != null
            && (resource == null || resource.data.userId == request.auth.uid);
}
```

**Tarea 3 — Campo `fcmToken` en schema de users (Fase 2 notificaciones):**

Germán va a guardar el FCM token de cada usuario para notificaciones push. Agregar campo al schema:

```
users/{userId}
  ...campos existentes...
  fcmToken: string (opcional, guardado cuando el usuario acepta notificaciones)
  notificationsEnabled: boolean (default: false)
```

**Tarea 4 — Deploy producción verificación final:**

```bash
# Después de deploy, verificar en GCP Console:
# GCP-01: Firebase Auth → Email/Password y Google habilitados
# GCP-02: Firestore → colecciones users, content, swipes, collections existen
# GCP-03: Firestore → Indexes → índices "Enabled"
# GCP-04: Firestore → Rules → fecha de publicación reciente
```

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Israel Pérez, responsable de Firestore.
Rutas reales en el repo:
  - Reglas:  src/firestore/firestore.rules
  - Índices: src/firestore/firestore.indexes.json
  (firebase.json ya apunta a estas rutas — no tocar la raíz firestore.indexes.json)

TAREA 1 — Agregar 2 nuevos índices a src/firestore/firestore.indexes.json:

Índice A — Swipes (para buildGenreAffinity de Manuel):
  Colección "swipes", campos: userId (ASC) + contentType (ASC) + action (ASC)

Índice B — Content por titleLower (para GET /api/search de Luis):
  Colección "content", campos: titleLower (ASC)
  (Simple field index — permite range queries: startAt(q).endAt(q+''))

TAREA 2 — Actualizar src/firestore/firestore.rules para permitir lectura pública de collections con isPublic==true:
La regla debe quedar: allow read si isPublic==true OR (autenticado Y es el dueño).
La regla write permanece igual: solo el dueño puede escribir.

TAREA 3 — Actualizar docs/SCHEMA.md agregando los nuevos campos opcionales:
- collections: shareToken (string, opcional), isPublic (boolean, default false)
- users: fcmToken (string, opcional), notificationsEnabled (boolean, default false)

Después de cada cambio, ejecutar: firebase deploy --only firestore:rules,firestore:indexes
y verificar que no hay errores en el output.
```

### ✅ Checklist Fase 2

- [ ] `src/firestore/firestore.rules` — regla de lectura pública para `isPublic == true`
- [ ] `src/firestore/firestore.indexes.json` — índice swipes: `userId + contentType + action` (A)
- [ ] `src/firestore/firestore.indexes.json` — índice content: `titleLower ASC` (B)
- [ ] `docs/SCHEMA.md` — campos `shareToken`, `isPublic`, `fcmToken`, `notificationsEnabled`
- [ ] `firebase deploy --only firestore:rules,firestore:indexes` exitoso en producción
- [ ] GCP-01 a GCP-05 verificados en consola
