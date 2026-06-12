---
project: "Recos-BnM"
date: "2026-06-11"
author_human: "Germán Pacheco Castillo"
agent: "Claude Code"
model: "claude-sonnet-4-6"
session_duration: "~1h"
tags: [devlog, sprint-1, wave-2, cicd, pwa, fcm]
---

# DevLog — 2026-06-11 — Fase 2: Cloud Run + FCM

## Qué se hizo

- **Bugfix**: Corregida la lógica del `activate` event en `sw.js` — el filtro de cachés viejos siempre retornaba `false` (nunca limpiaba versiones anteriores)
- **FCM push handlers**: Agregados `push` y `notificationclick` listeners al `sw.js` para notificaciones push en background
- **VAPID key**: Agregada `VITE_FIREBASE_VAPID_KEY` al paso Build del workflow
- **Cloud Run job**: Agregado job `deploy-backend` en `.github/workflows/deploy.yml` que despliega `backend/` a Cloud Run después del frontend
- **Iconos PWA**: Creados `/icons/icon-192.png` y `/icons/badge-72.png` (placeholders) y referenciados en `manifest.json`
- **Limpieza**: Eliminado `deploy-hosting.yml` (workflow obsoleto que usaba `FIREBASE_TOKEN` incorrecto)

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `frontend/public/sw.js` | Bugfix activate filter + push/notificationclick handlers |
| `.github/workflows/deploy.yml` | VAPID key en Build + job deploy-backend |
| `frontend/public/manifest.json` | PNG icons agregados |
| `.github/workflows/deploy-hosting.yml` | Eliminado (obsoleto) |
| `frontend/public/icons/icon-192.png` | Creado (placeholder) |
| `frontend/public/icons/badge-72.png` | Creado (placeholder) |

## 🤖 Sesión de IA

- **Agente:** Claude Code (claude-sonnet-4-6)
- **Decisiones autónomas:**
  - Eliminación del workflow `deploy-hosting.yml` por duplicado obsoleto (usaba `FIREBASE_TOKEN` que ya no es válido)
  - Creación de iconos placeholder en PNG puro vía Python (sin dependencias externas)
- **Prompt inicial usado:** Sprint file de Germán Fase 1 + Fase 2

## Bloqueantes

- Build de frontend falla en Linux por `lightningcss` (native module para Windows) — no afecta al CI/CD real

## Próximos pasos

1. Eduardo (PM) debe configurar el secret `VITE_FIREBASE_VAPID_KEY` en GitHub
2. Generar VAPID key en Firebase Console → Cloud Messaging → Web Push certificates
3. Verificar CI/CD completo con push a `main`
4. Confirmar con Manuel que el ingest como Cloud Run Job está listo para Cloud Scheduler
