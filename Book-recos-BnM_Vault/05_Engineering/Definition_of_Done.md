---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [engineering, dod, quality]
---

# Definition of Done — Recos-BnM

> Una tarea es "Done" cuando cumple **todos** los criterios de su categoría.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Criterios universales (aplican a TODAS las tareas)

> ✅ **Tests escritos** — Al menos 1 test (unitario o de integración) que verifique el comportamiento principal de la tarea.

> ✅ **DevLog escrito** — Antes de hacer push, crear `DevLog/YYYY-MM-DD-{tu-nombre}.md` con los campos `author_human`, `agent`, archivos creados/modificados, y decisiones autónomas del agente. Ver template en [[DevLog/DevLog_Index|DevLog Index]].

> ✅ **Sin archivos fuera de scope** — Solo se modificaron los archivos definidos en tu `Sprint-1/contexts/{nombre}-agent-context.md`. Si se tocó un archivo compartido, está coordinado con su dueño.

**Qué cuenta como test:**
- Test unitario de una función (Jest, pytest, etc.)
- Test de integración contra el emulador Firebase
- Test de endpoint con supertest (backend)
- Test de snapshot de componente React (si aplica)

**Lo que NO es suficiente:**
- "Lo probé manualmente" sin test automatizado
- Un console.log que verifica el resultado

---

## Por tipo de tarea

### Backend — Endpoint nuevo

| Criterio | Descripción |
|---|---|
| ✅ Tests escritos | 401 sin token, 400 params inválidos, respuesta happy path |
| ✅ Middleware auth aplicado | El endpoint devuelve 401 sin Bearer token |
| ✅ Documentado | [[03_Architecture/API_Specification\|API Specification]] actualizado |
| ✅ CI pasa | lint + build verde en GitHub Actions |
| ✅ Probado en emulador | No solo unit tests — request real contra Firestore emulador |

### Frontend — Componente nuevo

| Criterio | Descripción |
|---|---|
| ✅ Tests escritos | Al menos 1 test de comportamiento (render, interacción) |
| ✅ Estado de loading | El componente no "desaparece" mientras carga |
| ✅ Estado de error | Error visible y amigable si la API falla |
| ✅ Mobile-first | Funciona en 375px sin overflow horizontal |
| ✅ Props documentadas | PropTypes o JSDoc en el componente |

### Schema / Firestore

| Criterio | Descripción |
|---|---|
| ✅ Tests escritos | Test de reglas de seguridad en emulador |
| ✅ SCHEMA.md actualizado | El equipo puede consultar los campos actuales |
| ✅ Índices creados | `firestore.indexes.json` actualizado si hay queries nuevas |
| ✅ Data Model actualizado | [[03_Architecture/Data_Model\|Data Model]] en el vault |

### CI/CD / Infra

| Criterio | Descripción |
|---|---|
| ✅ Pipeline ejecutado | GitHub Actions corrió al menos 1 vez sin errores |
| ✅ Deploy verificado | URL pública responde correctamente |
| ✅ Variables documentadas | `.env.example` y `README.md` actualizados |

---

## Lo que NO bloquea una tarea (para el MVP)

- Cobertura de tests al 100% (no requerida en MVP)
- Tests E2E automatizados con Playwright/Cypress (Ulises hace QA manual)
- Documentación de Storybook
- Performance profiling detallado (se hace en Fase 2)

---

## Proceso de verificación

Antes de marcar una tarea como completada en el sprint:

```bash
# 1. Correr todos los tests del módulo
npm test              # o pytest para el ingest

# 2. Verificar lint
npm run lint

# 3. Build de producción
npm run build

# 4. PR abierto con descripción
# 5. Review solicitado a 1+ persona
# 6. CI verde → merge a main
```
