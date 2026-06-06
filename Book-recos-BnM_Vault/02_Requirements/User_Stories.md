---
project: "Recos-BnM"
owner: "Eduardo Coronel (PM)"
status: "Approved"
version: "1.0"
last_reviewed: "2026-06-04"
milestone: "MVP"
source_of_truth: true
tags: [requirements, user-stories, epics]
---

# User Stories — Recos-BnM

> Épicas e historias de usuario del MVP. Fuente: PRD §7.  
> → Regresa al [[00_Start_Here/PROJECT_INDEX|Índice del Proyecto]]

---

## Resumen de épicas

| Épica | Nombre | Prioridad | Responsable(s) |
|---|---|---|---|
| [[02_Requirements/User_Stories#épica-1|Épica 1]] | Registro y calibración inicial | P1 | [[Sprint-1/02-Andres-Gonzalez\|Andrés]], [[Sprint-1/08-Juan-Carlos-Macias\|Juan Carlos]] |
| [[02_Requirements/User_Stories#épica-2|Épica 2]] | Selección y filtrado de contenido | P2 | [[Sprint-1/08-Juan-Carlos-Macias\|Juan Carlos]] |
| [[02_Requirements/User_Stories#épica-3|Épica 3]] | Recomendación y mecánica de swipe | P3 | [[Sprint-1/04-Luis-Tellez\|Luis]], [[Sprint-1/10-Monserrat-Miranda\|Monserrat]] |
| [[02_Requirements/User_Stories#épica-4|Épica 4]] | Vista de detalle | P4 | [[Sprint-1/11-Marina-Garcia\|Marina]], [[Sprint-1/05-Hector-Morales\|Héctor]] |
| [[02_Requirements/User_Stories#épica-5|Épica 5]] | Colecciones y listas | P5 | [[Sprint-1/12-Diana-Alvarez\|Diana]], [[Sprint-1/06-Christian-Ruiz\|Christian]] |

---

## Épica 1 — Registro y calibración inicial (P1)

> **Dolor que resuelve:** onboarding largo, exceso de datos pedidos, géneros poco representativos.

### HU1.1 — Registro simplificado (Email + Google)

- **Como** usuario nuevo, **quiero** registrarme con mi email o con Google en máximo 2 clics, **para** entrar rápido y de forma segura sin formularios complicados.

**Criterios de aceptación:**
- [ ] Máximo 2 clics con Google Auth (Select Account → App)
- [ ] Validación de formato de email en tiempo real
- [ ] Mensaje de error claro si el email ya está registrado
- [ ] Éxito → redirección automática a calibración de perfil (onboarding)
- [ ] Token de Firebase Auth válido almacenado en el cliente

**Tareas técnicas:**
1. Activar proveedores Email y Google en Firebase Authentication Console
2. Componentes UI responsivos: `<Login />` y `<Register />`
3. Inicializar Firebase SDK en frontend (`firebase/config.js`)
4. Crear documento en colección `users` al primer registro
5. `ProtectedRoute` que redirige a `/login` si no hay sesión activa

**Responsable:** [[Sprint-1/02-Andres-Gonzalez|Andrés González]] (Wave 1)

---

### HU1.2 — Calibración por swipe (cold start)

- **Como** usuario recién registrado, **quiero** un onboarding de 5–10 tarjetas más selección simple de géneros, **para** que la app entienda mis gustos sin llenar formularios aburridos.

**Criterios de aceptación:**
- [ ] Máximo 10 tarjetas secuenciales de calibración
- [ ] Pueden saltarse (no es obligatorio hacer swipe en todas)
- [ ] Buscador predictivo de autores/directores favoritos (opcional, no bloqueante)
- [ ] Al terminar se marca `prefs.cold_start_done = true` en Firestore
- [ ] Barra de progreso visible durante el onboarding
- [ ] No se puede acceder al feed principal sin completar (o saltarse) el onboarding

**Tareas técnicas:**
1. Componente `<Onboarding />` con barra de progreso y lógica de salto
2. Buscador predictivo contra endpoints TMDB/Google Books en backend
3. Persistir `users/{userId}/prefs` con géneros, autores y `cold_start_done: true`

**Responsable:** [[Sprint-1/08-Juan-Carlos-Macias|Juan Carlos Macías]] (Wave 2)

---

## Épica 2 — Selección y filtrado de contenido (P2)

> **Dolor que resuelve:** falta de indicador del tipo de contenido activo, confusión al cambiar entre feeds.

### HU2.1 — Conmutador de tipo (Tab Selector)

- **Como** usuario, **quiero** alternar entre "Películas" y "Libros" desde un control visible en la pantalla principal, **para** consumir el tipo de contenido que me apetezca en cada momento sin perder mi progreso.

**Criterios de aceptación:**
- [ ] Tab Selector visible y de alta accesibilidad (mínimo 44x44px touch target)
- [ ] Indicador visual claro del modo activo (color de acento `--color-accent` o icono distinto)
- [ ] Al cambiar de pestaña NO se pierde el estado del feed actual (el cursor se preserva)
- [ ] Estado del feed gestionado en `FeedContext` global

**Tareas técnicas:**
1. Componente `<TabSelector />` con estados `movies` / `books`
2. `FeedContext` con `active_feed` global
3. Navbar/tabs persistente que no se destruye al navegar

**Responsable:** [[Sprint-1/08-Juan-Carlos-Macias|Juan Carlos Macías]] (Wave 2)

---

## Épica 3 — Recomendación y mecánica de swipe (P3)

> **Dolor que resuelve:** tarjetas con poca información, contenido repetido, feed que se agota.

### HU3.1 — Algoritmo de arranque (popularidad + contenido)

- **Como** sistema, **debo** ordenar el feed mezclando TMDB y Google Books filtrando por los géneros del usuario y priorizando alta popularidad y calificación, **para** dar buenas recomendaciones desde el primer uso (sin historial).

**Criterios de aceptación:**
- [ ] Las primeras 20 tarjetas pertenecen al top de los géneros seleccionados por el usuario
- [ ] Nunca se muestra contenido ya swipeado (like o dislike)
- [ ] Score normalizado aplicado: `score = 0.7 * norm(popularity) + 0.3 * norm(rating)`
- [ ] Para usuarios con >100 swipes: aplicar señal de afinidad histórica (+peso a géneros con mayor ratio de like)

**Score normalizado:**
```
score = 0.7 × norm(popularity) + 0.3 × norm(rating)
norm(x) = (x − min) / (max − min)   // sobre el conjunto candidato
```

**Tareas técnicas:**
1. `GET /api/feed` con parámetros `userId`, `type`, `cursor`
2. Leer colección `content` filtrada por géneros del usuario
3. Restar IDs presentes en `swipes` del userId
4. Calcular score normalizado en el backend
5. Paginación por cursor para feeds largos

**Responsable:** [[Sprint-1/04-Luis-Tellez|Luis Téllez]] (Wave 2)

---

### HU3.2 — Feed interactivo con swipe

- **Como** usuario, **quiero** tarjetas con portada, título, género, descripción breve y calificación, y hacer swipe a la derecha (like) o izquierda (no me interesa), **para** descubrir contenido de forma rápida e intuitiva.

**Criterios de aceptación:**
- [ ] Gestos táctiles nativos con animación fluida (≥60 FPS)
- [ ] Tarjeta muestra: portada (60% del alto), título, géneros como chips, rating ⭐, sinopsis 3 líneas truncadas
- [ ] Pre-carga asíncrona: cuando quedan 5 tarjetas en el stack, disparar `GET /api/feed` silencioso
- [ ] Cada swipe dispara `POST /api/swipe` de forma no bloqueante (fire and forget)
- [ ] Swipe derecha = like (verde), swipe izquierda = dislike (rojo), colores visibles durante el gesto

**Tareas técnicas:**
1. Librería de gestos: `react-tinder-card` o Framer Motion custom
2. Pre-fetching al llegar a 5 tarjetas
3. `POST /api/swipe` → 204, no bloqueante
4. `<ContentCard />` — 75vh, cover 60%, animación de entrada 200ms

**Responsables:** [[Sprint-1/10-Monserrat-Miranda|Monserrat Miranda]] (SwipeDeck, Wave 3) + [[Sprint-1/07-Edgar-Coronel|Edgar Coronel]] (ContentCard, Wave 3)

---

## Épica 4 — Vista de detalle (P4)

> **Dolor que resuelve:** exceso de info en la tarjeta, no saber dónde ver la película.

### HU4.1 — Vista expandida equilibrada

- **Como** usuario, **quiero** tocar una tarjeta para ver sinopsis completa, director/autor, año, género y plataformas de streaming disponibles, **para** evaluar con calma si me interesa antes de guardar.

**Criterios de aceptación:**
- [ ] Transición tipo modal slide-up (300ms ease-out) que NO destruye el stack de tarjetas inferior
- [ ] Muestra: portada grande, sinopsis completa, director/autor, año, género(s), calificación, watch providers (o placeholder neutro)
- [ ] Tres botones flotantes: "Guardar" (💾), "No me interesa" (✗), "Compartir" (📤)
- [ ] "Compartir" usa Web Share API nativa del navegador
- [ ] Para películas: atribución TMDB visible (`"This product uses the TMDB API..."`)
- [ ] Si no hay dato de streaming: mostrar "Disponibilidad no disponible" (nunca inventar)

**Tareas técnicas:**
1. Componente `<DetailSheet />` slide-up expandible
2. Consumir `GET /api/content/{id}` para datos completos
3. Renderizar `watchProviders` de la respuesta; placeholder si está vacío
4. Web Share API para el botón Compartir
5. Mostrar campo `attribution` cuando `source === "tmdb"`

**Responsables:** [[Sprint-1/11-Marina-Garcia|Marina García]] (DetailSheet, Wave 3) + [[Sprint-1/05-Hector-Morales|Héctor Morales]] (`GET /api/content/{id}`, Wave 2)

---

## Épica 5 — Colecciones y listas (P5)

> **Dolor que resuelve:** colecciones desordenadas, olvido del motivo de guardado, listas difíciles de encontrar.

### HU5.1 — Guardado clasificado + listas personalizadas

- **Como** usuario, **quiero** que al guardar un título (swipe derecha o botón "Guardar") se organice automáticamente por tipo (Películas / Libros) con la fecha, y poder crear listas propias como "Para el finde", **para** retomar el consumo y controlar mi catálogo personal.

**Criterios de aceptación:**
- [ ] "Mi Colección" accesible en 1 tap desde la barra de navegación inferior
- [ ] Títulos separados por tipo (Películas / Libros) por defecto
- [ ] Cada elemento permite añadir una "Nota personal" editable inline
- [ ] Se pueden crear listas con nombre personalizado
- [ ] Se puede filtrar por tipo y por lista
- [ ] Elementos de la colección disponibles offline (últimos 10 vía Service Worker)

**Tareas técnicas:**
1. Modelo `collections/{collectionId}` en Firestore (ver [[03_Architecture/Data_Model|Data Model]])
2. Vista de biblioteca con filtros por tipo y lista
3. CRUD endpoints: `GET`, `POST`, `PATCH`, `DELETE` `/api/collections`
4. Inline note editing en `<CollectionItem />`
5. Service Worker cachea últimos 10 ítems

**Responsables:** [[Sprint-1/12-Diana-Alvarez|Diana Álvarez]] (Library view, Wave 4) + [[Sprint-1/06-Christian-Ruiz|Christian Ruiz]] (CRUD API, Wave 2)

---

## Fuera de alcance del MVP

- Recomendación con ML / collaborative filtering
- Matching social entre usuarios o funciones de amistad
- Disponibilidad de streaming en tiempo real verificada por región
- Notificaciones push
- Pagos o monetización
- App nativa iOS/Android (solo PWA)
- Reseñas de usuarios dentro de la app
- Rating propio del usuario (solo like/dislike)
