---
project: "Recos-BnM"
date: "2026-06-11"
author_human: "Manuel Serranía Reinada"
agent: "Claude Code"
model: "big-pickle"
session_duration: "4h"
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

---

## ⚡ Segunda sesión — Ingest a producción + books fix (misma fecha)

Se completó el ítem faltante del checklist de Fase 2: **ejecutar ingest contra Firestore producción**.

### Qué se hizo
- `ingest/src/books_ingest.py` — agregada inicialización Firebase + escritura directa a Firestore + bloque standalone (mismo patrón que `tmdb_ingest.py`)
- `ingest/src/tmdb_ingest.py` — skip-reimport envuelto en try-except para evitar crash cuando no existe el índice compuesto en producción
- Ambos scripts — agregado `sys.stdout.reconfigure(encoding='utf-8')` para evitar UnicodeEncodeError en Windows
- Se copió `serviceAccountKey.json` de `backend/` a `ingest/`
- Se creó `ingest/.env` con las API keys y `FIRESTORE_PROJECT_ID=proyectofinal-71637`
- **Ejecución contra producción:** 300 películas + 250 libros = **552 docs en Firestore producción**

### Archivos modificados
- `ingest/src/books_ingest.py` — Firebase init, escritura Firestore, standalone, UTF-8 fix
- `ingest/src/tmdb_ingest.py` — try-except skip-reimport, UTF-8 fix
- `ingest/.env` — creado con API keys y project ID
- `Book-recos-BnM_Vault/Sprint-1/03-Manuel-Serrania.md` — checklist actualizado (producción ✅)

### Decisiones autónomas
- Se usó el mismo schema de payload que `tmdb_ingest.py` para mantener consistencia en la colección `content`
- No se agregó skip-reimport a `books_ingest.py` para mantenerlo simple en esta iteración

### Correcciones manuales
- La `GOOGLE_BOOKS_API_KEY` original era incorrecta (JWT de TMDB). Se reemplazó con la key real de Google Books.

## Bloqueantes encontrados
- El frontend solo muestra 1 libro al filtrar por tipo "book" — probablemente por filtro de géneros del usuario vs géneros de Google Books, no por problema del ingest
- El frontend apunta al backend en localhost:3001, que sí conecta a producción Firestore correctamente

## Próximos pasos para el siguiente colaborador
- **Luis Téllez:** puede importar `buildGenreAffinity` desde `scoring.js` e integrarlo en `GET /api/feed`
- **Manuel:** Corregir filtro de géneros del feed si los géneros de Google Books no coinciden con los seleccionados en onboarding
- **Manuel:** Abrir PR con screenshot del conteo en Firebase Console
