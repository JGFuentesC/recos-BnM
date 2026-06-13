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

- [x] `frontend/src/pages/Library.jsx` — lista con filtros tipo y listName
- [x] `frontend/src/components/CollectionItem.jsx` — nota editable inline
- [x] `PATCH /api/collections/:id` al editar nota (con toast confirmación)
- [x] `DELETE /api/collections/:id` con confirmación previa
- [x] Modal "Nueva lista" funcional
- [x] `frontend/src/components/BottomNav.jsx` — acceso en 1 tap
- [x] Estado vacío cuando no hay ítems
- [x] Reemplazar mocks con `GET /api/collections` real cuando esté disponible

---

## 🚀 Fase 2 — Listas Compartibles UI + Búsqueda en BottomNav (Jun 13–15, 2026)

> **Feature P2 de Fase 2:** Agregar el botón "Compartir lista" en Library.jsx que usa el endpoint de Christian. También agregar el ícono de búsqueda en BottomNav para Juan Carlos.

### 🎯 Tu misión Fase 2

**Tarea 1 — Botón "Compartir lista" en Library.jsx:**

En `frontend/src/pages/Library.jsx`, agregar botón de compartir junto a cada lista en el filtro de listName.

```javascript
// En Library.jsx — dentro del componente de filtro de listas o junto al nombre de cada lista
const handleShareList = async (listName) => {
  // Obtener el collectionId de cualquier ítem de la lista
  const listItem = collections.find(c => c.listName === listName)
  if (!listItem) return
  
  try {
    const token = await currentUser.getIdToken()
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/collections/${listItem.collectionId}/share`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    if (!res.ok) throw new Error('Error al compartir')
    
    const { shareUrl } = await res.json()
    
    // Intentar Web Share API primero, luego copiar al portapapeles
    if (navigator.share) {
      await navigator.share({ title: listName, url: shareUrl })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      // Mostrar toast "¡Link copiado!"
      setToast('¡Link copiado!')
    }
  } catch (err) {
    setToast('No se pudo compartir la lista')
  }
}
```

Agregar en el JSX de cada lista un ícono de compartir `↗`:
```jsx
{/* Junto a cada chip de listName en el filtro */}
<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  <span>{listName}</span>
  <button
    onClick={(e) => { e.stopPropagation(); handleShareList(listName) }}
    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
    title="Compartir lista"
  >
    ↗
  </button>
</div>
```

**Tarea 2 — Agregar ícono de búsqueda en BottomNav.jsx:**

Juan Carlos Macías creó `Search.jsx` y necesita que el buscador sea accesible desde la barra inferior. Actualizar `BottomNav.jsx`:

```javascript
// frontend/src/components/BottomNav.jsx — agregar tab de búsqueda
const tabs = [
  { path: '/feed',    icon: '🃏', label: 'Descubrir' },
  { path: '/search',  icon: '🔍', label: 'Buscar' },     // NUEVO Fase 2
  { path: '/library', icon: '📚', label: 'Biblioteca' },
  { path: '/profile', icon: '👤', label: 'Perfil' }
]
```

**Tarea 3 — Pantalla `/shared/:shareToken` (ver lista compartida):**

Crear `frontend/src/pages/SharedList.jsx` para que cualquier persona (sin login) pueda ver una lista compartida:

```javascript
// frontend/src/pages/SharedList.jsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function SharedList() {
  const { shareToken }           = useParams()
  const [item,    setItem]       = useState(null)
  const [loading, setLoading]    = useState(true)
  const [error,   setError]      = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/collections/share/${shareToken}`)
      .then(r => r.ok ? r.json() : Promise.reject('No encontrado'))
      .then(setItem)
      .catch(() => setError('Esta lista no existe o ya no está disponible.'))
      .finally(() => setLoading(false))
  }, [shareToken])

  if (loading) return <p style={{ textAlign:'center', padding:'40px' }}>Cargando lista...</p>
  if (error)   return <p style={{ textAlign:'center', padding:'40px', color:'#e53e3e' }}>{error}</p>

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '16px' }}>
        Lista compartida: {item.listName}
      </h1>
      <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '12px' }}>
        <p><strong>Tipo:</strong> {item.contentType === 'movie' ? '🎬 Película' : '📚 Libro'}</p>
        {item.personalNote && <p style={{ color: '#666', fontStyle: 'italic' }}>"{item.personalNote}"</p>}
        <p style={{ fontSize: '12px', color: '#999' }}>
          Guardado el {new Date(item.savedAt).toLocaleDateString('es-MX')}
        </p>
      </div>
      <p style={{ textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '13px' }}>
        Descubre más en <a href="/" style={{ color: '#ff571a' }}>Recos BnM</a>
      </p>
    </div>
  )
}
```

