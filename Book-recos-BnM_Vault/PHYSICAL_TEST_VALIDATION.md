---
project: "Recos-BnM"
version: "1.0"
date: "2026-06-09"
author: "Edgar Coronel Navarrete (PM)"
status: "Ready for execution"
tags: [qa, physical-test, checklist, sprint-1, mvp]
---

# Physical Test Validation — Recos-BnM MVP
## Checklist de prueba manual completo · Sprint 1

> **Objetivo:** Validar físicamente que la app funciona de extremo a extremo antes de la entrega final.
> **Ejecutar con:** 1-2 personas. Una ejecuta, otra observa y marca. Tiempo estimado: **90 minutos**.
> **URL de la app:** Firebase Hosting (confirmar con Germán antes de iniciar)
> **Backend:** Cloud Run (confirmar URL en `VITE_API_URL`)
> **Leyenda:** ✅ Pasa · ❌ Falla · ⚠️ Falla parcial · — No aplica (skip)

---

## 0. Pre-requisitos

Completar antes de ejecutar cualquier prueba.

| # | Verificación | Resultado | Notas |
|---|--------------|-----------|-------|
| P-01 | La URL pública de Firebase Hosting está activa y carga la app | | |
| P-02 | El backend en Cloud Run responde: `GET [API_URL]/health` devuelve `{"ok":true}` | | |
| P-03 | Tienes 2 cuentas de prueba disponibles: una Google y una email/password | | |
| P-04 | Tienes acceso a Postman o Bruno con la colección `Recos-BnM-API-Collection.json` | | |
| P-05 | Tienes abierta la consola de Firebase (Firestore) para verificar documentos escritos | | |
| P-06 | Estás en un dispositivo móvil O el navegador está en modo responsive (375px — iPhone SE) | | |
| P-07 | El catálogo de contenido tiene al menos 20 ítems en la colección `content` de Firestore | | |

---

## 1. HU1.1 — Registro y Login

### 1A. Registro con Email

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| R-01 | Navegar a `/register` | Se muestra pantalla "Crear cuenta" con campos: Nombre, Correo, Contraseña, Confirmar contraseña | | |
| R-02 | Dejar todos los campos vacíos y presionar "Registrarse con email" | Error: "Escribe tu nombre." | | |
| R-03 | Llenar nombre, escribir correo inválido (ej. `abc`), presionar registrar | Error: "Correo invalido." | | |
| R-04 | Llenar nombre + correo válido, escribir contraseña de 5 caracteres | Error: "La contrasena debe tener al menos 6 caracteres." | | |
| R-05 | Llenar todo correctamente pero contraseñas distintas | Error: "Las contrasenas no coinciden." | | |
| R-06 | Llenar todos los campos correctamente y presionar registrar | Mensaje "Creando cuenta...", redirige a `/onboarding` | | |
| R-07 | Verificar en Firebase Console → Firestore → colección `users` | Existe documento `users/{userId}` recién creado | | |

### 1B. Registro con Google

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| R-08 | En `/register` presionar "Registrarse con Google" | Abre popup de Google. Al seleccionar cuenta redirige a `/onboarding` | | |
| R-09 | Cerrar el popup de Google a la mitad | Error: "Cerraste la ventana de Google antes de completar el acceso." | | |

### 1C. Login con Email

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| L-01 | Navegar a `/login` | Pantalla "Match&Read" con botón Google y formulario email/password | | |
| L-02 | Intentar login con correo y contraseña incorrectos | Error: "Correo o contraseña incorrectos." | | |
| L-03 | Login correcto con cuenta que ya completó onboarding | Redirige directo a `/feed` (no a /onboarding) | | |
| L-04 | Login correcto con cuenta nueva (sin onboarding completado) | Redirige a `/onboarding` | | |
| L-05 | Intentar acceder a `/feed` sin estar autenticado | Redirige automáticamente a `/login` | | |
| L-06 | Intentar acceder a `/onboarding` sin estar autenticado | Redirige automáticamente a `/login` | | |

### 1D. Login con Google

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| L-07 | En `/login` presionar "Continuar con Google" | Abre popup. Al completar, redirige a `/feed` o `/onboarding` según `cold_start_done` | | |

