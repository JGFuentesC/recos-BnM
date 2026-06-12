# Sprint 1 — Germán Pacheco Castillo
**Nivel:** Bajo | **Épica:** Infra / §12 | **Wave:** 🟡 2 (CI puede iniciar antes, deploy después de Andrés)

---

## 🎯 Tu misión

Construir el **pipeline de despliegue** y la funcionalidad offline de la PWA. Eres quien hace que el código de todos llegue a una URL pública donde el Dr. puede ver la demo el martes 10. Tu objetivo inmediato: tener un "Hello World" desplegado en Firebase Hosting **antes del sábado 7** para validar que el pipeline funciona.

**Entrega el miércoles 10 jun:**
- GitHub Action: push a `main` → build → deploy automático a Firebase Hosting
- `sw.js` Service Worker: cachea la shell PWA + últimos 10 ítems de colección (offline parcial)
- Variables de entorno documentadas en `README.md`
- URL pública de Firebase Hosting disponible para la demo

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Estructura base del frontend | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Token de Firebase CI | [[PM-Edgar-Coronel\|Eduardo (PM)]] / tú mismo | Generar con `firebase login:ci` |
| Secrets en GitHub | [[PM-Edgar-Coronel\|Eduardo (PM)]] | Configurar en Settings → Secrets |

> 💡 **El pipeline de CI puedes armarlo ahora** con un "Hello World" básico de React. No necesitas esperar a Andrés para crear el workflow de GitHub Actions.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **Todo el equipo** se beneficia del deploy automático
- ✅ **[[13-Ulises-Chaparro|Ulises]]** necesita la URL pública para las pruebas de QA
- ✅ **El Dr.** necesita la URL para la demo del martes 10 (coordinar con [[PM-Edgar-Coronel|Eduardo]])

---

## 📋 Pasos manuales (sin Claude Code)

### Paso 1 — Generar el Service Account para CI
El deploy de Firebase Hosting vía GitHub Actions requiere un **service account JSON** (no un CI token).

**Eduardo (PM) debe hacer esto:**
1. Ir a [console.cloud.google.com](https://console.cloud.google.com) → IAM y administración → Cuentas de servicio
2. Crear cuenta de servicio con rol **Firebase Hosting Admin**
3. Crear clave JSON → descargar el archivo
4. El contenido del JSON completo va como secret en GitHub

> ⚠️ `firebase login:ci` genera un token de sesión, que NO funciona con `firebaseServiceAccount`. Son dos autenticaciones distintas.

### Paso 2 — Configurar GitHub Secrets
1. Ir al repo en GitHub → Settings → Secrets and variables → Actions
2. Agregar los siguientes secrets:
   - `FIREBASE_SERVICE_ACCOUNT` → pegar el contenido completo del JSON del service account
   - `VITE_FIREBASE_API_KEY` → del proyecto Firebase
   - `VITE_FIREBASE_AUTH_DOMAIN` → del proyecto Firebase
   - `VITE_FIREBASE_PROJECT_ID` → `recos-bnm`
   - `VITE_FIREBASE_APP_ID` → del proyecto Firebase

### Paso 3 — Verificar que el deploy funciona
Después de hacer push a `main`, ir a GitHub → pestaña Actions y verificar que el workflow corre sin errores. La URL de Hosting aparece en los logs del deploy.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/09-German-agent-context.md — define qué archivos puedes tocar.

Necesito configurar el pipeline CI/CD y el Service Worker PWA para el proyecto Recos-BnM.
Stack: React (Vite) en frontend/, Firebase Hosting para el deploy.
El repo está en GitHub. El frontend ya tiene npm run build que genera dist/.

TAREA 1 — .github/workflows/deploy.yml
Crear el workflow de GitHub Actions:

name: Deploy to Firebase Hosting
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install dependencies
        run: npm ci
        working-directory: frontend
      - name: Build
        run: npm run build
        working-directory: frontend
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: recos-bnm
          entryPoint: .
          channelId: live

TAREA 2 — frontend/public/sw.js (Service Worker)
Crear el Service Worker para funcionalidad offline parcial:

Estrategia de caché:
1. CACHE SHELL (Cache First): cachear los archivos de la PWA al instalar
   - index.html, manifest.json, los chunks de JS y CSS generados por Vite
   - Nombre del caché: 'recos-bnm-shell-v1'

2. CACHE DE COLECCIÓN (Network First con fallback): para la URL /api/collections
   - Intentar red primero; si falla, servir desde caché
   - Guardar solo los últimos 10 items en el caché
   - Nombre del caché: 'recos-bnm-collections-v1'
   - Limpiar entradas antiguas cuando hay más de 10

3. Para otras rutas: Network First sin caché (el feed siempre fresco)

Incluir manejo de:
- install event: pre-cachear los archivos del shell
- activate event: limpiar cachés viejos (versiones anteriores)
- fetch event: aplicar las estrategias por URL

TAREA 3 — frontend/public/manifest.json
Crear el manifest de PWA:
  name: "Recos BnM"
  short_name: "RecosBnM"
  start_url: "/"
  display: "standalone"
  background_color: "#ffffff"
  theme_color: "#1a1a2e"
  icons: incluir referencias a iconos (crear placeholders si no existen)

TAREA 4 — Coordinar registro del Service Worker con Andrés González
⚠️ frontend/src/main.jsx es propiedad de Andrés González — NO modificarlo.
Notificar a Andrés (en el canal del equipo) que agregue este código al final de main.jsx:

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
    })
  }

