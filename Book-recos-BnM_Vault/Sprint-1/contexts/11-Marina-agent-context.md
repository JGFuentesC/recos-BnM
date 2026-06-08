---
persona: "Marina García del Buey"
wave: 3
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Marina García (Wave 3 — DetailSheet)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Crea `DetailSheet.jsx` como componente **100% standalone**. Monserrat lo integra en SwipeDeck — NO toques SwipeDeck.jsx directamente.  
> → Ver [[Sprint-1/11-Marina-Garcia|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
frontend/src/components/DetailSheet.jsx
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Acción |
|---|---|---|
| `frontend/package.json` | Andrés González | Coordinar si necesitas agregar una dep nueva |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx                      ← Andrés
frontend/src/pages/Feed.jsx               ← Monserrat
frontend/src/components/SwipeDeck.jsx     ← Monserrat (ella integra tu DetailSheet)
frontend/src/components/ContentCard.jsx   ← Edgar (solo importar props como referencia)
frontend/src/components/TabSelector.jsx   ← Juan Carlos
frontend/src/contexts/AuthContext.jsx     ← Andrés (solo importar useAuth())
frontend/src/pages/Library.jsx            ← Diana
backend/**                               ← otros colaboradores
ingest/**                                ← Manuel
firestore.rules                          ← Israel
.github/workflows/**                     ← Germán
```

---

## ⚠️ Notas especiales

- Tu tarea de integración (TAREA 2 del prompt) dice "Integrar en SwipeDeck". En realidad, esto es tarea de Monserrat. Tu entrega es el componente standalone + las props necesarias.
- Coordinar con Monserrat: cuando tu componente esté listo, ella lo importa en SwipeDeck.jsx.
- `watchProviders: []` → mostrar "No hay información de streaming disponible". Nunca inventar.
- La atribución de TMDB es obligatoria. Ver [[09_Risk_Governance/TMDB_Compliance|TMDB Compliance]].

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-marina-detail-sheet.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Marina García del Buey"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-3, frontend, detail]
---

# DevLog — YYYY-MM-DD — UI DetailSheet

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** frontend/src/components/DetailSheet.jsx
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Marina

## Próximos pasos para el siguiente colaborador
- Monserrat debe importar DetailSheet en SwipeDeck.jsx
- Props de DetailSheet: {contentId, isOpen, onClose, onSaved, onDislike}
- Notificar a Monserrat cuando el componente esté listo para integración
```
