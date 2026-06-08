---
persona: "Diana Álvarez"
prioridad: "🟠 Normal"
tipo: ["sin-iniciar"]
fecha: "2026-06-07"
wave: 4
---

# 🟠 Alerta — Diana Álvarez

## Entregables planificados (Wave 4)
- ❌ `frontend/src/pages/Library.jsx` — página de biblioteca personal
- ❌ `frontend/src/tests/Library.test.jsx` — mínimo 3 tests

## Estado actual
No tiene branch activo con código. Existe `LibraryPlaceholder.jsx` creado por Andrés como placeholder.
**No hay implementación real.**

## Dependencias de entrada

| Dependencia | Estado |
|---|---|
| `GET /api/collections` (Christian/Imanol) | 🚨 PR #21 sin mergear |
| Auth context (Andrés) | ✅ Disponible |

**Puede empezar** usando `LibraryPlaceholder.jsx` como base y datos mock mientras se resuelve el PR #21.

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
**Miércoles 10 jun 2026** — quedan 3 días.
Es Wave 4, depende de Wave 3 (Monserrat, Marina). Prioridad menor que ellas, pero debe arrancar ya.
