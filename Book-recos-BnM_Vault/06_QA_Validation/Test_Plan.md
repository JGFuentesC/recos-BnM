---
project: "Recos-BnM"
owner: "Ulises Chaparro"
status: "Active"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [qa, testing, test-plan]
---

# Test Plan — Recos-BnM

> Plan de pruebas del MVP. Happy paths + casos borde.  
> Responsable: [[Sprint-1/13-Ulises-Chaparro|Ulises Chaparro]] (Wave 4)  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Scope del plan

| Épica | Incluida | Notas |
|---|---|---|
| Épica 1 — Auth + Onboarding | ✅ | Login, Registro, Cold Start |
| Épica 2 — Tab Selector | ✅ | Cambio de feed sin pérdida de estado |
| Épica 3 — Feed + Swipe | ✅ | Score, exclusión de ya-swipeados, precarga |
| Épica 4 — Detail Sheet | ✅ | Watch providers, atribución TMDB |
| Épica 5 — Colecciones | ✅ | CRUD completo + notas + filtros |
| CI Gates | ✅ | Ver [[06_QA_Validation/CI_QA_Gates|CI QA Gates]] |
| Tests unitarios (API) | Responsables por developer | Ver DoD en [[05_Engineering/Definition_of_Done|Definition of Done]] |

---

## Herramientas

| Herramienta | Uso |
|---|---|
| Postman / Bruno | Colección de 7 endpoints del API |
| Firebase Emulator Suite | Backend + Auth + Firestore en local |
| Chrome DevTools | Rendimiento (LCP), modo offline, responsiveness |
| Lighthouse | Auditoría PWA + performance |

---

## Happy Path — Flujo completo de usuario nuevo

### HP-01: Registro + Onboarding → Feed → Detalle → Guardar

**Precondición:** Firebase emulators corriendo. Usuario no registrado.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Abrir la app en `/login` | Pantalla de login visible, fondo oscuro |
| 2 | Ingresar email válido + contraseña | Sin errores de validación |
| 3 | Click "Crear cuenta" | Redirección automática a `/onboarding` |
| 4 | Hacer swipe derecha en 3 tarjetas, izquierda en 2 | Barra de progreso avanza, swipes registrados |
| 5 | Seleccionar 2 géneros favoritos | Chips marcados con color de acento |
| 6 | Click "Empezar a descubrir" | `cold_start_done: true` en Firestore. Redirección a `/feed` |
| 7 | Ver SwipeDeck con tarjetas del tipo preferido | Tarjetas visibles, géneros coinciden con selección |
| 8 | Hacer swipe derecha en un ítem | Card desaparece con animación verde. POST /api/swipe → 204 |
| 9 | Hacer swipe izquierda en un ítem | Card desaparece con animación roja. POST /api/swipe → 204 |
| 10 | Tocar una tarjeta | DetailSheet aparece con slide-up 300ms |
| 11 | Ver plataformas de streaming (película) | Lista de providers o "Disponibilidad no disponible" |
| 12 | Click "Guardar" en DetailSheet | POST /api/collections → 201. Toast de confirmación |
| 13 | Navegar a Biblioteca | Ítem recién guardado visible en la lista |
| 14 | Editar nota personal del ítem | Texto se guarda al perder foco. PATCH /api/collections/:id → 200 |

**Criterio de éxito:** Todos los pasos sin errores, sin datos inconsistentes en Firestore.

---

### HP-02: Login con Google

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Click "Continuar con Google" | Popup de Google Account Selector |
| 2 | Seleccionar cuenta | Autenticación exitosa |
| 3 | Primera vez: redirección a `/onboarding` | Onboarding visible |
| 4 | Segunda vez (mismo account): redirección a `/feed` | Feed visible sin onboarding |

---

### HP-03: Cambio de tab Películas → Libros

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Estar en feed de Películas con cursor en página 2 | Feed de películas visible |
| 2 | Click en tab "Libros" | Feed de libros carga. Cursor de películas preservado |
| 3 | Hacer 5 swipes en libros | Swipes registrados con `contentType: "book"` |
| 4 | Volver a tab Películas | Feed de películas continúa desde donde estaba |

---

## Casos Borde

### CB-01: Feed agotado

