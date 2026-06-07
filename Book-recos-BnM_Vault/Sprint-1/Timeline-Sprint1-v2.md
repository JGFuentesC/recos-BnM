# Timeline Sprint 1 — v2.0
**Actualizado: 2026-06-06 | PM: Edgar Coronel**

> Objetivo: MVP funcional con dos pruebas de concepto en GCP.
> - **PoC 1:** Viernes 12 de junio — flujo básico desplegado en Firebase Hosting
> - **PoC 2 / Entrega final:** Lunes 15 de junio — MVP completo

---

## Vista de calendario

```
JUN   SAT 7     SUN 8     MON 9     TUE 10    WED 11    THU 12    FRI 12
      ─────────────────────────────────────────────────────────────────
      🔴 HOTFIX  🔴 HOTFIX  🟡 WAVE 2  🟡 WAVE 2  🟡 WAVE 2  🔗 INTEGR  🎯 PoC 1
      Israel     Andrés     Luis       Luis       Monserrat  Tests      DEMO
      Manuel     Manuel     Héctor     Héctor     Marina     end-to-end GCP
                 Germán     Christian  Christian
                 Edgar      JC         Germán
                            Edgar      deploy

JUN   SAT 13    SUN 14    MON 15
      ─────────────────────────
      🟢 FIX     🟢 FIX     🎯 PoC 2
      Diana      Ulises     ENTREGA
      Monserrat  QA         FINAL
      Marina     Docs
```

---

## Detalle por día

### 🔴 Sábado 7 de junio — Hotfixes Wave 0 + inicio Wave 1

> Meta del día: cerrar los errores bloqueantes de Israel y arrancar Andrés.

| Persona | Tarea | ¿Independiente? | Entregable del día |
|---|---|---|---|
| **Israel** | Corrección 1: `firestore.indexes.json` con los 2 índices | ✅ Sí — nadie lo bloquea | JSON con índices completos |
| **Israel** | Corrección 2: `firebase.json` con 4 emuladores | ✅ Sí | firebase.json con auth + hosting |
| **Israel** | Corrección 3: `SCHEMA.md` completo con nombres correctos del PRD | ✅ Sí | Schema con cover, synopsis, watchProviders, prefs, contentType |
| **Andrés** | Crear frontend React (Vite) + `firebase/config.js` + `AuthContext` | ✅ Sí (puede mockear emulador) | `npm run dev` levanta sin errores |
| **Edgar** | Componente `<ContentCard />` con datos mock | ✅ Sí — no necesita a nadie | ContentCard renderiza en 375px |
| **Germán** | GitHub Actions workflow + hello world HTML | ✅ Sí — puede hacer deploy sin auth real | Workflow `.yml` creado |

---

### 🔴 Domingo 8 de junio — Hotfixes Wave 1 completos

> Meta del día: Andrés y Manuel terminan. El equipo de Wave 2 puede arrancar el lunes.

| Persona | Tarea | ¿Independiente? | Entregable del día |
|---|---|---|---|
| **Andrés** | `Login.jsx`, `Register.jsx`, `ProtectedRoute`, `App.jsx` (rutas pre-registradas), `auth.js` middleware, `app.js` scaffold | ⚠️ Necesita schema de Israel (Sáb) | PR con todo — el equipo debe tener `auth.js` el domingo por la noche |
| **Manuel** | Fix `models.py` (cover/synopsis/watchProviders) + actualizar tests + re-correr ingest | ⚠️ Necesita SCHEMA.md de Israel (Sáb) | 550 docs en Firestore con nombres correctos |
| **Manuel** | Fix `scoring.js` — copiar a `backend/src/services/` + alias `scoreCandidates` | ✅ Sí | `scoreCandidates` importable desde backend/ |
| **Germán** | "Hello World" React desplegado en Firebase Hosting | ⚠️ Necesita scaffold de Andrés | URL pública de Firebase Hosting compartida con el equipo |
| **Israel** | Tests de seguridad Firestore (`*.test.js`) | ✅ Sí | Al menos `users.test.js` y `content.test.js` con tests reales |

**🔔 Gate de domingo por la noche:**
> Andrés hace PR merge → notifica al equipo: *"auth.js disponible, app.js con rutas, pueden continuar"*

---

### 🟡 Lunes 9 de junio — Wave 2 arranca (todos en paralelo)

> Meta del día: backend APIs iniciadas, frontend de onboarding iniciado, CI funcionando.

