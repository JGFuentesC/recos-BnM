**recos-BnM**

Tinder de Contenidos — Plan de Sprint

*Versión 5.0 · 13 integrantes · Tests integrados · Basado en PRD v2.0 (junio 2026)*

*Stack: Firebase Auth · Cloud Run · Firestore · Firebase Hosting (PWA) · TMDB · Google Books · TMDB Watch Providers*

*Tests: Vitest (frontend) · Jest (API) · pytest (ingest) · @firebase/rules-unit-testing · CI GitHub Actions*

**Sesión Dr.:** martes 10 jun 2025 | **Entrega final:** lunes 16 jun 2025

*Distribución: 3 Nivel Medio (Andrés, Manuel, Israel) → camino crítico. 10 Nivel Bajo → 1 componente o 1-2 endpoints + sus tests. Cada integrante es responsable de escribir los tests de su propio módulo. CI bloquea merge si tests fallan.*

# A. Distribución de trabajo — 13 integrantes

*Columna "Tests a escribir": cada integrante es responsable de los tests de su propio módulo. Germán configura el CI que los corre automáticamente. Ulises verifica que todos pasen antes de la entrega final.*

| **Integrante** | **Nivel** | **Épica** | **HUs (PRD §7)** | **Módulo** | **Entregable — miér 10 jun** | **Tests a escribir** | **Deps — Inputs/Outputs** | **Complejidad** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **González Habib, Andrés** | **Medio** | **Épica 1** | HU1.1 — Registro simplificado (Email + Google)  HU1.2 — Calibración por swipe: persistir prefs en users.prefs | Firebase Auth + middleware de autenticación en API | Login/registro con Email y Google. Rutas protegidas en React. Middleware auth.js en api/middleware/ que verifica Firebase ID Token. Documento users/{userId} creado al primer registro. | api/src/tests/auth.test.js — verifica que endpoints rechacen requests sin token válido (401). Verifica que token correcto permita acceso (200). | *OUTPUT → Firebase ID Token + middleware auth.js.*  *Todos los módulos dependen de este. Israel debe tener schema users listo.* | **Alta** |
| **Serranía Reinada, Manuel** | **Medio** | **Épica 3 / Infra** | HU3.1 — Ingesta de catálogo: job Cloud Run TMDB + Google Books → content  HU3.1 — Score normalizado: 0.7\*norm(popularity) + 0.3\*norm(rating) | Cloud Run ingest job + lógica de scoring (services/scoring.js) | tmdb\_ingest.py + books\_ingest.py en Cloud Run. ≥500 items en content con todos los campos del PRD §6. Cloud Scheduler cron 0 4 \* \* \*. scoring.js exportable para GET /api/feed. | ingest/tests/test\_tmdb\_ingest.py — valida campos requeridos, paginación, no duplicados.  ingest/tests/test\_scoring.py — valida fórmula score con casos conocidos. | *INPUT → Schema content de Israel (SCHEMA.md).*  *OUTPUT → content poblado + scoring.js. Luis, Héctor y Juan Carlos dependen de este.* | **Alta** |
| **Pérez García, Israel** | **Medio** | **Épica 1–5 / Infra** | HU1.1 — Colección users  HU3.1 — Colección content  HU3.2 — Colección swipes  HU5.1 — Colección collections | Schema Firestore + reglas de seguridad + índices | 4 colecciones con campos exactos del PRD §6. Reglas de seguridad del PRD §9 desplegadas. Índice compuesto (type + genres). SCHEMA.md. Firebase Emulator configurado. | firestore/tests/users.test.js — solo el propio userId puede leer/escribir.  firestore/tests/swipes.test.js — userId debe coincidir con auth.uid.  firestore/tests/collections.test.js — acceso solo al dueño.  firestore/tests/content.test.js — solo lectura para clientes autenticados; escritura solo desde ingest. | *OUTPUT → Schema, reglas e índices disponibles para todo el equipo.*  *Camino crítico: Andrés, Manuel, Luis, Héctor, Christian dependen de este.* | **Alta** |
| **Téllez Domínguez, Luis** | **Bajo** | **Épica 3** | HU3.1 — Endpoint GET /api/feed  HU3.2 — Endpoint POST /api/swipe | API Cloud Run — feed y registro de swipes | GET /api/feed: devuelve array ordenado por score, excluyendo swipes previos. POST /api/swipe: guarda acción en swipes/{swipeId}. HTTP 204. | api/src/tests/feed.test.js — score correcto, exclusión de swipeados, paginación por cursor.  api/src/tests/swipes.test.js — registro correcto en Firestore, campos requeridos. | *INPUT → middleware auth.js (Andrés), scoring.js (Manuel), schema (Israel).*  *OUTPUT → Endpoints consumidos por Monserrat (SwipeDeck).* | **Media** |
| **Morales Marbán, Héctor** | **Bajo** | **Épica 4–5** | HU4.1 — Endpoint GET /api/content/{id} con watchProviders  HU5.1 — Endpoint GET /api/collections | API Cloud Run — detalle de contenido y lectura de colecciones | GET /api/content/{id}: objeto content completo + watchProviders (placeholder neutro si no hay dato). GET /api/collections: array filtrado por userId, ?type, ?listName. | api/src/tests/content.test.js — campos completos, placeholder cuando no hay watchProviders.  api/src/tests/collections.test.js — filtros type y listName funcionan correctamente. | *INPUT → middleware auth.js (Andrés), content en Firestore (Manuel), schema (Israel).*  *OUTPUT → Consumidos por Marina (DetailSheet) y Diana (biblioteca).* | **Media** |
| **Ruiz Hurtado, Christian** | **Bajo** | **Épica 5** | HU5.1 — Endpoints CRUD /api/collections (POST, PATCH, DELETE) | API Cloud Run — escritura de colecciones | POST /api/collections: HTTP 201 + doc en Firestore. PATCH /api/collections/{id}: HTTP 200. DELETE /api/collections/{id}: HTTP 204. Mismo patrón de auth que Luis y Héctor. | api/src/tests/collections.test.js — POST crea doc correcto, PATCH actualiza solo campos permitidos, DELETE elimina y devuelve 204. | *INPUT → middleware auth.js (Andrés), schema collections (Israel), patrón de Luis.*  *OUTPUT → Consumidos por Marina (Guardar) y Diana (editar/borrar).* | **Media** |
| **Coronel Navarrete, Edgar** | **Bajo** | **Épica 3** | HU3.2 — Componente ContentCard: portada, título, género, descripción breve y calificación | UI — componente ContentCard | Componente <ContentCard /> con cover, title, genres, rating, synopsis breve. Animación de entrada fluida. Props bien tipadas. Mock data mientras Luis termina la API. | frontend/src/tests/ContentCard.test.jsx — renderiza correctamente con props completas, renderiza placeholder si falta cover, no rompe con props vacías. | *INPUT → Rutas protegidas (Andrés).*  *OUTPUT → Consumido por Monserrat (SwipeDeck) y Marina (DetailSheet).* | **Media** |
| **Miranda Olivas, Monserrat** | **Bajo** | **Épica 3** | HU3.2 — SwipeDeck: gestos táctiles, pre-fetching al quedar 5 tarjetas, POST /api/swipe no bloqueante | UI — SwipeDeck (mecánica de swipe) | <SwipeDeck /> con gestos touch/click ≈60 FPS. Pre-fetch al quedar 5 tarjetas. POST /api/swipe no bloqueante por cada acción. | frontend/src/tests/SwipeDeck.test.jsx — swipe derecha dispara like, swipe izquierda dispara dislike, pre-fetch se activa al quedar 5 tarjetas. | *INPUT → ContentCard (Edgar C.), GET /api/feed y POST /api/swipe (Luis), auth token (Andrés).*  *OUTPUT → Swipes en Firestore. Diana (likes en biblioteca).* | **Media** |
| **García del Buey, Marina** | **Bajo** | **Épica 4** | HU4.1 — Vista expandida: sinopsis, autor/director, año, género, watchProviders  HU4.1 — Tres acciones flotantes: Guardar, No me interesa, Compartir | UI — DetailSheet (pantalla de detalle) | Modal slide-up que no destruye el stack de swipe. Consume GET /api/content/{id}. Muestra watchProviders o placeholder neutro. Botones: Guardar, No me interesa, Compartir. | frontend/src/tests/DetailSheet.test.jsx — abre sin destruir stack, muestra placeholder si no hay watchProviders, botón Guardar dispara POST /api/collections. | *INPUT → GET /api/content/{id} (Héctor), POST /api/collections (Christian), apertura desde ContentCard (Edgar C.).*  *OUTPUT → Guardar alimenta biblioteca de Diana.* | **Media** |
| **Macías Mayen, Juan Carlos** | **Bajo** | **Épica 1–2** | HU1.2 — Onboarding: barra de progreso, 5-10 tarjetas, selección de géneros  HU2.1 — Tab Selector Movies/Books con estado global active\_feed | UI — Onboarding + Tab Selector | Onboarding: barra de progreso, máx 10 tarjetas saltables, guarda prefs.genres y cold\_start\_done=true. Tab Selector: indicador visual activo, estado global active\_feed independiente. | frontend/src/tests/Onboarding.test.jsx — guarda prefs correctamente, marca cold\_start\_done, permite saltar tarjetas.  frontend/src/tests/TabSelector.test.jsx — cambia active\_feed sin perder estado del feed anterior. | *INPUT → Andrés (auth + guardar prefs), Manuel (content para tarjetas).*  *OUTPUT → prefs.genres para Luis (feed filtrado). Tab Selector para Monserrat.* | **Media** |
| **Álvarez Varela, Diana** | **Bajo** | **Épica 5** | HU5.1 — Biblioteca: colecciones Películas/Libros, listas personalizadas, nota personal por ítem | UI — Biblioteca y colecciones | Vista de biblioteca en 1 paso desde barra inferior. Filtros por type y listName. Cada ítem: cover, title, savedAt, personalNote editable. Crear nueva lista personalizada. | frontend/src/tests/Library.test.jsx — filtros type y listName funcionan, edición de nota dispara PATCH, eliminación dispara DELETE. | *INPUT → GET /api/collections (Héctor), PATCH/DELETE collections (Christian), auth (Andrés).*  *OUTPUT → Vista final de valor para el usuario.* | **Media** |
| **Pacheco Castillo, Germán** | **Bajo** | **Infra / §12** | PRD §12 — CI/CD: GitHub Actions → Firebase deploy  PRD §9 — PWA: Service Worker offline | CI/CD + Firebase Hosting + Service Worker PWA | GitHub Action: push a main → npm test → npm run build → firebase deploy. Service Worker: cachea shell PWA + últimos 10 ítems offline. "Hello world" desplegado antes del sábado 7. | El pipeline de CI corre automáticamente todos los tests (frontend + api + ingest + firestore) en cada PR antes de permitir el merge. Sin tests en verde = merge bloqueado. | *INPUT → Estructura base del frontend (Andrés), todos los tests escritos.*  *OUTPUT → URL pública Firebase Hosting + pipeline de tests automático para todo el equipo.* | **Media** |
| **Chaparro Ximello, Ulises** | **Bajo** | **QA / §10** | PRD §10 — Eventos de analítica: 7 eventos verificados  PRD §8 — Contratos de API verificados | Testing QA + documentación de APIs + ROADMAP.md | Suite de pruebas manuales: happy path + casos borde (feed agotado, sin watchProviders, contenido ya swipeado). Colección Postman/Bruno 7 endpoints. Verificar 7 eventos §10. Coordinar ejecución de todos los tests antes de la entrega final. ROADMAP.md. | Ulises ejecuta todos los tests de todos los módulos antes de la entrega del 16 jun y documenta resultados en docs/api-collection.json. Es el responsable de que ningún test falle en main. | *INPUT → APIs listas (Luis, Héctor, Christian), app desplegada (Germán), todos los tests escritos por cada responsable.*  *OUTPUT → ROADMAP.md + suite QA + confirmación de tests en verde.* | **Baja** |

