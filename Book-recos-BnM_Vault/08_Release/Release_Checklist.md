---
project: "Recos-BnM"
owner: "Germán Pacheco"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [release, checklist, deploy]
---

# Release Checklist — Recos-BnM

> Pre-deploy checklist para cualquier release a producción.  
> Responsable de coordinación: [[Sprint-1/09-German-Pacheco|Germán Pacheco]] + [[PM-Edgar-Coronel|Eduardo Coronel (PM)]].  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Checklist de pre-deploy (MVP)

### Código y Calidad

- [ ] **G1 — Lint:** Todos los checks de ESLint en verde (0 errores)
- [ ] **G2 — Unit Tests:** 100% de tests pasando en backend
- [ ] **G3 — Firestore Rules:** Tests de seguridad pasando
- [ ] **G4 — Build:** `npm run build` exitoso sin warnings críticos
- [ ] **G6 — Security:** `npm audit --audit-level=high` sin vulnerabilidades high/critical
- [ ] **PR Reviews:** Todos los PRs del sprint aprobados por mínimo 1 reviewer

### Funcionalidad (Manual QA)

- [ ] **HP-01:** Flujo completo de usuario nuevo funciona end-to-end
- [ ] **HP-02:** Login con Google funciona
- [ ] **HP-03:** Cambio de tab Películas → Libros preserva estado
- [ ] **CB-01:** Feed agotado muestra mensaje correcto (no crash)
- [ ] **CB-02:** Watch providers vacíos muestran placeholder, no datos inventados
- [ ] **CB-03:** Eliminar ítem de colección funciona correctamente
- [ ] **CB-04:** Token expirado redirige a login
- [ ] **CB-05:** App funciona offline (colección visible sin red)

### Performance

- [ ] **LCP < 2.5s** en Chrome DevTools con throttling 4G
- [ ] **Lighthouse Performance** ≥ 70 (warning, no bloqueante)
- [ ] **Lighthouse Accessibility** ≥ 80 (bloqueante)
- [ ] **Lighthouse PWA** ≥ 70 (warning)
- [ ] App funciona correctamente en pantalla **375px** (iPhone SE)

### Seguridad y Compliance

- [ ] **Atribución TMDB** visible en DetailSheet para películas
- [ ] **Ningún watch provider inventado** — solo datos de TMDB o placeholder neutro
- [ ] **Secretos** NO están en el código fuente (`git log` limpio)
- [ ] **GitHub Secrets** configurados correctamente: `VITE_FIREBASE_*`, `FIREBASE_TOKEN`
- [ ] **Reglas de Firestore** desplegadas en producción (`firebase deploy --only firestore:rules`)
- [ ] **Solo Eduardo** tiene acceso al proyecto GCP de producción

### Infraestructura

- [ ] **Proyecto GCP** creado y configurado (Eduardo)
- [ ] **Firebase Auth** habilitado con proveedores Email + Google
- [ ] **Firestore** en producción con índices desplegados
- [ ] **Cloud Run API** desplegado y respondiendo (`/api/feed` → 200 o 401)
- [ ] **Cloud Run Ingest** desplegado con `min-instances=0`
- [ ] **Cloud Scheduler** creado con cron `0 4 * * *`
- [ ] **Firebase Hosting** con dominio personalizado (si aplica)
- [ ] **Service Worker** registrado y cacheando correctamente (DevTools → Application → SW)
- [ ] **manifest.json** válido (Lighthouse PWA verifica esto)

### Analítica

- [ ] Eventos de Firebase Analytics configurados y verificados en DebugView:
  - [ ] `onboarding_completed`
  - [ ] `swipe`
  - [ ] `feed_exhausted`
  - [ ] `detail_opened`
  - [ ] `content_saved`

### Documentación

- [ ] **SCHEMA.md** actualizado con schema final de Firestore (Israel)
- [ ] **API Specification** actualizada si hubo cambios de contrato
- [ ] **Decision Log** con cualquier decisión tomada en el sprint
- [ ] **DevLog** con entrada del día del deploy

---

## Post-deploy (primeras 24 horas)

- [ ] Verificar que los primeros usuarios reales pueden registrarse sin errores
- [ ] Monitorear Cloud Run logs por errores 500
- [ ] Verificar que el Cloud Scheduler ejecutó correctamente el ingest job
- [ ] Revisar Firebase Auth → usuarios registrados aumentando
- [ ] Confirmar que Firebase Analytics recibe eventos en las primeras sesiones

---

## Rollback

Si se detecta un error crítico post-deploy:

1. **Frontend:** `firebase hosting:rollback` (Firebase mantiene versiones anteriores)
2. **Backend:** `gcloud run services update-traffic tinder-contenidos-backend --to-revisions=PREVIOUS=100`
3. **Firestore rules:** Revertir el archivo y `firebase deploy --only firestore:rules`

Ver [[08_Release/Deployment_Guide|Deployment Guide]] para comandos completos.

---

## Responsables del deploy

| Área | Responsable | Validador |
|---|---|---|
| Frontend deploy | [[Sprint-1/09-German-Pacheco\|Germán]] | Eduardo |
| Backend deploy | [[Sprint-1/09-German-Pacheco\|Germán]] | Eduardo |
| Firestore rules | [[Sprint-1/01-Israel-Perez\|Israel]] | Eduardo |
| QA sign-off | [[Sprint-1/13-Ulises-Chaparro\|Ulises]] | Eduardo |
| Final go/no-go | Eduardo Coronel (PM) | — |
