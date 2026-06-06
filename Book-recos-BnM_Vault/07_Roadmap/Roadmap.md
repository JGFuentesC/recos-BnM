---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [roadmap, phases, planning]
---

# Roadmap — Recos-BnM

> Plan de 3 fases del proyecto. Fuente: PRD §13.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Resumen de fases

| Fase | Nombre | Timeline | Estado |
|---|---|---|---|
| [[07_Roadmap/Phases/Phase_01_MVP\|Fase 1]] | MVP | Sprint 1 — Jun 2026 | 🟢 En progreso |
| [[07_Roadmap/Phases/Phase_02_Engagement\|Fase 2]] | Mejoras de engagement | Q3 2026 | ⏳ Por planificar |
| [[07_Roadmap/Phases/Phase_03_ML\|Fase 3]] | Personalización avanzada | Q4 2026 | ⏳ Por planificar |

---

## Fase 1 — MVP (Sprint 1, Junio 2026)

**Objetivo:** Experiencia base de swipe funcional, desplegada en Firebase Hosting.

**Épicas incluidas:**
- Épica 1: Registro (Email + Google) + onboarding por swipe
- Épica 2: Selector de tipo Películas/Libros con feeds independientes
- Épica 3: Feed de swipe con scoring normalizado (popularidad + rating)
- Épica 4: Vista de detalle con watchProviders
- Épica 5: Biblioteca personal con listas y notas

**North Star al finalizar Fase 1:** Medición establecida de swipes/WAU

---

## Fase 2 — Mejoras de engagement (Q3 2026)

**Objetivo:** Retención con señal de uso real. Métricas D7 ≥ 35%.

**Features planificadas:**
- Señal de afinidad histórica: ajustar score con historial de likes del usuario
- Listas compartibles entre usuarios
- Notificaciones push de nuevos contenidos en géneros favoritos
- Analytics Summary Agent (reporte lunes)

---

## Fase 3 — Personalización avanzada (Q4 2026)

**Objetivo:** Recomendación inteligente. MAU 10,000+.

**Features planificadas:**
- ML: collaborative filtering + embeddings de preferencias
- Streaming verificado por región en tiempo real
- Monetización (por definir)
- Recommendation ML Agent (batch nocturno)

---

## Gates de progreso

| Gate | Criterio para pasar a la siguiente fase |
|---|---|
| Fase 1 → Fase 2 | MVP desplegado + retención D7 ≥ 25% en primeros 100 usuarios |
| Fase 2 → Fase 3 | D7 ≥ 35% + MAU ≥ 1,000 + costo infra < $5/1k usuarios |
