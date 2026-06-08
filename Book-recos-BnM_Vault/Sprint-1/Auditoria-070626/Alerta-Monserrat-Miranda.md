---
persona: "Monserrat Miranda"
prioridad: "🔴 Alta"
tipo: ["sin-iniciar", "desbloqueada"]
fecha: "2026-06-07"
wave: 3
---

# 🔴 Alerta — Monserrat Miranda

## Entregables planificados (Wave 3)
- ❌ `frontend/src/components/SwipeDeck/SwipeDeck.jsx` — componente principal de swipe
- ❌ `frontend/src/tests/SwipeDeck.test.jsx` — mínimo 3 tests

## Estado actual
Branch `feat/monse` solo contiene el archivo de contributor (`monsemiranda.txt`).
**No hay código implementado.**

## ✅ Desbloqueante resuelto — Luis mergeó PR #24

A partir de hoy (7 Jun) los endpoints están disponibles en `main`:
- `GET /api/feed?userId=<uid>&type=movie|book&cursor=<n>`
- `POST /api/swipe` body: `{ userId, contentId, contentType, action }`

**Respuesta del feed:**
```json
[{
  "contentId": "...",
  "title": "...",
  "cover": "...",
  "genres": ["Action", "Sci-Fi"],
  "rating": 8.8,
  "synopsis": "...",
  "type": "movie"
}]
```

**Paginación:** pasar `cursor=10` para la segunda página, `cursor=20` para la tercera.

## Contexto disponible en el proyecto

`FeedContext.jsx` ya existe (Juan Carlos, PR #22) — úsalo para acceder al feed:
```jsx
import { useFeed } from '../contexts/FeedContext'
```

`TabSelector.jsx` ya existe — para cambiar entre películas y libros.

Mock de datos disponible en `frontend/src/__mocks__/feed.mock.js`.

## Entregable mínimo requerido — SwipeDeck

El SwipeDeck debe:
1. Consumir `GET /api/feed` con el token del usuario autenticado
2. Mostrar una tarjeta a la vez (el top del array)
3. Detectar swipe izquierda (dislike) y derecha (like)
4. Llamar `POST /api/swipe` al completar el gesto
5. Avanzar a la siguiente tarjeta tras el swipe
6. Pedir siguiente página cuando queden ≤ 2 tarjetas (`cursor`)

## Dependencias de salida bloqueadas
| Quién espera | Qué necesita |
|---|---|
| **Demo del Sprint** | SwipeDeck es la funcionalidad central del MVP |
| **Ulises (QA)** | Flujo de swipe para verificar |

## Fecha límite
**Miércoles 10 jun 2026** — quedan 3 días.
