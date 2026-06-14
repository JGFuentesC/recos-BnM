---
project: "Recos-BnM"
date: "2026-06-13"
author_human: "Héctor Morales Marbán"
agent: "Claude Code"
model: "claude-opus-4-8"
tipo: "QA Physical Testing — Validación parcial en entorno LOCAL"
tags: [qa, physical-test, sprint-1, fase-2, local, hector]
relacionado: "[[PHYSICAL_TEST_VALIDATION]]"
---

# Reporte QA Physical Testing — Entorno LOCAL — Héctor Morales

> ⚠️ **Alcance:** Este reporte cubre **solo lo validable contra el entorno local activo**.
> La URL pública (Firebase Hosting + Cloud Run) **aún no fue entregada por Germán**, así que
> el veredicto de producción del documento maestro [[PHYSICAL_TEST_VALIDATION]] sigue **pendiente**.
> Estos resultados **no sustituyen** la prueba física en producción; sirven como pre-validación.

## Entorno verificado (2026-06-13)

| Componente | Estado | Detalle |
|---|---|---|
| Backend (Express) | ✅ Activo | `http://localhost:3001` — nodemon `src/app.js` |
| Frontend (Vite) | ✅ Activo | `http://localhost:5173` — HTTP 200 en `/` y `/login` |
| Firebase | ⚠️ Real, **sin emulador** | `verifyIdToken` valida tokens reales; Firestore emulator (8080) **apagado** |
| Colección Postman | ✅ Presente | `docs/Recos-BnM-API-Collection.json` |

**Implicación clave:** como el middleware [auth.js](../../backend/src/middleware/auth.js) verifica tokens **reales** de Firebase,
todos los casos que requieren sesión autenticada necesitan un **Firebase ID token real** que solo se obtiene
iniciando sesión en la app → ver §"Casos que requieren tu interacción".

---

## Leyenda

- ✅ **PASS** — ejecutado localmente, resultado = esperado
- 🙋 **REQUIERE INTERACCIÓN** — necesita navegador/cuentas/token reales (tú)
- ⛔ **BLOQUEADO** — depende de la URL de producción (pendiente Germán)

---

## Sección 0 — Pre-requisitos (7 casos)

| Caso | Qué verifica | Resultado local | Notas |
|------|--------------|-----------------|-------|
| P-01 | URL Firebase Hosting activa | ⛔ BLOQUEADO | No hay URL prod. *Local:* Vite `5173` carga (HTTP 200) |
| P-02 | Backend Cloud Run `/health` → `{"ok":true}` | ⛔ prod / ✅ **local** | `GET localhost:3001/health` → **HTTP 200 `{"ok":true}`** |
| P-03 | 2 cuentas de prueba (Google + email) | 🙋 | Las creas/confirmas tú |
| P-04 | Acceso a Postman/Bruno con la colección | ✅ archivo / 🙋 import | `docs/Recos-BnM-API-Collection.json` existe; impórtala tú |
| P-05 | Firebase Console (Firestore) abierta | 🙋 | Solo tú tienes la sesión de consola |
| P-06 | Modo responsive 375px (iPhone SE) | 🙋 | Verificación visual en navegador |
| P-07 | Catálogo ≥20 ítems en `content` | 🙋 / token | Verificable en Firebase Console o vía `/api/feed` con token |

**Resumen Sección 0:** 1 PASS local (P-02), 1 parcial (P-04), 1 bloqueado (P-01), 4 requieren interacción.

---

## Sección 1 — Auth Registro/Login (16 casos)

> Estos son tests de **UI en navegador con cuentas reales** → ejecución física tuya.
> Lo que **sí** validé: pre-verificación estática de que los mensajes de error esperados y las rutas
> **existen en el código**, así que las expectativas del test son correctas.

### Pre-validación estática (código) ✅

