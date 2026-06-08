---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [ai, agents, governance, security]
---

# AI Agent Governance — Recos-BnM

> Reglas de uso y límites de los agentes IA en el flujo de desarrollo del proyecto.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]  
> → Ver también: [[00_Start_Here/AI_Collaboration_Guide|AI Collaboration Guide]]

---

## Principios de gobernanza

| Principio | Descripción |
|---|---|
| **Evaluar antes de delegar** | No toda tarea es automatizable. Antes de darle una tarea a un agente, preguntar: ¿tiene acceso a todo el contexto necesario? ¿el error sería catastrófico? |
| **Action space restringido** | Los agentes tienen acceso solo a lo que necesitan para su tarea específica |
| **Audit trail obligatorio** | Cada acción de un agente genera un artefacto (comentario en PR, log, resumen en Slack) |
| **Kill-switch disponible** | Todo agente en CI puede detenerse manualmente en <5 minutos |
| **Humano en el loop para merges** | Ningún agente puede mergear a `main` sin aprobación explícita de una persona |

---

## Agentes permitidos en Sprint 1

### PR Reviewer Agent
- **Qué puede hacer:** Leer el diff de un PR, verificar criterios de calidad, dejar comentario estructurado
- **Qué NO puede hacer:** Aprobar el PR, mergear, modificar código
- **Trigger:** Automático al abrir un PR
- **Output:** Comentario en el PR con checklist de calidad

### Security Scan Agent
- **Qué puede hacer:** Correr `npm audit`, detectar CVEs, revisar que endpoints tengan auth
- **Qué NO puede hacer:** Modificar dependencias, tocar configuración de GCP
- **Trigger:** Automático en cada push
- **Output:** Reporte en GitHub Actions; bloquea CI si encuentra HIGH/CRITICAL

### Deploy Validator Agent
- **Qué puede hacer:** Hacer smoke testing de endpoints en staging, reportar latencias
- **Qué NO puede hacer:** Hacer rollback automático sin confirmación de Eduardo
- **Trigger:** Manual o automático post-deploy a staging
- **Output:** Reporte de status codes y latencias

---

## Agentes NO permitidos en Sprint 1

| Agente | Por qué no |
|---|---|
| Auto-merger | Riesgo de merge de código roto o inseguro |
| Agente con acceso a producción GCP | Solo Eduardo tiene acceso; no delegar hasta Fase 2 |
| Agente que modifique `firestore.rules` | Cambio de seguridad crítico; siempre manual |
| Agente que cree/elimine usuarios en Auth | Riesgo de corrupción de datos |

---

## Proceso de interrupción (Kill-switch)

Si un agente actúa de forma inesperada:

1. **En GitHub Actions:** Ir al run activo → "Cancel workflow"
2. **En Claude Code:** `Ctrl+C` en la terminal activa
3. **Para un agente scheduled:** Ir a Settings → Actions → Disable workflow
4. Notificar a Eduardo inmediatamente
5. Registrar el incidente en [[09_Risk_Governance/Decision_Log|Decision Log]]

---

## Checklist antes de activar un nuevo agente

- [ ] ¿El agente tiene acceso solo a lo que necesita?
- [ ] ¿Hay un humano que revise su output antes de que tenga efecto?
- [ ] ¿Existe un kill-switch documentado?
- [ ] ¿El agente genera un audit trail (log/comentario)?
- [ ] ¿Se testeó en staging antes de activar en main/producción?
- [ ] ¿Eduardo fue notificado de la activación?

---

## Sistema de ownership de archivos por colaborador

Para evitar que agentes IA de diferentes colaboradores modifiquen los mismos archivos y generen conflictos, cada colaborador tiene un `AGENT_CONTEXT.md` que define su zona de trabajo.

**Ubicación:** `Sprint-1/contexts/{nombre}-agent-context.md`

### Niveles de acceso

| Nivel | Color | Descripción |
|---|---|---|
| **Propios** | 🟢 | El colaborador puede crear y modificar libremente |
| **Compartidos** | 🟡 | Requieren coordinación con el dueño antes de modificar |
| **Prohibidos** | 🔴 | Nunca deben ser modificados por este colaborador |

### Responsabilidades clave de archivos hot spot

| Archivo | Dueño | Por qué |
|---|---|---|
| `backend/src/app.js` | Andrés González | Crea el scaffold completo en Wave 1 con todas las rutas pre-registradas |
| `frontend/src/App.jsx` | Andrés González | Configura todas las rutas del frontend en Wave 1 |
| `frontend/src/pages/Feed.jsx` | Monserrat Miranda | Integra TabSelector + SwipeDeck en Wave 3 |
| `.github/workflows/deploy.yml` | Germán Pacheco | Único autorizado a modificar CI/CD |
| `firestore.rules` | Israel Pérez | Cualquier cambio requiere revisión adicional de Eduardo |

### Regla para el agente IA

Todo agente IA debe leer el `AGENT_CONTEXT.md` de su colaborador al inicio de cada sesión. Si el agente intenta modificar un archivo marcado como 🔴 Prohibido, debe detenerse y notificar al colaborador.

---

## Fase de expansión de agentes

| Fase | Agentes a activar |
|---|---|
| **Fase 1 (ahora)** | PR Reviewer, Security Scan, Deploy Validator |
| **Fase 2** | Ingest Health Monitor, Quota Monitor, Analytics Summary |
| **Fase 3** | Recommendation ML Agent (batch nocturno, sin acceso a producción directa) |
