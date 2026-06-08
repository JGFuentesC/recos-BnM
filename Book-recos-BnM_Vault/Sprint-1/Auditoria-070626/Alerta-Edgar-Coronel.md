---
persona: "Edgar Coronel (rol developer)"
prioridad: "🔴 Alta"
tipo: ["sin-iniciar", "rol-dual"]
fecha: "2026-06-07"
wave: 2
---

# 🔴 Alerta — Edgar Coronel (Developer)

## Contexto — Rol dual

Edgar Coronel tiene **dos roles** en este sprint:
1. **PM** — coordina merges, revisa PRs ✅ (cumplido)
2. **Developer Wave 2** — implementa `ContentCard` component ❌ (no iniciado)

## Entregables planificados (Wave 2 — developer)
- ❌ `frontend/src/components/ContentCard/ContentCard.jsx`
- ❌ `frontend/src/tests/ContentCard.test.jsx` — mínimo 3 tests

## Estado actual
Su branch `feat/edgar.txt` solo contiene actualizaciones al Vault (Roadmap, Sprint Overview, Timeline).
**El ContentCard nunca se implementó.**

## Impacto

El `ContentCard` es el componente visual de cada ítem en el SwipeDeck. Sin él:
- Monserrat (SwipeDeck) no puede mostrar el contenido correctamente
- La demo del Sprint no tendrá tarjetas con diseño real

## Entregable mínimo requerido

```jsx
// frontend/src/components/ContentCard/ContentCard.jsx
// Props esperadas (del feed):
// { contentId, title, cover, genres, rating, synopsis, type }

// Debe mostrar:
// - Imagen de portada (cover)
// - Título
// - Géneros como chips/tags
// - Rating con estrella
// - Sinopsis (truncada)
// - Badge de tipo (🎬 Película / 📚 Libro)
```

**Datos mock disponibles:** `frontend/src/__mocks__/feed.mock.js`

## Recomendación

Dado el rol dual, coordinar con el equipo:
- Si el tiempo es limitado → priorizar ContentCard sobre tareas de PM
- Si no es posible → reasignar ContentCard a otro colaborador disponible

## Fecha límite
**Miércoles 10 jun 2026** — quedan 3 días.