| Caso | Expectativa | Evidencia en código |
|------|-------------|---------------------|
| R-01 | Pantalla registro 4 campos | [Register.jsx](../../frontend/src/pages/Register.jsx), ruta `/register` en App.jsx:20 |
| R-02 | "Escribe tu nombre." | Register.jsx:32 ✅ |
| R-03 | "Correo invalido." | Register.jsx:37 ✅ |
| R-04 | "al menos 6 caracteres" | Register.jsx:42 ✅ |
| R-05 | "no coinciden" | Register.jsx:47 ✅ |
| R-06 | "Creando cuenta..." → /onboarding | Register.jsx:51 ✅ |
| R-09 | "Cerraste la ventana..." | Login.jsx:53 ✅ |
| L-01 | Pantalla login | ruta `/login` App.jsx:19 ✅ |
| L-02 | "Correo o contraseña incorrectos." | Login.jsx:45 ✅ |
| L-05 / L-06 | Redirect a /login sin auth | [ProtectedRoute.jsx](../../frontend/src/components/ProtectedRoute.jsx) existe ✅ |

### Ejecución física pendiente 🙋

Todos (R-01→R-09, L-01→L-07, 16 casos) requieren: navegador, 2 cuentas reales, popup de Google
y verificación en Firebase Console (R-07). **Checklist paso a paso en la sección final.**

---

## Sección 8 — API Backend Postman/Bruno (16 casos)

### Ejecutados localmente ✅

| Caso | Petición | Esperado | Resultado local |
|------|----------|----------|-----------------|
| A-01 | `GET /health` | 200 `{"ok":true}` | ✅ **HTTP 200 `{"ok":true}`** |
| A-02 | `GET /api/private/ping` sin token | 401 | ✅ **401 `{"error":"missing_token"}`** |
| A-04 | `GET /api/feed?...` sin token | 401 | ✅ **401 `{"error":"missing_token"}`** |
| A-16 | Token expirado → 401 | 401 | ✅ **401 `{"error":"invalid_token"}`** (proxy: token malformado) |

### Guard de autenticación confirmado ✅ (mitad negativa de los casos con token)

