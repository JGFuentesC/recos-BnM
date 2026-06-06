---
persona: "Christian Ruiz Hurtado"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Christian Ruiz (Wave 2 — /collections CRUD completo)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tienes el CRUD completo de `/api/collections` incluyendo el GET (confirmado por Eduardo el 2026-06-05).  
> → Ver [[Sprint-1/06-Christian-Ruiz|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
backend/src/routes/collections.js
backend/tests/collections.test.js
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
backend/src/routes/content.js      ← Héctor
backend/src/services/scoring.js    ← Manuel
frontend/**                        ← otros colaboradores
ingest/**                          ← Manuel
firestore.rules                    ← Israel
.github/workflows/**               ← Germán
```

---

## ⚠️ Notas especiales

- Eres dueño del CRUD completo: GET, POST, PATCH, DELETE de `/api/collections`.
- Diana (Biblioteca) depende de tu `GET /api/collections`. Es bloqueante para ella.
- Marina (DetailSheet) depende de tu `POST /api/collections` para el botón "Guardar".
- Implementar la verificación de duplicados en el POST (mismo contentId + userId ya existente).

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-christian-collections-api.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Christian Ruiz Hurtado"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, backend, collections]
---

# DevLog — YYYY-MM-DD — API CRUD /collections

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** backend/src/routes/collections.js, backend/tests/collections.test.js
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Christian

## Próximos pasos para el siguiente colaborador
- Diana puede consumir GET /api/collections para la Biblioteca
- Marina puede consumir POST /api/collections para guardar desde DetailSheet
- Endpoints: GET, POST, PATCH /:id, DELETE /:id en /api/collections
```
