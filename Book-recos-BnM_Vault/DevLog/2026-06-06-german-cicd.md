---
project: "Recos-BnM"
date: "2026-06-06"
author_human: "Germán Pacheco Castillo"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "2h"
tags: [devlog, sprint-1, wave-2, cicd, pwa]
---

# DevLog — 2026-06-06 — CI/CD + Service Worker

→ [[DevLog/DevLog_Index|Volver al índice]]

## Qué se hizo

- **Frontend:** Proyecto React + Vite creado desde cero con branding Recos BnM (Hello World) — posteriormente reemplazado por el frontend de Andrés (mergeado de `main`)
- **CI/CD:** Workflow de GitHub Actions (`.github/workflows/deploy.yml`) — build + deploy a Firebase Hosting en push a main
- **PWA:** Service Worker (`frontend/public/sw.js`) — se reemplazó el placeholder de Andrés con implementación completa (caché shell + colección últimos 10 ítems)
- **PWA Manifest:** `frontend/public/manifest.json` creado con theme_color #1a1a2e
- **index.html:** Título cambiado a "Recos BnM" + link a manifest.json agregado
- **Documentación:** README.md actualizado con secciones de CI/CD, variables de entorno (incluyendo las de Andrés: STORAGE_BUCKET, MESSAGING_SENDER_ID), y estructura del proyecto
- **Config:** `firebase.json` actualizado con hosting pointing a `frontend/dist`
- **Gobernanza:** `CLAUDE.md` creado con reglas de IA, file ownership actualizado
- **Variables de entorno:** `backend/.env.example` creado
- **Integración post-merge:** Se resolvió conflicto con frontend de Andrés (02-Andres-Gonzalez) — se preservaron sus archivos y se agregaron los de Germán sobre su estructura

## 🤖 Sesión de IA

- **Agente:** Claude Code (claude-sonnet-4-6)
- **Archivos creados/modificados:**
  - `frontend/` (proyecto Vite completo: package.json, vite.config.js, index.html, src/App.jsx, src/App.css, src/main.jsx, etc.)
  - `.github/workflows/deploy.yml`
  - `frontend/public/sw.js`
  - `frontend/public/manifest.json`
  - `frontend/.env.example`
  - `backend/.env.example`
  - `CLAUDE.md`
  - `README.md` (modificado)
  - `firebase.json` (modificado)
  - `Book-recos-BnM_Vault/DevLog/2026-06-06-german-cicd.md`
- **Decisiones autónomas del agente:**
  - Usar Vite 5 en lugar de Vite 8 para compatibilidad con Node.js 20.18 disponible en el entorno
  - Crear el proyecto frontend manualmente en lugar de esperar a Andrés (según recomendación del sprint: "pipeline puede arrancar con Hello World básico")
  - La URL de Firebase Hosting se definirá cuando Eduardo (PM) configure los secrets de GitHub y se haga el primer deploy
- **Correcciones manuales:** Ninguna
- **Prompt inicial usado:** Sprint file de Germán Pacheco (09-German-Pacheco.md)

## Bloqueantes encontrados

- Node.js no estaba instalado en el entorno WSL; se descargó binary de node-v20.18.0-linux-x64
- Vite 8 requiere Node.js 20.19+ — se usó Vite 5 como workaround
- `npm create vite@latest` generó proyecto con Vite 8 incompatible; se recreó con `create-vite@5`

## Próximos pasos para el siguiente colaborador

- **Para Eduardo (PM):** Configurar secrets en GitHub (FIREBASE_SERVICE_ACCOUNT + 4 VITE vars)
- **Para Andrés:** Agregar registro del Service Worker en `frontend/src/main.jsx`:
  ```js
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }
  ```
- **Para Germán (siguiente sesión):**
  - Hacer push a main y verificar que el workflow de GitHub Actions corre
  - Compartir URL de Firebase Hosting con el equipo
  - Confirmar que la PWA funciona (Service Worker + manifest)
  - Coordinar con Andrés la integración del SW en main.jsx