---

## 2. HU1.2 — Onboarding

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| O-01 | Llegar a `/onboarding` tras registro | Se muestra la primera tarjeta de género con imagen de fondo (Ciencia Ficción) | | |
| O-02 | Observar la barra de progreso en la parte superior | Barra de progreso visible, indica avance entre los 8 géneros | | |
| O-03 | Deslizar o hacer swipe en la tarjeta hacia la derecha | Tarjeta avanza, el género "Ciencia Ficción" queda seleccionado | | |
| O-04 | Deslizar a la izquierda en una tarjeta | Tarjeta avanza sin seleccionar el género | | |
| O-05 | Recorrer las 8 tarjetas (Sci-Fi, Fantasía, Thriller, Drama, Histórico, Terror, Romance, Documental) | Todas cargan con imagen y descripción correctas | | |
| O-06 | En la sección de selección manual de géneros, seleccionar al menos 3 géneros de la lista de 12 | Géneros seleccionados se resaltan visualmente | | |
| O-07 | Completar el onboarding hasta el final | Redirige a `/feed` | | |
| O-08 | Verificar en Firestore → `users/{userId}` | `prefs.genres` contiene los géneros seleccionados y `cold_start_done: true` | | |
| O-09 | Cerrar sesión y volver a iniciar con la misma cuenta | Redirige directamente a `/feed`, no pasa por `/onboarding` otra vez | | |

---

## 3. HU2.1 — Tab Selector (Películas / Libros)

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| T-01 | Llegar a `/feed` | Tab Selector visible en la parte superior con dos pills: "Películas" y "Libros" | | |
| T-02 | Observar estado inicial | Tab "Películas" activo: fondo naranja (`#ff571a`), texto blanco. "Libros": fondo transparente, texto gris | | |
| T-03 | Presionar "Libros" | Tab "Libros" se activa (naranja), el SwipeDeck se resetea y carga contenido tipo `book` | | |
| T-04 | Hacer 3 swipes en Libros y luego cambiar a Películas | SwipeDeck se reinicia completamente (no conserva el estado anterior de Libros) | | |
| T-05 | Cambiar entre tabs varias veces rápido | No hay crash, cada cambio reinicia el deck correctamente | | |

---

## 4. HU3.1 — Feed con datos reales de TMDB / Google Books

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| F-01 | Llegar a `/feed` con tab "Películas" activo | SwipeDeck muestra tarjetas con portadas reales de TMDB (imágenes `image.tmdb.org`) | | |
| F-02 | Observar las tarjetas de películas | Cada tarjeta tiene: portada, título, badge "🎬 Película", géneros, calificación ⭐ con 1 decimal, sinopsis | | |
| F-03 | Cambiar a tab "Libros" | Tarjetas muestran portadas de Google Books, badge "📚 Libro" | | |
| F-04 | Verificar orden de tarjetas | Las tarjetas con mayor score (popularidad + rating normalizados) aparecen primero | | |
| F-05 | Llamar directamente: `GET /api/feed?userId={uid}&type=movie` con token válido | HTTP 200, array de objetos con campos: `contentId, title, cover, genres, rating, synopsis` | | |

---

