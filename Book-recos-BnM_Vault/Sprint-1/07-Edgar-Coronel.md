# Sprint 1 — Edgar Coronel Navarrete
**Nivel:** Bajo | **Épica:** 3 | **Wave:** 🟡 2 (puede iniciar con mocks desde Wave 1)

---

## 🎯 Tu misión

Construir el componente visual más visto de toda la app: la **tarjeta de contenido** (`ContentCard`). Es lo que el usuario ve al hacer swipe — la portada, el título, el género, la calificación y la sinopsis. Todo el stack de swipe depende de que este componente exista.

**Entrega el miércoles 10 jun:**
- Componente `<ContentCard />` con cover, title, genres, rating y synopsis
- Animación de entrada fluida
- Props bien tipadas
- Pantalla de prueba con datos mock (no depende de la API real para presentar)

---

## 📥 Lo que necesitas (inputs)

| Input | Fuente | Cuándo estará listo |
|---|---|---|
| Rutas protegidas del frontend | **[[02-Andres-Gonzalez\|Andrés González]]** | Wave 1 |
| Datos reales de la API | **[[04-Luis-Tellez\|Luis Téllez]]** | Wave 2 |

> 💡 **Puedes empezar ahora** con datos hardcodeados. Solo necesitas la estructura del objeto para definir las props. Reemplaza los mocks con la API cuando Luis termine.

---

## 📤 Lo que entregas (outputs — el equipo lo espera)

- ✅ **[[10-Monserrat-Miranda|Monserrat]]** necesita `<ContentCard />` para componer el `<SwipeDeck />`
- ✅ **[[11-Marina-Garcia|Marina]]** usa los mismos datos en el `<DetailSheet />`

---

## 🧪 Mock mínimo para empezar

Usa estos datos mientras la API real no esté disponible. El mock estándar del proyecto vive en `frontend/src/__mocks__/feed.mock.js`:

```javascript
// frontend/src/__mocks__/feed.mock.js
// Estructura EXACTA que devuelve GET /api/feed — no inventar campos distintos
export const MOCK_FEED_ITEMS = [
  {
    contentId: "mock-movie-001",
    title: "Interstellar",
    cover: "https://placehold.co/300x450/1a1a2e/ffffff?text=Interstellar",
    genres: ["Sci-Fi", "Aventura", "Drama"],
    rating: 8.6,
    synopsis: "Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en busca de un nuevo hogar para la humanidad.",
    type: "movie"
  },
  {
    contentId: "mock-movie-002",
    title: "The Dark Knight",
    cover: "https://placehold.co/300x450/1a1a2e/ffffff?text=Dark+Knight",
    genres: ["Acción", "Crimen", "Drama"],
    rating: 9.0,
    synopsis: "El Caballero Oscuro se enfrenta al Joker, un criminal anárquico que siembra el caos en Gotham.",
    type: "movie"
  },
  {
    contentId: "mock-book-001",
    title: "Sapiens",
    cover: "https://placehold.co/300x450/2d1b69/ffffff?text=Sapiens",
    genres: ["Historia", "Ciencia"],
    rating: 8.8,
    synopsis: "Una breve historia de la humanidad desde los primeros humanos hasta el mundo moderno.",
    type: "book"
  },
  {
    contentId: "mock-book-002",
    title: "El Hobbit",
    cover: "https://placehold.co/300x450/2d1b69/ffffff?text=El+Hobbit",
    genres: ["Fantasía", "Aventura"],
    rating: 9.1,
    synopsis: "Bilbo Bolsón, un hobbit tranquilo, es arrastrado a una aventura épica con un grupo de enanos.",
    type: "book"
  }
]
```

> **Importante:** Crear este archivo en `frontend/src/__mocks__/feed.mock.js`. Todos los colaboradores de frontend usan el mismo mock para garantizar consistencia. No inventar estructuras distintas.

---

## 🤖 Prompt para Claude Code

> Copia y pega esto en tu terminal de Claude Code desde la raíz del repo:

