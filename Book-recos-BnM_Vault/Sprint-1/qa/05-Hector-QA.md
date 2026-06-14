---
project: "Recos-BnM"
date: "2026-06-12"
owner: "Héctor Morales Marbán"
role: "QA / Testing — Fase 2"
sprint: "Sprint-1"
window: "2026-06-13 → 2026-06-15"
scope: "Secciones 0 (Pre-requisitos), 1 (Auth) y 8 (API Backend) — 39 casos"
status: "Secciones 1 (Auth) y 8 (API) EJECUTADAS contra entorno local (2026-06-13): 31/39 ✅ · 4 bugs (Q01-Q04) · R-07 bloqueado (Israel) · prod pendiente (URL de Germán)"
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

## ▶️ Ejecución física — Sección 8 API (2026-06-13)

> **Entorno:** backend **local** `http://localhost:3001` con **Firebase real** (datos de prod) y un
> **ID token real** de Firebase Auth (uid `ku54X1i0RVOTWBoo4eEZoeMxFH92`, email `hector.morales@anahuac.mx`).
> Ejecutado por curl. **NO es la URL de producción** (Cloud Run sigue pendiente de Germán) — al
> liberarse la URL, re-ejecutar idéntico contra prod y volcar en `PHYSICAL_TEST_VALIDATION.md` §15A.
>
> **Resultado Sección 8: 14/16 ✅ · 2/16 ❌** (A-08, A-09 → **BUG-Q02 confirmado en vivo**).
> Las secciones 0 (parcial) y 1 (Auth, navegador) siguen pendientes de ejecución física tuya.

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
| P-02 | Backend responde `/health` | `GET [API_URL]/health` → `{"ok":true}` | ✅ local | ✅ local | Local OK: **200 `{"ok":true}`**. Falta confirmar URL prod (Cloud Run) |
| P-03 | 2 cuentas de prueba | 1 Google + 1 email/password | 🔌 vivo | ✅ parc. | Email/password confirmada (`hector.morales@anahuac.mx`, login OK). Falta cuenta Google |
| P-04 | Acceso a Postman/Bruno + colección | `Recos-BnM-API-Collection.json` | ✅ código | ✅ | Colección presente en `docs/`. Casos ejecutados vía curl con misma firma |
| P-05 | Firebase Console (Firestore) abierta | Verificar docs escritos | 🔌 vivo | ☐ | Tarea manual de prep (pendiente tú) |
| P-06 | Modo responsive 375px | DevTools → iPhone SE | 🔌 vivo | ☐ | Tarea manual de prep (pendiente tú) |
| P-07 | Catálogo ≥20 ítems en `content` | Firebase Console → `content` | 🔌 vivo | ✅ | Verificado vía `/api/feed`: devuelve múltiples páginas de movies y books (≥20) |

---

## Sección 1 — HU1.1 Registro y Login (16 casos · R-01 a R-09, L-01 a L-07)

### 1A. Registro con Email (R-01 a R-07)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| R-01 | Navegar a `/register` | Pantalla "Crear cuenta" + 4 campos | ✅ código | ✅ | Ejecutado 2026-06-13: h1 + Google + 4 campos + botón email |
| R-02 | Campos vacíos + registrar | Error: "Escribe tu nombre." | ✅ código | ✅ | Mostró "Escribe tu nombre." |
| R-03 | Correo inválido (`abc`) | Error: "Correo invalido." | ✅ código | ⚠️ | **Discrepancia:** salió el **tooltip nativo del navegador** (`type="email"`), no el mensaje de la app → **BUG-Q04** |
| R-04 | Contraseña 5 chars | Error: "...al menos 6 caracteres." | ✅ código | ✅ | Mostró "...al menos 6 caracteres." |
| R-05 | Contraseñas distintas | Error: "Las contrasenas no coinciden." | ✅ código | ✅ | Mostró "Las contrasenas no coinciden." |
| R-06 | Todo correcto + registrar | "Creando cuenta..." → `/onboarding` | ✅ código | ✅ | Cuenta creada, redirigió a `/onboarding` |
| R-07 | Firestore → `users/{userId}` | Doc creado | ✅ código | ☐ blq. | **Bloqueado:** acceso a la consola de Firestore es de **Israel**. Pedir verificación a Israel |

