# Sprint 1 — Juan Carlos Macías Mayen
**Nivel:** Bajo | **Épicas:** 1–2 | **Wave:** 🟡 2 (puede iniciar con mocks desde Wave 1)

---

## 🎯 Tu misión

Construir la **primera experiencia del usuario**: el onboarding de swipe que captura sus gustos, y el selector de tipo (Películas/Libros) que aparece en todas las pantallas del feed. Son los primeros momentos que el usuario vive en la app.

**Entrega el miércoles 10 jun:**
- Componente de onboarding: barra de progreso, máximo 10 tarjetas saltables, selección de géneros/autores, marca `cold_start_done = true`
- Tab Selector Movies/Books con indicador visual del modo activo y estado global `active_feed`

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Auth y rutas protegidas | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Catálogo para tarjetas de onboarding | **[[03-Manuel-Serrania\|Manuel Serranía]]** | Wave 1 |

> 💡 **Puedes empezar con géneros hardcodeados** (lista fija de géneros para seleccionar) mientras Manuel termina el ingest. El onboarding no necesita datos reales para construirse.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[04-Luis-Tellez|Luis]]** necesita `users.prefs.genres` guardado para filtrar el feed
- ✅ **[[10-Monserrat-Miranda|Monserrat]]** necesita el Tab Selector para que SwipeDeck sepa si mostrar películas o libros

---

## 🧪 Mock mínimo para empezar

Para las 5 tarjetas del onboarding (paso 2 del flujo), usar el mock estándar del proyecto:

```javascript
// Importar desde frontend/src/__mocks__/feed.mock.js
// (Edgar crea este archivo — si no existe aún, créalo tú con la estructura de abajo)
import { MOCK_FEED_ITEMS } from '../__mocks__/feed.mock'

// Usar los primeros 5 items (o todos si hay menos de 5)
const onboardingCards = MOCK_FEED_ITEMS.slice(0, 5)
```

Para los géneros del Paso 1 (hardcoded mientras Manuel termina el ingest):
```javascript
const ONBOARDING_GENRES = [
  "Acción", "Drama", "Comedia", "Terror", "Romance",
  "Ciencia Ficción", "Misterio", "Documentales", "Fantasía",
  "Thriller", "Biografías", "Historia"
]
```

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/08-Juan-Carlos-agent-context.md — define qué archivos puedes tocar.

Necesito crear el flujo de onboarding y el Tab Selector para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/, Firebase Firestore (emulador localhost:8080 en dev).
La app es mobile-first (PWA). Ya existe AuthContext con useAuth() que da currentUser.

CONTEXTO del schema users/{userId}.prefs:
  genres: array de strings (géneros seleccionados)
  authors: array de strings (autores favoritos, opcional)
  directors: array de strings (directores favoritos, opcional)
  cold_start_done: boolean

TAREA 1 — frontend/src/pages/Onboarding.jsx
Flujo de onboarding en pasos:

Paso 1: Selección de géneros (pantalla de bienvenida)
  - Título: "¿Qué tipo de contenido te gusta?"
  - Grid de chips/tags con géneros: Acción, Drama, Comedia, Terror, Romance, 
    Ciencia Ficción, Misterio, Documentales, Fantasía, Thriller, Biografías, Historia
  - Selección múltiple (toggle al tocar), mínimo 1 selección para continuar
  - Botón "Continuar" deshabilitado si no hay selección

Paso 2: Swipe de calibración (5-10 tarjetas)
  - Mostrar 5 tarjetas de contenido (usar datos mock con géneros de los seleccionados en paso 1)
  - Cada tarjeta: cover + título + género (usar el componente ContentCard de Edgar si está listo,
    o una versión simplificada si no)
  - Botones "Me gusta 👍" y "No me interesa 👎" visibles debajo (además de swipe)
  - Barra de progreso en la parte superior: "2 de 5 tarjetas"
  - Botón "Saltar" en esquina superior derecha que saltea esta tarjeta
  - Al completar las 5 tarjetas → ir al Paso 3

Paso 3: Completar perfil (opcional)
  - Input de texto: "¿Algún autor favorito? (opcional)"
  - Input de texto: "¿Algún director favorito? (opcional)"
  - Botón "Empezar a descubrir →"

Al terminar el paso 3:
  - Guardar en Firestore users/{currentUser.uid}:
    prefs: { genres: [seleccionados], authors: [si los puso], directors: [si los puso], cold_start_done: true }
  - Redirigir a /feed

Animaciones: transición suave entre pasos (slide horizontal).

TAREA 2 — frontend/src/components/TabSelector.jsx
Componente de selección de tipo con estado global:

Diseño:
  - Dos tabs: "🎬 Películas" y "📚 Libros"
  - Tab activo: color de acento (azul o el color primario de la app), borde inferior visible
  - Tab inactivo: gris, sin borde
  - Transición suave (200ms) al cambiar de tab

Estado global:
  - Usar React Context o Zustand para el estado active_feed ("movie" | "book")
  - Crear frontend/src/contexts/FeedContext.jsx:
    - Estado: activeType ("movie" | "book"), defaulting a "movie"
    - Setter: setActiveType
    - Hook: useFeed()
  - TabSelector usa useFeed() para leer y cambiar el tipo activo
  - Al cambiar de tab NO se destruye el estado del feed actual (el feed se re-fetcha con el nuevo tipo)

TAREA 3 — Entregar componentes standalone (NO modificar App.jsx ni Feed.jsx)
⚠️ App.jsx es de Andrés González. Feed.jsx es de Monserrat Miranda. NO los toques.
Tu trabajo es entregar componentes standalone que otros integran:
  - <Onboarding /> es standalone → Andrés ya tiene la ruta /onboarding en App.jsx
  - <TabSelector /> es standalone → Monserrat lo importa en Feed.jsx
  - <FeedContext> / <FeedProvider> los crea tú → Andrés ya envuelve App con el Provider
Notifica a Andrés y a Monserrat cuando tus componentes estén listos para integrar.
Asegúrate de que FeedContext.jsx exporte: FeedProvider, useFeed().

Muéstrame la estructura de componentes al terminar y cómo probar el flujo completo.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-juan-carlos-onboarding.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Juan Carlos Macías Mayen"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que TabSelector.jsx es standalone (no integrado en App.jsx ni Feed.jsx) y que FeedContext.jsx exporta useFeed() y FeedProvider.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/pages/Onboarding.jsx` — 3 pasos completos
- [ ] Selección de géneros con toggle y mínimo 1 requerido
- [ ] Barra de progreso en paso 2
- [ ] `prefs.cold_start_done = true` guardado en Firestore al terminar
- [ ] `frontend/src/components/TabSelector.jsx` — 2 tabs con estado visual
- [ ] `frontend/src/contexts/FeedContext.jsx` — `active_feed` global
- [ ] Redirect a /feed al terminar onboarding
- [ ] Se ve bien en 375px de ancho
