---
proyecto: "Recos-BnM"
fecha: "2026-06-10"
relacionado: "09_Risk_Governance/SECURITY-AUDIT-2026-06-10.md"
poc1: "2026-06-12"
poc2_final: "2026-06-15"
movido_a_vault: "2026-06-11 — Edgar Coronel (PM), MEDIUM-05"
---

# Plan de Remediación de Seguridad — Sprint 1
## Recos-BnM · 10 jun 2026

> Basado en `09_Risk_Governance/SECURITY-AUDIT-2026-06-10.md`  
> **Security Clearance bloqueado** por 3 hallazgos HIGH activos.  
> Este documento asigna cada corrección a la persona responsable con los comandos exactos a ejecutar.

---

## Cronograma general

```
HOY mar 10 jun  ──►  jue 11 jun  ──►  vie 12 jun (PoC 1)  ──►  lun 15 jun (PoC 2)
│                    │                │                          │
├─ HIGH-01 JC        ├─ HIGH-02 Andrés ├─ Verificar clearance    ├─ MEDIUM Sprint 2
├─ HIGH-03 Andrés    ├─ MEDIUM-01      └─ Deploy con clearance    └─ LOW Sprint 2
└─ MEDIUM-02/04      └─ MEDIUM-03
```

---

## 👤 Juan Carlos Macías `juanmmayen98-pixel`

**Hallazgo asignado:** HIGH-01 — API Keys expuestas en historial de git

### ¿Qué pasó?
El commit `481b646` en main contiene `jc.env` con claves reales. Aunque el archivo fue eliminado del tracking (PR #25), las claves **siguen visibles en el historial público** de GitHub.

### Acciones requeridas

**Deadline: hoy martes 10 jun (antes de las 6pm)**

#### 1. Rotar TMDB API Key
```
1. Ir a: https://www.themoviedb.org/settings/api
2. En "API Key (v3 auth)" → hacer clic en "Regenerate"
3. En "API Read Access Token (v4 auth)" → hacer clic en "Regenerate"
4. Copiar la nueva clave
5. Compartir la nueva clave con Andrés (para GitHub Secrets) via canal privado (NO por chat público)
```

#### 2. Rotar Google Books API Key
```
1. Ir a: https://console.cloud.google.com
2. APIs & Services → Credentials
3. Localizar la API Key usada en el proyecto recos-bnm
4. Hacer clic en los tres puntos → "Regenerate key" (o Delete y crear nueva)
5. Compartir con Andrés para GitHub Secrets
```

#### 3. Rotar Firebase Web API Key
```
1. Ir a: https://console.firebase.google.com → Proyecto recos-bnm
2. Project Settings → General → "Web API Key"
3. En Google Cloud Console → APIs & Services → Credentials
4. Localizar la API Key de tipo "Browser key" → Restricciones → agregar dominio de Hosting
   Dominio a agregar: *.web.app, *.firebaseapp.com, localhost
   (Restringir es mejor que regenerar ya que los usuarios registrados podrían perder sesión)
```

#### 4. Confirmar en el canal del equipo
```
Mensaje a enviar (reemplazar ✅ cuando hagas cada paso):
"Rotación de keys completada:
  ✅/❌ TMDB API Key rotada
  ✅/❌ Google Books Key rotada
  ✅/❌ Firebase Web Key restringida a dominios autorizados
  ✅/❌ Nuevas keys enviadas a Andrés para GitHub Secrets"
```

#### 5. Opcional — Purgar historial de git (coordinar con Edgar PM)
```bash
# DESTRUCTIVO — requiere force push. Coordinar con todo el equipo primero.
# Solo ejecutar si Edgar (PM) aprueba y el equipo sincroniza sus repos locales.

pip install git-filter-repo
git filter-repo --path jc.env --invert-paths --force
git push origin main --force
# Después: todos los integrantes deben hacer git clone de nuevo
```

**Verificación:** El hallazgo HIGH-01 se cierra cuando Juan Carlos confirma rotación de las 3 claves.

---

## 👤 Andrés González `Agh28`

**Hallazgos asignados:** HIGH-03 · MEDIUM-01 · MEDIUM-02 · MEDIUM-04

### HIGH-03 — dotenv.config() cargado tarde en app.js

**Deadline: hoy martes 10 jun**

**Problema actual** (`backend/src/app.js`):
```js
// ❌ ACTUAL — auth.js (y firebase/admin) se importan ANTES de dotenv.config()
const express = require('express')
const cors    = require('cors')
const dotenv  = require('dotenv')
const auth    = require('./middleware/auth')   // ← firebase/admin inicializa aquí
dotenv.config()                                // ← demasiado tarde
```

**Fix** (cambio mínimo — mover 1 línea):
```js
// ✅ CORRECTO — dotenv primero, siempre
require('dotenv').config()                     // ← PRIMERA LÍNEA
const express = require('express')
const cors    = require('cors')
const auth    = require('./middleware/auth')
// ... resto igual
```

**Archivo a editar:** `backend/src/app.js` línea 1

---

### MEDIUM-01 — CORS wildcard `*` en producción

**Deadline: jue 11 jun** (antes del deploy del PoC 1)

**Problema actual:**
```js
app.use(cors())  // ← permite cualquier origen
```

**Fix completo** (`backend/src/app.js`):
```js
// Reemplazar app.use(cors()) con:
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS: Origin ${origin} not allowed`))
  },
  credentials: true,
}))
```

**Variable a agregar en GitHub Secrets:**
```
ALLOWED_ORIGINS=https://recos-bnm.web.app,https://recos-bnm.firebaseapp.com
```

---

### MEDIUM-02 — express.json() sin límite de tamaño

**Deadline: hoy martes 10 jun** (cambio de 2 minutos)

**Problema actual:**
```js
app.use(express.json())
```

**Fix:**
```js
app.use(express.json({ limit: '10kb' }))
```

**Archivo a editar:** `backend/src/app.js` línea 10

---

### MEDIUM-04 — Sin headers de seguridad HTTP (Helmet)

**Deadline: jue 11 jun**

```bash
cd backend
npm install helmet
```

**Agregar en `backend/src/app.js`** después de `require('dotenv').config()`:
```js
const helmet = require('helmet')
// ...
app.use(helmet())
app.use(cors({ ... }))   // cors después de helmet
```

---

### Configurar GitHub Secrets (bloqueante para deploy PoC 1)

**Deadline: jue 11 jun** — sin esto el CI/CD no puede hacer deploy

```
Ir a: https://github.com/JGFuentesC/recos-BnM/settings/secrets/actions

