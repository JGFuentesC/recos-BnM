---
project: "Recos-BnM"
date: "2026-06-12"
author_human: "Andrés González Habib"
agent: "Codex"
model: "GPT-5.4 mini"
session_duration: "~1h"
tags: [devlog, sprint-1, wave-1]
---

# DevLog — 2026-06-12 — Fase 2: Auth, seguridad y push

## Qué se hizo

- Se añadió soporte de Firebase Messaging en `frontend/src/firebase/config.js` con export de `messaging` protegido para entornos sin `window`.
- Se creó `frontend/src/hooks/usePushNotifications.js` con `requestPermission()` para pedir permisos, obtener el FCM token y guardarlo en Firestore en `users/{uid}`.
- Se reforzó `backend/src/app.js` con `helmet()`, `express-rate-limit`, CORS restrictivo y body limit.
- Se agregó `GET /api/health` protegido con middleware de auth para la verificación con token válido.
- Se actualizó `backend/src/firebase/admin.js` para usar emuladores en desarrollo mediante `FIREBASE_AUTH_EMULATOR_HOST` y `FIRESTORE_EMULATOR_HOST`.
- Se instaló `helmet` y `express-rate-limit` en el backend.
- Se reparó el audit del frontend con `npm audit fix` hasta dejarlo en 0 vulnerabilidades HIGH/CRITICAL.
- Se verificó el middleware de auth con la suite `backend/tests/auth.test.js`.

## 🤖 Sesión de IA

- **Agente:** Codex
- **Decisiones autónomas:**
  - No se modificaron `frontend/src/App.jsx` ni `frontend/src/main.jsx` porque ya estaban cubriendo las rutas y el registro del service worker.
  - Se priorizó el endpoint real `/api/health` para que la validación con token coincida con el flujo pedido en la Fase 2.
  - Se dejó el hook de push separado para no acoplar la obtención del token FCM al flujo de auth existente.
- **Archivos tocados:**
  - `frontend/src/firebase/config.js`
  - `frontend/src/hooks/usePushNotifications.js`
  - `backend/src/app.js`
  - `backend/src/firebase/admin.js`

## Bloqueantes

- Ninguno al cierre de la sesión.
- `npm install` del backend dejó advertencias de vulnerabilidades moderadas en dependencias indirectas, pero el checklist de Fase 2 pedido para el frontend quedó limpio.

## Próximos pasos para el siguiente colaborador

1. Conectar `usePushNotifications(currentUser)` en el flujo real de sesión si ya existe el punto de entrada acordado por el equipo.
2. Probar `GET /api/health` con y sin token contra el emulador de Auth.
3. Validar en Firestore que el primer login cree `users/{uid}` y que el token FCM se persista cuando se habiliten notificaciones.
4. Revisar si el resto de rutas del backend necesita heredar el middleware global o si la protección doble actual se deja así por compatibilidad.

## Estado de rutas

- `app.js` no fue creado en esta sesión, pero sí quedó actualizado con `/api/health` y middleware global de auth para `/api/*`.
- `App.jsx` no fue creado en esta sesión y ya traía las rutas pre-registradas para login, register, onboarding, feed y library.