> La ruta `/shared/:shareToken` va en `App.jsx` (Edgar la agrega — es su archivo).

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Diana Álvarez, responsable de Library.jsx, CollectionItem.jsx y BottomNav.jsx.

CONTEXTO: Christian Ruiz ya tiene el endpoint POST /api/collections/:id/share que devuelve { shareToken, shareUrl }.
Ya existe useAuth() con currentUser. La variable de entorno VITE_API_URL tiene la URL del backend.

TAREA 1 — Agregar función handleShareList en Library.jsx
- Función async que recibe un listName
- Busca en el array de collections un ítem con ese listName para obtener su collectionId
- Llama a POST ${VITE_API_URL}/api/collections/${collectionId}/share con Bearer token
- Recibe { shareUrl } del response
- Si navigator.share disponible → navigator.share({ title: listName, url: shareUrl })
- Si no → navigator.clipboard.writeText(shareUrl) + mostrar toast "¡Link copiado!"
- Mostrar toast de error si falla

TAREA 2 — Agregar botón ↗ junto a cada chip de listName en el filtro de listas
En Library.jsx, donde se muestran los chips de listName (filtro), envolver cada chip en un div flex
con el nombre de la lista y un botón ↗ que llame a handleShareList(listName).
El botón ↗ tiene style: background none, border none, cursor pointer, fontSize 14px.
Usar e.stopPropagation() para que el click en ↗ no active el filtro de la lista.

TAREA 3 — Actualizar BottomNav.jsx
Agregar un cuarto tab "🔍 Buscar" con path="/search" entre "Descubrir" y "Biblioteca".
El tab activo se detecta con useLocation() de react-router-dom.

