---
project: "Recos-BnM"
owner: "Israel Pérez"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [architecture, data-model, firestore, schema]
---

# Data Model — Recos-BnM

> Schema de Firestore. Fuente: PRD §6 + trabajo de [[Sprint-1/01-Israel-Perez|Israel Pérez]].  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Visión general

Firestore usa 4 colecciones de nivel raíz:

```
Firestore
├── users/{userId}
├── content/{contentId}
├── swipes/{swipeId}
└── collections/{collectionId}
```

---

## Colección: `users`

**Path:** `users/{userId}`  
**Quién escribe:** Auth middleware (creación en primer login) + API (actualización de prefs)  
**Quién lee:** API (auth middleware + feed + collections)

```typescript
interface UserDocument {
  email: string;                    // Email del usuario
  displayName: string;              // Nombre del usuario
  authProvider: "email" | "google"; // Proveedor de autenticación
  createdAt: Timestamp;             // Fecha de creación
  prefs: {
    genres: string[];               // Géneros preferidos. Ej: ["Sci-Fi", "Thriller"]
    authors: string[];              // Autores favoritos (libros)
    directors: string[];            // Directores favoritos (películas)
    cold_start_done: boolean;       // true cuando completa o salta el onboarding
  };
}
```

**Ejemplo real:**
```json
{
  "email": "juan@ejemplo.com",
  "displayName": "Juan García",
  "authProvider": "google",
  "createdAt": "2026-06-04T10:00:00Z",
  "prefs": {
    "genres": ["Sci-Fi", "Thriller", "Drama"],
    "authors": ["Gabriel García Márquez"],
    "directors": ["Christopher Nolan"],
    "cold_start_done": true
  }
}
```

