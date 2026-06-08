---
project: "Recos-BnM"
date: "2026-06-07"
author_human: "Luis Téllez Domínguez"
agent: "Claude Code"
model: "claude-sonnet-4-5"
session_duration: "1h"
tags: [devlog, sprint-1, wave-2, backend, feed, swipe]
---

# DevLog — 2026-06-07 — API /feed + /swipe

→ [Volver al DevLog Index](DevLog_Index.md)

## Qué se hizo

- Implementado `GET /api/feed` con paginación por cursor, scoring con afinidad de géneros y exclusión de contenido ya swipeado
- Implementado `POST /api/swipe` → HTTP 204, guardando en Firestore con `serverTimestamp`
- Registradas ambas rutas en `backend/src/app.js` (2 líneas antes de `app.listen`)
- Agregados Jest + supertest como devDependencies en `backend/package.json`
- Creados tests con mocks de Firestore y auth: 5 casos para feed, 6 para swipe
- Creado `.env` local apuntando al emulador Firebase

## 🤖 Sesión de IA

- **Agente:** Claude Code (claude-sonnet-4-5)
- **Archivos creados:** `feed.js`, `swipe.js`, `feed.test.js`, `swipe.test.js`, `.env`
- **Archivos modificados:** `app.js` (2 líneas), `package.json` (jest + supertest + script test)
- **Decisiones autónomas del agente:**
  - Construir `genreAffinity` como `{ [genre]: 1.2 }` para boost uniforme de preferencias
  - Usar índice numérico como cursor de paginación (simple y sin dependencia de Firestore cursors)
  - Tests auto-contenidos con mocks en memoria (sin emulador) para correr sin infraestructura
- **Correcciones manuales:** ninguna en esta sesión
- **Prompt inicial:** análisis previo del CLAUDE.md y diagnóstico del repo

## Bloqueantes encontrados

- `scoring.js` estaba en `api/src/services/` (no en `backend/`), ya resuelto por Manuel en PR #20
- `app.js` no tenía las rutas pre-registradas como indicaba la documentación original — se agregaron directamente
- Node.js no estaba en el PATH del entorno de CI local → pendiente instalar para correr tests

## Próximos pasos para el siguiente colaborador

- **Monserrat (SwipeDeck):** puede consumir `GET /api/feed` y `POST /api/swipe`
  - Feed: `GET /api/feed?userId=<uid>&type=movie&cursor=0` con header `Authorization: Bearer <token>`
  - Swipe: `POST /api/swipe` con body `{ userId, contentId, contentType, action }`
  - Formato de respuesta del feed: `[{ contentId, title, cover, genres, rating, synopsis, type }]`
  - Paginación: pasar `cursor=10` para la siguiente página, `cursor=20` para la siguiente, etc.
- **Andrés:** coordinar si `app.js` necesita más rutas (Imanol/Collections tiene el mismo bloqueante)
- Para correr los tests: `cd backend && npm install && npm test`
