---
persona: "Marina García"
prioridad: "🟡 Media"
tipo: ["sin-iniciar", "dependencia-pendiente"]
fecha: "2026-06-07"
wave: 3
---

# 🟡 Alerta — Marina García

## Entregables planificados (Wave 3)
- ❌ `frontend/src/components/DetailSheet/DetailSheet.jsx`
- ❌ `frontend/src/tests/DetailSheet.test.jsx` — mínimo 3 tests

## Estado actual
Branch `feat/Marina` solo contiene el archivo de contributor.
**No hay código implementado.**

## Dependencia de entrada pendiente

El DetailSheet necesita `GET /api/content/:id` para cargar el detalle completo de un ítem.

| Dependencia | Estado |
|---|---|
| `GET /api/content/:id` (Héctor) | 🔴 Sin implementar |

**Opción mientras espera:** Implementar el componente con datos mock del feed (`feed.mock.js`). La estructura de datos del feed ya incluye todos los campos necesarios: `title`, `cover`, `genres`, `rating`, `synopsis`, `type`. Conectar al endpoint real cuando Héctor entregue.

## Entregable mínimo requerido

```jsx
// frontend/src/components/DetailSheet/DetailSheet.jsx
// Props esperadas:
// { contentId, title, cover, genres, rating, synopsis, type, year?, watchProviders? }

// Debe mostrar:
// - Imagen de portada grande
// - Título y año
// - Rating prominente
// - Géneros
// - Sinopsis completa
// - watchProviders (si type === "movie")
// - Botón cerrar (bottom sheet pattern)
```

**Referencia de diseño:** `stitch_app_specification_blueprint/` en la raíz del repo.

## Fecha límite
**Miércoles 10 jun 2026** — quedan 3 días.
