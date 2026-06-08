# Sprint 1 — Monserrat Miranda Olivas
**Nivel:** Bajo | **Épica:** 3 | **Wave:** 🟢 3 (después de Edgar + Luis + Andrés)

---

## 🎯 Tu misión

Construir la **mecánica principal de la app**: el stack de tarjetas con gestos de swipe. Es la interacción central — el momento en que el usuario decide si le gusta o no un título. Necesitas integrar el componente `<ContentCard />` de Edgar con la API de Luis.

**Entrega el miércoles 10 jun:**
- `<SwipeDeck />` con gestos táctiles derecha (like) / izquierda (dislike) a ≈60 FPS
- Pre-fetch silencioso al quedar 5 tarjetas
- Cada swipe → `POST /api/swipe` no bloqueante

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| `<ContentCard />` | **[[07-Edgar-Coronel\|Edgar Coronel]]** | Wave 2 |
| `GET /api/feed` y `POST /api/swipe` | **[[04-Luis-Tellez\|Luis Téllez]]** | Wave 2 |
| Auth token (currentUser) | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |

> ⏸️ **Espera a Edgar y Luis** antes de integrar. Mientras tanto, define la estructura del componente y las props que necesitarás.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[12-Diana-Alvarez|Diana]]** necesita que los swipes estén siendo guardados (el like genera el ítem en la biblioteca)
- ✅ **[[13-Ulises-Chaparro|Ulises]]** verifica el happy path completo: onboarding → swipe → like

---

## 🧪 Mock mínimo para empezar

Mientras Luis termina la API, usar el mock estándar del proyecto para desarrollar el SwipeDeck:

```javascript
// Importar desde frontend/src/__mocks__/feed.mock.js
import { MOCK_FEED_ITEMS } from '../__mocks__/feed.mock'

// En SwipeDeck: inicializar cards con el mock
const [cards, setCards] = useState(MOCK_FEED_ITEMS)
```

Cuando Luis termine `GET /api/feed`, reemplazar el `useState(MOCK_FEED_ITEMS)` con el `fetchFeed()` real. La estructura del objeto es idéntica — el reemplazo es trivial.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/10-Monserrat-agent-context.md — define qué archivos puedes tocar.

Necesito crear el componente SwipeDeck para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/.
Librería de swipe disponible: react-tinder-card (npm install react-tinder-card).
Alternativa si prefieres: Framer Motion (npm install framer-motion).
La app es mobile-first. Ya existen:
  - <ContentCard /> en frontend/src/components/ContentCard.jsx
  - GET /api/feed (devuelve [{ contentId, title, cover, genres, rating, synopsis, type }])
  - POST /api/swipe (body: { userId, contentId, contentType, action })
  - useAuth() en frontend/src/contexts/AuthContext.jsx (da currentUser con uid y getIdToken())
  - useFeed() en frontend/src/contexts/FeedContext.jsx (da activeType: "movie"|"book")

TAREA 1 — frontend/src/components/SwipeDeck.jsx

Estado interno:
  - cards: array de items del feed (inicialmente vacío, se carga al montar)
  - loading: boolean
  - currentIndex: número de la tarjeta actual
  - isFetching: boolean (para evitar doble fetch en pre-fetch)

Al montar el componente:
  - Llamar a fetchFeed() para cargar las primeras tarjetas

fetchFeed(cursor = null):
  - GET /api/feed?userId={uid}&type={activeType}&cursor={cursor}
  - Con el header Authorization: Bearer {await currentUser.getIdToken()}
  - Añadir los nuevos items a cards[] (no reemplazar, acumular)
  - Guardar el cursor del último item para la siguiente página

Lógica de pre-fetch:
  - Cuando quedan 5 o menos tarjetas sin ver, disparar fetchFeed(cursor) silencioso
  - isFetching evita que se llame dos veces

Al hacer swipe (onSwipe callback de react-tinder-card o Framer Motion):
  - direction "right" → action: "like"
  - direction "left" → action: "dislike"
  - Llamar a POST /api/swipe de forma no bloqueante (fire-and-forget, no await)
    body: { userId: uid, contentId, contentType: activeType, action }
  - No esperar la respuesta para avanzar la UI (el swipe ya ocurrió visualmente)

Cuando se acaban las tarjetas:
  - Mostrar pantalla "¡Has visto todo!" con botón "Ver más"
  - El botón llama a fetchFeed() para cargar más

Render:
  - Stack visual: mostrar máximo 3 tarjetas apiladas (con escala y sombra)
  - La tarjeta del frente (currentIndex) es la activa
  - Las 2 tarjetas de atrás se ven ligeramente escaladas (0.97, 0.94)
  - Usar <ContentCard /> para cada tarjeta
  - Indicador visual de swipe: al arrastrar a la derecha aparece "❤️ LIKE" verde,
    a la izquierda "✕ SKIP" rojo

TAREA 2 — Integrar en frontend/src/pages/Feed.jsx
  - Importar <TabSelector /> de Juan Carlos en la parte superior
  - Debajo del TabSelector, renderizar <SwipeDeck />
  - Cuando activeType cambie en FeedContext, resetear SwipeDeck y hacer nuevo fetch

TAREA 3 — Integrar <DetailSheet /> de Marina en SwipeDeck.jsx
  Marina crea DetailSheet como componente standalone. Tú haces la integración en SwipeDeck.jsx:
  - Agregar estado: const [selectedContentId, setSelectedContentId] = useState(null)
  - En el onClick del ContentCard dentro del stack: onClick={() => setSelectedContentId(item.contentId)}
  - Renderizar al final del JSX de SwipeDeck:
      <DetailSheet
        isOpen={!!selectedContentId}
        contentId={selectedContentId}
        onClose={() => setSelectedContentId(null)}
        onSaved={() => setSelectedContentId(null)}
        onDislike={() => setSelectedContentId(null)}
      />
  - Ver el comentario JSDoc al inicio de DetailSheet.jsx para la interfaz exacta
  - Verificar que el sheet NO destruye el stack de swipe al abrirse/cerrarse

TAREA 3 — Manejo de errores
  - Si el fetch falla: mostrar mensaje "Error al cargar contenido. Intenta de nuevo."
  - Si POST /api/swipe falla: ignorar silenciosamente (el swipe ya ocurrió en UI)
  - Si no hay más contenido (array vacío): mostrar estado vacío

Muéstrame la lógica de pre-fetch y el manejo del stack visual al terminar.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-monserrat-swipedeck.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Monserrat Miranda Olivas"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-3]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que Feed.jsx integra TabSelector (Juan Carlos) y SwipeDeck (tuyo). Notificar a Marina si DetailSheet aún necesita integrarse.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/components/SwipeDeck.jsx` — gestos táctiles funcionando
- [ ] Pre-fetch al quedar 5 tarjetas (silencioso, no bloqueante)
- [ ] `POST /api/swipe` fire-and-forget (no bloquea la animación)
- [ ] Indicadores visuales: ❤️ LIKE en swipe derecha, ✕ SKIP en izquierda
- [ ] Estado vacío cuando se acaban las tarjetas
- [ ] Integrado en `Feed.jsx` con el Tab Selector de Juan Carlos
- [ ] `<DetailSheet />` de Marina integrado en `SwipeDeck.jsx` con estado `selectedContentId`
- [ ] Probado en móvil (gestos táctiles reales)