Andrés ya tiene la tarea asignada. Tu trabajo en esta tarea es crear sw.js y manifest.json;
Andrés conecta el SW al frontend.

TAREA 5 — README.md en la raíz del repo
Documentar las variables de entorno requeridas:
  Frontend (secrets de GitHub para CI):
    VITE_FIREBASE_API_KEY
    VITE_FIREBASE_AUTH_DOMAIN
    VITE_FIREBASE_PROJECT_ID
    VITE_FIREBASE_APP_ID
  Backend (Cloud Run):
    TMDB_API_KEY
    GOOGLE_BOOKS_API_KEY
    GOOGLE_APPLICATION_CREDENTIALS
  
  Instrucciones para:
  1. Cómo generar FIREBASE_TOKEN para CI (firebase login:ci)
  2. Cómo configurar los secrets en GitHub
  3. Cómo arrancar el proyecto en local (emulador)

Al terminar, muéstrame el archivo deploy.yml completo y confirma que el sw.js 
está referenciado correctamente en el index.html generado por Vite.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-german-cicd.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Germán Pacheco Castillo"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Incluir la URL de Firebase Hosting donde se desplegó el Hello World. Confirmar que CLAUDE.md del repo de código fue creado.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `.github/workflows/deploy.yml` — CI en push a main
- [ ] Secrets configurados en GitHub (FIREBASE_TOKEN + 4 VITE vars)
- [ ] `frontend/public/sw.js` — caché shell + últimos 10 ítems de colección
- [ ] `frontend/public/manifest.json` — PWA manifest
- [ ] SW registrado en `main.jsx`
- [ ] `README.md` — variables de entorno documentadas
- [ ] **"Hello World" desplegado en Firebase Hosting antes del sábado 7**
- [ ] URL pública compartida con el equipo

---

## 🚀 Fase 2 — CI/CD Cloud Run + FCM (Jun 13–15, 2026)

> **Eres el dueño del pipeline y la infra de comunicaciones.** Tienes dos misiones críticas de Fase 2: agregar el deploy del backend (Cloud Run) al CI/CD, y configurar Firebase Cloud Messaging para las notificaciones push.

### 🎯 Tu misión Fase 2

**Prioridad 0 — Secrets de Fase 1 faltantes (Jueves 12 jun, HOY URGENTE):**

Ir a GitHub → Settings → Secrets and variables → Actions. Agregar si no existen:

| Secret | Cómo obtenerlo |
|--------|----------------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console → Project Settings → Service Accounts → Generate new private key → copiar JSON completo |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → General → Your apps |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → General |
| `VITE_FIREBASE_APP_ID` | Firebase Console → Project Settings → General |

Verificar que existen los 7 secrets: `FIREBASE_SERVICE_ACCOUNT`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

**Tarea 1 — Agregar job de Cloud Run al deploy.yml:**

