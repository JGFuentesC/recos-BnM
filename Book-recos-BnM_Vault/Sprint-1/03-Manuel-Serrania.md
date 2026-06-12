# Sprint 1 — Manuel Serranía Reinada
**Nivel:** Medio | **Épicas:** 3 / Infra | **Wave:** 🟠 1 (después de Israel, en paralelo con Andrés)

---

## 🎯 Tu misión

Eres quien **puebla el catálogo** del que depende toda la experiencia de swipe. Sin datos en la colección `content`, el feed está vacío. Tu trabajo tiene dos partes: el **job de ingest** (descarga y guarda películas/libros de APIs externas) y el **módulo de scoring** (calcula qué tan relevante es cada ítem para mostrarlo en el feed).

**Entrega el miércoles 10 jun:**
- Script `ingest/tmdb_ingest.py` — sincroniza películas desde TMDB
- Script `ingest/books_ingest.py` — sincroniza libros desde Google Books
- ≥500 items en la colección `content` de Firestore (en emulador, para desarrollo)
- `backend/src/services/scoring.js` — módulo de score normalizado
- Cloud Scheduler cron configurado (`0 4 * * *`) — para producción

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Schema de `content` (campos exactos) | **[[01-Israel-Perez\|Israel Pérez]]** — `docs/SCHEMA.md` | Wave 0 |
| Emulador Firestore corriendo | **[[01-Israel-Perez\|Israel Pérez]]** | Wave 0 |
| TMDB API Key | PM / tú mismo | Obtener en themoviedb.org |
| Google Books API Key | PM / tú mismo | Obtener en console.cloud.google.com |

> ⏸️ **Espera el schema de Israel** antes de escribir a Firestore, pero puedes preparar los scripts y probarlos con datos mock.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[04-Luis-Tellez|Luis]]** necesita `services/scoring.js` para el algoritmo del GET /api/feed
- ✅ **[[05-Hector-Morales|Héctor]]** necesita la colección `content` poblada para GET /api/content/{id}
- ✅ **[[08-Juan-Carlos-Macias|Juan Carlos]]** necesita el catálogo para las tarjetas de onboarding

---

## 📋 Pasos paso a paso

### Paso 1 — Crear la carpeta del job de ingest
```bash
mkdir ingest
cd ingest
# Si usas Python:
python -m venv venv && source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install requests firebase-admin python-dotenv
```

