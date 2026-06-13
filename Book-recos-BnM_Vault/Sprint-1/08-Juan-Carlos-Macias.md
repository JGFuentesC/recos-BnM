# Sprint 1 — Juan Carlos Macías Mayen
**Nivel:** Bajo | **Épicas:** 1–2 | **Wave:** 🟡 2 (puede iniciar con mocks desde Wave 1)

---

## 🎯 Tu misión

Construir la **primera experiencia del usuario**: el onboarding de swipe que captura sus gustos, y el selector de tipo (Películas/Libros) que aparece en todas las pantallas del feed. Son los primeros momentos que el usuario vive en la app.

**Entrega el miércoles 10 jun:**
- Componente de onboarding: barra de progreso, máximo 10 tarjetas saltables, selección de géneros/autores, marca `cold_start_done = true`
- Tab Selector Movies/Books con indicador visual del modo activo y estado global `active_feed`

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Auth y rutas protegidas | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Catálogo para tarjetas de onboarding | **[[03-Manuel-Serrania\|Manuel Serranía]]** | Wave 1 |

> 💡 **Puedes empezar con géneros hardcodeados** (lista fija de géneros para seleccionar) mientras Manuel termina el ingest. El onboarding no necesita datos reales para construirse.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[04-Luis-Tellez|Luis]]** necesita `users.prefs.genres` guardado para filtrar el feed
- ✅ **[[10-Monserrat-Miranda|Monserrat]]** necesita el Tab Selector para que SwipeDeck sepa si mostrar películas o libros

---

## 🧪 Mock mínimo para empezar

Para las 5 tarjetas del onboarding (paso 2 del flujo), usar el mock estándar del proyecto:

```javascript
// Importar desde frontend/src/__mocks__/feed.mock.js
// (Edgar crea este archivo — si no existe aún, créalo tú con la estructura de abajo)
import { MOCK_FEED_ITEMS } from '../__mocks__/feed.mock'

// Usar los primeros 5 items (o todos si hay menos de 5)
const onboardingCards = MOCK_FEED_ITEMS.slice(0, 5)
```

Para los géneros del Paso 1 (hardcoded mientras Manuel termina el ingest):
```javascript
const ONBOARDING_GENRES = [
  "Acción", "Drama", "Comedia", "Terror", "Romance",
  "Ciencia Ficción", "Misterio", "Documentales", "Fantasía",
  "Thriller", "Biografías", "Historia"
]
```

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/08-Juan-Carlos-agent-context.md — define qué archivos puedes tocar.

Necesito crear el flujo de onboarding y el Tab Selector para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/, Firebase Firestore (emulador localhost:8080 en dev).
La app es mobile-first (PWA). Ya existe AuthContext con useAuth() que da currentUser.

CONTEXTO del schema users/{userId}.prefs:
  genres: array de strings (géneros seleccionados)
  authors: array de strings (autores favoritos, opcional)
  directors: array de strings (directores favoritos, opcional)
  cold_start_done: boolean

TAREA 1 — frontend/src/pages/Onboarding.jsx
Flujo de onboarding en pasos:

Paso 1: Selección de géneros (pantalla de bienvenida)
  - Título: "¿Qué tipo de contenido te gusta?"
  - Grid de chips/tags con géneros: Acción, Drama, Comedia, Terror, Romance, 
    Ciencia Ficción, Misterio, Documentales, Fantasía, Thriller, Biografías, Historia
  - Selección múltiple (toggle al tocar), mínimo 1 selección para continuar
  - Botón "Continuar" deshabilitado si no hay selección

Paso 2: Swipe de calibración (5-10 tarjetas)
  - Mostrar 5 tarjetas de contenido (usar datos mock con géneros de los seleccionados en paso 1)
  - Cada tarjeta: cover + título + género (usar el componente ContentCard de Edgar si está listo,
    o una versión simplificada si no)
  - Botones "Me gusta 👍" y "No me interesa 👎" visibles debajo (además de swipe)
  - Barra de progreso en la parte superior: "2 de 5 tarjetas"
  - Botón "Saltar" en esquina superior derecha que saltea esta tarjeta
  - Al completar las 5 tarjetas → ir al Paso 3

Paso 3: Completar perfil (opcional)
  - Input de texto: "¿Algún autor favorito? (opcional)"
  - Input de texto: "¿Algún director favorito? (opcional)"
  - Botón "Empezar a descubrir →"

