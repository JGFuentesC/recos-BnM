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

---

## 🧪 QA Physical Testing — Tu asignación (Jun 13–15, 2026)

> **Eres parte del equipo de QA/Testing.** Cubres las secciones más complejas: DetailSheet, seguridad de Firestore, PWA y casos borde. Usa `Book-recos-BnM_Vault/PHYSICAL_TEST_VALIDATION.md` para documentar resultados.
>
> **Ejecutar en:** Chrome DevTools con responsive 375px (iPhone SE) + modo avión para las pruebas de PWA.

### 📋 Tus secciones asignadas: 34 casos

---

#### Sección 6 — HU4.1 DetailSheet (16 casos: D-01 a D-16)

**Prerequisito:** estar en /feed con tarjetas cargadas.

```
☐ D-01: Tocar (tap) tarjeta sin arrastrar → bottom sheet sube desde abajo con animación suave (300ms ease-out)
☐ D-02: Al abrir el sheet → spinner de carga visible mientras obtiene detalle
☐ D-03: Esperar que cargue → aparece: portada (16:9 movie / 3:4 book), badge tipo, título, ⭐ rating, año, chips géneros, sinopsis completa
☐ D-04: Revisar sección "Director:" o "Autor:" → nombre correcto según el tipo
☐ D-05: Abrir detalle de película → sección "Disponible en:" con plataformas OR texto "No hay información de streaming disponible"
☐ D-06: Abrir detalle de libro → NO aparece sección "Disponible en:"
☐ D-07: Ver los 3 botones en la parte inferior → "✕ No me interesa" (gris), "💾 Guardar" (verde), "↗ Compartir" (azul) — todos visibles sin scroll
☐ D-08: Presionar "✕ No me interesa" → sheet se cierra con animación (200ms), tarjeta desaparece del deck
☐ D-09: Presionar "💾 Guardar" → toast verde "¡Guardado!" y sheet se cierra
☐ D-10: Verificar en Firestore tras Guardar → doc en "collections" con userId, contentId, listName: "Guardados"
☐ D-11: Presionar Guardar en ítem ya guardado (409) → NO muestra error, toast "¡Guardado!" igual
☐ D-12: Presionar "↗ Compartir" en móvil → menú nativo de compartir del dispositivo
☐ D-13: Presionar "↗ Compartir" en desktop (sin Web Share API) → toast "Link copiado"
☐ D-14: Tocar el overlay oscuro fuera del sheet → sheet se cierra con animación slide-down
☐ D-15: Hacer scroll dentro del sheet en contenido largo → sheet hace scroll internamente sin cerrarse
☐ D-16: Abrir el sheet y luego hacer swipe en el deck → stack de swipe intacto al cerrar el sheet
```

---

#### Sección 9 — Firestore Seguridad (3 casos: FS-01 a FS-03)

**Prerequisito:** tener 2 cuentas de prueba distintas. Token del usuario A.

```
☐ FS-01: GET /api/collections?userId={otro_uid} con token del usuario A → HTTP 403 o array vacío
☐ FS-02: DELETE /api/collections/{id_de_otro} con token del usuario A → HTTP 403 o 404
☐ FS-03: Firebase Console → intentar escribir en "content" directamente (sin credenciales de ingest) → rechazado por reglas
```

> ⚠️ FS-01 y FS-02 verifican aislamiento de datos entre usuarios. Un fallo aquí es bug de ALTA severidad.

---

#### Sección 10 — PWA / Service Worker (5 casos: W-01 a W-05)

**Ejecutar en Chrome desktop o Chrome Android.**

```
☐ W-01: Chrome mobile/desktop → revisar si aparece banner "Instalar app" o opción "Añadir a pantalla de inicio"
☐ W-02: Instalar la PWA → abre desde ícono del home screen sin barra del browser (modo standalone)
☐ W-03: Navegar por la app → activar modo avión → shell de la app (login/feed) carga desde caché
☐ W-04: Chrome DevTools → Application → Service Workers → SW de sw.js está activo y registrado
☐ W-05: Chrome DevTools → Application → Manifest → manifest.json válido, nombre "recos-BnM", íconos presentes
```

---

#### Sección 12 — Casos borde y estrés (10 casos: CE-01 a CE-10)

```
☐ CE-01: App en pantalla 375px (iPhone SE) → todo el contenido legible y usable sin scroll horizontal
☐ CE-02: Tarjeta con sinopsis >200 chars en ContentCard → truncada a 3 líneas con "..." (CSS line-clamp)
☐ CE-03: Tarjeta con >3 géneros (5 géneros) → solo se muestran 3 + chip "+2"
☐ CE-04: Tarjeta sin imagen de portada (cover: null) → placeholder con gradiente y título centrado
☐ CE-05: Película sin watchProviders → DetailSheet muestra "No hay información de streaming disponible" (cursiva)
☐ CE-06: Swipe muy rápido de varias tarjetas seguidas → sin duplicados, sin crash, índice avanza correctamente
☐ CE-07: Cerrar y reabrir DetailSheet rápidamente (doble tap) → NO se abren dos sheets simultáneos
☐ CE-08: Desconectar red durante swipe (POST /api/swipe falla) → swipe ocurre visualmente igual, app no se traba
☐ CE-09: Sesión de Google expirada (token vencido) → app redirige a /login automáticamente
☐ CE-10: Ingresar a /mock-feed sin autenticación → la página carga (es pública, no tiene ProtectedRoute)
```

---

### 📝 Cómo registrar bugs

Cuando un caso falla:

1. Marca con ❌ en `PHYSICAL_TEST_VALIDATION.md`
2. Registra en §14:
```
| BUG-XXX | NEW | Sección 6 DetailSheet | D-07 | [descripción] | Alta/Media/Baja | — | Marina |
```
3. Abre Claude Code con el prompt del §14

### ✅ Checklist QA Marina

- [ ] Sección 6 DetailSheet: 16/16 casos ejecutados y documentados
- [ ] Sección 9 Firestore Security: 3/3 casos ejecutados
- [ ] Sección 10 PWA/SW: 5/5 casos ejecutados
- [ ] Sección 12 Casos borde: 10/10 casos ejecutados
- [ ] Bugs encontrados registrados en §14
- [ ] Resumen completado en §15A (columnas DetailSheet + Firestore + PWA + Casos borde)
