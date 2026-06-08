---
persona: "Edgar Coronel Navarrete"
wave: 2
agente_sugerido: "Claude Code"
last_updated: "2026-06-05"
---

# Agent Context — Edgar Coronel (Wave 2 — ContentCard UI)

> Lee esto ANTES de iniciar cualquier sesión con tu agente IA.  
> Tu componente es el más usado de la app. Monserrat y Marina lo necesitan — entrega un componente standalone limpio.  
> → Ver [[Sprint-1/07-Edgar-Coronel|Tus tareas de Sprint]]

---

## 🟢 Archivos PROPIOS (crear y modificar libremente)

```
frontend/src/components/ContentCard.jsx
frontend/src/components/ContentCard.module.css
frontend/src/pages/MockFeed.jsx
frontend/src/__mocks__/feed.mock.js
```

---

## 🟡 Archivos COMPARTIDOS (coordinar antes de modificar)

| Archivo | Dueño | Qué hacer |
|---|---|---|
| `frontend/package.json` | Andrés González | Coordinar si necesitas agregar una dep nueva |

---

## 🔴 Archivos PROHIBIDOS

```
frontend/src/App.jsx                      ← Andrés (ya tiene todas las rutas)
frontend/src/pages/Feed.jsx               ← Monserrat (tu componente va ahí pero ella lo integra)
frontend/src/contexts/AuthContext.jsx     ← Andrés
frontend/src/contexts/FeedContext.jsx     ← Juan Carlos
frontend/src/components/TabSelector.jsx   ← Juan Carlos
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

- `ContentCard` debe ser un componente **100% standalone**. No importa contextos ni hace fetch directo. Solo recibe props y renderiza.
- Monserrat lo importa para SwipeDeck. Marina lo usa como referencia para DetailSheet.
- La prop `onClick` debe estar bien tipada — es el mecanismo para abrir el DetailSheet.
- Usar el mock estándar del proyecto para desarrollo:

```javascript
// frontend/src/__mocks__/feed.mock.js
export const MOCK_FEED_ITEMS = [
  {
    contentId: "mock-movie-001",
    title: "Interstellar",
    cover: "https://placehold.co/300x450/1a1a2e/ffffff?text=Interstellar",
    genres: ["Sci-Fi", "Aventura", "Drama"],
    rating: 8.6,
    synopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en busca de un nuevo hogar para la humanidad.",
    type: "movie"
  },
  {
    contentId: "mock-movie-002",
    title: "The Dark Knight",
    cover: "https://placehold.co/300x450/1a1a2e/ffffff?text=Dark+Knight",
    genres: ["Acción", "Crimen", "Drama"],
    rating: 9.0,
    synopsis: "El Caballero Oscuro se enfrenta al Joker, un criminal anárquico que siembra el caos en Gotham.",
    type: "movie"
  },
  {
    contentId: "mock-book-001",
    title: "Sapiens",
    cover: "https://placehold.co/300x450/2d1b69/ffffff?text=Sapiens",
    genres: ["Historia", "Ciencia"],
    rating: 8.8,
    synopsis: "Una breve historia de la humanidad desde los primeros humanos hasta el mundo moderno.",
    type: "book"
  },
  {
    contentId: "mock-book-002",
    title: "El Hobbit",
    cover: "https://placehold.co/300x450/2d1b69/ffffff?text=El+Hobbit",
    genres: ["Fantasía", "Aventura"],
    rating: 9.1,
    synopsis: "Bilbo Bolsón, un hobbit tranquilo, es arrastrado a una aventura épica con un grupo de enanos.",
    type: "book"
  }
]
```

---

## 📓 Regla de DevLog (obligatorio al terminar)

Antes de hacer push, crear: `DevLog/YYYY-MM-DD-edgar-content-card.md`

```markdown
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Edgar Coronel Navarrete"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "Xh"
tags: [devlog, sprint-1, wave-2, frontend, ui]
---

# DevLog — YYYY-MM-DD — UI ContentCard

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo
- ...

## 🤖 Sesión de IA
- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:** [lista]
- **Decisiones autónomas del agente:** ...
- **Correcciones manuales:** ...
- **Prompt inicial usado:** Sprint file de Edgar

## Próximos pasos para el siguiente colaborador
- Monserrat puede importar ContentCard desde: frontend/src/components/ContentCard.jsx
- Props requeridas: {contentId, title, cover, genres, rating, synopsis, type, onClick}
- Mock de datos disponible en: frontend/src/__mocks__/feed.mock.js
```