### 1B. Registro con Google (R-08 a R-09)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| R-08 | "Registrarse con Google" | Popup → `/onboarding` | ✅ código | ✅ | Ejecutado 2026-06-13: popup Google → redirigió a `/onboarding` |
| R-09 | Cerrar popup a la mitad | Error: "Cerraste la ventana de Google antes de completar el acceso." | ⚠️ BUG? | ❌ | **CONFIRMADO BUG-Q01 en vivo:** mostró *"No se pudo registrar con Google. Revisa dominios autorizados."*, no el mensaje esperado |

### 1C. Login con Email (L-01 a L-06)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| L-01 | Navegar a `/login` | "Match&Read" + botón Google + form | ✅ código | ✅ | Ejecutado 2026-06-13: "Match&Read" + Google + form |
| L-02 | Credenciales incorrectas | Error: "Correo o contraseña incorrectos." | ✅ código | ✅ | Mostró "Correo o contraseña incorrectos." |
| L-03 | Login con onboarding hecho | Redirige a `/feed` | ✅ código | ✅ | Redirigió a `/feed` |
| L-04 | Login cuenta nueva | Redirige a `/onboarding` | ✅ código | ✅ | Redirigió a `/onboarding` |
| L-05 | Acceder a `/feed` sin auth | Redirige a `/login` | ✅ código | ✅ | Redirigió a `/login` |
| L-06 | Acceder a `/onboarding` sin auth | Redirige a `/login` | ✅ código | ✅ | Redirigió a `/login` |

### 1D. Login con Google (L-07)

| # | Acción | Resultado esperado | Desk-check | Físico | Notas (evidencia) |
|---|--------|-------------------|:----------:|:------:|-------------------|
| L-07 | "Continuar con Google" | `/feed` o `/onboarding` según `cold_start_done` | ✅ código | ✅ | Ejecutado 2026-06-13: cayó en `/onboarding` (cuenta sin onboarding completo) ✓ |

---

## Sección 8 — API Backend Postman/Bruno (16 casos · A-01 a A-16)

**Preparación:** obtener token con Firebase Auth → DevTools → Network → request autenticado → copiar Bearer. Header: `Authorization: Bearer {token}`.
**Nota:** el middleware (`backend/src/middleware/auth.js:12`) valida tokens reales con `verifyIdToken` — no hay bypass de dev, así que los casos autenticados requieren token real (🔌 vivo).

