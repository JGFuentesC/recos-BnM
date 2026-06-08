---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
tags: [changelog, vault]
---

# Vault Changelog — Recos-BnM

> Registro de cambios significativos al vault (nueva estructura, decisiones de organización, refactors).  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## v1.0 — 2026-06-04 (Sesión inicial)

**Estructura creada:**
- Vault organizado con estructura 00–09 (inspirada en CloudManager_Vault)
- Sprint-1/ creado con 14 archivos individuales por persona
- Links de Obsidian en todas las tablas de dependencias
- PM-Eduardo-Coronel.md agregado al sprint planning

**Elementos adaptados de CloudManager_Vault:**
- ✅ Estructura de carpetas numeradas 00–09
- ✅ Frontmatter YAML estándar (project, owner, status, version, last_reviewed, milestone)
- ✅ Patrón MOC (PROJECT_INDEX como hub central)
- ✅ DevLog cronológico
- ✅ Patrón de links internos `[[]]`
- ❌ Provider patterns (no aplica — TMDB/Books no requieren adaptadores OAuth)
- ❌ Safe-delete workflow (no aplica)
- ❌ App store release patterns (Recos-BnM es Firebase Hosting)

**Nuevos elementos (no estaban en CloudManager):**
- Sprint planning por persona con prompts de Claude Code
- AI Agent Governance section
- TMDB Compliance tracking
- Wave dependency graph en el Sprint Overview

**Discrepancias identificadas:**
- `GET /api/collections` sin asignar en el sprint plan (Eduardo debe resolver)

---

---

## v1.1 — 2026-06-05 (Auditoría + sistema de colaboración IA)

**Qué cambió:**
- Sistema de `AGENT_CONTEXT.md` implementado: 13 archivos nuevos en `Sprint-1/contexts/`
- `DevLog/DevLog_Index.md`: template actualizado con campos `author_human`, `agent`, `model` y nueva sección `🤖 Sesión de IA`
- `05_Engineering/Definition_of_Done.md`: criterios de DevLog obligatorio y scope de archivos agregados
- `05_Engineering/PR_Checklist.md`: sección "Colaboración IA" agregada al checklist
- `05_Engineering/Engineering_Workflow.md`: sección de hot spots y dueños designados
- `09_Risk_Governance/AI_Agent_Governance.md`: sección de file ownership system
- `00_Start_Here/AI_Collaboration_Guide.md`: referencia a AGENT_CONTEXT.md
- `Sprint-1/00-Sprint1-Overview.md`: discrepancia GET /api/collections marcada como resuelta
- `Sprint-1/06-Christian-Ruiz.md`: GET /api/collections confirmado como asignado
- `00_Start_Here/Current_Build_Target.md`: discrepancia marcada como resuelta
- Todos los Sprint files: TAREA FINAL de DevLog agregada a los prompts de Claude Code
- Sprint files de Wave 2+ frontend: sección `🧪 Mock mínimo` agregada

**Por qué cambió:**
- Auditoría del proyecto identificó que el sistema no rastreaba el agente IA usado ni delimitaba archivos por colaborador
- La discrepancia del GET /api/collections fue confirmada y resuelta por Eduardo (PM)

**Impacto:**
- Archivos afectados: 35+ archivos modificados o creados
- La regla del DevLog pasa a ser criterio obligatorio del DoD

---

## v1.2 — 2026-06-05 (Mitigación de riesgos — segunda sesión)

**Qué cambió:**
- `Sprint-1/11-Marina-Garcia.md`: Tarea 2 corregida — ya no pide modificar SwipeDeck (de Monserrat); entrega JSDoc de integración
- `Sprint-1/10-Monserrat-Miranda.md`: Tarea 3 agregada — Monserrat integra DetailSheet de Marina en SwipeDeck
- `Sprint-1/09-German-Pacheco.md`: Secret de CI corregido (`FIREBASE_TOKEN` → `FIREBASE_SERVICE_ACCOUNT`); Tarea 4 (main.jsx) redirigida a Andrés
- `Sprint-1/02-Andres-Gonzalez.md`: Tarea 7 agregada — registro de Service Worker en main.jsx
- `Sprint-1/00-Sprint1-Overview.md`: Dependencia falsa de Christian → Luis eliminada; sección de standup diario async agregada
- `Sprint-1/06-Christian-Ruiz.md`: GET condicional "si el PM aprueba" eliminado; app.js no-tocar aclarado
- `Sprint-1/04-Luis-Tellez.md`, `05-Hector-Morales.md`, `06-Christian-Ruiz.md`: Tarea de registro en app.js cambiada a "verificar — Andrés ya lo hizo"
- `Sprint-1/08-Juan-Carlos-Macias.md`: Tarea 3 (App.jsx) reescrita — standalone, no tocar App.jsx ni Feed.jsx
- `Sprint-1/12-Diana-Alvarez.md`: GET /api/collections asignado a Christian actualizado; Tarea 5 (App.jsx) reescrita — standalone
- `Sprint-1/13-Ulises-Chaparro.md`: Nota de GET /api/collections actualizada (ya asignado)
- `09_Risk_Governance/Risk_Register.md`: R07 movido a "Riesgos resueltos"
- `05_Engineering/Engineering_Workflow.md`: Orden de merge de Wave 2 para package.json agregado
- Todos los 12 Sprint files: recordatorio `⚠️ ANTES DE EMPEZAR: Lee tu AGENT_CONTEXT.md` agregado al inicio de cada prompt

**Por qué cambió:**
- Análisis de riesgos identificó 10 problemas potenciales (9 mitigados, 1 acción humana requerida — Israel)
- Conflictos de ownership de archivos en múltiples sprint files (Marina→SwipeDeck, JuanCarlos/Diana→App.jsx, Luis/Héctor/Christian→app.js, Germán→main.jsx)
- Secret incorrecto en deploy.yml podría bloquear el pipeline el sábado 7 jun

**Impacto:**
- Archivos modificados: 17 archivos
- El sistema de AGENT_CONTEXT ahora es reforzado también desde los prompts directamente

---

## Cómo registrar cambios futuros

Cada vez que se haga un cambio significativo al vault (nueva sección, reestructuración, decisión de organización, reasignación de tareas), añadir una entrada aquí con el formato:

```markdown
## vX.Y — YYYY-MM-DD (Descripción breve)

**Qué cambió:**
- ...

**Por qué cambió:**
- ...

**Impacto:**
- Archivos afectados: ...
```

> **Nota:** Este archivo registra cambios al vault (documentación). Los cambios al código van en el DevLog. Los cambios al código con historial van en git log.
