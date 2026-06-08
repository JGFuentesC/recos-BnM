---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "In Progress"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [roadmap, phase-1, mvp]
---

# Fase 1 — MVP

> Sprint 1, Junio 2026.  
> → Regresa al [[07_Roadmap/Roadmap|Roadmap]] · [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Objetivo de la fase

Entregar la experiencia base de swipe funcional, desplegada en Firebase Hosting como PWA, con todos los componentes de las Épicas 1–5 integrados y pasando los CI Gates del proyecto.

---

## Épicas incluidas

| Épica | Nombre | Prioridad | Estado |
|---|---|---|---|
| [[02_Requirements/User_Stories#épica-1\|Épica 1]] | Registro y calibración inicial | P1 | 🟡 En progreso |
| [[02_Requirements/User_Stories#épica-2\|Épica 2]] | Selección y filtrado de contenido | P2 | ⏳ Por iniciar |
| [[02_Requirements/User_Stories#épica-3\|Épica 3]] | Recomendación y mecánica de swipe | P3 | ⏳ Por iniciar |
| [[02_Requirements/User_Stories#épica-4\|Épica 4]] | Vista de detalle | P4 | ⏳ Por iniciar |
| [[02_Requirements/User_Stories#épica-5\|Épica 5]] | Colecciones y listas | P5 | ⏳ Por iniciar |

---

## Timeline del Sprint 1

| Fecha | Hito |
|---|---|
| 2026-06-04 | Kick-off. Israel inicia schema Firestore. Eduardo crea proyecto GCP |
| 2026-06-07 (Sábado) | Hello World desplegado en Firebase Hosting (Germán) |
| 2026-06-09 | Wave 0 completada: schema + reglas + ingest data |
| 2026-06-12 | Wave 1-2 completadas: Auth + API endpoints + ContentCard |
| 2026-06-15 | Wave 3: SwipeDeck + DetailSheet + TabSelector integrados |
| 2026-06-18 | Wave 4-5: Library + QA + fixes |
| 2026-06-20 | Demo final con el equipo |

---

## Equipo del sprint

| Miembro | Rol | Wave | Archivo |
|---|---|---|---|
| Eduardo Coronel | PM | Pre-Sprint | [[PM-Edgar-Coronel\|PM File]] |
| Israel Pérez | Backend — Firestore | Wave 0 | [[Sprint-1/01-Israel-Perez\|Israel]] |
| Manuel Serranía | Backend — Ingest | Wave 0-1 | [[Sprint-1/03-Manuel-Serrania\|Manuel]] |
| Andrés González | Backend/Frontend — Auth | Wave 1 | [[Sprint-1/02-Andres-Gonzalez\|Andrés]] |
| Luis Téllez | Backend — Feed/Swipe | Wave 2 | [[Sprint-1/04-Luis-Tellez\|Luis]] |
| Héctor Morales | Backend — Content Detail | Wave 2 | [[Sprint-1/05-Hector-Morales\|Héctor]] |
| Christian Ruiz | Backend — Collections | Wave 2 | [[Sprint-1/06-Christian-Ruiz\|Christian]] |
| Edgar Coronel | Frontend — ContentCard | Wave 2-3 | [[Sprint-1/07-Edgar-Coronel\|Edgar]] |
| Juan Carlos Macías | Frontend — Onboarding/Tabs | Wave 2-3 | [[Sprint-1/08-Juan-Carlos-Macias\|Juan Carlos]] |
| Germán Pacheco | DevOps — CI/CD + PWA | Wave 1-3 | [[Sprint-1/09-German-Pacheco\|Germán]] |
| Monserrat Miranda | Frontend — SwipeDeck | Wave 3 | [[Sprint-1/10-Monserrat-Miranda\|Monserrat]] |
| Marina García | Frontend — DetailSheet | Wave 3 | [[Sprint-1/11-Marina-Garcia\|Marina]] |
| Diana Álvarez | Frontend — Library | Wave 4 | [[Sprint-1/12-Diana-Alvarez\|Diana]] |
| Ulises Chaparro | QA | Wave 4 | [[Sprint-1/13-Ulises-Chaparro\|Ulises]] |

---

## North Star al finalizar Fase 1

**Métricas establecidas y en proceso de medición:**

| Métrica | Meta | Cómo medir |
|---|---|---|
| Activación (onboarding + ≥20 swipes) | ≥ 60% | `onboarding_completed` + count de `swipe` events |
| Swipes promedio / sesión | ≥ 30 | Analytics: `swipe` events por sesión |
| Retención D7 | ≥ 25% | Usuarios que vuelven 7 días después del registro |
| Conversión a biblioteca | ≥ 40% | % usuarios con al menos 1 `content_saved` |
| Costo infra / 1k usuarios | < USD 5 | GCP Billing dashboard |

---

## Criterio de paso a Fase 2

- ✅ MVP desplegado y accesible en Firebase Hosting
- ✅ Todos los CI Gates en verde (ver [[06_QA_Validation/CI_QA_Gates|CI Gates]])
- ✅ Happy Paths del Test Plan aprobados (ver [[06_QA_Validation/Test_Plan|Test Plan]])
- ✅ Retención D7 ≥ 25% medida en primeros 100 usuarios reales

---

## Fuera de alcance de esta fase

Ver [[02_Requirements/User_Stories#fuera-de-alcance-del-mvp|Fuera de alcance del MVP]] en User Stories.