```
⚠️ ANTES DE EMPEZAR: Lee Sprint-1/contexts/07-Edgar-agent-context.md — define qué archivos puedes tocar.

Necesito crear el componente ContentCard para el proyecto Recos-BnM.
Stack: React (Vite), frontend en frontend/src/.
La app es mobile-first (PWA), priorizar diseño táctil y visual atractivo.

ESTRUCTURA del objeto de datos (viene del GET /api/feed):
  contentId: string
  title: string
  cover: string (URL de imagen, ej. https://image.tmdb.org/t/p/w500/abc.jpg)
  genres: array de strings (ej. ["Acción", "Drama"])
  rating: number (0-10, mostrar con 1 decimal)
  synopsis: string (puede ser larga, truncar a 3 líneas con "ver más")
  type: "movie" | "book"

TAREA 1 — frontend/src/components/ContentCard.jsx
Crear un componente <ContentCard /> que reciba las props anteriores y muestre:

Diseño visual:
- Tarjeta de altura completa (mínimo 75vh), bordes redondeados (16px)
- Imagen de portada (cover) ocupando la parte superior (~60% de la tarjeta)
  - Si cover es null/undefined → mostrar placeholder con gradiente y el título
- Badge de tipo en esquina superior derecha: "🎬 Película" o "📚 Libro"
- Sobre la imagen, gradiente oscuro en la parte inferior para que el texto sea legible
- Título en bold, grande (24px), blanco, sobre el gradiente
- Géneros como chips/tags pequeños (máx 3 géneros, +N si hay más)
- Rating: ⭐ + número con 1 decimal (ej. "⭐ 8.4")
- Synopsis truncada a 3 líneas con CSS (-webkit-line-clamp: 3)

Props:
  contentId, title, cover, genres, rating, synopsis, type
  onClick: función llamada al tocar la tarjeta (para abrir DetailSheet)

Animación:
- Al montar el componente, entrada suave con CSS: opacity 0→1 y translateY(20px)→0
- Duración 200ms, easing ease-out

TAREA 2 — frontend/src/pages/MockFeed.jsx (pantalla de prueba)
Crear una página con 3-4 ContentCards con datos hardcodeados:
  - 2 películas con datos de TMDB (Interstellar, The Dark Knight)
  - 2 libros con datos de Google Books (cualquiera)
Esta página es solo para desarrollo; acceder en la ruta /mock-feed.

TAREA 3 — Estilos
Usar CSS modules (ContentCard.module.css) o Tailwind si ya está configurado.
Si no hay Tailwind, usar CSS modules.
El diseño debe verse bien en pantallas de 375px de ancho (iPhone SE).

Muéstrame un screenshot visual del componente usando datos mock al terminar 
(o describe exactamente cómo se ve cada sección).

TAREA FINAL — DevLog (OBLIGATORIO, no omitir)
Antes de terminar esta sesión, crea el archivo DevLog/YYYY-MM-DD-edgar-content-card.md con:
---
project: "Recos-BnM"
date: "YYYY-MM-DD"
author_human: "Edgar Coronel Navarrete"
agent: "[Claude Code | Codex | Gemini | Cursor | Manual]"
model: "[ej. claude-sonnet-4-6]"
session_duration: "[estimado]"
tags: [devlog, sprint-1, wave-2]
---
Secciones: ## Qué se hizo / ## 🤖 Sesión de IA (agente, archivos, decisiones autónomas, correcciones) / ## Bloqueantes / ## Próximos pasos para el siguiente colaborador
IMPORTANTE: Confirmar que el mock estándar está en frontend/src/__mocks__/feed.mock.js y que ContentCard es standalone (no importa contextos).
Luego agrega la entrada a DevLog/DevLog_Index.md en la tabla.
```

---

## ✅ Checklist de entrega

- [x] `frontend/src/components/ContentCard.jsx` — todas las props
- [x] `frontend/src/components/ContentCard.module.css` — estilos
- [x] Placeholder cuando no hay imagen
- [x] Rating con ⭐ y 1 decimal
- [x] Synopsis truncada a 3 líneas
- [x] Animación de entrada (200ms)
- [x] `frontend/src/pages/MockFeed.jsx` — 4 tarjetas de prueba
- [x] Se ve bien en 375px de ancho

---

## 🚀 Fase 2 — Rol PM + Pantalla About (Jun 13–15, 2026)

> **Como PM**, tu misión en Fase 2 es coordinar el deploy del POC 1 y construir la pantalla "About" requerida por la licencia de TMDB (P3 Fase 2).