*\* Filas en lila = camino crítico (nivel Medio). Edgar Coronel = integrante con módulo UI. Edgar González (PM) coordina PRs sin asignación de feature.*

## Contratos de API — PRD §8 (referencia rápida)

*Luis implementa feed/swipe. Héctor implementa GET content y GET collections. Christian implementa POST/PATCH/DELETE collections. Todos usan middleware auth.js de Andrés.*

| **Método** | **Endpoint** | **Input** | **Output** | **HTTP** | **Responsable** |
| --- | --- | --- | --- | --- | --- |
| **GET** | **/api/feed** | userId, type, cursor | [{contentId,title,cover,genres,rating,synopsis}] | **200** | Luis |
| **POST** | **/api/swipe** | {userId,contentId,type,action,timestamp} | — | **204** | Luis |
| **GET** | **/api/content/{id}** | contentId en path | objeto content completo + watchProviders | **200** | Héctor |
| **GET** | **/api/collections** | userId, ?type, ?listName | [{collections}] | **200** | Héctor |
| **POST** | **/api/collections** | {userId,contentId,listName,personalNote} | — | **201** | Christian |
| **PATCH** | **/api/collections/{id}** | {personalNote,listName} | — | **200** | Christian |
| **DELETE** | **/api/collections/{id}** | — | — | **204** | Christian |