## 5. HU3.2 — SwipeDeck (gestos de swipe)

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| S-01 | Ver la pantalla de feed | Se ven 3 tarjetas apiladas: la de encima en primer plano, las otras 2 escaladas y desplazadas hacia abajo | | |
| S-02 | Arrastrar la tarjeta superior hacia la derecha lentamente | Aparece indicador "❤️ LIKE" (verde) en la esquina superior izquierda de la tarjeta | | |
| S-03 | Arrastrar hacia la izquierda lentamente | Aparece indicador "✕ SKIP" (rojo) en la esquina superior derecha | | |
| S-04 | Soltar la tarjeta al arrastrar menos de 80px | La tarjeta regresa a su posición original con animación | | |
| S-05 | Arrastrar más de 80px hacia la derecha y soltar | La tarjeta vuela hacia la derecha y sale de pantalla. Se muestra la siguiente tarjeta | | |
| S-06 | Arrastrar más de 80px hacia la izquierda y soltar | La tarjeta vuela hacia la izquierda. Se muestra la siguiente tarjeta | | |
| S-07 | Swipe rápido (velocidad alta, menos de 80px de distancia) | La tarjeta se va si la velocidad supera ~300px/s | | |
| S-08 | Verificar en Firestore tras un swipe | Existe documento en colección `swipes` con campos: `userId, contentId, contentType, action (like/dislike)` | | |
| S-09 | Hacer swipes hasta llegar a 5 tarjetas restantes | La app carga silenciosamente más contenido en segundo plano (pre-fetch) sin interrumpir la experiencia | | |
| S-10 | Hacer swipe de una tarjeta que ya se swipeó antes | Esa tarjeta NO vuelve a aparecer en el feed | | |
| S-11 | Hacer swipe de todas las tarjetas del deck | Aparece mensaje "¡Has visto todo!" con botón "Ver más" | | |
| S-12 | Presionar "Ver más" tras agotar el deck | El deck se reinicia y carga nuevas tarjetas | | |
| S-13 | Simular error de red (modo avión) y cargar el feed | Aparece mensaje de error con botón "Reintentar" | | |

---

## 6. HU4.1 — DetailSheet (vista de detalle)

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| D-01 | Tocar (tap) sobre una tarjeta del SwipeDeck sin arrastrar | Se abre un bottom sheet que sube desde la parte inferior con animación suave (300ms ease-out) | | |
| D-02 | Observar el contenido del sheet al abrir | Spinner de carga visible mientras se obtiene el detalle del API | | |
| D-03 | Esperar a que cargue el detalle | Aparece: portada (16:9 películas / 3:4 libros), badge tipo, título, ⭐ rating, año, chips de géneros, sinopsis completa | | |
| D-04 | Revisar sección "Director:" o "Autor:" | Muestra el nombre correcto según el tipo de contenido | | |
| D-05 | Abrir detalle de una película | Sección "Disponible en:" muestra lista de plataformas (Netflix, HBO, etc.) O texto "No hay información de streaming disponible" | | |
| D-06 | Abrir detalle de un libro | No aparece sección "Disponible en:" | | |
| D-07 | Ver los 3 botones en la parte inferior | "✕ No me interesa" (gris), "💾 Guardar" (verde), "↗ Compartir" (azul) — todos visibles sin scroll | | |
| D-08 | Presionar "✕ No me interesa" | Sheet se cierra con animación (200ms), la tarjeta desaparece del deck | | |
| D-09 | Presionar "💾 Guardar" | Aparece toast verde "¡Guardado!" y el sheet se cierra | | |
| D-10 | Verificar en Firestore tras "Guardar" | Existe documento en `collections` con `userId, contentId, listName: "Guardados"` | | |
| D-11 | Presionar "Guardar" en un ítem ya guardado (409) | No muestra error, toast "¡Guardado!" igual (trata 409 como éxito) | | |
| D-12 | Presionar "↗ Compartir" en dispositivo con Web Share API | Se abre el menú nativo de compartir del dispositivo | | |
| D-13 | Presionar "↗ Compartir" en escritorio (sin Web Share API) | Toast "Link copiado" aparece | | |
| D-14 | Tocar el overlay oscuro fuera del sheet | Sheet se cierra con animación slide-down | | |
| D-15 | Hacer scroll dentro del sheet en contenido largo | El sheet hace scroll internamente sin cerrar | | |
| D-16 | Abrir el sheet y luego hacer swipe en el deck | El stack de swipe sigue intacto al cerrar el sheet | | |

---

## 7. HU5.1 — Biblioteca / Colecciones

