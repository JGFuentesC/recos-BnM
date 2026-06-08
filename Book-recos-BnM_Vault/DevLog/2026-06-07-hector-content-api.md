---
project: "Recos-BnM"
date: "2026-06-07"
author_human: "Héctor Morales Marbán"
agent: "Claude Code"
model: "claude-opus-4-8"
session_duration: "1h"
tags: [devlog, sprint-1, wave-2, backend, content]
---

# DevLog — 2026-06-07 — API GET /content/{id}

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- Implementado el endpoint `GET /api/content/:id` en `backend/src/routes/content.js`, protegido con `authMiddleware`.
- Lectura del documento `content/{id}` de Firestore con respuesta de campos en whitelist
  (`contentId, type, title, cover, year, genres, creator, synopsis, rating, watchProviders, source, attribution?`).
- Reglas de negocio / compliance aplicadas:
  - `watchProviders` siempre se devuelve como array (`[]` si falta) — nunca undefined/null.
  - Nunca se inventa disponibilidad de streaming: solo lo que está en Firestore.
  - Campo `attribution` añadido cuando `source === "tmdb"` (requisito TMDB).
- Tests creados en `backend/tests/content.test.js` (Jest + supertest, con mocks de `firebase/admin` y `auth`):
  401 sin token, 404 id inexistente, 200 objeto completo, no-exposición de campos internos,
  `watchProviders` siempre array (con valor y normalizado), `attribution` solo para TMDB, 400 id inválido.

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-opus-4-8)
- **Archivos creados/modificados:**
  - `backend/src/routes/content.js` (nuevo)
  - `backend/tests/content.test.js` (nuevo)
  - Merge Pull Request #29 a main: aceptado ✅
- **Decisiones autónomas del agente:**
  - Se incluyó el campo `creator` en la respuesta porque existe en `src/firestore/SCHEMA.md`
    (el prompt original del sprint lo omitía) y Marina lo necesita para el DetailSheet.
  - Validación de `:id` (rechazo de vacío o con `/`) para evitar path traversal a subcolecciones → 400 `invalid_id`.
  - Whitelist explícita de campos en la respuesta para no exponer `externalId`, `popularity`, `syncedAt`.
  - 500 con mensaje genérico; el detalle del error solo se loguea en servidor (no information disclosure).
- **Correcciones manuales:** ninguna.
- **Prompt inicial usado:** Sprint file de Héctor (`Sprint-1/05-Hector-Morales.md`) + agent-context.

## Bloqueantes encontrados y resueltos
- ✅ **Tooling de tests:** Andrés agregó `jest`, `supertest`, script `"test": "jest --runInBand --forceExit"`
  y config de Jest en `backend/package.json`. **RESUELTO.**
- ✅ **Ruta `/api/content` en app.js:** Agregada con condicional defensivo (fs.existsSync). **RESUELTO.**
- ✅ **Merge a main:** Pull Request #29 aceptado (commit f143f07). **RESUELTO.**

## Próximos pasos para el siguiente colaborador
- **Marina:** puede consumir `GET /api/content/:id` para el DetailSheet.
  - Formato de respuesta: `{contentId, type, title, cover, year, genres, creator, synopsis, rating, watchProviders, source, attribution?}`
  - `watchProviders` siempre es array (puede venir vacío); `attribution` solo aparece en items de TMDB.
- **Ulises:** verificar en Postman los casos 401 / 404 / 200 y que `watchProviders` nunca sea null.