# B. Árbol de carpetas GitHub

*Cada módulo con código tiene su carpeta tests/ al mismo nivel. Los tests viven junto al código que prueban — convención estándar de repositorios profesionales. Germán los ejecuta todos en el pipeline de CI en cada PR.*

recos-BnM/

├── frontend/ ← Firebase Hosting / PWA (React+Vite)

│ ├── public/sw.js ← Service Worker (Germán)

│ └── src/

│ ├── components/

│ │ ├── ContentCard/ ← HU3.2 (Edgar C.)

│ │ ├── SwipeDeck/ ← HU3.2 (Monserrat)

│ │ ├── TabSelector/ ← HU2.1 (Juan Carlos)

│ │ ├── DetailSheet/ ← HU4.1 (Marina)

│ │ ├── Onboarding/ ← HU1.2 (Juan Carlos)

│ │ └── FilterBar/ ← HU2.1 (Juan Carlos)

│ ├── pages/

│ │ ├── Home.jsx ← feed principal

│ │ ├── Detail.jsx

│ │ └── Library.jsx ← HU5.1 (Diana)

│ ├── hooks/ ← useAuth, useSwipe, useFeed

│ ├── services/api.js ← llamadas a Cloud Run API

│ ├── store/ ← estado global active\_feed

│ ├── firebase.js

