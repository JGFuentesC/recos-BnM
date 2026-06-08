---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [ai, claude-code, agents]
---

# AI Collaboration Guide — Recos-BnM

> Cómo trabajar con Claude Code en este proyecto: skills disponibles, reglas de agentes, y cuándo usar IA vs no.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Skills de Claude Code disponibles en este proyecto

| Skill | Comando | Cuándo usarlo |
|---|---|---|
| **init** | `/init` | Si CLAUDE.md no existe o está desactualizado |
| **review** | `/review` | Antes de aprobar cualquier PR |
| **security-review** | `/security-review` | Antes de cada deploy a producción |
| **simplify** | `/simplify` | Después de terminar una feature, para limpiar |
| **schedule** | `/schedule` | Para rutinas recurrentes (monitoreo de cuotas, etc.) |
| **loop** | `/loop` | Para monitorear procesos largos (ingest job, deploy) |
| **xlsx** | `/xlsx` | Para el tracker de métricas OKR |

---

## Cómo usar los prompts de Claude Code de tu archivo de tareas

Cada miembro del equipo tiene un `.md` personal en `Sprint-1/` con un prompt listo.

**Instrucciones:**
1. **Lee primero** tu `Sprint-1/contexts/{tu-nombre}-agent-context.md` — define qué archivos puedes tocar
2. Abre tu archivo en `Sprint-1/{tu-nombre}.md`
3. Copia el bloque de texto bajo `## 🤖 Prompt para Claude Code`
4. Pégalo directamente en el terminal de Claude Code (no en el chat web)
5. Claude Code leerá el contexto del proyecto y ejecutará la tarea
6. **Al terminar:** el agente escribirá el DevLog entry — verificar que está completo antes de hacer push

> El prompt ya tiene todo el contexto del PRD, schema, y dependencias. No necesitas agregar más.

---

## AGENT_CONTEXT.md — Tu zona de trabajo

Cada colaborador tiene un archivo en `Sprint-1/contexts/` que el agente IA debe leer al inicio de cada sesión. Define:

| Sección | Descripción |
|---|---|
| 🟢 **Archivos propios** | Puedes crear y modificar libremente |
| 🟡 **Archivos compartidos** | Requieren coordinación con el dueño antes de modificar |
| 🔴 **Archivos prohibidos** | El agente nunca debe tocar estos archivos |

**El agente IA debe detenerse si detecta que está a punto de modificar un archivo 🔴.**

Ver también: [[09_Risk_Governance/AI_Agent_Governance|AI Agent Governance]] para las reglas completas de file ownership.

---

## Agentes IA — Reglas de gobernanza

Ver documento completo: [[09_Risk_Governance/AI_Agent_Governance|AI Agent Governance]]

**Resumen de las reglas no negociables:**

| Regla | Descripción |
|---|---|
| 🚫 No merge a main | Los agentes pueden abrir PRs pero **nunca mergear** sin aprobación humana |
| 📋 Audit trail | Cada acción de agente genera un artefacto (comentario PR + log) |
| 🔒 Sin secretos | Los agentes nunca tienen acceso directo a producción |
| 🛑 Kill-switch | Cualquier agente en CI puede detenerse manualmente |

---

## Agentes disponibles para este sprint (Wave de implementación)

### Agentes activos en Sprint 1

| Agente | Cuándo activar | Quién lo activa |
|---|---|---|
| **PR Reviewer** | En cada PR abierto | Automático vía GitHub Actions |
| **Security Scan** | En cada push a main | Automático vía CI |
| **Deploy Validator** | Después de cada deploy a staging | Manual o automático |

### Agentes pendientes (Fase 2+)

| Agente | Fase |
|---|---|
| Ingest Health Monitor | Fase 2 |
| Quota Monitor (TMDB/Books) | Fase 2 |
| Feed Quality Agent | Fase 2 |
| Analytics Summary (lunes) | Fase 2 |
| Recommendation ML Agent | Fase 3 |

---

## Qué NO debe hacer Claude Code en este proyecto

- ❌ Mergear PRs automáticamente
- ❌ Modificar `firestore.rules` sin revisión humana
- ❌ Acceder a variables de entorno de producción
- ❌ Hacer deploy directo a Firebase Hosting (solo GitHub Actions puede)
- ❌ Crear usuarios en el sistema de Auth de producción

---

## Cómo iniciar una sesión de trabajo con Claude Code

```bash
# Desde la raíz del repo
claude

# O con contexto explícito del proyecto
claude --add-context "E:\Personal\PM\Book-Tinder_Vault\00_Start_Here\Developer_Onboarding.md"
```

Claude Code leerá el `CLAUDE.md` del proyecto automáticamente si existe. Si no existe, ejecuta `/init` primero.
