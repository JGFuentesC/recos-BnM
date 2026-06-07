---
project: "Recos-BnM"
date: "2026-06-05"
author_human: "Manuel Serranía Reinada"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "estimado"
tags: [devlog, sprint-1, wave-1]
---

# DevLog — 2026-06-05 — Pipeline de Ingest + Scoring

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- Pipeline de ingest: tmdb_ingest.py (300 películas) + books_ingest.py (250 libros)
- Modelo ContentItem con factories from_tmdb() y from_google_books()
- Módulo scoring.js: 0.7·norm(popularity) + 0.3·norm(rating) con boost por afinidad
- 30 tests cubriendo modelos y fórmula de scoring
- Dockerfile + requirements.txt + .env.example
- README.md con instrucciones de uso
- Total: 550 documentos en colección content del emulador

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** ingest/ completo (models.py, tmdb_ingest.py, books_ingest.py, main.py, firestore_client.py, config.py, query_content.py, Dockerfile, requirements.txt, tests/)
- **Decisiones autónomas del agente:** N/A
- **Correcciones manuales:** Ver Correcciones-Manuel.md — 6 hallazgos identificados en auditoría posterior

## Correcciones aplicadas (2026-06-06)
- `models.py`: `posterUrl→cover`, `description→synopsis`, `whereToWatch→watchProviders`
- `models.py`: `to_firestore_dict()` ya no serializa `syncedAt` como string (se queda como datetime → Timestamp Firestore)
- `models.py`: eliminado `"series"` de `ContentType`
- `test_tmdb_ingest.py`: 14 asserts actualizados a los nuevos nombres de campo
- `backend/src/services/scoring.js`: creado con alias `scoreCandidates`
- `test_scoring.py`: `SCORING_JS` apunta a `backend/`; test nuevo para `scoreCandidates`
- `tmdb_ingest.py`: región MX como primera opción en watchProviders
- `ingest/DEPLOY.md`: instrucciones para Cloud Scheduler

## Pendiente
- Re-ejecutar el ingest (`cd ingest && python src/main.py`) para sobreescribir los 550+ docs en Firestore con los nombres de campo correctos. Requiere API keys + emulador.
- Configurar Cloud Scheduler en GCP (pasos en `ingest/DEPLOY.md`, responsabilidad del PM).
