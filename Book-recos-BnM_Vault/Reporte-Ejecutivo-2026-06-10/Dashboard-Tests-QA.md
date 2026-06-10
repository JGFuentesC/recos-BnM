---
type: "dashboard-tests-qa"
proyecto: "Recos-BnM"
fecha: "2026-06-10"
sprint: 1
total_tests: 77
---

# Dashboard Tests & QA — Sprint 1
### Recos-BnM · 10 jun 2026

---

## Cobertura total

```
╔══════════════════════════════════════════════════════════════════╗
║  TOTAL DE CASOS EN REPO: 77                                      ║
║                                                                  ║
║  Backend JS   ████████████████████  43 casos  (56%)             ║
║  Frontend JSX ██████████            26 casos  (34%)             ║
║  Firestore    ███                    8 casos  (10%)             ║
║                                                                  ║
║  Python (ingest)  ~30 casos  ← en /ingest/tests/ (no Jest)      ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Detalle por archivo

### Backend — Node.js / Jest + Supertest

| Archivo | Casos | Responsable | Qué cubre | Estado |
|---|---|---|---|---|
| `backend/tests/auth.test.js` | 3 | Andrés (PR #48) | Middleware auth — 401 sin token, 200 con token válido, token malformado | ✅ |
| `backend/tests/collections.test.js` | 20 | Imanol (PR #30, #49) | CRUD completo: GET, POST, PATCH, DELETE + casos de borde + jest.mock hoisting | ✅ |
| `backend/tests/content.test.js` | 8 | Héctor (PR #29) | GET /api/content/:id — 200, 404, 401, 500 | ✅ |
| `backend/tests/feed.test.js` | 5 | Luis (PR #24) | GET /api/feed — 401, 400 (type), 400 (userId), 200 excluye swipeados, campos correctos | ✅ |
| `backend/tests/swipe.test.js` | 7 | Luis (PR #24) | POST /api/swipe — 401, 400 (campos), 400 (userId→no 403), 400 (action inválida), 204 like/dislike, campos Firestore | ✅ |
| **Subtotal Backend** | **43** | | | |

### Frontend — React / Vitest

| Archivo | Casos | Responsable | Qué cubre | Estado |
|---|---|---|---|---|
| `frontend/src/tests/ContentCard.test.jsx` | 8 | Edgar (PR #44) | Render con props, cover, géneros, rating, tipo, sin synopsis, sin cover | ✅ |
| `frontend/src/tests/Onboarding.test.jsx` | 13 | Juan Carlos (PR #22) | Pasos 1-3, animación, contador, validación géneros | ✅ |
| `frontend/src/tests/TabSelector.test.jsx` | 5 | Juan Carlos (PR #22) | Click movies/books, estado activo, callback | ✅ |
| **Subtotal Frontend** | **26** | | | |

### Firestore — Tests de seguridad / stub

| Archivo | Casos | Responsable | Qué cubre | Estado |
|---|---|---|---|---|
| `src/firestore/tests/collections.test.js` | 2 | Israel (PR #19) | Reglas de seguridad Firestore collections | ✅ stub |
| `src/firestore/tests/content.test.js` | 2 | Israel (PR #19) | Reglas de seguridad content | ✅ stub |
| `src/firestore/tests/swipes.test.js` | 2 | Israel (PR #19) | Reglas de seguridad swipes | ✅ stub |
| `src/firestore/tests/users.test.js` | 2 | Israel (PR #19) | Reglas de seguridad users | ✅ stub |
| **Subtotal Firestore** | **8** | | | |

### Python — pytest (ingest)

| Archivo | Casos aprox. | Responsable | Qué cubre | Estado |
|---|---|---|---|---|
| `ingest/tests/test_scoring.py` | ~15 | Manuel (PR #20) | `computeScore()` — popularidad, afinidad, ordenamiento | ✅ |
| `ingest/tests/test_tmdb_ingest.py` | ~15 | Manuel (PR #20) | Pipeline TMDB — parsing, normalización, campos | ✅ |
| **Subtotal Python** | **~30** | | | |

---

## Gaps de cobertura

```
COMPONENTES SIN TESTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ DetailSheet.test.jsx      (Marina — Wave 3)
  ❌ SwipeDeck.test.jsx        (Monserrat — Wave 3)
  ❌ Library.test.jsx          (Diana — Wave 4, sin entregar)
  ❌ Login.test.jsx            (Andrés)
  ❌ Register.test.jsx         (Andrés)
  ❌ FeedContext.test.jsx      (Juan Carlos)
  ❌ AuthContext.test.jsx      (Andrés)

