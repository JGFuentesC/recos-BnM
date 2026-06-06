---
project: "Recos-BnM"
owner: "Germán Pacheco"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [release, deployment, devops, commands]
---

# Deployment Guide — Recos-BnM

> Comandos de deploy para todos los componentes. Fuente: PRD §12 + CI/CD de [[Sprint-1/09-German-Pacheco|Germán Pacheco]].  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Prerequisites

```bash
# Herramientas requeridas
node --version      # >=20.0.0
python --version    # >=3.11.0
firebase --version  # >=13.0.0
gcloud --version    # >=450.0.0

# Autenticación
firebase login
gcloud auth login
gcloud config set project <PROJECT_ID>
```

---

## 1. Deploy del Frontend (PWA → Firebase Hosting)

### Producción (manual)

```bash
cd frontend

# 1. Instalar dependencias
npm ci

# 2. Crear archivo .env.production con las variables (NUNCA commitear)
# O usar las variables de entorno del CI (preferido)

# 3. Build
npm run build
# Genera: frontend/dist/

# 4. Deploy a Firebase Hosting
firebase deploy --only hosting
```

### Staging / Preview Channel

```bash
# Crear un preview channel para QA antes de producción
firebase hosting:channel:deploy qa-review --expires 7d

# Ver URL del preview
firebase hosting:channel:list
```

### Rollback

```bash
# Ver versiones anteriores
firebase hosting:releases:list

# Rollback a una versión específica
firebase hosting:rollback
```

---

## 2. Deploy del Backend API (Cloud Run)

### Producción (manual)

```bash
cd backend

# Deploy desde source code
gcloud run deploy tinder-contenidos-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars FIREBASE_PROJECT_ID=<PROJECT_ID>
```

### Verificar el deploy

```bash
# Ver la URL del servicio
gcloud run services describe tinder-contenidos-backend \
  --region us-central1 \
  --format "value(status.url)"

# Test rápido (debe devolver 401 sin token)
curl https://<cloud-run-url>/api/feed?type=movie
```

### Rollback

```bash
# Ver revisiones disponibles
gcloud run revisions list --service tinder-contenidos-backend --region us-central1

# Rollback a revisión anterior
gcloud run services update-traffic tinder-contenidos-backend \
  --region us-central1 \
  --to-revisions=<PREVIOUS_REVISION>=100
```

---

## 3. Deploy del Ingest Job (Cloud Run Job)

```bash
cd ingest

# Deploy del job
gcloud run jobs deploy tinder-contenidos-ingest \
  --source . \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars TMDB_API_KEY=<KEY>,GOOGLE_BOOKS_API_KEY=<KEY>

# Ejecutar manualmente (para la primera carga de datos)
gcloud run jobs execute tinder-contenidos-ingest --region us-central1

# Ver logs del job
gcloud run jobs executions list --job tinder-contenidos-ingest --region us-central1
```

---

## 4. Deploy del Cloud Scheduler

```bash
# Crear el trigger diario del ingest job
gcloud scheduler jobs create http sync-catalogo \
  --schedule "0 4 * * *" \
  --uri "https://<INGEST-JOB-URL>/run" \
  --http-method POST \
  --location us-central1 \
  --time-zone "America/Mexico_City"

# Ejecutar manualmente para probar
gcloud scheduler jobs run sync-catalogo --location us-central1

# Ver estado
gcloud scheduler jobs list --location us-central1
```

---

## 5. Deploy de Firestore Rules e Indexes

```bash
cd firestore

# Solo reglas de seguridad
firebase deploy --only firestore:rules

# Solo índices
firebase deploy --only firestore:indexes

# Ambos
firebase deploy --only firestore

# Verificar reglas desplegadas
firebase firestore:rules
```

---

## 6. Deploy via GitHub Actions (CI/CD automático)

El workflow `.github/workflows/deploy.yml` se dispara automáticamente en cada push a `main`.

**Qué hace:**
1. Corre Lint + Tests + Build (Gates G1-G4, G6)
2. Si pasan: deploy a Firebase Hosting
3. Si pasan: deploy del Backend a Cloud Run

**Variables de entorno en GitHub Secrets (configurar una sola vez):**

| Secret | Valor |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `<project>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | GCP Project ID |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_API_BASE_URL` | URL de Cloud Run del backend |
| `FIREBASE_TOKEN` | Token de `firebase login:ci` |
| `GCP_SERVICE_ACCOUNT_KEY` | JSON de service account para Cloud Run deploy |

**Configurar por Eduardo Coronel (tiene acceso a GCP prod).**

---

## 7. Verificación post-deploy

```bash
# 1. Frontend — verificar que carga
curl -I https://<firebase-hosting-url>
# Esperado: 200 OK

# 2. Backend — verificar que responde
curl https://<cloud-run-url>/api/feed?type=movie
# Esperado: 401 Unauthorized (sin token, correcto)

# 3. Firestore Rules — verificar en consola
# Firebase Console → Firestore → Rules → Rules Playground

# 4. Service Worker — verificar en Chrome
# DevTools → Application → Service Workers → Status: activated and running

# 5. manifest.json — verificar
curl https://<firebase-hosting-url>/manifest.json
# Esperado: JSON con name, icons, start_url, display: standalone
```

---

## 8. Configuración de min-instances (si D0 se degrada)

Si la retención D0 (activación) cae por debajo de la meta, mitigar el cold start:

```bash
gcloud run services update tinder-contenidos-backend \
  --region us-central1 \
  --min-instances 1
```

**Costo estimado adicional:** ~$15/mes por 1 instancia siempre activa (us-central1).  
**Decisión:** Eduardo Coronel (PM) aprueba el gasto antes de activar.

---

## 9. Troubleshooting común

| Problema | Síntoma | Solución |
|---|---|---|
| Cold start lento | Primera request tarda >5s | `--min-instances 1` en Cloud Run |
| Build de Vite falla | Error de variables faltantes | Verificar GitHub Secrets configurados |
| 401 en todos los endpoints | Token de Firebase no válido | Verificar `FIREBASE_PROJECT_ID` en Cloud Run env vars |
| Ingest job no corre | No hay datos en Firestore | `gcloud run jobs execute tinder-contenidos-ingest` manual |
| PWA no se instala | Lighthouse PWA falla | Verificar `manifest.json` y HTTPS activo |
| Firestore permission denied | Reglas demasiado restrictivas | `firebase deploy --only firestore:rules` con reglas correctas |
