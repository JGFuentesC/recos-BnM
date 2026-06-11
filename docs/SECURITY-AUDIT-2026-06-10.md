---
proyecto: "Recos-BnM"
fecha: "2026-06-10"
auditor: "Claude Code (claude-sonnet-4-6) + Luis Téllez Domínguez"
skill: ".skills/cybersec/SKILL.md"
stack: "Node.js / Express 5 / Firebase Auth / Firestore / React 19 / Vite"
scope: "Rama main — historial de commits + código actual + dependencias"
auditoria_anterior: "docs/SECURITY-AUDIT-2026-06-04.md (HIGH 0, MEDIUM 0, LOW 2 fixed)"
---

# Security Audit — Recos-BnM
## 2026-06-10

---

## Resumen ejecutivo

| Severidad | Hallazgos | Estado |
|---|---|---|
| 🔴 HIGH | 3 | ❌ Sin corregir — **bloquean deploy a producción** |
| 🟡 MEDIUM | 5 | ⚠️ Recomendado corregir antes de PoC 1 |
| 🔵 LOW | 3 | Mejora técnica — Sprint 2 |

**Veredicto:** ❌ **Security Clearance DENEGADO** — existen 3 hallazgos HIGH activos que deben resolverse antes del deploy a Firebase Hosting / Cloud Run.

---

## Paso 1 — Superficie de ataque mapeada

### Endpoints del API (backend/src/app.js)

| Endpoint | Método | Auth | Público |
|---|---|---|---|
| `/health` | GET | ❌ Sin auth | ✅ Intencional |
| `/api/private/ping` | GET | ✅ authMiddleware | No |
| `/api/feed` | GET | ✅ authMiddleware | No |
| `/api/swipe` | POST | ✅ authMiddleware | No |
| `/api/content/:id` | GET | ✅ authMiddleware | No |
| `/api/collections` | GET/POST/PATCH/DELETE | ✅ auth | No |

### Flujo de autenticación
Firebase Auth → Bearer token → `admin.auth().verifyIdToken(token)` → `req.user.uid`

---

## Hallazgos HIGH 🔴

---

### HIGH-01 — API Keys reales expuestas en historial de git

