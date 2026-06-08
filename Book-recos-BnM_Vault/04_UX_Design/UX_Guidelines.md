---
project: "Recos-BnM"
owner: "Equipo UI (Edgar, Monserrat, Marina, Juan Carlos, Diana)"
status: "Draft"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [ux, design-system, pwa]
---

# UX Guidelines — Recos-BnM

> Sistema de diseño propuesto para la PWA. Basado en la naturaleza del producto: app de descubrimiento de contenido de entretenimiento (películas y libros), mobile-first, centrada en gestos de swipe.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Filosofía de diseño

| Principio | Descripción |
|---|---|
| **Content is the hero** | Las portadas/covers ocupan ≥60% de la tarjeta. El contenido atrae, no la UI. |
| **Dark-first** | Fondos oscuros hacen que las imágenes brillen. Igual que Netflix/Letterboxd. |
| **Touch-first** | Todo elemento interactivo mínimo 48px. Diseñado para el pulgar, no para el cursor. |
| **Instant feedback** | Cada interacción tiene respuesta visual < 100ms (no dejar al usuario en el limbo). |
| **Progressive disclosure** | Feed muestra lo mínimo (portada + rating). El detalle se revela al tocar. |
| **Sin inventar datos** | Si un dato no existe (ej. watchProviders vacío), mostrar placeholder honesto. |

---

## Paleta de colores

> **Propuesta generada por Claude Code** basada en el tipo de producto (entretenimiento, inmersivo, mobile).  
> Marca la tarea como REVISADA cuando el equipo confirme o ajuste estos valores.

### Fondo y superficies (Dark theme)

| Token | HEX | Uso |
|---|---|---|
| `--color-bg` | `#0F0E17` | Fondo de toda la app |
| `--color-surface` | `#1A1826` | Fondo de tarjetas (ContentCard) |
| `--color-surface-elevated` | `#242235` | Modales, bottom sheets (DetailSheet) |
| `--color-border` | `#2E2B3D` | Bordes y divisores |

### Texto

| Token | HEX | Uso |
|---|---|---|
| `--color-text-primary` | `#FFFFFE` | Títulos, texto principal |
| `--color-text-secondary` | `#A7A9BE` | Subtítulos, géneros, metadata |
| `--color-text-disabled` | `#6B6985` | Placeholders, texto inactivo |

### Colores de acento

| Token | HEX | Uso |
|---|---|---|
| `--color-accent` | `#6C63FF` | Color primario (botones, tabs activos, focus) |
| `--color-like` | `#2CB67D` | Swipe derecha / like (verde) |
| `--color-dislike` | `#FF4D4D` | Swipe izquierda / dislike (rojo) |
| `--color-save` | `#FF9F1C` | Guardar en biblioteca (naranja/gold) |
| `--color-movies` | `#6C63FF` | Badge de tipo película (accent primario) |
| `--color-books` | `#4ECDC4` | Badge de tipo libro (teal) |
| `--color-tmdb` | `#01B4E4` | Badge de fuente TMDB (azul TMDB oficial) |

### Estados

| Token | HEX | Uso |
|---|---|---|
| `--color-success` | `#2CB67D` | Confirmaciones, guardado exitoso |
| `--color-warning` | `#FF9F1C` | Alertas no críticas |
| `--color-error` | `#FF4D4D` | Errores, validaciones |

---

## Tipografía

### Fuentes

| Fuente | Uso | CDN |
|---|---|---|
| **Inter** | UI general (botones, labels, body, chips) | `fonts.google.com/specimen/Inter` |
| **Playfair Display** | Títulos de películas/libros en el feed y detalle | `fonts.google.com/specimen/Playfair+Display` |

```css
/* En index.html o global CSS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
```

### Escala tipográfica

