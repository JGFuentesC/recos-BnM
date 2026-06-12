# Sprint 1 — Ulises Chaparro Ximello
**Nivel:** Bajo | **Épica:** QA / §10 | **Wave:** ⚪ 5 (último — cuando las APIs y el deploy estén listos)

---

## 🎯 Tu misión

Eres el **guardián de calidad**: verificar que el happy path completo funciona de punta a punta, documentar todos los endpoints con ejemplos reales, y escribir el ROADMAP del proyecto para el Dr. Tu trabajo es la última línea antes de la demo.

**Entrega el miércoles 10 jun:**
- Suite de pruebas manuales: happy path completo + casos borde
- Colección Postman/Bruno con los 7 endpoints del PRD §8 (requests + ejemplos de respuesta)
- Verificación de los eventos de analítica del PRD §10
- `docs/ROADMAP.md` con las 3 fases del PRD §13

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| `GET /api/feed` y `POST /api/swipe` | **[[04-Luis-Tellez\|Luis Téllez]]** | Wave 2 |
| `GET /api/content/{id}` | **[[05-Hector-Morales\|Héctor Morales]]** | Wave 2 |
| `POST/PATCH/DELETE /api/collections` | **[[06-Christian-Ruiz\|Christian Ruiz]]** | Wave 2 |
| App desplegada en Hosting | **[[09-German-Pacheco\|Germán Pacheco]]** | Wave 2 |

> ⏸️ **Espera a que los endpoints estén listos** antes de hacer pruebas reales. Mientras tanto, escribe los casos de prueba y el ROADMAP.

---

## 📋 Cómo hacer tus tareas (paso a paso)

### Parte A — Colección Postman/Bruno (herramienta de testing de APIs)

Esta parte sí puede hacerla Claude Code. Ver el prompt al final.

---

### Parte B — Suite de pruebas manuales

Ejecutar estos casos manualmente en la app desplegada (URL de Germán):

#### Happy Path (el flujo principal que debería funcionar perfecto):
1. Ir a la URL de la app → debe mostrar pantalla de Login
2. Registrarse con un email nuevo → debe redirigir a Onboarding
3. Seleccionar ≥1 género → tocar Continuar
4. Hacer swipe en las 5 tarjetas del onboarding (alternar like/dislike)
5. Llegar al Feed → verificar que hay tarjetas visibles
6. Hacer swipe derecha en una tarjeta → verificar que avanza a la siguiente
7. Tocar una tarjeta → verificar que abre el DetailSheet con info completa
8. Tocar "Guardar" en el DetailSheet → verificar toast "¡Guardado!"
9. Ir a Biblioteca (barra inferior) → verificar que el ítem guardado aparece

**Registrar en la hoja de pruebas:** ✅ Pass / ❌ Fail / 🟡 Parcial + descripción del bug

---

#### Casos borde (situaciones límite que pueden romper cosas):

| Caso | Cómo probarlo | Resultado esperado |
|---|---|---|
| Feed agotado | Swipear rápido todo el contenido disponible | Mensaje "¡Has visto todo!" + botón para cargar más |
| Contenido ya swipeado | Hacer like, recargar app, verificar que no reaparece | El mismo ítem NO debe volver a aparecer |
| Sin watchProviders | Tocar una tarjeta de libro (books no tienen streaming) | DetailSheet muestra "No hay información de streaming" |
| Token expirado | Dejar la app abierta 1+ hora y luego intentar swipear | Debe reconectar automáticamente o pedir re-login |
| Offline | Activar modo avión → abrir app | Debe mostrar la shell y los últimos 10 ítems de la colección (Service Worker) |
| Sin internet en DetailSheet | Abrir detalle con modo avión activo | Mensaje de error amigable, no crash |

---

#### Eventos de analítica (PRD §10)
Para verificar, abrir las DevTools del navegador (F12) → pestaña Console o Network:

| Evento | Cuándo debería dispararse | Cómo verificar |
|---|---|---|
| `onboarding_completed` | Al terminar el onboarding | Buscar en Console o Firebase Analytics |
| `swipe` (con action + type) | En cada swipe | Buscar llamada a POST /api/swipe en Network |
| `feed_exhausted` | Cuando se acaban las tarjetas | Buscar en Console |
| `detail_opened` | Al tocar una tarjeta | Buscar en Console |
| `content_saved` | Al tocar "Guardar" | Buscar llamada a POST /api/collections en Network |
| `list_created` | Al crear nueva lista | Buscar en Console |
| `note_added` | Al guardar una nota | Buscar llamada a PATCH en Network |

---

### Parte C — `docs/ROADMAP.md`

Escribir este archivo a mano basándote en el PRD §13. Contenido:

```markdown
# ROADMAP — Recos-BnM

## Fase 1: MVP (Sprint 1 — Junio 2026)
[Describir las épicas 1-5 en 2-3 líneas]

## Fase 2: Mejoras de engagement (por planificar)
[Señal de afinidad histórica, listas compartibles, notificaciones push]

## Fase 3: Personalización avanzada (por planificar)
[ML / collaborative filtering, streaming por región, monetización]
```

---

## 🤖 Prompt para Claude Code

> Usa esto para generar la colección Postman/Bruno y el archivo de ROADMAP:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/13-Ulises-agent-context.md — define qué archivos puedes tocar.

Necesito crear dos entregables de documentación y QA para el proyecto Recos-BnM.

CONTEXTO del proyecto:
  - Backend en Cloud Run: https://<URL-del-backend>/api
  - Los endpoints requieren header: Authorization: Bearer <firebase-id-token>
  - Para obtener un token de prueba: hacer login en la app y copiar el token del header de cualquier request en DevTools Network

TAREA 1 — docs/api-collection.json (colección Postman/Bruno)
Crear un archivo JSON compatible con Postman Collection v2.1 con los siguientes 7 requests:

1. GET /api/feed
   - Query params: userId={{userId}}, type=movie, cursor=
   - Header: Authorization: Bearer {{token}}
   - Descripción: "Obtiene feed de películas paginado para el usuario"
   - Ejemplo de respuesta esperada: array de [{contentId, title, cover, genres, rating, synopsis}]

2. POST /api/swipe
   - Body JSON: { "userId": "{{userId}}", "contentId": "{{contentId}}", "contentType": "movie", "action": "like" }
   - Header: Authorization: Bearer {{token}}
   - Descripción: "Registra un swipe like/dislike"
   - Respuesta esperada: 204 No Content

3. GET /api/content/:id
   - Param: id = {{contentId}}
   - Header: Authorization: Bearer {{token}}
   - Descripción: "Obtiene detalle completo con watchProviders"
   - Ejemplo de respuesta esperada: objeto content completo

4. GET /api/collections
   - Query params: userId={{userId}}, type= (opcional), listName= (opcional)
   - Header: Authorization: Bearer {{token}}
   - Descripción: "Lista las colecciones del usuario con filtros"
   - Nota en descripción: "Responsable: Christian Ruiz — confirmado 2026-06-05"

5. POST /api/collections
   - Body JSON: { "userId": "{{userId}}", "contentId": "{{contentId}}", "contentType": "movie", "listName": "Guardados", "personalNote": "" }
   - Header: Authorization: Bearer {{token}}
   - Respuesta esperada: 201 con { collectionId }

6. PATCH /api/collections/:id
   - Param: id = {{collectionId}}
   - Body JSON: { "personalNote": "Quiero verla este finde", "listName": "Para el finde" }
   - Respuesta esperada: 200 con objeto actualizado

7. DELETE /api/collections/:id
   - Param: id = {{collectionId}}
   - Respuesta esperada: 204 No Content

Incluir variables de entorno en la colección:
  baseUrl: https://<URL-del-backend>
  token: (a llenar manualmente con el token de Firebase)
  userId: (a llenar con el UID del usuario de prueba)
  contentId: (a llenar con un ID real de la colección content)
  collectionId: (a llenar después del POST /api/collections)

