---
persona: "Christian Ruiz / Imanol Ruiz"
prioridad: "✅ Resuelto"
tipo: ["ownership-conflicto", "PR-pendiente"]
fecha: "2026-06-07"
updated: "2026-06-10"
estado: "resuelto"
---

# ✅ Alerta — Christian Ruiz (RESUELTO 2026-06-10)

## Estado al cierre del Sprint

- **PR #30** (2026-06-08): `collections.js` CRUD completo + tests mergeados por Imanol Ruiz
- **PR #21**: cerrado sin mergear (duplicado de PR #30)
- DevLog `2026-06-07-christian-collections-api.md` acreditando el trabajo a Christian

## Entregables planificados (Wave 2)
- ✅ `backend/src/routes/collections.js` — CRUD completo mergeado PR #30
- ✅ `backend/tests/collections.test.js` — mergeado PR #30
- ✅ DevLog — mergeado en PR #30

## Estado original (2026-06-07)
**Imanol Ruiz (colaborador externo) implementó el CRUD completo** de `/api/collections` en PR #21 (pendiente de merge). Esto incluía el `GET` que correspondía a Christian.

## Situación de ownership

| Endpoint | Asignado a | Implementado por | Estado |
|---|---|---|---|
| `GET /api/collections` | Christian Ruiz | Imanol Ruiz | PR #21 sin mergear |
| `POST /api/collections` | Héctor Morales | Imanol Ruiz | PR #21 sin mergear |
| `PATCH /api/collections/:id` | Héctor Morales | Imanol Ruiz | PR #21 sin mergear |
| `DELETE /api/collections/:id` | Héctor Morales | Imanol Ruiz | PR #21 sin mergear |

## Decisión requerida (Edgar como PM)

**Opción A — Aceptar el trabajo de Imanol:**
- Mergear PR #21
- Christian y Héctor revisan el código y añaden tests si faltan
- Acreditar a Imanol en el DevLog

**Opción B — Christian implementa su parte:**
- Christian implementa `GET /api/collections` desde cero o toma el código de Imanol como base
- Héctor implementa el resto
- Cerrar el PR #21 sin mergear

**Recomendación:** Opción A — el código de Imanol ya tiene tests completos. Evita duplicar trabajo a 3 días del deadline.

## Acción mínima requerida de Christian
- Revisar `backend/src/routes/collections.js` del PR #21
- Confirmar que cumple el contrato del sprint
- Crear DevLog de la revisión
- Notificar a Edgar (PM) la decisión

## Fecha límite
~~**Miércoles 10 jun 2026** — quedan 3 días.~~ ✅ Entregado antes del cierre (Imanol cubrió).
