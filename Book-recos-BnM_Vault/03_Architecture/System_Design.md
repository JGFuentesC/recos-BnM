---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [architecture, system-design, gcp]
---

# System Design — Recos-BnM

> Arquitectura de alto nivel. Fuente: PRD §5.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Diagrama de componentes

```
┌──────────────────────────────────────────────────────┐
│                   CLIENTE (PWA)                       │
│   React · Framer Motion · Service Worker              │
│   Firebase Hosting (CDN global)                       │
└─────────────────────┬────────────────────────────────┘
                      │ HTTPS / REST
                      │ Bearer Token (Firebase JWT)
                      ▼
┌──────────────────────────────────────────────────────┐
│              Cloud Run — API Node.js                  │
│   /api/feed · /api/swipe · /api/content/:id           │
│   /api/collections (GET/POST/PATCH/DELETE)            │
│   auth middleware → verifica Firebase JWT             │
└───────────┬─────────────────────┬────────────────────┘
            │                     │
            ▼                     ▼
┌───────────────────┐   ┌─────────────────────────────┐
│  Firebase Auth    │   │         Firestore            │
│  Email + Google   │   │  users / swipes /            │
│                   │   │  collections / content       │
└───────────────────┘   └──────────────┬──────────────┘
                                       │ escritura (job)
                        ┌──────────────▼──────────────┐
                        │  Cloud Run — Ingest Job      │
                        │  Python · TMDB · Google Books│
                        └──────────────▲──────────────┘
                                       │ trigger diario
                        ┌──────────────┴──────────────┐
                        │      Cloud Scheduler         │
                        │  cron: "0 4 * * *" UTC       │
                        └─────────────────────────────┘
```

---

## Descripción de componentes

### 1. Frontend (PWA)

| Aspecto | Detalle |
|---|---|
| Framework | React (con Vite) |
| Animaciones | Framer Motion (swipe + slide-up) |
| Offline | Service Worker — cache shell + últimos 10 ítems de colección |
| Deploy | Firebase Hosting (CDN, HTTPS automático) |
| Build | `npm run build` → `dist/` → `firebase deploy --only hosting` |
| Variables de entorno | `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc. vía GitHub Secrets |

**Pantallas principales:**
- `/login` — Login + Registro
- `/onboarding` — Calibración cold start
- `/feed` — SwipeDeck + TabSelector
- `/detail/:id` — DetailSheet (ruta o modal)
- `/library` — Biblioteca personal
- `/settings` — Configuración (Fase 2)

---

### 2. Firebase Authentication

| Proveedor | Estado |
|---|---|
| Email/Password | ✅ Activo |
| Google Sign-In | ✅ Activo |
| Apple Sign-In | ❌ Fuera de MVP |
| Anonymous | ❌ Fuera de MVP |

**Flujo de auth:**
1. Usuario hace login → Firebase devuelve ID Token (JWT)
2. Frontend guarda el token en memoria (no localStorage)
3. Cada request al API incluye `Authorization: Bearer <token>`
4. API verifica el token con `admin.auth().verifyIdToken(token)`

---

### 3. Backend API (Cloud Run)

| Aspecto | Detalle |
|---|---|
| Runtime | Node.js 20 (LTS) |
| Framework | Express.js |
| Deploy | Cloud Run (us-central1, escala a cero) |
| Concurrencia | 80 requests por instancia |
| Cold start | Mitigado con `min-instances=1` si D0 se degrada |
| Auth | Middleware verifica Firebase JWT en cada request |

Ver contratos completos en [[03_Architecture/API_Specification|API Specification]].

---

### 4. Firestore

| Colección | Propósito | Quién escribe |
|---|---|---|
| `users` | Perfil + preferencias | Auth middleware (primer login) + Usuario |
| `content` | Catálogo cacheado de películas y libros | Ingest Job únicamente |
| `swipes` | Historial de likes/dislikes | API (POST /api/swipe) |
| `collections` | Títulos guardados + notas | API (CRUD /api/collections) |

**Seguridad:** Reglas de Firestore en `firestore.rules`. Ver [[09_Risk_Governance/Security_Model|Security Model]].  
**Schema completo:** [[03_Architecture/Data_Model|Data Model]].

---

### 5. Ingest Job (Cloud Run — separado)

| Aspecto | Detalle |
|---|---|
| Runtime | Python 3.11 |
| Trigger | Cloud Scheduler → HTTP POST a `/run` |
| Schedule | `0 4 * * *` UTC (4am diario) |
| Fuentes | TMDB API (películas) + Google Books API (libros) |
| Rate limiting | `sleep(0.25)` entre requests = 4 req/s (< 50 req/s de TMDB) |
| Idempotencia | Comprueba `externalId` antes de escribir para evitar duplicados |

**Responsable:** [[Sprint-1/03-Manuel-Serrania|Manuel Serranía]] (Wave 0–1)

---

## Decisiones de arquitectura

| Decisión | Elegido | Alternativa descartada | Razón |
|---|---|---|---|
| Fuente de películas | TMDB | IMDb (API oficial) | IMDb no tiene API pública estable. Ver [[09_Risk_Governance/Decision_Log|DEC-001]] |
| Score | 0.7/0.3 (pop/rating) | Solo popularidad | Popularidad pura penaliza clásicos con alto rating. Ver DEC-002 |
| Tipo de app | PWA | App nativa iOS/Android | Tiempo de desarrollo 2-3x mayor para nativa. Ver DEC-003 |
| Git workflow | Feature branches → main | GitFlow | Menos overhead para equipo de 13. Ver DEC-004 |
| DB | Firestore | PostgreSQL | Escala serverless + integración nativa con Firebase Auth |
| Feed source | Catálogo pre-indexado | Consulta TMDB en caliente | Evita cuotas y latencia de API externa en cada request |

---

## Restricciones importantes

1. **Firestore no soporta filtros compuestos arbitrarios** → El ranking del feed se calcula en el backend, no vía query nativa de Firestore.
2. **La colección `content` solo puede ser escrita por el ingest job** → Las reglas de Firestore lo imponen (`allow write: if false` para clientes).
3. **Los watchProviders provienen de TMDB** → Nunca inventar disponibilidad de streaming. Si no hay dato, mostrar placeholder neutro.
4. **Atribución TMDB obligatoria** → Ver [[09_Risk_Governance/TMDB_Compliance|TMDB Compliance]].
