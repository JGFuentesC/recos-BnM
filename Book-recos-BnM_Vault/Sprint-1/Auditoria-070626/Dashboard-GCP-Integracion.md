---
type: "dashboard-gcp-integracion"
proyecto: "Recos-BnM"
fecha: "2026-06-10"
sprint: 1
poc1: "2026-06-12"
---

# Dashboard GCP & Integración — Sprint 1
### Recos-BnM · 10 jun 2026

---

## Estado general de infraestructura GCP

```
╔══════════════════════════════════════════════════════════════════╗
║  SERVICIO GCP            CONFIGURADO   FUNCIONAL   BLOQUEANTE    ║
║  ─────────────────────────────────────────────────────────────   ║
║  Firebase Auth           ✅             ✅           —            ║
║  Cloud Firestore         ✅ schema      ✅ emulador  ⚠️ prod?     ║
║  Firebase Hosting        ✅ config      ❌ sin deploy ❌ PoC 1    ║
║  Cloud Run (backend)     ❌ no existe   ❌           ❌ PoC 1    ║
║  Cloud Scheduler (ingest)❌ no existe   ❌           🟡 Sprint 2  ║
║  GitHub Actions CI/CD    ✅ pipeline    ❌ secrets   ❌ PoC 1    ║
╚══════════════════════════════════════════════════════════════════╝

  Alerta: Firebase Hosting + Cloud Run son BLOQUEANTES para PoC 1 (vie 12 jun)
```

---

## Arquitectura objetivo vs. estado actual

```
ARQUITECTURA PRD (objetivo)              ESTADO HOY (10 jun)
════════════════════════════             ════════════════════════

[PWA React]                              [PWA React]
  ├─ Firebase Hosting          ──────►    ❌ Solo local (npm run dev)
  └─ Service Worker (offline)  ──────►    ✅ sw.js + manifest.json en repo
         │
         ▼
[Firebase Auth]               ──────►    ✅ Configurado + funcionando
         │
         ▼
[Cloud Run — Node.js API]     ──────►    ❌ No desplegado (solo local)
  ├─ GET  /api/feed            ──────►    ✅ Código listo (PR #24)
  ├─ POST /api/swipe           ──────►    ✅ Código listo (PR #24)
  ├─ GET  /api/content/:id     ──────►    ✅ Código listo (PR #29)
  └─ CRUD /api/collections     ──────►    ✅ Código listo (PR #30)
         │
         ▼
[Cloud Firestore]             ──────►    ✅ Schema diseñado + emulador OK
  ├─ users/                   ──────►    ✅ Reglas + índices definidos
  ├─ content/                 ──────►    ✅ 550+ docs (via ingest manual)
  ├─ swipes/                  ──────►    ✅
  └─ collections/             ──────►    ✅
         │
         ▼
[Cloud Scheduler → Cloud Run ingest]     ❌ No configurado
  ├─ TMDB sync                ──────►    ✅ Script listo (ingest/src/)
  └─ Google Books sync        ──────►    ✅ Script listo (ingest/src/)
```

---

## CI/CD — GitHub Actions

### Workflows en main

| Archivo | Trigger | Función | Estado |
|---|---|---|---|
| `.github/workflows/deploy.yml` | push a `main` | Build frontend + deploy Firebase Hosting | ❌ Falla — `FIREBASE_SERVICE_ACCOUNT` no configurado |
| `.github/workflows/deploy-hosting.yml` | push a `main` | Pipeline Germán — Node 22, pytest, deploy | ❌ Falla — `FIREBASE_TOKEN` no configurado |

### Secrets requeridos en GitHub → Settings → Secrets

| Secret | Usado en | Estado | Acción |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | `deploy.yml` | ❌ No configurado | Agregar desde Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `deploy.yml` | ❌ No configurado | Agregar |
| `VITE_FIREBASE_PROJECT_ID` | `deploy.yml` | ❌ No configurado | Agregar (`recos-bnm`) |
| `VITE_FIREBASE_STORAGE_BUCKET` | `deploy.yml` | ❌ No configurado | Agregar |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `deploy.yml` | ❌ No configurado | Agregar |
| `VITE_FIREBASE_APP_ID` | `deploy.yml` | ❌ No configurado | Agregar |
| `FIREBASE_SERVICE_ACCOUNT` | `deploy.yml` | ❌ No configurado | Generar JSON en Firebase Console → IAM |
| `FIREBASE_TOKEN` | `deploy-hosting.yml` | ❌ No configurado | `firebase login:ci` → copiar token |

**Ningún deployment automático ha funcionado en el sprint.** Todos los merges a main han ignorado el CI silenciosamente (el step de deploy falla pero no bloquea el merge).

---

## Firebase Hosting — Pasos para PoC 1 (vie 12 jun)

```bash
# Opción A — Deploy manual (más rápido para PoC 1)
cd frontend
npm run build
firebase deploy --only hosting --project recos-bnm

# Opción B — Configurar secrets y dejar que CI/CD lo haga
# 1. firebase login:ci  →  obtener FIREBASE_TOKEN
# 2. GitHub → Settings → Secrets → New repository secret
# 3. Hacer un push a main para activar el workflow
```

