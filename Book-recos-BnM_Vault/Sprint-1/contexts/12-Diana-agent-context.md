---
persona: "Diana Álvarez Varela"
wave: 4
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Diana Álvarez (Wave 4 — Biblioteca)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Crea los componentes de Biblioteca. **NO toques App.jsx** — Andrés ya tiene la ruta /library. **NO toques Feed.jsx** — es de Monserrat.  
> → Ver [[Sprint-1/12-Diana-Alvarez|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
frontend/src/pages/Library.jsx
frontend/src/components/CollectionItem.jsx
frontend/src/components/BottomNav.jsx
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Acción |
|---|---|---|
| `frontend/package.json` | Andrés González | Coordinar si necesitas agregar deps |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx              ← Andrés (ya tiene ruta /library y BottomNav en layout)
frontend/src/pages/Feed.jsx       ← Monserrat
frontend/src/components/SwipeDeck.jsx   ← Monserrat
frontend/src/components/DetailSheet.jsx ← Marina
frontend/src/components/ContentCard.jsx ← Edgar
frontend/src/components/TabSelector.jsx ← Juan Carlos
frontend/src/contexts/AuthContext.jsx   ← Andrés (solo importar useAuth())
backend/**                             ← otros colaboradores
ingest/**                              ← Manuel
firestore.rules                        ← Israel
.github/workflows/**                   ← Germán
```

---

## ⚠️ Notas especiales

- `GET /api/collections` ahora está asignado a **Christian Ruiz** (confirmado 2026-06-05). Espera que termine para reemplazar el mock.
- Tu componente `BottomNav.jsx` debe ser standalone. Andrés lo integrará en App.jsx o en el layout protegido.
- Si `BottomNav` no está en App.jsx todavía: coordinar con Andrés para que lo agregue.
- El mock de datos ya está definido en tu Sprint file — úsalo mientras Christian termina el GET.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-diana-biblioteca.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Diana Álvarez Varela"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-4, frontend, biblioteca]
---

# DevLog — YYYY-MM-DD — UI Biblioteca

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Diana

## Próximos pasos para el siguiente colaborador
- Ulises puede probar la vista de Biblioteca en el happy path
- Los mocks están en Library.jsx — reemplazar con GET /api/collections cuando Christian termine
```