TAREA 2 — docs/ROADMAP.md
Crear el archivo con las 3 fases del PRD §13 en formato legible para el Dr.:

# ROADMAP — Recos-BnM: Tinder de Contenidos

## Estado actual
Fecha: Junio 2026 | Stack: Firebase + Cloud Run + Firestore | Estado: MVP en desarrollo

## Fase 1 — MVP (Sprint 1, Junio 2026)
Objetivo: Experiencia base de swipe funcional.
- Épica 1: Registro con Email y Google + calibración por swipe (onboarding)
- Épica 2: Selector de tipo Películas/Libros con feed independiente
- Épica 3: Feed de swipe con algoritmo popularidad + contenido (scoring normalizado)
- Épica 4: Vista de detalle con watchProviders (dónde ver la película)
- Épica 5: Biblioteca personal con listas y notas
North Star: Swipes calificados por usuario activo semanal

## Fase 2 — Mejoras de engagement (Q3 2026)
Objetivo: Retención y personalización con datos reales de uso.
- Señal de afinidad histórica: ajustar scoring según historial de likes del usuario
- Listas compartibles entre usuarios
- Notificaciones push de nuevos contenidos en géneros favoritos
Métricas objetivo: retención D7 ≥ 35%, swipes/sesión ≥ 40

## Fase 3 — Personalización avanzada (Q4 2026)
Objetivo: Recomendación inteligente y expansión.
- Recomendación con ML (collaborative filtering + embeddings)
- Disponibilidad de streaming verificada por región en tiempo real
- Funciones de monetización
Métricas objetivo: MAU 10,000+, costo infra < USD 5/1k usuarios activos

Generar ambos archivos en la carpeta docs/ del repo.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-ulises-qa.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Ulises Chaparro Ximello"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-5]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Resultado del happy path (Pass/Fail por step) / ## Bugs encontrados (con URLs de GitHub Issues)
IMPORTANTE: Solo creaste archivos en docs/. No modificaste ningún archivo de código fuente.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] **Suite manual ejecutada**: happy path completo sin bugs bloqueantes
- [ ] **Casos borde verificados**: feed agotado, offline, sin watchProviders
- [ ] **Eventos de analítica confirmados**: los 7 eventos del PRD §10
- [ ] `docs/api-collection.json` — colección Postman con los 7 endpoints
- [ ] `docs/ROADMAP.md` — 3 fases del PRD §13
- [ ] Bugs encontrados reportados como Issues en GitHub con label `bug` + `sprint-1`

---

## 🚀 Fase 2 — Coordinador QA + Colección Postman actualizada (Jun 13–15, 2026)

> **Eres el coordinador QA del equipo.** Tu misión en Fase 2 es recolectar los resultados de Héctor, Marina, Monserrat y Diana, consolidar los bugs, y actualizar la colección Postman con los nuevos endpoints de Fase 2.

### 🎯 Tu misión Fase 2

**Tarea 0 — Preparar hoja de bugs ANTES del POC 1 (Jueves 12 jun):**

En `PHYSICAL_TEST_VALIDATION.md` §14, preparar la tabla de bugs con las columnas estándar. Comunicar al equipo QA que registren bugs con este formato y que te avisen en el canal cuando agreguen uno nuevo.

**Tarea 1 — Actualizar colección Postman con endpoints de Fase 2:**

Agregar a `docs/Recos-BnM-API-Collection.json` los nuevos endpoints de Fase 2:

```
8. POST /api/collections/:id/share
   - Body: {} (vacío — solo necesita el token del dueño)
   - Header: Authorization: Bearer {{token}}
   - Descripción: "Genera un link público para compartir la colección"
   - Respuesta esperada: { shareToken: "abc123...", shareUrl: "https://recos-bnm.web.app/shared/abc123..." }

9. GET /api/collections/share/:shareToken
   - Param: shareToken = {{shareToken}} (sin auth — acceso público)
   - Descripción: "Obtiene una lista compartida públicamente (sin login)"
   - Respuesta esperada: { collectionId, listName, contentId, contentType, savedAt, personalNote }

10. DELETE /api/collections/:id/share
    - Param: id = {{collectionId}}
    - Header: Authorization: Bearer {{token}}
    - Descripción: "Revoca el acceso público a una lista compartida"
    - Respuesta esperada: 204 No Content

11. GET /api/search
    - Query params: q={{searchQuery}}, type={{type}} (opcional: movie|book)
    - Header: Authorization: Bearer {{token}}
    - Descripción: "Busca contenido por título, autor o director"
    - Respuesta esperada: array de { contentId, title, cover, type, genres, rating, synopsis }
```

