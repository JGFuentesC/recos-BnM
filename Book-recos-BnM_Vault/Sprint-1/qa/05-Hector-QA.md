---
project: "Recos-BnM"
date: "2026-06-12"
owner: "Héctor Morales Marbán"
role: "QA / Testing — Fase 2"
sprint: "Sprint-1"
window: "2026-06-13 → 2026-06-15"
scope: "Secciones 0 (Pre-requisitos), 1 (Auth) y 8 (API Backend) — 39 casos"
status: "Desk-check completo (pre-validación contra código + backend local) — ejecución física pendiente"
tags: [qa, physical-test, sprint-1, hector, auth, api]
---

# QA Physical Testing — Hoja de trabajo de Héctor

> **Documento personal de trabajo.** Los resultados oficiales se vacían en el archivo
> compartido [[PHYSICAL_TEST_VALIDATION|PHYSICAL_TEST_VALIDATION.md]] (de Edgar, PM).
> Aquí preparo y rastreo **mis 39 casos** antes y durante la ejecución.
>
> **Mi rol:** responsable de las secciones de **Auth y API** — las más técnicas, que
> requieren conocer los endpoints. Fuente de la asignación: [[05-Hector-Morales]].

## 🔎 Pre-validación (desk-check) — 2026-06-12

Validé cada caso contra el **código real del repo** y, donde fue posible, contra el
**backend local** (`http://localhost:3001`, Vite en `:5173`). Esto adelanta el comportamiento
esperado y detecta discrepancias antes de la ejecución física. **No sustituye** la prueba en producción.

**Estados del desk-check:**

| Símbolo | Significado |
|---------|-------------|
| ✅ local | Ejecutado contra backend local — confirmado |
| ✅ código | Comportamiento respaldado por el código (pend. verificación física) |
| ⚠️ BUG? | **Discrepancia** entre lo esperado y el código → posible bug a confirmar |
| 🔌 vivo | Requiere ejecución en vivo (token Firebase real / URL prod / datos en Firestore) |

> **2 hallazgos** detectados en el desk-check → ver tabla de bugs abajo (**R-09** y **A-08/A-09**).

**Leyenda de ejecución física:** ✅ Pasa · ❌ Falla · ⚠️ Falla parcial · — No aplica · ☐ Sin ejecutar

---

## 🧰 Checklist de preparación (ANTES del Jun 13)

| Estado | Prep | Detalle | Bloqueante de |
|:------:|------|---------|---------------|
| ⏳ | URL de Firebase Hosting | **Confirmar con Germán** antes del viernes | P-01, Sección 1 |
| ✅ | Backend local arriba | `:3001` responde · Vite `:5173` (prod pendiente de Germán) | Sección 8 (parcial) |
| ✅ | Colección Postman presente | `docs/Recos-BnM-API-Collection.json` existe en el repo | P-04, Sección 8 |
| ☐ | 2 cuentas de prueba | 1 Google + 1 email/password ya creadas | P-03, Sección 1 |
| ☐ | Firebase Console abierta | Firestore visible (verificar docs escritos) | P-05, P-07 |
| ☐ | Chrome DevTools responsive | Toggle device → iPhone SE (375px) | P-06 |
| ☐ | Token Bearer a la mano | DevTools → Network → request autenticado → copiar `Authorization` | Sección 8 |

> ⚠️ Si **P-01/P-02** fallan → avisar a **Germán**. Si **P-07** (catálogo <20) falla → avisar a **Israel**. ANTES de continuar.

---

## Sección 0 — Pre-requisitos (7 casos · P-01 a P-07)

**Ejecutar PRIMERO — sin esto no se puede continuar.**

