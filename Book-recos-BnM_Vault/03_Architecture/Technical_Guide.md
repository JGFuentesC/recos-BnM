---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [architecture, technical, stack, decisions]
---

# Technical Guide — Recos-BnM

> Stack tecnológico y decisiones de implementación. Referencia para el equipo de ingeniería.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Stack completo

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| **Frontend framework** | React | 18+ | Ecosistema maduro, `react-tinder-card` disponible |
| **Build tool** | Vite | 5+ | Hot reload rápido, bundle optimizado |
| **Animaciones** | Framer Motion | 11+ | Spring physics para swipe, slide-up para DetailSheet |
| **Gestos** | react-tinder-card o Framer Motion custom | — | Gestos táctiles nativos en móvil |
| **State management** | React Context (FeedContext, AuthContext) | — | Sin Redux para MVP; complejidad baja |
| **HTTP client** | fetch nativo | — | Sin dependencias extra |
| **Service Worker** | Workbox (via Vite plugin) | — | Cache shell + Network First para /api/collections |
| **Backend runtime** | Node.js | 20 LTS | Estable, soporte Firebase Admin SDK |
| **Backend framework** | Express.js | 4+ | Estándar industria, middleware sencillo |
| **Firebase Admin SDK** | firebase-admin | 12+ | Verificación JWT, escritura en Firestore |
| **Base de datos** | Cloud Firestore | — | Serverless, integración nativa con Firebase Auth |
| **Autenticación** | Firebase Auth | — | Email + Google sin backend propio de auth |
| **Hosting** | Firebase Hosting | — | CDN global, HTTPS automático |
| **Backend hosting** | Cloud Run (GCP) | — | Serverless, escala a cero, pay-per-use |
| **Ingest runtime** | Python | 3.11 | Librería `requests` robusta, Cloud Run compatible |
| **Scheduler** | Cloud Scheduler | — | Cron job de ingesta diaria |
| **CI/CD** | GitHub Actions | — | Deploy automático a Firebase Hosting + Cloud Run |
| **Secretos** | GitHub Secrets | — | Variables de entorno para CI/CD |

---

## Variables de entorno

### Frontend (VITE_*)

| Variable | Descripción | Dónde se usa |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | API Key de Firebase | firebase/config.js |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain de Firebase | firebase/config.js |
| `VITE_FIREBASE_PROJECT_ID` | Project ID de GCP | firebase/config.js |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | firebase/config.js (si aplica) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | firebase/config.js |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase | firebase/config.js |
| `VITE_API_BASE_URL` | URL del backend en Cloud Run | Todos los fetch() |

> Todas las `VITE_*` van a GitHub Secrets y se inyectan en el build de GitHub Actions.  
> **Nunca** poner estas variables en el código fuente ni en el repositorio.  
> Ver: [[09_Risk_Governance/Security_Model|Security Model]]

### Backend (Cloud Run)

| Variable | Descripción |
|---|---|
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account para Firestore (auto en Cloud Run) |
| `FIREBASE_PROJECT_ID` | Project ID para Firebase Admin SDK |

### Ingest Job

| Variable | Descripción |
|---|---|
| `TMDB_API_KEY` | API Key de TMDB |
| `GOOGLE_BOOKS_API_KEY` | API Key de Google Books |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account para escritura en Firestore |

---

## Estructura de repositorio

