---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [architecture, api, contracts]
---

# API Specification — Recos-BnM

> Contratos de API del MVP. Fuente: PRD §8.  
> Todos los endpoints requieren `Authorization: Bearer <firebase-jwt>` salvo indicación contraria.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Base URL

```
https://<cloud-run-url>/api
```

En desarrollo local: `http://localhost:8080/api`

---

## Resumen de endpoints

| Método | Endpoint | Responsable | Wave |
|---|---|---|---|
| GET | `/api/feed` | [[Sprint-1/04-Luis-Tellez\|Luis Téllez]] | Wave 2 |
| POST | `/api/swipe` | [[Sprint-1/04-Luis-Tellez\|Luis Téllez]] | Wave 2 |
| GET | `/api/content/:id` | [[Sprint-1/05-Hector-Morales\|Héctor Morales]] | Wave 2 |
| GET | `/api/collections` | Unassigned → rec. [[Sprint-1/06-Christian-Ruiz\|Christian Ruiz]] | Wave 2 |
| POST | `/api/collections` | [[Sprint-1/06-Christian-Ruiz\|Christian Ruiz]] | Wave 2 |
| PATCH | `/api/collections/:id` | [[Sprint-1/06-Christian-Ruiz\|Christian Ruiz]] | Wave 2 |
| DELETE | `/api/collections/:id` | [[Sprint-1/06-Christian-Ruiz\|Christian Ruiz]] | Wave 2 |

---

## Auth Middleware

Todos los endpoints validan el Bearer token con Firebase Admin SDK:

```javascript
// middleware/auth.js
const admin = require('firebase-admin');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.userId = decoded.uid;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## GET /api/feed

**Descripción:** Devuelve una página de tarjetas de contenido ordenadas por score, filtradas por las preferencias del usuario y excluyendo contenido ya swipeado.

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `type` | `"movie" \| "book"` | Sí | Tipo de contenido del feed |
| `cursor` | `string` | No | Token de paginación (opaco). Omitir para primera página |

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "contentId": "abc123",
    "title": "Inception",
    "cover": "https://image.tmdb.org/t/p/w500/...",
    "genres": ["Sci-Fi", "Thriller"],
    "rating": 8.8,
    "synopsis": "Un ladrón que roba secretos corporativos...",
    "type": "movie",
    "nextCursor": "eyJ0eXBlIjoibW92aWUiLCJsYXN0SWQiOiJhYmMxMjMifQ=="
  },
  ...
]
```

**Errores:**
| Código | Causa |
|---|---|
| 401 | Token ausente o inválido |
| 400 | `type` no especificado o valor inválido |

**Lógica interna:**
1. Leer `users/{userId}/prefs.genres`
2. Query `content` donde `type == param.type` y `genres` contiene alguno de los géneros del usuario
3. Restar IDs en `swipes` del userId
4. Calcular `score = 0.7 × norm(popularity) + 0.3 × norm(rating)`
5. Ordenar por score desc, paginar con cursor

---

## POST /api/swipe

**Descripción:** Registra un swipe del usuario sobre un contenido.

