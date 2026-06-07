# Correcciones — Manuel Serranía Reinada
**Sprint 1 | Wave 1 | Auditoría: 2026-06-06**

---

## Resumen ejecutivo

Manuel entregó el trabajo más completo del sprint hasta ahora: pipeline de ingest funcional con 550 ítems, 30 tests, scoring, documentación extensa y un README detallado. Sin embargo hay 5 problemas que deben corregirse antes de que el resto del equipo pueda consumir sus datos, siendo el más crítico que los nombres de campo en `models.py` no coinciden con el PRD.

| # | Archivo | Estado | Severidad |
|---|---|---|---|
| 1 | `ingest/src/models.py` | ❌ Nombres de campos incorrectos | **Crítica** |
| 2 | `ingest/tests/test_tmdb_ingest.py` | ❌ Tests verifican campos con nombre incorrecto | Alta |
| 3 | `api/src/services/scoring.js` | ⚠️ Ruta y nombre de función incorrectos | Alta |
| 4 | `ingest/src/tmdb_ingest.py` | ⚠️ Región de watchProviders es US en vez de MX | Media |
| 5 | Cloud Scheduler | ❌ No configurado ni documentado | Media |
| 6 | DevLog | ❌ No entregado | Baja |

> **Dependencia:** Las correcciones de `models.py` deben hacerse **después** de que Israel mergee el SCHEMA.md corregido. Los nombres correctos están definidos en ese archivo.

---

## Finding 1 — `models.py` usa nombres de campos distintos al PRD ⚠️ CRÍTICO

**Qué se entregó:**

```python
# Dataclass ContentItem — campos actuales (incorrectos)
posterUrl: str = ""           # ← debería ser `cover`
description: str = ""        # ← debería ser `synopsis`
whereToWatch: list[str]       # ← debería ser `watchProviders`
```

**Impacto:** Los 550 documentos escritos en Firestore tienen las claves `posterUrl`, `description` y `whereToWatch`. Cuando Héctor, Edgar, Marina y Diana lean esos documentos buscando `cover`, `synopsis` y `watchProviders`, encontrarán `undefined`/`null`. Imágenes rotas, sinopsis vacías, plataformas de streaming ausentes en toda la app.

**Por qué pasó:** Manuel siguió el SCHEMA.md de Israel, que también tiene los nombres incorrectos. Es una deuda en cadena.

---

### Prompt para Claude Code — Corrección 1

```
⚠️ ANTES DE EMPEZAR: Lee src/firestore/SCHEMA.md (versión corregida por Israel)
para confirmar los nombres de campo correctos antes de modificar nada.
Solo puedes modificar archivos dentro de ingest/

El dataclass ContentItem en ingest/src/models.py usa nombres de campos que
no coinciden con el PRD §6. Necesito renombrarlos para que los documentos
escritos en Firestore tengan los nombres que esperan todos los compañeros.

TAREA 1 — Renombrar campos en el dataclass ContentItem (ingest/src/models.py):

  Cambios requeridos:
    posterUrl    → cover
    description  → synopsis
    whereToWatch → watchProviders

  Actualizar TODOS los lugares donde aparecen estos nombres:
  a) La definición del dataclass (las 3 líneas con los campos)
  b) El método from_tmdb(): cambiar los keyword arguments
  c) El método from_google_books(): cambiar los keyword arguments
  d) El método to_firestore_dict(): confirmar que las claves del dict resultante
     son "cover", "synopsis", "watchProviders" (puede ser implícito via asdict())

TAREA 2 — Verificar con un ejemplo:
  Crear un ContentItem de prueba y llamar a to_firestore_dict().
  Confirmar que el dict resultante contiene las claves:
    "cover", "synopsis", "watchProviders"
  y NO contiene:
    "posterUrl", "description", "whereToWatch"

Muéstrame el dataclass completo con los nombres corregidos y el output del ejemplo.

IMPORTANTE: Después de mergear estos cambios es obligatorio volver a correr el
ingest (python ingest/src/main.py) para sobreescribir los documentos en Firestore
con los nombres de campo correctos. Agregar esta instrucción al PR.
```

---

## Finding 2 — Tests de `test_tmdb_ingest.py` verifican campos con nombre incorrecto

