---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [onboarding, setup]
---

# Developer Onboarding — Recos-BnM

> Bienvenido al equipo. Esta guía te lleva de cero a desarrollo en ~30 minutos.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Stack del proyecto

| Capa | Tecnología |
|---|---|
| Frontend | React (Vite) — PWA mobile-first |
| Backend | Node.js + Express en Cloud Run |
| Base de datos | Cloud Firestore |
| Auth | Firebase Authentication (Email + Google) |
| Hosting | Firebase Hosting |
| Infra/Scheduler | Cloud Scheduler → Cloud Run (ingest job) |
| APIs externas | TMDB (películas) · Google Books (libros) |
| CI/CD | GitHub Actions → Firebase Hosting |

---

## Paso 1 — Requisitos previos

Instalar antes de clonar:

```bash
# Node.js 20 LTS
node -v  # debe ser >= 20.x

# Firebase CLI
npm install -g firebase-tools
firebase login

# Google Cloud SDK
# Descargar desde: https://cloud.google.com/sdk/docs/install
gcloud auth login
gcloud config set project recos-bnm
```

---

## Paso 2 — Clonar y configurar

```bash
git clone https://github.com/[ORG]/recos-bnm.git
cd recos-bnm

# Variables de entorno del frontend
cp frontend/.env.example frontend/.env.local
# Pedir los valores a Eduardo (PM) — NO compartir en Slack público
```

**Variables requeridas** (pedir a [[PM-Edgar-Coronel|Eduardo]]):

```bash
# frontend/.env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=recos-bnm
VITE_FIREBASE_APP_ID=

# backend/.env (para desarrollo local)
TMDB_API_KEY=
GOOGLE_BOOKS_API_KEY=
```

---

## Paso 3 — Arrancar el emulador Firebase (desarrollo local)

```bash
# Desde la raíz del repo
firebase emulators:start

# Abre en el browser:
# http://localhost:4000  → UI del emulador (Firestore + Auth)
# http://localhost:8080  → Firestore emulador
# http://localhost:9099  → Auth emulador
```

> ✅ **Siempre desarrolla contra el emulador.** No toques los datos de producción.

---

## Paso 4 — Correr el frontend

```bash
cd frontend
npm install
npm run dev
# Abre: http://localhost:5173
```

---

## Paso 5 — Correr el backend

```bash
cd backend
npm install
npm run dev
# Backend en: http://localhost:3000
# GET http://localhost:3000/api/health → debe responder 200
```

---

## Estructura del repo

```
recos-bnm/
├── frontend/          # PWA React (Vite) → Firebase Hosting
│   ├── src/
│   │   ├── components/    # ContentCard, SwipeDeck, DetailSheet...
│   │   ├── pages/         # Feed, Library, Onboarding, Login
│   │   ├── contexts/      # AuthContext, FeedContext
│   │   └── firebase/      # config.js, admin.js
│   └── public/            # sw.js (Service Worker), manifest.json
├── backend/           # API Cloud Run (Node.js Express)
│   └── src/
│       ├── routes/        # feed.js, swipe.js, content.js, collections.js
│       ├── middleware/    # auth.js (Firebase ID Token)
│       └── services/      # scoring.js
├── ingest/            # Job de sincronización TMDB/Books (Python)
│   ├── tmdb_ingest.py
│   ├── books_ingest.py
│   └── Dockerfile
├── firestore.rules    # Reglas de seguridad
├── firestore.indexes.json
├── firebase.json      # Config emuladores
└── .github/
    └── workflows/
        └── deploy.yml # CI/CD → Firebase Hosting
```

---

## Tu primera tarea

1. **Lee tu `AGENT_CONTEXT.md`** en `Sprint-1/contexts/{tu-nombre}-agent-context.md` — define qué archivos puedes tocar
2. Abre [[00_Start_Here/Current_Build_Target|Current Build Target]] para ver en qué wave estás
3. Lee tu `.md` personal en la carpeta `Sprint-1/`
4. Copia el prompt de Claude Code de tu archivo y pégalo en la terminal
5. **Al terminar:** el agente IA creará el DevLog entry — verifica que esté completo antes de hacer push

> **⚠️ Nunca saltes el paso 1.** El AGENT_CONTEXT.md le dice a tu agente IA qué archivos puede y no puede tocar. Sin él, el agente puede generar conflictos con otros colaboradores.

---

## Contactos del equipo

| Rol | Persona | Responsabilidad |
|---|---|---|
| PM | [[PM-Edgar-Coronel\|Eduardo Coronel]] | Bloqueos, accesos, decisiones |
| Auth/Infra | [[Sprint-1/02-Andres-Gonzalez\|Andrés González]] | Firebase Auth + middleware |
| Schema/DB | [[Sprint-1/01-Israel-Perez\|Israel Pérez]] | Firestore schema + emulador |
| Catálogo | [[Sprint-1/03-Manuel-Serrania\|Manuel Serranía]] | Ingest + scoring |

---

## Reglas de oro

1. **Siempre usa el emulador** para desarrollo. Nunca escribas directamente a producción.
2. **Nunca commitees secretos** (.env, service-account.json). Están en `.gitignore`.
3. **Abre un PR** para cada feature/fix. No hagas push directo a `main`.
4. **Si estás bloqueado**, avísalo inmediatamente en el canal del sprint.