> ⚠️ **Estado actual:** Solo existe `LibraryPlaceholder.jsx`. Las pruebas D-09 y D-10 verifican la escritura en Firestore, que es el backend funcional. La UI de biblioteca está pendiente (Diana).

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| B-01 | Navegar a `/library` estando autenticado | Se muestra pantalla placeholder (pendiente de implementación de Diana) | | |
| B-02 | `GET /api/collections?userId={uid}` con token válido | HTTP 200, array de colecciones del usuario | | |
| B-03 | `POST /api/collections` con body válido | HTTP 201, documento creado en Firestore | | |
| B-04 | `POST /api/collections` con el mismo `contentId` dos veces | HTTP 409 (anti-duplicados) | | |
| B-05 | `PATCH /api/collections/{id}` con `{"personalNote": "Mi nota"}` | HTTP 200, campo actualizado en Firestore | | |
| B-06 | `DELETE /api/collections/{id}` | HTTP 204, documento eliminado de Firestore | | |

---

## 8. API Backend — Pruebas directas con Postman/Bruno

Usar la colección `docs/Recos-BnM-API-Collection.json`. Obtener token con: Firebase Auth → `getIdToken()`.

| # | Endpoint | Body / Params | Respuesta esperada | ✅❌ | Notas |
|---|----------|--------------|-------------------|-----|-------|
| A-01 | `GET /health` | — | `{"ok": true}` HTTP 200 | | |
| A-02 | `GET /api/private/ping` sin token | — | HTTP 401 Unauthorized | | |
| A-03 | `GET /api/private/ping` con token válido | Header: `Authorization: Bearer {token}` | `{"ok": true, "uid": "..."}` HTTP 200 | | |
| A-04 | `GET /api/feed?userId={uid}&type=movie` sin token | — | HTTP 401 | | |
| A-05 | `GET /api/feed?userId={uid}&type=movie` con token | — | HTTP 200, array de contenido ordenado por score | | |
| A-06 | `GET /api/feed?userId={uid}&type=book` con token | — | HTTP 200, array de libros | | |
| A-07 | `GET /api/feed` con cursor (paginación) | `?cursor={lastIndex}` | HTTP 200, siguiente página de resultados | | |
| A-08 | `POST /api/swipe` con token | `{"userId":"...","contentId":"...","contentType":"movie","action":"like"}` | HTTP 204 sin body | | |
| A-09 | `POST /api/swipe` con token | mismo body con `"action":"dislike"` | HTTP 204 sin body | | |
| A-10 | `GET /api/content/{id}` con token | contentId válido en path | HTTP 200, objeto completo con todos los campos + `watchProviders` (array, puede ser vacío) | | |
| A-11 | `GET /api/content/INVALID_ID` con token | id inexistente | HTTP 404 | | |
| A-12 | `GET /api/collections?userId={uid}` con token | — | HTTP 200, array de colecciones del usuario | | |
| A-13 | `POST /api/collections` con token | `{"userId":"...","contentId":"...","contentType":"movie","listName":"Guardados"}` | HTTP 201 | | |
| A-14 | `PATCH /api/collections/{id}` con token | `{"personalNote": "Excelente"}` | HTTP 200 | | |
| A-15 | `DELETE /api/collections/{id}` con token | — | HTTP 204 | | |
| A-16 | Cualquier endpoint con token expirado | token vencido | HTTP 401 | | |

---

## 9. Firestore — Verificación de seguridad

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| FS-01 | Intentar `GET /api/collections?userId={otro_uid}` con token del usuario A | HTTP 403 o array vacío (no devuelve datos de otro usuario) | | |
| FS-02 | Intentar `DELETE /api/collections/{id_de_otro}` con token del usuario A | HTTP 403 o 404 | | |
| FS-03 | En Firebase Console, intentar escribir en `content` sin credenciales de ingest | Rechazado por reglas de seguridad | | |

---

## 10. PWA / Service Worker

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| W-01 | En Chrome mobile/desktop, revisar si aparece el banner "Instalar app" | El banner aparece o hay opción en menú del navegador de "Añadir a pantalla de inicio" | | |
| W-02 | Instalar la PWA y abrirla desde el ícono del home screen | App abre sin barra de navegador del browser (modo standalone) | | |
| W-03 | Navegar por la app, luego poner el dispositivo en modo avión | La shell de la app (pantalla de login/feed) carga desde caché | | |
| W-04 | En Chrome DevTools → Application → Service Workers | Service Worker de `sw.js` está activo y registrado | | |
| W-05 | En Chrome DevTools → Application → Manifest | `manifest.json` válido, nombre "recos-BnM", íconos presentes | | |

