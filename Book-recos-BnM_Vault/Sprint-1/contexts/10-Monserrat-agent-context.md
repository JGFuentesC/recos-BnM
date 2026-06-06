---
persona: "Monserrat Miranda Olivas"
wave: 3
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Monserrat Miranda (Wave 3 — SwipeDeck)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Eres la dueña de **Feed.jsx** — integras TabSelector (Juan Carlos) y SwipeDeck (tuyo) en ese archivo.  
> → Ver [[Sprint-1/10-Monserrat-Miranda|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
frontend/src/components/SwipeDeck.jsx
frontend/src/pages/Feed.jsx               ← TUYA — integras todo aquí
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Acción |
|---|---|---|
| `frontend/package.json` | Andrés González | Coordinar si necesitas react-tinder-card o Framer Motion |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx                      ← Andrés
frontend/src/components/ContentCard.jsx   ← Edgar (solo importar, no editar)
frontend/src/components/TabSelector.jsx   ← Juan Carlos (solo importar, no editar)
frontend/src/contexts/AuthContext.jsx     ← Andrés
frontend/src/contexts/FeedContext.jsx     ← Juan Carlos
frontend/src/pages/Onboarding.jsx         ← Juan Carlos
frontend/src/components/DetailSheet.jsx   ← Marina (solo renderizarla, no editarla)
frontend/src/pages/Library.jsx            ← Diana
backend/**                               ← otros colaboradores
ingest/**                                ← Manuel
firestore.rules                          ← Israel
.github/workflows/**                     ← Germán
```

---

## ⚠️ Responsabilidad de integración en Feed.jsx

**Tú integras en Feed.jsx:**
1. `<TabSelector />` de Juan Carlos (importar y renderizar en la parte superior)
2. `<SwipeDeck />` tuyo (renderizar debajo del TabSelector)
3. `<DetailSheet />` de Marina (renderizar cuando el usuario toca una tarjeta)

**Coordinación con Marina:**
- Marina entrega `DetailSheet.jsx` como componente standalone
- Tú lo integras dentro de `SwipeDeck.jsx` (siguiendo las instrucciones de su prompt)
- Cuando Marina termine, hacer un PR sobre tu branch para integrar

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-monserrat-swipedeck.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Monserrat Miranda Olivas"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-3, frontend, swipe]
---

# DevLog — YYYY-MM-DD — UI SwipeDeck + Feed.jsx

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Monserrat

## Próximos pasos para el siguiente colaborador
- Diana: los swipes generan ítems en Firestore collections/ que aparecen en la Biblioteca
- SwipeDeck está integrado en Feed.jsx con TabSelector
- Detalle: al tocar una tarjeta se abre DetailSheet (integrar cuando Marina entregue)
```