│ └── tests/ ← pruebas de componentes (Vitest)

│ ├── ContentCard.test.jsx ← (Edgar C.)

│ ├── SwipeDeck.test.jsx ← (Monserrat)

│ ├── TabSelector.test.jsx ← (Juan Carlos)

│ ├── DetailSheet.test.jsx ← (Marina)

│ ├── Onboarding.test.jsx ← (Juan Carlos)

│ └── Library.test.jsx ← (Diana)

│

├── api/ ← API principal (Cloud Run)

│ └── src/

│ ├── routes/

│ │ ├── feed.js ← GET /api/feed (Luis)

│ │ ├── swipes.js ← POST /api/swipe (Luis)

│ │ ├── content.js ← GET /api/content/{id} (Héctor)

│ │ └── collections.js ← GET (Héctor) + POST/PATCH/DELETE (Christian)

│ ├── middleware/auth.js ← Firebase ID Token (Andrés)

│ ├── services/scoring.js ← score normalizado HU3.1 (Manuel)

│ ├── app.js

│ └── tests/ ← pruebas de endpoints (Jest)

│ ├── auth.test.js ← (Andrés) — 401 sin token, 200 con token válido

│ ├── feed.test.js ← (Luis) — score, exclusión swipes, paginación

│ ├── swipes.test.js ← (Luis) — registro correcto en Firestore

│ ├── content.test.js ← (Héctor) — campos completos, placeholder watchProviders

│ └── collections.test.js ← (Héctor + Christian) — CRUD completo

│

├── ingest/ ← Cloud Run job separado (Manuel)

│ ├── src/

│ │ ├── tmdb\_ingest.py

│ │ └── books\_ingest.py

│ ├── tests/ ← pruebas del job de ingesta (pytest)

│ │ ├── test\_tmdb\_ingest.py ← campos requeridos, paginación, no duplicados

│ │ └── test\_scoring.py ← fórmula score con casos conocidos

│ └── Dockerfile

│

├── firestore/ ← Schema y reglas (Israel)

│ ├── firestore.rules ← reglas PRD §9

│ ├── firestore.indexes.json ← índice compuesto type+genres

│ ├── SCHEMA.md

│ └── tests/ ← @firebase/rules-unit-testing (Israel)

│ ├── users.test.js ← solo el propio userId puede leer/escribir

│ ├── swipes.test.js ← userId debe coincidir con auth.uid

│ ├── collections.test.js ← acceso solo al dueño

│ └── content.test.js ← solo lectura para clientes autenticados

│

├── .github/workflows/

│ ├── deploy-hosting.yml ← CI: test → build → deploy hosting (Germán)

│ └── deploy-api.yml ← CI: test → build → deploy Cloud Run

│

├── docs/

│ ├── PRD\_Recos-BnM.md

│ ├── api-collection.json ← Postman/Bruno 7 endpoints (Ulises)

│ └── ROADMAP.md ← 3 fases PRD §13 (Ulises)

│

└── README.md ← instrucciones despliegue + cómo correr tests (Germán)

# C. Flujo de trabajo Git

*El flujo ahora tiene 7 pasos. Los tests son parte del ciclo de desarrollo, no un paso final. CI bloquea automáticamente cualquier PR con tests en rojo — nadie puede hacer merge de código roto.*

