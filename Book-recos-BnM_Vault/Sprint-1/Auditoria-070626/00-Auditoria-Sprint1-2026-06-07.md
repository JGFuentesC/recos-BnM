---
project: "Recos-BnM"
date: "2026-06-07"
type: "sprint-audit"
auditor: "Claude Code (claude-sonnet-4-5) + Luis Téllez Domínguez"
sprint: 1
tags: [auditoria, sprint-1, dependencias, inconsistencias]
---

# Auditoría Sprint 1 — 2026-06-07

> Comparación entre entregables planificados (archivos Sprint-1/) y estado real del repositorio.

---

## Resumen ejecutivo

| Estado | Personas | Notas |
|---|---|---|
| ✅ Entregado y mergeado | 5 | Israel, Andrés, Manuel, Juan Carlos, Luis |
| ⚠️ Parcial / con observaciones | 2 | Germán (CI/CD), Edgar (solo Vault, no ContentCard) |
| 🔴 Sin iniciar (branch vacío) | 5 | Héctor, Monserrat, Marina, Diana, Ulises |
| 🚨 PR abierto sin mergear | 1 | Imanol (collections — ownership de Christian) |
| 🔴 CRÍTICO — Seguridad | 1 | Juan Carlos — `jc.env` con API keys reales en repo |

**Fecha límite del Sprint:** miércoles 10 jun 2026
**Días restantes:** 3

---

## Estado por persona

### ✅ Wave 0

| Persona | Entregable | Estado | PR |
|---|---|---|---|
| **Israel Pérez** | Schema Firestore, índices, tests stub | ✅ Mergeado | #19 |

### ✅ Wave 1

| Persona | Entregable | Estado | PR |
|---|---|---|---|
| **Andrés González** | `auth.js`, `app.js` scaffold, frontend base | ✅ Mergeado | #16 |
| **Manuel Serranía** | `scoring.js`, pipeline ingest TMDB+Books, 30 tests | ✅ Mergeado | #20 |

### ✅ Wave 2 (Backend)

| Persona | Entregable | Estado | PR |
|---|---|---|---|
| **Luis Téllez** | `feed.js`, `swipe.js`, 12 tests | ✅ Mergeado | #24 |
| **Héctor Morales** | `content.js`, `collections.js` | 🔴 Sin iniciar | — |
| **Christian Ruiz** | `GET /api/collections` (read) | 🚨 Imanol lo implementó, sin mergear | #21 |

### ⚠️ Wave 2 (Infra/Docs)

| Persona | Entregable | Estado | PR |
|---|---|---|---|
| **Edgar Coronel** (dev) | `ContentCard` component | 🔴 Solo hizo actualizaciones al Vault | #18 |
| **Juan Carlos Macías** | `Onboarding`, `TabSelector`, `FeedContext` | ✅ Mergeado — ⚠️ `jc.env` con API keys | #22 |
| **Germán Pacheco** | CI/CD GitHub Actions, PWA manifest, sw.js | ⚠️ PR #17 mergeado, branch tiene 2 commits extra | — |

### 🔴 Wave 3

| Persona | Entregable | Estado |
|---|---|---|
| **Monserrat Miranda** | `SwipeDeck` component | 🔴 Sin iniciar — ahora desbloqueada por Luis |
| **Marina García** | `DetailSheet` component | 🔴 Sin iniciar |

### 🔴 Wave 4

| Persona | Entregable | Estado |
|---|---|---|
| **Diana Álvarez** | `Library.jsx` page | 🔴 Sin iniciar |

### 🔴 Wave 5

| Persona | Entregable | Estado |
|---|---|---|
| **Ulises Chaparro** | QA docs, casos de prueba | 🔴 Sin iniciar |

---

## Inconsistencias detectadas