**Reglas de seguridad:**
```javascript
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## Colección: `content`

**Path:** `content/{contentId}`  
**Quién escribe:** Ingest Job únicamente (Cloud Run Job — [[Sprint-1/03-Manuel-Serrania|Manuel Serranía]])  
**Quién lee:** API (GET /api/feed, GET /api/content/:id)  
**Nota:** Los clientes (frontend) NO pueden escribir en esta colección.

```typescript
interface ContentDocument {
  type: "movie" | "book";           // Tipo de contenido
  externalId: string;               // ID en la fuente (TMDB ID o Google Books ID)
  source: "tmdb" | "google_books";  // Fuente del dato
  title: string;                    // Título
  cover: string;                    // URL de la portada/imagen
  year: number;                     // Año de lanzamiento/publicación
  genres: string[];                 // Lista de géneros. Ej: ["Sci-Fi", "Thriller"]
  synopsis: string;                 // Sinopsis (puede ser truncada del original)
  popularity: number;               // Score de popularidad (escala de la fuente)
  rating: number;                   // Calificación normalizada 0–10
  watchProviders: string[];         // Solo movies: plataformas de streaming ["Netflix", "HBO Max"]
                                    // Para books y movies sin dato: []
  syncedAt: Timestamp;              // Última vez que el ingest job actualizó este doc
}
```

**Ejemplo — Película:**
```json
{
  "type": "movie",
  "externalId": "27205",
  "source": "tmdb",
  "title": "Inception",
  "cover": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "year": 2010,
  "genres": ["Sci-Fi", "Action", "Thriller"],
  "synopsis": "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños...",
  "popularity": 150.2,
  "rating": 8.8,
  "watchProviders": ["Netflix", "HBO Max"],
  "syncedAt": "2026-06-04T04:00:00Z"
}
```

**Ejemplo — Libro:**
```json
{
  "type": "book",
  "externalId": "PGR2AwAAQBAJ",
  "source": "google_books",
  "title": "Cien años de soledad",
  "cover": "https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1",
  "year": 1967,
  "genres": ["Fiction", "Magical Realism", "Literary Fiction"],
  "synopsis": "La novela narra la historia de la familia Buendía a lo largo de siete generaciones...",
  "popularity": 4200,
  "rating": 4.5,
  "watchProviders": [],
  "syncedAt": "2026-06-04T04:00:00Z"
}
```

**Reglas de seguridad:**
```javascript
match /content/{contentId} {
  allow read: if request.auth != null;   // cualquier usuario autenticado puede leer
  allow write: if false;                  // solo el ingest job (con service account)
}
```

**Índices compuestos requeridos:**
```json
[
  { "collectionGroup": "content", "fields": [{"fieldPath": "type"}, {"fieldPath": "genres", "arrayConfig": "CONTAINS"}, {"fieldPath": "popularity", "order": "DESCENDING"}] },
  { "collectionGroup": "content", "fields": [{"fieldPath": "type"}, {"fieldPath": "syncedAt", "order": "DESCENDING"}] }
]
```

---

## Colección: `swipes`

**Path:** `swipes/{swipeId}`  
**Quién escribe:** API (`POST /api/swipe`)  
**Quién lee:** API (`GET /api/feed` — para excluir ya-swipeados)

```typescript
interface SwipeDocument {
  userId: string;                   // UID del usuario (= Firebase Auth UID)
  contentId: string;                // ID del documento en content/
  contentType: "movie" | "book";   // Tipo de contenido
  action: "like" | "dislike";      // Acción del usuario
  timestamp: Timestamp;             // Momento del swipe
}
```

**Ejemplo:**
```json
{
  "userId": "uid_abc123",
  "contentId": "content_xyz789",
  "contentType": "movie",
  "action": "like",
  "timestamp": "2026-06-04T15:30:00Z"
}
```

**Reglas de seguridad:**
```javascript
match /swipes/{swipeId} {
  allow read, write: if request.auth != null
    && request.resource.data.userId == request.auth.uid;
}
```

**Índices compuestos requeridos:**
```json
[
  { "collectionGroup": "swipes", "fields": [{"fieldPath": "userId"}, {"fieldPath": "contentType"}, {"fieldPath": "timestamp", "order": "DESCENDING"}] }
]
```

---

## Colección: `collections`

**Path:** `collections/{collectionId}`  
**Quién escribe:** API (CRUD `/api/collections`)  
**Quién lee:** API (`GET /api/collections`) + Service Worker (cache offline)

```typescript
interface CollectionDocument {
  userId: string;                   // UID del usuario propietario
  contentId: string;                // ID del documento en content/
  contentType: "movie" | "book";   // Tipo de contenido
  listName: string;                 // Nombre de lista. Default: "Guardados"
  personalNote: string;             // Nota personal. Default: ""
  savedAt: Timestamp;               // Fecha de guardado
}
```

**Ejemplo:**
```json
{
  "userId": "uid_abc123",
  "contentId": "content_xyz789",
  "contentType": "movie",
  "listName": "Para el finde",
  "personalNote": "Verla el sábado con Ana",
  "savedAt": "2026-06-04T16:00:00Z"
}
```

**Reglas de seguridad:**
```javascript
match /collections/{collectionId} {
  allow read, write: if request.auth != null
    && (resource == null || resource.data.userId == request.auth.uid);
}
```

**Índices compuestos requeridos:**
```json
[
  { "collectionGroup": "collections", "fields": [{"fieldPath": "userId"}, {"fieldPath": "contentType"}, {"fieldPath": "savedAt", "order": "DESCENDING"}] },
  { "collectionGroup": "collections", "fields": [{"fieldPath": "userId"}, {"fieldPath": "listName"}, {"fieldPath": "savedAt", "order": "DESCENDING"}] }
]
```

---

## Restricciones de Firestore a considerar

| Restricción | Impacto | Mitigación |
|---|---|---|
| No soporta filtros compuestos arbitrarios en query | No podemos hacer `WHERE genres CONTAINS X AND score > Y` | Ranking calculado en backend, no en query |
| Límite de 1 MB por documento | No aplicable para nuestros documentos | N/A |
| Límite de 1 write/segundo por documento | Solo el ingest job escribe en `content` | Batch writes + sleep(0.25) |
| Sin joins nativos | Necesitamos denormalizar datos en collections | Se incluye `contentType` y datos básicos del content |

---

## Diagrama de relaciones

```
users/{userId}
    │
    │ (userId referencia)
    ├──────────────────────> swipes/{swipeId}
    │                            │ contentId
    │                            ▼
    │                       content/{contentId}
    │                            ▲
    └──────────────────────> collections/{collectionId}
                                 │ contentId
```

Ver implementación completa en `docs/SCHEMA.md` del repositorio (generado por [[Sprint-1/01-Israel-Perez|Israel Pérez]]).
