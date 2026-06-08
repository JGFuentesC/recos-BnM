# PRD — Tinder de Contenidos: Películas y Libros

## 1. Control de versiones

| Campo | Valor |
|---|---|
| Proyecto | Tinder de Contenidos (clave: *Match&Read* / *Match&Watch*) |
| Estado | Listo para desarrollo |
| Versión | 2.0 (refactor: catálogo, métricas, riesgos y contratos de API) |
| Fecha | Junio 2026 |
| Stack core (GCP) | Firebase Auth · Cloud Run (API) · Firestore · Firebase Hosting (PWA) |
| APIs externas | TMDB (primaria, películas) · Google Books · IMDb vía RapidAPI (fallback) · TMDB Watch Providers (streaming) |

> **Cambio clave v2:** se sustituye "IMDb API oficial" como fuente primaria de películas. IMDb no ofrece una API pública estable para este caso; los datos de catálogo, popularidad, calificación y disponibilidad de streaming se obtienen de TMDB (gratuita, documentada, con endpoint de *watch providers*). IMDb vía RapidAPI queda como enriquecimiento opcional.

---

## 2. Visión y objetivos

Reducir la "fatiga de decisión" en el consumo de películas y libros mediante una interfaz móvil-first basada en gestos (*swipes*), entregada como PWA sobre infraestructura serverless en GCP.

### North Star Metric

Swipes calificados por usuario activo semanal (proxy directo de descubrimiento y engagement).

### Objetivos del MVP (medibles)

| Objetivo | Métrica | Meta |
|---|---|---|
| Activación | % de usuarios que completan onboarding y ≥20 swipes en sesión 1 | ≥ 60% |
| Engagement | Swipes promedio / sesión | ≥ 30 |
| Retención | Retención D7 | ≥ 25% |
| Conversión a biblioteca | % de usuarios que guardan ≥1 título | ≥ 40% |
| Eficiencia técnica | Costo de infraestructura / 1.000 usuarios activos | < USD 5 |

---

## 3. Alcance

### Dentro de alcance (MVP)

Registro/login, onboarding por swipe, feed de películas y libros con swipe, vista de detalle, biblioteca con listas y notas, capa de caché de catálogo, reglas de seguridad de Firestore.

### Fuera de alcance (MVP)

- Recomendación con ML / *collaborative filtering* (se usa popularidad + contenido).
- Matching social entre usuarios o funciones de amistad.
- Disponibilidad de streaming en tiempo real verificada por región (se usa el proveedor que devuelva TMDB; sin garantía contractual).
- Notificaciones push.
- Pagos o monetización.
- App nativa iOS/Android (solo PWA).

---

## 4. Supuestos y dependencias

- TMDB y Google Books mantienen sus cuotas gratuitas actuales; se respeta el *rate limiting* de cada una mediante caché.
- El catálogo se pre-indexa periódicamente en Firestore; el feed no consulta APIs externas en caliente salvo para enriquecer detalle.
- Licencia de uso de TMDB exige atribución visible: *"This product uses the TMDB API but is not endorsed or certified by TMDB"*.
- Firestore tiene límites de filtrado compuesto: el *ranking* del feed se calcula en backend, no vía query nativa.

---

## 5. Arquitectura de alto nivel (GCP)

1. **Frontend (PWA)** — React o Vue, optimizado para gestos táctiles, Service Worker para offline parcial. Alojado en Firebase Hosting.
2. **Auth** — Firebase Authentication (Email/Password + Google Sign-In).
3. **Backend API** — Microservicios en Node.js o Python en Cloud Run (escala a cero).
4. **Base de datos** — Cloud Firestore (perfiles, swipes, colecciones, catálogo cacheado).
5. **Ingesta de catálogo** — Job programado (Cloud Scheduler → Cloud Run) que sincroniza TMDB y Google Books a la colección `content`, evitando llamadas duplicadas y controlando costos.

```
[PWA] --auth--> [Firebase Auth]
  |  REST
  v
[Cloud Run API] <--> [Firestore: users, swipes, collections, content]
       ^
       | sync programado
[Cloud Scheduler] --> [Cloud Run: ingest] --> [TMDB / Google Books]
```

---

## 6. Modelo de datos (Firestore)

```
users/{userId}
  email, displayName, authProvider, createdAt
  prefs: { genres: [], authors: [], directors: [], cold_start_done: bool }

content/{contentId}            // catálogo cacheado
  type: "movie" | "book"
  externalId, source: "tmdb" | "google_books"
  title, cover, year, genres: [], synopsis
  popularity (float), rating (float, escala 0–10 normalizada)
  watchProviders: []           // solo movies; placeholder si no hay dato
  syncedAt

swipes/{swipeId}
  userId, contentId, contentType
  action: "like" | "dislike"
  timestamp

collections/{collectionId}
  userId, contentId, contentType
  listName (default: "Guardados"), personalNote, savedAt
```

