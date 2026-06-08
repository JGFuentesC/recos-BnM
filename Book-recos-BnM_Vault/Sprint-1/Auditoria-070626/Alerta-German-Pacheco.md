---
persona: "Germán Pacheco"
prioridad: "🟡 Media"
tipo: ["commits-sin-mergear", "CI-riesgo"]
fecha: "2026-06-07"
wave: 2
---

# 🟡 Alerta — Germán Pacheco

## Entregables planificados (Wave 2)
- ✅ `.github/workflows/deploy.yml` — CI/CD pipeline (mergeado PR #17)
- ✅ `frontend/public/sw.js` — Service Worker PWA
- ✅ `frontend/public/manifest.json` — PWA manifest

## Estado actual
PR #17 mergeado correctamente. Sin embargo, el branch `feature/cicd/german` tiene **2 commits adicionales** que **no están en main**:

```
ebc80c1  fix(cicd): corregir working directory para ejecucion de pytest
6a9b24a  feat(cicd): ajustar pipeline para subcarpeta interna y sw
```

## Riesgo

Estos commits contienen correcciones al pipeline de CI/CD. Si no se mergean:
- El CI puede estar usando una versión desactualizada del workflow
- Los tests de pytest pueden estar fallando en cada push por el working directory incorrecto
- Los nuevos PRs del equipo se ejecutan contra el pipeline sin corregir

## Acción requerida

```bash
# Verificar qué contienen esos commits
git log --oneline feature/cicd/german ^main

# Opción 1: Abrir nuevo PR con esos 2 commits
git checkout feature/cicd/german
gh pr create --base main --title "fix(cicd): correcciones al pipeline CI/CD"

# Opción 2: Cherry-pick directo a main (si el PM aprueba)
```

## Verificación rápida del CI actual
Revisar en GitHub → Actions si los últimos workflows pasaron o fallaron tras el merge de PR #24 (Luis).

## Fecha límite
Antes de la demo del **miércoles 10 jun 2026** — el CI debe estar verde.
