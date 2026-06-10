---
project: "Recos-BnM"
date: "2026-06-07"
updated: "2026-06-10"
type: "sprint-audit"
auditor: "Claude Code (claude-sonnet-4-6) + Luis Téllez Domínguez"
sprint: 1
tags: [auditoria, sprint-1, dependencias, inconsistencias]
---

# Auditoría Sprint 1 — actualización 2026-06-10

> Primera auditoría: 2026-06-07. Esta versión refleja el estado real al cierre del Sprint (2026-06-10).

---

## Resumen ejecutivo — cierre Sprint 1

| Estado | Personas | Notas |
|---|---|---|
| ✅ Entregado y mergeado | 12 | Todo el equipo excepto Diana |
| ⚠️ Parcial / pendiente | 1 | Diana Álvarez — solo `LibraryPlaceholder.jsx` |
| 🔒 Seguridad resuelta | 1 | Juan Carlos — `jc.env` eliminado del tracking (PR #25) |

**Fecha límite del Sprint:** miércoles 10 jun 2026  
**Porcentaje completado:** 12/13 personas = **92 %**

---

## Estado final por persona

### Wave 0

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Israel Pérez** | Schema Firestore, índices, guía Git, DevLog | ✅ Mergeado | #19, #23, #37 |

### Wave 1

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Andrés González** | `auth.js`, scaffold backend, FeedProvider, App integration | ✅ Mergeado | #16, #27, #28, #32, #35, #39 |
| **Manuel Serranía** | `scoring.js`, ingest pipeline TMDB+Books, 30+ tests | ✅ Mergeado | #20 |

### Wave 2 — Backend

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Luis Téllez** | `feed.js`, `swipe.js`, 12 tests (Jest+supertest), DevLog | ✅ Mergeado | #24 |
| **Héctor Morales** | `content.js`, `content.test.js`, DevLog | ✅ Mergeado | #29, #34 |
| **Imanol Ruiz** *(por Christian)* | `collections.js`, CRUD completo, tests | ✅ Mergeado | #30 |

### Wave 2 — Infra / Docs

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Edgar Coronel** | `ContentCard.jsx`, `ContentCard.test.jsx` (8 tests vitest), DevLogs, QA docs 126+ casos | ✅ Mergeado | #26, #31, #44, #45, #46, #47 |
| **Juan Carlos Macías** | `Onboarding`, `TabSelector`, `FeedContext` | ✅ Mergeado — 🔒 `jc.env` resuelto PR #25 | #22 |
| **Germán Pacheco** | CI/CD pipeline corregido: Node 22, pytest, working-dir, deploy solo en push | ✅ Mergeado | #40, #43 |

### Wave 3

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Monserrat Miranda** | `SwipeDeck.jsx`, integración DetailSheet, 2 DevLogs | ✅ Mergeado | #33, #42 |
| **Marina García** | `DetailSheet.jsx`, DevLog | ✅ Mergeado | #38 |

### Wave 4

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Diana Álvarez** | `Library.jsx` page | ⚠️ Solo `LibraryPlaceholder.jsx` en main — sin rama activa | — |

### Wave 5

| Persona | Entregable | Estado | PRs |
|---|---|---|---|
| **Ulises Chaparro** | QA docs, ROADMAP, API Collection JSON | ✅ Mergeado | #36 |

---

## Inconsistencias al cierre (2026-06-10)

### 1. ⚠️ Diana Álvarez — `Library.jsx` nunca implementada
- **Estado:** Solo existe `frontend/src/pages/LibraryPlaceholder.jsx` en main
- **Contenido del placeholder:** `<p>"Pendiente de implementacion por Diana."</p>`
- **Sin rama activa** — no hay `feat/diana` ni ningún branch con su trabajo
- **Impacto:** La navegación a `/library` muestra un placeholder vacío, no la página real
- **Acción:** Ver → `Alerta-Diana-Alvarez.md` (actualizado)

### 2. ✅ RESUELTO — `jc.env` con API keys (era crítico)
- PR #25 (2026-06-08): `juanmmayen98-pixel` eliminó `jc.env` del tracking y actualizó `.gitignore`
- **Nota:** Las claves ya fueron expuestas públicamente. Confirmar con Juan Carlos que rotó todas las API keys en los paneles de TMDB, Google Books y Firebase

### 3. ✅ RESUELTO — Ownership `/api/collections`
- PR #30 (2026-06-08): Imanol Ruiz mergeó el CRUD completo con tests
- PR #21 cerrado sin conflicto
- La colección `swipes` también existe vía PR #24 (Luis) y PR #33 (Monserrat)

### 4. ✅ RESUELTO — Edgar Coronel ContentCard
- `ContentCard.jsx`, `ContentCard.module.css`, `ContentCard.test.jsx` (8 casos) mergeados
- Edgar también entregó 126+ casos de prueba en `docs/PHYSICAL_TEST_VALIDATION.md` y `QA_Test_Suite.md`

### 5. ✅ RESUELTO — Germán Pacheco CI/CD
- PR #40 y #43: pipeline corregido con Node 22, pytest, working directories y deploy solo en push a main
- **Nota pendiente:** El secret `FIREBASE_TOKEN` no está configurado en GitHub → el deploy a Firebase Hosting falla en CI. Germán lo documenta en el PR.

---

## Dependencias — estado final

```
Luis ✅  → Monserrat ✅ (SwipeDeck implementado)
Luis ✅  → Héctor ✅    (content.js implementado)
Edgar ✅ → Monserrat ✅ (ContentCard disponible)
Héctor ✅ → Christian ✅ (Imanol cubrió collections)
Wave 3 ✅ → Ulises ✅   (QA docs entregados)
Wave 3 ✅ → Diana ⚠️    (Library.jsx pendiente)
```

---

## Áreas de mejora identificadas al cierre

1. **`FIREBASE_TOKEN` en CI** — El secret no está en GitHub Settings. El deploy a Firebase Hosting nunca se ejecuta aunque el pipeline corra verde.
2. **Duplicidad en `swipes`** — `backend/tests/swipe.test.js` (Luis) y `src/firestore/tests/swipes.test.js` (Monserrat) cubren cosas distintas. Considerar consolidar en un solo directorio de tests.
3. **`app.js` crecimiento no coordinado** — Múltiples personas editaron `app.js`. Considerar un `routes/index.js` para evitar conflictos futuros.
4. **Diana sin rama** — Es el único entregable que quedó completamente sin abordar en el Sprint 1.
5. **`jc.env` — rotación de claves pendiente** — El archivo fue eliminado del tracking pero las claves estuvieron expuestas en el historial público de GitHub. Requiere rotación inmediata.

---

## Historial de auditorías

| Fecha | Cambio |
|---|---|
| 2026-06-07 | Primera auditoría — 5 mergeados, 8 pendientes |
| 2026-06-10 | Cierre Sprint 1 — 12/13 mergeados, 7 alertas resueltas |

---

## Archivos de alerta — estado al cierre

| Archivo | Persona | Prioridad original | Estado al cierre |
|---|---|---|---|
| `Alerta-JuanCarlos-Macias.md` | Juan Carlos | 🚨 URGENTE | 🔒 Resuelto (PR #25) — pendiente rotación de claves |
| `Alerta-Hector-Morales.md` | Héctor | 🔴 Alta | ✅ Resuelto (PR #29) |
| `Alerta-Monserrat-Miranda.md` | Monserrat | 🔴 Alta | ✅ Resuelto (PR #33, #42) |
| `Alerta-Edgar-Coronel.md` | Edgar (dev) | 🔴 Alta | ✅ Resuelto (PR #26, #44+) |
| `Alerta-Christian-Ruiz.md` | Christian/Imanol | 🟡 Media | ✅ Resuelto (PR #30) |
| `Alerta-German-Pacheco.md` | Germán | 🟡 Media | ✅ Resuelto (PR #40, #43) |
| `Alerta-Marina-Garcia.md` | Marina | 🟡 Media | ✅ Resuelto (PR #38) |
| `Alerta-Diana-Alvarez.md` | Diana | 🟠 Normal | ⚠️ Sigue pendiente |
| `Alerta-Ulises-Chaparro.md` | Ulises | 🟠 Normal | ✅ Resuelto (PR #36) |