**Qué se entregó:** 19 tests en `test_tmdb_ingest.py` que verifican explícitamente:

```python
assert item.posterUrl == "https://image.tmdb.org/t/p/w500/..."
assert item.description == "A ticking time bomb of a movie."
assert item.whereToWatch == ["Netflix", "Amazon Prime"]
```

**Impacto:** Cuando se corrija `models.py` (Finding 1), **todos estos tests van a fallar**. Hay que actualizarlos al mismo tiempo que se corrige el modelo.

---

### Prompt para Claude Code — Corrección 2

```
⚠️ ANTES DE EMPEZAR: Realiza primero la Corrección 1 (renombrar campos en models.py).
Solo puedes modificar ingest/tests/test_tmdb_ingest.py

Los tests de test_tmdb_ingest.py verifican los nombres de campo viejos (posterUrl,
description, whereToWatch). Ahora que models.py usa los nombres correctos del PRD,
los tests deben actualizarse para que sigan pasando.

TAREA — En ingest/tests/test_tmdb_ingest.py, reemplazar todas las referencias
a los nombres viejos por los nuevos:

  Reemplazos necesarios:
    item.posterUrl    → item.cover
    item.description  → item.synopsis
    item.whereToWatch → item.watchProviders
    d["posterUrl"]    → d["cover"]       (si aparece en to_firestore_dict tests)
    d["description"]  → d["synopsis"]
    d["whereToWatch"] → d["watchProviders"]

Después de los reemplazos, ejecutar los tests y confirmar que todos pasan:
  cd ingest && python -m pytest tests/test_tmdb_ingest.py -v

Muéstrame el output de pytest con todos los tests en verde.
```

---

## Finding 3 — `scoring.js` está en la ruta incorrecta y exporta el nombre incorrecto

**Qué se entregó:**
- Ruta actual: `api/src/services/scoring.js`
- Función exportada: `computeScore(items, genreAffinity?)`

**Qué necesita Luis:**
- Ruta esperada: `backend/src/services/scoring.js`
- Función esperada: `scoreCandidates(items)`

**Impacto adicional:** `ingest/tests/test_scoring.py` tiene hardcodeada la ruta `api/src/services/scoring.js` — si se mueve el archivo sin actualizar el test, los 11 tests de scoring fallarán.

---

### Prompt para Claude Code — Corrección 3

```
⚠️ ANTES DE EMPEZAR: Puedes leer api/src/services/scoring.js y crear/modificar
backend/src/services/scoring.js e ingest/tests/test_scoring.py

Hay dos problemas con el módulo de scoring que impedirán que Luis lo use:

PROBLEMA 1 — Ruta incorrecta:
  Existe en:     api/src/services/scoring.js
  Luis lo busca: backend/src/services/scoring.js

  TAREA: Verificar si existe la carpeta backend/src/services/.
  - Crearla si no existe: mkdir -p backend/src/services
  - Crear backend/src/services/scoring.js con exactamente el mismo contenido
    que api/src/services/scoring.js

PROBLEMA 2 — Nombre de función incorrecto:
  El archivo exporta: module.exports = { normalize, computeScore }
  El vault especifica la función como: scoreCandidates(items)

  TAREA: En backend/src/services/scoring.js, modificar la última línea para
  agregar el alias manteniendo compatibilidad con computeScore:

    module.exports = { normalize, computeScore, scoreCandidates: computeScore };

PROBLEMA 3 — test_scoring.py apunta a la ruta vieja:
  La línea SCORING_JS en test_scoring.py apunta a "api/src/services/scoring.js".
  Si el scoring canónico ahora vive en backend/, actualizar esa constante:

    SCORING_JS = os.path.join(REPO_ROOT, "backend", "src", "services", "scoring.js")

TAREA FINAL — Verificar que todo funciona:
  1. Desde la raíz del repo, ejecutar:
     node -e "const { scoreCandidates } = require('./backend/src/services/scoring');
     const r = scoreCandidates([
       { popularity: 200, rating: 7.0, genres: ['Comedy'] },
       { popularity: 100, rating: 8.0, genres: ['Action'] },
       { popularity: 50,  rating: 9.0, genres: ['Drama']  }
     ]);
     console.log(r.map(i => i.score.toFixed(3)));"

  2. Ejecutar los tests de scoring:
     cd ingest && python -m pytest tests/test_scoring.py -v

Muéstrame el output de ambas verificaciones.
```