| Persona | Tarea | Depende de | Entregable del día |
|---|---|---|---|
| **Luis** | `GET /api/feed` con scoring y paginación | Andrés (auth.js ✅), Manuel (scoring.js ✅) | Endpoint funciona contra emulador |
| **Luis** | `POST /api/swipe` → 204 | Andrés (auth.js ✅), Israel (schema swipes ✅) | Endpoint funciona contra emulador |
| **Héctor** | `GET /api/content/{id}` con watchProviders | Andrés (auth.js ✅), Manuel (content ✅) | Endpoint funciona con mock o emulador |
| **Christian** | `GET /api/collections` + `POST` + `PATCH` + `DELETE` | Andrés (auth.js ✅), Israel (schema ✅) | Al menos POST y GET funcionando |
| **Juan Carlos** | Onboarding — paso 1 (géneros) y paso 2 (swipe de calibración) | Andrés (auth ✅) | Componente renderiza sin errores |
| **Germán** | CI corre tests en cada PR + URL pública compartida | Andrés (scaffold ✅) | Pipeline verde en GitHub Actions |

---

### 🟡 Martes 10 de junio — Wave 2 cierra backend + UI avanza

> Meta del día: los 5 endpoints del backend deben estar listos con tests.

| Persona | Tarea | Depende de | Entregable del día |
|---|---|---|---|
| **Luis** | Tests `feed.test.js` y `swipe.test.js` + PR | — | Tests en verde en CI |
| **Héctor** | PR con `content.js` + tests | — | Tests en verde en CI |
| **Christian** | PATCH, DELETE + todos los tests | — | CRUD completo con tests |
| **Juan Carlos** | TabSelector + FeedContext + Onboarding paso 3 | Andrés (auth ✅) | `useFeed()` exportado, cold_start_done guardado |
| **Edgar** | `ContentCard` con animación + `MockFeed.jsx` | — | Componente standalone listo para Monserrat |
| **Germán** | `sw.js` Service Worker + `manifest.json` | Andrés (main.jsx registro ✅) | PWA instalable en el hello world |

---

### 🟡 Miércoles 11 de junio — Wave 2 completa + Wave 3 arranca

> Meta del día: todos los entregables de Wave 2 mergeados. Monserrat y Marina pueden arrancar.

| Persona | Tarea | Depende de | Entregable del día |
|---|---|---|---|
| **Monserrat** | `<SwipeDeck />` — gestos, pre-fetch, fire-and-forget swipe | ContentCard (Edgar ✅), /api/feed (Luis ✅) | SwipeDeck con mocks funcionando |
| **Marina** | `<DetailSheet />` — slide-up, 3 botones, watchProviders | /api/content/{id} (Héctor ✅), /api/collections (Christian ✅) | DetailSheet con mocks funcionando |
| **Diana** | Empieza `Library.jsx` con mocks | Andrés (auth ✅) | Vista base con datos mock |
| **Ulises** | Crea colección Postman con los 7 endpoints (estructura) | — | `api-collection.json` con endpoints documentados |
| **Ulises** | Empieza `docs/ROADMAP.md` | — | Borrador con las 3 fases |

---

### 🔗 Jueves 12 de junio — Integración final antes de PoC 1

> Meta del día: integrar todo, probar el happy path completo, arreglar lo que falle.

| Persona | Tarea | Nota |
|---|---|---|
| **Monserrat** | Integrar `<SwipeDeck />` en `Feed.jsx` + integrar `<DetailSheet />` | Coordinar con Marina |
| **Marina** | `<DetailSheet />` integrado en SwipeDeck (vía Monserrat) | Verificar que no destruye el stack |
| **Juan Carlos** | Integrar `<TabSelector />` en `Feed.jsx` | Monserrat lo espera |
| **Germán** | Deploy completo (no solo hello world) — frontend + Cloud Run backend | URL lista para PoC 1 |
| **Todo el equipo** | Prueba del happy path: registro → onboarding → feed → swipe → detalle → guardar | Reportar bugs a PM |
| **Eduardo (PM)** | Verificar URL de Firebase Hosting, confirmar Cloud Run responde | Gate para PoC 1 |

---

### 🎯 Viernes 12 de junio — PoC 1 en GCP

**Objetivo de la demo:**

