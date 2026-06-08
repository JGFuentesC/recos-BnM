---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [risk, governance]
---

# Risk Register — Recos-BnM

> Riesgos identificados del proyecto con impacto, probabilidad y mitigaciones.  
> Fuente base: PRD §11. Actualizar cuando surjan nuevos riesgos.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Riesgos activos

| ID | Riesgo | Impacto | Prob. | Mitigación | Dueño | Estado |
|---|---|---|---|---|---|---|
| R01 | Costos/cuotas de APIs externas superados | Alto | Media | Pre-indexar catálogo; feed sirve desde Firestore, no en caliente. Alertas al 70% de cuota. | [[Sprint-1/03-Manuel-Serrania\|Manuel]] | 🟡 Activo |
| R02 | Datos de streaming incorrectos (watchProviders) | Medio | Alta | Usar TMDB Watch Providers con placeholder neutro cuando no hay dato. **Nunca inventar disponibilidad.** | [[Sprint-1/05-Hector-Morales\|Héctor]] | 🟡 Activo |
| R03 | Cold start de Cloud Run degrada activación D0 | Medio | Media | `min-instances=1` si la métrica D0 se degrada. Monitorear latencia de primer request. | [[PM-Edgar-Coronel\|Eduardo]] | 🟡 Activo |
| R04 | Límites de filtrado de Firestore | Medio | Media | Ranking en backend (scoring.js); índices compuestos por `type + genres`. | [[Sprint-1/04-Luis-Tellez\|Luis]] + [[Sprint-1/01-Israel-Perez\|Israel]] | 🟡 Activo |
| R05 | Feed agotado para usuarios muy activos | Medio | Baja | Paginación por cursor + señal de afinidad histórica (Fase 2). | [[Sprint-1/04-Luis-Tellez\|Luis]] | 🟡 Activo |
| R06 | Schema Firestore incorrecto bloquea todo el sprint | Crítico | Baja | [[Sprint-1/01-Israel-Perez\|Israel]] es Wave 0 y tiene máxima prioridad. SCHEMA.md como referencia canónica. | [[Sprint-1/01-Israel-Perez\|Israel]] | 🔴 Camino crítico |
| R08 | Secreto comprometido (API key en commit) | Crítico | Baja | `.gitignore` estricto, pre-commit hooks, revisión de PR siempre. Protocolo en [[09_Risk_Governance/Security_Model\|Security Model]]. | Todo el equipo | 🟢 Controlado |
| R09 | Agente IA hace merge sin revisión humana | Medio | Baja | Reglas de gobernanza en [[09_Risk_Governance/AI_Agent_Governance\|AI Agent Governance]]. Branch protection en main. | [[PM-Edgar-Coronel\|Eduardo]] | 🟢 Controlado |

---

## Escala de calificación

| Impacto | Definición |
|---|---|
| Crítico | Bloquea el proyecto completo o la demo |
| Alto | Bloquea un módulo o persona por >1 día |
| Medio | Retraso de horas o experiencia degradada |
| Bajo | Impacto mínimo, solucionable sin bloquear |

| Probabilidad | Definición |
|---|---|
| Alta | >60% de que ocurra en el sprint |
| Media | 30–60% |
| Baja | <30% |

---

## Riesgos resueltos

| ID | Riesgo | Cómo se resolvió | Fecha |
|---|---|---|---|
| R07 | `GET /api/collections` sin asignar bloqueaba a Diana | Eduardo confirmó con Christian. Tiene el CRUD completo. Diana trabaja con mocks en paralelo. | 2026-06-05 |

---

## Cómo agregar un riesgo nuevo

1. Asignar ID incremental (R10, R11...)
2. Describir el riesgo en 1 línea (qué podría salir mal)
3. Evaluar impacto y probabilidad
4. Definir mitigación concreta y dueño
5. Registrar la decisión en [[09_Risk_Governance/Decision_Log|Decision Log]]
