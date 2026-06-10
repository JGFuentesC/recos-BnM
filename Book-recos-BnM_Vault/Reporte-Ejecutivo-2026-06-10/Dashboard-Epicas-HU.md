---
type: "dashboard-epicas-hu"
proyecto: "Recos-BnM"
fecha: "2026-06-10"
sprint: 1
---

# Dashboard Épicas & Historias de Usuario — Sprint 1
### Recos-BnM · 10 jun 2026

---

## Vista global de épicas

```
╔══════════════════════════════════════════════════════════════════╗
║  ÉPICA 1  Registro + Onboarding     ██████████  100%  ✅         ║
║  ÉPICA 2  Tab Selector / Filtrado   ██████████  100%  ✅         ║
║  ÉPICA 3  Recomendación + Swipe     ██████████  100%  ✅         ║
║  ÉPICA 4  Vista de Detalle          ██████████  100%  ✅         ║
║  ÉPICA 5  Colecciones / Biblioteca  █████░░░░░   50%  ⚠️         ║
╚══════════════════════════════════════════════════════════════════╝
  Completitud total Sprint 1:  9/10 HUs  ≈  90%
```

---

## ÉPICA 1 — Registro y calibración inicial (P1)

> **Objetivo:** El usuario puede crear cuenta y calibrar sus preferencias en la primera sesión.

### HU1.1 — Registro simplificado (Email + Google) ✅