| # | Flujo a demostrar | Responsable de verificar |
|---|---|---|
| 1 | URL pública carga la app (Firebase Hosting) | Germán |
| 2 | Registro con Email nuevo → redirige a Onboarding | Andrés |
| 3 | Selección de géneros + swipe de calibración → guarda prefs | Juan Carlos |
| 4 | Feed con tarjetas de películas/libros reales (datos de TMDB) | Luis + Manuel |
| 5 | Swipe derecha = like, izquierda = dislike, avanza la tarjeta | Monserrat |
| 6 | Tap en tarjeta → DetailSheet con sinopsis completa + watchProviders | Marina + Héctor |
| 7 | Botón "Guardar" → toast de confirmación | Marina + Christian |

**Lo que puede faltar en PoC 1 (y está bien):**
- Biblioteca (Diana) — en progreso
- PWA offline completa (Germán) — funcional pero no demostrable en PoC
- Analítica / eventos (Ulises) — verificación posterior

---

### 🟢 Sábado 13 de junio — Post-PoC 1: fixes + features faltantes

> Trabajar sobre los bugs encontrados en PoC 1 + completar Diana y Ulises.

| Persona | Tarea | Nota |
|---|---|---|
| **Diana** | `Library.jsx` completa con `GET /api/collections` real + `CollectionItem` + nota editable | Reemplazar mocks con API real (Christian ya entregó) |
| **Diana** | `BottomNav.jsx` + conectar ruta `/library` | Coordinar con Andrés para integrar en layout |
| **Monserrat** | Fixes de bugs encontrados en PoC 1 (gestos, pre-fetch, estados) | Según feedback del Dr. |
| **Marina** | Fixes de DetailSheet según feedback | Share button, toasts |
| **Israel** | Completar tests de seguridad faltantes | `swipes.test.js` + `collections.test.js` |
| **Ulises** | Ejecutar happy path en app desplegada + documentar resultados | Usar URL de Germán |

---

### 🟢 Domingo 14 de junio — QA final + pulir detalles

> Meta del día: cero bugs bloqueantes. Ulises da el visto bueno.

| Persona | Tarea |
|---|---|
| **Ulises** | Suite de pruebas manuales completa (happy path + 6 casos borde) + verificar 7 eventos de analítica |
| **Ulises** | Completar `docs/ROADMAP.md` con las 3 fases del PRD §13 |
| **Ulises** | `docs/api-collection.json` con ejemplos de respuesta reales |
| **Germán** | Verificar Service Worker offline con los últimos 10 ítems de colección |
| **Todo el equipo** | DevLogs entregados en `Book-recos-BnM_Vault/DevLog/` |
| **Eduardo (PM)** | Review final de todos los PRs — confirmar que CI está en verde |

---

### 🎯 Lunes 15 de junio — PoC 2 / Entrega final

**Happy path completo a demostrar:**

| Paso | Acción | Sistema involucrado |
|---|---|---|
| 1 | Abrir URL pública → pantalla de login | Firebase Hosting + Andrés |
| 2 | Registrarse con Google (2 clics) | Firebase Auth + Andrés |
| 3 | Onboarding → seleccionar géneros → swipe 5 tarjetas → guardar prefs | Juan Carlos + Firestore |
| 4 | Feed de películas → swipe like/dislike a 60 FPS | Monserrat + Luis + Manuel |
| 5 | Cambiar a tab "Libros" → nuevo feed | Juan Carlos TabSelector |
| 6 | Tap en tarjeta → DetailSheet → ver watchProviders | Marina + Héctor |
| 7 | Guardar en "Para el finde" + nota personal | Marina + Christian |
| 8 | Ir a Biblioteca → ver ítem guardado + editar nota | Diana + Christian |
| 9 | Modo avión → app sigue mostrando shell + colección guardada | Germán (Service Worker) |

---

## Mapa de dependencias actualizado

```
Hoy (Vie 6)
│
├─[Sáb 7]─ Israel (fixes schema) ──────────────────────────────────┐
│                                                                    │
├─[Sáb 7]─ Edgar (ContentCard mocks) ──────────────────────────────┼──► [Mié 11] Monserrat (SwipeDeck)
│                                                                    │
├─[Sáb 7]─ Germán (CI setup) ──────────────────────────────────────┤
│                                                                    │
├─[Dom 8]─ Andrés (auth + frontend scaffold) ───────────────────────┤
│           │                                                        │
│           ├──► [Lun 9] Luis (feed + swipe APIs) ─────────────────►┤
│           ├──► [Lun 9] Héctor (content API) ──────────────────────►┤─► [Mié 11] Marina (DetailSheet)
│           ├──► [Lun 9] Christian (collections CRUD) ──────────────►┤
│           └──► [Lun 9] Juan Carlos (onboarding + TabSelector) ────►┘
│
├─[Dom 8]─ Manuel (fixes models + re-ingest) ──────────────────────►[Lun 9] Luis usa scoring
│
│                                              [Mié 11] Monserrat ──►[Vie 12] PoC 1
│                                              [Mié 11] Marina ─────►[Vie 12] PoC 1
│
│                                              [Sáb 13] Diana ──────►[Lun 15] PoC 2
│                                              [Dom 14] Ulises ──────►[Lun 15] PoC 2
```

