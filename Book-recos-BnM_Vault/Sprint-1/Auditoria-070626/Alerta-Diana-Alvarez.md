---
persona: "Diana Álvarez"
prioridad: "⚠️ Pendiente — única persona sin entregar"
tipo: ["sin-iniciar"]
fecha: "2026-06-07"
updated: "2026-06-10"
estado: "pendiente"
---

# ⚠️ Alerta — Diana Álvarez (AÚN PENDIENTE al cierre 2026-06-10)

## Estado al cierre del Sprint

- **Sin entrega** — solo existe `frontend/src/pages/LibraryPlaceholder.jsx` en main (creado por Andrés)
- **Sin rama activa** — no existe `feat/diana` ni ningún branch con su trabajo
- **Placeholder:** muestra texto `"Pendiente de implementacion por Diana."`

Diana es la **única persona del equipo que no entregó** en Sprint 1.

## Entregables planificados (Wave 4)
- ❌ `frontend/src/pages/Library.jsx` — página de biblioteca personal
- ❌ `frontend/src/tests/Library.test.jsx` — mínimo 3 tests

## Dependencias de entrada — todas resueltas

| Dependencia | Estado |
|---|---|
| `GET /api/collections` (Imanol, PR #30) | ✅ Disponible |
| `ContentCard.jsx` (Edgar, PR #26) | ✅ Disponible |
| Auth context (Andrés) | ✅ Disponible |
| `useFeed` context (Juan Carlos) | ✅ Disponible |

**Todas las dependencias están en main.** Diana puede empezar desde cero usando `LibraryPlaceholder.jsx` como base.

## Entregable mínimo requerido

```jsx
// frontend/src/pages/Library.jsx
// Muestra los contenidos guardados del usuario (colecciones)
// Consumir: GET /api/collections?userId=<uid>
// Agrupar por contentType (películas / libros)
// Mostrar tarjeta básica por ítem (título, cover, rating)
// Estado vacío si no hay colecciones
```

## Fecha límite
~~**Miércoles 10 jun 2026** — quedan 3 días.~~  
**Sprint 1 CERRADO** — Diana no entregó. Escalar a Edgar (PM) para definir si el entregable pasa a Sprint 2 o si se asigna a otro colaborador.

## Entregable mínimo para Sprint 2

```jsx
// frontend/src/pages/Library.jsx
// Puede partir de LibraryPlaceholder.jsx ya en main
// Consumir: GET /api/collections?userId=<uid>
// Mostrar ítems agrupados por contentType (películas / libros)
// Estado vacío si no hay colecciones
```