Confirmé que **todos** los endpoints protegidos rechazan peticiones sin token con **401**:
`/api/private/ping`, `/api/feed`, `/api/swipe` (POST), `/api/content/:id`, `/api/collections`.
→ La capa `app.use('/api', auth)` ([app.js:45](../../backend/src/app.js#L45)) funciona correctamente.

### Pendientes — requieren Firebase ID token 🙋

| Caso | Petición | Esperado | Estado |
|------|----------|----------|--------|
| A-03 | `GET /api/private/ping` con token | 200 `{ok,uid}` | 🙋 token |
| A-05 | `GET /api/feed?type=movie` con token | 200 array por score | 🙋 token |
| A-06 | `GET /api/feed?type=book` con token | 200 array libros | 🙋 token |
| A-07 | `GET /api/feed&cursor=...` | 200 siguiente página | 🙋 token |
| A-08 | `POST /api/swipe action:like` | 204 sin body | 🙋 token (sin token→401 ✅) |
| A-09 | `POST /api/swipe action:dislike` | 204 sin body | 🙋 token |
| A-10 | `GET /api/content/{id}` válido | 200 + `watchProviders[]` | 🙋 token *(tu endpoint)* |
| A-11 | `GET /api/content/INVALID_ID` | 404 | 🙋 token *(tu endpoint)* |
| A-12 | `GET /api/collections` | 200 array | 🙋 token |
| A-13 | `POST /api/collections` | 201 | 🙋 token |
| A-14 | `PATCH /api/collections/{id}` | 200 | 🙋 token |
| A-15 | `DELETE /api/collections/{id}` | 204 | 🙋 token |

**Resumen Sección 8:** 4/16 PASS local (A-01, A-02, A-04, A-16) + guard 401 confirmado en 5 endpoints.
12 casos esperan token.

---

## Resumen de avance

| Sección | Total | ✅ PASS local | 🙋 Requiere interacción | ⛔ Bloqueado (prod) |
|---------|-------|--------------|------------------------|---------------------|
| 0. Pre-requisitos | 7 | 1 (P-02) | 5 | 1 (P-01) |
| 1. Auth | 16 | 0 (10 pre-validados en código) | 16 | 0 |
| 8. API Backend | 16 | 4 | 12 | 0 |
| **TOTAL (Héctor)** | **39** | **5** | **33** | **1** |

---

## 🙋 Casos que requieren TU interacción — guía paso a paso

### Paso 1 — Obtener un Firebase ID token (desbloquea 12 casos de API)

1. Abre `http://localhost:5173` e inicia sesión (Google o email/password).
2. Abre **DevTools → Network**.
3. Haz cualquier acción que pegue al backend (cargar el feed, p.ej.).
4. Click en un request a `localhost:3001/api/...` → pestaña **Headers** → copia el valor de
   `Authorization: Bearer <TOKEN>` (solo la parte del token).
5. Pégamelo aquí y **ejecuto A-03, A-05–A-15 y A-10/A-11 (tu endpoint) por curl** y lleno este reporte.
   > El token expira en ~1 h; si caduca, repetimos el paso.

### Paso 2 — Sección 1 Auth (navegador, lo haces tú)

Con 2 cuentas listas (1 Google + 1 email/password), ejecuta en `http://localhost:5173`:

```
☐ R-01  /register muestra 4 campos (Nombre, Correo, Contraseña, Confirmar)
☐ R-02  Todo vacío + registrar        → "Escribe tu nombre."
☐ R-03  Correo "abc"                  → "Correo invalido."
☐ R-04  Contraseña 5 chars            → "...al menos 6 caracteres."
☐ R-05  Contraseñas distintas         → "...no coinciden."
☐ R-06  Todo correcto                 → "Creando cuenta..." → /onboarding
☐ R-07  Firebase Console → users/{uid} creado
☐ R-08  "Registrarse con Google"      → popup → /onboarding
☐ R-09  Cerrar popup Google           → "Cerraste la ventana..."
☐ L-01  /login muestra "Match&Read" + Google + form
☐ L-02  Credenciales malas            → "Correo o contraseña incorrectos."
☐ L-03  Login con onboarding hecho    → /feed
☐ L-04  Login cuenta nueva            → /onboarding
☐ L-05  /feed sin auth                → redirige /login
☐ L-06  /onboarding sin auth          → redirige /login
☐ L-07  "Continuar con Google"        → /feed o /onboarding según cold_start_done
```
Dime el resultado de cada uno (o solo los que fallen) y lo registro aquí.

### Paso 3 — Pre-requisitos manuales

```
☐ P-03  Confirmar 2 cuentas de prueba disponibles
☐ P-05  Abrir Firebase Console (Firestore)
☐ P-06  Chrome DevTools → responsive 375px (iPhone SE)
☐ P-07  Firestore → colección content ≥ 20 docs (o lo verifico vía /api/feed con tu token)
```

---

## Bloqueantes

- ⛔ **URL de producción pendiente (Germán)** → P-01 y los veredictos de prod del documento maestro
  no se pueden cerrar. Avisar a Germán (responsable P-01/P-02/P-08).
- ⚠️ **Emulador de Firestore apagado** → si prefieres no usar Firebase real para los casos con token,
  habría que levantar `firebase emulators:start` y usar tokens del Auth emulator. Coordinar con Andrés/Israel.

## Próximos pasos

1. Me pasas un ID token → cierro A-03, A-05–A-15 (incluye tus A-10/A-11) por curl.
2. Ejecutas la checklist de Auth en el navegador → me das resultados → los registro.
3. Cuando Germán entregue la URL prod → re-ejecutar todo contra producción en [[PHYSICAL_TEST_VALIDATION]].