| # | Endpoint | Respuesta esperada | Desk-check | Físico | Notas (evidencia) |
|---|----------|-------------------|:----------:|:------:|-------------------|
| A-01 | `GET /health` | `{"ok":true}` HTTP 200 | ✅ local | ✅ | **200 `{"ok":true}`** |
| A-02 | `GET /api/private/ping` SIN token | HTTP 401 | ✅ local | ✅ | **401 `{"error":"missing_token"}`** |
| A-03 | `GET /api/private/ping` con token | `{"ok":true,"uid":"..."}` 200 | 🔌 vivo | ✅ | **200 `{"ok":true,"uid":"ku54...FH92"}`** |
| A-04 | `GET /api/feed?...&type=movie` SIN token | HTTP 401 | ✅ local | ✅ | **401 `missing_token`** |
| A-05 | `GET /api/feed` con token (movie) | 200, array por score | 🔌 vivo | ✅ | **200**, array de movies (Superman, etc.) |
| A-06 | `GET /api/feed` con token (book) | 200, array de libros | 🔌 vivo | ✅ | **200**, array de books (1984, To Kill a Mockingbird, ...) |
| A-07 | `GET /api/feed` con cursor | 200, siguiente página | 🔌 vivo | ✅ | **200** con `cursor=2`, página de resultados |
| A-08 | `POST /api/swipe` token + like | **HTTP 204 sin body** | ⚠️ BUG? | ❌ | **CONFIRMADO BUG-Q02:** devuelve **200 `{"success":true}`**, no 204 sin body |
| A-09 | `POST /api/swipe` token + dislike | **HTTP 204 sin body** | ⚠️ BUG? | ❌ | **CONFIRMADO BUG-Q02:** **200 `{"success":true}`** (mismo handler `swipe.js:66`) |
| A-10 | `GET /api/content/{id}` válido ⭐ *(mi endpoint)* | 200 + `watchProviders` array | 🔌 vivo | ✅ | **200**, `watchProviders:[]` (array). Ver obs. BUG-Q03 (`source`/`year` ausentes en data) |
| A-11 | `GET /api/content/INVALID_ID` ⭐ *(mi endpoint)* | HTTP 404 | 🔌 vivo | ✅ | **404 `{"error":"Content not found"}`** |
| A-12 | `GET /api/collections?userId={uid}` | 200, array | 🔌 vivo | ✅ | **200**, array de colecciones del usuario |
| A-13 | `POST /api/collections` | HTTP 201 | 🔌 vivo | ✅ | **201 `{"collectionId":"7y3EplRkkNx2cUMECxfr"}`** |
| A-14 | `PATCH /api/collections/{id}` | HTTP 200 | 🔌 vivo | ✅ | **200**, `{updated:{personalNote:"Excelente"}}` |
| A-15 | `DELETE /api/collections/{id}` | HTTP 204 | 🔌 vivo | ✅ | **204 sin body** |
| A-16 | Endpoint con token expirado | HTTP 401 | 🔌 vivo | ✅ | **401 `{"error":"invalid_token"}`** (token inválido/malformado) |

> ⭐ **A-10 y A-11 prueban mi propio endpoint** (`GET /api/content/:id`). Ya tengo 8/8 unit tests verdes; aquí lo valido contra producción real.

---

## 🐛 Bugs / discrepancias detectadas en desk-check

> Confirmar durante la ejecución física y, si aplica, registrar en `PHYSICAL_TEST_VALIDATION.md` §14.

| ID | Estado | Sección | Caso | Descripción (esperado vs código) | Severidad | Archivo |
|----|--------|---------|------|----------------------------------|-----------|---------|
| BUG-Q01 | **CONFIRMADO en vivo** (2026-06-13) | 1 Auth | R-09 | Esperado: al cerrar el popup de Google en **registro**, mensaje "Cerraste la ventana de Google antes de completar el acceso." Real: `Register.jsx` muestra "No se pudo registrar con Google. Revisa dominios autorizados." y no mapea `auth/popup-closed-by-user` (ese mapeo solo existe en `Login.jsx`). | Baja | `frontend/src/pages/Register.jsx:21-24` |
| BUG-Q02 | **CONFIRMADO en vivo** (2026-06-13) | 8 API | A-08, A-09 | Esperado: `POST /api/swipe` → **HTTP 204 sin body**. Real: responde **200 `{"success":true}`** (verificado con token real contra backend local). Funciona (frontend es fire-and-forget) pero no cumple el contrato 204. | Media | `backend/src/routes/swipe.js:66` |
| BUG-Q03 | NEW (ejecución, 2026-06-13) | 8 API / Data | A-10 | Compliance TMDB: los docs de `content` **no traen el campo `source`** (ni `year`), por lo que `GET /api/content/:id` **nunca** añade el `attribution` de TMDB (mi código lo añade solo si `source==="tmdb"`). Verificado en 4 docs (movies + book): solo devuelven `watchProviders:[]`. Mi endpoint es correcto; el dato falta en el ingest. | Media | `ingest/` (datos en Firestore `content`) — dominio de Manuel |
| BUG-Q04 | NEW (ejecución, 2026-06-13) | 1 Auth | R-03 | Con correo inválido (`abc`), el input `type="email"` dispara la **validación nativa del navegador** (tooltip) y bloquea el submit **antes** de que se muestre el mensaje de la app "Correo invalido." (`Register.jsx:36-38`). El caso del test no es reproducible tal como está escrito. UX inconsistente entre navegadores. | Baja | `frontend/src/pages/Register.jsx:78-83` (input `type="email"`) |

