# Sprint 1 — Marina García del Buey
**Nivel:** Bajo | **Épica:** 4 | **Wave:** 🟢 3 (después de Héctor + Christian + Edgar)

---

## 🎯 Tu misión

Construir la **pantalla de detalle**: cuando el usuario toca una tarjeta, se despliega un modal con toda la información extendida — sinopsis completa, dónde ver la película, y tres acciones (Guardar, No me interesa, Compartir). Es crucial que este modal **no destruya el stack de swipe** que está debajo.

**Entrega el miércoles 10 jun:**
- Componente `<DetailSheet />` — modal/slide-up con toda la información
- Tres botones flotantes: Guardar, No me interesa, Compartir
- Integrado con `GET /api/content/{id}` de Héctor y `POST /api/collections` de Christian

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| `GET /api/content/{id}` | **[[05-Hector-Morales\|Héctor Morales]]** | Wave 2 |
| `POST /api/collections` | **[[06-Christian-Ruiz\|Christian Ruiz]]** | Wave 2 |
| `<ContentCard />` (datos que disparan la apertura) | **[[07-Edgar-Coronel\|Edgar Coronel]]** | Wave 2 |

> 💡 **Puedes construir la UI con datos mock** mientras Héctor y Christian terminan sus endpoints.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[12-Diana-Alvarez|Diana]]** (Biblioteca) recibe el contenido guardado cuando el usuario toca "Guardar"

---

## 🧪 Mock mínimo para empezar

Para desarrollar DetailSheet mientras Héctor termina `GET /api/content/{id}`, usar este mock del objeto content completo:

```javascript
// Estructura EXACTA que devuelve GET /api/content/:id
const MOCK_CONTENT_DETAIL = {
  contentId: "mock-movie-001",
  type: "movie",
  title: "Interstellar",
  cover: "https://placehold.co/400x600/1a1a2e/ffffff?text=Interstellar",
  year: 2014,
  genres: ["Sci-Fi", "Aventura", "Drama"],
  synopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en busca de un nuevo hogar para la humanidad. Una aventura épica sobre el amor, el tiempo y la supervivencia.",
  rating: 8.6,
  watchProviders: ["Netflix", "Apple TV+"],
  source: "tmdb",
  attribution: "This product uses the TMDB API but is not endorsed or certified by TMDB"
}

// Mock para un libro (sin watchProviders):
const MOCK_BOOK_DETAIL = {
  contentId: "mock-book-001",
  type: "book",
  title: "Sapiens",
  cover: "https://placehold.co/400x600/2d1b69/ffffff?text=Sapiens",
  year: 2011,
  genres: ["Historia", "Ciencia"],
  synopsis: "Yuval Noah Harari realiza un recorrido por la historia de la humanidad desde sus orígenes en África hasta el presente.",
  rating: 8.8,
  watchProviders: [],
  source: "google_books"
}
```

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/11-Marina-agent-context.md — define qué archivos puedes tocar.

Necesito crear el componente DetailSheet para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/.
La app es mobile-first (PWA). Ya existen:
  - <ContentCard /> en frontend/src/components/ContentCard.jsx
  - GET /api/content/:id (devuelve objeto content completo + watchProviders + attribution)
  - POST /api/collections (body: { userId, contentId, contentType, listName, personalNote })
  - POST /api/swipe (body: { userId, contentId, contentType, action: "dislike" })
  - useAuth() en frontend/src/contexts/AuthContext.jsx

TAREA 1 — frontend/src/components/DetailSheet.jsx
Modal tipo "bottom sheet" que se desliza desde abajo:

Props:
  contentId: string (para hacer fetch al API)
  isOpen: boolean
  onClose: () => void
  onSaved: () => void (callback cuando se guarda, para que SwipeDeck avance)
  onDislike: () => void (callback cuando se presiona "No me interesa")

Comportamiento:
  - Cuando isOpen cambia a true → fetch GET /api/content/{contentId}
    con header Authorization: Bearer {await currentUser.getIdToken()}
  - Mostrar loading spinner mientras carga
  - Cuando isOpen cambia a false → no destruir el stack de SwipeDeck (solo esconder el sheet)

