# Despliegue del Job de Ingest — Cloud Run + Cloud Scheduler

> ⚠️ Este documento es para el PM (Eduardo Coronel). Solo él tiene acceso a GCP.

## Requisitos previos
- `gcloud` CLI instalado y autenticado (`gcloud auth login`)
- Proyecto activo: `recos-bnm`
- APIs habilitadas: Cloud Run Jobs, Cloud Scheduler, Artifact Registry

---

## Paso 1 — Build y push de imagen Docker

```bash
# Desde la raíz del repo
gcloud builds submit ingest/ \
  --tag gcr.io/recos-bnm/ingest-job \
  --project recos-bnm
```

---

## Paso 2 — Crear el Cloud Run Job

```bash
gcloud run jobs create ingest-job \
  --image gcr.io/recos-bnm/ingest-job \
  --region us-central1 \
  --project recos-bnm \
  --set-env-vars TMDB_API_KEY=<TMDB_KEY>,GOOGLE_BOOKS_API_KEY=<BOOKS_KEY>,FIRESTORE_PROJECT_ID=recos-bnm \
  --service-account ingest-sa@recos-bnm.iam.gserviceaccount.com \
  --max-retries 2 \
  --task-timeout 3600
```

> Para actualizar el job tras un nuevo build:
> `gcloud run jobs update ingest-job --image gcr.io/recos-bnm/ingest-job --region us-central1`

---

## Paso 3 — Configurar Cloud Scheduler (cron diario 4 AM México)

```bash
gcloud scheduler jobs create http sync-catalogo-diario \
  --schedule "0 4 * * *" \
  --time-zone "America/Mexico_City" \
  --location us-central1 \
  --project recos-bnm \
  --uri "https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/recos-bnm/jobs/ingest-job:run" \
  --http-method POST \
  --oauth-service-account-email ingest-sa@recos-bnm.iam.gserviceaccount.com
```

---

## Paso 4 — Ejecutar manualmente para verificar

```bash
gcloud run jobs execute ingest-job --region us-central1 --project recos-bnm

# Ver logs
gcloud logging read \
  "resource.type=cloud_run_job AND resource.labels.job_name=ingest-job" \
  --limit 50 --project recos-bnm
```

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| `TMDB_API_KEY` | API Key de themoviedb.org |
| `GOOGLE_BOOKS_API_KEY` | API Key de Google Books |
| `FIRESTORE_PROJECT_ID` | `recos-bnm` |
