---
persona: "Luis Téllez Domínguez"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Luis Téllez (Wave 2 — /feed + /swipe)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu dominio son los route files de feed y swipe. **NO toques app.js** — Andrés ya registró tus rutas en el scaffold.  
> → Ver [[Sprint-1/04-Luis-Tellez|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
backend/src/routes/feed.js
backend/src/routes/swipe.js
backend/tests/feed.test.js
backend/tests/swipe.test.js
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `backend/package.json` | Andrés González | Si necesitas una dep nueva (ej. paginación), coordinar con Andrés |

---

## 🔴 Archivos PROHIBIDOS

```
backend/src/app.js              ← Andrés (ya registró tus rutas — NO modificar)
backend/src/middleware/auth.js  ← Andrés (solo importar, no editar)
backend/src/services/scoring.js ← Manuel (solo importar, no editar)
backend/src/routes/content.js   ← Héctor
backend/src/routes/collections.js ← Christian
frontend/**                     ← otros colaboradores
ingest/**                       ← Manuel
firestore.rules                 ← Israel
.github/workflows/**            ← Germán
```

---

## ⚠️ Notas especiales

- **app.js ya existe** (creado por Andrés): `app.use('/api/feed', require('./routes/feed'))` ya está ahí. Solo crea `feed.js` y `swipe.js`.
- Si app.js NO existe aún: no lo crees tú. Habla con Andrés primero.
- Importar auth: `const auth = require('../middleware/auth')`
- Importar scoring: `const { scoreCandidates } = require('../services/scoring')`

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-luis-feed-api.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Luis Téllez Domínguez"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, backend, feed]
---

# DevLog — YYYY-MM-DD — API /feed + /swipe

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Luis

## Bloqueantes encontrados
- ...

## Próximos pasos para el siguiente colaborador
- Monserrat puede consumir GET /api/feed y POST /api/swipe
- Formato de respuesta del feed: [{contentId, title, cover, genres, rating, synopsis, type}]
- Paginación: usar parámetro cursor en la query
```
