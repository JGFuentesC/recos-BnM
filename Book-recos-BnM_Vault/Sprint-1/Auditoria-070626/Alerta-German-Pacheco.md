---
persona: "Germán Pacheco"
prioridad: "✅ Resuelto — pendiente FIREBASE_TOKEN"
tipo: ["commits-sin-mergear", "CI-riesgo"]
fecha: "2026-06-07"
updated: "2026-06-10"
estado: "resuelto-parcial"
---

# ✅ Alerta — Germán Pacheco (RESUELTO 2026-06-10)

## Estado al cierre del Sprint

- **PR #40** (2026-06-10): corrección de working directory y `frontend/.env.example`
- **PR #43** (2026-06-10): Node 18 → 22, pytest instalado, deploy solo en push a main
- **PR #41** (cerrado): revert de #40 — cerrado sin mergear
- **Pendiente:** ⚠️ Secret `FIREBASE_TOKEN` no configurado en GitHub → deploy a Firebase Hosting no ejecuta en CI

## Entregables planificados (Wave 2)
- ✅ `.github/workflows/deploy-hosting.yml` — pipeline corregido (PRs #40, #43)
- ✅ `frontend/public/sw.js` — Service Worker PWA (PR original #17)
- ✅ `frontend/public/manifest.json` — PWA manifest (PR original #17)
- ⚠️ Deploy automático a Firebase Hosting — pipeline listo, falta secret en GitHub Settings

## Estado original (2026-06-07)
PR #17 mergeado correctamente. Sin embargo, el branch `feature/cicd/german` tenía **2 commits adicionales** que **no estaban en main**:

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

## Pendiente para Sprint 2

Configurar el secret `FIREBASE_TOKEN` en GitHub → Settings → Secrets and variables → Actions:
```bash
# Generar token
firebase login:ci
# Copiar el token y pegarlo en GitHub como FIREBASE_TOKEN
```

## Fecha límite
~~Antes de la demo del **miércoles 10 jun 2026** — el CI debe estar verde.~~ ✅ Pipeline entregado. Falta secret para deploy.
