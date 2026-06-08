---
persona: "Manuel Serranía Reinada"
wave: 1
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Manuel Serranía (Wave 1 — Ingest + Scoring)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu dominio es `ingest/` y `backend/src/services/`. No tienes acceso al frontend ni a las rutas del backend.  
> → Ver [[Sprint-1/03-Manuel-Serrania|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
ingest/tmdb_ingest.py
ingest/books_ingest.py
ingest/Dockerfile
ingest/requirements.txt
ingest/.env.example
backend/src/services/scoring.js
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `README.md` | Germán Pacheco | Solo agregar la sección "## Ingest Job" con instrucciones de ejecución |
| `backend/package.json` | Andrés González | Coordinar si necesitas agregar dependencias al backend |

---

## 🔴 Archivos PROHIBIDOS

```
firestore.rules                     ← Israel
firestore.indexes.json              ← Israel
firebase.json                       ← Israel
backend/src/app.js                  ← Andrés
backend/src/middleware/**           ← Andrés
backend/src/routes/**               ← Luis / Héctor / Christian
frontend/**                         ← Andrés / Edgar / Juan Carlos / Monserrat / Marina / Diana
.github/workflows/**                ← Germán
```

---

## ⚠️ Notas especiales

- El emulador de Firestore corre en `localhost:8080`. Configurar `FIRESTORE_EMULATOR_HOST=localhost:8080` en el `.env` del ingest.
- **No escribir directamente a producción** — solo al emulador durante desarrollo.
- `scoring.js` solo exporta `scoreCandidates(items)`. No tiene efectos secundarios ni escribe a Firestore.
- Las API keys de TMDB y Google Books van en `ingest/.env`, NUNCA en el código.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-manuel-ingest.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Manuel Serranía Reinada"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-1, ingest]
---

# DevLog — YYYY-MM-DD — Ingest TMDB/Books + scoring.js

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista completa]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Manuel

## Bloqueantes encontrados
- ...

## Próximos pasos para el siguiente colaborador
- Luis puede usar scoring.js desde: backend/src/services/scoring.js
- La colección content/ tiene X docs en el emulador (captura de pantalla en el PR)
- Formato del doc de content: ver docs/SCHEMA.md
```
