---
persona: "Israel Pérez García"
wave: 0
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Israel Pérez (Wave 0 — Schema)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu trabajo es el **camino crítico**: sin el schema, nadie puede avanzar.  
> → Ver [[Sprint-1/01-Israel-Perez|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
firestore.rules
firestore.indexes.json
firebase.json
docs/SCHEMA.md
```

Estos 4 archivos son tu responsabilidad exclusiva. Todos los demás los esperan.

---

## 🟡 Archivos COMPARTIDOS (modificar solo si es estrictamente necesario)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `README.md` | Germán Pacheco | Solo agregar la sección "## Firestore Schema" con link a docs/SCHEMA.md |
| `.gitignore` | Germán Pacheco | Solo si el emulador genera archivos temporales que deban ignorarse |

---

## 🔴 Archivos PROHIBIDOS (no tocar bajo ninguna circunstancia)

```
backend/src/**                ← Luis, Héctor, Christian, Andrés
frontend/src/**               ← Andrés, Edgar, Juan Carlos, Monserrat, Marina, Diana
ingest/**                     ← Manuel
.github/workflows/**          ← Germán
```

Si crees que necesitas modificar un archivo de otra persona, crea un issue en GitHub y menciona a esa persona.

---

## ⚠️ Notas especiales

- `firestore.rules` es un archivo de seguridad crítico. Cualquier modificación posterior a tu entrega requiere aprobación de Eduardo.
- Los cambios a `firestore.indexes.json` requieren notificar al equipo porque impactan costos de Firestore.
- El emulador local NO afecta producción — trabaja siempre contra él.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-israel-schema.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Israel Pérez García"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-0, schema]
---

# DevLog — YYYY-MM-DD — Schema Firestore + Emulador

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista de los 4 archivos]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Israel

## Bloqueantes encontrados
- ...

## Próximos pasos para el siguiente colaborador
- Andrés y Manuel pueden iniciar (Wave 1)
- El emulador corre en: firebase emulators:start
- Ver docs/SCHEMA.md para los campos exactos de cada colección
```

Luego agregar la entrada a `DevLog/DevLog_Index.md`.
