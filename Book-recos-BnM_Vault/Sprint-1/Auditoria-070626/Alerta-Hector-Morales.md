---
persona: "Héctor Morales"
prioridad: "🔴 Alta"
tipo: ["sin-iniciar", "dependencia-bloqueada"]
fecha: "2026-06-07"
wave: 2
---

# 🔴 Alerta — Héctor Morales

## Entregables planificados (Wave 2)
- ❌ `backend/src/routes/content.js` — `GET /api/content/:id`
- ❌ `backend/tests/content.test.js` — mínimo 3 tests

## Estado actual
Branch `feat/hrmm` solo contiene el archivo de contributor (`hector.txt`).
**No hay código implementado.**

## Problema de ownership con collections

El sprint asignaba a Héctor:
- `POST /api/collections` — crear colección
- `PATCH /api/collections/:id` — actualizar
- `DELETE /api/collections/:id` — eliminar

Sin embargo, **Imanol Ruiz implementó el CRUD completo** de `/api/collections` (PR #21, pendiente de merge). Esto crea un conflicto de ownership.

**Resolución recomendada:**
1. Coordinar con Edgar (PM) para definir si Imanol cubre todo collections o si Héctor retoma parte
2. Si Imanol cubre collections → Héctor enfoca el 100% en `content.js`
3. Si Héctor asume collections → revisar el PR #21 de Imanol antes de duplicar trabajo

## Entregable mínimo requerido — `content.js`

```
GET /api/content/:id
  - authMiddleware aplicado
  - Retorna doc de Firestore content/{contentId}
  - 404 si no existe
  - 200 con { contentId, title, cover, genres, rating, synopsis, type, year, watchProviders }
  - 500 si falla Firestore
```

**Imports disponibles:**
```js
const authMiddleware = require('../middleware/auth')
const { db } = require('../firebase/admin')  // ← usar admin.firestore()
```

**Registrar en app.js** (coordinar con Andrés):
```js
app.use('/api/content', require('./routes/content'))
```

## Dependencias de salida bloqueadas
| Quién espera | Qué necesita |
|---|---|
| **Marina García** | `GET /api/content/:id` para el DetailSheet |
| **Ulises Chaparro** | Endpoint disponible para QA |

## Fecha límite
**Miércoles 10 jun 2026** — quedan 3 días.