Animación:
  - Al abrir: slide-up desde abajo (translateY 100% → 0) en 300ms ease-out
  - Al cerrar: slide-down (translateY 0 → 100%) en 200ms ease-in
  - Overlay oscuro detrás que se desvanece (opacity 0 → 0.5)
  - Tocar el overlay → cerrar el sheet

Diseño del sheet (móvil-first, fondo blanco, bordes superiores redondeados 20px):
  Sección superior:
    - Imagen de portada horizontal (16:9 o 3:4 según tipo)
    - Badge de tipo: "🎬 Película" o "📚 Libro"
    - Indicador de drag (línea gris centrada arriba del todo)
  
  Sección de info:
    - Título en bold (22px)
    - Rating ⭐ + año + géneros (chips)
    - Sinopsis completa (sin truncar)
    - Autor/Director: etiqueta + valor
  
  Sección watchProviders (solo para movies):
    - Título "Disponible en:" con íconos de plataformas
    - Si watchProviders es [] o vacío → mostrar "No hay información de streaming disponible"
      NUNCA inventar disponibilidad (según PRD §4)
    - Si source es "tmdb" → mostrar atribución: "Datos de streaming por TMDB"
  
  Tres botones flotantes fijos en la parte inferior:
    - "💾 Guardar" (verde): llama a POST /api/collections con listName: "Guardados"
      → al éxito: mostrar toast "¡Guardado!" y llamar onSaved()
    - "✕ No me interesa" (gris): llama a POST /api/swipe con action: "dislike"
      → al éxito: llamar onDislike() y cerrar el sheet
    - "↗ Compartir" (azul): usar Web Share API (navigator.share) si está disponible,
      sino copiar link al portapapeles y mostrar toast "Link copiado"

TAREA 2 — Documentar interfaz de integración para Monserrat
⚠️ NO modificar SwipeDeck.jsx — ese archivo es de Monserrat Miranda.
DetailSheet.jsx es un componente standalone. Deja este comentario JSDoc al inicio del archivo
para que Monserrat sepa exactamente cómo integrarlo:

/**
 * DetailSheet — Instrucciones de integración para Monserrat Miranda (SwipeDeck.jsx):
 *
 * 1. En SwipeDeck.jsx, agregar estado:
 *      const [selectedContentId, setSelectedContentId] = useState(null)
 *
 * 2. En el onClick de ContentCard:
 *      onClick={() => setSelectedContentId(item.contentId)}
 *
 * 3. Renderizar al final del JSX de SwipeDeck:
 *      <DetailSheet
 *        isOpen={!!selectedContentId}
 *        contentId={selectedContentId}
 *        onClose={() => setSelectedContentId(null)}
 *        onSaved={() => setSelectedContentId(null)}
 *        onDislike={() => setSelectedContentId(null)}
 *      />
 *
 * Props: { contentId: string, isOpen: bool, onClose: fn, onSaved: fn, onDislike: fn }
 */

TAREA 3 — Manejo de errores
  - Si el fetch falla: mostrar "No se pudo cargar el detalle. Intenta de nuevo." dentro del sheet
  - Si POST /api/collections falla: mostrar toast de error "No se pudo guardar. Intenta de nuevo."
  - Si el share falla: fallback silencioso a copiar al portapapeles

Muéstrame las tres acciones funcionando con datos mock al terminar.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-marina-detail-sheet.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Marina García del Buey"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-3]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: NO modificaste SwipeDeck.jsx (es de Monserrat). Las props de DetailSheet son: {contentId, isOpen, onClose, onSaved, onDislike}.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/components/DetailSheet.jsx` — slide-up, no destruye el SwipeDeck
- [ ] Sinopsis completa (sin truncar) + watchProviders o placeholder neutro
- [ ] Atribución TMDB visible cuando aplica
- [ ] "💾 Guardar" → POST /api/collections + toast de confirmación
- [ ] "✕ No me interesa" → POST /api/swipe dislike
- [ ] "↗ Compartir" → Web Share API con fallback
- [ ] Integrado: tocar ContentCard abre el sheet
- [ ] Probado en móvil (gestos táctiles)