Agregar los siguientes secrets (valores que te dará Juan Carlos):
  VITE_FIREBASE_API_KEY         = <nueva key rotada>
  VITE_FIREBASE_AUTH_DOMAIN     = recos-bnm.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID      = recos-bnm
  VITE_FIREBASE_STORAGE_BUCKET  = recos-bnm.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID = <del panel de Firebase>
  VITE_FIREBASE_APP_ID          = <del panel de Firebase>
  ALLOWED_ORIGINS               = https://recos-bnm.web.app,https://recos-bnm.firebaseapp.com
```

---

## 👤 Germán Pacheco `germanpachecocas-ai`

**Hallazgos asignados:** MEDIUM-03 (rate limiting) · configuración CI/CD para PoC 1

### MEDIUM-03 — Rate limiting ausente

**Deadline: jue 11 jun**

```bash
cd backend
npm install express-rate-limit
```

**Agregar en `backend/src/app.js`** antes de las rutas:
```js
const rateLimit = require('express-rate-limit')

// Límite global: 100 requests por IP cada 15 minutos
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))

// Límite más estricto para swipe (evitar flood)
app.use('/api/swipe', rateLimit({
  windowMs: 60 * 1000,  // 1 minuto
  max: 30,              // máximo 30 swipes/minuto
  message: { error: 'Swipe rate limit exceeded.' },
}))
```

---

### Configurar FIREBASE_TOKEN para CI/CD

**Deadline: hoy martes 10 jun** — es el bloqueante principal para PoC 1

```bash
# En tu máquina local:
firebase login:ci

# Esto imprime un token como:
# 1//0gABC123...XYZ

# Ir a GitHub → Settings → Secrets → Actions:
# Agregar: FIREBASE_TOKEN = <el token que te dio el comando>
```

**Verificar que el workflow funciona:**
```bash
# Hacer un push de prueba a main (o pedir a Edgar que mergee un PR)
# Revisar: https://github.com/JGFuentesC/recos-BnM/actions
# El job "Deploy to Firebase Hosting" debe aparecer en verde
```

---

## 👤 Luis Téllez `LuisTellez03`

**Hallazgo asignado:** LOW-03 — projectId fallback silencioso en firebase/admin.js

### LOW-03 — Fallback hardcodeado en firebase/admin.js

**Deadline: Sprint 2** (no bloquea PoC 1 pero es buena práctica)

**Problema actual:**
```js
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'recos-bnm',  // falla silencioso
})
```

**Fix** (`backend/src/firebase/admin.js`):
```js
const admin = require('firebase-admin')

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!projectId) {
    throw new Error('[firebase/admin] FIREBASE_PROJECT_ID env var is required but not set')
  }
  admin.initializeApp({ projectId })
}