---

## 7. Épicas e historias de usuario

### ÉPICA 1 — Registro y calibración inicial (P1)

*Dolores:* onboarding largo, exceso de datos, géneros poco representativos.

#### HU1.1 — Registro simplificado (Email + Google)

- **Como** usuario, **quiero** registrarme con email o Google, **para** entrar rápido y seguro.
- **Criterios de aceptación:**
  - Máximo 2 clics con Google Auth.
  - Validación de formato de email.
  - Éxito → redirección a calibración de perfil.
- **Tareas técnicas:**
  1. Activar proveedores Email y Google en Firebase.
  2. Componentes UI responsivos de Login/Registro.
  3. Inicializar SDK de Firebase en frontend.
  4. Crear documento en `users` en el primer registro.

#### HU1.2 — Calibración por swipe (cold start)

- **Como** usuario, **quiero** un onboarding de 5–10 tarjetas + selección simple de géneros y autores/directores, **para** que la app entienda mis gustos sin formularios.
- **Criterios de aceptación:**
  - Máximo 10 tarjetas secuenciales; pueden saltarse.
  - Buscador predictivo de autores/directores favoritos (opcional).
  - Al terminar se marca `prefs.cold_start_done = true`.
- **Tareas técnicas:**
  1. Componente de onboarding con barra de progreso.
  2. Buscador predictivo contra endpoints de búsqueda (TMDB / Google Books) en backend.
  3. Persistir vector de preferencias en `users.prefs`.

---

### ÉPICA 2 — Selección y filtrado de contenido (P2)

*Dolores:* falta de indicador del tipo activo, confusión al cambiar de feed.

#### HU2.1 — Conmutador de tipo (Tab Selector)

- **Como** usuario, **quiero** alternar entre "Libros" y "Películas" desde un control visible, **para** consumir según mi ánimo manteniendo feeds independientes.
- **Criterios de aceptación:**
  - Indicador visual de alta visibilidad del modo activo (color de acento o icono).
  - Al cambiar de pestaña no se pierde el estado del feed actual.
- **Tareas técnicas:**
  1. Navbar/tabs persistentes con estados.
  2. Gestión de estado global para separar `active_feed` (`movies` / `books`).

---

### ÉPICA 3 — Recomendación y mecánica de swipe (P3)

*Dolores:* tarjetas con poca info, contenido repetido, feed que se agota.

#### HU3.1 — Algoritmo de arranque (popularidad + contenido)

- **Como** sistema, **debo** mezclar TMDB y Google Books filtrando por géneros del usuario y priorizando alta popularidad/calificación, **para** evitar el arranque en frío.
- **Criterios de aceptación:**
  - Las primeras 20 tarjetas pertenecen al top de los géneros seleccionados.
  - Nunca se muestra contenido ya *swipeado* (`like` o `dislike`).
- **Tareas técnicas:**
  1. Endpoint `GET /api/feed` que recibe `userId`, `type`, `cursor`.
  2. Lógica: leer `content` pre-indexado por géneros del usuario, restar IDs presentes en `swipes`.
  3. **Score normalizado** (evita que escalas distintas sesguen el ranking):
     ```
     score = 0.7 * norm(popularity) + 0.3 * norm(rating)
     // norm(x) = (x - min) / (max - min) sobre el conjunto candidato
     ```
  4. Para feed de >100 swipes, sumar señal de afinidad: +peso a géneros con mayor ratio de like histórico del usuario.

#### HU3.2 — Feed interactivo con swipe

- **Como** usuario, **quiero** tarjetas con portada, título, género, descripción breve y calificación, y hacer swipe derecha (like) / izquierda (no), **para** descubrir rápido.
- **Criterios de aceptación:**
  - Gestos táctiles nativos con animación fluida (≈60 FPS).
  - Precarga asíncrona de las siguientes 3 tarjetas.
- **Tareas técnicas:**
  1. Librería de gestos (`react-tinder-card` o lógica custom con Framer Motion).
  2. *Pre-fetching*: al quedar 5 tarjetas en el stack, disparar `GET /api/feed` silencioso.
  3. Cada swipe → `POST /api/swipe` no bloqueante (`userId`, `contentId`, `type`, `action`, `timestamp`).

---

### ÉPICA 4 — Vista de detalle (P4)

*Dolores:* exceso de info en una pantalla, no saber dónde ver la película.

#### HU4.1 — Vista expandida equilibrada

