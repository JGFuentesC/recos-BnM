---
persona: "Christian Ruiz"
prioridad: "🟡 Media"
tipo: ["ownership-conflicto", "PR-pendiente"]
fecha: "2026-06-07"
wave: 2
---

# 🟡 Alerta — Christian Ruiz

## Entregables planificados (Wave 2)
- ❌ `GET /api/collections` — listar colecciones del usuario

## Estado actual
**Imanol Ruiz (colaborador externo) implementó el CRUD completo** de `/api/collections` en PR #21 (pendiente de merge). Esto incluye el `GET` que correspondía a Christian.

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
**Miércoles 10 jun 2026** — quedan 3 días.