---

## Finding 4 — Región de `watchProviders` es US en vez de MX

**Qué se entregó:** `get_watch_providers` en `tmdb_ingest.py` busca en este orden:
```python
for region in ("US", "CA", "GB"):
```

**Qué dice el PRD §4:** La app es para México. Los proveedores deben ser los disponibles en MX (Netflix MX, Claro Video, Star+, etc.).

**Impacto:** Los watchProviders que se muestran en el DetailSheet son de Estados Unidos, no de México. El usuario ve plataformas que no están disponibles en su país.

---

### Prompt para Claude Code — Corrección 4

```
⚠️ ANTES DE EMPEZAR: Solo puedes modificar ingest/src/tmdb_ingest.py

En el método get_watch_providers de TMDBClient, el orden de búsqueda de regiones
no prioriza México. Necesito corregirlo para que MX sea la primera opción.

TAREA — Encontrar esta línea en get_watch_providers:
  for region in ("US", "CA", "GB"):

Cambiarla a:
  for region in ("MX", "US", "CA", "GB"):

Esto garantiza que si hay providers para MX se usan primero. Si no hay datos
para MX (que es posible para algunas películas), hace fallback a US como respaldo.

Muéstrame el método get_watch_providers completo después del cambio.
```

---

## Finding 5 — Cloud Scheduler no configurado ni documentado

**Qué falta:** El cron `0 4 * * *` para sincronización diaria no está creado en GCP ni hay instrucciones para el PM (Edgar Coronel) sobre cómo activarlo.

**Impacto:** En producción el catálogo nunca se actualiza automáticamente.

---

### Prompt para Claude Code — Corrección 5

```
⚠️ ANTES DE EMPEZAR: Solo puedes crear el archivo ingest/DEPLOY.md

Crea ingest/DEPLOY.md con las instrucciones de despliegue del job en Cloud Run
y la configuración del Cloud Scheduler para el PM (Edgar Coronel).

TAREA — Crear ingest/DEPLOY.md con este contenido:

# Despliegue del Job de Ingest — Cloud Run + Cloud Scheduler

## Requisitos previos
- `gcloud` CLI instalado y autenticado (`gcloud auth login`)
- Proyecto activo: `recos-bnm`
- APIs habilitadas: Cloud Run Jobs, Cloud Scheduler, Artifact Registry

---

## Paso 1 — Build y push de imagen Docker

```bash
# Desde la raíz del repo
gcloud builds submit ingest/ \
  --tag gcr.io/recos-bnm/ingest-job \
  --project recos-bnm
```

---

## Paso 2 — Crear el Cloud Run Job

```bash
gcloud run jobs create ingest-job \
  --image gcr.io/recos-bnm/ingest-job \
  --region us-central1 \
  --project recos-bnm \
  --set-env-vars TMDB_API_KEY=<TMDB_KEY>,GOOGLE_BOOKS_API_KEY=<BOOKS_KEY>,FIRESTORE_PROJECT_ID=recos-bnm \
  --service-account ingest-sa@recos-bnm.iam.gserviceaccount.com \
  --max-retries 2 \
  --task-timeout 3600
```

> Para actualizar el job tras un nuevo build:
> `gcloud run jobs update ingest-job --image gcr.io/recos-bnm/ingest-job --region us-central1`

---

## Paso 3 — Configurar Cloud Scheduler (cron diario 4 AM México)

```bash
gcloud scheduler jobs create http sync-catalogo-diario \
  --schedule "0 4 * * *" \
  --time-zone "America/Mexico_City" \
  --location us-central1 \
  --project recos-bnm \
  --uri "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/recos-bnm/jobs/ingest-job:run" \
  --http-method POST \
  --oauth-service-account-email ingest-sa@recos-bnm.iam.gserviceaccount.com
```

---

## Paso 4 — Ejecutar manualmente para verificar

```bash
gcloud run jobs execute ingest-job --region us-central1 --project recos-bnm

