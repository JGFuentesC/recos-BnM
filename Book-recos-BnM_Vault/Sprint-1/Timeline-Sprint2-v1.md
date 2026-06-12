---
project: "Recos-BnM"
version: "Sprint 2 v1.0"
date: "2026-06-11"
author: "Edgar Coronel Navarrete (PM)"
tags: [timeline, phase-1, phase-2, sprint-2]
---

# Timeline Sprint 2 — v1.0
**Actualizado: 2026-06-11 (Jueves) | PM: Edgar Coronel**

> **Objetivo:** Completar Fase 1 (deploy GCP) + implementar Fase 2 (Engagement) antes del Lunes 15.
> - **PoC 1:** Viernes 13 de junio — sistema completo en GCP, QA team ejecuta pruebas físicas
> - **Entrega final:** Lunes 16 de junio — Fase 1 + Fase 2 funcionando en producción

---

## Dashboard — Resumen por persona y por día

> **Leyenda:** 🔴 Bloqueante/Urgente · 🟠 Deploy/Infra · 🟡 Feature dev · 🔐 Seguridad · 🟢 QA testing · 🔵 Integración/PR · ⭐ Demo

### Gráfico Gantt — Quién hace qué cada día

```
PERSONA        │ JUE 12 (HOY)          │ VIE 13 (PoC 1)        │ SAB 14 (Fase 2)        │ DOM 15 (Integrar)      │ LUN 16 (Entrega)
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Andrés         │ 🔴helmet+rate-limit   │ ⭐ Demo PoC 1         │ 🟡 usePushNotif.js    │ 🔵 PR merge            │ ⭐ Demo final
               │ 🔴 npm audit fix      │                       │                        │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Germán         │ 🔴 7 GitHub Secrets   │ ⭐ Demo PoC 1         │ 🟡 FCM VAPID + sw.js  │ 🔵 CI verde all PRs    │ ⭐ Demo final
               │ 🟠 Cloud Run job CI   │                       │ 🟠 Cloud Scheduler     │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Israel         │ 🔴 firebase deploy    │ ⭐ Demo PoC 1         │ (disponible para fixes)│                        │ ⭐ Demo final
               │ 🟠 2 nuevos índices   │                       │                        │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Manuel         │ 🔴 Ingest prod        │ ⭐ Demo PoC 1         │ 🟡 buildGenreAffinity  │ 🔵 PR merge            │ ⭐ Demo final
               │ 🟠 titleLower ingest  │                       │ 🟠 titleLower re-ingest│                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Luis           │                       │ ⭐ Demo PoC 1         │ 🔐 Audit SEC-L-01..05  │ 🔵 PR merge            │ ⭐ Demo final
               │                       │                       │ 🟡 feed affinity dinámica│                      │
               │                       │                       │ 🟡 /api/search         │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Juan Carlos    │ 🟠 Rotar API keys     │ ⭐ Demo PoC 1         │ 🔐 Audit SEC-JC-01..05 │ 🔵 PR merge            │ ⭐ Demo final
               │                       │                       │ 🟡 Search.jsx          │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Christian      │                       │ ⭐ Demo PoC 1         │ 🟡 3 endpoints share   │ 🔵 PR merge            │ ⭐ Demo final
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Diana          │                       │ 🟢 QA sec 3,7,11,13  │ 🟢 QA continúa         │ 🔵 Library share PR    │ ⭐ Demo final
               │                       │                       │ 🟡 Library share btn   │                        │
               │                       │                       │ 🟡 SharedList.jsx      │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Héctor         │                       │ 🟢 QA sec 0,1,8       │ 🟢 QA continúa+fixes   │ 🟢 QA completo         │ ⭐ Demo final
               │                       │ (39 casos)            │                        │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Monserrat      │                       │ 🟢 QA sec 2,4,5       │ 🟢 QA continúa+fixes   │ 🟢 QA completo         │ ⭐ Demo final
               │                       │ (27 casos)            │                        │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Marina         │                       │ 🟢 QA sec 6,9,10,12   │ 🟢 QA continúa+fixes   │ 🟢 QA completo         │ ⭐ Demo final
               │                       │ (34 casos)            │                        │                        │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Ulises         │                       │ 🟢 Casos F2 Postman   │ 🟢 Consolida bugs §14  │ 🟢 Casos F2-01..F2-06  │ ⭐ Demo final
               │                       │                       │                        │ 🟢 Firma §15+§16       │
───────────────┼───────────────────────┼───────────────────────┼────────────────────────┼────────────────────────┼──────────────────
Edgar (PM)     │ 🔴 Coordinar secrets  │ ⭐ Coordinar PoC 1    │ 🟡 About.jsx           │ 🔵 Review all PRs      │ ⭐ Demo final
               │ 🔴 Verificar gate     │ 📋 Gate PoC 1 check   │ 📋 Gate Sáb mediodía   │ 📋 Gate Dom final      │ 🎓 Dr. delivery
───────────────┴───────────────────────┴───────────────────────┴────────────────────────┴────────────────────────┴──────────────────
```

---

### Tabla de carga por persona y día