module.exports = admin
```

**Nota:** Con el fix de HIGH-03 (dotenv orden) de Andrés, este cambio funcionará correctamente. Coordinar con Andrés.

---

## 👤 Imanol Ruiz / Christian Ruiz `ImanolRuiz00`

**Hallazgo asignado:** LOW-02 — Admin SDK bypasea reglas de Firestore en ingest

### LOW-02 — Validación de schema en ingest

**Deadline: Sprint 2**

El Admin SDK escribe en `content/` sin pasar por las reglas de Firestore. Aunque las reglas dicen `allow write: if false` para clientes, el Admin SDK es inmune. Si las credenciales del servicio de ingest se comprometen, puede escribir contenido malicioso en la base de datos.

**Acción recomendada:** El schema de validación ya existe en `ingest/src/models.py`. Agregar validación explícita antes del batch write en `ingest/src/main.py`:

```python
# En ingest/src/main.py — antes de firestore_client.batch_upsert()
def validate_content_item(item: ContentItem) -> bool:
    required = ['title', 'cover', 'type', 'externalId', 'source']
    return all(getattr(item, field, None) for field in required)

# Filtrar items inválidos antes de escribir
valid_items = [item for item in items if validate_content_item(item)]
if len(valid_items) < len(items):
    logger.warning(f"Dropped {len(items) - len(valid_items)} invalid items before write")
```

---

## 👤 Edgar Coronel `edgarcoroneln` (PM)

**Hallazgo asignado:** MEDIUM-05 — Auditorías de seguridad excluidas de git

### MEDIUM-05 — Reportes de seguridad en .gitignore ✅ RESUELTO 2026-06-11

**Acción ejecutada:** Archivos movidos a `Book-recos-BnM_Vault/09_Risk_Governance/` y `.gitignore` actualizado con patrones glob para cubrir futuros reportes.

---

## 👤 Israel Pérez `israelpg80`

**Hallazgo asignado:** LOW-01 — /health endpoint sin documentación explícita

### LOW-01 — Documentar /health como intencional

**Deadline: Sprint 2** (bajo impacto)

El endpoint `GET /health` es público y no requiere auth. Está bien para load balancers de Cloud Run, pero debe documentarse como decisión explícita.

**Acción:** Agregar comentario en `backend/src/app.js`:

```js
// Endpoint público — usado por Cloud Run health checks y monitoreo
// No expone información sensible — solo { ok: true }
app.get('/health', (req, res) => {
  res.json({ ok: true })
})
```

---

## Checklist consolidado de remediación

### Para el equipo — estado de correcciones

```
ALTA PRIORIDAD (antes de PoC 1 — vie 12 jun)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ☐ Juan Carlos  — Rotar TMDB API Key
  ☐ Juan Carlos  — Rotar Google Books API Key
  ☐ Juan Carlos  — Restringir Firebase Web Key a dominios
  ☐ Andrés       — npm audit fix en frontend/ (React Router)
  ☐ Andrés       — Mover dotenv.config() a línea 1 de app.js
  ☐ Andrés       — CORS restringir a dominios Firebase Hosting
  ☐ Andrés       — express.json({ limit: '10kb' })
  ☐ Andrés       — Instalar helmet y configurar en app.js
  ☐ Andrés       — Configurar 7 GitHub Secrets con keys rotadas
  ☐ Germán       — firebase login:ci → agregar FIREBASE_TOKEN a GitHub Secrets
  ☐ Germán       — Verificar CI/CD verde después del push
  ✅ Edgar (PM)  — Mover reportes de auditoría al Vault (MEDIUM-05) — HECHO 2026-06-11

SPRINT 2 (lun 15 jun en adelante)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ☐ Germán       — Agregar express-rate-limit (global + /api/swipe)
  ☐ Luis         — Throw explícito si FIREBASE_PROJECT_ID no está definido
  ☐ Imanol       — Validación de schema antes de batch write en ingest
  ☐ Israel       — Documentar /health como intencional en SYSTEM_HEARTBEAT
```

---

## Criterio de reapertura del Security Clearance

El clearance se otorga cuando se completen los siguientes 5 items críticos:

1. ✅ Juan Carlos confirma rotación de las 3 API keys
2. ✅ `npm audit` en frontend devuelve 0 HIGH (React Router actualizado)
3. ✅ `dotenv.config()` es la primera línea de `app.js`
4. ✅ CORS configurado con lista de orígenes explícita
5. ✅ CI/CD ejecuta al menos 1 deploy exitoso a Firebase Hosting

**Solicitar re-auditoría** a Luis Téllez o Edgar Coronel una vez completados los 5 puntos.

---

*Generado: 2026-06-10 | Basado en SECURITY-AUDIT-2026-06-10.md*  
*Movido a Vault: 2026-06-11 por Edgar Coronel (PM) — resolución MEDIUM-05*
