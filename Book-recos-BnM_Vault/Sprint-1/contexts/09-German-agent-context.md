---
persona: "Germán Pacheco Castillo"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Germán Pacheco (Wave 2 — CI/CD + Service Worker)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Eres el dueño del pipeline de CI/CD, el Service Worker, y el README.md del repo. También creas el CLAUDE.md del código.  
> → Ver [[Sprint-1/09-German-Pacheco|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
.github/workflows/deploy.yml
frontend/public/sw.js
frontend/public/manifest.json
README.md                        ← eres el dueño de este archivo en el repo de código
CLAUDE.md                        ← crear el CLAUDE.md del repo de código (no del vault)
frontend/.env.example
backend/.env.example
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Acción permitida |
|---|---|
| `frontend/src/main.jsx` | Solo agregar el registro del Service Worker al final. Coordinar con Andrés. |
| `firebase.json` | Solo si necesitas agregar configuración de hosting. Coordinar con Israel. |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx                      ← Andrés
frontend/src/components/**                ← Edgar / Juan Carlos / Monserrat / Marina
frontend/src/pages/**                     ← Juan Carlos / Monserrat / Marina / Diana
frontend/src/contexts/**                  ← Andrés / Juan Carlos
backend/src/routes/**                     ← Luis / Héctor / Christian
backend/src/middleware/**                 ← Andrés
backend/src/services/**                   ← Manuel
ingest/**                                 ← Manuel
firestore.rules                           ← Israel
firestore.indexes.json                    ← Israel
```

---

## ⚠️ Notas especiales

- **Objetivo inmediato:** "Hello World" desplegado en Firebase Hosting antes del sábado 7 de junio.
- El CLAUDE.md que creas es para el **repositorio de código** (no este vault). Debe incluir las reglas de gobernanza de IA, los comandos de setup, y un puntero a los AGENT_CONTEXT de cada persona.
- Los secrets de GitHub los configura Eduardo (PM). Tú solo documentas cuáles son necesarios en README.md.
- Nunca incluyas valores reales de secrets en ningún archivo del repo.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-german-cicd.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Germán Pacheco Castillo"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, cicd, pwa]
---

# DevLog — YYYY-MM-DD — CI/CD + Service Worker

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Germán

## Próximos pasos para el siguiente colaborador
- URL de Firebase Hosting: https://recos-bnm.web.app
- El pipeline se activa en cada push a main
- Para Ulises: la URL pública está lista para QA
```
