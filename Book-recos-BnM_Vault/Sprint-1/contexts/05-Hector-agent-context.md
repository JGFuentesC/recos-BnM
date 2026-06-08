---
persona: "Héctor Morales Marbán"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Héctor Morales (Wave 2 — /content/{id})

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu dominio es solo `backend/src/routes/content.js`. **NO toques app.js** — Andrés ya registró tu ruta.  
> → Ver [[Sprint-1/05-Hector-Morales|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
backend/src/routes/content.js
backend/tests/content.test.js
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `backend/package.json` | Andrés González | Coordinar si necesitas agregar deps |

---

## 🔴 Archivos PROHIBIDOS

```
backend/src/app.js                 ← Andrés (ya registró tu ruta — NO modificar)
backend/src/middleware/auth.js     ← Andrés (solo importar)
backend/src/routes/feed.js         ← Luis
backend/src/routes/swipe.js        ← Luis
backend/src/routes/collections.js  ← Christian
backend/src/services/scoring.js    ← Manuel
frontend/**                        ← otros colaboradores
ingest/**                          ← Manuel
firestore.rules                    ← Israel
.github/workflows/**               ← Germán
```

---

## ⚠️ Notas especiales

- **app.js ya existe** (Andrés lo crea en Wave 1): `app.use('/api/content', require('./routes/content'))` ya está ahí.
- `GET /api/collections` NO es tu endpoint. Fue reasignado a Christian Ruiz (ver [[Sprint-1/06-Christian-Ruiz|06-Christian-Ruiz]]).
- Siempre incluir el campo `attribution` si `source === "tmdb"`. Requerimiento de TMDB Compliance.
- `watchProviders` siempre devolver como array, nunca undefined o null.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-hector-content-api.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Héctor Morales Marbán"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, backend, content]
---

# DevLog — YYYY-MM-DD — API GET /content/{id}

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** backend/src/routes/content.js, backend/tests/content.test.js
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Héctor

## Bloqueantes encontrados
- ...

## Próximos pasos para el siguiente colaborador
- Marina puede consumir GET /api/content/:id para el DetailSheet
- Formato de respuesta: {contentId, type, title, cover, year, genres, synopsis, rating, watchProviders, source, attribution?}
```