Al terminar el paso 3:
  - Guardar en Firestore users/{currentUser.uid}:
    prefs: { genres: [seleccionados], authors: [si los puso], directors: [si los puso], cold_start_done: true }
  - Redirigir a /feed

Animaciones: transición suave entre pasos (slide horizontal).

TAREA 2 — frontend/src/components/TabSelector.jsx
Componente de selección de tipo con estado global:

Diseño:
  - Dos tabs: "🎬 Películas" y "📚 Libros"
  - Tab activo: color de acento (azul o el color primario de la app), borde inferior visible
  - Tab inactivo: gris, sin borde
  - Transición suave (200ms) al cambiar de tab

Estado global:
  - Usar React Context o Zustand para el estado active_feed ("movie" | "book")
  - Crear frontend/src/contexts/FeedContext.jsx:
    - Estado: activeType ("movie" | "book"), defaulting a "movie"
    - Setter: setActiveType
    - Hook: useFeed()
  - TabSelector usa useFeed() para leer y cambiar el tipo activo
  - Al cambiar de tab NO se destruye el estado del feed actual (el feed se re-fetcha con el nuevo tipo)

TAREA 3 — Entregar componentes standalone (NO modificar App.jsx ni Feed.jsx)
⚠️ App.jsx es de Andrés González. Feed.jsx es de Monserrat Miranda. NO los toques.
Tu trabajo es entregar componentes standalone que otros integran:
  - <Onboarding /> es standalone → Andrés ya tiene la ruta /onboarding en App.jsx
  - <TabSelector /> es standalone → Monserrat lo importa en Feed.jsx
  - <FeedContext> / <FeedProvider> los crea tú → Andrés ya envuelve App con el Provider
Notifica a Andrés y a Monserrat cuando tus componentes estén listos para integrar.
Asegúrate de que FeedContext.jsx exporte: FeedProvider, useFeed().

Muéstrame la estructura de componentes al terminar y cómo probar el flujo completo.

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-juan-carlos-onboarding.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Juan Carlos Macías Mayen"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que TabSelector.jsx es standalone (no integrado en App.jsx ni Feed.jsx) y que FeedContext.jsx exporta useFeed() y FeedProvider.
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [ ] `frontend/src/pages/Onboarding.jsx` — 3 pasos completos
- [ ] Selección de géneros con toggle y mínimo 1 requerido
- [ ] Barra de progreso en paso 2
- [ ] `prefs.cold_start_done = true` guardado en Firestore al terminar
- [ ] `frontend/src/components/TabSelector.jsx` — 2 tabs con estado visual
- [ ] `frontend/src/contexts/FeedContext.jsx` — `active_feed` global
- [ ] Redirect a /feed al terminar onboarding
- [ ] Se ve bien en 375px de ancho

---

## 🚀 Fase 2 — Buscador de Contenido (Jun 13–15, 2026)

> **Feature P1 de Fase 2:** Buscador de contenido. Los usuarios podrán buscar directamente por título, autor o director en lugar de solo hacer swipe.

### 🎯 Tu misión Fase 2

**Tarea 1 — Pantalla `Search.jsx` (frontend del buscador):**

Crear `frontend/src/pages/Search.jsx`:

```javascript
// frontend/src/pages/Search.jsx
import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ContentCard from '../components/ContentCard'

export default function Search() {
  const { currentUser } = useAuth()
  const [query,   setQuery]   = useState('')
  const [type,    setType]    = useState('all')  // 'all' | 'movie' | 'book'
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const handleSearch = useCallback(async (q, t) => {
    if (!q || q.trim().length < 2) return
    setLoading(true)
    setError(null)
    
    try {
      const token = await currentUser.getIdToken()
      const params = new URLSearchParams({ q: q.trim() })
      if (t && t !== 'all') params.set('type', t)
      
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error('Error en búsqueda')
      setResults(await res.json())
    } catch (err) {
      setError('No se pudo realizar la búsqueda. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Barra de búsqueda */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="search"
          placeholder="Buscar película, libro, autor..."
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            if (e.target.value.length >= 2) handleSearch(e.target.value, type)
          }}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '24px',
                   border: '1px solid #ddd', fontSize: '16px' }}
        />
      </div>
      
      {/* Filtros de tipo */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['all', 'movie', 'book'].map(t => (
          <button
            key={t}
            onClick={() => { setType(t); handleSearch(query, t) }}
            style={{ padding: '6px 16px', borderRadius: '16px',
                     background: type === t ? '#ff571a' : '#f0f0f0',
                     color: type === t ? 'white' : '#333',
                     border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            {t === 'all' ? 'Todos' : t === 'movie' ? '🎬 Películas' : '📚 Libros'}
          </button>
        ))}
      </div>
      
      {/* Resultados */}
      {loading && <p style={{ textAlign: 'center', color: '#888' }}>Buscando...</p>}
      {error   && <p style={{ textAlign: 'center', color: '#e53e3e' }}>{error}</p>}
      {!loading && results.length === 0 && query.length >= 2 && (
        <p style={{ textAlign: 'center', color: '#888' }}>Sin resultados para "{query}"</p>
      )}
      
      <div style={{ display: 'grid', gap: '12px' }}>
        {results.map(item => (
          <ContentCard
            key={item.contentId}
            {...item}
            onClick={() => {/* integrar DetailSheet si está disponible */}}
          />
        ))}
      </div>
    </div>
  )
}
```