**Archivo:** `jc.env` — commit `481b646` en main  
**Estado:** El archivo fue eliminado del tracking (PR #25) pero **las claves siguen en el historial público de git**.

```bash
# Las claves son recuperables por cualquier persona con acceso al repo:
git show 481b646:jc.env
```

**Claves expuestas (confirmadas en historial):**
- `TMDB_API_KEY` — Bearer token de TMDB
- `GOOGLE_BOOKS_API_KEY` — API key de Google Cloud
- `VITE_FIREBASE_API_KEY` — Firebase Web API Key
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID` → `recos-bnm`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

**Riesgo:** Cualquier persona puede consultar `git log` y recuperar las claves. Si no fueron rotadas, siguen siendo válidas en producción.

**Remediación:**
1. Confirmar con Juan Carlos que rotó todas las claves en los paneles externos (TMDB, Google Cloud Console, Firebase Console)
2. Opcional: purgar el historial con `git filter-repo --path jc.env --invert-paths` y force-push (destructivo — coordinar con el equipo)
3. Agregar `gitleaks` o `trufflehog` al pipeline de CI para prevención futura

---

### HIGH-02 — XSS via Open Redirect en React Router (frontend)

**Paquetes afectados:** `react-router-dom`, `react-router`, `@remix-run/router`  
**CVE:** React Router vulnerable to XSS via Open Redirects  
**npm audit:** 3 vulnerabilidades HIGH en frontend

```
[HIGH] react-router-dom — React Router has unexpected external redirect via untrusted paths
[HIGH] react-router — React Router vulnerable to XSS via Open Redirects
[HIGH] @remix-run/router — React Router vulnerable to XSS via Open Redirects
```

**Riesgo:** Un atacante puede construir una URL que redireccione al usuario a un sitio externo malicioso, habilitando ataques de phishing o robo de tokens en el callback de autenticación.

**Remediación:**
```bash
cd frontend
npm audit fix
# Si no resuelve automáticamente:
npm install react-router-dom@latest
```

---

### HIGH-03 — dotenv.config() se ejecuta DESPUÉS de importar firebase/admin

**Archivo:** `backend/src/app.js` líneas 1-7

```js
const express  = require('express')
const cors     = require('cors')
const dotenv   = require('dotenv')
const auth     = require('./middleware/auth')  // ← importa firebase/admin aquí

dotenv.config()  // ← TARDE: firebase/admin ya inicializó sin las env vars
```

**Archivo afectado:** `backend/src/firebase/admin.js`

```js
admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'recos-bnm',
  //                      ↑ undefined en este momento — usa el fallback hardcodeado
})
```

**Riesgo:** En producción, `FIREBASE_PROJECT_ID` puede no estar disponible cuando `admin.initializeApp()` se ejecuta. El fallback `'recos-bnm'` hardcodeado lo enmascara en local pero es frágil: si el proyecto GCP cambia de nombre, la app se inicializa contra el proyecto incorrecto sin advertencia. Además, `verifyIdToken()` podría validar tokens contra el proyecto equivocado.

**Remediación:**
```js
// backend/src/app.js — mover dotenv.config() a la PRIMERA línea
require('dotenv').config()  // ← PRIMERO
const express = require('express')
const cors    = require('cors')
const auth    = require('./middleware/auth')
// ...
```

---

## Hallazgos MEDIUM 🟡

---

### MEDIUM-01 — CORS wildcard en producción

**Archivo:** `backend/src/app.js` línea 9

```js
app.use(cors())  // ← equivale a Access-Control-Allow-Origin: *
```

**Riesgo:** Cualquier origen puede hacer requests al API, incluyendo sitios maliciosos que ejecuten código JS en el browser de un usuario autenticado (CSRF-like con CORS).

**Remediación:**
```js
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
```

---

### MEDIUM-02 — express.json() sin límite de tamaño (DoS vector)

**Archivo:** `backend/src/app.js` línea 10

```js
app.use(express.json())  // ← sin límite, default 100kb de Express
```

**Riesgo:** Un atacante puede enviar payloads JSON masivos al `POST /api/swipe` o `POST /api/collections` para consumir memoria/CPU (Denial of Service).

**Remediación:**
```js
app.use(express.json({ limit: '10kb' }))
```

---

### MEDIUM-03 — Sin rate limiting en ningún endpoint

**Riesgo:** Brute-force de tokens, flood de swipes falsos, abuso de quota de TMDB/Google Books via `/api/feed`.

**Remediación:**
```bash
npm install express-rate-limit
```
```js
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/', limiter)
```

---

### MEDIUM-04 — Sin headers de seguridad HTTP (Helmet ausente)

**Riesgo:** Ausencia de `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`. El frontend puede ser embebido en iframes (clickjacking) y hay exposición a MIME sniffing.

**Remediación:**
```bash
npm install helmet
```
```js
const helmet = require('helmet')
app.use(helmet())
```

---

### MEDIUM-05 — Auditorías de seguridad excluidas de git

**Archivo:** `.gitignore`

```
docs/SECURITY-AUDIT-2026-06-04.md
docs/SECURITY-AUDIT-2026-06-05.md
```

**Riesgo:** Los reportes de seguridad no están en el historial del repo. Si un auditor externo o nuevo integrante necesita revisar el historial de vulnerabilidades, no tiene acceso. Además, este reporte (`2026-06-10`) tampoco se puede commitear tal como está configurado.

**Remediación:** Eliminar esas líneas del `.gitignore` y commitear los reportes al Vault en lugar de a `docs/`, o documentar explícitamente que los reportes se guardan en una ubicación segura externa (ej. Drive del equipo).

---

## Hallazgos LOW 🔵

---

### LOW-01 — `/health` endpoint expuesto sin auth

**Archivo:** `backend/src/app.js` línea 12

```js
app.get('/health', (req, res) => res.json({ ok: true }))
```

**Riesgo:** Bajo — informa a atacantes que el servidor está activo (información de reconocimiento). Es práctica estándar tener un health check público para load balancers, pero conviene documentarlo explícitamente.

**Remediación:** Documentar como intencional o agregar un header secreto de verificación si se quiere más control.

---

### LOW-02 — Firestore rules no cubren la colección `content` para escritura via Admin SDK

**Archivo:** `src/firestore/firestore.rules`

```
match /content/{contentId} {
  allow read: if request.auth != null;
  allow write: if false;  ← correcto para clientes
}
```

El Admin SDK bypasea estas reglas. Si el servicio de ingest tiene credenciales comprometidas, puede escribir en `content` sin restricción.

**Remediación:** Agregar validación de schema en el Cloud Run de ingest (ya existe en `models.py`) y rotar service account credentials periódicamente.

---

### LOW-03 — `projectId: 'recos-bnm'` hardcodeado como fallback

**Archivo:** `backend/src/firebase/admin.js`

```js
projectId: process.env.FIREBASE_PROJECT_ID || 'recos-bnm'
```

**Riesgo:** Si `FIREBASE_PROJECT_ID` no está configurado en producción, la app silenciosamente usa `recos-bnm`. No falla ruidosamente — puede ser difícil de detectar.

**Remediación:**
```js
const projectId = process.env.FIREBASE_PROJECT_ID
if (!projectId) throw new Error('FIREBASE_PROJECT_ID env var is required')
admin.initializeApp({ projectId })
```

---

## Lo que está bien ✅

| Ítem | Detalle |
|---|---|
| ✅ Firebase Auth correctamente implementado | `verifyIdToken()` en cada request privado — no hay JWT casero |
| ✅ Ownership verificado en todas las rutas | `req.user.uid !== userId` → 403 en feed, swipe y collections |
| ✅ Sin XSS en frontend | No hay `dangerouslySetInnerHTML` ni `innerHTML` en ningún componente React |
| ✅ Sin SQL Injection | No hay raw SQL — Firestore SDK con métodos tipados |
| ✅ Path traversal mitigado en content.js | Validación `id.includes('/')` antes de consultar Firestore |
| ✅ Whitelist de campos en responses | Ninguna ruta devuelve el documento crudo de Firestore |
| ✅ backend/.env en .gitignore | `.env` y `*.env` correctamente ignorados — nunca commiteados |
| ✅ Firebase config sin hardcoding | `frontend/src/firebase/config.js` usa `import.meta.env.*` exclusivamente |
| ✅ Emuladores solo en DEV | `connectAuthEmulator` condicionado a `import.meta.env.DEV` |
| ✅ Reglas Firestore por usuario | Cada colección restringe lectura/escritura al `request.auth.uid` dueño |
| ✅ `content` no es escribible desde clientes | `allow write: if false` en reglas de Firestore |
| ✅ Error messages genéricos | Rutas devuelven `'Internal server error'` sin stack traces al cliente |
| ✅ Sin prototype pollution | No se accede a `req.body` por índice dinámico |
| ✅ Backend con 43 tests automatizados | Cobertura de auth, feed, swipe, content y collections |

---

## Matriz de severidad

```
╔══════════════════════════════════════════════════════════════════════╗
║  HALLAZGO                          SEVERIDAD  ESFUERZO   IMPACTO    ║
║  ─────────────────────────────────────────────────────────────────  ║
║  HIGH-01  API Keys en historial    🔴 HIGH    Alto       Crítico     ║
║  HIGH-02  XSS React Router CVE     🔴 HIGH    Bajo       Alto        ║
║  HIGH-03  dotenv load order        🔴 HIGH    Bajo       Alto        ║
║  MED-01   CORS wildcard            🟡 MEDIUM  Bajo       Medio       ║
║  MED-02   JSON sin límite tamaño   🟡 MEDIUM  Bajo       Medio       ║
║  MED-03   Sin rate limiting        🟡 MEDIUM  Medio      Medio       ║
║  MED-04   Sin Helmet               🟡 MEDIUM  Bajo       Medio       ║
║  MED-05   Audits en .gitignore     🟡 MEDIUM  Bajo       Bajo        ║
║  LOW-01   /health sin auth         🔵 LOW     Bajo       Bajo        ║
║  LOW-02   Admin SDK bypasea rules  🔵 LOW     Medio      Bajo        ║
║  LOW-03   projectId fallback       🔵 LOW     Bajo       Bajo        ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Plan de remediación — priorizado

