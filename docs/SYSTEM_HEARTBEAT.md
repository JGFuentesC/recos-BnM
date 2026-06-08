# SYSTEM HEARTBEAT — feat/manuel

## Feature
**HU 3.1** — Ingesta de Catálogo & Score Normalizado  
**Épica:** 3 — Recomendación y mecánica de swipe (P3)  
**Rama:** `feat/manuel`  
**Asignado a:** Manuel Serranía Reinada

---

## Decisiones tomadas

| Decisión | Opción elegida |
|---|---|
| Lenguaje ingesta | Python (scripts `.py` en `/ingest`) |
| Lenguaje scoring | Node.js (`services/scoring.js`) |
| API keys | Variables de entorno en `.env` (solo `.env.example` en repo) |
| Estructura | `/ingest` + `/services` separados |
| Schema de contenido | Esperar a que Israel lo defina (`SCHEMA.md` pendiente) |
| Dockerfile | Pendiente (opción B — se agrega después del schema) |
| Deduplicación | Upsert con `contentId = "{source}_{externalId}"` |
| Scoring | Normalización min-max sobre conjunto candidato en runtime (no precomputado) |
| Señal de afinidad | `genreAffinity` opcional en `computeScore()` — multiplier sobre score final |
| Rating Books | 0-5 → 0-10 (×2) para empatar escala TMDB |

---

## Archivos creados / modificados

### Código
| Archivo | Estado | Propósito |
|---|---|---|
| `ingest/config.py` | ✅ | Config desde env vars |
| `ingest/models.py` | ✅ | Dataclass ContentItem con factories from_tmdb/from_google_books |
| `ingest/tmdb_client.py` | ✅ | TMDB: popular 15p + top_rated 5p + watch providers |
| `ingest/books_client.py` | ✅ | Google Books: 17 categorías × 2 páginas, dedup |
| `ingest/firestore_client.py` | ✅ | Batch upsert a content/{source}_{externalId} |
| `ingest/main.py` | ✅ | Orquestación TMDB → Books → Firestore, handler HTTP |
| `ingest/requirements.txt` | ✅ | google-cloud-firestore, requests, python-dotenv, functions-framework |
| `services/scoring.js` | ✅ | `computeScore(items, genreAffinity?)` con normalización + afinidad |
| `ingest/query_content.py` | ✅ | Script read-only para Firestore emulator |

### Config / Infra
| Archivo | Estado | Propósito |
|---|---|---|
| `.env.example` | ✅ | Template con placeholders vacíos |
| `.firebaserc` | ✅ | Firebase project alias |
| `firebase.json` | ✅ | Emulator config (Firestore) |
| `firestore.rules` | ✅ | Security rules base |
| `firestore.indexes.json` | ✅ | Composite indexes (vacío por ahora) |
| `.gitignore` | ✅ | firebase-debug.log, node_modules/, dist/, *.db, .run/ |

### Docs
| Archivo | Estado | Propósito |
|---|---|---|
| `feat-manuel.md` | ✅ | Plan detallado del feature |
| `docs/SYSTEM_HEARTBEAT.md` | ✅ | Este archivo — contexto del feature |
| `docs/TESTING_HU3.1.md` | ✅ | Guía de pruebas manuales |
| `docs/SECURITY-AUDIT-2026-06-04.md` | ✅ | Auditoría de seguridad (LOW x2 fixed, HIGH 0, MEDIUM 0) |

---

## Estado por tarea técnica (PRD §7)

| # | Tarea | Dueño | Estado |
|---|---|---|---|
| 3 | Score normalizado `0.7·norm(pop) + 0.3·norm(rating)` | Manuel | ✅ Implementado |
| 4 | Señal de afinidad (>100 swipes: +peso a géneros) | Manuel | ✅ Implementado |

---

## Variables de entorno requeridas (`.env`)

| Variable | Estado |
|---|---|
| `TMDB_API_KEY` | ✅ Obtenida (Bearer token) |
| `GOOGLE_BOOKS_API_KEY` | ✅ Obtenida |
| `FIRESTORE_PROJECT_ID` | ⬜ Definir con Israel |
| `FIRESTORE_EMULATOR_HOST` | ✅ `localhost:8080` para desarrollo |

**⚠️ `.env` está en `.gitignore` — nunca commitear.**

---

## Dependencias activas

| Dependencia | Estado | Impacto |
|---|---|---|
| Schema `content` de Israel (`SCHEMA.md`) | 🔴 Pendiente | Bloquea definir estructura exacta de campos en Firestore |
| Proyecto GCP con Firestore | 🟡 Pendiente | Necesario para despliegue Cloud Run |

---

## Pipeline de ingesta (probado)

```
TMDB /movie/popular (15p) ─┐
                            ├─→ dedup por ID → Firestore content/ (550 docs)
TMDB /movie/top_rated (5p) ─┘
Google Books (17 cats × 2p) ─→ dedup por ID ─┘
```

- **550 documentos**: 300 movies + 250 books ✅
- Idempotente: upsert por `contentId = "{source}_{externalId}"`
- Ejecutar con: `python ingest/main.py` (emulator debe correr antes)

---

## Scoring API (`services/scoring.js`)

```js
const { computeScore } = require('../../services/scoring');

// < 100 swipes — sin afinidad
let ranked = computeScore(candidateItems);

// >= 100 swipes — con afinidad (calculada desde swipe history por Luis)
const affinity = { Action: 1.2, Drama: 0.8, Comedy: 1.05 };
ranked = computeScore(candidateItems, affinity);
```

- Normalización min-max sobre conjunto candidato
- Si max === min, asigna 0.5 a todos (evita división por cero)
- `genreAffinity`: cada item usa el **mayor** multiplier entre sus genres
- Sin genres o sin coincidencia → multiplier = 1.0 (no afecta)
- Exporta: `{ normalize, computeScore }`

---

## Próximos pasos

1. ⬜ Esperar schema `content` de Israel (`SCHEMA.md`)
2. ⬜ Crear Dockerfile para `/ingest` (Cloud Run) cuando schema esté listo
3. ⬜ Desplegar job de ingesta a Cloud Run + Cloud Scheduler (cron `0 4 * * *`)
4. ⬜ Confirmar integración de `scoring.js` en `GET /api/feed` con Luis
5. ⬜ Configurar proyecto GCP y base Firestore productiva

---

## Notas importantes

- **Atribución TMDB obligatoria** en cualquier UI: *"This product uses the TMDB API but is not endorsed or certified by TMDB"*
- Books tienen `popularity = 0.0` (Google Books no provee métrica de popularidad) — `normalize()` lo maneja correctamente
- Java 21 (Temurin) requerido para emulator: `C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin`
- Emulator: `firebase emulators:start --only firestore`
- Ingest local: `$env:PYTHONIOENCODING='utf-8'; python ingest/main.py`
- Security audit 2026-06-04: **HIGH 0, MEDIUM 0, LOW 2 (fixed)** — clearance granted

## Documentos de referencia

- `docs/PRD Recos-BnM.md` — §6 Modelo de datos, §7 Épica 3 (HU3.1)
- `docs/workflow.md` — Fila de Manuel (asignación y dependencias)
- `feat-manuel.md` — Plan detallado del feature
- `docs/TESTING_HU3.1.md` — Guía de pruebas manuales
- `docs/SECURITY-AUDIT-2026-06-04.md` — Auditoría de seguridad