**Tarea 2 — Agregar ruta `/search` y tab de búsqueda:**

La ruta `/search` ya está registrada en `App.jsx` por Andrés. Verificar que está activa y que `BottomNav` la resalta correctamente al navegar a `/search`.

**Tarea 3 — Menú global: `AppLayout.jsx` con `BottomNav` en todas las pantallas (PRD requerimiento):**

> **Problema actual:** `BottomNav` solo aparece en `Library.jsx` (línea 346). `Feed.jsx` y tu `Search.jsx` no lo incluyen. El PRD (Screen Specs §BottomNav) exige que esté visible en **todas** las pantallas principales.

---

#### Cambio 1 — CREAR archivo nuevo: `frontend/src/components/AppLayout.jsx`

Este archivo no existe. Créalo con exactamente este contenido:

```jsx
import BottomNav from './BottomNav'

export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 72 }}>
      {children}
      <BottomNav />
    </div>
  )
}
```

> `BottomNav.jsx` ya existe en la misma carpeta (`frontend/src/components/`) — solo lo importas.

---

#### Cambio 2 — MODIFICAR `frontend/src/pages/Search.jsx` (tu archivo)

Hay que hacer **2 cambios** en el archivo:

**2a — Agregar el import en la línea 1** (después de los imports existentes):

```jsx
// Agregar esta línea después de la línea 2 (después del import de useAuth):
import AppLayout from '../components/AppLayout'
```

**2b — Envolver el return con `<AppLayout>`**

El `return` actual (línea 227) es:
```jsx
return (
  <div style={s.page}>
    ...
  </div>
)
```

Cámbialo a:
```jsx
return (
  <AppLayout>
    <div style={s.page}>
      ...
    </div>
  </AppLayout>
)
```

> El `paddingBottom: '80px'` que ya tiene `s.page` (línea 24) puede quedarse — no causa problema.

---

#### Cambio 3 — COORDINAR con Andrés González (él modifica `App.jsx`)

Mándale este mensaje con el snippet exacto:

> "Andrés, creé `AppLayout.jsx` en `frontend/src/components/`. Necesito que en `App.jsx` importes el componente y envuelvas las rutas de `/feed`, `/search` y `/library` así:"

```jsx
// Agregar este import junto a los demás imports de componentes:
import AppLayout from './components/AppLayout'

// Cambiar estas 3 rutas:
<Route path="/feed"    element={<ProtectedRoute><AppLayout><Feed /></AppLayout></ProtectedRoute>} />
<Route path="/search"  element={<ProtectedRoute><AppLayout><Search /></AppLayout></ProtectedRoute>} />
<Route path="/library" element={<ProtectedRoute><AppLayout><Library /></AppLayout></ProtectedRoute>} />
```

---

#### Cambio 4 — COORDINAR con Diana Álvarez (ella modifica `Library.jsx`)

Mándale este mensaje:

> "Diana, una vez que Andrés aplique `AppLayout` globalmente en `App.jsx`, el `BottomNav` va a aparecer duplicado en `/library` porque `Library.jsx` ya lo tiene en la línea 346. ¿Puedes eliminar esa línea `<BottomNav />` y el import de la línea 4 (`import BottomNav from '../components/BottomNav'`) cuando Andrés confirme que su cambio está en main?"

---

#### Verificación final antes del PR

Corre `npm run dev` y revisa en el navegador con pantalla de 375px:

- [ ] Navegar a `/search` → el BottomNav aparece fijo abajo
- [ ] El tab "Buscar" se resalta en naranja en `/search`
- [ ] El tab "Descubrir" se resalta en naranja en `/feed`
- [ ] El contenido no queda tapado por el BottomNav al scrollear