| **Paso** | **Detalle** |
| --- | --- |
| **1. Crear rama** | Convención: feature/<epica>/<nombre-corto>  Ejemplos:  feature/auth/andres  feature/ingest/manuel  feature/firestore-schema/israel  feature/api-feed/luis  feature/api-content/hector  feature/api-collections/christian  feature/content-card/edgar  feature/swipe-deck/monserrat  feature/detail-sheet/marina  feature/onboarding/juancarlos  feature/library-ui/diana  feature/cicd/german  feature/qa-docs/ulises  Hotfix (solo Edgar PM o profesor): hotfix/<descripcion> |
| **2. Desarrollo + Tests** | Escribir el código Y los tests en la misma rama, al mismo tiempo.  El test va en la carpeta tests/ del módulo correspondiente (ver árbol §B).  Convención de commits:  feat(feed): implementar GET /api/feed con score normalizado HU3.1  test(feed): agregar tests de score y exclusión de swipes  feat(auth): agregar Google Sign-In HU1.1  test(auth): verificar rechazo de token inválido  fix(swipe): corregir timestamp en POST /api/swipe  Regla: nunca hacer push directo a main. |
| **3. Tests locales obligatorios antes del PR** | Antes de abrir el PR, correr los tests localmente y confirmar que pasan:  Frontend (Vitest): npm run test  API (Jest): npm run test  Ingest (pytest): pytest ingest/tests/  Firestore (Emulator): npm run test:rules  Si los tests no pasan localmente → NO abrir el PR todavía.  El PR con tests en rojo no se revisa. |
| **4. Abrir PR (checklist mínimo)** | Referenciar HU: ej. "Implementa HU3.2"  ¿Qué hace este PR? — 2-3 líneas  Cómo probarlo — pasos exactos + credencial de prueba  Screenshot o video (UI) / respuesta Postman (API)  Tests incluidos — confirmar que los tests están en la rama y pasan  .env.example actualizado si agrega variables  Dependencias — indicar si requiere otro PR mergeado primero  Sin tests escritos o sin screenshot/Postman → PR no se revisa. |
| **5. CI automático (GitHub Actions)** | Al abrir o actualizar el PR, GitHub Actions corre automáticamente:  1. npm test (frontend — Vitest)  2. npm test (api — Jest)  3. pytest ingest/tests/ (Python)  4. npm run test:rules (Firestore Emulator)  Si algún test falla en CI → el PR queda bloqueado automáticamente.  No se puede hacer merge hasta que todos los tests estén en verde.  Esto lo configura Germán en deploy-hosting.yml y deploy-api.yml. |
| **6. Revisión de par** | Al menos 1 compañero distinto al autor debe aprobar antes de que Edgar PM o el profesor hagan merge.  El reviewer verifica: código funciona, tests tienen sentido, checklist completo.  GitHub bloquea el botón de merge hasta que se cumpla la aprobación + CI en verde. |
| **7. Merge** | Solo Edgar PM o el profesor.  Estrategia: Squash and merge — historial limpio en main.  Borrar la rama después del merge. |

### Configuración Branch Protection — main

* Settings → Branches → Branch protection rules → main
* ✓ Require pull request reviews before merging (1 reviewer mínimo)
* ✓ Require status checks to pass before merging (CI tests en verde)
* ✓ Require review from Code Owners
* ✓ Dismiss stale pull request approvals when new commits are pushed
* ✓ Restrict who can push: solo Edgar PM y el profesor

# D. Dependencias, Inputs y Outputs por proceso

*Los outputs ahora incluyen los archivos de tests en verde como entregable obligatorio de cada proceso. El pipeline de CI de Germán es consumidor transversal de todos los outputs.*