**Body:**
```json
{
  "contentId": "abc123",
  "contentType": "movie",
  "action": "like"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `contentId` | `string` | Sí | ID del contenido en Firestore |
| `contentType` | `"movie" \| "book"` | Sí | Tipo de contenido |
| `action` | `"like" \| "dislike"` | Sí | Acción del usuario |

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

**Lógica interna:**
```javascript
await db.collection('swipes').add({
  userId: req.userId,
  contentId: body.contentId,
  contentType: body.contentType,
  action: body.action,
  timestamp: admin.firestore.FieldValue.serverTimestamp()
});
```

**Errores:**
| Código | Causa |
|---|---|
| 401 | Token inválido |
| 400 | Campos requeridos faltantes o `action` inválida |

> **Importante:** Este endpoint es fire-and-forget en el frontend. No bloquear el swipe esperando respuesta.

---

## GET /api/content/:id

**Descripción:** Devuelve el objeto completo de un ítem de contenido, incluyendo sinopsis completa, watchProviders (solo movies) y atribución.

**Path params:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `string` | contentId de Firestore |

**Headers:** `Authorization: Bearer <token>`

**Response 200 (película):**
```json
{
  "contentId": "abc123",
  "type": "movie",
  "title": "Inception",
  "cover": "https://image.tmdb.org/t/p/w500/...",
  "year": 2010,
  "genres": ["Sci-Fi", "Thriller"],
  "synopsis": "Sinopsis completa...",
  "director": "Christopher Nolan",
  "rating": 8.8,
  "source": "tmdb",
  "watchProviders": ["Netflix", "HBO Max"],
  "attribution": "This product uses the TMDB API but is not endorsed or certified by TMDB"
}
```

**Response 200 (libro):**
```json
{
  "contentId": "xyz789",
  "type": "book",
  "title": "Cien años de soledad",
  "cover": "https://books.google.com/...",
  "year": 1967,
  "genres": ["Fiction", "Magical Realism"],
  "synopsis": "Sinopsis completa...",
  "author": "Gabriel García Márquez",
  "rating": 4.5,
  "source": "google_books",
  "watchProviders": [],
  "attribution": null
}
```

**Notas:**
- `watchProviders`: solo para `type: "movie"`. Si TMDB no tiene dato → array vacío `[]`. **Nunca inventar.**
- `attribution`: solo cuando `source === "tmdb"`. Para `google_books` → `null`.

**Errores:**
| Código | Causa |
|---|---|
| 401 | Token inválido |
| 404 | contentId no encontrado |

---

## GET /api/collections

**Descripción:** Devuelve los ítems guardados del usuario, con filtros opcionales.

> ⚠️ **Responsable:** Sin asignar en el sprint planning original. Recomendado: [[Sprint-1/06-Christian-Ruiz|Christian Ruiz]] (ya tiene el resto del CRUD).  
> Eduardo debe resolver esta asignación. Ver [[Sprint-1/00-Sprint1-Overview|Sprint Overview]].

**Query params:**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `type` | `"movie" \| "book"` | No | Filtra por tipo de contenido |
| `listName` | `string` | No | Filtra por nombre de lista |

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
[
  {
    "collectionId": "col123",
    "contentId": "abc123",
    "contentType": "movie",
    "listName": "Guardados",
    "personalNote": "Verla el sábado",
    "savedAt": "2026-06-04T10:00:00Z",
    "content": {
      "title": "Inception",
      "cover": "https://...",
      "rating": 8.8
    }
  }
]
```

---

## POST /api/collections

**Descripción:** Guarda un ítem en la colección del usuario.

**Body:**
```json
{
  "contentId": "abc123",
  "contentType": "movie",
  "listName": "Guardados",
  "personalNote": ""
}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `201 Created`
```json
{
  "collectionId": "col123"
}
```

---

## PATCH /api/collections/:id

**Descripción:** Actualiza la nota personal o el nombre de lista de un ítem guardado.

**Body (campos opcionales):**
```json
{
  "personalNote": "Verla el sábado",
  "listName": "Para el finde"
}
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "collectionId": "col123",
  "updated": ["personalNote", "listName"]
}
```

**Errores:**
| Código | Causa |
|---|---|
| 401 | Token inválido |
| 403 | El collectionId no pertenece al userId del token |
| 404 | collectionId no encontrado |

---

## DELETE /api/collections/:id

**Descripción:** Elimina un ítem guardado de la colección del usuario.

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

**Errores:**
| Código | Causa |
|---|---|
| 401 | Token inválido |
| 403 | El collectionId no pertenece al userId del token |
| 404 | collectionId no encontrado |

---

## Eventos de analítica

Todos los eventos se disparan desde el frontend (no desde la API):

| Evento | Cuándo se dispara |
|---|---|
| `onboarding_completed` | Al marcar `cold_start_done = true` |
| `swipe` | Cada swipe (incluye `action`, `type`) |
| `feed_exhausted` | Cuando el feed devuelve array vacío |
| `detail_opened` | Al abrir DetailSheet |
| `content_saved` | Al llamar `POST /api/collections` exitoso |
| `list_created` | Al crear lista con nombre personalizado |
| `note_added` | Al editar nota personal |