RUTAS BACKEND SIN TESTS DE INTEGRACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚠️ No hay tests contra emulador real (todos son unit con mocks)
  ⚠️ No hay test de integración end-to-end (feed → swipe → collections)
  ⚠️ No hay tests de carga / performance
```

---

## QA Manual — docs/PHYSICAL_TEST_VALIDATION.md

Edgar Coronel documentó **126 casos de prueba manual** clasificados en:

| Categoría | Casos |
|---|---|
| Autenticación (HU1.1) | ~15 |
| Onboarding (HU1.2) | ~12 |
| Tab Selector (HU2.1) | ~8 |
| Feed y Swipe (HU3.2) | ~25 |
| ContentCard UI | ~15 |
| DetailSheet | ~12 |
| Collections / Biblioteca | ~20 |
| GCP Infrastructure | 10 |
| PWA / Offline | ~9 |
| **Total** | **126** |

**Estado de ejecución:** No documentado — los casos están escritos pero no hay reporte de resultados (PASS/FAIL).

---

## API Collection — docs/Recos-BnM-API-Collection.json

Ulises Chaparro entregó la colección de endpoints para Postman/Insomnia (PR #36):

| Endpoint | Método | Auth | En colección |
|---|---|---|---|
| `/api/feed` | GET | ✅ Bearer | ✅ |
| `/api/swipe` | POST | ✅ Bearer | ✅ |
| `/api/content/:id` | GET | ✅ Bearer | ✅ |
| `/api/collections` | GET/POST/PATCH/DELETE | ✅ Bearer | ✅ |
| `/api/private/ping` | GET | ✅ Bearer | ✅ |

---

## Distribución de cobertura por HU

| HU | Área | Tests unitarios | Tests manuales | Estado cobertura |
|---|---|---|---|---|
| HU1.1 — Auth | Backend + Frontend | auth.test.js (3) | ~15 casos QA | 🟡 Parcial — faltan Login/Register tests |
| HU1.2 — Onboarding | Frontend | Onboarding.test.jsx (13) | ~12 casos QA | ✅ Buena cobertura |
| HU2.1 — TabSelector | Frontend | TabSelector.test.jsx (5) | ~8 casos QA | ✅ Buena cobertura |
| HU3.1 — Scoring | Python | test_scoring.py (~15) | — | ✅ Buena cobertura |
| HU3.2 — Feed+Swipe | Backend + Frontend | feed(5)+swipe(7)+ContentCard(8) = 20 | ~40 casos QA | ✅ Buena cobertura |
| HU4.1 — DetailSheet | Frontend | ❌ Sin tests | ~12 casos QA | 🔴 Sin cobertura unitaria |
| HU5.1 — Collections | Backend | collections.test.js (20) | ~20 casos QA | 🟡 Backend bien, frontend sin tests |

---

## Recomendaciones QA para Sprint 2

1. **Ejecutar los 126 casos manuales** y documentar PASS/FAIL antes de PoC 1 (vie 12 jun)
2. **Agregar `DetailSheet.test.jsx`** — componente sin ningún test unitario
3. **Agregar `SwipeDeck.test.jsx`** — componente central del MVP sin tests
4. **Test de integración end-to-end** — simular flujo completo: login → onboarding → feed → swipe → colección
5. **Tests contra emulador** — los tests actuales usan mocks; validar contra Firestore real con emulador
6. **Ejecutar `docs/Recos-BnM-API-Collection.json`** en entorno de staging (Firebase emulador o Cloud Run)

---

*Generado: 2026-06-10 | Fuente: 12 archivos de test analizados + docs/PHYSICAL_TEST_VALIDATION.md + docs/QA_Test_Suite.md*