### 🎯 Tu misión Fase 2

**Prioridad 0 — Coordinación deploy POC 1 (Jueves 12 jun):**

1. Confirmar con Germán que los GitHub Secrets están configurados (7 secrets)
2. Confirmar con Israel que `firebase deploy --only firestore:rules,firestore:indexes` fue exitoso
3. Confirmar con Manuel que el ingest corrió en producción (≥500 docs en `content`)
4. Hacer push a `main` para activar el CI/CD y obtener la URL de Firebase Hosting
5. Confirmar la URL con todo el equipo antes del viernes

**Tarea 1 — Seguridad: mover auditorías al Vault (MEDIUM-05):**

```bash
# Mover los reportes de seguridad del .gitignore al Vault
# 1. Editar .gitignore — eliminar estas líneas si existen:
#    docs/SECURITY-AUDIT-*.md
#    docs/REMEDIATION-PLAN-*.md
# 2. Verificar que los archivos ya están en Book-recos-BnM_Vault/09_Risk_Governance/
# 3. Si no existen, moverlos: docs/SECURITY-AUDIT-2026-06-10.md → Vault/09_Risk_Governance/
```

**Tarea 2 — Pantalla About con atribución TMDB (Fase 2 P3):**

Crear `frontend/src/pages/About.jsx` con la atribución requerida por la licencia de TMDB y el equipo del proyecto.

```javascript
// frontend/src/pages/About.jsx
export default function About() {
  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Acerca de Recos BnM
      </h1>
      
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Equipo</h2>
        <p>Desarrollado por el equipo de Recos BnM — ITAM 2026.</p>
      </section>
      
      <section style={{ marginBottom: '24px', padding: '16px', 
                        backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Atribución de datos</h2>
        
        {/* Logo TMDB — imagen oficial requerida por licencia */}
        <img 
          src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207ac81b7ee3f432b435d95160de.svg"
          alt="The Movie Database (TMDB)"
          style={{ width: '120px', marginBottom: '8px' }}
        />
        <p style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Los datos de películas, calificaciones y disponibilidad de streaming son proporcionados por 
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"> The Movie Database (TMDB)</a>.
        </p>
      </section>
      
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Datos de libros</h2>
        <p style={{ fontSize: '13px', color: '#555' }}>
          Los datos de libros son proporcionados por la 
          <a href="https://books.google.com" target="_blank" rel="noopener noreferrer"> Google Books API</a>.
        </p>
      </section>
    </div>
  )
}
```

> ⚠️ La ruta `/about` debe registrarse en `App.jsx` (es tuyo según CLAUDE.md). Agregar:
> ```javascript
> <Route path="/about" element={<About />} />
> ```

**Tarea 3 — Agregar acceso a "About" desde BottomNav (coordinación con Diana):**

Diana creó `BottomNav.jsx`. Pedirle que agregue un ícono "ℹ️" o "?" que navegue a `/about`. O bien agregarla como enlace en el footer de la pantalla de Login.

**Tarea 4 — Preparar deck de demo para el Dr.:**

Asegurarse de que la demo del Lunes cubra:
1. Registro + onboarding (Fase 1)
2. Feed con scoring real de TMDB (Fase 1)
3. Swipe + biblioteca (Fase 1)
4. Feed con afinidad histórica después de 10+ swipes (Fase 2)
5. Compartir lista (Fase 2)
6. Pantalla About con atribución TMDB (Fase 2 P3)

### 🤖 Prompt Fase 2 para Claude Code

```
Proyecto: Recos-BnM. Soy Edgar Coronel, PM. Tengo acceso a frontend/src/pages/ y frontend/src/components/.

TAREA 1 — Crear frontend/src/pages/About.jsx
Pantalla de créditos y atribuciones con:
- Logo oficial de TMDB (imagen de themoviedb.org)
- Texto de atribución requerido: "This product uses the TMDB API but is not endorsed or certified by TMDB"
- Link a themoviedb.org
- Mención de Google Books API
- Nombres del equipo (lista simple)
- Diseño limpio, mobile-first, sin librerías externas

TAREA 2 — Agregar ruta /about en frontend/src/App.jsx
Importar About y agregar <Route path="/about" element={<About />} />
La ruta NO necesita ser protegida (acceso público, sin login).

TAREA 3 — Verificar .gitignore
Leer el .gitignore en la raíz del repo. Si hay líneas como "docs/SECURITY-AUDIT*" o "docs/REMEDIATION*",
reportarme el contenido exacto para que yo decida si eliminarlas.
No modificar .gitignore sin mi confirmación.
```