### Antes de PoC 1 (vie 12 jun) — OBLIGATORIO

| # | Acción | Archivo | Responsable | Tiempo |
|---|---|---|---|---|
| 1 | Confirmar rotación de API keys TMDB/Google/Firebase | Paneles externos | Juan Carlos | 30 min |
| 2 | `npm audit fix` en frontend (React Router) | `frontend/` | Andrés | 15 min |
| 3 | Mover `dotenv.config()` a primera línea de `app.js` | `backend/src/app.js` | Cualquiera | 5 min |
| 4 | CORS restringir a dominio Firebase Hosting | `backend/src/app.js` | Andrés | 20 min |
| 5 | `express.json({ limit: '10kb' })` | `backend/src/app.js` | Cualquiera | 2 min |

### Sprint 2 — Recomendado

| # | Acción | Responsable |
|---|---|---|
| 6 | Agregar `express-rate-limit` | Héctor / Luis |
| 7 | Agregar `helmet` | Andrés |
| 8 | Throw explícito si `FIREBASE_PROJECT_ID` no está definido | Luis / Andrés |
| 9 | Mover reportes de seguridad al Vault (no en .gitignore) | Edgar (PM) |

---

## Veredicto final

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ❌ SECURITY CLEARANCE DENEGADO                             ║
║                                                              ║
║   3 hallazgos HIGH activos bloquean el deploy a producción   ║
║                                                              ║
║   Corregir HIGH-02 y HIGH-03 (< 1 hora de trabajo)           ║
║   Confirmar rotación de claves HIGH-01 con Juan Carlos        ║
║                                                              ║
║   Re-auditar tras las correcciones para emitir clearance.    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

*Generado: 2026-06-10 | Basado en: git log de main (51 commits), npm audit backend + frontend, análisis estático manual de 8 archivos de rutas y middleware*
