---
persona: "Ulises Chaparro Ximello"
wave: 5
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Ulises Chaparro (Wave 5 — QA)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu rol es **QA + documentación**. **NUNCA modifiques código fuente**. Si encuentras un bug, crea un GitHub Issue.  
> → Ver [[Sprint-1/13-Ulises-Chaparro|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
docs/ROADMAP.md
docs/api-collection.json
```

Solo estos dos archivos. Tu trabajo es documentar y reportar, no codificar.

---

## 🟡 Archivos COMPARTIDOS

Ninguno. Solo lees el resto del código para pruebas.

---

## 🔴 Archivos PROHIBIDOS — TODO el código fuente

```
backend/**                 ← No modificar
frontend/**                ← No modificar
ingest/**                  ← No modificar
firestore.rules            ← No modificar
firestore.indexes.json     ← No modificar
firebase.json              ← No modificar
.github/workflows/**       ← No modificar
```

---

## ⚠️ Reglas de QA

1. **Si encuentras un bug:** Crea un GitHub Issue con la etiqueta `bug` y `sprint-1`. Describe: pasos para reproducir, resultado actual, resultado esperado.
2. **No fixes tú mismo el código** aunque sepas cómo. Asigna el issue a la persona responsable.
3. Usa la URL pública de Firebase Hosting que Germán proporcionó para las pruebas.
4. Para probar los endpoints directamente, usa la colección de `docs/api-collection.json`.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-ulises-qa.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Ulises Chaparro Ximello"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-5, qa]
---

# DevLog — YYYY-MM-DD — QA + Documentación final

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** docs/ROADMAP.md, docs/api-collection.json
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Ulises

## Resultado del happy path
- [ ] Login con Google ← Pass/Fail
- [ ] Onboarding 5 tarjetas ← Pass/Fail
- [ ] Feed con swipe ← Pass/Fail
- [ ] DetailSheet ← Pass/Fail
- [ ] Guardar → Biblioteca ← Pass/Fail

## Bugs encontrados
- [lista de issues creados en GitHub con sus URLs]
```