### ✅ Checklist Fase 2

- [ ] Deploy POC 1 coordinado — URL de Firebase Hosting confirmada con el equipo
- [x] `frontend/src/pages/About.jsx` — logo TMDB + atribución completa *(hecho 2026-06-11)*
- [x] `frontend/src/pages/About.module.css` — estilos mobile-first *(hecho 2026-06-11)*
- [ ] Ruta `/about` registrada en `App.jsx` — **pendiente: Andrés González** (ver snippet abajo)
- [x] `.gitignore` actualizado — patrones glob para auditorías futuras *(hecho 2026-06-11)*
- [x] Auditorías movidas al Vault `09_Risk_Governance/` — MEDIUM-05 cerrado *(hecho 2026-06-11)*
- [ ] Tab "Acerca" en `BottomNav.jsx` — **pendiente: Diana Álvarez** (opcional, ver snippet abajo)
- [ ] Deck de demo preparado con los 6 puntos de demostración

---

## 📋 Estado Phase 2 — 2026-06-11

### Lo que Edgar completó esta sesión

| Tarea                     | Archivo                                             | Estado  |
| ------------------------- | --------------------------------------------------- | ------- |
| Mover auditorías al Vault | `09_Risk_Governance/SECURITY-AUDIT-2026-06-10.md`   | ✅ Hecho |
| Mover plan de remediación | `09_Risk_Governance/REMEDIATION-PLAN-2026-06-10.md` | ✅ Hecho |
| Actualizar `.gitignore`   | `.gitignore` raíz — glob patterns                   | ✅ Hecho |
| Crear pantalla About      | `frontend/src/pages/About.jsx`                      | ✅ Hecho |
| Estilos About             | `frontend/src/pages/About.module.css`               | ✅ Hecho |
| DevLog Phase 2            | `DevLog/2026-06-11-edgar-phase2.md`                 | ✅ Hecho |

### Lo que está pendiente y quién lo necesita hacer

#### 🔴 Bloqueante para completar Phase 2 de Edgar

**→ Andrés González** debe agregar la ruta `/about` en `frontend/src/App.jsx`:

```javascript
// 1. Agregar import al inicio del archivo:
import About from './pages/About'

// 2. Agregar ruta ANTES del catch-all "*":
<Route path="/about" element={<About />} />
// IMPORTANTE: NO usar ProtectedRoute — es acceso público (requerido por licencia TMDB)
```

> ⚠️ Sin este cambio, la pantalla About.jsx existe pero no es accesible desde ninguna URL.

---

#### 🟡 Opcional para mejorar la experiencia

**→ Diana Álvarez** puede agregar el acceso a About desde `frontend/src/components/BottomNav.jsx`:

```javascript
// En el array TABS, agregar al final:
{ path: '/about', label: 'Acerca', icon: 'ℹ️' },
```

Alternativa sin modificar BottomNav: Edgar puede coordinar que el link a `/about` aparezca en el footer de `Login.jsx`.

---

#### 🔴 Blockers del POC 1 que Edgar debe confirmar (Deadline: Jue 12 Jun)

| Persona | Tarea | Estado a confirmar |
|---------|-------|-------------------|
| **Andrés** | Instalar `helmet` + `express-rate-limit` en backend | ¿Commiteado? |
| **Germán** | Agregar job `deploy-backend` a `.github/workflows/deploy.yml` | ¿En su rama? |
| **Germán** | Configurar 7 GitHub Secrets en Settings → Actions | ¿Configurados? |
| **Israel** | `firebase deploy --only firestore:rules,firestore:indexes` | ¿Ejecutado en prod? |
| **Manuel** | Re-ejecutar ingest con campo `titleLower` en colección `content` | ¿≥500 docs? |

> **Acción de Edgar:** Enviar mensaje al equipo el Jue 12 Jun AM solicitando confirmación de cada punto antes de hacer el push final a `main` que activa el deploy del POC 1.