| # | Verificación | Cómo | Desk-check | Físico | Notas |
|---|--------------|------|:----------:|:------:|-------|
| P-01 | URL Firebase Hosting activa | Abrir en browser | 🔌 vivo | ☐ | Pendiente URL de Germán |
| P-02 | Backend responde `/health` | `GET [API_URL]/health` → `{"ok":true}` | ✅ local | ☐ | Local OK: `{"ok":true}` HTTP 200. Falta URL prod (Cloud Run) |
| P-03 | 2 cuentas de prueba | 1 Google + 1 email/password | 🔌 vivo | ☐ | Tarea manual de prep |
| P-04 | Acceso a Postman/Bruno + colección | `Recos-BnM-API-Collection.json` | ✅ código | ☐ | Colección presente en `docs/` |
| P-05 | Firebase Console (Firestore) abierta | Verificar docs escritos | 🔌 vivo | ☐ | Tarea manual de prep |
| P-06 | Modo responsive 375px | DevTools → iPhone SE | 🔌 vivo | ☐ | Tarea manual de prep |
| P-07 | Catálogo ≥20 ítems en `content` | Firebase Console → `content` | 🔌 vivo | ☐ | Requiere datos en Firestore prod |

---

## Sección 1 — HU1.1 Registro y Login (16 casos · R-01 a R-09, L-01 a L-07)

### 1A. Registro con Email (R-01 a R-07)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| R-01 | Navegar a `/register` | Pantalla "Crear cuenta" + 4 campos | ✅ código | ☐ | `Register.jsx:65` h1 + 4 inputs (76,80,86,92) |
| R-02 | Campos vacíos + registrar | Error: "Escribe tu nombre." | ✅ código | ☐ | `Register.jsx:31-33` |
| R-03 | Correo inválido (`abc`) | Error: "Correo invalido." | ✅ código | ☐ | `Register.jsx:36-38` regex `/^\S+@\S+\.\S+$/` |
| R-04 | Contraseña 5 chars | Error: "...al menos 6 caracteres." | ✅ código | ☐ | `Register.jsx:41-43` |
| R-05 | Contraseñas distintas | Error: "Las contrasenas no coinciden." | ✅ código | ☐ | `Register.jsx:46-48` |
| R-06 | Todo correcto + registrar | "Creando cuenta..." → `/onboarding` | ✅ código | ☐ | `Register.jsx:51,55` |
| R-07 | Firestore → `users/{userId}` | Doc creado | ✅ código | ☐ | `AuthContext.jsx:42-53,106` `ensureUserDocument`→`setDoc`. Verificar en Console |

### 1B. Registro con Google (R-08 a R-09)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| R-08 | "Registrarse con Google" | Popup → `/onboarding` | ✅ código | ☐ | `Register.jsx:19-20`. Popup requiere ejecución real |
| R-09 | Cerrar popup a la mitad | Error: "Cerraste la ventana de Google antes de completar el acceso." | ⚠️ BUG? | ☐ | **Discrepancia:** `Register.jsx:21-24` muestra mensaje genérico ("No se pudo registrar con Google. Revisa dominios autorizados."), NO mapea `auth/popup-closed-by-user`. El mensaje esperado solo existe en `Login.jsx:26-28`. → **BUG-Q01** |

### 1C. Login con Email (L-01 a L-06)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| L-01 | Navegar a `/login` | "Match&Read" + botón Google + form | ✅ código | ☐ | `Login.jsx:75,78,82` |
| L-02 | Credenciales incorrectas | Error: "Correo o contraseña incorrectos." | ✅ código | ☐ | `Login.jsx:17-19` mapea `invalid-credential`/`wrong-password` |
| L-03 | Login con onboarding hecho | Redirige a `/feed` | ✅ código | ☐ | `Login.jsx:13-14,65` `cold_start_done===true`→`/feed` |
| L-04 | Login cuenta nueva | Redirige a `/onboarding` | ✅ código | ☐ | `Login.jsx:13-14` `cold_start_done` falsy→`/onboarding` |
| L-05 | Acceder a `/feed` sin auth | Redirige a `/login` | ✅ código | ☐ | `App.jsx:27-34` `/feed` en `<ProtectedRoute>` + `ProtectedRoute.jsx:12-13` |
| L-06 | Acceder a `/onboarding` sin auth | Redirige a `/login` | ✅ código | ☐ | `App.jsx:19-26` `/onboarding` protegida + `ProtectedRoute.jsx:12-13` |