```yaml
# Agregar al final de .github/workflows/deploy.yml, después del job de Firebase Hosting:

  deploy-backend:
    runs-on: ubuntu-latest
    needs: build-and-deploy  # Después de que el frontend se deployó
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
      
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: recos-bnm-api
          region: us-central1
          source: backend/
          env_vars: |
            FIREBASE_PROJECT_ID=proyectofinal-71637
            ALLOWED_ORIGINS=https://recos-bnm.web.app
            NODE_ENV=production
```

**Tarea 2 — FCM: configurar Firebase Cloud Messaging:**

1. Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair
2. Copiar la VAPID key pública
3. Agregar a GitHub Secrets: `VITE_FIREBASE_VAPID_KEY` = la VAPID key
4. Agregar al workflow en el paso "Build":
   ```yaml
   VITE_FIREBASE_VAPID_KEY: ${{ secrets.VITE_FIREBASE_VAPID_KEY }}
   ```

**Tarea 3 — FCM push handler en `sw.js`:**

Agregar el manejador de mensajes push al Service Worker existente:

```javascript
// Agregar al final de frontend/public/sw.js

// Firebase Messaging: recibir notificaciones en background
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}
  const title   = data.notification?.title   ?? 'Recos BnM'
  const options  = {
    body:    data.notification?.body   ?? 'Tienes nuevas recomendaciones',
    icon:    '/icons/icon-192.png',
    badge:   '/icons/badge-72.png',
    data:    { url: data.data?.url ?? '/' },
    actions: [{ action: 'open', title: 'Ver ahora' }]
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(clients.openWindow(url))
})
```

**Tarea 4 — Agregar Cloud Scheduler para ingest nocturno (confirmación con Manuel):**

Si Manuel ya tiene el ingest como Cloud Run Job, configurar el trigger:

```bash
# Ejecutar desde GCP Console Cloud Shell o con gcloud:
gcloud scheduler jobs create http ingest-nocturno \
  --schedule "0 4 * * *" \
  --uri "https://[URL-INGEST-JOB]/run" \
  --http-method POST \
  --oidc-service-account-email [SA-EMAIL] \
  --time-zone "America/Mexico_City" \
  --location us-central1
```

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Germán Pacheco, dueño de .github/workflows/deploy.yml y frontend/public/sw.js.

TAREA 1 — Actualizar .github/workflows/deploy.yml
Agregar el job deploy-backend después del job build-and-deploy:
- Usa google-github-actions/auth@v2 con credentials_json: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
- Usa google-github-actions/deploy-cloudrun@v2
- Service: recos-bnm-api, region: us-central1, source: backend/
- Env vars: FIREBASE_PROJECT_ID=proyectofinal-71637, ALLOWED_ORIGINS=https://recos-bnm.web.app, NODE_ENV=production
- needs: build-and-deploy (secuencial, después del frontend)

TAREA 2 — Agregar variable VITE_FIREBASE_VAPID_KEY al job build-and-deploy
En el paso "Build", agregar: VITE_FIREBASE_VAPID_KEY: ${{ secrets.VITE_FIREBASE_VAPID_KEY }}

TAREA 3 — Actualizar frontend/public/sw.js
Agregar al final del archivo el manejador de push notifications:
- 'push' event listener: mostrar notificación con self.registration.showNotification()
- 'notificationclick' event listener: cerrar notif y abrir clients.openWindow(url)
- El icono de la notificación: '/icons/icon-192.png'
- El body por default: 'Tienes nuevas recomendaciones'

⚠️ No romper el caché de shell ni el caché de collections que ya existen en sw.js.
Solo agregar los dos event listeners al final.
```

### ✅ Checklist Fase 2

- [ ] GitHub Secrets: 7 secrets configurados (incluyendo `FIREBASE_SERVICE_ACCOUNT`)
- [ ] `.github/workflows/deploy.yml` — job `deploy-backend` para Cloud Run
- [ ] `VITE_FIREBASE_VAPID_KEY` en GitHub Secrets + en el paso Build del workflow
- [ ] `frontend/public/sw.js` — push handler y notificationclick handler agregados
- [ ] CI/CD verde en el último push a `main`
- [ ] URL de Firebase Hosting compartida con el equipo
- [ ] URL de Cloud Run confirmada con Israel y Edgar