### 1. 🚨 SEGURIDAD — `jc.env` con API keys reales en repo
- **Archivo:** `jc.env` en la raíz del repo (commiteado por Juan Carlos, PR #22)
- **Contiene:** `TMDB_API_KEY`, `GOOGLE_BOOKS_API_KEY`, `VITE_FIREBASE_API_KEY` y credenciales Firebase reales
- **Riesgo:** Las claves son públicas en GitHub, pueden ser scrapeadas y abusadas
- **Acción requerida:** Ver → `Alerta-JuanCarlos-Macias.md`

### 2. Ownership confuso en `/api/collections`
- El sprint asigna `GET /api/collections` a Christian Ruiz y `POST/PATCH/DELETE` a Héctor Morales
- Imanol Ruiz implementó el CRUD completo (PR #21, sin mergear)
- Héctor tiene branch vacío
- **Riesgo:** Conflicto de código si Héctor empieza a trabajar sin saber que Imanol ya lo hizo
- **Acción requerida:** Ver → `Alerta-Christian-Ruiz.md` y `Alerta-Hector-Morales.md`

### 3. Edgar Coronel — dos roles, un solo entregable
- Edgar actúa como PM (mergea PRs) Y como dev (ContentCard)
- El ContentCard nunca se implementó — su branch solo tiene actualizaciones al Vault
- **Riesgo:** Monserrat necesita el ContentCard para mostrar contenido en el SwipeDeck
- **Acción requerida:** Ver → `Alerta-Edgar-Coronel.md`

### 4. Germán Pacheco — branch con commits sin mergear
- PR #17 mergeado correctamente, pero `feature/cicd/german` tiene 2 commits adicionales no incluidos
- Los commits extra son correcciones al CI/CD (`fix(cicd): corregir working directory`)
- **Riesgo:** El pipeline de CI puede fallar si esas correcciones no están en main
- **Acción requerida:** Ver → `Alerta-German-Pacheco.md`

### 5. `jc.env` commiteado en raíz del repo
- Archivos `PRD.md` y `sprint.md` también en la raíz (deberían estar en `docs/` o en el Vault)
- **Acción requerida:** Ver → `Alerta-JuanCarlos-Macias.md`

---

## Dependencias críticas bloqueadas

```
Luis ✅ → Monserrat (SwipeDeck)     🔴 SIN INICIAR — bloqueante para demo
Luis ✅ → Héctor (content.js)       🔴 SIN INICIAR
Edgar  → Monserrat (ContentCard)    🔴 SIN INICIAR — Monserrat lo necesita
Héctor → Christian (collections)    🔴 SIN INICIAR (Imanol cubrió parcialmente)
Wave 3 → Ulises (QA)                🔴 Bloqueado hasta que haya UI
```

---

## Áreas de mejora

1. **Tests de integración** — Solo existen unit tests con mocks. Falta una suite contra el emulador real.
2. **`app.js` crecimiento no coordinado** — Cada route owner necesita agregar líneas a `app.js`. Debería usarse un `index.js` de rutas para evitar conflictos.
3. **Variables de entorno sin documentar** — `jc.env` expuso que el equipo no tiene un proceso claro de gestión de `.env` files.
4. **Ausencia de `content.js`** — El endpoint `GET /api/content/:id` no existe aún, lo que afecta al DetailSheet de Marina.
5. **Falta `filter` en feed** — El feed no soporta filtrado por `watchProviders`, previsto en el PRD §5.

---

## Archivos de alerta generados

| Archivo | Persona | Prioridad |
|---|---|---|
| `Alerta-JuanCarlos-Macias.md` | Juan Carlos | 🚨 URGENTE — seguridad |
| `Alerta-Hector-Morales.md` | Héctor | 🔴 Alta |
| `Alerta-Monserrat-Miranda.md` | Monserrat | 🔴 Alta |
| `Alerta-Edgar-Coronel.md` | Edgar (dev) | 🔴 Alta |
| `Alerta-Christian-Ruiz.md` | Christian | 🟡 Media |
| `Alerta-German-Pacheco.md` | Germán | 🟡 Media |
| `Alerta-Marina-Garcia.md` | Marina | 🟡 Media |
| `Alerta-Diana-Alvarez.md` | Diana | 🟠 Normal |
| `Alerta-Ulises-Chaparro.md` | Ulises | 🟠 Normal |
