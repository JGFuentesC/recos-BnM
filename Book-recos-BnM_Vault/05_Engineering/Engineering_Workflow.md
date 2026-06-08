---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [engineering, git, workflow]
---

# Engineering Workflow — Recos-BnM

> Política de branching, convenciones de PR y flujo de trabajo del equipo.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Estrategia de branching: Feature Branches → main

```
main
├── feat/israel-firestore-schema
├── feat/andres-firebase-auth
├── feat/manuel-ingest-job
├── feat/luis-feed-api
├── feat/edgar-content-card
└── fix/christian-collections-validation
```

### Reglas

| Regla | Detalle |
|---|---|
| `main` es siempre desplegable | Nunca hacer push directo a main con código roto |
| 1 branch por tarea/persona | Cada entregable del sprint tiene su propio branch |
| Naming: `feat/nombre-descripcion` | Para features nuevas |
| Naming: `fix/nombre-descripcion` | Para correcciones de bugs |
| Naming: `chore/descripcion` | Para infra, CI, actualización de deps |
| Merge solo por PR | Nunca hacer push directo a main |
| Mínimo 1 reviewer en el PR | El autor no puede aprobar su propio PR |
| CI debe pasar | GitHub Actions (lint + build) verde antes de merge |

---

## Convención de commits

Usar **Conventional Commits** (simplificado):

```
<tipo>(<scope>): <descripción corta en español>

Tipos:
  feat     → nueva funcionalidad
  fix      → corrección de bug
  chore    → mantenimiento, CI, deps
  docs     → documentación
  test     → tests
  refactor → refactoring sin cambio de comportamiento
  style    → formato, espacios (sin lógica)

Ejemplos:
  feat(auth): agregar login con Google y redirect a onboarding
  fix(feed): excluir correctamente contenido ya swipeado
  chore(ci): agregar step de lint al workflow de GitHub Actions
  test(swipe): agregar test de POST /api/swipe con action inválida
```

---

## Flujo de trabajo paso a paso

```bash
# 1. Crear tu branch desde main actualizado
git checkout main
git pull origin main
git checkout -b feat/tu-nombre-descripcion

# 2. Trabajar en tu tarea (commits frecuentes)
git add -p   # revisar qué estás añadiendo
git commit -m "feat(scope): descripción"

# 3. Subir tu branch
git push origin feat/tu-nombre-descripcion

# 4. Abrir PR en GitHub
# - Título: "[Épica X] Descripción de la tarea"
# - Cuerpo: Usar el PR template (.github/PULL_REQUEST_TEMPLATE.md)
# - Asignar reviewer (cualquier compañero disponible)

# 5. Atender el review (si hay comentarios)
git add -p && git commit -m "fix: atender comentarios del review"
git push

# 6. Merge (solo cuando CI pasa + 1 review aprobado)
```

---

## PR Template

Cuando abras un PR en GitHub, el template pedirá:

```markdown
## ¿Qué hace este PR?
<!-- Describe en 2-3 líneas qué problema resuelve y cómo -->

## Checklist
- [ ] Tests escritos (o no aplica — explicar por qué)
- [ ] Sin console.log de debug
- [ ] Sin secretos hardcodeados
- [ ] Probado en el emulador Firebase
- [ ] Sin errores de lint

## ¿Cómo probarlo?
<!-- Pasos para que el reviewer verifique que funciona -->

## Dependencias
<!-- ¿Este PR bloquea o depende de otro? -->
```

---

## Gestión de conflictos

Si hay conflictos al hacer merge:

```bash
# Actualizar tu branch con los últimos cambios de main
git checkout main && git pull
git checkout tu-branch
git rebase main

# Resolver conflictos en tu editor
# Luego:
git add .
git rebase --continue
git push --force-with-lease  # force-with-lease es más seguro que -f
```

---

## Archivos "hot spot" — dueños y protocolo

Estos archivos son modificados por más de una persona. Para evitar conflictos al mergear:

| Archivo | Dueño designado | Qué hacen los demás |
|---|---|---|
| `backend/src/app.js` | **Andrés González** | Crear solo tu routes file. Andrés ya pre-registró todas las rutas en Wave 1. Si tu ruta no está, avísale en el canal del equipo. |
| `frontend/src/App.jsx` | **Andrés González** | Crear tus pages/components. Andrés ya configuró todas las rutas. NO toques App.jsx. |
| `frontend/src/pages/Feed.jsx` | **Monserrat Miranda** | Juan Carlos crea `TabSelector.jsx` standalone; Monserrat lo importa. Marina crea `DetailSheet.jsx` standalone; Monserrat la integra en SwipeDeck. |
| `frontend/public/manifest.json` | **Germán Pacheco** | No modificar. |
| `backend/package.json` | **Luis Téllez** (coordinador) | Cada quien agrega sus deps en su branch. Si hay conflicto al mergear, Luis resuelve. |
| `frontend/package.json` | **Andrés González** (coordinador) | Ídem. |
| `README.md` | **Germán Pacheco** | Cada quien agrega su sección en un commit propio. No modificar secciones ajenas. |

### Protocolo para archivos compartidos

1. Si necesitas modificar un archivo de otro colaborador: crea un issue en GitHub y menciona a su dueño.
2. Si el cambio es urgente: comunícalo en el canal del equipo y espera confirmación.
3. Nunca hagas commit de cambios en archivos prohibidos de tu `AGENT_CONTEXT.md`.

### Orden de merge recomendado para Wave 2 (evitar conflictos en package.json)

Wave 2 tiene 6 personas instalando dependencias en paralelo. Para evitar conflictos en `package.json` y `package-lock.json`, hacer merge en este orden:

| Orden | Persona | Razón |
|---|---|---|
| 1° | **Germán Pacheco** | Agrega devDependencies de CI — sin conflicto con otros |
| 2° | **Andrés González** (si hay cambios de Wave 1 pendientes) | Base del frontend establecida |
| 3° | **Edgar Coronel** | Agrega librerías de animación al frontend |
| 4° | **Juan Carlos Macías** | Agrega dependencias de contexto/estado |
| 5° | **Luis Téllez, Héctor Morales, Christian Ruiz** | Solo dependencias de backend (no tocan frontend/package.json) |

**Regla práctica:** Antes de hacer merge de tu PR, hacer `git pull origin main` y resolver conflictos en `package.json` manualmente (no usar el merge automático — puede perder dependencias de otros).

### Cómo saber cuáles archivos son tuyos

Cada colaborador tiene un `Sprint-1/contexts/{nombre}-agent-context.md` que define:
- **🟢 Archivos propios** — modificar libremente
- **🟡 Compartidos** — coordinar antes
- **🔴 Prohibidos** — nunca tocar

---

## Reglas de protección de `main` (configurar en GitHub)

Eduardo configura estas reglas en Settings → Branches:

- ✅ Require pull request reviews before merging (mínimo 1)
- ✅ Require status checks to pass (CI: lint + build)
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings
- ❌ Allow force pushes (deshabilitado — nunca force push a main)
