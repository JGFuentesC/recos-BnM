# Contrato de Datos (Firestore Schema) — recos-BnM

> **Fuente de verdad:** PRD §6.
> **Última actualización:** 2026-06-06.
> **⚠️ ADVERTENCIA:** No renombrar campos sin coordinar con todo el equipo.
> Todos los módulos (frontend + backend) dependen de estos nombres exactos.

---

## Colección `users/{userId}`

**ID del documento:** `userId` generado por Firebase Auth. Nunca cambia.


| Campo                   | Tipo        | Descripción                                                    |
| ----------------------- | ----------- | -------------------------------------------------------------- |
| `email`                 | string      | Email del usuario                                              |
| `displayName`           | string      | Nombre visible                                                 |
| `authProvider`          | string      | `"email"` o `"google"`                                         |
| `createdAt`             | timestamp   | Fecha de primer registro                                       |
| `prefs`                 | map         | Preferencias del usuario (ver sub-campos abajo)                |
| `prefs.genres`          | arraystring | Géneros seleccionados en onboarding (ej. `["Acción","Drama"]`) |
| `prefs.authors`         | arraystring | Autores favoritos — puede ser `[]`                             |
| `prefs.directors`       | arraystring | Directores favoritos — puede ser `[]`                          |
| `prefs.cold_start_done` | boolean     | `true` cuando el usuario terminó el onboarding                 |


**Quién escribe:** Andrés González (al registrarse) y Juan Carlos Macías (al terminar onboarding).
**Quién lee:** Luis Téllez (filtrar feed por `prefs.genres`), Juan Carlos (redirect post-login).

---

## Colección `content/{contentId}`

**ID del documento:** Auto-generado por el job de ingest. Nadie más escribe aquí.


| Campo            | Tipo        | Descripción                                                                          |
| ---------------- | ----------- | ------------------------------------------------------------------------------------ |
| `type`           | string      | `"movie"` o `"book"`                                                                 |
| `externalId`     | string      | ID de TMDB o Google Books — para deduplicar en re-ingest                             |
| `source`         | string      | `"tmdb"` o `"google_books"`                                                          |
| `title`          | string      | Título del contenido                                                                 |
| `cover`          | string      | URL de la portada o imagen de portada                                                |
| `creator`        | arraystring | Directores (movie) o autores (book). Ej: `["Christopher Nolan"]` o `["F. Scott Fitzgerald"]` |
| `year`           | number      | Año de lanzamiento o publicación                                                     |
| `genres`         | arraystring | Lista de géneros (ej. `["Acción","Thriller"]`)                                       |
| `synopsis`       | string      | Sinopsis o descripción completa                                                      |
| `popularity`     | number      | Métrica de popularidad en escala original de la API                                  |
| `rating`         | number      | Calificación normalizada de 0 a 10                                                   |
| `watchProviders` | arraystring | Plataformas de streaming — solo movies; `[]` si no hay dato; siempre `[]` para books |
| `syncedAt`       | timestamp   | Fecha de la última sincronización del job                                            |


**Quién escribe:** Manuel Serranía (job de ingest en Cloud Run — nadie más).
**Quién lee:** Luis (feed), Héctor (detalle), Edgar (ContentCard), Marina (DetailSheet), Juan Carlos (onboarding).

---

## Colección `swipes/{swipeId}`

**ID del documento:** Auto-generado por Firestore en cada swipe.


| Campo         | Tipo      | Descripción                       |
| ------------- | --------- | --------------------------------- |
| `userId`      | string    | UID del usuario que hizo el swipe |
| `contentId`   | string    | ID del contenido swipeado         |
| `contentType` | string    | `"movie"` o `"book"`              |
| `action`      | string    | `"like"` o `"dislike"`            |
| `timestamp`   | timestamp | Momento exacto del swipe          |


**Quién escribe:** Luis Téllez (POST /api/swipe).
**Quién lee:** Luis (excluir ya-vistos del feed), Monserrat (confirmar swipe registrado).

---

## Colección `collections/{collectionId}`

**ID del documento:** Auto-generado por Firestore.
**⚠️ MODELO:** Un documento por cada ítem guardado individualmente. **NO** un documento por lista.


| Campo          | Tipo      | Descripción                                |
| -------------- | --------- | ------------------------------------------ |
| `userId`       | string    | UID del dueño de la colección              |
| `contentId`    | string    | ID del contenido guardado                  |
| `contentType`  | string    | `"movie"` o `"book"`                       |
| `listName`     | string    | Nombre de la lista — default `"Guardados"` |
| `personalNote` | string    | Nota personal del usuario — puede ser `""` |
| `savedAt`      | timestamp | Fecha en que se guardó el ítem             |


**Quién escribe:** Christian Ruiz (POST, PATCH, DELETE /api/collections).
**Quién lee:** Diana Álvarez (Biblioteca), Christian (GET /api/collections con filtros `type` y `listName`).

---

## Índices compuestos

Definidos en `src/firestore/firestore.indexes.json`.


| Colección | Campos del índice                                        | Usado por                                |
| --------- | -------------------------------------------------------- | ---------------------------------------- |
| `content` | `type` ASC + `genres` ARRAY-CONTAINS + `popularity` DESC | Luis — GET /api/feed filtrado por género |
| `content` | `type` ASC + `rating` DESC                               | Luis — GET /api/feed ordenado por rating |


