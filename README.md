# reco-BnM — Catálogo & Scoring (HU 3.1)

**rama:** `feat/manuel`  
**asignado:** Manuel Serranía Reinada  
**épica:** 3 — Recomendación y mecánica de swipe (P3)

---

## Lo que entrega esta rama

| Artefacto | ubicación | qué hace |
|---|---|---|
| Pipeline de ingesta | `ingest/src/` | Trae ~550 ítems (300 movies + 250 books) de TMDB + Google Books y los escribe en Firestore colección `content` |
| Módulo de scoring | `api/src/services/scoring.js` | Calcula `score = 0.7·norm(popularity) + 0.3·norm(rating)` con boost opcional por afinidad de géneros |
| Tests | `ingest/tests/` | 30 tests: modelos + fórmula scoring |
| Documentación | `docs/` | Plan, heartbeat, gap-analysis, testing guide, security audit |

---

## Prerequisitos

- Python 3.10+
- Node.js 18+
- Java 21 (Eclipse Adoptium Temurin) — solo para emulator
- Firebase CLI (`npm i -g firebase-tools`)
- API keys en `.env` (ver `.env.example`)
- Java en PATH para el emulator:
  ```powershell
  $env:Path += ";C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin"
  ```

---

## Cómo usar

### 1. Iniciar emulator de Firestore

```bash
firebase emulators:start --only firestore
```

Para persistir datos entre sesiones (no re-correr ingesta cada vez):

```bash
firebase emulators:start --only firestore --import=./firestore-data --export-on-exit=./firestore-data
```

Emulator UI: `http://127.0.0.1:4000/firestore`

### 2. Correr ingesta (en otra terminal)

```powershell
$env:PYTHONIOENCODING='utf-8'
python ingest/src/main.py
```

**Salida esperada:**

```
--- Fetching TMDB movies ---
[TMDB] 348 unique candidates (300 popular + 100 top_rated)
[TMDB] 1/348: Avengers: Infinity War
[...]
[TMDB] Fetched 300 movies (This product uses the TMDB API but is not endorsed or certified by TMDB.)
--- Fetching Google Books ---
[Books] 1: The Great Gatsby
[...]
[Books] Fetched 250 books
--- Total items to write: 550 ---
[Firestore] Wrote 400/550 documents
[Firestore] Wrote 550/550 documents
Done: {'status': 'ok', 'count': 550}
```

### 3. Consultar datos en el emulator

```bash
python ingest/src/query_content.py
```

**Salida esperada:**

```
--- Resumen ---
Total documentos: 550
  movies: 300
  books: 250
```

### 4. Probar scoring localmente

```bash
node -e "
const { computeScore } = require('./api/src/services/scoring');
const items = [
  { title: 'Matrix', popularity: 95, rating: 8.7, genres: ['Action','Sci-Fi'] },
  { title: 'Titanic', popularity: 80, rating: 7.9, genres: ['Drama','Romance'] },
];
console.table(computeScore(items));
// Con afinidad:
console.table(computeScore(items, { Action: 1.3, Drama: 0.7 }));
"
```

### 5. Correr tests

```bash
python -m pytest ingest/tests/ -v
```

**Salida esperada:**

```
collected 30 items
ingest/tests/test_scoring.py::test_basic_ranking PASSED
ingest/tests/test_scoring.py::test_score_formula_known_values PASSED
...
ingest/tests/test_tmdb_ingest.py::test_extract_year PASSED
====================== 30 passed in 1.40s ======================
```

### 6. Buildear y correr con Docker

```powershell
# Build imagen
docker build -t ingest-content ./ingest

# Correr local (apuntando al emulator)
docker run --rm -p 8080:8080 `
  --env-file .env `
  -e FIRESTORE_EMULATOR_HOST=host.docker.internal:8080 `
  ingest-content

# La API queda en http://localhost:8080
# Probar: curl -X POST http://localhost:8080
# Respuesta esperada: {"status": "ok", "count": 550}
```

### 7. Deploy a Cloud Run

```powershell
gcloud builds submit ./ingest --tag gcr.io/$PROJECT_ID/ingest-content

gcloud run deploy ingest-content `
  --image gcr.io/$PROJECT_ID/ingest-content `
  --platform managed `
  --region us-central1 `
  --set-env-vars "TMDB_API_KEY=$TMDB_KEY,GOOGLE_BOOKS_API_KEY=$BOOKS_KEY,FIRESTORE_PROJECT_ID=$PROJECT_ID" `
  --no-allow-unauthenticated

curl -X POST https://ingest-content-xxxxx-uc.a.run.app
# Respuesta esperada: {"status": "ok", "count": 550}
```