| Campo | Detalle |
|---|---|
| **Responsable** | Andrés González |
| **Estado** | ✅ Completo — mergeado PR #11, #14, #15, #16 |
| **Archivos** | `frontend/src/pages/Login.jsx`, `Register.jsx`, `AuthContext.jsx`, `ProtectedRoute.jsx`, `backend/src/middleware/auth.js` |
| **Tests** | `backend/tests/auth.test.js` — 3 casos (PR #48) |
| **Criterios aceptación** | ✅ Registro email/pass · ✅ Login Firebase Auth · ✅ Rutas protegidas · ✅ Token JWT en middleware |

**Gaps identificados:**
- Google Sign-In configurado en Firebase Console (pendiente verificar en producción)
- No hay tests de `Login.jsx` ni `Register.jsx` en frontend

---

### HU1.2 — Calibración por swipe (cold start) ✅

| Campo | Detalle |
|---|---|
| **Responsable** | Juan Carlos Macías |
| **Estado** | ✅ Completo — mergeado PR #22 |
| **Archivos** | `frontend/src/pages/Onboarding.jsx`, `Onboarding.css`, `FeedContext.jsx` |
| **Tests** | `frontend/src/tests/Onboarding.test.jsx` — 13 casos |
| **Criterios aceptación** | ✅ Paso 1 (géneros) · ✅ Paso 3 (perfil autor/director) · ✅ Animación slide · ✅ Contador X de Y |

**Gaps identificados:**
- Paso 2 del onboarding (si existe) no documentado
- `prefs` guardadas en Firestore `users/{uid}` — pendiente validar que se persisten correctamente

---

## ÉPICA 2 — Selección y filtrado de contenido (P2)

> **Objetivo:** El usuario puede alternar entre películas y libros en el feed.

### HU2.1 — Conmutador de tipo (Tab Selector) ✅

| Campo | Detalle |
|---|---|
| **Responsable** | Juan Carlos Macías |
| **Estado** | ✅ Completo — mergeado PR #22 |
| **Archivos** | `frontend/src/components/TabSelector.jsx` |
| **Tests** | `frontend/src/tests/TabSelector.test.jsx` — 5 casos |
| **Criterios aceptación** | ✅ Conmuta entre `type=movie` y `type=book` · ✅ Integrado con FeedContext |

---

## ÉPICA 3 — Recomendación y mecánica de swipe (P3)

> **Objetivo:** El usuario recibe contenido ordenado por relevancia y puede hacer swipe para calificarlo.

### HU3.1 — Algoritmo de arranque (popularidad + contenido) ✅

| Campo | Detalle |
|---|---|
| **Responsable** | Manuel Serranía |
| **Estado** | ✅ Completo — mergeado PR #10, #20 |
| **Archivos** | `backend/src/services/scoring.js`, `ingest/src/tmdb_ingest.py`, `ingest/src/books_ingest.py`, `ingest/src/models.py` |
| **Tests** | `ingest/tests/test_scoring.py`, `test_tmdb_ingest.py` — 30+ casos Python |
| **Criterios aceptación** | ✅ `computeScore(items, genreAffinity)` exportado · ✅ Ordena por `popularity * rating * affinity` · ✅ 550+ docs en Firestore (`content`) |

**Gaps identificados:**
- No hay endpoint `GET /api/content` para consultar el catálogo desde el frontend directamente
- El ingest es manual — no hay Cloud Scheduler configurado aún

---

### HU3.2 — Feed interactivo con swipe ✅

| Campo | Detalle |
|---|---|
| **Responsables** | Luis Téllez (API) + Edgar Coronel (ContentCard) + Monserrat Miranda (SwipeDeck) |
| **Estado** | ✅ Completo — PRs #24, #26, #33, #42 |
| **Archivos** | `backend/src/routes/feed.js`, `backend/src/routes/swipe.js`, `frontend/src/components/ContentCard.jsx`, `frontend/src/components/SwipeDeck.jsx` |
| **Tests** | `feed.test.js` (5) + `swipe.test.js` (7) + `ContentCard.test.jsx` (8) = 20 casos |
| **Criterios aceptación** | ✅ `GET /api/feed` con paginación cursor · ✅ `POST /api/swipe` like/dislike · ✅ Tarjeta con cover/título/géneros/rating · ✅ Gesto swipe izq/der · ✅ Excluye ya vistos del feed |

**Integración completa:**
```
FeedContext ──► GET /api/feed ──► scoring.js ──► SwipeDeck
                                                    ├─ ContentCard (render)
                                                    └─ POST /api/swipe (acción)
```

---

## ÉPICA 4 — Vista de detalle (P4)

> **Objetivo:** El usuario puede ver información completa de un título antes o después del swipe.

### HU4.1 — Vista expandida equilibrada ✅

| Campo | Detalle |
|---|---|
| **Responsable** | Marina García |
| **Estado** | ✅ Completo — mergeado PR #38 |
| **Archivos** | `frontend/src/components/DetailSheet.jsx` |
| **Tests** | No hay `DetailSheet.test.jsx` — gap de cobertura |
| **Criterios aceptación** | ✅ Bottom sheet con detalle · ✅ Integrado con SwipeDeck (PR #42 de Monserrat) |

**Gaps identificados:**
- Sin tests unitarios para DetailSheet
- Conectado a datos del feed (locales) — pendiente conectar a `GET /api/content/:id` de Héctor para enriquecimiento

---

## ÉPICA 5 — Colecciones y listas (P5)

> **Objetivo:** El usuario puede guardar títulos en su biblioteca personal con listas y notas.

### HU5.1 — Guardado clasificado + listas personalizadas ⚠️ PARCIAL

| Capa | Responsable | Estado | Archivos |
|---|---|---|---|
| **Backend API** | Imanol / Christian | ✅ Completo PR #30, #49 | `collections.js`, `collections.test.js` (20 casos) |
| **Frontend UI** | Diana Álvarez | 🔴 Sin entregar | Solo `LibraryPlaceholder.jsx` |

**Criterios de aceptación — estado:**

| Criterio | Estado |
|---|---|
| `POST /api/collections` — guardar ítem | ✅ Backend listo |
| `GET /api/collections?userId=` — listar | ✅ Backend listo |
| `PATCH /api/collections/:id` — editar nota | ✅ Backend listo |
| `DELETE /api/collections/:id` — eliminar | ✅ Backend listo |
| UI: página `Library.jsx` con ítems guardados | ❌ Sin implementar |
| UI: agrupación por tipo (películas / libros) | ❌ Sin implementar |
| UI: estado vacío | ❌ Sin implementar |

**Impacto en PoC 2 (lun 15 jun):**
> Sin `Library.jsx`, el flujo completo "swipe → guardar → ver en biblioteca" no puede demostrarse en PoC 2.

---

## Mapa de dependencias entre HUs

```
HU1.1 (Auth) ──────────────────────────────────────────────────────┐
    │                                                               │
    ▼                                                               ▼
HU1.2 (Onboarding) ──► HU2.1 (TabSelector) ──► HU3.2 (Feed+Swipe) ──► HU5.1 (Biblioteca)
                                                      │                        ▲
HU3.1 (Scoring/Ingest) ──────────────────────────────┘                        │
                                                                               │
HU4.1 (DetailSheet) ─────────────────────────────────────────────────────────-┘
```

---

## Resumen por épica

| Épica | HUs | Completadas | Estado | Responsable(s) |
|---|---|---|---|---|
| E1 — Registro | 2 | 2/2 | ✅ 100% | Andrés + Juan Carlos |
| E2 — Filtrado | 1 | 1/1 | ✅ 100% | Juan Carlos |
| E3 — Swipe | 2 | 2/2 | ✅ 100% | Manuel + Luis + Edgar + Monserrat |
| E4 — Detalle | 1 | 1/1 | ✅ 100% | Marina |
| E5 — Biblioteca | 1 | ½ | ⚠️ 50% | Imanol ✅ / Diana ❌ |
| **TOTAL** | **7** | **6.5/7** | **≈ 93%** | |

---

*Generado: 2026-06-10 | Fuente: PRD v2.0 + 49 PRs en GitHub + estado de ramas*
