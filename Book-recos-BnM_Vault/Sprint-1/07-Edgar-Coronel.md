# Sprint 1 — Edgar Coronel Navarrete
**Nivel:** Bajo | **Épica:** 3 | **Wave:** 🟡 2 (puede iniciar con mocks desde Wave 1)

---

## 🎯 Tu misión

Construir el componente visual más visto de toda la app: la **tarjeta de contenido** (`ContentCard`). Es lo que el usuario ve al hacer swipe — la portada, el título, el género, la calificación y la sinopsis. Todo el stack de swipe depende de que este componente exista.

**Entrega el miércoles 10 jun:**
- Componente `<ContentCard />` con cover, title, genres, rating y synopsis
- Animación de entrada fluida
- Props bien tipadas
- Pantalla de prueba con datos mock (no depende de la API real para presentar)

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Rutas protegidas del frontend | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Datos reales de la API | **[[04-Luis-Tellez\|Luis Téllez]]** | Wave 2 |

> 💡 **Puedes empezar ahora** con datos hardcodeados. Solo necesitas la estructura del objeto para definir las props. Reemplaza los mocks con la API cuando Luis termine.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[10-Monserrat-Miranda|Monserrat]]** necesita `<ContentCard />` para componer el `<SwipeDeck />`
- ✅ **[[11-Marina-Garcia|Marina]]** usa los mismos datos en el `<DetailSheet />`

---

## 🧪 Mock mínimo para empezar

Usa estos datos mientras la API real no esté disponible. El mock estándar del proyecto vive en `frontend/src/__mocks__/feed.mock.js`:

```javascript
// frontend/src/__mocks__/feed.mock.js
// Estructura EXACTA que devuelve GET /api/feed — no inventar campos distintos
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

> **Importante:** Crear este archivo en `frontend/src/__mocks__/feed.mock.js`. Todos los colaboradores de frontend usan el mismo mock para garantizar consistencia. No inventar estructuras distintas.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/07-Edgar-agent-context.md — define qué archivos puedes tocar.

Necesito crear el componente ContentCard para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/.
La app es mobile-first (PWA), priorizar diseño táctil y visual atractivo.

ESTRUCTURA del objeto de datos (viene del GET /api/feed):
  contentId: string
  title: string
  cover: string (URL de imagen, ej. https://image.tmdb.org/t/p/w500/abc.jpg)
  genres: array de strings (ej. ["Acción", "Drama"])
  rating: number (0-10, mostrar con 1 decimal)
  synopsis: string (puede ser larga, truncar a 3 líneas con "ver más")
  type: "movie" | "book"

TAREA 1 — frontend/src/components/ContentCard.jsx
Crear un componente <ContentCard /> que reciba las props anteriores y muestre:

Diseño visual:
- Tarjeta de altura completa (mínimo 75vh), bordes redondeados (16px)
- Imagen de portada (cover) ocupando la parte superior (~60% de la tarjeta)
  - Si cover es null/undefined → mostrar placeholder con gradiente y el título
- Badge de tipo en esquina superior derecha: "🎬 Película" o "📚 Libro"
- Sobre la imagen, gradiente oscuro en la parte inferior para que el texto sea legible
- Título en bold, grande (24px), blanco, sobre el gradiente
- Géneros como chips/tags pequeños (máx 3 géneros, +N si hay más)
- Rating: ⭐ + número con 1 decimal (ej. "⭐ 8.4")
- Synopsis truncada a 3 líneas con CSS (-webkit-line-clamp: 3)

Props:
  contentId, title, cover, genres, rating, synopsis, type
  onClick: función llamada al tocar la tarjeta (para abrir DetailSheet)

Animación:
- Al montar el componente, entrada suave con CSS: opacity 0→1 y translateY(20px)→0
- Duración 200ms, easing ease-out

TAREA 2 — frontend/src/pages/MockFeed.jsx (pantalla de prueba)
Crear una página con 3-4 ContentCards con datos hardcodeados:
  - 2 películas con datos de TMDB (Interstellar, The Dark Knight)
  - 2 libros con datos de Google Books (cualquiera)
Esta página es solo para desarrollo; acceder en la ruta /mock-feed.

TAREA 3 — Estilos
Usar CSS modules (ContentCard.module.css) o Tailwind si ya está configurado.
Si no hay Tailwind, usar CSS modules.
El diseño debe verse bien en pantallas de 375px de ancho (iPhone SE).

Muéstrame un screenshot visual del componente usando datos mock al terminar 
(o describe exactamente cómo se ve cada sección).

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-edgar-content-card.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Edgar Coronel Navarrete"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que el mock estándar está en frontend/src/__mocks__/feed.mock.js y que ContentCard es standalone (no importa contextos).
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/components/ContentCard.jsx` — todas las props
- [ ] `frontend/src/components/ContentCard.module.css` — estilos
- [ ] Placeholder cuando no hay imagen
- [ ] Rating con ⭐ y 1 decimal
- [ ] Synopsis truncada a 3 líneas
- [ ] Animación de entrada (200ms)
- [ ] `frontend/src/pages/MockFeed.jsx` — 4 tarjetas de prueba
- [ ] Se ve bien en 375px de ancho