> Cloud Scheduler (cron `0 4 * * *`) se configura después del deploy.

---

## Lo que necesita cada quién

### Luis — `GET /api/feed`

```js
// api/src/routes/feed.js
const { computeScore } = require('../services/scoring');

// 1. Leer candidateItems de Firestore colección content
// 2. Excluir contenido ya swipado por el usuario
// 3. Si el usuario tiene >100 swipes, calcular genreAffinity
//    ej. { Action: 1.2, Drama: 0.8 } basado en ratio likes/total por género
const affinity = userStats.totalSwipes > 100 ? computeGenreAffinity(userStats) : {};

// 4. Scorrear y devolver top 20
const ranked = computeScore(candidateItems, affinity);
res.json(ranked.slice(0, 20));
```

Fields esperados en cada item de `content`:

```js
{
  type: "movie" | "book" | "series",
  externalId: string,
  source: "tmdb" | "google_books",
  title: string,
  posterUrl: string,        // URL
  year: number,
  creator: string[],         // director (movie) / authors (book)
  genres: string[],
  description: string,
  popularity: number,
  rating: number,             // 0-10
  whereToWatch: string[],     // solo movies
  syncedAt: string,           // ISO datetime
}
```

### Héctor — `GET /api/content/{id}`

Leer de Firestore: `content/{source}_{externalId}`. Mismos fields que arriba.  
Si no hay watch providers, devolver array vacío.

### Israel — Schema Firestore

Schema definido en `src/firestore/SCHEMA.md`. Ya alineado con los campos del ingest.

### Juan Carlos — Onboarding / Screens

Los datos de contenido tienen `posterUrl`, `title`, `year`, `genres`, `description`, `rating`, `creator`.  
Atribución requerida en UI:

> *"This product uses the TMDB API but is not endorsed or certified by TMDB"*

---

## Estructura del proyecto

```
recos-BnM/
├── api/src/services/
│   └── scoring.js            ← Módulo de scoring (para Luis)
├── ingest/
│   ├── src/
│   │   ├── main.py           ← Entry point (Cloud Run)
│   │   ├── config.py         ← Env vars loader
│   │   ├── models.py         ← ContentItem dataclass
│   │   ├── tmdb_ingest.py    ← TMDB API client
│   │   ├── books_ingest.py   ← Google Books API client
│   │   ├── firestore_client.py
│   │   └── query_content.py  ← Script de consulta
│   ├── tests/
│   │   ├── test_scoring.py   ← 15 tests
│   │   └── test_tmdb_ingest.py ← 15 tests
│   ├── Dockerfile
│   └── requirements.txt
├── src/firestore/
│   └── SCHEMA.md             ← Schema de Israel
└── docs/
    ├── SYSTEM_HEARTBEAT.md
    ├── TESTING_HU3.1.md
    ├── SECURITY-AUDIT-2026-06-04.md
    └── gap-analysis.md
```

---

## Notas críticas

- `.env` contiene API keys reales → **nunca se commitea** (está en `.gitignore`)
- Books tienen `popularity = 0.0` siempre (Google Books no da métrica)
- Google Books rating se multiplica por 2 (0-5 → 0-10) para empatar escala TMDB
- El ingest es **idempotente**: upsert por `contentId = "{source}_{externalId}"`, se puede re-correr sin duplicar
- Java 21 requerido para el emulator: `C:\Program Files\Eclipse Adoptium\jre-21.0.11.10-hotspot\bin`
- La normalización de scoring es min-max **sobre el conjunto candidato** en cada request (no precomputado)
- El director de cada película se obtiene vía `append_to_response=credits` de TMDB (sin llamada extra)
- Cada integrante es responsable de los tests de su módulo (sprint.md §A)

---

## Tests

```bash
# Todos los tests del módulo ingest
python -m pytest ingest/tests/ -v

# Solo tests de scoring
python -m pytest ingest/tests/test_scoring.py -v

# Solo tests de modelos
python -m pytest ingest/tests/test_tmdb_ingest.py -v
```

Ver `docs/TESTING_HU3.1.md` para guía de pruebas manuales.  
Ver `docs/SECURITY-AUDIT-2026-06-04.md` para auditoría de seguridad.
