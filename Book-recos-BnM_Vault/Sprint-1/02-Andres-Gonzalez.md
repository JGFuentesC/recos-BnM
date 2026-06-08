# Sprint 1 — Andrés González Habib
**Nivel:** Medio | **Épica:** 1 | **Wave:** 🟠 1 (después de Israel)

---

## 🎯 Tu misión

Eres la **segunda pieza del camino crítico**. Tu middleware de autenticación (`auth.js`) es el guardián de todos los endpoints del backend. Sin él, Luis, Héctor y Christian no pueden proteger sus APIs. Además, eres quien construye el login/registro en el frontend y garantiza que al registrarse se cree el documento del usuario en Firestore.

**Entrega el miércoles 10 jun:**
- Login y registro funcional con Email y Google en el frontend React
- Rutas protegidas (redirect a login si no autenticado)
- `api/middleware/auth.js` en el backend Cloud Run que verifica Firebase ID Token
- Documento `users/{userId}` creado automáticamente al primer registro

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Schema `users` (campos y estructura) | **[[01-Israel-Perez\|Israel Pérez]]** — `docs/SCHEMA.md` | Wave 0 |
| Emulador Firebase corriendo | **[[01-Israel-Perez\|Israel Pérez]]** | Wave 0 |
| Proyecto Firebase creado en consola | PM | Ya disponible |

> ⏸️ **Espera a Israel antes de conectar al emulador**, pero puedes avanzar con el scaffold del frontend y la lógica de UI mientras tanto.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[04-Luis-Tellez|Luis]], [[05-Hector-Morales|Héctor]], [[06-Christian-Ruiz|Christian]]** necesitan `api/middleware/auth.js` para proteger sus endpoints
- ✅ **[[07-Edgar-Coronel|Edgar]], [[08-Juan-Carlos-Macias|Juan Carlos]], [[10-Monserrat-Miranda|Monserrat]], [[11-Marina-Garcia|Marina]], [[12-Diana-Alvarez|Diana]]** necesitan las rutas protegidas del frontend
- ✅ **[[09-German-Pacheco|Germán]]** necesita la estructura base del frontend para configurar CI/CD
- ✅ **Todo el equipo** necesita el `Firebase ID Token` funcionando

---

## 📋 Pasos paso a paso

### Paso 1 — Inicializar el frontend React
```bash
cd recos-bnm/
npm create vite@latest frontend -- --template react
cd frontend && npm install
npm install firebase react-router-dom
```

### Paso 2 — Configurar Firebase SDK en el frontend
Crear `frontend/src/firebase/config.js` con las variables de entorno del proyecto.

### Paso 3 — Crear componentes de Auth
- `frontend/src/pages/Login.jsx` — form de email/password + botón Google
- `frontend/src/pages/Register.jsx` — form de registro

### Paso 4 — Crear rutas protegidas
- `frontend/src/components/ProtectedRoute.jsx` — wrapper que redirige si no hay usuario
- Configurar `react-router-dom` en `App.jsx`

### Paso 5 — Crear listener de usuario y guardar en Firestore
Al hacer login/registro por primera vez, crear el doc `users/{uid}` con los campos del schema de Israel.

### Paso 6 — Crear el middleware del backend
- `backend/src/middleware/auth.js` — verifica el Bearer token con Firebase Admin SDK
- Aplicar el middleware a todas las rutas de `backend/src/routes/`

### Paso 7 — Probar en el emulador
Verificar login con email, login con Google, y que el doc `users/` se cree correctamente en la UI del emulador (`localhost:4000`).

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/02-Andres-agent-context.md — define qué archivos puedes tocar.

Necesito implementar autenticación completa para el proyecto Recos-BnM.
Stack: React (Vite) en frontend/, Node.js Express en backend/, Firebase Auth + Firestore.
El emulador corre en auth:9099 y firestore:8080.

CONTEXTO del schema Firestore (colección users/{userId}):
  email, displayName, authProvider ("email"|"google"), createdAt (timestamp)
  prefs: { genres: [], authors: [], directors: [], cold_start_done: false }

TAREA 1 — Frontend: firebase/config.js
Crear frontend/src/firebase/config.js que inicialice Firebase con variables de entorno
VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID.
En desarrollo, conectar al emulador de auth (localhost:9099) y firestore (localhost:8080).

TAREA 2 — Frontend: contexto de autenticación
Crear frontend/src/contexts/AuthContext.jsx con:
- useAuth() hook que expone: currentUser, loading, loginWithEmail, loginWithGoogle, register, logout
- loginWithGoogle usa GoogleAuthProvider y signInWithPopup
- Al hacer login/registro por primera vez, crear doc en users/{uid} con los campos del schema

TAREA 3 — Frontend: páginas Login y Register
Crear frontend/src/pages/Login.jsx y Register.jsx con:
- Formulario de email + password con validación básica
- Botón "Continuar con Google"
- Máximo 2 clics para Google Auth (según PRD)
- Redirect a /onboarding si es primer login (cold_start_done === false), o a /feed si ya completó

TAREA 4 — Frontend: rutas protegidas
Crear frontend/src/components/ProtectedRoute.jsx:
- Si no hay currentUser → redirect a /login
- Si hay currentUser pero cold_start_done === false → redirect a /onboarding
- Si hay currentUser y cold_start_done === true → render children
Integrar en App.jsx con react-router-dom v6.

TAREA 5 — Backend: middleware de autenticación
Crear backend/src/middleware/auth.js:
- Extrae el Bearer token del header Authorization
- Verifica con firebase-admin auth().verifyIdToken(token)
- Si es válido, añade req.user = { uid, email }
- Si no es válido, responde 401 { error: "Unauthorized" }
Aplicar este middleware en backend/src/routes/index.js a TODAS las rutas de /api/*

TAREA 6 — Backend: instalar y configurar firebase-admin
npm install firebase-admin en el backend.
Crear backend/src/firebase/admin.js que inicialice el SDK con 
GOOGLE_APPLICATION_CREDENTIALS o el emulador en desarrollo.

TAREA 7 — Registrar el Service Worker en frontend/src/main.jsx
Germán Pacheco creará sw.js y manifest.json. Tú conectas el SW al frontend.
Añadir al final de main.jsx (después de ReactDOM.createRoot):

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }

Esto no rompe nada si sw.js no existe aún — el browser falla silenciosamente.

Probar que:
1. Login con email funciona y crea doc en users/
2. Login con Google funciona
3. Una llamada a GET /api/health con token válido devuelve 200
4. Una llamada sin token devuelve 401

Muéstrame la estructura de archivos al terminar y cómo probar en el emulador.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-andres-auth.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Andrés González Habib"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-1]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Indicar si app.js y App.jsx fueron creados con todas las rutas pre-registradas.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/firebase/config.js` — SDK inicializado con emulator en dev
- [ ] `frontend/src/contexts/AuthContext.jsx` — hook useAuth completo
- [ ] `frontend/src/pages/Login.jsx` y `Register.jsx` — Email + Google
- [ ] `frontend/src/components/ProtectedRoute.jsx` — rutas protegidas
- [ ] `backend/src/middleware/auth.js` — verifica Firebase ID Token
- [ ] Doc `users/{uid}` creado en Firestore al primer login
- [ ] Test: 401 sin token, 200 con token válido