| Persona | Rol | Jue 12 | Vie 13 | Sáb 14 | Dom 15 | Lun 16 | Total tareas |
|---------|-----|:------:|:------:|:------:|:------:|:------:|:------------:|
| **Andrés** | Dev medio | 🔴🔴 2 | ⭐ demo | 🟡 1 | 🔵 1 | ⭐ demo | **6** |
| **Germán** | Dev medio / CI | 🔴🔴 + 🟠 3 | ⭐ demo | 🟡🟠 2 | 🔵 1 | ⭐ demo | **8** |
| **Israel** | Dev medio / Infra | 🔴🟠 2 | ⭐ demo | standby | — | ⭐ demo | **4** |
| **Manuel** | Dev medio | 🔴🟠 2 | ⭐ demo | 🟡🟠 2 | 🔵 1 | ⭐ demo | **7** |
| **Luis** | Dev bajo | — | ⭐ demo | 🔐 audit + 🟡🟡 3 | 🔵 1 | ⭐ demo | **6** |
| **Juan Carlos** | Dev bajo | 🟠 1 | ⭐ demo | 🔐 audit + 🟡 1 | 🔵 1 | ⭐ demo | **5** |
| **Christian** | Dev medio | — | ⭐ demo | 🟡 3 endpoints | 🔵 1 | ⭐ demo | **5** |
| **Diana** | Dev bajo / QA | — | 🟢 26 casos | 🟢 + 🟡🟡 2 | 🔵 1 | ⭐ demo | **5** |
| **Héctor** | QA | — | 🟢 39 casos | 🟢 continúa | 🟢 completo | ⭐ demo | **4** |
| **Monserrat** | QA | — | 🟢 27 casos | 🟢 continúa | 🟢 completo | ⭐ demo | **4** |
| **Marina** | QA | — | 🟢 34 casos | 🟢 continúa | 🟢 completo | ⭐ demo | **4** |
| **Ulises** | QA coord. | — | 🟢 Postman F2 | 🟢 bugs §14 | 🟢 §15+§16+firma | ⭐ demo | **4** |
| **Edgar (PM)** | PM | 🔴 coord + gate | ⭐ PoC 1 coord | 🟡 About.jsx + gates | 🔵 PRs review | ⭐ demo | **7** |

---

### Tabla de tareas críticas por día (resumen ejecutivo)

| Día | Hito | Tareas clave | Quién | Estado previo |
|-----|------|-------------|-------|---------------|
| **Jue 12** | 🔴 Deploy GCP | Helm+rate-limit backend · 7 Secrets GitHub · firebase deploy rules+indexes · Ingest prod (titleLower) · Rotar API keys | Andrés · Germán · Israel · Manuel · JC | Ningún deploy previo |
| **Vie 13** | 🎯 PoC 1 | Demo happy path 7 pasos · QA team ejecuta 126 casos físicos | Todo el equipo | Sistema debe estar en GCP desde el Jue |
| **Sáb 14 AM** | 🔐 Seguridad | Audit SEC-L-01..05 (Luis) · Audit SEC-JC-01..05 (JC) | Luis · Juan Carlos | Ejecutar ANTES de features |
| **Sáb 14 PM** | 🟡 Fase 2 | buildGenreAffinity · feed affinity dinámica · /api/search · Search.jsx · 3 share endpoints · FCM VAPID + sw.js · usePushNotifications · About.jsx | Manuel · Luis · JC · Christian · Germán · Andrés · Edgar | QA continúa en paralelo |
| **Dom 15** | 🔵 Integración | Todos los PRs mergeados · CI verde · QA completo · §15+§16 firmados | Todo el equipo | Cero bugs bloqueantes |
| **Lun 16** | ⭐ Entrega | Demo Fase 1 + Fase 2 completa (13 pasos) | Todo el equipo | Todo en producción |

---

### Distribución de carga total por tipo de tarea

```
TIPO DE TAREA          PERSONAS INVOLUCRADAS            TOTAL
─────────────────────────────────────────────────────────────
🔴 Deploy/Bloqueantes  Andrés · Germán · Israel ···       6 tareas  ████████████
🟠 Infra/Ingest        Germán · Israel · Manuel ·····     5 tareas  ██████████
🟡 Features Fase 2     Manuel · Luis · JC · Christian     8 tareas  ████████████████
               (F2)    Germán · Andrés · Diana · Edgar
🔐 Auditoría Seg.      Luis (5) · Juan Carlos (5) ····   10 checks  ████████████████████
🟢 QA Físico           Héctor · Monserrat · Marina ···  126 casos   ████████████████████████████████
               (QA)    Diana · Ulises
🔵 Integración         Todo el equipo · Dom 15 ·······   13 PRs     ██████████████████████████
⭐ Demo                 Todo el equipo · Lun 16 ·······   13 pasos   ██████████████████████████
─────────────────────────────────────────────────────────────
TOTAL                  13 personas                      ~170 items
```

---

## Estado de Fase 1 al día de hoy (Jue 11 jun)