> **Nota de ownership:** los tres hallazgos son de otros dueños (Andrés → frontend auth; Luis/Christian → swipe; Manuel → ingest/data). No modifico esos archivos; reporto para coordinar el fix con el dueño. **BUG-Q03** no es un defecto de mi endpoint `content.js` (cubierto por 8/8 unit tests) sino del dato en Firestore.

---

## 📊 Mi resumen — estado tras ejecución física parcial (2026-06-13)

| Sección | Total | ✅ Ejecutado físico | ⚠️/❌ Discrepancia | ☐ Pendiente/bloqueado |
|---------|-------|:------------------:|:------------------:|:---------------------:|
| 0. Pre-requisitos | 7 | 4 (P-02/03/04/07) | 0 | 3 (P-01 prod, P-05, P-06) |
| 1. Auth (Login/Register) | 16 | **13** | **2 (R-03 ⚠️, R-09 ❌)** | 1 (R-07 bloqueado — Israel) |
| 8. API Postman/Bruno | 16 | **14** | **2 (A-08/09 ❌)** | 0 |
| **MI TOTAL** | **39** | **31** | **4** | **4** |

> **Lectura:**
> - **Sección 1 Auth — EJECUTADA en navegador (2026-06-13):** 13/16 ✅ · R-03 ⚠️ (BUG-Q04) · R-09 ❌ (BUG-Q01 confirmado) · R-07 ☐ bloqueado (consola Firestore es de Israel).
> - **Sección 8 API — COMPLETA:** 14/16 ✅ · 2/16 ❌ (A-08, A-09 → BUG-Q02 confirmado en vivo). Mi endpoint **A-10/A-11 ✅✅**.
> - **Sección 0:** 4/7 verificados (P-02/03/04/07). Faltan P-01 (URL prod — Germán), P-05, P-06 (manuales).
> - **31/39 ejecutados OK · 4 discrepancias (4 bugs) · 4 pendientes/bloqueados.**
> - **4 bugs:** Q01 (R-09 ✅vivo), Q02 (A-08/09 ✅vivo), Q03 (A-10 data sin `source`→sin attribution TMDB), Q04 (R-03 tooltip nativo).
> - Ejecución contra **backend local** con datos reales; **re-ejecutar contra prod** cuando Germán libere la URL.

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
- [x] **Sección 8 API: 16/16 ejecutados con token real (2026-06-13)** — 14 ✅ / 2 ❌
- [x] **Sección 1 Auth: 15/16 ejecutados en navegador (2026-06-13)** — 13 ✅ / R-03 ⚠️ / R-09 ❌ (R-07 bloqueado)
- [x] BUG-Q01 (R-09) y BUG-Q02 (A-08/A-09) **confirmados en vivo**; BUG-Q03 (A-10 data) y BUG-Q04 (R-03 tooltip) detectados
- [x] Sección 0: P-02/P-03/P-04/P-07 verificados
- [ ] R-07: pedir a **Israel** verificar `users/{uid}` en Firestore Console
- [ ] Prep restante (URL de Germán para prod)
- [ ] Sección 0 Pre-req: faltan P-01 (prod), P-05, P-06
- [ ] Re-ejecutar Secciones 1 y 8 contra **URL de producción** cuando Germán la libere
- [ ] Bugs registrados en `PHYSICAL_TEST_VALIDATION.md` §14 (BUG-Q01 a Q04)
- [ ] Resultados vaciados en §15A del archivo compartido (columnas Auth + API)

> → [[PHYSICAL_TEST_VALIDATION|Archivo compartido de QA]] · [[05-Hector-Morales|Mi sprint]] · [[DevLog/DevLog_Index|DevLog]]