```
recos-bnm/
├── frontend/                    # PWA React + Vite
│   ├── public/
│   │   ├── manifest.json        # PWA manifest (German)
│   │   └── icons/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContentCard.jsx  # Tarjeta del feed (Edgar)
│   │   │   ├── SwipeDeck.jsx    # Stack de tarjetas (Monserrat)
│   │   │   ├── DetailSheet.jsx  # Modal de detalle (Marina)
│   │   │   ├── TabSelector.jsx  # Selector Películas/Libros (Juan Carlos)
│   │   │   └── BottomNav.jsx    # Navegación inferior (Diana)
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login + Registro (Andrés)
│   │   │   ├── Onboarding.jsx   # Cold start (Juan Carlos)
│   │   │   ├── Feed.jsx         # Página principal con SwipeDeck
│   │   │   └── Library.jsx      # Biblioteca personal (Diana)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Estado de autenticación (Andrés)
│   │   │   └── FeedContext.jsx  # Estado del feed (Juan Carlos)
│   │   ├── firebase/
│   │   │   └── config.js        # Inicialización Firebase SDK (Andrés)
│   │   └── sw.js                # Service Worker (German)
│   ├── vite.config.js
│   └── package.json
├── backend/                     # API Node.js
│   ├── middleware/
│   │   └── auth.js              # Verificación JWT (Andrés)
│   ├── routes/
│   │   ├── feed.js              # GET /api/feed, POST /api/swipe (Luis)
│   │   ├── content.js           # GET /api/content/:id (Héctor)
│   │   └── collections.js       # CRUD /api/collections (Christian)
│   ├── services/
│   │   └── scoring.js           # Score normalizado (Manuel)
│   ├── Dockerfile
│   └── package.json
├── ingest/                      # Job de ingesta Python
│   ├── tmdb_ingest.py           # Ingest de películas (Manuel)
│   ├── books_ingest.py          # Ingest de libros (Manuel)
│   ├── Dockerfile
│   └── requirements.txt
├── firestore/                   # Configuración Firestore
│   ├── firestore.rules          # Reglas de seguridad (Israel)
│   ├── firestore.indexes.json   # Índices compuestos (Israel)
│   └── firebase.json            # Config Firebase (Israel)
├── docs/
│   └── SCHEMA.md                # Schema documentado (Israel)
└── .github/
    └── workflows/
        └── deploy.yml           # CI/CD (German)
```

---

## Guía de setup local

Ver [[00_Start_Here/Developer_Onboarding|Developer Onboarding]] para las instrucciones completas de setup.

**Resumen rápido:**
```bash
# 1. Prerequisites: Node.js 20+, Python 3.11+, Firebase CLI, gcloud CLI
# 2. Clonar repo
git clone <repo-url>

# 3. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 4. Levantar emuladores de Firebase
firebase emulators:start

# 5. Correr frontend
cd frontend && npm run dev

# 6. Correr backend
cd backend && npm run dev
```

---

## Convenciones de código

### JavaScript / React

| Convención | Regla |
|---|---|
| **Componentes** | PascalCase — `ContentCard.jsx`, `SwipeDeck.jsx` |
| **Hooks** | camelCase con prefijo `use` — `useFeed.js`, `useAuth.js` |
| **Constantes** | UPPER_SNAKE_CASE — `MAX_CARDS_PREFETCH = 5` |
| **Variables/funciones** | camelCase — `feedItems`, `handleSwipe()` |
| **Archivos de página** | PascalCase — `Feed.jsx`, `Library.jsx` |
| **CSS variables** | kebab-case con prefijo `--color-` | 

### Python (ingest)

| Convención | Regla |
|---|---|
| **Funciones** | snake_case — `fetch_tmdb_movies()`, `ingest_books()` |
| **Constantes** | UPPER_SNAKE_CASE — `TMDB_BASE_URL`, `SLEEP_BETWEEN_REQUESTS` |
| **Clases** | PascalCase (raro, solo si se necesitan) |

### Git

| Convención | Regla |
|---|---|
| **Branches** | `feat/nombre`, `fix/nombre`, `chore/nombre` |
| **Commits** | Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:` |
| **Merge** | Siempre via PR, mínimo 1 reviewer |

Ver [[05_Engineering/Engineering_Workflow|Engineering Workflow]] para detalles.

---

## Decisiones de stack registradas

Ver [[09_Risk_Governance/Decision_Log|Decision Log]] para el registro completo:

| DEC | Decisión | Impacto |
|---|---|---|
| DEC-001 | TMDB sobre IMDb como fuente primaria | Requiere atribución visible. +watchProviders |
| DEC-002 | Score 0.7/0.3 (popularidad/rating) | Normalización matemática, no sesgada |
| DEC-003 | PWA sobre app nativa | 2-3x menos tiempo de desarrollo |
| DEC-004 | Feature branches sobre GitFlow | Menos overhead para equipo de 13 personas |