---

## ¿Qué es independiente? (puede arrancar hoy/mañana)

| Persona | Por qué es independiente |
|---|---|
| **Israel** | Solo necesita el PRD §6 — que ya existe. Puede corregir su propio trabajo sin esperar a nadie. |
| **Edgar** | ContentCard trabaja con datos mock. No necesita la API ni auth real. |
| **Germán** | Puede armar el GitHub Actions workflow y hacer deploy de un hello world sin que exista el frontend real. |
| **Ulises** | Puede escribir la estructura de la colección Postman y el borrador del ROADMAP.md sin que las APIs estén listas. |

---

## ¿Qué es bloqueante para PoC 1 (Vie 12)?

Estas tareas deben estar mergeadas **antes del jueves 12 por la tarde**:

| Prioridad | Persona | Tarea | Gate |
|---|---|---|---|
| 🔴 1 | **Andrés** | Frontend scaffold + auth.js + app.js | Sin esto, Luis, Héctor, Christian, JC están bloqueados |
| 🔴 2 | **Israel** | SCHEMA.md correcto | Sin esto, Manuel no puede corregir y re-ingestear |
| 🔴 3 | **Manuel** | Fix field names + re-ingest | Sin datos correctos en Firestore, el feed está roto |
| 🟠 4 | **Germán** | URL pública de Firebase Hosting | Sin URL, no hay PoC 1 |
| 🟠 5 | **Luis** | GET /api/feed + POST /api/swipe | Sin feed, no hay demo de swipe |
| 🟠 6 | **Héctor** | GET /api/content/{id} | Sin este, DetailSheet no abre |
| 🟠 7 | **Christian** | POST /api/collections | Sin este, botón "Guardar" no funciona |
| 🟡 8 | **Juan Carlos** | Onboarding | Demostrable aunque sea con géneros hardcoded |
| 🟡 9 | **Monserrat** | SwipeDeck | Core de la demo |
| 🟡 10 | **Marina** | DetailSheet | Necesaria para demo completa |

---

## ¿Qué puede ir después de PoC 1 (fin de semana)?

Estas tareas **no son bloqueantes para PoC 1** y pueden completarse el sábado 13 o domingo 14:

| Persona | Tarea | Por qué puede esperar |
|---|---|---|
| **Diana** | Biblioteca completa | No es parte del flujo mínimo del PoC 1. Puede mostrar solo el botón "Guardar" funcionando. |
| **Ulises** | Suite de QA completa + ROADMAP.md | QA final va sobre el producto terminado, no sobre el PoC. |
| **Israel** | Tests de seguridad Firestore completos | Las reglas ya están correctas — los tests son validación, no funcionalidad. |
| **Germán** | Service Worker offline completo | PWA offline es feature para PoC 2, no para PoC 1. |
| **Todos** | DevLogs | Documentación — puede ir el fin de semana. |

---

## Checklist PM — gates antes de cada PoC

### Gate PoC 1 (verificar el jueves 12 antes de las 6pm)
- [ ] Firebase Hosting URL accesible (Germán)
- [ ] Cloud Run backend responde en `/api/health` (Andrés + Germán)
- [ ] `POST /api/swipe` devuelve 204 con token válido (Luis)
- [ ] `GET /api/feed` devuelve al menos 10 ítems (Luis + Manuel)
- [ ] `GET /api/content/{id}` devuelve watchProviders (Héctor)
- [ ] `POST /api/collections` devuelve 201 (Christian)
- [ ] App completa: registro → onboarding → feed → swipe → guardar (en emulador o staging)

### Gate PoC 2 / Entrega final (verificar el domingo 14)
- [ ] Todo el happy path del lunes 15 funciona en la URL pública
- [ ] Biblioteca muestra ítems guardados (Diana)
- [ ] Service Worker offline activo (Germán)
- [ ] `docs/ROADMAP.md` entregado (Ulises)
- [ ] `docs/api-collection.json` con 7 endpoints y ejemplos reales (Ulises)
- [ ] Todos los DevLogs en `Book-recos-BnM_Vault/DevLog/`
- [ ] CI en verde (todos los tests pasan en main)
