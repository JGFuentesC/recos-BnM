# Sprint 1 — Diana Álvarez Varela
**Nivel:** Bajo | **Épica:** 5 | **Wave:** 🔵 4 (después de Monserrat + Christian + Héctor)

---

## 🎯 Tu misión

Construir la **biblioteca personal del usuario**: la vista donde puede ver todo lo que guardó, filtrar por tipo o lista, editar notas personales y crear listas personalizadas. Es el destino final de lo que el usuario guarda al swipear.

**Entrega el miércoles 10 jun:**
- Vista de biblioteca accesible en 1 paso desde la barra inferior
- Filtros por tipo (`movie`/`book`) y por `listName`
- Cada ítem: cover, title, savedAt, nota personal editable
- Crear nueva lista personalizada

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| `GET /api/collections` | **[[06-Christian-Ruiz\|Christian Ruiz]]** ✅ confirmado 2026-06-05 | Wave 2 |
| `PATCH /api/collections/{id}` | **[[06-Christian-Ruiz\|Christian Ruiz]]** | Wave 2 |
| `POST /api/collections` | **[[06-Christian-Ruiz\|Christian Ruiz]]** | Wave 2 |
| Auth token (currentUser) | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Swipes de Monserrat (generan ítems) | **[[10-Monserrat-Miranda\|Monserrat Miranda]]** | Wave 3 |

---

## ✅ RESUELTO — `GET /api/collections` asignado a Christian

`GET /api/collections` está asignado a [[06-Christian-Ruiz|Christian Ruiz]] (confirmado el 2026-06-05).
Christian tiene el CRUD completo: GET + POST + PATCH + DELETE de `/api/collections`.

Mientras Christian termina (Wave 2), construye tu vista con datos mock — el prompt abajo los incluye.
Cuando Christian haga merge de su PR, reemplaza los mocks con la llamada real.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/12-Diana-agent-context.md — define qué archivos puedes tocar.

Necesito crear la vista de Biblioteca para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/.
La app es mobile-first (PWA). Ya existen:
  - GET /api/collections?userId=&type=&listName= (endpoint en construcción — usar mock hasta que esté listo)
  - PATCH /api/collections/:id (body: { personalNote, listName })
  - POST /api/collections (body: { userId, contentId, contentType, listName, personalNote })
  - useAuth() en frontend/src/contexts/AuthContext.jsx

Estructura del objeto de colección:
  collectionId: string
  contentId: string
  contentType: "movie" | "book"
  listName: string
  personalNote: string
  savedAt: timestamp (Firestore Timestamp o ISO string)
  (Para mostrar la portada e info, necesitas el contentId para lookup — 
   usar los datos que ya vienen en la colección si el backend los incluye, 
   o hacer GET /api/content/{id} si no)

TAREA 1 — frontend/src/pages/Library.jsx (vista principal de Biblioteca)

Diseño (mobile-first):
  - Header: "Mi Biblioteca" + icono
  - Barra de filtros horizontal con scroll:
    - Filtro tipo: chips "Todos", "🎬 Películas", "📚 Libros"
    - Filtro lista: chips con los nombres de listas del usuario + botón "Nueva lista +"
  - Lista de ítems (ver Tarea 2)
  - Estado vacío: "No tienes nada guardado aún. ¡Empieza a hacer swipe!"

Carga de datos:
  - Al montar: llamar a GET /api/collections?userId={uid}
    con header Authorization: Bearer {token}
  - Mientras llega: usar este mock de 4 ítems:
    [
      { collectionId: "1", contentId: "tt1375666", contentType: "movie", 
        listName: "Guardados", personalNote: "", savedAt: "2026-06-03T10:00:00Z",
        title: "Inception", cover: "https://via.placeholder.com/100x150", genres: ["Acción"] },
      { collectionId: "2", contentId: "tt0468569", contentType: "movie",
        listName: "Para el finde", personalNote: "La quiero ver el sábado",
        savedAt: "2026-06-02T15:00:00Z", title: "The Dark Knight", 
        cover: "https://via.placeholder.com/100x150", genres: ["Drama"] },
      { collectionId: "3", contentId: "book123", contentType: "book",
        listName: "Guardados", personalNote: "", savedAt: "2026-06-01T09:00:00Z",
        title: "Sapiens", cover: "https://via.placeholder.com/100x150", genres: ["Historia"] },
      { collectionId: "4", contentId: "book456", contentType: "book",
        listName: "Guardados", personalNote: "Muy recomendado por Andrés",
        savedAt: "2026-05-30T20:00:00Z", title: "El Hobbit",
        cover: "https://via.placeholder.com/100x150", genres: ["Fantasía"] }
    ]
  - Los filtros de tipo y listName se aplican en el frontend sobre los datos ya cargados

TAREA 2 — frontend/src/components/CollectionItem.jsx
Componente para cada ítem de la colección:

Diseño:
  - Fila horizontal: portada pequeña (60x90px) a la izquierda
  - A la derecha: título en bold, tipo (🎬 o 📚), géneros chip pequeño, savedAt (fecha relativa)
  - Nota personal editable: si tiene nota → mostrarla en gris italic; si no → "Añadir nota..."
  - Al tocar la nota → campo de texto inline editable
    Al salir del campo (onBlur) → llamar a PATCH /api/collections/{id} con { personalNote }
    Mostrar toast "Nota guardada" al éxito
  - Menú de opciones (3 puntos ⋮) → opciones:
    - "Mover a lista..." → mostrar selector de listas existentes del usuario
      Al seleccionar → PATCH /api/collections/{id} con { listName }
    - "Eliminar" → confirmación "¿Eliminar de tu biblioteca?" → DELETE /api/collections/{id}

TAREA 3 — Modal "Nueva lista"
Botón "Nueva lista +" en el filtro de listas:
  - Abre un input modal pequeño: "Nombre de tu nueva lista"
  - Al confirmar: la nueva lista aparece en el filtro (se guarda en local; 
    el backend la crea automáticamente al guardar el primer ítem con ese listName)

TAREA 4 — Navegación desde barra inferior
En frontend/src/components/BottomNav.jsx (crear si no existe):
  - 3 tabs: "Descubrir" (ícono barajas), "Biblioteca" (ícono libro), "Perfil" (ícono persona)
  - Tab "Biblioteca" navega a /library
  - Accesible en 1 tap desde cualquier pantalla

TAREA 5 — Entregar componentes standalone (NO modificar App.jsx)
⚠️ App.jsx es de Andrés González — NO lo toques.
  - Andrés ya tiene la ruta /library pre-registrada en App.jsx
  - <BottomNav /> es standalone — notifica a Andrés cuando esté lista para que la integre en el layout
  - Tu entrega: Library.jsx, CollectionItem.jsx y BottomNav.jsx como componentes independientes

Muéstrame la vista con los datos mock y cómo se ve la edición de nota inline.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-diana-biblioteca.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Diana Álvarez Varela"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-4]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: NO modificaste App.jsx (Andrés ya tiene la ruta /library). BottomNav.jsx es standalone — coordinar con Andrés para integrarlo en el layout.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/pages/Library.jsx` — lista con filtros tipo y listName
- [ ] `frontend/src/components/CollectionItem.jsx` — nota editable inline
- [ ] `PATCH /api/collections/:id` al editar nota (con toast confirmación)
- [ ] `DELETE /api/collections/:id` con confirmación previa
- [ ] Modal "Nueva lista" funcional
- [ ] `frontend/src/components/BottomNav.jsx` — acceso en 1 tap
- [ ] Estado vacío cuando no hay ítems
- [ ] Reemplazar mocks con `GET /api/collections` real cuando esté disponible