| **Proceso / Responsable** | **Inputs (qué necesita)** | **Outputs (qué produce + tests)** | **Consumidores del output** | **Prioridad** |
| --- | --- | --- | --- | --- |
| **Firebase Auth (Andrés — Medio)** | — Credenciales usuario (email/password o token Google OAuth)  — SDK Firebase en frontend | — Firebase ID Token (JWT) para el frontend  — Documento users/{userId} en Firestore  — middleware auth.js verificado  — api/src/tests/auth.test.js en verde | *Todos los endpoints de API usan auth.js.*  *Israel (reglas Firestore usan uid).*  *Juan Carlos (guarda prefs en users).* | **CRÍTICA** |
| **Schema Firestore (Israel — Medio)** | — PRD §6 (modelo de datos)  — PRD §9 (reglas de seguridad)  — Campos de users confirmados con Andrés | — 4 colecciones activas en Firestore  — firestore.rules desplegado  — Índice compuesto (type + genres)  — SCHEMA.md en repo  — Firebase Emulator configurado  — firestore/tests/\*.test.js en verde | *Manuel (escribe en content).*  *Luis (lee content, escribe swipes).*  *Héctor (lee content, colecciones).*  *Christian (escribe collections).*  *Diana (lee collections).* | **CRÍTICA** |
| **Ingesta de catálogo (Manuel — Medio)** | — API key TMDB y Google Books (env vars)  — Schema content de Israel  — Cloud Scheduler trigger (cron 0 4 \* \* \*) | — ≥500 docs en content con todos los campos del PRD §6  — scoring.js con fórmula normalizada exportable  — ingest/tests/test\_tmdb\_ingest.py en verde  — ingest/tests/test\_scoring.py en verde | *Luis (GET /api/feed usa content + scoring.js).*  *Héctor (GET /api/content/{id} lee content).*  *Juan Carlos (onboarding muestra tarjetas de content).* | **CRÍTICA** |
| **GET /api/feed POST /api/swipe (Luis — Bajo)** | — auth.js (Andrés)  — scoring.js (Manuel)  — Firestore: content, swipes (Israel)  — Query: userId, type, cursor | — GET: array ordenado por score, sin swipes previos  — POST: HTTP 204 + doc en swipes  — api/src/tests/feed.test.js en verde  — api/src/tests/swipes.test.js en verde | *Monserrat (SwipeDeck consume ambos endpoints).*  *Diana (swipes like generan ítems en biblioteca).* | **Alta** |
| **GET /api/content/{id} GET /api/collections (Héctor — Bajo)** | — auth.js (Andrés)  — content en Firestore (Manuel)  — TMDB Watch Providers API  — collections en Firestore (Israel) | — Objeto content completo + watchProviders o placeholder  — Array [{collections}] filtrado  — api/src/tests/content.test.js en verde  — api/src/tests/collections.test.js (lectura) en verde | *Marina (DetailSheet → GET /api/content/{id}).*  *Diana (biblioteca → GET /api/collections).* | **Alta** |
| **CRUD /api/collections (Christian — Bajo)** | — auth.js (Andrés)  — schema collections (Israel)  — Patrón de API de Luis  — POST: {userId, contentId, listName, personalNote} | — POST: HTTP 201 + doc en collections  — PATCH: HTTP 200  — DELETE: HTTP 204  — api/src/tests/collections.test.js (escritura) en verde | *Marina (Guardar → POST collections).*  *Diana (editar nota → PATCH, borrar → DELETE).* | **Media** |
| **ContentCard (Edgar C. — Bajo)** | — Rutas protegidas (Andrés)  — Props: {cover, title, genres, rating, synopsis} | — Componente <ContentCard /> renderizado  — Mock data mientras Luis termina API  — frontend/src/tests/ContentCard.test.jsx en verde | *Monserrat (SwipeDeck apila ContentCards).*  *Marina (DetailSheet usa los mismos datos).* | **Media** |
| **SwipeDeck (Monserrat — Bajo)** | — ContentCard (Edgar C.)  — GET /api/feed y POST /api/swipe (Luis)  — auth token (Andrés) | — Gestos swipe ≈60 FPS  — Pre-fetch al quedar 5 tarjetas  — POST /api/swipe no bloqueante  — frontend/src/tests/SwipeDeck.test.jsx en verde | *Juan Carlos (TabSelector activa feed correcto).*  *Marina (toque abre DetailSheet).* | **Alta** |
| **DetailSheet (Marina — Bajo)** | — GET /api/content/{id} (Héctor)  — POST /api/collections (Christian)  — POST /api/swipe dislike (Luis)  — Apertura desde ContentCard (Edgar C.) | — Modal slide-up sin destruir stack  — Acciones: Guardar, No me interesa, Compartir  — frontend/src/tests/DetailSheet.test.jsx en verde | *Diana (Guardar alimenta biblioteca).*  *Monserrat (No me interesa registra dislike).* | **Media** |
| **Onboarding + Tab Selector (Juan Carlos — Bajo)** | — Andrés (auth + guardar prefs en users)  — Manuel (content para tarjetas de onboarding) | — users.prefs.genres y cold\_start\_done=true en Firestore  — Tab Selector con estado global active\_feed  — frontend/src/tests/Onboarding.test.jsx en verde  — frontend/src/tests/TabSelector.test.jsx en verde | *Luis (GET /api/feed filtra por prefs.genres).*  *Monserrat (Tab Selector controla SwipeDeck).* | **Media** |
| **Biblioteca UI (Diana — Bajo)** | — GET /api/collections (Héctor)  — PATCH/DELETE collections (Christian)  — Andrés (auth)  — Swipes de Monserrat generan ítems | — Vista de biblioteca en 1 paso  — Filtros por type y listName  — Edición de nota inline  — frontend/src/tests/Library.test.jsx en verde | *Usuario final. Valor visible del flujo completo.* | **Media** |
| **CI/CD + PWA (Germán — Bajo)** | — Código mergeado en main  — FIREBASE\_TOKEN como GitHub Secret  — Todos los tests escritos por cada responsable | — GitHub Action: corre TODOS los tests en cada PR  — Deploy automático solo si tests en verde  — Service Worker: shell PWA + últimos 10 ítems offline  — URL pública Firebase Hosting para demo del Dr. | *Todo el equipo (pipeline bloquea merge si tests fallan).*  *Dr. para la demo del martes 10.* | **Alta** |
| **QA + Docs + ROADMAP (Ulises — Bajo)** | — APIs de Luis, Héctor y Christian listas  — App desplegada (Germán)  — Todos los tests escritos por cada responsable  — PRD §8, §10, §13 | — Suite de pruebas manuales (happy path + casos borde)  — Colección Postman/Bruno 7 endpoints  — 7 eventos de analítica §10 verificados  — Confirmación de que todos los tests pasan en main  — docs/ROADMAP.md con 3 fases listo para el Dr. | *Dr. (ROADMAP.md en sesión del martes 10).*  *Edgar PM (suite QA para entrega final del 16).* | **Media** |