**Tarea 4 — Agregar `VITE_API_URL` al `.env.local`:**

```bash
# frontend/.env.local
VITE_API_URL=http://localhost:3001  # desarrollo
# En producción: URL de Cloud Run (Germán la confirma)
```

Verificar que `VITE_API_URL` está en GitHub Secrets como secret del workflow de CI.

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Juan Carlos Macías, responsable de Onboarding y TabSelector.

CONTEXTO: Luis Téllez va a crear backend/src/routes/search.js con el endpoint GET /api/search?q=&type=
La URL base del backend está en import.meta.env.VITE_API_URL.
Ya existe <ContentCard /> en frontend/src/components/ContentCard.jsx con props: contentId, title, cover, genres, rating, synopsis, type, onClick.
Ya existe useAuth() en frontend/src/contexts/AuthContext.jsx.

TAREA 1 — Crear frontend/src/pages/Search.jsx
Pantalla de búsqueda mobile-first con:
- Input de búsqueda (dispara búsqueda automáticamente cuando hay ≥2 caracteres, con debounce de 300ms)
- 3 chips de filtro tipo: "Todos" / "🎬 Películas" / "📚 Libros"
- Lista de resultados usando <ContentCard /> en formato compacto (altura ~120px, no 75vh)
- Estado vacío: "Busca una película, libro, autor o director"
- Estado sin resultados: "Sin resultados para '{query}'"
- Estado de carga: spinner o texto "Buscando..."
- Manejo de error: "No se pudo realizar la búsqueda"

El fetch va a GET ${import.meta.env.VITE_API_URL}/api/search con:
  - Header Authorization: Bearer {await currentUser.getIdToken()}
  - Query params: q={query} y type={type} (si no es 'all')

TAREA 2 — Agregar debounce al input de búsqueda
Usar un hook personalizado useDebounce(value, delay=300):
  - Solo dispara el fetch cuando el usuario deja de escribir por 300ms
  - Cancela la búsqueda anterior si el usuario sigue escribiendo

TAREA 3 — Registrar ruta /search en App.jsx
Agregar: <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
(Solo modificar App.jsx para agregar esta ruta)
```

### ✅ Checklist Fase 2

- [ ] `frontend/src/pages/Search.jsx` — búsqueda funcional con debounce
- [ ] Filtros de tipo: Todos / Películas / Libros
- [ ] Resultados usando `<ContentCard />` compacto
- [ ] Ruta `/search` activa y verificada en `App.jsx`
- [ ] `VITE_API_URL` en `.env.local` y coordinado con Germán para GitHub Secrets
- [ ] **NUEVO** `frontend/src/components/AppLayout.jsx` — wrapper con `<BottomNav />` y `paddingBottom: 72`
- [ ] **NUEVO** `Search.jsx` envuelto con `<AppLayout>` — BottomNav visible en pantalla de búsqueda
- [ ] **NUEVO** Coordinado con Andrés: `AppLayout` aplicado globalmente en `App.jsx` para `/feed`, `/search`, `/library`
- [ ] **NUEVO** Coordinado con Diana: `<BottomNav />` eliminado de `Library.jsx` (evitar duplicado)
- [ ] **NUEVO** Verificado en móvil 375px — tab activo resaltado según ruta, contenido no tapado

---

## 🔐 Seguridad — Auditoría y Corrección (Jun 14, 2026)

> **Tu área de ownership es:** `frontend/src/pages/Search.jsx`, `frontend/src/pages/Onboarding.jsx`, `frontend/src/components/TabSelector.jsx`, `frontend/src/contexts/FeedContext.jsx`
> Ejecuta esta auditoría el sábado ANTES de abrir el PR de Fase 2. Si encuentras algo, corrígelo en el mismo PR.

### Vulnerabilidades a revisar y testear

#### SEC-JC-01 — XSS en `Search.jsx` (Prioridad ALTA)

**Qué es:** Si los resultados de la API se renderizan usando `dangerouslySetInnerHTML` o concatenación de strings en el DOM, un atacante podría inyectar HTML/JS malicioso.

**Verificación:**
1. Busca en `Search.jsx` cualquier uso de `dangerouslySetInnerHTML`
2. Busca en `ContentCard.jsx` (Edgar) lo mismo
3. Verifica que los resultados se pasan como props al componente (no se insertan como HTML crudo)

```javascript
// ❌ PELIGROSO — nunca hacer esto:
<div dangerouslySetInnerHTML={{ __html: item.title }} />
<div dangerouslySetInnerHTML={{ __html: item.synopsis }} />

