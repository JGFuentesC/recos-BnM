---
persona: "Juan Carlos Macías Mayen"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Juan Carlos Macías (Wave 2 — Onboarding + TabSelector)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> `TabSelector.jsx` debe ser un componente **100% standalone**. NO integres en App.jsx ni en Feed.jsx — Monserrat lo importa.  
> → Ver [[Sprint-1/08-Juan-Carlos-Macias|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
frontend/src/pages/Onboarding.jsx
frontend/src/pages/Search.jsx
frontend/src/components/TabSelector.jsx
frontend/src/components/AppLayout.jsx   ← NUEVO Fase 2: wrapper global con BottomNav
frontend/src/contexts/FeedContext.jsx
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `frontend/package.json` | Andrés González | Coordinar si necesitas agregar deps |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx              ← Andrés (ya tiene la ruta /onboarding y FeedProvider)
frontend/src/pages/Feed.jsx       ← Monserrat (ella importa tu TabSelector)
frontend/src/contexts/AuthContext.jsx ← Andrés (solo importar useAuth())
frontend/src/components/ContentCard.jsx   ← Edgar
frontend/src/components/SwipeDeck.jsx     ← Monserrat
frontend/src/components/DetailSheet.jsx   ← Marina
frontend/src/pages/Library.jsx            ← Diana
backend/**                               ← otros colaboradores
ingest/**                                ← Manuel
firestore.rules                          ← Israel
.github/workflows/**                     ← Germán
```

---

## ⚠️ Notas especiales

- **REGLA CRÍTICA para TabSelector:** Exporta el componente standalone. NO lo integres en App.jsx ni en Feed.jsx. Monserrat es la dueña de Feed.jsx y lo importará ella.
- `FeedContext.jsx` es tuyo — exporta `useFeed()` y `FeedProvider`. Otros lo consumen.
- Para el onboarding, los géneros pueden ser hardcoded mientras Manuel termina el ingest.
- Usar el mock estándar del proyecto para las 5 tarjetas de calibración:

```javascript
// Importar desde: frontend/src/__mocks__/feed.mock.js
import { MOCK_FEED_ITEMS } from '../__mocks__/feed.mock'
// Usar los primeros 5 items para las tarjetas de onboarding
```

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-juan-carlos-onboarding.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Juan Carlos Macías Mayen"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, frontend, onboarding]
---

# DevLog — YYYY-MM-DD — UI Onboarding + TabSelector

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Juan Carlos

## Próximos pasos para el siguiente colaborador
- Monserrat puede importar TabSelector desde: frontend/src/components/TabSelector.jsx
- useFeed() disponible en: frontend/src/contexts/FeedContext.jsx — da {activeType, setActiveType}
- El onboarding guarda prefs en Firestore users/{uid}.prefs al terminar
```