**Responsable sugerido:** Germán Pacheco + Andrés González

---

## Cloud Run — Backend API (bloqueante para PoC 1)

El backend actualmente solo corre en local. Para el PoC 1 necesita estar en Cloud Run.

```bash
# Desde backend/
# Opción A — Deploy directo con gcloud
gcloud run deploy recos-bnm-api \
  --source . \
  --region us-central1 \
  --project recos-bnm \
  --allow-unauthenticated \
  --set-env-vars FIRESTORE_PROJECT_ID=recos-bnm

# Opción B — Agregar Dockerfile + workflow de Cloud Run en GitHub Actions
```

**Requiere:**
- `Dockerfile` en `backend/` (no existe aún)
- Secret `GOOGLE_APPLICATION_CREDENTIALS` o Workload Identity Federation en GCP
- Variables de entorno de producción (sin emulador)

**Responsable sugerido:** Andrés González

---

## Cloud Firestore — Estado de producción

| Item | Estado | Notas |
|---|---|---|
| Schema diseñado (`SCHEMA.md`) | ✅ | Israel — PR #19 |
| `firestore.indexes.json` | ✅ | Índices compuestos para feed |
| `firestore.rules` | ✅ | Reglas de seguridad por usuario |
| Datos en producción | ⚠️ | Ingest se ejecutó manualmente — no periódico |
| Emulador configurado | ✅ | `firebase.json` con 4 emuladores |
| Tests de reglas | ✅ stub | 8 casos (stub, no tests reales) |

---

## Cloud Scheduler — Ingest periódico (Sprint 2)

El PRD requiere sincronización periódica de TMDB + Google Books para mantener el catálogo actualizado.

```
Estado actual: Manual — el equipo ejecuta node/python scripts localmente
Estado requerido: Cloud Scheduler → Cloud Run ingest → Firestore

Pasos para Sprint 2:
  1. Dockerizar ingest/ (Dockerfile existe ✅)
  2. Deploy ingest como Cloud Run job
  3. Crear Cloud Scheduler trigger (cron: "0 3 * * *" = 3am diario)
  4. Configurar service account con permisos Firestore write
```

---

## PWA — Service Worker y Offline

| Componente | Estado | Archivo |
|---|---|---|
| `manifest.json` | ✅ En repo | `frontend/public/manifest.json` |
| `sw.js` Service Worker | ✅ En repo | `frontend/public/sw.js` |
| Registro de SW en app | ✅ | PR #16 de Andrés (Andres-5346245) |
| Funcionalidad offline real | ⚠️ No verificado | Requiere prueba en Chrome DevTools |

---

## Dependencias críticas para PoC 1 (vie 12 jun)

```
BLOQUEANTE 1: Firebase Hosting no desplegado
  Responsable: Germán + Andrés
  Esfuerzo estimado: 2-3 horas (configurar secrets + primer deploy)
  Deadline: jue 11 jun por la noche

BLOQUEANTE 2: Backend API no en Cloud Run
  Responsable: Andrés
  Esfuerzo estimado: 4-6 horas (Dockerfile + deploy + env vars)
  Deadline: jue 11 jun por la noche

BLOQUEANTE 3: Firestore en producción sin datos frescos
  Responsable: Manuel
  Esfuerzo estimado: 1-2 horas (re-correr ingest contra Firestore prod)
  Deadline: jue 11 jun
```

---

## Checklist PoC 1 (vie 12 jun)

```
PRE-DEPLOY
  ☐ Secrets configurados en GitHub (8 secrets)
  ☐ firebase.json apunta a proyecto recos-bnm
  ☐ frontend/.env.example tiene todas las vars necesarias
  ☐ backend/ tiene Dockerfile

DEPLOY
  ☐ Frontend: Firebase Hosting — URL pública disponible
  ☐ Backend: Cloud Run — endpoint REST disponible
  ☐ Firestore producción tiene datos (content collection poblada)

VERIFICACIÓN
  ☐ Login con email funciona en URL de Hosting
  ☐ Feed carga películas reales (no mock)
  ☐ Swipe registra en Firestore producción
  ☐ DetailSheet abre con info correcta
  ☐ PWA instalable desde Chrome móvil
```

---

## Checklist PoC 2 / Entrega Final (lun 15 jun)

```
ADICIONAL AL PoC 1
  ☐ Library.jsx implementada (Diana) y desplegada
  ☐ Colecciones funcionando end-to-end
  ☐ Cloud Scheduler para ingest configurado (o cron manual documentado)
  ☐ 126 casos de prueba manual ejecutados con reporte PASS/FAIL
  ☐ ROADMAP actualizado con Sprint 2
```

---

*Generado: 2026-06-10 | Fuente: .github/workflows/, firebase.json, PRD §5 Arquitectura GCP, 49 PRs analizados*
