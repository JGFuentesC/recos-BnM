---
persona: "Andrés González Habib"
wave: 1
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Andrés González (Wave 1 — Auth)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Eres el dueño de **app.js** y **App.jsx** — crea el scaffold completo con TODAS las rutas antes de que Wave 2 empiece.  
> → Ver [[Sprint-1/02-Andres-Gonzalez|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
backend/src/app.js                       ← TUYO — scaffold completo con todas las rutas
backend/src/middleware/auth.js
backend/src/firebase/admin.js
backend/src/routes/index.js              ← si usas un aggregator de rutas
frontend/src/App.jsx                     ← TUYO — scaffold con todas las rutas del frontend
frontend/src/main.jsx
frontend/src/firebase/config.js
frontend/src/contexts/AuthContext.jsx
frontend/src/pages/Login.jsx
frontend/src/pages/Register.jsx
frontend/src/components/ProtectedRoute.jsx
```

---

## 🟡 Archivos COMPARTIDOS (modificar solo si es necesario)

| Archivo | Por qué coordinar |
|---|---|
| `backend/package.json` | Eres el coordinador — si hay conflicto en merge, lo resuelves tú |
| `frontend/package.json` | Eres el coordinador — ídem |

---

## 🔴 Archivos PROHIBIDOS

```
firestore.rules                     ← Israel
firestore.indexes.json              ← Israel
ingest/**                           ← Manuel
.github/workflows/**                ← Germán
backend/src/routes/feed.js          ← Luis
backend/src/routes/swipe.js         ← Luis
backend/src/routes/content.js       ← Héctor
backend/src/routes/collections.js   ← Christian
backend/src/services/scoring.js     ← Manuel
frontend/src/components/ContentCard.jsx   ← Edgar
frontend/src/components/TabSelector.jsx   ← Juan Carlos
frontend/src/components/SwipeDeck.jsx     ← Monserrat
frontend/src/pages/Feed.jsx               ← Monserrat
frontend/src/components/DetailSheet.jsx   ← Marina
frontend/src/pages/Library.jsx            ← Diana
```

---

## ⚠️ RESPONSABILIDAD CRÍTICA — Scaffold de app.js y App.jsx

**Debes hacer esto ANTES de que Wave 2 empiece (antes de que Luis, Héctor, Christian y los demás comiencen):**

### backend/src/app.js — Pre-registrar todas las rutas

```javascript
const express = require('express')
const app = express()
app.use(express.json())

// Rutas del proyecto — cada colaborador crea su archivo, NO modifica este
app.use('/api/feed',        require('./routes/feed'))        // Luis Téllez
app.use('/api/swipe',       require('./routes/swipe'))       // Luis Téllez
app.use('/api/content',     require('./routes/content'))     // Héctor Morales
app.use('/api/collections', require('./routes/collections')) // Christian Ruiz

module.exports = app
```

Si un route file no existe aún, Express fallará cuando se llame. Pero al menos NO habrá conflictos de merge.

### frontend/src/App.jsx — Pre-registrar todas las rutas

```jsx
// Rutas del proyecto — cada colaborador crea su page/component, NO modifica este archivo
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
  <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
  <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
</Routes>
```

Esto evita que Juan Carlos, Monserrat o Diana toquen App.jsx.

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-andres-auth.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Andrés González Habib"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-1, auth]
---

# DevLog — YYYY-MM-DD — Firebase Auth + middleware

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista completa]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Andrés

## Bloqueantes encontrados
- ...

## Próximos pasos para el siguiente colaborador
- Luis, Héctor y Christian pueden importar auth.js desde: backend/src/middleware/auth.js
- El scaffold de app.js ya tiene todas las rutas registradas — solo crear el route file
- El scaffold de App.jsx ya tiene todas las rutas — solo crear los pages/components
```