| Área | Estado | Responsable | Pendiente |
|------|--------|-------------|-----------|
| **Firestore schema + reglas** | ✅ Listo (emulador) | Israel | Deploy a producción |
| **Auth (login/register)** | ✅ Listo | Andrés | npm audit fix (HIGH-02) |
| **Ingest catálogo TMDB + Books** | ✅ Listo (emulador) | Manuel | Re-ejecutar en prod |
| **scoring.js** | ✅ Listo | Manuel | — |
| **GET /api/feed + POST /api/swipe** | ✅ Listo | Luis | — |
| **GET /api/content/{id}** | ✅ Listo | Héctor | — |
| **CRUD /api/collections** | ✅ Listo | Christian | — |
| **Onboarding + TabSelector** | ✅ Listo | Juan Carlos | — |
| **ContentCard** | ✅ Listo | Edgar | — |
| **SwipeDeck** | ✅ Listo | Monserrat | — |
| **DetailSheet** | ✅ Listo | Marina | — |
| **Library.jsx** | ✅ Listo (PR #57 mergeado) | Diana | — |
| **CI/CD deploy.yml** | ⚠️ Estructura lista | Germán | 7 Secrets + Cloud Run job |
| **GCP deploy (Cloud Run)** | ❌ Sin desplegar | Germán + Andrés | Deploy urgente |
| **Firebase Hosting URL** | ❌ Sin desplegar | Germán | CI/CD con secrets |
| **Seguridad app.js (helmet + rate-limit)** | ❌ **NO instalado** — BLOQUEA GCP | Andrés | `npm install helmet express-rate-limit` en backend/ |
| **titleLower en ingest** | ❌ No existe | Manuel | Agregar al payload de tmdb_ingest.py |
| **buildGenreAffinity en scoring.js** | ❌ No existe | Manuel | Solo agregar función — `computeScore` ya existe |
| **Índice titleLower en Firestore** | ❌ No existe | Israel | Agregar a `src/firestore/firestore.indexes.json` |

---

## Vista de calendario

```
JUN   JUE 12       VIE 13       SAB 14       DOM 15       LUN 16
      ─────────────────────────────────────────────────────────────
      🔴 URGENTE    🎯 PoC 1     🟡 FASE 2    🟡 FASE 2    🎯 ENTREGA
      DEPLOY GCP    QA INICIA    Features     Integración  FINAL
                    GCP Live     Paralelo     QA completa  Demo Dr.

QUIÉN:
JUE:  Israel        VIE: QA team SAB: Dev     DOM: QA full  LUN: All
      Germán             (Héctor,     team          + fixes
      Manuel             Marina,      Phase 2
      JC (API keys)      Monse,
      Andrés             Diana)
```

---

## Detalle por día

---

### 🔴 Jueves 12 de junio — URGENTE: Deploy Fase 1 a GCP

> **El POC 1 es MAÑANA (viernes 13).** Si el sistema no está en GCP hoy, no hay demo.
> **Meta del día:** URL pública de Firebase Hosting funcionando + Cloud Run respondiendo.

| Persona         | Tarea                                                                            | Depende de             | Entregable del día                        |
| --------------- | -------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- |
| **Andrés** 🔴   | `cd backend && npm install helmet express-rate-limit` + actualizar `app.js`      | —                      | **BLOQUEANTE** — backend con seguridad HTTP |
| **Germán** 🔴   | Agregar 7 GitHub Secrets (ver lista abajo)                                       | Firebase Console (PM)  | Secrets confirmados en GitHub Actions     |
| **Germán** 🔴   | Agregar job `deploy-backend` a `deploy.yml` para Cloud Run                       | Secrets listos         | CI/CD despliega backend en push           |
| **Israel** 🔴   | `firebase deploy --only firestore:rules,firestore:indexes`                       | —                      | Reglas publicadas en producción (rutas en `firebase.json`) |
| **Israel** 🔴   | Agregar 2 índices a `src/firestore/firestore.indexes.json`: swipes + titleLower  | —                      | Ambos índices presentes y desplegados     |
| **Manuel** 🔴   | Re-ejecutar `tmdb_ingest.py` + `books_ingest.py` contra Firestore producción     | Israel (reglas prod ✓) | ≥500 docs en `content` producción con `titleLower` |
| **Juan Carlos** | Rotar API keys: TMDB + Google Books + Firebase Web Key                           | —                      | Keys rotadas, `.env` actualizado          |
| **Andrés**      | `npm audit fix` en frontend + verificar 0 HIGH vulnerabilidades                  | —                      | `npm audit` limpio                        |
| **Andrés**      | Confirmar que `VITE_API_URL` apunta al Cloud Run URL de producción               | Germán (URL Cloud Run) | `.env.local` y GitHub Secret actualizados |

**GitHub Secrets requeridos (Germán configura en GitHub → Settings → Secrets):**
```
FIREBASE_SERVICE_ACCOUNT   ← JSON del service account (Firebase Console → Project Settings → Service Accounts)
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID   = proyectofinal-71637
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

**Gate del jueves (verificar antes de las 8pm):**
```
☐ GET https://[cloud-run-url]/health → {"ok":true}
☐ https://recos-bnm.web.app carga la app (o la URL que genere Firebase Hosting)
☐ Login con Google funciona en producción
☐ GET /api/feed con token válido → array con ≥10 ítems
```

---

### 🎯 Viernes 13 de junio — PoC 1: Demo en GCP + QA team inicia pruebas

> **Meta del día:** Demostrar el happy path completo en producción + equipo QA ejecuta sus secciones asignadas.

#### Demo PoC 1 — Happy path (30 minutos, PM coordina)

| # | Flujo a demostrar | Responsable |
|---|-------------------|-------------|
| 1 | URL pública carga la app sin errores | Germán |
| 2 | Registro con Email nuevo → redirige a Onboarding | Andrés |
| 3 | Onboarding: seleccionar géneros + swipe 5 tarjetas → guarda `cold_start_done: true` | Juan Carlos |
| 4 | Feed con portadas reales de TMDB + libros de Google Books | Luis + Manuel |
| 5 | Swipe derecha (like) y izquierda (dislike) con animación fluida | Monserrat |
| 6 | Tap en tarjeta → DetailSheet con watchProviders reales | Marina + Héctor |
| 7 | Guardar ítem → toast "¡Guardado!" → aparece en Biblioteca | Christian + Diana |

#### QA Team — iniciar pruebas físicas (ver secciones en archivos individuales)

| Persona | Secciones a ejecutar | Casos | Herramienta |
|---------|----------------------|-------|-------------|
| **Héctor** | 0-Pre-req + 1-Auth + 8-API Postman | 39 casos | Postman/Bruno + browser |
| **Monserrat** | 2-Onboarding + 4-Feed + 5-SwipeDeck | 27 casos | Dispositivo móvil real |
| **Marina** | 6-DetailSheet + 9-Firestore + 10-PWA + 12-Edge Cases | 34 casos | Chrome DevTools + modo avión |
| **Diana** | 3-Tab Selector + 7-Library + 11-CI/CD + 13-GCP Infra | 26 casos | Firebase Console + GCP Console |

> Registrar todos los bugs en `PHYSICAL_TEST_VALIDATION.md` §14. Avisar a Ulises por cada bug nuevo.

---

### 🟡 Sábado 14 de junio — Fase 2: Features en paralelo

> **Meta del día:** Implementar todos los features de Fase 2. El equipo de dev trabaja en paralelo.
> El equipo QA documenta los findings del POC 1 y continúa testing.

#### Equipo de Desarrollo — tareas paralelas (pueden ejecutarse simultáneamente)

> ⏰ **Orden sugerido del día:** Mañana = Auditoría de seguridad (Luis + JC). Tarde = Features Fase 2.

| Persona | Tarea | Tipo | Prioridad | Depende de |
|---------|-------|------|-----------|------------|
| **Luis** 🔐 | Auditar y corregir `feed.js`, `swipe.js`, `search.js` (SEC-L-01 a SEC-L-05) | Seguridad | P0-SEG | — |
| **Juan Carlos** 🔐 | Auditar `Search.jsx`, `Onboarding.jsx`, rutas protegidas (SEC-JC-01 a SEC-JC-05) | Seguridad | P0-SEG | — |
| **Manuel** | Agregar `buildGenreAffinity()` a `scoring.js` | Fase 2 P1 | P1 | — |
| **Christian** | 3 endpoints de share: `POST/GET/DELETE /api/collections/:id/share` | Fase 2 P2 | P2 | — |
| **Germán** | FCM VAPID key + push handler en `sw.js` + Cloud Scheduler para ingest cron | Fase 2 P2 | P2 | — |
| **Edgar (PM)** | `About.jsx` con logo TMDB + atribución + ruta `/about` | Fase 2 P3 | P3 | — |
| **Luis** | Integrar affinity en `/api/feed` + crear `/api/search` | Fase 2 P1 | P1 | Manuel (buildGenreAffinity ✓) + auditoría propia ✓ |
| **Juan Carlos** | `Search.jsx` con debounce + registrar ruta `/search` en `App.jsx` | Fase 2 P1 | P1 | Luis (/api/search ✓) + auditoría propia ✓ |
| **Diana** | Botón compartir lista en `Library.jsx` + `SharedList.jsx` + ícono búsqueda en `BottomNav.jsx` | Fase 2 P2 | P2 | Christian (share endpoint ✓) |
| **Andrés** | `usePushNotifications.js` hook + messaging en `firebase/config.js` | Fase 2 P2 | P2 | Germán (VAPID key ✓) |

#### Equipo QA — continuar testing + documentar bugs del POC 1

| Persona | Tarea del sábado |
|---------|-----------------|
| **Ulises** | Consolidar todos los bugs del POC 1 en §14 del PHYSICAL_TEST_VALIDATION.md |
| **Héctor** | Completar secciones no terminadas el viernes + verificar fixes de bugs encontrados |
| **Monserrat** | Completar secciones no terminadas el viernes |
| **Marina** | Completar secciones no terminadas el viernes |
| **Diana** | Completar secciones GCP y CI/CD |

---

### 🟡 Domingo 15 de junio — Integración Fase 2 + QA completo + fixes

> **Meta del día:** Fase 2 integrada y testeada. Cero bugs bloqueantes. Todo en producción.

| Persona | Tarea | Nota |
|---------|-------|------|
| **Luis** | PR con `/api/search` mergeado | Necesario para Juan Carlos |
| **Christian** | PR con share endpoints mergeado | Necesario para Diana |
| **Juan Carlos** | PR con `Search.jsx` mergeado | Necesario para BottomNav de Diana |
| **Diana** | PR con `Library.jsx` actualizado (share + búsqueda) mergeado | — |
| **Germán** | Verificar CI/CD verde con todos los PRs mergeados | — |
| **Ulises** | Ejecutar casos de Fase 2 (F2-01 a F2-06) | Feed con affinity, compartir lista, buscar |
| **Ulises** | Completar §15B, §15C y §16 del PHYSICAL_TEST_VALIDATION.md | Firma de validación final |
| **Todo el equipo** | DevLogs entregados en `Book-recos-BnM_Vault/DevLog/` | Un archivo por sesión de trabajo |
| **Edgar (PM)** | Review final de todos los PRs — CI verde — preparar deck de demo | — |

---

### 🎯 Lunes 16 de junio — Entrega final / PoC 2

**Happy path completo a demostrar (Fase 1 + Fase 2):**

| Paso | Flujo | Sistema |
|------|-------|---------|
| 1 | Abrir URL pública → pantalla Login | Firebase Hosting |
| 2 | Registro con Google (2 clics) → Onboarding | Firebase Auth |
| 3 | Onboarding: géneros → swipe → `cold_start_done: true` | Firestore + Juan Carlos |
| 4 | Feed con scoring real TMDB (Fase 1) | Luis + Manuel |
| 5 | Hacer 10+ swipes → feed se adapta a géneros favoritos (Fase 2) | Manuel affinity |
| 6 | Cambiar tab Películas ↔ Libros | Juan Carlos TabSelector |
| 7 | Buscar "Interstellar" en /search → resultado aparece (Fase 2) | Luis + Juan Carlos |
| 8 | Tap en tarjeta → DetailSheet + watchProviders | Marina + Héctor |
| 9 | Guardar en lista "Para el finde" + nota personal | Christian + Diana |
| 10 | Compartir lista → link público → abrir sin login (Fase 2) | Christian + Diana |
| 11 | Ir a Biblioteca → ver ítems + editar nota inline | Diana |
| 12 | Modo avión → app carga desde caché | Germán (Service Worker) |
| 13 | Pantalla About con logo TMDB y atribución (Fase 2) | Edgar |

---

## Cadenas de ejecución — orden exacto con dependencias

> Usa esta sección para auditar el avance. Cada paso tiene un número de orden y un responsable.
> Los pasos del mismo número pueden ejecutarse **en paralelo**. Los de número mayor deben esperar a los anteriores.

---

### Cadena A — Deploy GCP (Jueves 12) — CRÍTICO para PoC 1

```
PASO A1 (paralelo — hacer TODO esto a la vez):
  ┌─ [A1-G] Germán   → Agregar 7 GitHub Secrets en GitHub Actions Settings
  ├─ [A1-I] Israel   → firebase deploy --only firestore:rules,firestore:indexes
  ├─ [A1-I2] Israel  → Agregar índice swipes en firestore.indexes.json
  ├─ [A1-JC] JC      → Rotar API keys: TMDB + Google Books + Firebase Web Key
  └─ [A1-A] Andrés   → npm audit fix + verificar 0 HIGH

       ⬇ Cuando A1-G termina:

PASO A2 (paralelo):
  ┌─ [A2-G] Germán   → Agregar job deploy-backend en deploy.yml (necesita A1-G)
  └─ [A2-A] Andrés   → Actualizar VITE_API_URL con Cloud Run URL (necesita A1-G)

       ⬇ Cuando A1-I + A1-I2 terminan:

PASO A3:
  └─ [A3-M] Manuel   → Re-ejecutar ingest prod: tmdb_ingest.py + books_ingest.py
                         (necesita A1-I: reglas publicadas en Firestore producción)

       ⬇ Cuando A2-G + A3-M terminan:

PASO A4 — Verificación de Gate (PM Edgar):
  └─ [A4-E] Edgar    → Ejecutar checklist Gate PoC 1 (ver sección Gates más abajo)
                        GET /health → ok | App carga | Login Google funciona | Feed devuelve ítems
```

**Bloqueos críticos de Cadena A:**
- Si `A1-G` (secrets) falla → `A2-G` y `A2-A` quedan bloqueados
- Si `A1-I` (reglas prod) falla → `A3-M` (ingest) queda bloqueado
- Si `A3-M` falla → no hay contenido en prod → PoC 1 sin datos reales

---

### Cadena B — Fase 2 Afinidad + Búsqueda (Sábado 14, P1 — empezar primero)

```
PASO B1 (paralelo — sin dependencias):
  ┌─ [B1-M] Manuel   → buildGenreAffinity() en scoring.js
  └─ [B1-L] Luis     → Crear ruta GET /api/search en backend/src/routes/search.js
                        (puede avanzarse en paralelo con Manuel)

       ⬇ Cuando B1-M termina:

PASO B2:
  └─ [B2-L] Luis     → Integrar buildGenreAffinity en GET /api/feed
                        (cuando usuario tiene ≥10 swipes, aplicar multiplier por género)

       ⬇ Cuando B1-L + B2-L terminan:

PASO B3:
  └─ [B3-JC] JC      → Search.jsx: input con debounce 300ms + chips tipo + ContentCard
                        GET ${VITE_API_URL}/api/search?q=&type= con Bearer token
                        Registrar /search en App.jsx
```

---

### Cadena C — Fase 2 Listas Compartibles (Sábado 14, P2 — puede ir en paralelo con B)

```
PASO C1 (sin dependencias):
  └─ [C1-CH] Christian → POST /api/collections/:id/share  (genera shareToken)
                          GET  /api/collections/share/:token  (sin auth)
                          DELETE /api/collections/:id/share
                          ⚠️ Nota: registrar GET /share/:token ANTES que GET /:id en el router

       ⬇ Cuando C1-CH termina:

PASO C2 (paralelo):
  ┌─ [C2-D] Diana    → Botón compartir en Library.jsx → llama POST share
  └─ [C2-D2] Diana   → SharedList.jsx: vista pública (sin login) que consume GET /share/:token

       ⬇ Cuando B3-JC termina:

PASO C3:
  └─ [C3-D] Diana    → Agregar ícono 🔍 Buscar en BottomNav.jsx → redirige a /search
```

---

### Cadena D — Fase 2 Push Notifications (Sábado 14, P2 — paralela con B y C)

```
PASO D1 (sin dependencias):
  └─ [D1-G] Germán   → Generar VAPID key en Firebase Console
                        Agregar push handler + notificationclick a frontend/public/sw.js
                        Agregar VITE_FIREBASE_VAPID_KEY como GitHub Secret

       ⬇ Cuando D1-G termina:

PASO D2:
  └─ [D2-A] Andrés   → usePushNotifications.js hook
                        Agregar messaging export a firebase/config.js
```

---

### Cadena E — Fase 2 Independientes (Sábado 14 — sin dependencias, cualquier momento)

```
PASO E1 (totalmente independiente):
  ├─ [E1-E] Edgar    → About.jsx con logo TMDB + texto atribución + ruta /about en App.jsx
  └─ [E1-U] Ulises   → Actualizar colección Postman con 4 endpoints nuevos de Fase 2
```

---

### Cadena G — Auditoría de Seguridad (Sábado 14 — MAÑANA, antes que las features de Fase 2)

> **Quién:** Luis Téllez + Juan Carlos Macías
> **Cuándo:** Sábado por la mañana, ANTES de abrir cualquier PR de Fase 2
> **Por qué:** Sus archivos de Fase 2 (search.js, Search.jsx) son puntos de entrada nuevos. Deben auditarse antes de mergearse.

```
PASO G1 (paralelo — sin dependencias, ejecutar a primera hora del sábado):
  ┌─ [G1-L] Luis       → Auditar backend: IDOR en /api/feed y /api/swipe (SEC-L-01)
  │                       Sanitización en /api/search (SEC-L-02)
  │                       Cobertura de auth en todas las rutas (SEC-L-03)
  │                       Error leakage / stack traces (SEC-L-04)
  │                       Rate limit verificado (SEC-L-05)
  │
  └─ [G1-JC] JC        → Auditar frontend: XSS en Search.jsx (SEC-JC-01)
                          Rutas protegidas sin auth (SEC-JC-02)
                          Tokens en localStorage (SEC-JC-03)
                          URL no expone datos de sesión (SEC-JC-04)
                          npm audit --audit-level=high (SEC-JC-05)

       ⬇ Cuando G1-L + G1-JC terminan (fixes aplicados en su propio código):

PASO G2:
  ├─ [G2-L] Luis       → Abrir PR con fixes de seguridad + features Fase 2 (B2-L + B1-L juntos)
  └─ [G2-JC] JC        → Abrir PR con fixes de seguridad + Search.jsx (B3-JC juntos)
                          (Los hallazgos de npm audit van a Andrés, no a este PR)

       ⬇ Cuando G2-L termina:

PASO G3:
  └─ [G3-JC] JC        → Integrar con /api/search de Luis (B3-JC depende de G2-L)
```

**Bloqueos críticos de Cadena G:**
- G1-L y G1-JC NO bloquean a Manuel, Christian ni Germán → pueden arrancar en paralelo
- G2-L (PR de Luis) sí bloquea G3-JC (Juan Carlos necesita que /api/search esté disponible)

---

### Cadena F — QA (Viernes 13 → Domingo 15)

```
PASO F1 — Viernes 13, después del Gate A4:
  ┌─ [F1-H] Héctor       → Ejecutar Secciones 0, 1, 8 (39 casos) — registrar PASS/FAIL
  ├─ [F1-Mon] Monserrat  → Ejecutar Secciones 2, 4, 5 (27 casos)
  ├─ [F1-Mar] Marina     → Ejecutar Secciones 6, 9, 10, 12 (34 casos)
  └─ [F1-D] Diana        → Ejecutar Secciones 3, 7, 11, 13 (26 casos)

PASO F2 — en paralelo con F1 (Sábado):
  └─ [F2-U] Ulises       → Consolidar bugs en §14, priorizar con equipo dev

PASO F3 — Domingo 15:
  └─ [F3-U] Ulises       → Ejecutar casos Fase 2 (F2-01 a F2-06)
                            Completar §15A, §15B, §15C + firmar §16
```

---

## Mapa de dependencias

```
Hoy (Jue 12)                     Vie 13            Sáb 14            Dom 15
│
├─ Israel     (firestore prod) ──────────────────────────────────────────────────►┐
├─ Germán     (secrets + CI/CD) ─────────────────────────────────────────────────►│
├─ Manuel     (ingest prod) ─────────────────────────────────────────────────────►│ POC 1
├─ JC         (rotar API keys) ──────────────────────────────────────────────────►│ DEMO
├─ Andrés     (npm audit fix) ───────────────────────────────────────────────────►┘
│
│  FASE 2 (Sáb 14 — mañana: seguridad; tarde: features)
├─ Luis  🔐   (auditoría SEC-L-01..05) ──────────────────────────────────────► Luis (affinity + /api/search PR)
├─ JC    🔐   (auditoría SEC-JC-01..05) ─────────────────────────────────────► JC (Search.jsx PR)
├─ Manuel     (buildGenreAffinity) ──────────┐
│                                            └──► Luis (feed affinity) ──► JC (Search.jsx)
├─ Christian  (share endpoints) ─────────────────────────────────────────────────────────────► Diana (Library share)
├─ Germán     (FCM VAPID key) ───────────────────────────────────────────────────────────────► Andrés (usePushNotifications)
├─ Edgar      (About.jsx) ───────────────────► (independiente)
│
│  QA (Vie 13 → Dom 15)
├─ Héctor     (0, 1, 8)    ──────── 39 casos ──────────────────────────────────►┐
├─ Monserrat  (2, 4, 5)    ──────── 27 casos ──────────────────────────────────►├── Ulises consolidar
├─ Marina     (6, 9, 10, 12) ────── 34 casos ──────────────────────────────────►│   §15 + §16
└─ Diana      (3, 7, 11, 13) ────── 26 casos ──────────────────────────────────►┘
```

---

## Fase 2 — Resumen de features por persona

| Feature | Tipo | Backend | Frontend | Prioridad | Estado |
|---------|------|---------|----------|-----------|--------|
| **Auditoría seguridad backend** | 🔐 Seguridad | Luis (SEC-L-01..05) | — | **P0** | 🔲 Pendiente |
| **Auditoría seguridad frontend** | 🔐 Seguridad | — | Juan Carlos (SEC-JC-01..05) | **P0** | 🔲 Pendiente |
| Señal de afinidad histórica | Scoring mejora | Manuel (`buildGenreAffinity`) | — (transparente al usuario) | P1 | 🔲 Pendiente |
| Buscador de contenido | Nuevo flujo | Luis (`/api/search`) | Juan Carlos (`Search.jsx`) | P1 | 🔲 Pendiente |
| Listas compartibles | Nuevo flujo | Christian (3 endpoints share) | Diana (botón + `SharedList.jsx`) | P2 | 🔲 Pendiente |
| Notificaciones push FCM | Nuevo flujo | Germán (FCM + SW) | Andrés (`usePushNotifications`) | P2 | 🔲 Pendiente |
| Pantalla About / TMDB | UI | — | Edgar (`About.jsx`) | P3 | 🔲 Pendiente |
| Ícono búsqueda BottomNav | UI | — | Diana (`BottomNav.jsx`) | P1 | 🔲 Pendiente |

---

## QA — Distribución de 126 casos físicos

| Persona | Secciones | Casos | Archivo con detalle |
|---------|-----------|-------|---------------------|
| **Héctor Morales** | 0-Pre-req · 1-Auth (R+L) · 8-API Postman | **39** | `Sprint-1/05-Hector-Morales.md` |
| **Monserrat Miranda** | 2-Onboarding · 4-Feed datos · 5-SwipeDeck | **27** | `Sprint-1/10-Monserrat-Miranda.md` |
| **Marina García** | 6-DetailSheet · 9-Firestore Seg · 10-PWA · 12-Edge Cases | **34** | `Sprint-1/11-Marina-Garcia.md` |
| **Diana Álvarez** | 3-TabSelector · 7-Library · 11-CI/CD · 13-GCP Infra | **26** | `Sprint-1/12-Diana-Alvarez.md` |
| **Ulises Chaparro** | Coordinación + casos Fase 2 (F2-01 a F2-06) | **6+** | `Sprint-1/13-Ulises-Chaparro.md` |
| **Total** | | **≥132** | |

---

## ¿Qué puede correr en paralelo?

```
BLOQUE A — Deploy GCP (todos el jueves, en paralelo):
  Israel + Germán + Manuel pueden trabajar simultáneamente (no se bloquean entre sí).
  Juan Carlos rota keys también en paralelo.

BLOQUE B — Fase 2 backend (sábado mañana, en paralelo):
  Manuel (scoring) + Christian (share) pueden trabajar al mismo tiempo.
  Luis empieza affinity tan pronto Manuel entrega buildGenreAffinity().

BLOQUE C — Fase 2 frontend (sábado tarde, en paralelo):
  Juan Carlos (Search.jsx) + Diana (Library share) + Andrés (FCM) + Edgar (About) = todos en paralelo.

BLOQUE D — QA (viernes + sábado + domingo):
  Los 4 del equipo QA ejecutan sus secciones en paralelo, documentan bugs, y Ulises consolida.
```

---

## Checklist PM — Gates de cada PoC

### Gate PoC 1 — Jueves 12 antes de las 8pm (mañana PM verifica)

```
☐ GitHub Secrets: 7 secrets configurados (Germán)
☐ CI/CD verde con el último push a main (Germán)
☐ GET https://[cloud-run-url]/health → {"ok":true} (Germán)
☐ https://[firebase-hosting-url] carga la app (Germán)
☐ Firestore rules publicadas en prod (Israel)
☐ Firestore → content → ≥500 docs (Manuel)
☐ Login con Google funciona en producción (Andrés)
☐ GET /api/feed → ≥10 ítems (Luis)
☐ Rotación de API keys completada (Juan Carlos)
```

### Gate Entrega Final — Domingo 15 antes de medianoche

```
☐ GET /api/search?q=inter → resultados (Luis + JC)
☐ POST /api/collections/:id/share → shareUrl (Christian)
☐ GET /api/collections/share/:token (sin auth) → datos (Christian)
☐ Library.jsx: botón ↗ compartir lista funciona (Diana)
☐ /search carga y devuelve resultados (Juan Carlos)
☐ 126 casos PHYSICAL_TEST_VALIDATION.md ejecutados (QA team)
☐ §15A, §15B, §15C, §16 completados en PHYSICAL_TEST_VALIDATION.md (Ulises)
☐ Todos los DevLogs en Book-recos-BnM_Vault/DevLog/ (equipo)
☐ CI verde en main (Germán)
☐ About.jsx con logo TMDB (Edgar)
```

---

## Semáforo de riesgo

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Deploy GCP no listo para PoC 1 | 🟡 Media | 🔴 Alto | Germán + Israel trabajan en paralelo el jueves |
| npm audit HIGH-02 no cierra | 🟢 Baja | 🟡 Medio | `npm install react-router-dom@latest` |
| Ingest prod falla por API key expirada | 🟡 Media | 🔴 Alto | Juan Carlos rota keys HOY |
| Phase 2 no termina para el lunes | 🔴 Alta | 🟡 Medio | Solo P1 features son obligatorias (affinity + search). Share y FCM son P2 (mejora) |
| QA encuentra bug bloqueante en PoC 1 | 🟡 Media | 🟡 Medio | El sábado existe para fixes. Ulises coordina priorización |

---

---

## Auditoría de avance — PM Edgar (Jue 11 noche / Vie 12 mañana)

> Usa esta tabla para pasar lista antes del PoC 1. Marca cada ítem con ✅ / ❌ / 🔄 (en progreso).
> Ideal hacerlo a las **8pm del jueves** y de nuevo a las **9am del viernes** antes de la demo.

### Auditoría Cadena A — Deploy GCP

| ID | Persona | Tarea clave | Estado | Verificación |
|----|---------|-------------|--------|--------------|
| A1-G | Germán | 7 GitHub Secrets configurados | — | GitHub → Settings → Secrets → Actions → ver lista |
| A1-I | Israel | `firebase deploy --only firestore:rules,firestore:indexes` ejecutado | — | Firebase Console → Firestore → Rules → ver fecha de publicación |
| A1-I2 | Israel | Índice swipes agregado a `firestore.indexes.json` | — | Ver el archivo en repo / Firebase Console → Firestore → Indexes |
| A1-JC | Juan Carlos | Keys TMDB + Google Books + Firebase rotadas | — | `.env` actualizado + GitHub Secret `VITE_FIREBASE_API_KEY` nuevo |
| A1-A-SEC | Andrés | `npm install helmet express-rate-limit` en backend/ + `app.js` actualizado | — | `backend/package.json` tiene helmet y express-rate-limit |
| A1-A-AUDIT | Andrés | `npm audit` frontend sin HIGH vulnerabilidades | — | `cd frontend && npm audit` → 0 high/critical |
| A2-G | Germán | Job `deploy-backend` en `deploy.yml` | — | Ver `.github/workflows/deploy.yml` |
| A2-A | Andrés | `VITE_API_URL` apunta a Cloud Run URL real | — | GitHub Secret actualizado + `.env.local` |
| A3-M | Manuel | Ingest ejecutado en Firestore prod + `titleLower` en docs | — | Firebase Console → Firestore → `content` → doc tiene campo `titleLower` |
| A4-E | Edgar | Gate PoC 1 verificado (los 4 checklists) | — | Ver sección Gates más arriba |

### Auditoría Cadena G — Seguridad Luis + JC (verificar Sábado mediodía)

| ID | Persona | Check de seguridad | Estado | Cómo verificar |
|----|---------|-------------------|--------|----------------|
| G1-L-01 | Luis | IDOR en `/api/feed`: userId ajeno → 403 | — | curl con userId distinto al token → HTTP 403 |
| G1-L-01b | Luis | IDOR en `/api/swipe`: userId ajeno → 403 | — | POST con userId de otro → HTTP 403 |
| G1-L-02 | Luis | Sanitización en `/api/search`: `<script>` no causa 500 | — | `?q=<script>alert(1)</script>` → 200 vacío o 400 |
| G1-L-03 | Luis | Todos los endpoints sin token → 401 | — | curl sin Authorization → HTTP 401 en feed, swipe, search |
| G1-L-04 | Luis | 500 sin stack trace ni paths internos | — | Parámetros inválidos → `{"error":"mensaje genérico"}` |
| G1-L-05 | Luis | Rate limit en `/api/swipe` funciona | — | 35 POSTs seguidos → request 31+ da HTTP 429 |
| G1-JC-01 | JC | Sin `dangerouslySetInnerHTML` en `Search.jsx` | — | Grep en código: `dangerouslySetInnerHTML` no debe existir |
| G1-JC-02 | JC | `/search` y `/onboarding` redirigen a `/login` sin auth | — | Cerrar sesión → navegar a /search → debe ir a /login |
| G1-JC-03 | JC | Sin tokens en `localStorage` | — | DevTools → Application → Local Storage → vacío o sin tokens |
| G1-JC-04 | JC | URL de búsqueda no expone query ni session | — | URL debe ser `/search` (no `/search?token=...`) |
| G1-JC-05 | JC | `npm audit` ejecutado y reportado a Andrés | — | `cd frontend && npm audit --audit-level=high` → output documentado |

### Auditoría Cadena B/C/D/E — Fase 2 (verificar Sábado noche)

| ID | Persona | Tarea clave | Estado | Verificación |
|----|---------|-------------|--------|--------------|
| B1-M | Manuel | `buildGenreAffinity()` en `scoring.js` | — | Ver función en `backend/src/services/scoring.js` |
| B1-L | Luis | `GET /api/search` creado en `search.js` | — | `curl /api/search?q=test` con token → 200 |
| B2-L | Luis | Affinity integrado en `GET /api/feed` | — | Hacer 10+ swipes → comparar orden de feed |
| B3-JC | Juan Carlos | `Search.jsx` + ruta `/search` | — | Abrir la app → tab buscar → escribir algo → resultados |
| C1-CH | Christian | 3 endpoints share en `collections.js` | — | Postman: `POST /api/collections/:id/share` → shareUrl en respuesta |
| C2-D | Diana | Botón compartir en `Library.jsx` | — | Abrir Biblioteca → botón ↗ visible en una lista |
| C2-D2 | Diana | `SharedList.jsx` página pública | — | Abrir la shareUrl sin login → ver la lista |
| C3-D | Diana | Ícono 🔍 en `BottomNav.jsx` → `/search` | — | Tap ícono búsqueda → abre `/search` |
| D1-G | Germán | VAPID key + push handler en `sw.js` | — | `VITE_FIREBASE_VAPID_KEY` secret existente |
| D2-A | Andrés | `usePushNotifications.js` hook | — | Ver archivo en `frontend/src/hooks/` |
| E1-E | Edgar | `About.jsx` con logo TMDB + ruta `/about` | — | Navegar a `/about` → logo TMDB visible |

### Auditoría QA (verificar Sábado noche / Domingo)

| ID     | Persona   | Secciones                    | Total casos | Estado | Notas                                    |
| ------ | --------- | ---------------------------- | ----------- | ------ | ---------------------------------------- |
| F1-H   | Héctor    | 0, 1, 8                      | 39          | —      | Ver §14 en PHYSICAL_TEST_VALIDATION.md   |
| F1-Mon | Monserrat | 2, 4, 5                      | 27          | —      | Ver §14 en PHYSICAL_TEST_VALIDATION.md   |
| F1-Mar | Marina    | 6, 9, 10, 12                 | 34          | —      | Ver §14 en PHYSICAL_TEST_VALIDATION.md   |
| F1-D   | Diana     | 3, 7, 11, 13                 | 26          | —      | Ver §14 en PHYSICAL_TEST_VALIDATION.md   |
| F2-U   | Ulises    | Consolidación bugs           | —           | —      | §14 tiene todos los BUG-XXX documentados |
| F3-U   | Ulises    | Casos Fase 2 (F2-01 a F2-06) | 6           | —      | §15 + §16 firmados                       |

---

> **Versión 1.0** · Sprint 2 · Creado 2026-06-11 · PM: Edgar Coronel Navarrete
> → Lee el contexto individual de cada persona en `Sprint-1/[NN]-[Nombre].md`
> → Bugs en `Book-recos-BnM_Vault/PHYSICAL_TEST_VALIDATION.md` §14