**Tarea 2 — Consolidar resultados del POC 1 (Viernes 13 jun):**

Después de que el equipo QA ejecute las pruebas, completar la tabla §15A en `PHYSICAL_TEST_VALIDATION.md`:
- Recopilar los resultados de Héctor (secciones 0, 1, 8)
- Recopilar los resultados de Monserrat (secciones 2, 4, 5)
- Recopilar los resultados de Marina (secciones 6, 9, 10, 12)
- Recopilar los resultados de Diana (secciones 3, 7, 11, 13)

**Tarea 3 — Happy path de Fase 2 (Sábado 14 jun):**

Ejecutar estos casos adicionales de Fase 2:

```
Caso F2-01: Hacer ≥10 swipes de películas → ir al feed y verificar que las tarjetas priorizan géneros likeados
Caso F2-02: En /library, presionar ↗ junto a un listName → menú nativo de compartir (móvil) o "Link copiado" (desktop)
Caso F2-03: Abrir el URL compartido en browser SIN estar logueado → página /shared/:token muestra la lista
Caso F2-04: GET /api/collections/share/:token sin auth → HTTP 200 con datos de la lista
Caso F2-05: En /library, ir al tab de búsqueda (si BottomNav tiene ícono) → buscar "interstellar" → aparece resultado
Caso F2-06: GET /api/search?q=inter&type=movie con token → HTTP 200 con resultados
```

**Tarea 4 — Reporte final para el Lunes:**

Compilar `PHYSICAL_TEST_VALIDATION.md` §15B y §15C con:
- Total de bugs encontrados (Fase 1 + Fase 2)
- Bugs FIXED vs pendientes
- ¿App lista para entrega? (con observaciones)
- Firma de validación §16

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Ulises Chaparro, responsable de QA y documentación.

TAREA 1 — Actualizar docs/Recos-BnM-API-Collection.json
Agregar 4 nuevos endpoints a la colección Postman existente (mantener los 7 originales):

8. POST /api/collections/:id/share — genera shareToken (con auth)
9. GET /api/collections/share/:shareToken — acceso público (sin auth)
10. DELETE /api/collections/:id/share — revoca acceso público (con auth)
11. GET /api/search?q=&type= — búsqueda de contenido (con auth)

Usar las variables existentes: {{baseUrl}}, {{token}}, {{userId}}, {{collectionId}}
Agregar nueva variable: {{shareToken}} con valor "" (a llenar después del POST share)

TAREA 2 — Agregar casos de Fase 2 al docs/ROADMAP.md
En la sección "## Fase 2 — Mejoras de engagement (Q3 2026)", actualizar con los features ya implementados:
- ✅ Señal de afinidad histórica: scoring ajustado con like-ratio por género
- ✅ Listas compartibles: endpoint share + página /shared/:token
- ✅ Buscador de contenido: endpoint /api/search + página /search
- 🚧 Notificaciones push: FCM configurado (en progreso)
```

### ✅ Checklist Fase 2 — Ulises

- [ ] `docs/Recos-BnM-API-Collection.json` — 4 endpoints de Fase 2 agregados (total: 11)
- [ ] Tabla §14 de bugs preparada y comunicada al equipo QA
- [ ] Resultados consolidados de los 4 QA en §15A (después del POC 1)
- [ ] Casos F2-01 a F2-06 ejecutados el sábado
- [ ] `docs/ROADMAP.md` actualizado con status de Fase 2
- [ ] §15B y §15C completados con firma en §16
