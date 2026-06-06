---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [ux, screens, specs, design]
---

# Screen Specs — Recos-BnM

> Especificaciones por pantalla del MVP. Para el sistema de diseño base ver [[04_UX_Design/UX_Guidelines|UX Guidelines]].  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Pantallas del MVP

| Pantalla | Ruta | Épica | Responsable |
|---|---|---|---|
| [[04_UX_Design/Screen_Specs#login|Login / Registro]] | `/login` | Épica 1 | [[Sprint-1/02-Andres-Gonzalez\|Andrés]] |
| [[04_UX_Design/Screen_Specs#onboarding|Onboarding]] | `/onboarding` | Épica 1 | [[Sprint-1/08-Juan-Carlos-Macias\|Juan Carlos]] |
| [[04_UX_Design/Screen_Specs#feed|Feed Principal]] | `/feed` | Épicas 2+3 | [[Sprint-1/10-Monserrat-Miranda\|Monserrat]] + [[Sprint-1/07-Edgar-Coronel\|Edgar]] |
| [[04_UX_Design/Screen_Specs#detail|Detail Sheet]] | modal sobre `/feed` | Épica 4 | [[Sprint-1/11-Marina-Garcia\|Marina]] |
| [[04_UX_Design/Screen_Specs#library|Biblioteca]] | `/library` | Épica 5 | [[Sprint-1/12-Diana-Alvarez\|Diana]] |

---

## Login / Registro {#login}

**Responsable:** [[Sprint-1/02-Andres-Gonzalez|Andrés González]]

### Layout

```
┌─────────────────────────────┐
│                             │
│     [Logo / Brand mark]     │  ← centrado, 120px alto
│                             │
│  Descubre tu próxima        │
│  película o libro favorito  │  ← tagline, centrado, Inter 18px
│                             │
│  ┌───────────────────────┐  │
│  │ 📧 Email              │  │  ← input, 52px alto
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ 🔒 Contraseña         │  │  ← input, 52px alto
│  └───────────────────────┘  │
│                             │
│  [Iniciar sesión]           │  ← botón primario, --color-accent
│                             │
│  ──────── o ────────        │
│                             │
│  [G Continuar con Google]   │  ← botón secundario, outlined
│                             │
│  ¿No tienes cuenta?         │
│  [Crear cuenta]             │  ← toggle al modo Registro
│                             │
└─────────────────────────────┘
```

### Especificaciones

| Elemento | Especificación |
|---|---|
| Fondo | `--color-bg: #0F0E17` |
| Logo | SVG, máx 120px de alto, centrado |
| Tagline | Inter 18px, `--color-text-secondary` |
| Inputs | Alto 52px, border-radius 12px, `--color-surface` fondo |
| Input focus | Border `--color-accent`, sin outline extra |
| Botón primario | `--color-accent`, border-radius 12px, 52px alto, Inter 16px bold |
| Botón Google | Outlined, border `--color-border`, fondo transparente |
| Validación email | En tiempo real, mensaje debajo del input en rojo |
| Estado error | Toast en la parte superior, 3 segundos |

### Flujo

1. Aterriza en Login por defecto
2. Toggle "Crear cuenta" → muestra campo de confirmación de contraseña
3. Login exitoso → redirect a `/onboarding` si `cold_start_done === false`, sino a `/feed`
4. Google Auth → mismo comportamiento

---

## Onboarding {#onboarding}

**Responsable:** [[Sprint-1/08-Juan-Carlos-Macias|Juan Carlos Macías]]

### Layout

```
┌─────────────────────────────┐
│ [●●●○○○○○○○]  Paso 3 de 10 │  ← barra de progreso
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │    [Portada grande]   │  │  ← imagen 60% del alto
│  │                       │  │
│  │  Inception            │  │
│  │  ⭐ 8.8 · Sci-Fi      │  │
│  │  Sinopsis breve...    │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  ◀ [No] ──────── [Sí] ▶    │  ← botones alternativos al swipe
│                             │
│          [Saltar]           │  ← texto link, centrado
└─────────────────────────────┘
```

### Especificaciones

| Elemento | Especificación |
|---|---|
| Barra de progreso | 8px alto, `--color-accent` fill, esquinas redondeadas |
| Tarjeta | Igual que ContentCard del feed (75vh) |
| Botón saltar | Texto link, `--color-text-secondary`, al centro inferior |
| Final del onboarding | Pantalla de confirmación + selector de géneros adicionales |

### Flujo

1. Mostrar tarjetas pre-seleccionadas (mezcla de películas y libros populares)
2. Swipe/botón para like o dislike — registrado como preferencia de calibración
3. Máx 10 tarjetas, puede saltar cualquiera o todas
4. Al final: selector de géneros (chips multi-select) + búsqueda de autores/directores (opcional)
5. CTA: "Empezar a descubrir" → escribe `cold_start_done: true` → navega a `/feed`

---

## Feed Principal {#feed}

**Responsables:** [[Sprint-1/10-Monserrat-Miranda|Monserrat Miranda]] (SwipeDeck) + [[Sprint-1/07-Edgar-Coronel|Edgar Coronel]] (ContentCard) + [[Sprint-1/08-Juan-Carlos-Macias|Juan Carlos Macías]] (TabSelector)

### Layout

```
┌─────────────────────────────┐
│  [🎬 Películas] [📚 Libros] │  ← TabSelector, 48px alto, sticky top
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │  ← ContentCard (75vh)
│  │   [Portada 60% alto]  │  │
│  │                       │  │
│  │   Inception      8.8⭐│  │
│  │   [Sci-Fi] [Thriller] │  │  ← genre chips
│  │   "Un ladrón que roba │  │
│  │   secretos..."        │  │  ← sinopsis 3 líneas truncadas
│  │                       │  │
│  └───────────────────────┘  │
│  [sombra del siguiente card]│  ← stack effect, escala 0.97
│                             │
│ ┌──────────┐  ┌──────────┐  │
│ │  ✗ No   │  │  ♥ Sí   │  │  ← botones alternativos, 64px
│ └──────────┘  └──────────┘  │
│                             │
│  [🔥] [🔍] [📚]            │  ← BottomNav, 64px alto
└─────────────────────────────┘
```

### ContentCard — Especificaciones

| Elemento | Especificación |
|---|---|
| Alto total | 75vh |
| Portada | 60% del alto de la tarjeta, `object-fit: cover` |
| Border radius | 20px |
| Sombra | `box-shadow: 0 8px 32px rgba(0,0,0,0.4)` |
| Título | Inter 22px bold, color `--color-text` |
| Rating | `⭐ X.X` — Inter 14px, `--color-text-secondary` |
| Genre chips | Fondo `--color-surface`, border-radius 16px, Inter 12px, padding 4px 10px |
| Sinopsis | Inter 14px, 3 líneas, `overflow: hidden`, `text-overflow: ellipsis` |
| Animación entrada | `opacity 0→1, translateY 20px→0`, 200ms ease-out |

### SwipeDeck — Especificaciones

| Elemento | Especificación |
|---|---|
| Stack visual | 3 tarjetas visibles: escala 1 / 0.97 / 0.94, desplazamiento Y 0 / 12px / 24px |
| Swipe threshold | 100px de desplazamiento horizontal |
| Swipe right (like) | Rotación +15deg, color verde `--color-like: #2CB67D` con 60% opacity de fondo |
| Swipe left (dislike) | Rotación -15deg, color rojo `--color-dislike: #FF4D4D` con 60% opacity de fondo |
| Spring physics | `stiffness: 300, damping: 30, mass: 1` |
| Pre-fetch trigger | Al quedar 5 tarjetas en el stack → `GET /api/feed` silencioso |

### TabSelector — Especificaciones

| Elemento | Especificación |
|---|---|
| Alto | 48px, sticky top |
| Fondo | `--color-surface` con blur backdrop |
| Tab activo | Fondo `--color-accent`, texto blanco, border-radius 24px |
| Tab inactivo | Texto `--color-text-secondary`, sin fondo |
| Transición | 200ms ease-out |
| Touch target | Mínimo 44x44px |

---

## Detail Sheet {#detail}

**Responsable:** [[Sprint-1/11-Marina-Garcia|Marina García]]

### Layout

```
┌─────────────────────────────┐
│                             │
│  [Feed con tarjetas visible]│  ← stack normal debajo del sheet
│                             │
│─────────────────────────────│  ← handle bar, 4px, centered
│  [Portada 200px alto]       │  ← sticky al top del sheet
│  Inception                  │  ← Inter 24px bold
│  Christopher Nolan · 2010   │  ← Inter 14px, --color-text-secondary
│  ⭐ 8.8 · [Sci-Fi][Thriller]│
│                             │
│  Sinopsis completa...       │  ← sin truncar
│                             │
│  Disponible en:             │
│  [Netflix] [HBO Max]        │  ← provider logos/chips
│                             │
│  "This product uses the     │  ← atribución TMDB, 11px, muted
│   TMDB API but is not..."   │
│                             │
│  [💾 Guardar][✗ No][📤]    │  ← floating action buttons, 56px
└─────────────────────────────┘
```

### Especificaciones

| Elemento | Especificación |
|---|---|
| Animación apertura | Slide-up, 300ms `cubic-bezier(0.32, 0.72, 0, 1)` |
| Fondo sheet | `--color-bg`, border-radius 24px top |
| Portada | 200px alto, `object-fit: cover`, ancho 100% |
| Handle bar | 4px × 40px, `--color-border`, border-radius 2px, centrado |
| Título | Inter 24px bold |
| Subtítulo | Inter 14px, `--color-text-secondary` |
| Sinopsis | Inter 15px, line-height 1.6, sin truncar |
| Watch providers | Chips con logo/nombre, `--color-surface`, border-radius 8px |
| Placeholder streaming | "Disponibilidad no disponible" si watchProviders vacío |
| Atribución TMDB | Inter 11px, `--color-text-secondary`, solo para source: "tmdb" |
| FABs (Guardar/No/Compartir) | 56px, posición fija bottom 24px, `--color-accent` para Guardar |
| Compartir | Web Share API nativa |

### Comportamiento

- Se abre al tocar la tarjeta en el feed (no destruye el stack)
- Se puede cerrar con swipe hacia abajo o botón ✕
- El botón "Guardar" dispara `POST /api/collections`
- El botón "No me interesa" dispara `POST /api/swipe` con `action: "dislike"` y cierra el sheet

---

## Biblioteca {#library}

**Responsable:** [[Sprint-1/12-Diana-Alvarez|Diana Álvarez]]

### Layout

```
┌─────────────────────────────┐
│  Mi Colección               │  ← título, Inter 24px bold
│                             │
│  [Películas] [Libros]       │  ← filtro tipo, chips
│  [Guardados ▾]              │  ← selector de lista
│                             │
│  ┌───────────────────────┐  │
│  │ [img] Inception    ✎  │  │  ← CollectionItem
│  │        ⭐ 8.8         │  │
│  │        Verla el sábado│  │  ← personalNote (editable inline)
│  │        Para el finde  │  │  ← listName
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ [img] Cien años...  ✎ │  │
│  └───────────────────────┘  │
│  ...                        │
│                             │
│  [🔥] [🔍] [📚]            │  ← BottomNav
└─────────────────────────────┘
```

### CollectionItem — Especificaciones

| Elemento | Especificación |
|---|---|
| Layout | Fila horizontal: imagen 80px cuadrada + contenido + botón editar |
| Imagen | `border-radius: 8px`, `object-fit: cover` |
| Título | Inter 16px medium |
| Rating | Inter 13px, `--color-text-secondary` |
| Nota personal | Inter 13px, itálica, `--color-text-secondary`. Toca para editar inline |
| Edición inline | Cambia a `<textarea>`, auto-save al perder foco |
| Botón editar | Ícono ✎, 24px, `--color-text-secondary` |
| Swipe to delete | Swipe izquierdo sobre el item → botón "Eliminar" rojo |

### Filtros

| Filtro | Tipo | Comportamiento |
|---|---|---|
| Tipo (Películas/Libros) | Chips toggle | Filtra items por `contentType` |
| Lista | Dropdown/selector | Filtra por `listName` |
| Crear lista | Botón "+" | Input de texto → `POST /api/collections` con nuevo `listName` |

---

## BottomNav — Especificaciones globales

**Responsable:** [[Sprint-1/12-Diana-Alvarez|Diana Álvarez]]

| Elemento | Especificación |
|---|---|
| Alto | 64px + safe area insets (iOS/Android) |
| Fondo | `--color-surface` con blur backdrop |
| Ítems | Feed 🔥 · Buscar 🔍 · Biblioteca 📚 |
| Ícono activo | `--color-accent`, tamaño 24px |
| Ícono inactivo | `--color-text-secondary`, tamaño 24px |
| Label | Inter 10px debajo del ícono, solo en activo |
| Touch target | 44px mínimo vertical |
| Posición | `position: fixed; bottom: 0; width: 100%` |