### 1D. Login con Google (L-07)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| L-07 | "Continuar con Google" | `/feed` o `/onboarding` según `cold_start_done` | ✅ código | ☐ | `Login.jsx:33-39` `resolvePostAuthRoute`. Popup requiere ejecución real |

---

## Sección 8 — API Backend Postman/Bruno (16 casos · A-01 a A-16)

**Preparación:** obtener token con Firebase Auth → DevTools → Network → request autenticado → copiar Bearer. Header: `Authorization: Bearer {token}`.
**Nota:** el middleware (`backend/src/middleware/auth.js:12`) valida tokens reales con `verifyIdToken` — no hay bypass de dev, así que los casos autenticados requieren token real (🔌 vivo).

| # | Endpoint | Respuesta esperada | Desk-check | Físico | Notas (evidencia) |
|---|----------|-------------------|:----------:|:------:|-------------------|
| A-01 | `GET /health` | `{"ok":true}` HTTP 200 | ✅ local | ☐ | Probado en `:3001` → 200 `{"ok":true}` |
| A-02 | `GET /api/private/ping` SIN token | HTTP 401 | ✅ local | ☐ | Probado → 401 `{"error":"missing_token"}` (`auth.js:7-8`) |
| A-03 | `GET /api/private/ping` con token | `{"ok":true,"uid":"..."}` 200 | 🔌 vivo | ☐ | `app.js:16`. Requiere token real |
| A-04 | `GET /api/feed?...&type=movie` SIN token | HTTP 401 | ✅ local | ☐ | Probado → 401 `missing_token` |
| A-05 | `GET /api/feed` con token (movie) | 200, array por score | 🔌 vivo | ☐ | `feed.js:102`. Requiere token + datos |
| A-06 | `GET /api/feed` con token (book) | 200, array de libros | 🔌 vivo | ☐ | `feed.js`. Requiere token + datos |
| A-07 | `GET /api/feed` con cursor | 200, siguiente página | 🔌 vivo | ☐ | `feed.js`. Requiere token + datos |
| A-08 | `POST /api/swipe` token + like | **HTTP 204 sin body** | ⚠️ BUG? | ☐ | **Discrepancia:** `swipe.js:66` responde **200 `{success:true}`**, no 204 sin body → **BUG-Q02** |
| A-09 | `POST /api/swipe` token + dislike | **HTTP 204 sin body** | ⚠️ BUG? | ☐ | Mismo handler `swipe.js:66` → 200 `{success:true}` → **BUG-Q02** |
| A-10 | `GET /api/content/{id}` válido ⭐ *(mi endpoint)* | 200 + `watchProviders` array | 🔌 vivo | ☐ | `content.js:52-72`. Cubierto por 8/8 unit tests. Requiere token + doc real |
| A-11 | `GET /api/content/INVALID_ID` ⭐ *(mi endpoint)* | HTTP 404 | 🔌 vivo | ☐ | `content.js:45-47` (404 si no existe). Sin token da 401; con token → 404 |
| A-12 | `GET /api/collections?userId={uid}` | 200, array | 🔌 vivo | ☐ | `routes/collections.js`. Requiere token |
| A-13 | `POST /api/collections` | HTTP 201 | 🔌 vivo | ☐ | Requiere token |
| A-14 | `PATCH /api/collections/{id}` | HTTP 200 | 🔌 vivo | ☐ | Requiere token |
| A-15 | `DELETE /api/collections/{id}` | HTTP 204 | 🔌 vivo | ☐ | Requiere token |
| A-16 | Endpoint con token expirado | HTTP 401 | 🔌 vivo | ☐ | `auth.js:20-21` (`invalid_token`). Requiere token vencido |