// ✅ CORRECTO — React escapa el contenido automáticamente:
<div>{item.title}</div>
<p>{item.synopsis}</p>
```

**Fix si encuentras `dangerouslySetInnerHTML`:**
Reemplazar por la versión con JSX directo. React escapa todo por defecto.

---

#### SEC-JC-02 — Rutas protegidas sin auth (Prioridad ALTA)

**Qué es:** `/search`, `/onboarding` y cualquier ruta que crees deben redirigir a `/login` si el usuario no está autenticado.

**Verificación** (hacerlo en el browser):
```
1. Cerrar sesión en la app (logout)
2. Navegar manualmente a:
   - /search       → debe redirigir a /login
   - /onboarding   → debe redirigir a /login
   - /feed         → debe redirigir a /login
3. Si CUALQUIERA carga sin estar logueado → brecha de seguridad
```

**Fix en App.jsx si alguna ruta no está protegida:**
```jsx
// Verificar que TODAS las rutas privadas usan <ProtectedRoute>
<Route path="/search"     element={<ProtectedRoute><Search /></ProtectedRoute>} />
<Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
// ⚠️ Coordinar con Andrés si necesitas que él haga el cambio en App.jsx
```

---

#### SEC-JC-03 — Datos sensibles en URL o LocalStorage (Prioridad MEDIA)

**Qué es:** El token de Firebase no debe aparecer en la URL ni guardarse en `localStorage` (es vulnerable a XSS). Firebase lo guarda automáticamente en `IndexedDB`.

**Verificación:**
```javascript
// Abrir DevTools → Application → Storage

// 1. Local Storage → buscar cualquier key que contenga "token", "uid", "user", "auth"
//    → Si hay algo → ES UN PROBLEMA

// 2. URL bar → asegurarse de que el query de búsqueda no incluye el token:
//    Correcto: /search (token va en el header Authorization, no en la URL)
//    Incorrecto: /search?token=eyJ...

// 3. Session Storage → mismo check que Local Storage
```

**Fix si encuentras tokens en localStorage:**
```javascript
// ❌ Nunca hacer esto:
localStorage.setItem('token', await currentUser.getIdToken())

// ✅ Correcto — obtener el token fresco en cada request:
const token = await currentUser.getIdToken()
fetch(url, { headers: { Authorization: `Bearer ${token}` } })
```

---

#### SEC-JC-04 — Input de búsqueda no expone datos de otros usuarios (Prioridad MEDIA)

**Qué es:** La pantalla de búsqueda no debe mostrar el historial de búsqueda de otros ni exponer IDs de usuarios en la URL.

**Verificación:**
```
1. Abre la app con el usuario A → busca "Harry Potter"
2. Copia la URL de la página de búsqueda
3. Cierra sesión → inicia sesión con usuario B
4. Pega la URL copiada
5. Esperado: la app muestra la pantalla vacía del buscador (no los resultados del usuario A)
6. Los resultados vienen de la API con el token del usuario activo, no de la URL
```

---

#### SEC-JC-05 — Dependencias del frontend con vulnerabilidades conocidas (Prioridad MEDIA)

**Verificación:**
```bash
cd frontend && npm audit --audit-level=high
# Si hay HIGH o CRITICAL → documentarlos y avisar a Andrés para que ejecute npm audit fix
```

**Nota:** La corrección la hace Andrés (dueño del setup de deps). Tu rol es detectar y reportar.

---

### 🤖 Prompt para Claude Code — Auditoría de seguridad frontend

```
Proyecto: Recos-BnM. Soy Juan Carlos Macías, dueño de:
- frontend/src/pages/Search.jsx (Fase 2, nuevo)
- frontend/src/pages/Onboarding.jsx
- frontend/src/components/TabSelector.jsx
- frontend/src/contexts/FeedContext.jsx

Necesito auditar vulnerabilidades de seguridad en mis componentes. Haz lo siguiente:

1. Lee Search.jsx y busca cualquier uso de dangerouslySetInnerHTML o concatenación de strings en el DOM (SEC-JC-01)
   - Si encuentras: reemplazar por JSX directo ({variable})

2. Lee Onboarding.jsx y FeedContext.jsx: verificar que no hay datos de usuario (uid, email, token) guardados en localStorage o sessionStorage (SEC-JC-03)