| Token | Tamaño | Peso | Uso |
|---|---|---|---|
| `--text-xs` | 11px | 400 | Metadata muy pequeña (fecha, fuente) |
| `--text-sm` | 13px | 400/500 | Géneros chip, labels |
| `--text-base` | 15px | 400 | Body text, synopsis |
| `--text-md` | 17px | 500 | Subtítulos |
| `--text-lg` | 20px | 600 (Inter) | Secciones, nombres de listas |
| `--text-xl` | 24px | 700 (Playfair) | Título en ContentCard |
| `--text-2xl` | 30px | 700 (Playfair) | Título en DetailSheet |

---

## Espaciado (base 4px)

```css
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px   ← padding estándar de tarjetas
--space-6:  24px   ← separación entre secciones
--space-8:  32px
--space-12: 48px
--space-16: 64px
```

---

## Bordes redondeados

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8px | Chips, tags pequeños |
| `--radius-md` | 12px | Botones |
| `--radius-lg` | 16px | ContentCard |
| `--radius-xl` | 24px | Bottom sheets (solo esquinas superiores) |
| `--radius-full` | 9999px | Badges de tipo (píldora) |

---

## Animaciones y movimiento

| Elemento | Animación | Duración | Easing |
|---|---|---|---|
| ContentCard (entrada) | `opacity: 0→1` + `translateY(20px→0)` | 200ms | `ease-out` |
| ContentCard (swipe) | Spring physics (framer-motion o react-tinder-card) | — | Spring |
| Indicador LIKE | `opacity: 0→1` al arrastrar derecha | 100ms | `ease` |
| Indicador SKIP | `opacity: 0→1` al arrastrar izquierda | 100ms | `ease` |
| DetailSheet (abrir) | `translateY(100%→0)` + overlay `opacity: 0→0.5` | 300ms | `ease-out` |
| DetailSheet (cerrar) | `translateY(0→100%)` + overlay `opacity: 0.5→0` | 200ms | `ease-in` |
| Tab Selector | Color transition | 200ms | `ease-in-out` |
| Toast/Snackbar | `translateY(100%→0)` → auto-hide 2.5s | 250ms | `ease-out` |

**Regla:** Nunca animar más de 3 elementos simultáneamente. Menos es más.

---

## Componentes clave

### ContentCard
- Altura: `min-height: 75vh` (llena casi toda la pantalla)
- Borde: `border-radius: var(--radius-lg)` (16px)
- Portada: 60% superior de la tarjeta
- Gradiente sobre portada: `linear-gradient(transparent 40%, rgba(15,14,23,0.95) 100%)`
- Badge tipo: esquina superior derecha, fondo semi-transparente

### SwipeDeck (stack de tarjetas)
- Máximo 3 tarjetas visibles apiladas
- Tarjeta activa: `scale(1)`, `z-index: 3`
- Segunda: `scale(0.97)`, `z-index: 2`, desplazada 8px abajo
- Tercera: `scale(0.94)`, `z-index: 1`, desplazada 16px abajo

### DetailSheet (bottom sheet)
- `border-radius: 24px 24px 0 0` (solo esquinas superiores)
- Drag indicator: línea gris centrada, 40px wide, 4px tall, `border-radius: 2px`
- Overlay: `rgba(0,0,0,0.5)`, tap to close

### BottomNav
- `height: 64px` + `padding-bottom: env(safe-area-inset-bottom)` (para iPhone)
- Fondo: `var(--color-surface-elevated)` + `backdrop-filter: blur(12px)`
- 3 tabs: Descubrir, Biblioteca, Perfil

---

## Tamaños de pantalla objetivo

| Dispositivo | Ancho | Notas |
|---|---|---|
| iPhone SE | 375px | **Mínimo soported** — todo debe funcionar aquí |
| iPhone 14 | 390px | Referencia principal de diseño |
| Android estándar | 360–412px | Compatible con el sistema |
| Tablet / Desktop | ≥768px | PWA responsive, centrado con max-width 430px |

```css
/* Para centrar la app en pantallas grandes */
.app-wrapper {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100dvh;
}
```
