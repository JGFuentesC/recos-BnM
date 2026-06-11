---
project: "Recos-BnM"
date: "2026-06-10"
author_human: "Juan Carlos Macías Mayen"
agent: "Claude Code"
model: "big-pickle"
session_duration: "1h"
tags: [devlog, sprint-1, security, keys-rotation, git-hardening]
---

# DevLog — 2026-06-10 — Security hardening: key rotation, git cleanup, .gitignore

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo

### Confirmación de rotación de API keys (HIGH-01 del Security Audit)
- ✅ **TMDB_API_KEY** — Rotada e invalidada en consola TMDB
- ✅ **GOOGLE_BOOKS_API_KEY** — Rotada e invalidada en Google Cloud Console
- ✅ **VITE_FIREBASE_API_KEY** — Firebase key rotada por Andrés en HTML files
- Las claves expuestas en el historial de git (`jc.env`, commit `481b646`) ya NO son válidas

### Git hardening (Tarea 1 del plan de remediación)
1. **Rama `fix/remove-jc-env`** creada desde `origin/main`
2. **`jc.env`** eliminado del tracking git (`git rm`)
3. **`.DS_Store`** eliminado del tracking git (`git rm --cached`)
4. **`.gitignore`** endurecido — reemplazado bloque de parches específicos por patrón robusto:
   ```
   # Secrets — nunca commitear ningún .env real
   *.env
   *.env.*
   !*.env.example
   .DS_Store
   ```
5. **Verificación** del árbol: `git grep` sin resultados de secretos activos (limpio)
6. **Push** a `origin/fix/remove-jc-env` + PR creado a `main`

### Hallazgo adicional
- En `hui1_1_bienvenida.html` y `hui1_2_calibracion.html` (propiedad de Andrés) hay una Firebase API key hardcodeada: `AIzaSyAsYJyZWALuPSm7UgkpXQhVGtuJn-Q4I3A`. Se notificó a Andrés.

## Archivos modificados

- `.gitignore` — patrón robusto para secrets y .DS_Store
- `Book-recos-BnM_Vault/DevLog/2026-06-10-juan-carlos-security.md` (creado)
- `Book-recos-BnM_Vault/DevLog/DevLog_Index.md` (actualizado)

## Pendientes (no son de Juan Carlos)

| Tarea | Responsable |
|---|---|
| Purgar historial con `git-filter-repo` (HIGH-01 opcional) | Edgar + Germán + equipo |
| `npm audit fix` React Router (HIGH-02) | Andrés |
| Mover `dotenv.config()` a primera línea en `app.js` (HIGH-03) | Andrés / cualquiera |
| CORS restringir a dominio (MEDIUM-01) | Andrés |
| `express.json({ limit: '10kb' })` (MEDIUM-02) | Andrés / cualquiera |
| Key hardcodeada en HTML files | Andrés (ya notificado) |
| `express-rate-limit` (MEDIUM-03) | Héctor / Luis |
| `helmet` (MEDIUM-04) | Andrés |
| Mover reportes de seguridad fuera del .gitignore (MEDIUM-05) | Edgar (PM) |

## Próximos pasos para Juan Carlos

- Ninguno — todas las tareas asignadas a Juan Carlos están completas:
  - ✅ Rotación de API keys (TMDB, Google Books, Firebase) — confirmada
  - ✅ Eliminación de `jc.env` del tracking git
  - ✅ Endurecimiento de `.gitignore`
  - ✅ Eliminación de `.DS_Store` del tracking git
  - ✅ PR `fix/remove-jc-env` → `main` creado