---

## 11. CI/CD Pipeline

| # | Acción | Resultado esperado | ✅❌ | Notas |
|---|--------|-------------------|-----|-------|
| CI-01 | Abrir cualquier PR activo en GitHub | El pipeline `CI/CD Pipeline Recos-BnM` aparece ejecutándose automáticamente | | |
| CI-02 | Verificar que el job `backend-ingest-tests` corre pytest | Logs muestran `pytest ingest/tests/` con resultados en verde | | |
| CI-03 | Verificar que el job `frontend-build-deploy` corre `npm run build` | Build de Vite exitoso sin errores | | |
| CI-04 | Verificar que el deploy a Firebase Hosting solo ocurre en push a `main` (no en PRs) | En un PR, el job de deploy está condicionado a `github.event_name == 'push'` | | |
| CI-05 | Verificar la URL de Firebase Hosting tras un push a `main` | La URL pública refleja los últimos cambios en menos de 3 minutos | | |

---

## 12. Casos borde y estrés

| # | Escenario | Resultado esperado | ✅❌ | Notas |
|---|-----------|-------------------|-----|-------|
| CE-01 | Abrir la app en pantalla de 375px (iPhone SE) | Todo el contenido es legible y usable sin scroll horizontal | | |
| CE-02 | Tarjeta con sinopsis muy larga (>200 caracteres) en ContentCard | Synopsis truncada a 3 líneas con CSS (`-webkit-line-clamp: 3`) | | |
| CE-03 | Tarjeta con más de 3 géneros (ej. 5 géneros) | Solo se muestran los primeros 3 + chip "+2" | | |
| CE-04 | Tarjeta sin imagen de portada (`cover: null`) | Placeholder con gradiente y el título centrado | | |
| CE-05 | Película sin watchProviders disponibles | DetailSheet muestra "No hay información de streaming disponible" (en cursiva) | | |
| CE-06 | Swipe muy rápido de varias tarjetas seguidas | No hay duplicados, no hay crash, el índice avanza correctamente | | |
| CE-07 | Cerrar y reabrir el DetailSheet rápidamente (doble tap) | No se abren dos sheets simultáneos | | |
| CE-08 | Desconectar red durante el swipe (POST /api/swipe falla) | El swipe ocurre visualmente de todas formas (fire-and-forget), la app no se traba | | |
| CE-09 | Sesión de Google expirada (token vencido) | La app redirige a `/login` automáticamente | | |
| CE-10 | Ingresar a `/mock-feed` sin autenticación | La página carga (es pública, no tiene ProtectedRoute) | | |

---

## 13. Resumen de ejecución

Completar al finalizar la sesión de pruebas.

| Sección | Total | ✅ Pasan | ❌ Fallan | ⚠️ Parcial |
|---------|-------|---------|---------|----------|
| 0. Pre-requisitos | 7 | | | |
| 1. Auth (Login/Register) | 16 | | | |
| 2. Onboarding | 9 | | | |
| 3. Tab Selector | 5 | | | |
| 4. Feed datos reales | 5 | | | |
| 5. SwipeDeck gestos | 13 | | | |
| 6. DetailSheet | 16 | | | |
| 7. Biblioteca/Colecciones | 6 | | | |
| 8. API Postman/Bruno | 16 | | | |
| 9. Firestore Seguridad | 3 | | | |
| 10. PWA/Service Worker | 5 | | | |
| 11. CI/CD Pipeline | 5 | | | |
| 12. Casos borde | 10 | | | |
| **TOTAL** | **116** | | | |

---

## 14. Bugs encontrados

| # | Sección | Descripción del bug | Severidad | Asignado a |
|---|---------|---------------------|-----------|-----------|
| | | | | |

---

## 15. Firma de validación

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Ejecutor de pruebas | | | |
| Observador / Co-ejecutor | | | |
| PM que aprueba entrega | Edgar Coronel Navarrete | | |

---

> **Versión 1.0** · Generado el 2026-06-09 · Basado en código real de `main` commit `8051c97`
> → [[DevLog/DevLog_Index|DevLog del proyecto]]