**Descripción:** El usuario ha swipeado todo el contenido disponible en un tipo.

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Hacer swipe en todos los ítems del catálogo (usar datos de prueba con pocos ítems) | |
| 2 | `GET /api/feed` devuelve array vacío `[]` | Pantalla "No hay más contenido por ahora. Vuelve mañana" (sin crash) |
| 3 | Evento `feed_exhausted` disparado | Log de analítica correcto |

---

### CB-02: Watch providers vacíos

**Descripción:** Una película no tiene datos de streaming en TMDB.

| Resultado esperado |
|---|
| DetailSheet muestra "Disponibilidad no disponible" |
| NO se muestra información inventada |
| Campo `watchProviders: []` en la respuesta de GET /api/content/:id |

---

### CB-03: Eliminar ítem de colección

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | En Biblioteca, swipe izquierdo sobre un ítem | Botón "Eliminar" rojo aparece |
| 2 | Click "Eliminar" | DELETE /api/collections/:id → 204 |
| 3 | Ítem desaparece de la lista | Sin crash. Resto de ítems intactos |

---

### CB-04: Token expirado durante sesión

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Usuario tiene sesión activa | App funcionando |
| 2 | Token Firebase expira (1 hora) | Firebase Auth auto-refresca el token |
| 3 | Si el refresh falla (sesión revocada) | Redirección a `/login` con mensaje "Sesión expirada" |

---

### CB-05: Offline — colección disponible

| Paso | Acción | Resultado esperado |
|---|---|---|
| 1 | Usuario abre la app con conexión | 10 ítems de colección cacheados por Service Worker |
| 2 | Desconectar red (DevTools → Offline) | |
| 3 | Navegar a Biblioteca | Últimos 10 ítems de colección visibles (cache del SW) |
| 4 | Intentar hacer swipe | Mensaje "Sin conexión. El swipe se registrará cuando vuelvas" |

---

### CB-06: Campos requeridos faltantes en POST /api/swipe

| Request | Resultado esperado |
|---|---|
| `{}` (body vacío) | 400 Bad Request, mensaje claro |
| `{"contentId": "abc"}` (sin action) | 400 Bad Request |
| `{"contentId": "abc", "action": "love"}` (action inválida) | 400 Bad Request |

---

## Colección Postman / Bruno

**Archivo:** `docs/api-collection.json`  
**Responsable:** [[Sprint-1/13-Ulises-Chaparro|Ulises Chaparro]]

| Request | Endpoint | Variables |
|---|---|---|
| Get Feed (movies) | GET /api/feed | `type=movie` |
| Get Feed (books) | GET /api/feed | `type=book` |
| Swipe Like | POST /api/swipe | `action=like` |
| Swipe Dislike | POST /api/swipe | `action=dislike` |
| Get Content | GET /api/content/:id | `id={{contentId}}` |
| Get Collections | GET /api/collections | — |
| Create Collection | POST /api/collections | body completo |
| Update Collection | PATCH /api/collections/:id | `personalNote` |
| Delete Collection | DELETE /api/collections/:id | `id={{collectionId}}` |

---

## Verificación de eventos de analítica

| Evento | Cuándo verificar | Cómo verificar |
|---|---|---|
| `onboarding_completed` | Después de HP-01 paso 6 | Firebase DebugView o console.log |
| `swipe` (with action, type) | HP-01 pasos 8-9 | Console log en desarrollo |
| `feed_exhausted` | CB-01 paso 2 | Console log |
| `detail_opened` | HP-01 paso 10 | Console log |
| `content_saved` | HP-01 paso 12 | Console log |
| `note_added` | HP-01 paso 14 | Console log |

---

## Criterios de aprobación del QA Gate

La entrega del MVP **no puede proceder** si:

- [ ] Cualquier happy path (HP-01, HP-02) falla
- [ ] Hay crash de la app en cualquier caso borde
- [ ] LCP > 2.5s en Chrome DevTools (4G simulada)
- [ ] La atribución de TMDB no aparece en DetailSheet de películas
- [ ] Se muestran datos inventados de streaming (watchProviders falsos)
- [ ] POST /api/swipe devuelve algo distinto a 204
- [ ] La app no funciona en pantalla de 375px (iPhone SE)

Ver gates automáticos en [[06_QA_Validation/CI_QA_Gates|CI QA Gates]].