- **Como** usuario, **quiero** tocar una tarjeta para ver sinopsis completa, autor/director, año, género, reseñas resumidas y plataformas de streaming, **para** evaluar con calma.
- **Criterios de aceptación:**
  - Transición tipo modal/slide-up que no destruye el stack inferior.
  - Tres acciones flotantes: "Guardar", "No me interesa", "Compartir".
- **Tareas técnicas:**
  1. Componente de detalle (sheet expandible).
  2. Streaming: usar TMDB Watch Providers; si no hay dato, mostrar placeholder neutro (sin inventar disponibilidad). *Reemplaza el mapeo aleatorio de íconos del MVP original, que comunicaba información falsa.*

---

### ÉPICA 5 — Colecciones y listas (P5)

*Dolores:* colecciones desordenadas, olvido del motivo de guardado, listas difíciles de hallar.

#### HU5.1 — Guardado clasificado + listas personalizadas

- **Como** usuario, **quiero** que al guardar (swipe derecha o botón) el contenido se separe automáticamente en "Películas" y "Libros" con fecha, y poder crear listas (ej. "Para el finde"), **para** retomar el consumo y controlar mi catálogo.
- **Criterios de aceptación:**
  - "Colección" accesible en un paso desde la barra inferior.
  - Cada elemento permite añadir una "Nota personal".
- **Tareas técnicas:**
  1. Modelo `collections` (ver §6).
  2. Vista de biblioteca con filtros por tipo y por lista.
  3. CRUD en Cloud Run para listas y notas.

---

## 8. Contratos de API (MVP)

| Método | Endpoint | Entrada | Salida |
|---|---|---|---|
| GET | /api/feed | userId, type, cursor | `[ {contentId, title, cover, genres, rating, synopsis} ]` |
| POST | /api/swipe | userId, contentId, type, action | 204 |
| GET | /api/content/{id} | — | objeto content completo + watchProviders |
| GET | /api/collections | userId, ?type, ?listName | `[ collections ]` |
| POST | /api/collections | userId, contentId, listName, personalNote | 201 |
| PATCH | /api/collections/{id} | personalNote, listName | 200 |
| DELETE | /api/collections/{id} | — | 204 |

---

## 9. Requerimientos no funcionales

- **Rendimiento:** LCP < 2.5 s en 4G simulada.
- **Offline:** cachear la shell de la PWA + últimos 10 ítems de la colección vía Service Worker.
- **Disponibilidad:** Cloud Run con escala a cero; *cold start* mitigado con `min-instances=1` si la latencia inicial degrada la activación.
- **Atribución:** mostrar el aviso requerido por TMDB.

### Reglas de seguridad de Firestore

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /swipes/{swipeId} {
      allow read, write: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
    match /collections/{collectionId} {
      allow read, write: if request.auth != null
        && (resource == null || resource.data.userId == request.auth.uid);
    }
    match /content/{contentId} {
      allow read: if request.auth != null;   // catálogo: solo lectura para clientes
      allow write: if false;                 // escritura únicamente por el job de ingesta
    }
  }
}
```

---

## 10. Eventos de analítica (mínimos)

`onboarding_completed`, `swipe` (con `action`, `type`), `feed_exhausted`, `detail_opened`, `content_saved`, `list_created`, `note_added`.

Permiten medir todas las metas de §2.

---

## 11. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Costos/cuotas de APIs externas | Alto | Pre-indexar catálogo; servir feed desde Firestore, no en caliente |
| Datos de streaming inexactos | Medio | Usar TMDB Watch Providers; placeholder neutro cuando no hay dato |
| Cold start de Cloud Run afecta activación | Medio | `min-instances=1` si la métrica D0 se degrada |
| Límites de filtrado de Firestore | Medio | Ranking en backend; índices compuestos por `type` + `genres` |
| Feed agotado para usuarios muy activos | Medio | Paginación por cursor + señal de afinidad histórica |

---

## 12. Despliegue manual (sin CI/CD)

### Backend (Cloud Run)

```bash
gcloud run deploy tinder-contenidos-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend (PWA en Firebase Hosting)

```bash
npm run build
firebase login
firebase deploy --only hosting
```

### Job de ingesta de catálogo (recomendado)

```bash
gcloud run deploy tinder-contenidos-ingest \
  --source ./ingest \
  --region us-central1 \
  --no-allow-unauthenticated

gcloud scheduler jobs create http sync-catalogo \
  --schedule "0 4 * * *" \
  --uri "https://<URL-ingest>/run" \
  --http-method POST
```

---

## 13. Roadmap por fases

| Fase | Contenido |
|---|---|
| **Fase 1 (MVP)** | Épicas 1–5 con popularidad + contenido |
| **Fase 2** | Señal de afinidad histórica, listas compartibles, notificaciones |
| **Fase 3** | Recomendación con ML, disponibilidad de streaming por región, monetización |