# Ver logs
gcloud logging read \
  "resource.type=cloud_run_job AND resource.labels.job_name=ingest-job" \
  --limit 50 --project recos-bnm
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `TMDB_API_KEY` | API Key de themoviedb.org |
| `GOOGLE_BOOKS_API_KEY` | API Key de Google Books |
| `FIRESTORE_PROJECT_ID` | `recos-bnm` |

Muéstrame el archivo DEPLOY.md terminado.
```

---

## Finding 6 — DevLog no entregado

**Qué falta:** El archivo `DevLog/YYYY-MM-DD-manuel-ingest.md` y la entrada en `DevLog_Index.md`.

---

### Prompt para Claude Code — Corrección 6

```
⚠️ ANTES DE EMPEZAR: Solo puedes crear archivos en Book-recos-BnM_Vault/DevLog/

Crea Book-recos-BnM_Vault/DevLog/2026-06-05-manuel-ingest.md con:

---
project: "Recos-BnM"
date: "2026-06-05"
author_human: "Manuel Serranía Reinada"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[modelo usado]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-1]
---

## Qué se hizo
- Pipeline de ingest: tmdb_ingest.py (300 películas) + books_ingest.py (250 libros)
- Modelo ContentItem con factories from_tmdb() y from_google_books()
- Módulo scoring.js: 0.7·norm(popularity) + 0.3·norm(rating) con boost por afinidad
- 30 tests cubriendo modelos y fórmula de scoring
- Dockerfile + requirements.txt + .env.example
- README.md con instrucciones de uso
- Total: 550 documentos en colección content del emulador

## 🤖 Sesión de IA
[Agente usado, archivos que tocó el agente, decisiones autónomas, correcciones aplicadas]

## Bloqueantes
- models.py usa posterUrl/description/whereToWatch en vez de cover/synopsis/watchProviders
  (siguió el SCHEMA.md de Israel que también tenía los nombres incorrectos)
- scoring.js está en api/ en vez de backend/ y se llama computeScore en vez de scoreCandidates
- Cloud Scheduler no configurado en GCP
- Región de watchProviders es US en vez de MX

## Próximos pasos para el siguiente colaborador
- Esperar merge del SCHEMA.md corregido de Israel
- Corregir nombres de campos en models.py y volver a correr ingest
- Mover/copiar scoring.js a backend/src/services/ con alias scoreCandidates
- Configurar Cloud Scheduler con DEPLOY.md incluido en este PR

Luego agrega la entrada a Book-recos-BnM_Vault/DevLog/DevLog_Index.md en la tabla.
```

---

## Orden recomendado de correcciones

```
1. Esperar merge del SCHEMA.md de Israel (define los nombres correctos)
2. Corrección 1: Renombrar campos en models.py
3. Corrección 2: Actualizar tests de test_tmdb_ingest.py (mismo PR que Corrección 1)
4. Corrección 4: Cambiar región a MX en tmdb_ingest.py (mismo PR)
5. Volver a correr el ingest → python ingest/src/main.py (actualiza Firestore)
6. Corrección 3: Copiar scoring.js a backend/ con alias scoreCandidates
7. Corrección 5: Crear DEPLOY.md
8. Corrección 6: Crear DevLog
```

---

## ✅ Checklist de entrega corregida

- [ ] `ingest/src/models.py` — campos `cover`, `synopsis`, `watchProviders` (nombres correctos)
- [ ] `ingest/tests/test_tmdb_ingest.py` — tests actualizados a los nombres nuevos (todos en verde)
- [ ] `backend/src/services/scoring.js` — ruta correcta + alias `scoreCandidates` exportado
- [ ] `ingest/tests/test_scoring.py` — SCORING_JS apunta a `backend/src/services/scoring.js`
- [ ] `ingest/src/tmdb_ingest.py` — región `MX` como primera opción en watchProviders
- [ ] Ingest vuelto a correr → Firestore con ≥500 docs con nombres de campo correctos
- [ ] `ingest/DEPLOY.md` — instrucciones de Cloud Scheduler para el PM
- [ ] `DevLog/2026-06-05-manuel-ingest.md` — DevLog de la sesión
- [ ] PR abierto con nota: **"Re-correr ingest obligatorio después de merge para actualizar campos en Firestore"**