3. En Search.jsx: confirmar que el parámetro q de búsqueda NO aparece en la URL como query param (no debe ser /search?q=algo, la búsqueda es solo estado local de React) (SEC-JC-04)

4. Ejecuta: cd frontend && npm audit --audit-level=high
   - Documentar el output sin corregir (la corrección es de Andrés González)

5. Verificar en App.jsx que /search usa <ProtectedRoute> (solo verificar, no modificar si ya está correcto) (SEC-JC-02)

Por cada hallazgo: mostrar el código ANTES y DESPUÉS del fix (si aplica).
Generar mini reporte al final: hallazgos encontrados y estado (corregido / reportado a responsable).
No tocar App.jsx ni ContentCard.jsx (no son tuyos).
```

### ✅ Checklist Seguridad Juan Carlos

- [ ] SEC-JC-01: `Search.jsx` sin `dangerouslySetInnerHTML` — revisado visualmente ✓
- [ ] SEC-JC-02: `/search` y `/onboarding` redirigen a `/login` sin auth — probado en browser ✓
- [ ] SEC-JC-03: No hay tokens/uid en `localStorage` — revisado en DevTools → Application ✓
- [ ] SEC-JC-04: URL de búsqueda no expone query ni datos de sesión ✓
- [ ] SEC-JC-05: `npm audit` ejecutado — findings reportados a Andrés ✓
- [ ] DevLog actualizado con hallazgos de seguridad

---

## 🚀 Cómo abrir tu PR de Fase 2

> Ejecuta estos comandos desde la raíz del repo una vez que termines todos los cambios.

### Paso 1 — Asegúrate de estar en tu branch de Fase 2

```bash
# Si no tienes branch de Fase 2 todavía, créalo:
git checkout -b feat/jc-fase2

# Si ya tienes el branch, solo cámbiate a él:
git checkout feat/jc-fase2
```

### Paso 2 — Agrega tus archivos al commit

```bash
# Solo los archivos que son tuyos:
git add frontend/src/pages/Search.jsx
git add frontend/src/components/AppLayout.jsx
git add frontend/src/pages/Onboarding.jsx        # si lo modificaste
git add frontend/src/components/TabSelector.jsx   # si lo modificaste
git add frontend/src/contexts/FeedContext.jsx      # si lo modificaste

# Verifica qué estás por commitear:
git status
git diff --staged
```

### Paso 3 — Haz el commit

```bash
git commit -m "feat(jc): Search.jsx con debounce + AppLayout con BottomNav global"
```

### Paso 4 — Sube el branch y abre el PR

```bash
git push -u origin feat/jc-fase2
```

Luego en GitHub → [JGFuentesC/recos-BnM](https://github.com/JGFuentesC/recos-BnM/compare) → **Compare & pull request**

**Título del PR:**
```
feat(jc/fase2): Search.jsx + AppLayout con BottomNav global
```

**Descripción del PR (copiar y pegar):**
```
## Qué hace este PR

- `Search.jsx`: pantalla de búsqueda con debounce 300ms, filtros Todos/Películas/Libros, resultados con ContentCard
- `AppLayout.jsx`: wrapper que incluye BottomNav globalmente (paddingBottom: 72px para no tapar contenido)
- `Search.jsx` envuelto con AppLayout — BottomNav ya visible en /search

## Coordinación requerida (antes de merge)

- [ ] **Andrés González**: aplicar `<AppLayout>` en `App.jsx` para rutas `/feed`, `/search`, `/library`
- [ ] **Diana Álvarez**: eliminar `<BottomNav />` hardcodeado en `Library.jsx` una vez AppLayout sea global

## Cómo probar

1. `cd frontend && npm run dev`
2. Ir a `/search` → debe aparecer BottomNav abajo
3. Tab "Buscar" debe estar resaltado en naranja
4. Escribir ≥2 caracteres → búsqueda se dispara sola (esperar 300ms)
5. Filtros Todos / 🎬 Películas / 📚 Libros funcionan

## Archivos modificados

- `frontend/src/pages/Search.jsx`
- `frontend/src/components/AppLayout.jsx` (nuevo)
```

### Paso 5 — Asignar revisores

En el PR de GitHub, asignar como reviewer a:
- **edgarcoroneln** (PM — Edgar Coronel)
- **JGFuentesC** (repo owner)

---

> 💡 **Nota para el PM (Edgar):** Una vez que Juan Carlos abra el PR, coordinar con Andrés para el snippet de `App.jsx` y con Diana para el cleanup de `Library.jsx`. Esos dos cambios son los que completan el BottomNav global.
