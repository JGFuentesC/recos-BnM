---
project: "Recos-BnM"
date: "2026-06-11"
author_human: "Manuel Serranía Reinada"
agent: "Claude Code"
model: "big-pickle"
session_duration: "2h"
tags: [devlog, sprint-1, phase-2, ingest, scoring]
---

# DevLog — 2026-06-11 — Phase 2: buildGenreAffinity + titleLower + skip reimport

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo

### Tarea 1 — `buildGenreAffinity` en scoring.js
- Agregada función que calcula multiplicadores de afinidad por género a partir del historial de swipes
- Fórmula: `0.8 + (likes/total) * 0.8` → rango 0.8–1.6
- Solo incluye géneros con ≥5 swipes
- Exportada junto con `normalize`, `computeScore`, `scoreCandidates`

### Tarea 2 — `titleLower` en payloads de ingest
- `ingest/src/tmdb_ingest.py`: agregado campo `titleLower` en `movie_payload`
- `ingest/src/models.py`: agregado campo `titleLower` en `to_firestore_dict()` (cubre ambos tipos: movies y books, pipeline nuevo vía `main.py`)

### Tarea 3 — Skip de reimport
- `ingest/src/tmdb_ingest.py`: query a Firestore por docs con `updated_at` >= 7 días, salta esos IDs silenciosamente

### Tarea 4 — Tests
- `backend/tests/scoring.test.js`: 6 tests para `buildGenreAffinity` (todos passing)

### Fix adicional — config.py
- `ingest/src/config.py`: `load_dotenv()` ahora carga siempre `ingest/.env` por ruta absoluta, independiente del CWD desde donde se ejecute el script

## Archivos modificados
- `backend/src/services/scoring.js` — +buildGenreAffinity
- `ingest/src/tmdb_ingest.py` — +titleLower + skip reimport + datetime imports
- `ingest/src/models.py` — +titleLower en to_firestore_dict
- `ingest/src/config.py` — ruta fija a ingest/.env
- `Book-recos-BnM_Vault/Sprint-1/03-Manuel-Serrania.md` — checklist actualizado

## Archivos creados
- `backend/tests/scoring.test.js` — 6 tests de buildGenreAffinity

## 🤖 Sesión de IA
- **Agente:** Claude Code (big-pickle)
- **Decisiones autónomas del agente:**
  - `titleLower` para libros se agregó en `models.py` en lugar de `books_ingest.py` porque `books_ingest.py` no escribe a Firestore directamente (lo hace `main.py` → `FirestoreClient.batch_upsert()`)
  - Skip de reimport usa `updated_at` (campo existente en docs del legacy path) en lugar de `syncedAt` (que no está en el payload de `tmdb_ingest.py`)
- **Correcciones manuales:** ninguna

## Bloqueantes encontrados
- Los tests existentes (`feed`, `swipe`, `collections`) ya fallaban antes de estos cambios por mocks desactualizados. No hay regresiones.

## Próximos pasos para el siguiente colaborador
- **Luis Téllez:** puede importar `buildGenreAffinity` desde `scoring.js` e integrarlo en `GET /api/feed`
- **Germán Pacheco:** generar service account key de producción para `ingest/serviceAccountKey.json`
- **Israel Pérez:** desplegar índices de Firestore (swipes + titleLower)
- **Juan Carlos:** rotar API keys y compartir nuevos valores
- Para producción: comentar `FIRESTORE_EMULATOR_HOST` en `ingest/.env`, luego ejecutar `python src/main.py`