# E. Calendario semanal — Jueves 5 a Lunes 16 jun

*Los tests se escriben en paralelo con el código, no al final. El jueves cada integrante crea su archivo de test vacío para hacer visible la deuda desde el día 1.*

| **Día** | **Hito** | **Qué ocurre / debe estar listo** |
| --- | --- | --- |
| **Jue 4 jun** | **Kickoff de sprint** | Reunión virtual 1h. Edgar PM revisa repo, branches y asignaciones.  Andrés e Israel arrancan hoy — camino crítico absoluto.  Germán configura GitHub Actions y despliega "hello world" en Firebase Hosting.  Todos crean su rama y el archivo de tests vacío (placeholder) antes de las 10pm.  Ulises publica el checklist de PR en el repo. |
| **Vie 5 jun** | **Primer commit de todos** | Primer commit de cada integrante: código + archivo de test (aunque esté vacío).  Edgar PM revisa GitHub a las 8pm: lista de ramas activas.  Fin del día esperado: Auth local (Andrés), colecciones Firestore activas (Israel), estructura de carpetas creada (todos).  Sin commit = ping directo. |
| **Sáb–Dom 6–7 jun** | **CHECKPOINT 1 Sáb 7, 10am**  **CHECKPOINT #2**  **Sab 7, 15 hrs.** | Comunicar bloqueos antes del sábado 9am. ¿Qué debe estar listo?  — Auth: login local + auth.test.js con al menos 1 test en verde — Andrés  — Firestore: colecciones + reglas + firestore/tests/\*.test.js corriendo — Israel  — Ingest: ≥100 películas en content + test\_scoring.py en verde — Manuel  — API: esqueleto de rutas + middleware + tests placeholder — Luis, Héctor, Christian  — UI: ContentCard con mock + ContentCard.test.jsx en verde — Edgar C.  — CI/CD: pipeline corre los tests automáticamente en cada PR — Germán |
| **Lun 9 jun** | **Integración + PRs** | Todos con PR abierto. Tests en verde localmente antes de abrir el PR.  Merge prioritario: Auth → Schema → Ingest → APIs (desbloquean al resto).  CI bloquea automáticamente los PRs con tests en rojo.  Reunión express 30 min para bloqueos.  Ulises redacta ROADMAP.md y colección Postman. |
| **Mar 10 jun** | **SESIÓN CON EL DR.** | Demo en Firebase Hosting (URL pública):  — Login con Google funcionando  — Pantalla de swipe con datos reales de TMDB  — GET /api/feed y POST /api/swipe respondiendo en Cloud Run  — Tests pasando en el pipeline de CI  — docs/ROADMAP.md con 3 fases en el repo  — Presentar roadmap de fases al Dr. |
| **Mié–Vie 11–13 jun** | **Sprint de pulido** | PRs restantes mergeados. CI en verde para todos.  Ulises: ejecuta suite completa de pruebas manuales + verifica 7 eventos de analítica §10.  Diana, Juan Carlos, Marina: cierran módulos y tests.  Germán: CI/CD estable, README con instrucciones de cómo correr tests.  Reunión presencial si es posible. |
| **Lun 16 jun** | **ENTREGA FINAL** | App desplegada. Todos los PRs mergeados. Todos los tests en verde en main.  7 eventos de analítica §10 verificados por Ulises.  Suite de pruebas manuales entregada. README actualizado.  Ulises confirma que ningún test falla en el branch main. Branch main limpio. |

# F. Tabla de riesgos de entrega

*Se agregó el riesgo 2 (CI no configurado a tiempo) y el riesgo 4 (tests no escritos). Ahora son 4 riesgos ordenados por severidad.*