TAREA 4 — Crear frontend/src/pages/SharedList.jsx
Página pública (sin ProtectedRoute) que:
- Lee el :shareToken de useParams()
- Hace fetch a GET ${VITE_API_URL}/api/collections/share/${shareToken} (sin token de auth)
- Muestra: listName, contentType (con emoji), personalNote (si existe), savedAt formateado
- Estado de carga y estado de error amigables
- Link a / al final para invitar al usuario a descargar la app
```

---

## 🧪 QA Physical Testing — Tu asignación (Jun 13–15, 2026)

> **Eres parte del equipo de QA/Testing.** Cubres la Biblioteca, Tab Selector, CI/CD y GCP. Para las secciones de GCP necesitarás acceso a Firebase Console y Google Cloud Console.

### 📋 Tus secciones asignadas: 26 casos

---

#### Sección 3 — HU2.1 Tab Selector (5 casos: T-01 a T-05)

```
☑ T-01: Llegar a /feed → Tab Selector visible con "🎬 Películas" y "📚 Libros"
☑ T-02: Estado inicial → tab "Películas" activo: fondo naranja #ff571a, texto blanco
☑ T-03: Presionar "Libros" → tab Libros se activa (naranja), SwipeDeck se reinicia con tipo book
☑ T-04: Hacer 3 swipes en Libros → cambiar a Películas → SwipeDeck se reinicia completamente
☑ T-05: Cambiar entre tabs varias veces rápido → sin crash, cada cambio reinicia el deck
```

---

#### Sección 7 — HU5.1 Biblioteca / Colecciones (6 casos: B-01 a B-06)

**Prerequisito:** Guardar al menos 1 ítem desde el DetailSheet (caso D-09).

```
☑ B-01: Navegar a /library autenticado → pantalla de biblioteca con ítems guardados
☑ B-02: GET /api/collections?userId={uid} con token → HTTP 200, array de colecciones del usuario
☑ B-03: POST /api/collections con body válido → HTTP 201, doc creado en Firestore
☑ B-04: POST /api/collections con mismo contentId dos veces → HTTP 409 (anti-duplicados)
☑ B-05: PATCH /api/collections/{id} con {"personalNote":"Mi nota"} → HTTP 200, campo actualizado
☑ B-06: DELETE /api/collections/{id} → HTTP 204, doc eliminado de Firestore
```

---

#### Sección 11 — CI/CD Pipeline (5 casos: CI-01 a CI-05)

**Prerequisito:** Acceso al repositorio en GitHub y al pipeline de Actions.

```
☑ CI-01: Abrir cualquier PR activo en GitHub → pipeline "CI/CD Pipeline Recos-BnM" aparece ejecutándose
☑ CI-02: Verificar job backend-ingest-tests → logs muestran pytest ingest/tests/ en verde
☑ CI-03: Verificar job frontend-build-deploy → build de Vite exitoso sin errores
☑ CI-04: Verificar que deploy a Firebase Hosting solo ocurre en push a main (no en PRs)
☐ CI-05: Verificar URL de Firebase Hosting tras push a main → refleja cambios en <3 minutos — ❌ FALLA: BUG-001 git exit code 128
```

---

#### Sección 13 — GCP Infrastructure (10 casos: GCP-01 a GCP-10)

**Acceso requerido:** [Firebase Console](https://console.firebase.google.com) + [GCP Console](https://console.cloud.google.com)

```
☐ GCP-01: Firebase Console → Authentication → Sign-in method → Email/Password y Google habilitados
☐ GCP-02: Firebase Console → Firestore Database → existen 4 colecciones: users, content, swipes, collections
☐ GCP-03: Firestore → Indexes → Composite → índice "type + genres" en estado Enabled
☐ GCP-04: Firestore → Rules → reglas publicadas (NO en modo allow read,write: if true)
☐ GCP-05: Firestore → colección content → al menos 20 docs con campos: contentId, title, cover, genres, rating, synopsis, type, score
☐ GCP-06: GCP Console → Cloud Run → servicio recos-bnm-api → estado OK, GET /health → {"ok":true}
☐ GCP-07: Cloud Run → servicio → Variables → FIREBASE_PROJECT_ID configurada
☐ GCP-08: Firebase Console → Hosting → URL activa tipo recos-bnm.web.app, estado Released
☐ GCP-09: GCP Console → Cloud Scheduler → job ingest con cron "0 4 * * *", estado Enabled
☐ GCP-10: GCP Console → Cloud Run Jobs → job de ingest desplegado, último run sin errores críticos
```

---

### 📝 Cómo registrar bugs

```
| BUG-XXX | NEW | Sección 13 GCP | GCP-06 | [descripción] | Alta | — | Diana |
```

### ✅ Checklist QA Diana + Fase 2

- [x] Sección 3 Tab Selector: 5/5 casos ejecutados
- [x] Sección 7 Biblioteca: 6/6 casos ejecutados
- [ ] Sección 11 CI/CD: 5/5 casos ejecutados — 4/5 completos, CI-05 bloqueado por BUG-001
- [ ] Sección 13 GCP: 10/10 casos ejecutados
- [x] **Fase 2:** `handleShareList` en `Library.jsx` con botón ↗
- [x] **Fase 2:** `BottomNav.jsx` con tab "🔍 Buscar" para Juan Carlos
- [x] **Fase 2:** `SharedList.jsx` creado para ver listas compartidas
- [ ] Bugs registrados en §14, resumen en §15A