> ⭐ **A-10 y A-11 prueban mi propio endpoint** (`GET /api/content/:id`). Ya tengo 8/8 unit tests verdes; aquí lo valido contra producción real.

---

## 🐛 Bugs / discrepancias detectadas en desk-check

> Confirmar durante la ejecución física y, si aplica, registrar en `PHYSICAL_TEST_VALIDATION.md` §14.

| ID | Estado | Sección | Caso | Descripción (esperado vs código) | Severidad | Archivo |
|----|--------|---------|------|----------------------------------|-----------|---------|
| BUG-Q01 | NEW (desk-check) | 1 Auth | R-09 | Esperado: al cerrar el popup de Google en **registro**, mensaje "Cerraste la ventana de Google antes de completar el acceso." Código: `Register.jsx` muestra mensaje genérico y no mapea `auth/popup-closed-by-user` (ese mapeo solo existe en `Login.jsx`). | Baja | `frontend/src/pages/Register.jsx:21-24` |
| BUG-Q02 | NEW (desk-check) | 8 API | A-08, A-09 | Esperado: `POST /api/swipe` → **HTTP 204 sin body**. Código: responde **200 `{success:true}`**. Funciona (frontend es fire-and-forget) pero no cumple el contrato 204. | Media | `backend/src/routes/swipe.js:66` |

> **Nota de ownership:** ambos archivos son de otros dueños (Andrés → frontend auth; Luis/Christian → swipe). No los modifico; reporto los hallazgos para coordinar el fix con el dueño durante la ejecución.

---

## 📊 Mi resumen — desk-check (vaciar resultados FÍSICOS en §15A al ejecutar)

| Sección | Total | ✅ local | ✅ código | ⚠️ BUG? | 🔌 vivo |
|---------|-------|:-------:|:--------:|:------:|:------:|
| 0. Pre-requisitos | 7 | 1 (P-02) | 1 (P-04) | 0 | 5 |
| 1. Auth (Login/Register) | 16 | 0 | 15 | 1 (R-09) | 0 |
| 8. API Postman/Bruno | 16 | 3 (A-01/02/04) | 0 | 2 (A-08/09) | 11 |
| **MI TOTAL** | **39** | **4** | **16** | **3** | **16** |

> Lectura: **20/39** confirmados sin objeción contra código/local · **3** con discrepancia a confirmar (R-09, A-08, A-09) · **16** requieren ejecución en vivo (token real / URL prod / datos).

### Cierre de mi sesión física (Jun 13–15)

| Campo | Detalle |
|-------|---------|
| Fecha de ejecución | |
| Duración total | |
| URL de la app probada | |
| Commit de `main` probado | |
| ¿Mis 39 casos OK? | ✅ Sí · ❌ No · ⚠️ Con observaciones |
| Observaciones | |

---

## ✅ Checklist de cierre

- [x] Desk-check de los 39 casos contra código + backend local (2026-06-12)
- [ ] Prep completa (URL de Germán, Postman, cuentas, token)
- [ ] Confirmar BUG-Q01 (R-09) y BUG-Q02 (A-08/A-09) en ejecución física
- [ ] Sección 0 Pre-req: 7/7 verificados ✅ antes de continuar
- [ ] Sección 1 Auth: 16/16 ejecutados y documentados
- [ ] Sección 8 API: 16/16 ejecutados en Postman/Bruno
- [ ] Bugs registrados en `PHYSICAL_TEST_VALIDATION.md` §14
- [ ] Resultados vaciados en §15A del archivo compartido (columnas Auth + API)

> → [[PHYSICAL_TEST_VALIDATION|Archivo compartido de QA]] · [[05-Hector-Morales|Mi sprint]] · [[DevLog/DevLog_Index|DevLog]]