| **#** | **Nivel** | **Riesgo** | **Probabilidad** | **Impacto** | **Mitigación esta semana** |
| --- | --- | --- | --- | --- | --- |
| **1** | **CRÍTICO** | **Bloqueo en Auth o Schema: toda la cadena depende de Andrés e Israel** | Alta | Si Auth no está el sábado, nadie puede integrar ni correr sus tests de API. Si Schema no está, las pruebas de Firestore no pueden correr. | Manuel (Medio) es backup de Andrés en Auth. Israel tiene nivel Medio. Edgar PM hace pair coding el jueves noche si es necesario. Usar Firebase Emulator para desbloquear tests locales mientras se resuelve en staging. |
| **2** | **ALTO** | **Pipeline de CI no configurado a tiempo: tests no corren automáticamente en PRs** | Media-Alta | Sin CI, los tests dependen de la disciplina individual. PRs con tests en rojo pueden mergearse accidentalmente, rompiendo main antes de la demo del Dr. | Germán configura el GitHub Action el jueves mismo con un test dummy que siempre pasa, para validar el pipeline antes de que llegue código real. Prioridad: CI funcionando antes del viernes. |
| **3** | **ALTO** | **Despliegue GCP nunca probado: Cloud Run + Firebase Hosting** | Media-Alta | Llegar al martes 10 con tests en verde localmente pero sin URL pública para el Dr. | Germán despliega "hello world" antes del sábado 7. El pipeline de CI debe correr tests Y hacer deploy. No esperar a que el código esté completo para validar el despliegue. |
| **4** | **MEDIO** | **10 integrantes nivel Bajo no escriben los tests de su módulo** | Alta | Tests faltantes = CI no puede bloquear código roto. Ulises no puede verificar cobertura mínima para la entrega del 16. | El checklist de PR incluye "tests escritos y en verde" como requisito bloqueante. Sin tests = PR no se revisa. Cada integrante crea el archivo de test vacío el jueves mismo para visibilizar la deuda desde el día 1. |

# G. Roadmap por fases — PRD §13 (entregable para el Dr.)

*Se agregó columna "Estrategia de tests" por fase. En Fase 1 los tests son unitarios e integración. En Fases 2 y 3 evolucionan hacia pruebas de modelos ML y pagos.*

| **Fase** | **Plazo** | **Épicas** | **Historias de usuario** | **Infraestructura GCP** | **Estrategia de tests** | **Fuera de alcance** |
| --- | --- | --- | --- | --- | --- | --- |
| **Fase 1 MVP** |  | Épicas 1–5  Popularidad + contenido (sin ML) | HU1.1 Registro Email/Google  HU1.2 Calibración por swipe  HU2.1 Tab selector Movies/Books  HU3.1 Algoritmo feed score normalizado  HU3.2 Feed swipe + precarga  HU4.1 Vista detalle + watchProviders  HU5.1 Colecciones y listas con notas | Firebase Auth · Cloud Run (API + ingest)  Firestore · Firebase Hosting (PWA)  TMDB API · Google Books  TMDB Watch Providers · Cloud Scheduler | Vitest (frontend) · Jest (API) · pytest (ingest) · @firebase/rules-unit-testing (Firestore)  CI/CD con GitHub Actions: tests automáticos en cada PR | *ML, collaborative filtering, notificaciones push, pagos, app nativa iOS/Android* |
| **Fase 2 Afinidad** |  | Épicas 6–8  Señal histórica + social | HU6.1 Recomendación por afinidad histórica (similaridad coseno sobre géneros con mayor ratio de like)  HU7.1 Listas compartibles con link público  HU8.1 Notificaciones push (Firebase Cloud Messaging) | Firebase Cloud Messaging  Cloud Functions (lógica de afinidad)  BigQuery básico | Tests de integración para el algoritmo de afinidad.  Tests de Cloud Functions.  Pruebas de notificaciones en dispositivos reales. | *ML completo, monetización, streaming real-time* |
| **Fase 3 ML + Monetización** |  | Épicas 9–11  Personalización ML + monetización | HU9.1 Modelo ML (Vertex AI / Recommendations AI)  HU10.1 Streaming verificado por región (TMDB Watch Providers real-time)  HU11.1 Monetización: plan premium, contenido patrocinado | Vertex AI Pipelines · BigQuery  TMDB Watch Providers real-time  Stripe o similar | Tests de calidad del modelo ML (precisión, recall).  Tests de integración con pasarela de pagos en sandbox.  Pruebas de disponibilidad de streaming por región. | *App nativa iOS/Android (fuera de alcance permanente)* |

*North Star Metric (PRD §2): Swipes calificados por usuario activo semanal. Meta MVP: ≥60% completan onboarding y ≥20 swipes en sesión 1.*