### Paso 2 — Obtener las API keys
- **TMDB:** Ir a [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) → crear cuenta → solicitar API key (gratuita)
- **Google Books:** [console.cloud.google.com](https://console.cloud.google.com) → Biblioteca de APIs → Books API → Habilitar → Credenciales → Crear API Key

### Paso 3 — Crear `.env` en la carpeta ingest
```
TMDB_API_KEY=tu_key_aqui
GOOGLE_BOOKS_API_KEY=tu_key_aqui
FIRESTORE_EMULATOR_HOST=localhost:8080
```

### Paso 4 — Escribir los scripts (Claude Code lo hace)
Los scripts descargan datos y los guardan en Firestore siguiendo el schema de Israel.

### Paso 5 — Escribir `scoring.js`
```
score = 0.7 * norm(popularity) + 0.3 * norm(rating)
norm(x) = (x - min) / (max - min)  // sobre el conjunto candidato
```

### Paso 6 — Verificar en el emulador
Ejecutar los scripts y verificar en `localhost:4000` que hay ≥500 docs en `content` con todos los campos.

### Paso 7 — Configurar Cloud Scheduler (para producción)
```bash
gcloud scheduler jobs create http sync-catalogo \
  --schedule "0 4 * * *" \
  --uri "https://<URL-ingest>/run" \
  --http-method POST \
  --time-zone "America/Mexico_City"
```

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/03-Manuel-agent-context.md — define qué archivos puedes tocar.

Necesito crear el sistema de ingesta de catálogo para el proyecto Recos-BnM.
El job corre en Cloud Run, escribe a Firestore, y se activa diariamente con Cloud Scheduler.

CONTEXTO del schema Firestore (colección content/{contentId}):
  type: "movie" | "book"
  externalId: string (ID de TMDB o Google Books)
  source: "tmdb" | "google_books"
  title: string
  cover: string (URL de la portada)
  year: number
  genres: array de strings
  synopsis: string
  popularity: number (float, escala original de la API)
  rating: number (0-10 normalizado)
  watchProviders: array (solo movies; [] si no hay dato)
  syncedAt: timestamp

Variables de entorno disponibles:
  TMDB_API_KEY, GOOGLE_BOOKS_API_KEY
  FIRESTORE_EMULATOR_HOST=localhost:8080 (en desarrollo)
  GOOGLE_APPLICATION_CREDENTIALS (en producción)

TAREA 1 — ingest/tmdb_ingest.py
Script Python que:
- Llama a GET https://api.themoviedb.org/3/movie/popular?language=es-MX&page={1..10}
- Para cada película, llama a GET https://api.themoviedb.org/3/movie/{id}/watch/providers
- Mapea los campos al schema de Firestore (externalId = tmdb id, source = "tmdb")
- Para "cover": usa https://image.tmdb.org/t/p/w500/{poster_path}
- Para "rating": normaliza vote_average (ya está en 0-10, dejarlo tal cual)
- Para "genres": mapea genre_ids a nombres usando GET /3/genre/movie/list
- Para "watchProviders": array de proveedores MX (MX.flatrate[].provider_name) o [] si no hay
- Guarda en Firestore con set(doc, merge=True) para no duplicar si syncedAt ya existe
- Maneja rate limiting: sleep(0.25) entre requests
- Mínimo 300 películas en la colección

TAREA 2 — ingest/books_ingest.py
Script Python que:
- Llama a Google Books API: GET https://www.googleapis.com/books/v1/volumes?q=subject:{genre}&maxResults=40
- Géneros a consultar: fiction, mystery, science fiction, romance, biography, history, self-help
- Mapea al schema (externalId = volumeId, source = "google_books")
- Para "cover": volumeInfo.imageLinks.thumbnail o placeholder si no hay
- Para "rating": volumeInfo.averageRating (0-5) → normalizar a 0-10 (multiplicar x 2); 5.0 si no hay rating
- Para "genres": volumeInfo.categories o ["General"] si no hay
- Para "watchProviders": [] (libros no tienen proveedores de streaming)
- Mínimo 200 libros en la colección

TAREA 3 — backend/src/services/scoring.js
Módulo Node.js que exporta una función scoreCandidates(items):
- Recibe array de objetos content con popularity y rating
- Calcula norm_popularity = (x - min) / (max - min) sobre el array
- Calcula norm_rating = (x - min) / (max - min) sobre el array
- Retorna el array ordenado por score = 0.7 * norm_popularity + 0.3 * norm_rating DESC
- Si min === max (todos iguales), norm = 1 para evitar NaN
- Exportar: module.exports = { scoreCandidates }

TAREA 4 — ingest/Dockerfile
Dockerfile para Cloud Run:
  FROM python:3.12-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install -r requirements.txt
  COPY . .
  CMD ["python", "tmdb_ingest.py"]

TAREA 5 — ingest/requirements.txt
  requests==2.32.3
  firebase-admin==6.5.0
  python-dotenv==1.0.1

Verificar que:
1. tmdb_ingest.py corre sin errores y escribe docs en el emulador
2. books_ingest.py corre sin errores y escribe docs en el emulador
3. scoring.js ordena correctamente un array de prueba de 5 items

Muéstrame el conteo de docs en content/ al terminar y un ejemplo de doc guardado.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-manuel-ingest.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Manuel Serranía Reinada"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-1]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Incluir conteo de docs insertados en content/ y un ejemplo de doc JSON guardado.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `ingest/tmdb_ingest.py` — ≥300 películas en Firestore emulador
- [ ] `ingest/books_ingest.py` — ≥200 libros en Firestore emulador
- [ ] `ingest/Dockerfile` + `requirements.txt`
- [ ] `backend/src/services/scoring.js` — función `scoreCandidates` exportada
- [ ] Total ≥500 docs en colección `content`
- [ ] PR abierto con screenshot del emulador mostrando el conteo

---

## 🚀 Fase 2 — Engagement (Jun 13–15, 2026)

> **Eres la pieza central de Fase 2.** El scoring de afinidad histórica es la feature P1 de engagement. Con los datos de swipes reales ya en Firestore, puedes calcular qué géneros le gustan más a cada usuario y ajustar el feed.

### 🎯 Tu misión Fase 2

**Prioridad 0 — Ingest a producción (Jueves 12 jun):**

```bash
# Re-ejecutar ingest contra Firestore producción (NO el emulador)
# Asegurarse de que .env tiene las credenciales de producción (no FIRESTORE_EMULATOR_HOST)
python ingest/tmdb_ingest.py   # ≥300 películas en prod
python ingest/books_ingest.py  # ≥200 libros en prod

# Verificar en Firebase Console → Firestore → colección content:
# al menos 500 documentos con todos los campos del schema
```

**Tarea 1 — Agregar `buildGenreAffinity` a `scoring.js` (Feature P1 Fase 2):**

> ⚠️ CONTEXTO REAL DEL CÓDIGO: `backend/src/services/scoring.js` ya existe con la función `computeScore(items, genreAffinity = {})` que acepta el mapa de afinidad. **No debes reescribir `computeScore`** — solo agregar `buildGenreAffinity` como nueva función.
> La función ya exporta: `module.exports = { normalize, computeScore, scoreCandidates: computeScore }`
> Tu tarea: agregar `buildGenreAffinity` y exportarla también.

Agregar a `backend/src/services/scoring.js` (antes de `module.exports`):

```javascript
/**
 * Calcula multiplicadores de afinidad por género a partir del historial de swipes.
 * Retorna: { "Sci-Fi": 1.44, "Drama": 0.96 } — solo géneros con ≥5 swipes.
 * Luis pasa este resultado como segundo parámetro a computeScore(candidates, genreAffinity).
 *
 * @param {Array} swipeDocs - Array de { genres: string[], action: "like"|"dislike" }
 * @returns {Object} mapa genero → multiplicador (rango 0.8 – 1.6)
 */
function buildGenreAffinity(swipeDocs) {
  const byGenre = {}
  swipeDocs.forEach(({ genres = [], action }) => {
    genres.forEach(g => {
      if (!byGenre[g]) byGenre[g] = { likes: 0, total: 0 }
      byGenre[g].total++
      if (action === 'like') byGenre[g].likes++
    })
  })
  return Object.fromEntries(
    Object.entries(byGenre)
      .filter(([, v]) => v.total >= 5)
      .map(([g, v]) => [g, 0.8 + (v.likes / v.total) * 0.8])
  )
}
```

Actualizar la última línea del archivo:
```javascript
// ANTES:
module.exports = { normalize, computeScore, scoreCandidates: computeScore }

// DESPUÉS:
module.exports = { normalize, computeScore, scoreCandidates: computeScore, buildGenreAffinity }
```

**Tarea 2 — Agregar `titleLower` al ingest para habilitar la búsqueda:**

Luis necesita hacer range queries por título en Firestore. El campo `titleLower` no existe en los docs actuales. Agregar a `ingest/src/tmdb_ingest.py` en el `movie_payload`:

```python
movie_payload = {
    "title":      details.get("title"),
    "titleLower": (details.get("title") or "").lower(),   # ← AGREGAR esta línea
    "synopsis":   details.get("overview"),
    # ... resto de campos igual
}
```

Hacer lo mismo en `books_ingest.py` en el payload del libro:
```python
book_payload = {
    "title":      vol_info.get("title"),
    "titleLower": (vol_info.get("title") or "").lower(),  # ← AGREGAR esta línea
    # ... resto igual
}
```

> Después de agregar `titleLower`, re-ejecutar el ingest contra producción para que los docs existentes también tengan el campo.

**Tarea 3 — Coordinar con Luis Téllez:**

Luis va a llamar a `buildGenreAffinity(swipeDocs)` desde `/api/feed` y pasar el resultado a `computeScore(candidates, genreAffinity)`. Tú solo entregas las funciones. Confirmar que el módulo exporta:
```javascript
module.exports = { normalize, computeScore, scoreCandidates: computeScore, buildGenreAffinity }
```

**Tarea 3 — Ingest incremental (Fase 2 catálogo fresco):**

Agregar a los scripts de ingest lógica para no reimportar títulos que ya existen en Firestore si `syncedAt` es de menos de 7 días. Esto reduce costos de API y tiempo de ejecución.

```python
# Al inicio del script, obtener IDs ya existentes con syncedAt reciente
recent_cutoff = datetime.now() - timedelta(days=7)
existing = {doc.id for doc in db.collection('content')
            .where('syncedAt', '>=', recent_cutoff).stream()}
# Solo procesar los que no estén en existing
```

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Manuel Serranía, responsable del ingest y scoring.

CONTEXTO IMPORTANTE — Estado real del código:
- backend/src/services/scoring.js YA EXISTE con computeScore(items, genreAffinity={})
  La función ya acepta genreAffinity como segundo parámetro y aplica un multiplicador por género.
  Exporta: { normalize, computeScore, scoreCandidates: computeScore }
  NO reescribir computeScore — solo agregar buildGenreAffinity al mismo archivo.

TAREA 1 — Agregar buildGenreAffinity a backend/src/services/scoring.js
La función recibe: Array de { genres: string[], action: "like"|"dislike" }
Retorna: { "Sci-Fi": 1.44, "Drama": 0.96 } — solo géneros con ≥5 swipes.
Fórmula multiplicador: 0.8 + (likes/total) * 0.8  → rango 0.8–1.6
Actualizar module.exports para incluir buildGenreAffinity:
  module.exports = { normalize, computeScore, scoreCandidates: computeScore, buildGenreAffinity }

TAREA 2 — Agregar campo titleLower a los payloads de ingest
En ingest/src/tmdb_ingest.py: agregar "titleLower": (details.get("title") or "").lower()
En el script de libros: mismo patrón con el campo de título correspondiente.
Esto habilita las range queries de Firestore para el buscador de contenido (Luis lo necesita).

TAREA 3 — Agregar skip de reimport a ingest/tmdb_ingest.py
Al inicio del script: consultar Firestore por IDs ya presentes con syncedAt > hace 7 días.
Skip silencioso (sin error) si el externalId ya existe y es reciente.

TAREA 4 — Tests de buildGenreAffinity en backend/tests/
- Input: 10 swipes de "Sci-Fi" (8 likes, 2 dislikes) → affinity["Sci-Fi"] ≈ 1.44
- Input: < 5 swipes de "Drama" → "Drama" NO aparece en el resultado
```

### ✅ Checklist Fase 2

- [ ] Ingest ejecutado en **producción** (no emulador) — ≥500 docs en `content` prod
- [x] `backend/src/services/scoring.js` — agrega `buildGenreAffinity` (NO reescribir `computeScore`)
- [x] `module.exports` incluye `buildGenreAffinity` en el mismo archivo
- [x] `ingest/src/tmdb_ingest.py` — campo `titleLower` en payload de película
- [x] Libros ingest — campo `titleLower` en payload de libro (`ingest/src/models.py` → `to_firestore_dict`)
- [x] Tests de `buildGenreAffinity` passing (6/6)
- [x] Skip de reimport (7 días) — `ingest/src/tmdb_ingest.py`
